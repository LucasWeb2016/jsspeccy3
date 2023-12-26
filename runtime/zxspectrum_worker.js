import { FRAME_BUFFER_SIZE } from './constants.js';
import { SupportedMachines } from './machines.js';
import { TAPFile, TZXFile } from './tape.js';

import { spectrum48KeyboardMap } from './keyboardMaps/spectrum48.js';
import { spectrum128pKeyboardMap } from './keyboardMaps/spectrum128p.js';
import { spectrum128pesKeyboardMap } from './keyboardMaps/spectrum128pes.js';
import { spectrum128p2KeyboardMap } from './keyboardMaps/spectrum128p2.js';

let core = null;
let memory = null;
let memoryData = null;
let workerFrameData = null;
let registerPairs = null;
let tapePulses = null;
let logEntries = null;

let stopped = false;
let tape = null;
let tapeIsPlaying = false;

const supportedMachines = new SupportedMachines();
let currentKeyboardMap = null;

const loadCore = (baseUrl) => {
    WebAssembly.instantiateStreaming(
        fetch(new URL('js8bits-core.wasm', baseUrl), {})
    ).then(results => {
        core = results.instance.exports;
        // core.startLog();
        memory = core.memory;
        memoryData = new Uint8Array(memory.buffer);
        workerFrameData = memoryData.subarray(core.FRAME_BUFFER, FRAME_BUFFER_SIZE);
        registerPairs = new Uint16Array(core.memory.buffer, core.REGISTERS, 12);
        tapePulses = new Uint16Array(core.memory.buffer, core.TAPE_PULSES, core.TAPE_PULSES_LENGTH);
        logEntries = new Uint16Array(core.LOG_ENTRIES);
        // core.stopLog();


        postMessage({
            'message': 'ready',
        });
    });
}

const loadMemoryPage = (page, data) => {
    memoryData.set(data, core.MACHINE_MEMORY + page * 0x4000);
};

const loadSnapshot = (snapshot) => {
    core.setMachineType(snapshot.model);
    for (let page in snapshot.memoryPages) {
        loadMemoryPage(page, snapshot.memoryPages[page]);
    }
    ['AF', 'BC', 'DE', 'HL', 'AF_', 'BC_', 'DE_', 'HL_', 'IX', 'IY', 'SP', 'IR'].forEach(
        (r, i) => {
            registerPairs[i] = snapshot.registers[r];
        }
    )
    core.setPC(snapshot.registers.PC);
    core.setIFF1(snapshot.registers.iff1);
    core.setIFF2(snapshot.registers.iff2);
    core.setIM(snapshot.registers.im);
    core.setHalted(!!snapshot.halted);

    core.writePort(0x00fe, snapshot.ulaState.borderColour);
    if (snapshot.model != 48) {
        core.writePort(0x7ffd, snapshot.ulaState.pagingFlags);
    }

    core.setTStates(snapshot.tstates);
};

const trapTapeLoad = () => {
    if (!tape) return;
    const block = tape.getNextLoadableBlock();
    if (!block) return;

    /* get expected block type and load vs verify flag from AF' */
    const af_ = registerPairs[4];
    const expectedBlockType = af_ >> 8;
    const shouldLoad = af_ & 0x0001;  // LOAD rather than VERIFY
    let addr = registerPairs[8];  /* IX */
    const requestedLength = registerPairs[2];  /* DE */
    const actualBlockType = block[0];

    let success = true;
    if (expectedBlockType != actualBlockType) {
        success = false;
    } else {
        if (shouldLoad) {
            let offset = 1;
            let loadedBytes = 0;
            let checksum = actualBlockType;
            while (loadedBytes < requestedLength) {
                if (offset >= block.length) {
                    /* have run out of bytes to load */
                    success = false;
                    break;
                }
                const byte = block[offset++];
                loadedBytes++;
                core.poke(addr, byte);
                addr = (addr + 1) & 0xffff;
                checksum ^= byte;
            }

            // if loading is going right, we should still have a checksum byte left to read
            success &= (offset < block.length);
            if (success) {
                const expectedChecksum = block[offset];
                success = (checksum === expectedChecksum);
            }
        } else {
            // VERIFY. TODO: actually verify.
            success = true;
        }
    }

    if (success) {
        /* set carry to indicate success */
        registerPairs[0] |= 0x0001;
    } else {
        /* reset carry to indicate failure */
        registerPairs[0] &= 0xfffe;
    }
    core.setPC(0x05e2);  /* address at which to exit the tape trap */
}

onmessage = (e) => {
    switch (e.data.message) {
        case 'loadCore':
            loadCore(e.data.baseUrl);
            break;
        case 'runFrame':
            if (stopped) return;
            const frameBuffer = e.data.frameBuffer;
            const frameData = new Uint8Array(frameBuffer);

            let audioBufferLeft = null;
            let audioBufferRight = null;
            let audioLength = 0;
            if ('audioBufferLeft' in e.data) {
                audioBufferLeft = e.data.audioBufferLeft;
                audioBufferRight = e.data.audioBufferRight;
                audioLength = audioBufferLeft.byteLength / 4;
                core.setAudioSamplesPerFrame(audioLength);
            } else {
                core.setAudioSamplesPerFrame(0);
            }

            if (tape && tapeIsPlaying) {
                const tapePulseBufferTstateCount = core.getTapePulseBufferTstateCount();
                const tapePulseWriteIndex = core.getTapePulseWriteIndex();
                const [newTapePulseWriteIndex, tstatesGenerated, tapeFinished] = tape.pulseGenerator.emitPulses(
                    tapePulses, tapePulseWriteIndex, 80000 - tapePulseBufferTstateCount
                );
                core.setTapePulseBufferState(newTapePulseWriteIndex, tapePulseBufferTstateCount + tstatesGenerated);
                if (tapeFinished) {
                    tapeIsPlaying = false;
                    postMessage({
                        message: 'stoppedTape',
                    });
                }
            }

            let status = core.runFrame();
            while (status) {
                switch (status) {
                    case 1:
                        stopped = true;
                        throw ("Unrecognised opcode!");
                    case 2:
                        trapTapeLoad();
                        break;
                    default:
                        stopped = true;
                        throw ("runFrame returned unexpected result: " + status);
                }

                status = core.resumeFrame();
            }

            frameData.set(workerFrameData);
            if (audioLength) {
                const leftSource = new Float32Array(core.memory.buffer, core.AUDIO_BUFFER_LEFT, audioLength);
                const rightSource = new Float32Array(core.memory.buffer, core.AUDIO_BUFFER_RIGHT, audioLength);
                const leftData = new Float32Array(audioBufferLeft);
                const rightData = new Float32Array(audioBufferRight);
                leftData.set(leftSource);
                rightData.set(rightSource);
                postMessage({
                    message: 'frameCompleted',
                    frameBuffer,
                    audioBufferLeft,
                    audioBufferRight,
                }, [frameBuffer, audioBufferLeft, audioBufferRight]);
            } else {
                postMessage({
                    message: 'frameCompleted',
                    frameBuffer,
                }, [frameBuffer]);
            }
            break;
        case 'keyDown':
            // core.startLog();
            postMessage({
                message: 'keyDown received',
                id: Number(e.data.id),
                row: currentKeyboardMap[e.data.id]['row'],
                mask: currentKeyboardMap[e.data.id]['mask'],
            });
            core.keyDown(currentKeyboardMap[Number(e.data.id)]['row'], currentKeyboardMap[Number(e.data.id)]['mask']);
            break;
        case 'keyUp':
            postMessage({
                message: 'keyUp received',
                id: Number(e.data.id),
                row: currentKeyboardMap[e.data.id]['row'],
                mask: currentKeyboardMap[e.data.id]['mask'],
            });
            core.keyUp(currentKeyboardMap[Number(e.data.id)]['row'], currentKeyboardMap[Number(e.data.id)]['mask']);
            break;
        case 'setMachineType':
            core.setMachineType(e.data.type, e.data.frameCycleCount, e.data.mainScreenStartTstate, e.data.tstatesPerRow, e.data.borderTimeMask, e.data.buildContentionTable, e.data.betadiskEnabled, e.data.betadiskROMActive, e.data.pagingLocked, e.data.memoryPageReadMap, e.data.isPentagonBased);
            const machineKeyboard = supportedMachines.getList()[e.data.type]['tech']['keyboard'];
            if (machineKeyboard == 'spectrum128p2') {
                currentKeyboardMap = new spectrum128p2KeyboardMap().getKeyCodes();
            } else if (machineKeyboard == 'spectrum128pes') {
                currentKeyboardMap = new spectrum128pesKeyboardMap().getKeyCodes();
            } else if (machineKeyboard == 'spectrum128p') {
                currentKeyboardMap = new spectrum128pKeyboardMap().getKeyCodes();
            } else {
                currentKeyboardMap = new spectrum48KeyboardMap().getKeyCodes();
            }
            postMessage({
                message: 'machineSetupDone',
                keyboard: machineKeyboard
            });

            break;
        case 'reset':
            core.reset();
            break;
        case 'loadMemory':
            loadMemoryPage(e.data.page, e.data.data);
            break;
        case 'loadSnapshot':
            loadSnapshot(e.data.snapshot);
            postMessage({
                message: 'fileOpened',
                id: e.data.id,
                mediaType: 'snapshot',
            });
            break;
        case 'openTAPFile':
            tape = new TAPFile(e.data.data);
            tapeIsPlaying = false;
            postMessage({
                message: 'fileOpened',
                id: e.data.id,
                mediaType: 'tape',
            });
            break;
        case 'openTZXFile':
            tape = new TZXFile(e.data.data);
            tapeIsPlaying = false;
            postMessage({
                message: 'fileOpened',
                id: e.data.id,
                mediaType: 'tape',
            });
            break;

        case 'playTape':
            if (tape && !tapeIsPlaying) {
                tapeIsPlaying = true;
                postMessage({
                    message: 'playingTape',
                });
            }
            break;
        case 'stopTape':
            if (tape && tapeIsPlaying) {
                tapeIsPlaying = false;
                postMessage({
                    message: 'stoppedTape',
                });
            }
            break;
        case 'setTapeTraps':
            core.setTapeTraps(e.data.value);
            break;
        default:
            postMessage({
                message: 'error',
                content: 'Message not recognized by Worker!'
            });
    }
};

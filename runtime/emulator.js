import EventEmitter from 'events';
import JSZip from 'jszip';

import { DisplayHandler } from './displayHandler.js';
import { parseSNAFile, parseZ80File, parseSZXFile } from './snapshot.js';
import { TAPFile, TZXFile } from './tape.js';
import { KeyboardHandler } from './keyboardHandler.js';
import { AudioHandler } from './audioHandler.js';
import { SupportedMachines } from './machinesList.js';

const scriptUrl = document.currentScript.src;

export class Emulator extends EventEmitter {
  constructor(canvas, opts) {
    super();
    this.opts = opts;
    this.canvas = canvas;
    this.worker = new Worker(new URL(opts.worker, scriptUrl));
    this.devMode = opts.devMode || false;
    this.keyboardEnabled = ('keyboardEnabled' in opts) ? opts.keyboardEnabled : true;
    if (this.keyboardEnabled) {
      this.keyboardHandler = new KeyboardHandler(this.worker, opts.keyboardEventRoot || document, 'default', this.devMode);
      this.keyboardEventRoot = opts.keyboardEventRoot;
    }
    this.displayHandler = new DisplayHandler(this.canvas);
    this.audioHandler = new AudioHandler();
    this.isRunning = false;
    this.isReady = false;
    this.isInitiallyPaused = (!opts.autoStart);
    this.autoLoadTapes = opts.autoLoadTapes || false;
    this.tapeAutoLoadMode = opts.tapeAutoLoadMode || 'default';
    this.tapeIsPlaying = false;
    this.tapeTrapsEnabled = ('tapeTrapsEnabled' in opts) ? opts.tapeTrapsEnabled : true;
    this.supportedMachines = new SupportedMachines();
    this.inScreenKeyboardBuffer = false;

    this.msPerFrame = 20;

    this.isExecutingFrame = false;
    this.nextFrameTime = null;
    this.machineType = null;

    this.nextFileOpenID = 0;
    this.fileOpenPromiseResolutions = {};

    this.onReadyHandlers = [];

    this.worker.onmessage = (e) => {
      switch (e.data.message) {
        case 'ready':
          if (this.devMode) console.log('WORKER MESSAGE - READY');

          this.loadRoms(opts.machine || '1').then(() => {
            this.setMachine(opts.machine || '1');

            this.setTapeTraps(this.tapeTrapsEnabled);
            if (opts.openUrl) {
              this.openUrlList(opts.openUrl).catch(err => {
                alert(err);
              }).then(() => {
                if (opts.autoStart) this.start();
              });
            } else if (opts.autoStart) {
              this.start();
            }

            if (this.keyboardEnabled) {
              this.keyboardHandler = new KeyboardHandler(this.worker, this.opts.keyboardEventRoot || document, this.supportedMachines.getList()[this.machineType]['tech']['keyboard'], this.devMode);
            }

            this.isReady = true;
            for (let i = 0; i < this.onReadyHandlers.length; i++) {
              this.onReadyHandlers[i]();
            }
          });
          break;
        case 'frameCompleted':
          //if (this.devMode) console.log('WORKER MESSAGE - FRAME COMPLETED');
          if ('audioBufferLeft' in e.data) {
            this.audioHandler.frameCompleted(e.data.audioBufferLeft, e.data.audioBufferRight);
          }

          this.displayHandler.frameCompleted(e.data.frameBuffer);
          if (this.isRunning) {
            const time = performance.now();
            if (time > this.nextFrameTime) {
              this.runFrame();
              this.nextFrameTime = time + this.msPerFrame;
            } else {
              this.isExecutingFrame = false;
            }
          } else {
            this.isExecutingFrame = false;
          }
          break;
        case 'fileOpened':
          if (this.devMode) console.log('WORKER MESSAGE - FILE OPENED');
          if (e.data.mediaType == 'tape' && this.autoLoadTapes) {
            let tapeLoaders = {};
            const machinesList = this.supportedMachines.getList();
            tapeLoaders[this.machineType] = { 'default': machinesList[this.machineType]['tapeloaders']['default'], 'usr0': machinesList[this.machineType]['tapeloaders']['usr0'] };
            if (machinesList[this.machineType]['tapeloaders'][this.tapeAutoLoadMode]) {
              this.openUrl(new URL(tapeLoaders[this.machineType][this.tapeAutoLoadMode], scriptUrl));
            }
            if (!this.tapeTrapsEnabled) {
              this.playTape();
            }
          }
          this.fileOpenPromiseResolutions[e.data.id]({
            mediaType: e.data.mediaType,
          });
          if (e.data.mediaType == 'tape') {
            this.emit('openedTapeFile');
          }
          break;
        case 'playingTape':
          if (this.devMode) console.log('WORKER MESSAGE - PLAYING TAPE');
          this.tapeIsPlaying = true;
          this.emit('playingTape');
          break;
        case 'stoppedTape':
          if (this.devMode) console.log('WORKER MESSAGE - STOPPED TAPE');
          this.tapeIsPlaying = false;
          this.emit('stoppedTape');
          break;
        case 'machineSetupDone':
          if (this.devMode) {
            console.log('WORKER MESSAGE - MACHINE SETUP DONE');
            console.log(e.data);
          }
          break;
        default:
          if (this.devMode) {
            console.log('WORKER MESSAGE - OTHER');
            console.log(e.data);
          }
      }
    }
    this.worker.postMessage({
      message: 'loadCore',
      baseUrl: scriptUrl,
    })
  }

  async start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.isInitiallyPaused = false;
      this.nextFrameTime = performance.now();
      if (this.keyboardEnabled) {
        this.keyboardHandler.start();
      }
      this.audioHandler.start();
      this.focus();
      this.emit('start');
      window.requestAnimationFrame((t) => {
        this.runAnimationFrame(t);
      });
    }
  }

  focus() {
    if (this.keyboardEnabled && this.keyboardHandler.rootElement.focus) {
      this.keyboardHandler.rootElement.focus();
    }
  }

  setKeyboardEventRoot(newRootElement) {
    if (this.keyboardEnabled) {
      this.keyboardHandler.setRootElement(newRootElement);
    }
  }

  pause() {
    if (this.isRunning) {
      this.isRunning = false;
      if (this.keyboardEnabled) {
        this.keyboardHandler.stop();
      }
      this.audioHandler.stop();
      this.emit('pause');
    }
  }

  async loadRom(url, page) {
    const response = await fetch(new URL(url, scriptUrl));
    const data = new Uint8Array(await response.arrayBuffer());
    this.worker.postMessage({
      message: 'loadMemory',
      data,
      page: page,
    });
  }

  async loadRoms(type) {
    const romsToLoad = this.supportedMachines.getRomsByMachine(type);
    let i = 0;
    let load = true;
    while (load) {
      if (typeof romsToLoad['rom' + i] !== 'undefined' && romsToLoad['rom' + i]) {
        await this.loadRom(romsToLoad['rom' + i], romsToLoad['rom' + i + '_page']);
        i++;
      } else {
        load = false;
      }
    }
  }

  runFrame() {
    this.isExecutingFrame = true;
    const frameBuffer = this.displayHandler.getNextFrameBuffer();

    if (this.audioHandler.isActive) {
      const [audioBufferLeft, audioBufferRight] = this.audioHandler.frameBuffers;

      this.worker.postMessage({
        message: 'runFrame',
        frameBuffer,
        audioBufferLeft,
        audioBufferRight,
      }, [frameBuffer, audioBufferLeft, audioBufferRight]);
    } else {
      this.worker.postMessage({
        message: 'runFrame',
        frameBuffer,
      }, [frameBuffer]);
    }
  }

  runAnimationFrame(time) {
    if (this.displayHandler.readyToShow()) {
      this.displayHandler.show();
      // benchmarkRenderCount++;
    }
    if (this.isRunning) {
      if (time > this.nextFrameTime && !this.isExecutingFrame) {
        this.runFrame();
        this.nextFrameTime += this.msPerFrame;
      }
      window.requestAnimationFrame((t) => {
        this.runAnimationFrame(t);
      });
    }
  };

  setMachine(type) {
    const currentMachineTech = this.supportedMachines.getList()[type]['tech'];

    this.worker.postMessage({
      message: 'setMachineType',
      type: type,
      ram: currentMachineTech['ram'],
      frameCycleCount: currentMachineTech['frameCycleCount'],
      mainScreenStartTstate: currentMachineTech['mainScreenStartTstate'],
      tstatesPerRow: currentMachineTech['tstatesPerRow'],
      borderTimeMask: currentMachineTech['borderTimeMask'],
      buildContentionTable: currentMachineTech['buildContentionTable'],
      betadiskEnabled: currentMachineTech['betadiskEnabled'],
      betadiskROMActive: currentMachineTech['betadiskROMActive'],
      memoryPageReadMap: currentMachineTech['memoryPageReadMap'],
      memoryPageWriteMap: currentMachineTech['memoryPageWriteMap'],
      pagingLocked: currentMachineTech['pagingLocked'],
      isPentagonBased: currentMachineTech['isPentagonBased']
    });
    this.machineType = type;
    this.loadRoms(type).then(() => { this.emit('setMachine', type); });
  }

  reset() {
    this.worker.postMessage({ message: 'reset' });
  }

  loadSnapshot(snapshot) {
    const fileID = this.nextFileOpenID++;
    this.worker.postMessage({
      message: 'loadSnapshot',
      id: fileID,
      snapshot,
    })

    this.loadRoms(snapshot.model.toString()).then(() => { this.emit('setMachine', snapshot.model); });
    return new Promise((resolve, reject) => {
      this.fileOpenPromiseResolutions[fileID] = resolve;
    });
  }

  openTAPFile(data) {
    const fileID = this.nextFileOpenID++;
    this.worker.postMessage({
      message: 'openTAPFile',
      id: fileID,
      data,
    });
    return new Promise((resolve, reject) => {
      this.fileOpenPromiseResolutions[fileID] = resolve;
    });
  }

  async inScreenJoystickClick(evt) {
    if (!this.isRunning) {
      return;
    }
    // get joystick type
    const target = evt.target;
    let targetParent = target.parentNode;
    let joystickType = targetParent.getAttribute('data-type');
    while (joystickType == null) {
      targetParent = targetParent.parentNode;
      joystickType = targetParent.getAttribute('data-type');
    }

    // Get action clicked
    const action = target.getAttribute('data-action');
    if (joystickType === 'kempston') {
      // Port 0x001F
      // 000FUDLR
      // 00010000 -> Fight -> 0x10
      // 00001000 -> Up -> 0x08
      // 00000100 -> Down -> 0x04
      // 00000010 -> Left -> 0x02
      // 00000001 -> Right -> 0x01
      let joystickMap = {
        up: 0x08, // 3
        down: 0x04, // 4
        left: 0x02, // 1
        right: 0x01, // 2
        fire: 0x10, // 5
      };
      this.worker.postMessage({
        message: 'kempstonKeyDown', value: joystickMap[action],
      });
      await new Promise(r => setTimeout(r, 150));
      this.worker.postMessage({
        message: 'kempstonKeyUp', value: joystickMap[action],
      });
    } else {
      let joystickMap = {
        up: 51, // 3
        down: 52, // 4
        left: 49, // 1
        right: 50, // 2
        fire: 53, // 5
      };
      if (joystickType === 'cursor') {
        joystickMap = {
          up: 53, // 5
          down: 54, // 6
          left: 55, // 7
          right: 56, // 8
          fire: 48, // 0
        }
      } else if (joystickType === 'interface22') {
        joystickMap = {
          up: 56, // 8
          down: 57, // 9
          left: 54, // 6
          right: 55, // 7
          fire: 48, // 0
        }
      }
      if (this.devMode) console.log('Joystick Event - Type: ' + joystickType + ' - Action: ' + action)
      this.worker.postMessage({
        message: 'keyDown', id: joystickMap[action],
      });
      await new Promise(r => setTimeout(r, 150));
      this.worker.postMessage({
        message: 'keyUp', id: joystickMap[action],
      });
    }
  }

  async inScreenKeyBoardClick(evt) {

    if (!this.isRunning) {
      return;
    }
    let target = evt.target;
    if (!target.hasAttribute('data-id')) {
      target = target.parentNode;
    }

    const id = target.getAttribute('data-id');
    const isShift = target.getAttribute('data-shift') == 'true' ? true : false;
    const shiftKey = target.getAttribute('data-shiftKey') ? target.getAttribute('data-shiftKey') : false;

    if (this.devMode) {
      console.log('IN SCREEN KEYBOARD CLICK');
      console.log('KeyID:' + id);
      console.log('isShift:' + isShift);
      console.log('shiftKey:' + shiftKey);
    }

    if (isShift) {
      if (this.devMode) console.log('IS SHIFT KEY');
      if (this.inScreenKeyboardBuffer) {
        if (this.devMode) console.log('IS DOBLE SHIFT!');
        this.worker.postMessage({
          message: 'keyDown', id: Number(this.inScreenKeyboardBuffer.getAttribute('data-id')),
        });
        await new Promise(r => setTimeout(r, 150));
        this.worker.postMessage({
          message: 'keyDown', id: Number(id),
        });
        await new Promise(r => setTimeout(r, 150));
        this.worker.postMessage({
          message: 'keyUp', id: Number(id),
        });
        await new Promise(r => setTimeout(r, 150));
        this.worker.postMessage({
          message: 'keyUp', id: Number(this.inScreenKeyboardBuffer.getAttribute('data-id')),
        });
        this.inScreenKeyboardBuffer.classList.remove('pushed');
        this.inScreenKeyboardBuffer = null;
      } else {
        target.classList.add('pushed')
        this.inScreenKeyboardBuffer = target;
      }
    } else if (this.inScreenKeyboardBuffer) {
      if (this.devMode) console.log('IS AFTER SHIFT KEY');
      this.worker.postMessage({
        message: 'keyDown', id: Number(this.inScreenKeyboardBuffer.getAttribute('data-id')),
      });
      await new Promise(r => setTimeout(r, 150));
      this.worker.postMessage({
        message: 'keyDown', id: Number(id),
      });
      await new Promise(r => setTimeout(r, 150));
      this.worker.postMessage({
        message: 'keyUp', id: Number(id),
      });
      await new Promise(r => setTimeout(r, 150));
      this.worker.postMessage({
        message: 'keyUp', id: Number(this.inScreenKeyboardBuffer.getAttribute('data-id')),
      });
      this.inScreenKeyboardBuffer.classList.remove('pushed');
      this.inScreenKeyboardBuffer = null;
    } else if (shiftKey) {
      if (this.devMode) console.log('IS A SHIFTED KEY');
      this.worker.postMessage({
        message: 'keyDown', id: shiftKey
      });
      await new Promise(r => setTimeout(r, 150));
      this.worker.postMessage({
        message: 'keyDown', id: Number(id),
      });
      await new Promise(r => setTimeout(r, 150));
      this.worker.postMessage({
        message: 'keyUp', id: Number(id)
      });
      await new Promise(r => setTimeout(r, 150));
      this.worker.postMessage({
        message: 'keyUp', id: shiftKey
      });
      this.inScreenKeyboardBuffer = null;
    } else {
      if (this.devMode) console.log('IS COMMON KEY');
      this.worker.postMessage({
        message: 'keyDown', id: id,
      });
      await new Promise(r => setTimeout(r, 150));
      this.worker.postMessage({
        message: 'keyUp', id: id,
      });
      this.inScreenKeyboardBuffer = null;
    }
  }

  openTZXFile(data) {
    const fileID = this.nextFileOpenID++;
    this.worker.postMessage({
      message: 'openTZXFile',
      id: fileID,
      data,
    })
    return new Promise((resolve, reject) => {
      this.fileOpenPromiseResolutions[fileID] = resolve;
    });
  }

  getFileOpener(filename) {
    const cleanName = filename.toLowerCase();
    if (cleanName.endsWith('.z80')) {
      return arrayBuffer => {
        const z80file = parseZ80File(arrayBuffer);
        return this.loadSnapshot(z80file);
      };
    } else if (cleanName.endsWith('.szx')) {
      return arrayBuffer => {
        const szxfile = parseSZXFile(arrayBuffer);
        return this.loadSnapshot(szxfile);
      };
    } else if (cleanName.endsWith('.sna')) {
      return arrayBuffer => {
        const snafile = parseSNAFile(arrayBuffer);
        return this.loadSnapshot(snafile);
      };
    } else if (cleanName.endsWith('.tap')) {
      return arrayBuffer => {
        if (!TAPFile.isValid(arrayBuffer)) {
          alert('Invalid TAP file');
        } else {
          return this.openTAPFile(arrayBuffer);
        }
      };
    } else if (cleanName.endsWith('.tzx')) {
      return arrayBuffer => {
        if (!TZXFile.isValid(arrayBuffer)) {
          alert('Invalid TZX file');
        } else {
          return this.openTZXFile(arrayBuffer);
        }
      };
    } else if (cleanName.endsWith('.zip')) {
      return async arrayBuffer => {
        const zip = await JSZip.loadAsync(arrayBuffer);
        const openers = [];
        zip.forEach((path, file) => {
          if (path.startsWith('__MACOSX/')) return;
          const opener = this.getFileOpener(path);
          if (opener) {
            const boundOpener = async () => {
              const buf = await file.async('arraybuffer');
              return opener(buf);
            };
            openers.push(boundOpener);
          }
        });
        if (openers.length == 1) {
          return openers[0]();
        } else if (openers.length == 0) {
          throw 'No loadable files found inside ZIP file: ' + filename;
        } else {
          // TODO: prompt to choose a file
          throw 'Multiple loadable files found inside ZIP file: ' + filename;
        }
      }
    }
  }

  async openFile(file) {
    const opener = this.getFileOpener(file.name);
    if (opener) {
      const buf = await file.arrayBuffer();
      return opener(buf).catch(err => { alert(err); });
    } else {
      throw 'Unrecognised file type: ' + file.name;
    }
  }

  async openUrl(url) {
    const opener = this.getFileOpener(url.toString());
    if (opener) {
      const response = await fetch(url);
      const buf = await response.arrayBuffer();
      return opener(buf);
    } else {
      throw 'Unrecognised file type: ' + url.split('/').pop();
    }
  }
  async openUrlList(urls) {
    if (typeof (urls) === 'string') {
      return await this.openUrl(urls);
    } else {
      for (const url of urls) {
        await this.openUrl(url);
      }
    }
  }

  setAutoLoadTapes(val) {
    this.autoLoadTapes = val;
    this.emit('setAutoLoadTapes', val);
  }
  setTapeTraps(val) {
    this.tapeTrapsEnabled = val;
    this.worker.postMessage({
      message: 'setTapeTraps',
      value: val,
    })
    this.emit('setTapeTraps', val);
  }

  playTape() {
    this.worker.postMessage({
      message: 'playTape',
    });
  }
  stopTape() {
    this.worker.postMessage({
      message: 'stopTape',
    });
  }

  exit() {
    this.pause();
    this.worker.terminate();
  }
}

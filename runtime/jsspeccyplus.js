/* ARCHIVO DE ENTRADA DEL PROYECTO */

/* IMPORTS -> TODO Revisar linea a linea */
import EventEmitter from 'events';
import fileDialog from 'file-dialog';
import JSZip from 'jszip';

import { DisplayHandler } from './render.js';
import { UIController } from './ui.js';
import { parseSNAFile, parseZ80File, parseSZXFile } from './snapshot.js';
import { TAPFile, TZXFile } from './tape.js';
import { KeyboardHandler } from './keyboard.js';
import { AudioHandler } from './audio.js';

import openIcon from './icons/open.svg';
import resetIcon from './icons/reset.svg';
import playIcon from './icons/play.svg';
import pauseIcon from './icons/pause.svg';
import fullscreenIcon from './icons/fullscreen.svg';
import exitFullscreenIcon from './icons/exitfullscreen.svg';
import tapePlayIcon from './icons/tape_play.svg';
import tapePauseIcon from './icons/tape_pause.svg';

import { SupportedMachines } from './machines.js';

const scriptUrl = document.currentScript.src;

class Emulator extends EventEmitter {
    constructor(canvas, opts) {
        super(); // Llama al constructor de la clase extendida "EventEmitter"
        this.canvas = canvas; // Almacena canvas recibido
        this.worker = new Worker(new URL('jsspeccyplus-worker.js', scriptUrl)); // Inicializa el worker
        this.keyboardEnabled = ('keyboardEnabled' in opts) ? opts.keyboardEnabled : true; // Comprueba si el teclado debe estar activo o no. Por defecto si.
        if (this.keyboardEnabled) {
            this.keyboardHandler = new KeyboardHandler(this.worker, opts.keyboardEventRoot || document); // Como el teclado está activo, inicia el control de teclado
        }
        this.displayHandler = new DisplayHandler(this.canvas); // Inicia el control de Display
        this.audioHandler = new AudioHandler(); // Inicia el control de sonido
        this.isRunning = false; // Por defecto la maquina no está activa
        this.isReady = false; // Por defecto la maquina no está inicialiada
        this.isInitiallyPaused = (!opts.autoStart); // Autoarranque bool
        this.autoLoadTapes = opts.autoLoadTapes || false; // Carga automatica de cintas bool
        this.tapeAutoLoadMode = opts.tapeAutoLoadMode || 'default';  // tipo de carga 'default' o recibida por parametro
        this.tapeIsPlaying = false; // Define si se esta reproduciendo o no una cinta bool. falso por defecto.
        this.tapeTrapsEnabled = ('tapeTrapsEnabled' in opts) ? opts.tapeTrapsEnabled : true; // ???
        this.supportedMachines = new SupportedMachines().getList(); // Obtiene listado de maquinas compatibles

        this.msPerFrame = 20; // Milisegundos por frame
        // Un segundo son 1000 milisegundos
        // 1000 / 20 = 50 frames por segundo
        // Entiendo por tanto que la frecuencia de refresco del front respecto al worker es esta ????

        this.isExecutingFrame = false; // Define si se esta ejecutando o no un frame actualmente . bool
        this.nextFrameTime = null; // Almacena tiempo hasta el siguiente frame ???
        this.machineType = null; // Tipo de maquina por defecto null

        this.nextFileOpenID = 0;
        this.fileOpenPromiseResolutions = {};

        this.onReadyHandlers = [];

        this.worker.onmessage = (e) => { // Procesa los postmessages recibidos del worker
            switch (e.data.message) {
                case 'ready': // El worker está disponible
                    console.log('WORKER - READY');
                    this.loadRoms(opts.machine || '2').then(() => { // Carga las roms (Todas, todos sistemas), y a continuacion
                        this.setMachine(opts.machine || '2'); // Maquina recibida por parametro o 128 por defecto
                        this.setTapeTraps(this.tapeTrapsEnabled); // Setea las trampas de casette?
                        if (opts.openUrl) { // Comprueba si se ha recibido URL de algun software
                            this.openUrlList(opts.openUrl).catch(err => { // En caso afirmativo carga la URL
                                alert(err);
                            }).then(() => {
                                if (opts.autoStart) this.start(); // Si todo ha ido OK y está el autostart en true, inicia la maquina.
                            });
                        } else if (opts.autoStart) {
                            this.start(); // Si está el autostart en true, inicia la maquina.
                        }

                        this.isReady = true; // Marca como ready
                        console.log(this.onReadyHandlers);
                        for (let i = 0; i < this.onReadyHandlers.length; i++) {// Aqui por ahora no hay nada, revisar.
                            this.onReadyHandlers[i]();
                        }
                        console.log(this.onReadyHandlers);

                    });
                    break;
                case 'frameCompleted': // Se ha completado un frame y nos informa para que lo carguemos en canvas
                    // benchmarkRunCount++;
                    console.log('WORKER - FRAME COMPLETED');
                    if ('audioBufferLeft' in e.data) { // Si hay audio, lo procesa
                        this.audioHandler.frameCompleted(e.data.audioBufferLeft, e.data.audioBufferRight);
                    }

                    this.displayHandler.frameCompleted(e.data.frameBuffer); // Actualiza el display
                    if (this.isRunning) { // Si esta funcionando?
                        const time = performance.now(); // Get current execution time
                        if (time > this.nextFrameTime) { // Si es mayor que el tiempo para el proximo frame
                            /* running at full blast - start next frame but adjust time base
                            to give it the full time allocation */
                            this.runFrame(); // corre el frame
                            this.nextFrameTime = time + this.msPerFrame; // Define el tiempo para el siguiente frame (actual + 20ms)
                        } else {
                            this.isExecutingFrame = false; // Debe ejecutarse el frame? false
                        }
                    } else {
                        this.isExecutingFrame = false; // Debe ejecutarse el frame? false
                    }
                    break;
                case 'fileOpened': // Se ha abierto un archivo
                    console.log('WORKER - FILE OPENED');
                    if (e.data.mediaType == 'tape' && this.autoLoadTapes) { // Si es del tipo tape y esta configurado para que cargue automaticamente
                        let tapeLoaders = {};
                        const temp = this.supportedMachines;
                        Object.keys(temp).forEach(function (item) {
                            tapeLoaders[item] = { 'default': temp[item]['tape'], 'usr0': temp[item]['tape_usr0'] };
                        });
                        this.openUrl(new URL(tapeLoaders[this.machineType][this.tapeAutoLoadMode], scriptUrl));
                        if (!this.tapeTrapsEnabled) {
                            this.playTape(); // Si no estan habilitadas las trampas de carga, reproduce la cinta.
                        }
                    }
                    this.fileOpenPromiseResolutions[e.data.id]({ // Almacena el tipo de archivo que ha cargado ??
                        mediaType: e.data.mediaType,
                    });
                    if (e.data.mediaType == 'tape') {
                        this.emit('openedTapeFile'); //
                    }
                    break;
                case 'playingTape':
                    console.log('WORKER - PLAYING TAPE');
                    this.tapeIsPlaying = true;
                    this.emit('playingTape');
                    break;
                case 'stoppedTape':
                    console.log('WORKER - STOPPED TAPE');
                    this.tapeIsPlaying = false;
                    this.emit('stoppedTape');
                    break;
                default:
                    console.log('WORKER - ' + e.data.message);
            }
        }
        this.worker.postMessage({
            message: 'loadCore',
            baseUrl: scriptUrl,
        })
    }

    start() {
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

    async loadRoms(machineId) {
        const supportedMachine = this.supportedMachines[machineId];
        // rom0
        await this.loadRom(supportedMachine['rom0'], supportedMachine['rom0_page']);
        // rom1
        if (supportedMachine['rom1']) {
            await this.loadRom(supportedMachine['rom1'], supportedMachine['rom1_page']);
        }
        // rom2
        if (supportedMachine['rom2']) {
            await this.loadRom(supportedMachine['rom2'], supportedMachine['rom2_page']);
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
        this.worker.postMessage({
            message: 'setMachineType',
            type,
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

        this.loadRoms(snapshot.model).then(() => { this.emit('setMachine', snapshot.model); });
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
        })
        return new Promise((resolve, reject) => {
            this.fileOpenPromiseResolutions[fileID] = resolve;
        });
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

window.JSSpeccyPlus = (container, opts) => {
    // let benchmarkRunCount = 0;
    // let benchmarkRenderCount = 0;
    opts = opts || {};

    container.classList.add('jsspeccyplus-container');

    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const supportedMachines = new SupportedMachines().getList();

    const keyboardEnabled = ('keyboardEnabled' in opts) ? opts.keyboardEnabled : true;
    const uiEnabled = ('uiEnabled' in opts) ? opts.uiEnabled : true;

    const emu = new Emulator(canvas, {
        machine: opts.machine || '2',
        autoStart: opts.autoStart || false,
        autoLoadTapes: opts.autoLoadTapes || false,
        tapeAutoLoadMode: opts.tapeAutoLoadMode || 'default',
        openUrl: opts.openUrl,
        tapeTrapsEnabled: ('tapeTrapsEnabled' in opts) ? opts.tapeTrapsEnabled : true,
        keyboardEnabled: keyboardEnabled,
    });
    const ui = new UIController(container, emu, {
        zoom: opts.zoom || 1,
        sandbox: opts.sandbox,
        uiEnabled: uiEnabled,
    });

    if (keyboardEnabled) {
        if (ui.appContainer.tabIndex == -1) {
            ui.appContainer.tabIndex = 0;  // allow receiving focus for keyboard events
        }
        emu.setKeyboardEventRoot(ui.appContainer);
    }

    if (uiEnabled) {
        const machineMenu = ui.menuBar.addMenu('Hardware', 'hardware');
        // One menu item for each supported machine
        Object.keys(supportedMachines).forEach(function (item) {
            const fullTitle = supportedMachines[item]['title']+'('+supportedMachines[item]['lang']+')('+supportedMachines[item]['country']+' '+supportedMachines[item]['year']+' - '+supportedMachines[item]['manufacturer']+')';
            const machineItem = machineMenu.addItem(fullTitle, () => {
                emu.setMachine(item);
                emu.focus();
            }, item);
        });

        const fileMenu = ui.menuBar.addMenu('Software', 'software');
        if (!opts.sandbox) {
            fileMenu.addItem('Open', () => {
                openFileDialog();
            });
            const autoLoadTapesMenuItem = fileMenu.addItem('Auto-load tapes', () => {
                emu.setAutoLoadTapes(!emu.autoLoadTapes);
                emu.focus();
            });
            const updateAutoLoadTapesCheckbox = () => {
                if (emu.autoLoadTapes) {
                    autoLoadTapesMenuItem.setActive();
                } else {
                    autoLoadTapesMenuItem.unsetActive();
                }
            }
            emu.on('setAutoLoadTapes', updateAutoLoadTapesCheckbox);
            updateAutoLoadTapesCheckbox();
        }

        const tapeTrapsMenuItem = fileMenu.addItem('Instant tape loading', () => {
            emu.setTapeTraps(!emu.tapeTrapsEnabled);
            emu.focus();
        });

        const updateTapeTrapsCheckbox = () => {
            if (emu.tapeTrapsEnabled) {
                tapeTrapsMenuItem.setActive();
            } else {
                tapeTrapsMenuItem.unsetActive();
            }
        }
        emu.on('setTapeTraps', updateTapeTrapsCheckbox);
        updateTapeTrapsCheckbox();

        const displayMenu = ui.menuBar.addMenu('Display', 'display');
        const zoomItemsBySize = {
            1: displayMenu.addItem('320x240', () => { ui.setZoom(1); emu.focus(); }),
            2: displayMenu.addItem('640x480', () => { ui.setZoom(2); emu.focus(); }),
            3: displayMenu.addItem('960x720', () => { ui.setZoom(3); emu.focus(); }),
        }
        const fullscreenItem = displayMenu.addItem('Fullscreen', () => {
            ui.enterFullscreen();
        })
        const setZoomCheckbox = (factor) => {
            if (factor == 'fullscreen') {
                fullscreenItem.setActive();
                for (let i in zoomItemsBySize) {
                    zoomItemsBySize[i].unsetActive();
                }
            } else {
                fullscreenItem.unsetActive();
                for (let i in zoomItemsBySize) {
                    if (parseInt(i) == factor) {
                        zoomItemsBySize[i].setActive();
                    } else {
                        zoomItemsBySize[i].unsetActive();
                    }
                }
            }
        }

        ui.on('setZoom', setZoomCheckbox);
        setZoomCheckbox(ui.zoom);

        emu.on('setMachine', (type) => {
            // Update hardware menu
            const hardwareMenu = document.getElementById("ui-bar-menu-hardware");
            if (hardwareMenu.hasChildNodes()) {
                var children = hardwareMenu.childNodes;
                for (var i = 0; i < children.length; i++) {
                    var button = children[i].firstChild;
                    if (button.getAttribute('data-id') == type) {
                        button.classList.add('active');
                    } else {
                        button.classList.remove('active');
                    }
                }
            }

            // Update style class
            // TODO
        });

        if (!opts.sandbox) {
            ui.toolbar.addButton(openIcon, { label: 'Open file' }, () => {
                openFileDialog();
            });
        }
        ui.toolbar.addButton(resetIcon, { label: 'Reset' }, () => {
            emu.reset();
        });
        const pauseButton = ui.toolbar.addButton(playIcon, { label: 'Unpause' }, () => {
            if (emu.isRunning) {
                emu.pause();
            } else {
                emu.start();
            }
        });
        emu.on('pause', () => {
            pauseButton.setIcon(playIcon);
            pauseButton.setLabel('Unpause');
        });
        emu.on('start', () => {
            pauseButton.setIcon(pauseIcon);
            pauseButton.setLabel('Pause');
        });
        const tapeButton = ui.toolbar.addButton(tapePlayIcon, { label: 'Start tape' }, () => {
            if (emu.tapeIsPlaying) {
                emu.stopTape();
            } else {
                emu.playTape();
            }
        });
        tapeButton.disable();
        emu.on('openedTapeFile', () => {
            tapeButton.enable();
        });
        emu.on('playingTape', () => {
            tapeButton.setIcon(tapePauseIcon);
            tapeButton.setLabel('Stop tape');
        });
        emu.on('stoppedTape', () => {
            tapeButton.setIcon(tapePlayIcon);
            tapeButton.setLabel('Start tape');
        });

        const fullscreenButton = ui.toolbar.addButton(
            fullscreenIcon,
            { label: 'Enter full screen mode', align: 'right' },
            () => {
                ui.toggleFullscreen();
            }
        )

        ui.on('setZoom', (factor) => {
            if (factor == 'fullscreen') {
                fullscreenButton.setIcon(exitFullscreenIcon);
                fullscreenButton.setLabel('Exit full screen mode');
            } else {
                fullscreenButton.setIcon(fullscreenIcon);
                fullscreenButton.setLabel('Enter full screen mode');
            }
        });
    }

    const openFileDialog = () => {
        fileDialog().then(files => {
            const file = files[0];
            emu.openFile(file).then(() => {
                if (emu.isInitiallyPaused) emu.start();
                emu.focus();
            }).catch((err) => { alert(err); });
        });
    }

    const exit = () => {
        emu.exit();
        ui.unload();
    }

    return {
        setZoom: (zoom) => { ui.setZoom(zoom); },
        toggleFullscreen: () => { ui.toggleFullscreen(); },
        enterFullscreen: () => { ui.enterFullscreen(); },
        exitFullscreen: () => { ui.exitFullscreen(); },
        setMachine: (model) => { emu.setMachine(model); },
        openFileDialog: () => { openFileDialog(); },
        openUrl: (url) => {
            emu.openUrl(url).catch((err) => { alert(err); });
        },
        loadSnapshotFromStruct: (snapshot) => {
            emu.loadSnapshot(snapshot);
        },
        onReady: (callback) => {
            if (emu.isReady) {
                callback();
            } else {
                emu.onReadyHandlers.push(callback);
            }
        },
        exit: () => { exit(); },
    };
};

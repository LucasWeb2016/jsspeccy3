import fileDialog from 'file-dialog';

import { UIController } from './uiController.js';
import { SupportedMachines } from './machinesList.js';
import { Emulator } from './emulator.js';

import resetIcon from './icons/reset.svg';
import playIcon from './icons/play.svg';
import pauseIcon from './icons/pause.svg';
import fullscreenIcon from './icons/fullscreen.svg';
import exitFullscreenIcon from './icons/exitfullscreen.svg';
import tapePlayIcon from './icons/tape_play.svg';
import tapePauseIcon from './icons/tape_pause.svg';
import keyboardIcon from './icons/keyboard.svg';
import joystickIcon from './icons/joystick.svg';

window.js8bits = (container, opts) => {
    opts = opts || {};

    container.classList.add('js8bits-container');
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;

    const supportedMachines = new SupportedMachines();
    const keyboardEnabled = ('keyboardEnabled' in opts) ? opts.keyboardEnabled : true;
    const inScreenKeyboardEnabled = ('inScreenKeyboardEnabled' in opts) ? opts.inScreenKeyboardEnabled : true;
    const inScreenJoystickEnabled = ('inScreenJoystickEnabled' in opts) ? opts.inScreenJoystickEnabled : true;
    const devMode = ('devMode' in opts) ? opts.devMode : false;
    const standAlone = ('standAlone' in opts) ? opts.standAlone : false;
    const uiEnabled = ('uiEnabled' in opts) ? opts.uiEnabled : true;

    // Emulator
    const emu = new Emulator(canvas, {
        machine: opts.machine || '1',
        autoStart: opts.autoStart || false,
        autoLoadTapes: opts.autoLoadTapes || false,
        tapeAutoLoadMode: opts.tapeAutoLoadMode || 'default',
        openUrl: opts.openUrl,
        tapeTrapsEnabled: ('tapeTrapsEnabled' in opts) ? opts.tapeTrapsEnabled : false,
        keyboardEnabled: keyboardEnabled,
        devMode: devMode,
        worker: supportedMachines.getList()[opts.machine || '1']['worker'],
    });

    //UI
    const ui = new UIController(container, emu, {
        zoom: opts.zoom || 'fit',
        sandbox: opts.sandbox,
        uiEnabled: uiEnabled,
        devMode: devMode,
        standAlone: standAlone
    });

    // deviceClass
    function deviceClass() {
        container.classList.remove('mobile', 'tablet', 'desktop');
        if (container.clientWidth < 768) {
            container.classList.add('mobile');
        } else if (container.clientWidth < 1200) {
            container.classList.add('mobile', 'tablet');
        } else {
            container.classList.add('mobile', 'tablet', 'desktop');
        }
    }
    deviceClass();
    addEventListener("resize", (event) => {
        deviceClass();
    });

    //Keyboard
    if (keyboardEnabled) {
        if (ui.appContainer.tabIndex == -1) {
            ui.appContainer.tabIndex = 0;  // allow receiving focus for keyboard events
        }
        emu.setKeyboardEventRoot(ui.appContainer);
    }

    // Generate UI
    if (uiEnabled) {

        // inScreenKeyboard
        if (inScreenKeyboardEnabled) {
            const machineKeyboard = ui.keyboard.addKeyboard((evt) => {
                emu.inScreenKeyBoardClick(evt);
            })
        };

        //InScreenJoystick - Based on keyboard press
        if (inScreenJoystickEnabled) {
            const machineJoystick = ui.joystick.addJoystick((evt) => {
                emu.inScreenJoystickClick(evt);
            })
        };

        // Menu top
        const machineMenu = ui.menuBar.addMenu('Hardware', 'hardware');
        const machineItem = machineMenu.addDataHeader();
        const orderedMachines = supportedMachines.getOrderedList();
        Object.keys(orderedMachines).forEach(function (item) {
            if (orderedMachines[item]['status'] >= 1 || (orderedMachines[item]['status'] == 0 && devMode)) {
                const machineItem = machineMenu.addDataItem(orderedMachines[item], () => {
                    emu.setMachine(orderedMachines[item]['id']);
                    machineItem.setActive();
                    machineMenu.setInactiveExcept(orderedMachines[item]['id']);
                    emu.focus();
                }, orderedMachines[item]['id']);
            }
        });
        machineMenu.setInactiveExcept(opts.machine || '1');

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

        const tapeTrapsMenuItem = fileMenu.addItem('Fast tape loading', () => {
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
            2: displayMenu.addItem('480x360', () => { ui.setZoom(1.5); emu.focus(); }),
            3: displayMenu.addItem('640x480', () => { ui.setZoom(2); emu.focus(); }),
            4: displayMenu.addItem('800x600', () => { ui.setZoom(2.5); emu.focus(); }),
            5: displayMenu.addItem('960x720', () => { ui.setZoom(3); emu.focus(); }),
        }
        const fullscreenItem = displayMenu.addItem('Fullscreen', () => {
            ui.enterFullscreen();
        })
        const fitContainerWidth = displayMenu.addItem('Fit window', () => {
            ui.setZoom('fit');
        })
        const setZoomCheckbox = (factor) => {
            if (factor == 'fullscreen') {
                fullscreenItem.setActive();
                fitContainerWidth.unsetActive();
                for (let i in zoomItemsBySize) {
                    zoomItemsBySize[i].unsetActive();
                }
            } else if (factor == 'fit') {
                fitContainerWidth.setActive();
                fullscreenItem.unsetActive();
                for (let i in zoomItemsBySize) {
                    zoomItemsBySize[i].unsetActive();
                }
            } else {
                fitContainerWidth.unsetActive();
                fullscreenItem.unsetActive();
                for (let i in zoomItemsBySize) {
                    if (parseInt(i) == factor) {
                        zoomItemsBySize[i].setActive();
                    } else {
                        zoomItemsBySize[i].unsetActive();
                    }
                }
            }
            ui.positionPlayButton();
        }

        ui.on('setZoom', setZoomCheckbox);
        setZoomCheckbox(ui.zoom);

        emu.on('setMachine', (type) => {
            var stylesArray = supportedMachines.getStyles();
            container.classList.remove(...stylesArray);
            supportedMachines.getList()[type]['style'].split(' ').forEach(function (item) {
                container.classList.add(item);
            });
            ui.keyboard.updateKeyboard(supportedMachines.getList()[type]['tech']['keyboard'], (evt) => {
                emu.inScreenKeyBoardClick(evt);
            });
        });

        ui.toolbar.addButton({ label: 'Reset' }, () => {
            emu.reset();
        }, resetIcon);
        const pauseButton = ui.toolbar.addButton({ label: 'Unpause' }, () => {
            if (emu.isRunning) {
                emu.pause();
            } else {
                emu.start();
            }
        }, playIcon);
        emu.on('pause', () => {
            pauseButton.setIcon(playIcon);
            pauseButton.setLabel('Unpause');
        });
        emu.on('start', () => {
            pauseButton.setIcon(pauseIcon);
            pauseButton.setLabel('Pause');
        });
        const fullscreenButton = ui.toolbar.addButton(
            { label: 'Enter full screen mode' },
            () => {
                ui.toggleFullscreen();
            }, fullscreenIcon
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
        if (inScreenKeyboardEnabled) {
            const keyboardButton = ui.toolbar.addButton({ label: 'Display keyboard' }, () => {
                ui.keyboard.display();
            }, keyboardIcon);
        }
        if (inScreenJoystickEnabled) {
            const joystickButton = ui.toolbar.addButton({ label: 'Display Joystick' }, () => {
                ui.joystick.display();
            }, joystickIcon);
        }
        const tapeButton = ui.toolbar.addButton({ label: 'Start tape' }, () => {
            if (emu.tapeIsPlaying) {
                emu.stopTape();
            } else {
                emu.playTape();
            }
        }, tapePlayIcon);
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

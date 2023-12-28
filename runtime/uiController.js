import EventEmitter from 'events';

import { uiKeyboard } from './ui/keyboard.js';
import { uiJoystick } from './ui/joystick.js';
import { uiMenuBar } from './ui/menubar.js';
import { uiToolbar } from './ui/toolbar.js';

import playIcon from './icons/play.svg';
import closeIcon from './icons/close.svg';

export class UIController extends EventEmitter {
    constructor(container, emulator, opts,) {
        super();
        this.container = container;
        this.canvas = emulator.canvas;
        this.uiEnabled = ('uiEnabled' in opts) ? opts.uiEnabled : true;
        this.standAlone = ('standAlone' in opts) ? opts.standAlone : false;
        this.devMode = ('devMode' in opts) ? opts.devMode : false;

        /* build UI elements */
        if (this.uiEnabled) {
            this.dialog = document.createElement('div');
            this.dialog.style.display = 'none';
            container.appendChild(this.dialog);
            const dialogCloseButton = document.createElement('button');
            dialogCloseButton.innerHTML = closeIcon;
            dialogCloseButton.style.float = 'right';
            dialogCloseButton.style.border = 'none';
            dialogCloseButton.firstChild.style.height = '20px';
            dialogCloseButton.firstChild.style.verticalAlign = 'middle';
            this.dialog.appendChild(dialogCloseButton);
            dialogCloseButton.addEventListener('click', () => {
                this.hideDialog();
            })
            this.dialogBody = document.createElement('div');
            this.dialogBody.style.clear = 'both';
            this.dialog.appendChild(this.dialogBody);
        }

        this.appContainer = document.createElement('div');
        container.appendChild(this.appContainer);
        this.appContainer.style.position = 'relative';
        this.appContainer.style.outline = 'none';

        if (this.uiEnabled) {
            this.menuBar = new uiMenuBar(this.appContainer);
        }

        this.appContainer.appendChild(this.canvas);
        this.canvas.style.objectFit = 'contain';
        this.canvas.style.display = 'block';

        if (this.uiEnabled) {
            this.keyboard = new uiKeyboard(this.appContainer);
        }

        if (this.uiEnabled) {
            this.joystick = new uiJoystick(this.appContainer);
        }

        if (this.uiEnabled) {
            this.toolbar = new uiToolbar(this.appContainer);
        }

        this.startButton = document.createElement('button');
        this.startButton.classList.add('js8bits-ui-play-button');
        this.startButton.innerHTML = playIcon;
        this.appContainer.appendChild(this.startButton);
        this.startButton.addEventListener('mouseenter', () => {
            this.startButton.style.backgroundColor = 'rgba(128, 128, 128, 0.7)';
        });
        this.startButton.addEventListener('mouseleave', () => {
            this.startButton.style.backgroundColor = 'rgba(160, 160, 160, 0.7)';
        });
        this.startButton.addEventListener('click', (e) => {
            emulator.start();
        });
        emulator.on('start', () => {
            this.startButton.style.display = 'none';
        });
        emulator.on('pause', () => {
            this.startButton.style.display = 'block';
        });

        /* variables for tracking zoom / fullscreen state */
        this.zoom = null;
        this.isFullscreen = false;
        this.uiIsHidden = false;
        this.allowUIHiding = true;
        this.hideUITimeout = null;
        this.ignoreNextMouseMove = false;

        /* state changes when entering / exiting fullscreen */
        const fullscreenMouseMove = () => {
            if (this.ignoreNextMouseMove) {
                this.ignoreNextMouseMove = false;
                return;
            }
            this.showUI();
            if (this.hideUITimeout) clearTimeout(this.hideUITimeout);
            this.hideUITimeout = setTimeout(() => { this.hideUI(); }, 3000);
        }
        this.appContainer.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                this.isFullscreen = true;
                this.canvas.style.width = '100%';
                this.canvas.style.height = '100%';

                if (this.uiEnabled) {
                    document.addEventListener('mousemove', fullscreenMouseMove);
                    /* a bogus mousemove event is emitted on entering fullscreen, so ignore it */
                    this.ignoreNextMouseMove = true;

                    this.menuBar.enterFullscreen();
                    this.menuBar.onmouseenter(() => { this.allowUIHiding = false; });
                    this.menuBar.onmouseout(() => { this.allowUIHiding = true; });

                    this.toolbar.enterFullscreen();
                    this.toolbar.onmouseenter(() => { this.allowUIHiding = false; });
                    this.toolbar.onmouseout(() => { this.allowUIHiding = true; });

                    this.hideUI();
                }
                this.emit('setZoom', 'fullscreen');
                emulator.focus();
            } else {
                this.isFullscreen = false;
                if (this.uiEnabled) {
                    if (this.hideUITimeout) clearTimeout(this.hideUITimeout);
                    this.showUI();

                    this.menuBar.exitFullscreen();
                    this.menuBar.onmouseenter(null);
                    this.menuBar.onmouseout(null);

                    this.toolbar.exitFullscreen();
                    this.toolbar.onmouseenter(null);
                    this.toolbar.onmouseout(null);

                    document.removeEventListener('mousemove', fullscreenMouseMove);
                }
                this.setZoom(this.zoom);
            }
        })

        this.setZoom(opts.zoom || 'fit');

        if (!opts.sandbox) {
            /* drag-and-drop for loading files */
            this.appContainer.addEventListener('drop', (ev) => {
                ev.preventDefault();
                let loadList = Promise.resolve();
                if (ev.dataTransfer.items) {
                    // Use DataTransferItemList interface to access the file(s)
                    for (const item of ev.dataTransfer.items) {
                        // If dropped items aren't files, reject them
                        if (item.kind === 'file') {
                            const file = item.getAsFile();
                            loadList = loadList.then(() => {
                                emulator.openFile(file);
                            });
                        }
                    }
                } else {
                    // Use DataTransfer interface to access the file(s)
                    for (const file of ev.dataTransfer.files) {
                        loadList = loadList.then(() => {
                            emulator.openFile(file);
                        });
                    }
                }
                loadList.then(() => {
                    if (emulator.isInitiallyPaused) emulator.start();
                })
            });
            this.appContainer.addEventListener('dragover', (ev) => {
                ev.preventDefault();
            });
        }
    }

    positionPlayButton() {
        let canvasHeight = this.canvas.clientHeight;
        this.startButton.style.top = '' + (canvasHeight / 2) + 'px';
    }

    setZoom(factor) {
        this.zoom = factor;
        if (this.isFullscreen) {
            document.exitFullscreen();
            return;
        }
        let displayHeight = 320;
        let displayWidth = 240;
        if (this.standAlone) {
            this.container.classList.add('standalone');
            let windowHeight = window.innerHeight || document.documentElement.clientHeight;
            let windowWidth = window.innerWidth || document.documentElement.clientWidth;
            let canvasMaxWidth = windowWidth;
            let canvasMaxHeight = windowHeight - 84;
            if (windowWidth > windowHeight) {
                displayHeight = canvasMaxHeight;
                displayWidth = Math.ceil((320 * displayHeight) / 240);
            } else {
                displayWidth = canvasMaxWidth;
                displayHeight = Math.ceil((240 * displayWidth) / 320);
            }

            addEventListener("resize", (event) => {
                windowHeight = window.innerHeight || document.documentElement.clientHeight;
                windowWidth = window.innerWidth || document.documentElement.clientWidth;
                canvasMaxWidth = windowWidth;
                canvasMaxHeight = windowHeight - 84;
                if (windowWidth > windowHeight) {
                    displayHeight = canvasMaxHeight;
                    displayWidth = Math.ceil((320 * displayHeight) / 240);
                } else {
                    displayWidth = canvasMaxWidth;
                    displayHeight = Math.ceil((240 * displayWidth) / 320);
                }
                this.canvas.style.width = '' + displayWidth + 'px';
                this.canvas.style.height = '' + displayHeight + 'px';
                this.container.style.height = '' + (displayHeight + 84) + 'px';
                this.emit('setZoom', factor);
            });
        } else {
            if (factor == 'fit') {
                displayWidth = this.container.clientWidth;
                displayHeight = Math.ceil((240 * displayWidth) / 320);
                this.container.style.height = '' + (displayHeight + 84) + 'px';

                addEventListener("resize", (event) => {
                    displayWidth = this.container.clientWidth;
                    displayHeight = Math.ceil((240 * displayWidth) / 320);
                    this.canvas.style.width = '' + displayWidth + 'px';
                    this.canvas.style.height = '' + displayHeight + 'px';
                    this.container.style.height = '' + (displayHeight + 84) + 'px';
                    console.log('Initial canvas size : ' + displayWidth + 'x' + displayHeight);
                    this.emit('setZoom', factor);
                });
            } else {
                this.zoom = factor;
                displayWidth = 320 * this.zoom;
                displayHeight = 240 * this.zoom;
            }
        }
        this.canvas.style.width = '' + displayWidth + 'px';
        this.canvas.style.height = '' + displayHeight + 'px';
        this.canvas.style.margin = 'auto';
        this.emit('setZoom', factor);
    }
    enterFullscreen() {
        this.appContainer.requestFullscreen();
    }
    exitFullscreen() {
        if (this.isFullscreen) {
            document.exitFullscreen();
        }
    }
    toggleFullscreen() {
        if (this.isFullscreen) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }

    hideUI() {
        if (this.uiEnabled && this.allowUIHiding && !this.uiIsHidden) {
            this.uiIsHidden = true;
            this.appContainer.style.cursor = 'none';
            this.menuBar.hide();
            this.toolbar.hide();
        }
    }
    showUI() {
        if (this.uiEnabled && this.uiIsHidden) {
            this.uiIsHidden = false;
            this.appContainer.style.cursor = 'default';
            this.menuBar.show();
            this.toolbar.show();
        }
    }
    showDialog() {
        this.dialog.style.display = 'block';
        this.dialog.style.position = 'absolute';
        this.dialog.style.backgroundColor = '#eee';
        this.dialog.style.zIndex = '100';
        this.dialog.style.width = '75%';
        this.dialog.style.height = '80%';
        this.dialog.style.left = '12%';
        this.dialog.style.top = '10%';
        this.dialog.style.overflow = 'scroll';  // TODO: less hacky scrolling that doesn't hide the close button
        this.dialogBody.style.paddingLeft = '8px';
        this.dialogBody.style.paddingRight = '8px';
        this.dialogBody.style.paddingBottom = '8px';

        return this.dialogBody;
    }
    hideDialog() {
        this.dialog.style.display = 'none';
        this.dialogBody.innerHTML = '';
    }
    unload() {
        if (this.uiEnabled) {
            this.dialog.remove();
        }
        this.appContainer.remove();
    }
}

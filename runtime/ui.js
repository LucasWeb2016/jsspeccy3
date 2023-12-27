import EventEmitter from 'events';
import { spectrum48KeyboardMap } from './keyboardMaps/spectrum48.js';
import { spectrum128pKeyboardMap } from './keyboardMaps/spectrum128p.js';
import { spectrum128pesKeyboardMap } from './keyboardMaps/spectrum128pes.js';
import { spectrum128p2KeyboardMap } from './keyboardMaps/spectrum128p2.js';
import { quorum64KeyboardMap } from './keyboardMaps/quorum64.js';

import playIcon from './icons/play.svg';
import closeIcon from './icons/close.svg';

export class MenuBar {
    constructor(container) {
        this.elem = document.createElement('div');
        this.elem.id = 'js8bits-ui-bar';
        this.elem.classList.add('js8bits-ui-bar');
        container.appendChild(this.elem);
        this.currentMouseenterEvent = null;
        this.currentMouseoutEvent = null;
    }

    addMenu(title, type) {
        return new Menu(this.elem, title, type);
    }

    enterFullscreen() {
        this.elem.style.position = 'absolute';
    }
    exitFullscreen() {
        this.elem.style.position = 'static';
    }
    show() {
        this.elem.style.visibility = 'visible';
    }
    hide() {
        this.elem.style.visibility = 'hidden';
    }
    onmouseenter(e) {
        if (this.currentMouseenterEvent) {
            this.elem.removeEventListener('mouseenter', this.currentMouseenterEvent);
        }
        if (e) {
            this.elem.addEventListener('mouseenter', e);
        }
        this.currentMouseenterEvent = e;
    }
    onmouseout(e) {
        if (this.currentMouseoutEvent) {
            this.elem.removeEventListener('mouseleave', this.currentMouseoutEvent);
        }
        if (e) {
            this.elem.addEventListener('mouseleave', e);
        }
        this.currentMouseoutEvent = e;
    }
}

export class Menu {
    constructor(container, title, type) {
        const elem = document.createElement('div');
        container.appendChild(elem);
        const button = document.createElement('button');
        button.innerText = title;
        elem.appendChild(button);
        this.list = document.createElement('ul');
        this.list.style.display = 'none';
        this.list.id = 'ui-bar-menu-' + type;
        this.list.setAttribute('data-type', type);
        elem.appendChild(this.list);
        this.container = container;

        button.addEventListener('click', () => {
            if (this.isOpen()) {
                this.close();
            } else {
                this.open();
            }
        })
        document.addEventListener('click', (e) => {
            if (e.target != button && this.isOpen()) this.close();
        })
    }

    isOpen() {
        if (this.list.getAttribute('data-type') == 'hardware') {
            return this.list.style.display == 'grid';
        }
        return this.list.style.display == 'block';
    }

    open() {
        this.list.style.display = 'block';
        if (this.list.getAttribute('data-type') == 'hardware') {
            this.list.style.display = 'grid';
            this.list.style.width = (this.container.parentNode.parentNode.clientWidth) + 'px';
            this.list.style.height = (this.container.parentNode.parentNode.clientHeight - 84) + 'px';
            addEventListener("resize", (event) => {
                this.list.style.width = (this.container.parentNode.parentNode.clientWidth) + 'px';
                this.list.style.height = (this.container.parentNode.parentNode.clientHeight - 84) + 'px';
            });
        }
    }

    close() {
        this.list.style.display = 'none';
    }

    addItem(title, onClick, type = false) {
        const li = document.createElement('li');
        this.list.appendChild(li);
        const button = document.createElement('button');
        if (type) {
            button.setAttribute('data-id', type);
        }
        button.innerText = title;

        if (onClick) {
            button.addEventListener('click', onClick);
        }
        li.appendChild(button);
        return {
            setActive: () => {
                button.classList.add('active');
            },
            unsetActive: () => {
                button.classList.remove('active');
            }
        }
    }

    setInactiveExcept(type) {
        // Tiene que recorrer cada hijo y solo dejar clase "active" en el correcto.
        const targets = this.list.childNodes;
        for (var i = 0; i < targets.length; i++) {
            if (targets[i].getAttribute('data-id') == type) {
                targets[i].classList.add('active');
            } else {
                targets[i].classList.remove('active');
            }
        }
    }

    addDataItem(item, onClick, type = false) {
        const li = document.createElement('li');
        this.list.appendChild(li);
        // Current machine
        if (type) {
            li.setAttribute('data-id', type);
        }
        // status
        if (item['status'] == 1) {
            li.classList.add('emulated');
        } else if (item['status'] == 2) {
            li.classList.add('partially');
        } else {
            li.classList.add('unemulated');
        }
        // family
        // let temp = document.createElement('div');
        // temp.innerHTML = item['family'];
        // li.appendChild(temp);
        // model
        let temp = document.createElement('div');
        temp.innerHTML = item['model'];
        li.appendChild(temp);
        // memory
        temp = document.createElement('div');
        temp.innerHTML = item['tech']['ram'] + 'k';
        li.appendChild(temp);
        // year
        temp = document.createElement('div');
        temp.innerHTML = item['year'];
        li.appendChild(temp);
        // manufacturer
        temp = document.createElement('div');
        temp.innerHTML = item['manufacturer'];
        li.appendChild(temp);
        // type
        temp = document.createElement('div');
        temp.innerHTML = item['type'];
        li.appendChild(temp);
        // country
        temp = document.createElement('div');
        temp.innerHTML = item['country'];
        li.appendChild(temp);
        // lang
        temp = document.createElement('div');
        temp.innerHTML = item['lang'];
        li.appendChild(temp);
        // autoload usr0
        temp = document.createElement('div');
        if (item['tech']['usr0']) {
            temp.innerHTML = '<b class="check-ok">&#10004;<b>';
        } else {
            temp.innerHTML = '<b class="check-ko">&#10006;<b>';
        }
        li.appendChild(temp);
        // Comment
        temp = document.createElement('div');
        temp.innerHTML = item['comments'];
        li.appendChild(temp);

        if (onClick) {
            li.addEventListener('click', onClick);
        }

        return {
            setActive: () => {
                li.classList.add('active');
            },
            unsetActive: () => {
                li.classList.remove('active');
            }
        }
    }
    addDataHeader() {
        const li = document.createElement('li');
        li.classList.add('header');
        this.list.appendChild(li);
        // family
        // let temp = document.createElement('div');
        // temp.innerHTML = 'Family';
        // li.appendChild(temp);
        // model
        let temp = document.createElement('div');
        temp.innerHTML = 'Model';
        li.appendChild(temp);
        // memory
        temp = document.createElement('div');
        temp.innerHTML = 'Memory';
        li.appendChild(temp);
        // year
        temp = document.createElement('div');
        temp.innerHTML = 'Year';
        li.appendChild(temp);
        // manufacturer
        temp = document.createElement('div');
        temp.innerHTML = 'Manufacturer';
        li.appendChild(temp);
        // type
        temp = document.createElement('div');
        temp.innerHTML = 'Type';
        li.appendChild(temp);
        // country
        temp = document.createElement('div');
        temp.innerHTML = 'Country';
        li.appendChild(temp);
        // lang
        temp = document.createElement('div');
        temp.innerHTML = 'Lang';
        li.appendChild(temp);
        // autoload usr0
        temp = document.createElement('div');
        temp.innerHTML = 'Fast load';
        temp.style.textAlign = 'center';
        li.appendChild(temp);
        // comentarios
        temp = document.createElement('div');
        temp.innerHTML = 'Comments';
        li.appendChild(temp);
    }
}

export class inScreenKeyboard {
    constructor(container) {
        this.container = container;
        this.elem = document.createElement('div');
        this.elem.classList.add('js8bits-ui-keyboard');
        container.appendChild(this.elem);
        this.keyboard = new spectrum48KeyboardMap();
    }
    display() {
        if (this.elem.classList.contains('opened')) {
            this.elem.classList.remove('opened');
        } else {
            this.elem.classList.add('opened');
        }
    }
    updateKeyboard(newKeyboard, onClick) {
        if (newKeyboard == 'quorum64') {
            this.keyboard = new quorum64KeyboardMap();
        } else if (newKeyboard == 'spectrum128pes') {
            this.keyboard = new spectrum128pesKeyboardMap();
        } else if (newKeyboard == 'spectrum128p2') {
            this.keyboard = new spectrum128p2KeyboardMap();
        } else if (newKeyboard == 'spectrum128p') {
            this.keyboard = new spectrum128pKeyboardMap();
        } else {
            this.keyboard = new spectrum48KeyboardMap();
        }
        this.elem.innerHTML = "";
        this.addKeyboard(onClick);
    }
    addKeyboard(onClick) {
        const keys = this.keyboard.getKeyboardLayout();
        const innerContainer = document.createElement('div');
        this.elem.appendChild(innerContainer);
        const row = document.createElement('div');
        row.classList.add('keyboard-container');
        innerContainer.appendChild(row);
        Object.keys(keys).forEach(function (item) {
            let button = document.createElement('div');
            if (keys[item].hasOwnProperty('oneAction')) {
                button.classList.add('one-action-key');
            }
            if (keys[item].hasOwnProperty('shift')) {
                button.classList.add('shift-key');
            }
            if (keys[item].hasOwnProperty('gridColumn') && keys[item].gridColumn) {
                button.style.gridColumn = keys[item].gridColumn;
            }
            if (keys[item].hasOwnProperty('gridRow') && keys[item].gridRow) {
                button.style.gridRow = keys[item].gridRow;
            }
            let top1 = document.createElement('div');
            top1.classList.add('button-top1');
            top1.innerHTML = keys[item].top1 ? keys[item].top1 : "";
            button.appendChild(top1);
            let top2 = document.createElement('div');
            top2.classList.add('button-top2');
            top2.innerHTML = keys[item].top2 ? keys[item].top2 : "";
            button.appendChild(top2);
            let innerButton = document.createElement('div');
            innerButton.setAttribute('data-id', keys[item].id);
            if (keys[item].hasOwnProperty('shiftKey') && keys[item].shiftKey) {
                innerButton.setAttribute('data-shiftKey', keys[item].shiftKey);
            }
            if (keys[item].hasOwnProperty('shift')) {
                innerButton.setAttribute('data-shift', keys[item].shift);
            }
            innerButton.classList.add('button-inner');
            button.appendChild(innerButton);
            let inner1 = document.createElement('div');
            inner1.classList.add('button-inner1');
            inner1.innerHTML = keys[item].inner1 ? keys[item].inner1 : "";
            innerButton.appendChild(inner1);
            let inner2 = document.createElement('div');
            inner2.classList.add('button-inner2');
            inner2.innerHTML = keys[item].inner2 ? keys[item].inner2 : "";
            innerButton.appendChild(inner2);
            let inner3 = document.createElement('div');
            inner3.classList.add('button-inner3');
            inner3.innerHTML = keys[item].inner3 ? keys[item].inner3 : "";
            innerButton.appendChild(inner3);
            if (onClick) {
                innerButton.addEventListener('click', onClick);
            }
            let bottom = document.createElement('div');
            bottom.classList.add('button-bottom');
            bottom.innerHTML = keys[item].bottom ? keys[item].bottom : "";
            button.appendChild(bottom);
            row.appendChild(button);
        });
    }
}

export class Toolbar {
    constructor(container) {
        this.elem = document.createElement('div');
        this.elem.classList.add('js8bits-ui-toolbar');
        container.appendChild(this.elem);
        this.currentMouseenterEvent = null;
        this.currentMouseoutEvent = null;
    }
    addButton(opts, onClick, icon = false) {
        opts = opts || {};
        const button = new ToolbarButton(opts, onClick, icon);
        if (opts.align == 'right') button.elem.style.float = 'right';
        this.elem.appendChild(button.elem);
        return button;
    }
    enterFullscreen() {
        this.elem.style.position = 'absolute';
    }
    exitFullscreen() {
        this.elem.style.position = 'static';
    }
    show() {
        this.elem.style.visibility = 'visible';
    }
    hide() {
        this.elem.style.visibility = 'hidden';
    }
    onmouseenter(e) {
        if (this.currentMouseenterEvent) {
            this.elem.removeEventListener('mouseenter', this.currentMouseenterEvent);
        }
        if (e) {
            this.elem.addEventListener('mouseenter', e);
        }
        this.currentMouseenterEvent = e;
    }
    onmouseout(e) {
        if (this.currentMouseoutEvent) {
            this.elem.removeEventListener('mouseleave', this.currentMouseoutEvent);
        }
        if (e) {
            this.elem.addEventListener('mouseleave', e);
        }
        this.currentMouseoutEvent = e;
    }
}

class ToolbarButton {
    constructor(opts, onClick, icon) {
        this.elem = document.createElement('button');
        if (icon) {
            this.setIcon(icon);
            if (opts.label) this.setLabel(opts.label);
        } else {
            this.elem.innerHTML = '<b>' + opts.label + '<b>';
        }
        this.elem.addEventListener('click', onClick);
    }
    setIcon(icon) {
        this.elem.innerHTML = icon;
        this.elem.firstChild.style.height = '20px';
        this.elem.firstChild.style.verticalAlign = 'middle';
    }
    setLabel(label) {
        this.elem.title = label;
    }
    disable() {
        this.elem.disabled = true;
        this.elem.firstChild.style.opacity = '0.5';
    }
    enable() {
        this.elem.disabled = false;
        this.elem.firstChild.style.opacity = '1';
    }
}


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
            this.menuBar = new MenuBar(this.appContainer);
        }

        this.appContainer.appendChild(this.canvas);
        this.canvas.style.objectFit = 'contain';
        this.canvas.style.display = 'block';

        if (this.uiEnabled) {
            this.keyboard = new inScreenKeyboard(this.appContainer);
        }

        if (this.uiEnabled) {
            this.toolbar = new Toolbar(this.appContainer);
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
        if(this.standAlone) {
            this.container.classList.add('standalone');
            let windowHeight = window.innerHeight || document.documentElement.clientHeight;
            let windowWidth = window.innerWidth || document.documentElement.clientWidth;
            let canvasMaxWidth = windowWidth;
            let canvasMaxHeight = windowHeight - 84;
            if(windowWidth > windowHeight) {
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

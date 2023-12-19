import EventEmitter from 'events';

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
            console.log('client : '+this.container.parentNode.clientWidth);
            console.log('offset : '+this.container.parentNode.offsetWidth);
            console.log('scroll : '+this.container.parentNode.scrollWidth);
            this.list.style.width = (this.container.parentNode.parentNode.clientWidth - 10) + 'px';
            this.list.style.height = (this.container.parentNode.parentNode.clientHeight - 88) + 'px';
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
        let temp = document.createElement('div');
        temp.innerHTML = item['family'];
        li.appendChild(temp);
        // model
        temp = document.createElement('div');
        temp.innerHTML = item['model'];
        li.appendChild(temp);
        // memory
        temp = document.createElement('div');
        temp.innerHTML = item['memory'] + 'k';
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
        if (item['tape_usr0']) {
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
        let temp = document.createElement('div');
        temp.innerHTML = 'Family';
        li.appendChild(temp);
        // model
        temp = document.createElement('div');
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
    constructor(container, emulator, opts) {
        super();
        this.canvas = emulator.canvas;
        this.uiEnabled = ('uiEnabled' in opts) ? opts.uiEnabled : true;

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
            this.toolbar = new Toolbar(this.appContainer);
        }

        this.startButton = document.createElement('button');
        this.startButton.innerHTML = playIcon;
        this.appContainer.appendChild(this.startButton);
        this.startButton.style.position = 'absolute';
        this.startButton.style.top = '50%';
        this.startButton.style.left = '50%';
        this.startButton.style.width = '96px';
        this.startButton.style.height = '64px';
        this.startButton.style.marginLeft = '-48px';
        this.startButton.style.marginTop = '-32px';
        this.startButton.style.backgroundColor = 'rgba(160, 160, 160, 0.7)';
        this.startButton.style.border = 'none';
        this.startButton.style.borderRadius = '4px';
        this.startButton.firstChild.style.height = '56px';
        this.startButton.firstChild.style.verticalAlign = 'middle';
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

        this.setZoom(opts.zoom || 1);

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

    setZoom(factor) {
        this.zoom = factor;
        if (this.isFullscreen) {
            document.exitFullscreen();
            return;  // setZoom will be retriggered once fullscreen has exited
        }
        const displayWidth = 320 * this.zoom;
        const displayHeight = 240 * this.zoom;
        this.canvas.style.width = '' + displayWidth + 'px';
        this.canvas.style.height = '' + displayHeight + 'px';
        this.canvas.style.margin = 'auto';
        //this.appContainer.style.width = '' + displayWidth + 'px';
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

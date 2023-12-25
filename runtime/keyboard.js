import { spectrum48KeyboardMap } from './keyboardMaps/spectrum48.js';
import { spectrum128p2KeyboardMap } from './keyboardMaps/spectrum128p2.js';

export class KeyboardHandler {
    constructor(worker, rootElement, keyboard, devMode) {
        this.worker = worker;
        this.rootElement = rootElement;  // where we attach keyboard event listeners
        this.eventsAreBound = false;
        this.keyboard = keyboard;
        this.devMode = devMode;
        if (keyboard=='spectrum128p2') {
            this.keycodes = new spectrum128p2KeyboardMap().getKeyCodes();
        } else {
            this.keycodes = new spectrum48KeyboardMap().getKeyCodes();
        }


        this.keydownHandler = (evt) => {
            const keyCode = this.keycodes[evt.keyCode];

            if (keyCode) {
                this.worker.postMessage({
                    message: 'keyDown', row: keyCode.row, mask: keyCode.mask
                })
                if (keyCode.capshift) {
                    this.worker.postMessage({
                        message: 'keyDown', row: 0, mask: 0x01
                    })
                }
                if (keyCode.symshift) {
                    this.worker.postMessage({
                        message: 'keyDown', row: 7, mask: 0x02
                    })
                }
            }
            if (!evt.metaKey) evt.preventDefault();
            if (this.devMode) console.log('KEYDOWN: ' + evt.keyCode);
        };

        this.keyupHandler = (evt) => {
            const keyCode = this.keycodes[evt.keyCode];
            if (keyCode) {
                this.worker.postMessage({
                    message: 'keyUp', row: keyCode.row, mask: keyCode.mask,
                })
                if (keyCode.capshift) {
                    this.worker.postMessage({
                        message: 'keyUp', row: 0, mask: 0x01,
                    })
                }
                if (keyCode.symshift) {
                    this.worker.postMessage({
                        message: 'keyUp', row: 7, mask: 0x02
                    })
                }
            }
            if (!evt.metaKey) evt.preventDefault();
            if (this.devMode) console.log('KeyDown: ' + evt.keyCode);
        };

        this.keypressHandler = (evt) => {
            if (!evt.metaKey) evt.preventDefault();
        };
    }

    start() {
        this.rootElement.addEventListener('keydown', this.keydownHandler);
        this.rootElement.addEventListener('keyup', this.keyupHandler);
        this.rootElement.addEventListener('keypress', this.keypressHandler);
        this.eventsAreBound = true;
    }

    stop() {
        this.rootElement.removeEventListener('keydown', this.keydownHandler);
        this.rootElement.removeEventListener('keyup', this.keyupHandler);
        this.rootElement.removeEventListener('keypress', this.keypressHandler);
        this.eventsAreBound = false;
    }

    setRootElement(newRootElement) {
        if (this.eventsAreBound) {
            this.stop();
            this.rootElement = newRootElement;
            this.start();
        } else {
            this.rootElement = newRootElement;
        }
    }
}

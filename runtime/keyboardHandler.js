import { spectrum48KeyboardMap } from './keyboardMaps/spectrum48.js';
import { spectrum128pKeyboardMap } from './keyboardMaps/spectrum128p.js';
import { quorum64KeyboardMap } from './keyboardMaps/quorum64.js';
import { spectrum128pesKeyboardMap } from './keyboardMaps/spectrum128pes.js';
import { spectrum128p2KeyboardMap } from './keyboardMaps/spectrum128p2.js';

export class KeyboardHandler {
    constructor(worker, rootElement, keyboard, devMode) {
        this.worker = worker;
        this.rootElement = rootElement;  // where we attach keyboard event listeners
        this.eventsAreBound = false;
        this.keyboard = keyboard;
        this.devMode = devMode;
        if (keyboard == 'quorum64') {
            this.keycodes = new quorum64KeyboardMap().getKeyCodes();
        } else if (keyboard == 'spectrum128pes') {
            this.keycodes = new spectrum128pesKeyboardMap().getKeyCodes();
        } else if (keyboard == 'spectrum128p') {
            this.keycodes = new spectrum128pKeyboardMap().getKeyCodes();
        } else if (keyboard=='spectrum128p2') {
            this.keycodes = new spectrum128p2KeyboardMap().getKeyCodes();
        } else {
            this.keycodes = new spectrum48KeyboardMap().getKeyCodes();
        }

        this.keydownHandler = (evt) => {
            const keyCode = this.keycodes[evt.keyCode];

            if (keyCode) {
                this.worker.postMessage({
                    message: 'keyDown', id: evt.keyCode,
                })
                if (keyCode.shiftKey) {
                    this.worker.postMessage({
                        message: 'keyDown', id: Number(keyCode.shiftKey),
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
                    message: 'keyUp', id: evt.keyCode,
                })
                if (keyCode.shiftKey) {
                    this.worker.postMessage({
                        message: 'keyUp', id: Number(keyCode.shiftKey),
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
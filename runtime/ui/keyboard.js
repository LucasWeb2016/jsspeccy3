import { spectrum48KeyboardMap } from '../keyboardMaps/spectrum48.js';
import { spectrum128pKeyboardMap } from '../keyboardMaps/spectrum128p.js';
import { spectrum128pesKeyboardMap } from '../keyboardMaps/spectrum128pes.js';
import { spectrum128p2KeyboardMap } from '../keyboardMaps/spectrum128p2.js';
import { quorum64KeyboardMap } from '../keyboardMaps/quorum64.js';

export class uiKeyboard {
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

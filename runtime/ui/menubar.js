import { uiMenu } from './menu.js';

export class uiMenuBar {
  constructor(container) {
    this.elem = document.createElement('div');
    this.elem.id = 'js8bits-ui-bar';
    this.elem.classList.add('js8bits-ui-bar');
    container.appendChild(this.elem);
    this.currentMouseenterEvent = null;
    this.currentMouseoutEvent = null;
  }

  addMenu(title, type) {
    return new uiMenu(this.elem, title, type);
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

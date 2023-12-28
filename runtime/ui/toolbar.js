import { uiToolbarButton } from './toolbarbutton.js';

export class uiToolbar {
  constructor(container) {
    this.elem = document.createElement('div');
    this.elem.classList.add('js8bits-ui-toolbar');
    container.appendChild(this.elem);
    this.currentMouseenterEvent = null;
    this.currentMouseoutEvent = null;
  }
  addButton(opts, onClick, icon = false) {
    opts = opts || {};
    const button = new uiToolbarButton(opts, onClick, icon);
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

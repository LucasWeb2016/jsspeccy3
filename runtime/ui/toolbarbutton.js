export class uiToolbarButton {
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

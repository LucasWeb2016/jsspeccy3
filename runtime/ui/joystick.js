export class uiJoystick {
  constructor(container) {
    this.container = container;
    this.elem = document.createElement('div');
    this.elem.classList.add('js8bits-ui-joystick');
    container.appendChild(this.elem);
  }
  display() {
    if (this.elem.classList.contains('opened')) {
      this.elem.classList.remove('opened');
    } else {
      this.elem.classList.add('opened');
    }
  }
  addJoystick(onClick) {
    const innerContainer = document.createElement('div');
    innerContainer.setAttribute('data-type', 'sinclair');
    this.elem.appendChild(innerContainer);
    const rowSelect = document.createElement('div');
    rowSelect.classList.add('select-container');
    innerContainer.appendChild(rowSelect);
    let selectType = document.createElement('select');
    selectType.classList.add('joystick-select');
    rowSelect.appendChild(selectType);
    let option = document.createElement("option");
    option.value = 'interface22';
    option.text = 'Interface II (Right port)';
    selectType.appendChild(option);
    option = document.createElement("option");
    option.value = 'interface21';
    option.text = 'Interface II (Left port)';
    selectType.appendChild(option);
    option = document.createElement("option");
    option.value = 'kempston';
    option.text = 'Kempston';
    selectType.appendChild(option);
    option = document.createElement("option");
    option.value = 'cursor';
    option.text = 'Protek/AGF Cursor';
    selectType.appendChild(option);
    selectType.addEventListener('change', function () {
      innerContainer.setAttribute('data-type', this.value);
    });
    const rowDirection = document.createElement('div');
    rowDirection.classList.add('direction-container');
    innerContainer.appendChild(rowDirection);
    let button = document.createElement('div');
    button.classList.add('button-up');
    button.setAttribute('data-action','up');
    button.innerHTML = "&#129153;";
    button.addEventListener('click', onClick);
    rowDirection.appendChild(button);
    button = document.createElement('div');
    button.classList.add('button-down');
    button.setAttribute('data-action', 'down');
    button.innerHTML = "&#129155;";
    button.addEventListener('click', onClick);
    rowDirection.appendChild(button);
    button = document.createElement('div');
    button.classList.add('button-left');
    button.setAttribute('data-action', 'left');
    button.innerHTML = "&#129152;";
    button.addEventListener('click', onClick);
    rowDirection.appendChild(button);
    button = document.createElement('div');
    button.classList.add('button-right');
    button.setAttribute('data-action', 'right');
    button.innerHTML = "&#129154;";
    button.addEventListener('click', onClick);
    rowDirection.appendChild(button);
    let separator = document.createElement('div');
    separator.classList.add('button-separator');
    rowDirection.appendChild(separator);
    const rowFire = document.createElement('div');
    rowFire.classList.add('fire-container');
    innerContainer.appendChild(rowFire);
    button = document.createElement('div');
    button.classList.add('button-fire');
    button.setAttribute('data-action', 'fire');
    button.addEventListener('click', onClick);
    rowFire.appendChild(button);
  }
}

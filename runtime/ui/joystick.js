export class uiJoystick {
  constructor(container) {
    this.container = container;
    this.elem = document.createElement('div');
    this.elem.classList.add('js8bits-ui-joystick');
    container.appendChild(this.elem);
  }

  display() {
    this.elem.classList.toggle('opened');
  }

  addJoystick(onClick) {
    const innerContainer = this.createInnerContainer();
    this.elem.appendChild(innerContainer);

    const rowSelect = this.createRowSelect(innerContainer);
    innerContainer.appendChild(rowSelect);

    const rowDirection = this.createRowDirection(onClick);
    innerContainer.appendChild(rowDirection);

    const rowFire = this.createRowFire(onClick);
    innerContainer.appendChild(rowFire);
  }

  createInnerContainer() {
    const innerContainer = document.createElement('div');
    innerContainer.setAttribute('data-type', 'sinclair');
    return innerContainer;
  }

  createRowSelect(innerContainer) {
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
    return rowSelect;
  }

  createRowDirection(onClick) {
    const rowDirection = document.createElement('div');
    rowDirection.classList.add('direction-container');
    let button = document.createElement('div');
    button.classList.add('button-up');
    button.setAttribute('data-action', 'up');
    button.innerHTML = "🢁";
    button.addEventListener('click', onClick);
    rowDirection.appendChild(button);
    button = document.createElement('div');
    button.classList.add('button-down');
    button.setAttribute('data-action', 'down');
    button.innerHTML = "🢃";
    button.addEventListener('click', onClick);
    rowDirection.appendChild(button);
    button = document.createElement('div');
    button.classList.add('button-left');
    button.setAttribute('data-action', 'left');
    button.innerHTML = "🢀";
    button.addEventListener('click', onClick);
    rowDirection.appendChild(button);
    button = document.createElement('div');
    button.classList.add('button-right');
    button.setAttribute('data-action', 'right');
    button.innerHTML = "🢂";
    button.addEventListener('click', onClick);
    rowDirection.appendChild(button);
    let separator = document.createElement('div');
    separator.classList.add('button-separator');
    rowDirection.appendChild(separator);
    return rowDirection;
  }

  createRowFire(onClick) {
    const rowFire = document.createElement('div');
    rowFire.classList.add('fire-container');
    let button = document.createElement('div');
    button.classList.add('button-fire');
    button.setAttribute('data-action', 'fire');
    button.addEventListener('click', onClick);
    rowFire.appendChild(button);
    return rowFire;
  }
}


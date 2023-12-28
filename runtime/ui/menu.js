export class uiMenu {
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
    const targets = this.list.childNodes;
    targets.forEach(target => {
      if (target.getAttribute('data-id') == type) {
        target.classList.add('active');
      } else {
        target.classList.remove('active');
      }
    });
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

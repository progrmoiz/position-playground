const addBoxBtn = document.querySelector('.add-box');
const controls = document.querySelector('.controls');

const output = window.frames[0].document;
const boxes = output.createElement('div');
output.body.style.overflow = 'hidden';
output.body.appendChild(boxes);

boxes.classList.add('box-set');
let boxCount = 1;

const maxCountLimit = 1000;

const fieldSetTemplate = `
  <label for="set-position">
  Position
  <select name="set-position" class="js-position">
    <option value="static">Static</option>
    <option value="relative" selected>Relative</option>
    <option value="absolute">Absolute</option>
    <option value="fixed">Fixed</option>
  </select>
  </label>
  <br>
  <label for="set-topoffset">
    Top Offset
    <input type="range" step="10" max="${maxCountLimit}" name="set-topoffset" class="js-topoffset">
  </label>
  <br>
  <label for="set-bottomoffset">
    Bottom Offset
    <input type="range" step="10" max="${maxCountLimit}" name="set-bottomoffset" class="js-bottomoffset">
  </label>
  <br>
  <label for="set-leftoffset">
    Left Offset
    <input type="range" step="10" max="${maxCountLimit}" name="set-leftoffset" class="js-leftoffset">
  </label>
  <br>
  <label for="set-rightoffset">
    Right Offset
    <input type="range" step="10" max="${maxCountLimit}" name="set-rightoffset" class="js-rightoffset">
  </label>
  <br>
  <label for="set-width">
    Width
    <select name="set-width" class="js-width">
      <option value="auto">Auto</option>
      <option value="50">50px</option>
      <option value="80">80px</option>
      <option value="100" selected>100px</option>
      <option value="200">200px</option>
      <option value="500">500px</option>
    </select>
  </label>
  <br>
  <label for="set-height">
    Height
    <select name="set-height" class="js-height">
      <option value="auto">Auto</option>
      <option value="50">50px</option>
      <option value="80">80px</option>
      <option value="100" selected>100px</option>
      <option value="200">200px</option>
      <option value="500">500px</option>
    </select>
  </label>
  `

const boxList = [];
const colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];

function addBoxHandler(e) {
  // const box = output.createElement('div');
  // box.appendChild(output.createTextNode(`box-${count}`))
  // box.classList.add(`box-${count}`);
  // box.style.background = 'red';
  // box.style.width = '100px';
  // box.style.height = '100px';
  // boxes.appendChild(box);

  var control = new BoxControlView()

  boxList.push(control);
  console.log(boxList);
}

addBoxBtn.addEventListener('click', addBoxHandler);

class BoxControlView {

  constructor() {
    this.box = new Box();
    this.view = new BoxView(this.box);

    const {id, _count: count} = this.box;

    // create element field and import our template
    const fieldSet = output.createElement('fieldset');
    fieldSet.setAttribute('id', id);

    const legend = output.createElement('legend');
    legend.appendChild(output.createTextNode(`Box ${count}`));

    fieldSet.appendChild(legend);
    fieldSet.innerHTML += fieldSetTemplate;

    controls.appendChild(fieldSet);
    this.fieldSet = fieldSet;

    let fields = this._getFields();
    fields = Object.keys(fields).map(function(k) {
      return fields[k];
    });
    fields.forEach((field, i) => {
      field.addEventListener('input', (e) => {
        this.onUpdate(field, e)
      })
    });
  }

  _getFields() {
    const position = this.fieldSet.querySelector('.js-position');
    const topoffset = this.fieldSet.querySelector('.js-topoffset');
    const bottomoffset = this.fieldSet.querySelector('.js-bottomoffset');
    const leftoffset = this.fieldSet.querySelector('.js-leftoffset');
    const rightoffset = this.fieldSet.querySelector('.js-rightoffset');
    const width = this.fieldSet.querySelector('.js-width');
    const height = this.fieldSet.querySelector('.js-height');

    return {
      position, topoffset, bottomoffset, leftoffset, rightoffset, width, height
    }
  }

  onUpdate(input, evt) {
    const map = new Map();
    map.set('js-position', 'position')
    map.set('js-topoffset', 'offsetTop')
    map.set('js-bottomoffset', 'offsetBottom')
    map.set('js-leftoffset', 'offsetLeft')
    map.set('js-rightoffset', 'offsetRight')
    map.set('js-width', 'width')
    map.set('js-height', 'height')

    this.box[map.get(input.classList.value)] = parseInt(input.value) || input.value;
    this.view.setStyles(this.box);
  }

  getValues() {

  }

}

class Box {
  constructor({
    position = 'relative',
    offsetTop = 0,
    offsetBottom = 0,
    offsetLeft = 0,
    offsetRight = 0,
    width = 100,
    height = 100 } = {}) {

    this._count = boxCount;
    this.id = `box-${this._count}`

    this.position = position;
    this.offsetTop = offsetTop;
    this.offsetBottom = offsetBottom;
    this.offsetLeft = offsetLeft;
    this.offsetRight = offsetRight;
    this.width = width;
    this.height = height;
    this.background = colors[Math.floor(Math.random() * colors.length)];

    // we need to get updated of ids
    boxCount += 1;
  }

  get position() {
    return this._position;
  }

  set position(x) {
    const valid = ['static', 'relative', 'absolute', 'fixed'];
    if (typeof x === 'string' && valid.indexOf(x) !== -1) {
      this._position = x;
    } else {
      console.error(new Error(`Position value can only be one of ${valid}`));
    }
  }

  get offsetTop() {
    return this._offsetTop.toString() + 'px';
  }
  get offsetBottom() {
    return this._offsetBottom.toString() + 'px';
  }
  get offsetLeft() {
    return this._offsetLeft.toString() + 'px';
  }
  get offsetRight() {
    return this._offsetRight.toString() + 'px';
  }

  set offsetTop(x) {
    if (typeof x !== 'number') {
      console.error(new Error('Offset must be number'));
    } else {
      this._offsetTop = x;
    }
  }
  set offsetBottom(x) {
    if (typeof x !== 'number') {
      console.error(new Error('Offset must be number'));
    } else {
      this._offsetBottom = x;
    }
  }
  set offsetLeft(x) {
    if (typeof x !== 'number') {
      console.error(new Error('Offset must be number'));
    } else {
      this._offsetLeft = x;
    }
  }
  set offsetRight(x) {
    if (typeof x !== 'number') {
      console.error(new Error('Offset must be number'));
    } else {
      this._offsetRight = x;
    }
  }

  get width() {
    return this._width === 'auto'
         ? 'auto'
         : this._width.toString() + 'px';
  }
  get height() {
    return this._height === 'auto'
         ? 'auto'
         : this._height.toString() + 'px';
  }

  set width(x) {
    if (x !== 'auto' && typeof x !== 'number') {
      console.error(new Error('Width must be number'));
    } else {
      this._width = x;
    }
  }

  set height(x) {
    if (x !== 'auto' && typeof x !== 'number') {
      console.error(new Error('Height must be number'));
    } else {
      this._height = x;
    }
  }
}

class BoxView {
    constructor(box) {
      this.id = box.id;
      // calling this.createBox() creates and return elm
      this._elm = this.createBox(box.id);
      this.setStyles(box);
    }

    createBox(id) {
      const elm = output.createElement('div');
      elm.classList.add('box');
      elm.classList.add(id);
      elm.setAttribute('id', id);
      boxes.appendChild(elm);
      return elm;
    }

    getView() {
      return this._elm;
    }

    removeView() {
      try {
        this._elm.remove();
        return true;
      }
      catch(e) {
        return false;
      }
    }

    setStyles(box) {
      const elmCss = this._elm.style;
      elmCss.background = box.background;
      elmCss.opacity = '0.7';
      elmCss.width = box.width;
      elmCss.height = box.height;
      elmCss.position = box.position;
      elmCss.top = box.offsetTop;
      elmCss.bottom = box.offsetBottom;
      elmCss.left = box.offsetLeft;
      elmCss.right = box.offsetRight;
    }
}

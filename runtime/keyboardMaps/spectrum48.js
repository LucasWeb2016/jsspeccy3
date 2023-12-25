export class spectrum48KeyboardMap {
  constructor() {
    this.keycodes = {

      // Row 0
      49: { row: 3, mask: 0x01, type: 'key', layoutRowOrder: 1, top1: 'BLUE', top2: 'EDIT', inner1: '1', inner2: '<div class="zx-key one"><span></span></div>', inner3: '!', bottom: 'DEF FN' }, /* 1 */
      50: { row: 3, mask: 0x02, type: 'key', layoutRowOrder: 2, top1: 'RED', top2: 'CAPSLOCK', inner1: '2', inner2: '<div class="zx-key two"><span></span></div>', inner3: '@', bottom: 'FN' }, /* 2 */
      51: { row: 3, mask: 0x04, type: 'key', layoutRowOrder: 3, top1: 'MAGENTA', top2: 'TRUEVIDEO', inner1: '3', inner2: '<div class="zx-key three"><span></span></div>', inner3: '#', bottom: 'LINE' }, /* 3 */
      52: { row: 3, mask: 0x08, type: 'key', layoutRowOrder: 4, top1: 'GREEN', top2: 'INVVIDEO', inner1: '4', inner2: '<div class="zx-key four"><span></span></div>', inner3: '$', bottom: 'OPEN#' }, /* 4 */
      53: { row: 3, mask: 0x10, type: 'key', layoutRowOrder: 5, top1: 'CYAN', top2: '&#129092;', inner1: '5', inner2: '<div class="zx-key five"><span></span></div>', inner3: '%', bottom: 'CLOSE#' }, /* 5 */
      54: { row: 4, mask: 0x10, type: 'key', layoutRowOrder: 6, top1: 'YELLOW', top2: '&#129095;', inner1: '6', inner2: '<div class="zx-key six"><span></span><span></span></div>', inner3: '&', bottom: 'MOVE' }, /* 6 */
      55: { row: 4, mask: 0x08, type: 'key', layoutRowOrder: 7, top1: 'WHITE', top2: '&#129093;', inner1: '7', inner2: '<div class="zx-key seven"><span></span></div>', inner3: '\'', bottom: 'ERASE' }, /* 7 */
      56: { row: 4, mask: 0x04, type: 'key', layoutRowOrder: 8, top2: '&#129094;', inner1: '8', inner2: '<div class="zx-key nine"></div>', inner3: '(', bottom: 'POINT' }, /* 8 */
      57: { row: 4, mask: 0x02, type: 'key', layoutRowOrder: 9, top2: 'GRAPHICS', inner1: '9', inner3: ')', bottom: 'CAT' }, /* 9 */
      48: { row: 4, mask: 0x01, type: 'key', layoutRowOrder: 10, top1: 'BLACK', top2: 'DELETE', inner1: '0', inner3: '_', bottom: 'FORMAT' }, /* 0 */

      // Row 1
      81: { row: 2, mask: 0x01, type: 'key', layoutRowOrder: 11, top2: 'SIN', inner1: 'Q', inner2: '<=', inner3: 'PLOT', bottom: 'ASN' }, /* Q */
      87: { row: 2, mask: 0x02, type: 'key', layoutRowOrder: 12, top2: 'COS', inner1: 'W', inner2: '<>', inner3: 'DRAW', bottom: 'ACS' }, /* W */
      69: { row: 2, mask: 0x04, type: 'key', layoutRowOrder: 13, top2: 'TAN', inner1: 'E', inner2: '>=', inner3: 'REM', bottom: 'ATN' }, /* E */
      82: { row: 2, mask: 0x08, type: 'key', layoutRowOrder: 14, top2: 'INT', inner1: 'R', inner2: '<', inner3: 'RUN', bottom: 'VERIFY' }, /* R */
      84: { row: 2, mask: 0x10, type: 'key', layoutRowOrder: 15, top2: 'RND', inner1: 'T', inner2: '>', inner3: 'RAND', bottom: 'MERGE' }, /* T */
      89: { row: 5, mask: 0x10, type: 'key', layoutRowOrder: 16, top2: 'STR$', inner1: 'Y', inner2: 'AND', inner3: 'RETURN', bottom: '[' }, /* Y */
      85: { row: 5, mask: 0x08, type: 'key', layoutRowOrder: 17, top2: 'CHR$', inner1: 'U', inner2: 'OR', inner3: 'IF', bottom: ']' }, /* U */
      73: { row: 5, mask: 0x04, type: 'key', layoutRowOrder: 18, top2: 'CODE', inner1: 'I', inner2: 'AT', inner3: 'INPUT', bottom: 'IN' }, /* I */
      79: { row: 5, mask: 0x02, type: 'key', layoutRowOrder: 19, top2: 'PEEK', inner1: 'O', inner2: ';', inner3: 'POKE', bottom: 'OUT' }, /* O */
      80: { row: 5, mask: 0x01, type: 'key', layoutRowOrder: 20, top2: 'TAB', inner1: 'P', inner2: '\"', inner3: 'PRINT', bottom: '&#169;' }, /* P */

      // Row 2
      65: { row: 1, mask: 0x01, type: 'key', layoutRowOrder: 21, top2: 'READ', inner1: 'A', inner2: 'STOP', inner3: 'NEW', bottom: '&#126;' }, /* A */
      83: { row: 1, mask: 0x02, type: 'key', layoutRowOrder: 22, top2: 'RESTORE', inner1: 'S', inner2: 'NOT', inner3: 'SAVE', bottom: '|' }, /* S */
      68: { row: 1, mask: 0x04, type: 'key', layoutRowOrder: 23, top2: 'DATA', inner1: 'D', inner2: 'STEP', inner3: 'DIM', bottom: '\\' }, /* D */
      70: { row: 1, mask: 0x08, type: 'key', layoutRowOrder: 24, top2: 'SGN', inner1: 'F', inner2: 'TO', inner3: 'FOR', bottom: '{' }, /* F */
      71: { row: 1, mask: 0x10, type: 'key', layoutRowOrder: 25, top2: 'ABS', inner1: 'G', inner2: 'THEN', inner3: 'GOTO', bottom: '}' }, /* G */
      72: { row: 6, mask: 0x10, type: 'key', layoutRowOrder: 26, top2: 'SQR', inner1: 'H', inner2: '&#8593;', inner3: 'GOSUB', bottom: 'CIRCLE' }, /* H */
      74: { row: 6, mask: 0x08, type: 'key', layoutRowOrder: 27, top2: 'VAL', inner1: 'J', inner2: '-', inner3: 'LOAD', bottom: 'VAL$' }, /* J */
      75: { row: 6, mask: 0x04, type: 'key', layoutRowOrder: 28, top2: 'LEN', inner1: 'K', inner2: '+', inner3: 'LIST', bottom: 'SCREEN$' }, /* K */
      76: { row: 6, mask: 0x02, type: 'key', layoutRowOrder: 29, top2: 'USR', inner1: 'L', inner2: '=', inner3: 'LET', bottom: 'ATTR' }, /* L */
      13: { row: 6, mask: 0x01, type: 'key', layoutRowOrder: 30, inner1: 'ENTER', oneaction:true }, /* enter */

      // Row 3
      16: { row: 0, mask: 0x01, type: 'key', layoutRowOrder: 31, inner1: 'CAPS<br/>SHIFT', shift: true, oneaction:true }, /* caps */
      90: { row: 0, mask: 0x02, type: 'key', layoutRowOrder: 32, top2: 'LN', inner1: 'Z', inner2: ":", inner3: 'COPY', bottom: 'BEEP' }, /* Z */
      88: { row: 0, mask: 0x04, type: 'key', layoutRowOrder: 33, top2: 'EXP', inner1: 'X', inner2: "&pound;", inner3: 'CLEAR', bottom: 'INK' }, /* X */
      67: { row: 0, mask: 0x08, type: 'key', layoutRowOrder: 34, top2: 'LPRINT', inner1: 'C', inner2: "?", inner3: 'CONT', bottom: 'PAPER' }, /* C */
      86: { row: 0, mask: 0x10, type: 'key', layoutRowOrder: 35, top2: 'LLIST', inner1: 'V', inner2: "/", inner3: 'CLS', bottom: 'FLASH' }, /* V */
      66: { row: 7, mask: 0x10, type: 'key', layoutRowOrder: 36, top2: 'BIN', inner1: 'B', inner2: "*", inner3: 'BORDER', bottom: 'BRIGHT' }, /* B */
      78: { row: 7, mask: 0x08, type: 'key', layoutRowOrder: 37, top2: 'INKEY$', inner1: 'N', inner2: ",", inner3: 'NEXT', bottom: 'OVER' }, /* N */
      77: { row: 7, mask: 0x04, type: 'key', layoutRowOrder: 38, top2: 'PI', inner1: 'M', inner2: ".", inner3: 'PAUSE', bottom: 'INVERSE' }, /* M */
      17: { row: 7, mask: 0x02, type: 'key', layoutRowOrder: 39, inner1: 'SYM<br/>SHIFT', shift: true, oneaction:true }, /* sym - gah, firefox screws up ctrl+key too */
      32: { row: 7, mask: 0x01, type: 'key', layoutRowOrder: 40, inner1: 'BREAK<br/>SPACE', oneaction: true }, /* space */

      /* extra - shifted combinations for using common existing PC Keys */
      192: { row: 0, mask: 0x01, type: 'workaroud' }, /* backtick as caps - because firefox screws up a load of key codes when pressing shift */
      8: { row: 4, mask: 0x01, shiftKey: 16, type: 'workaroud' }, /* backspace => caps + 0 */
      37: { row: 3, mask: 0x10, shiftKey: 16, type: 'workaroud'}, /* left arrow => caps + 5 */
      38: { row: 4, mask: 0x08, shiftKey: 16, type: 'workaroud'}, /* up arrow => caps + 7 */
      39: { row: 4, mask: 0x04, shiftKey: 16, type: 'workaroud'}, /* right arrow => caps + 8 */
      40: { row: 4, mask: 0x10, shiftKey: 16, type: 'workaroud' }, /* down arrow => caps + 6 */
    };
  };
  getKeyCodes() {
    return this.keycodes;
  }
  getKeyboardLayout() {
    let codesArray = [];
    const codesObject = this.keycodes;
    Object.keys(codesObject).forEach(function (item) {
      if (codesObject[item].type == 'key') {
        let tempObject = codesObject[item];
        tempObject['id'] = item;
        codesArray.push(tempObject);
      }
    });
    codesArray.sort(function (a, b) {
      if (a.layoutRowOrder < b.layoutRowOrder) {
        return -1;
      }
      if (a.layoutRowOrder > b.layoutRowOrder) {
        return 1;
      }
      return 0;
    });
    return codesArray;
  }
}

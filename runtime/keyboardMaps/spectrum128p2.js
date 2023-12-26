export class spectrum128p2KeyboardMap {
  constructor() {
    this.keycodes = {
      220: { row: 3, mask: 0x04, shiftKey: 16, type: 'key', layoutRowOrder: 1, inner1: 'TRUE<br/>VIDEO', oneAction: true }, /* TRUE VIDEO (º PC Key)) */
      187: { row: 3, mask: 0x08, shiftKey: 16, type: 'key', layoutRowOrder: 2, inner1: 'INV<br/>VIDEO', oneAction: true }, /* INV VIDEO (+ PC Key) */
      49: { row: 3, mask: 0x01, type: 'key', layoutRowOrder: 3, inner1: '1', inner2: '!' }, /* 1 (1 PC Key) */
      50: { row: 3, mask: 0x02, type: 'key', layoutRowOrder: 4, inner1: '2', inner2: '@' }, /* 2 (2 PC Key)*/
      51: { row: 3, mask: 0x04, type: 'key', layoutRowOrder: 5, inner1: '3', inner2: '#' }, /* 3 (3 PC Key)*/
      52: { row: 3, mask: 0x08, type: 'key', layoutRowOrder: 6, inner1: '4', inner2: '$' }, /* 4 (4 PC Key)*/
      53: { row: 3, mask: 0x10, type: 'key', layoutRowOrder: 7, inner1: '5', inner2: '%' }, /* 5 (5 PC Key)*/
      54: { row: 4, mask: 0x10, type: 'key', layoutRowOrder: 8, inner1: '6', inner2: '&' }, /* 6 (6 PC Key)*/
      55: { row: 4, mask: 0x08, type: 'key', layoutRowOrder: 9, inner1: '7', inner2: '\'' }, /* 7 (7 PC Key)*/
      56: { row: 4, mask: 0x04, type: 'key', layoutRowOrder: 10, inner1: '8', inner2: '(' }, /* 8 (8 PC Key)*/
      57: { row: 4, mask: 0x02, type: 'key', layoutRowOrder: 11, inner1: '9', inner3: ')' }, /* 9 (9 PC Key)*/
      48: { row: 4, mask: 0x01, type: 'key', layoutRowOrder: 12, inner1: '0', inner3: '_' }, /* 0 (0 PC Key)*/
      219: { row: 7, mask: 0x01, shiftKey: 16, type: 'key', layoutRowOrder: 13, inner1: 'BREAK', oneAction: true }, /* BREAK (' PC Key) */

      8: { row: 4, mask: 0x01, shiftKey: 16, type: 'key', layoutRowOrder: 14, inner1: 'DELETE', oneAction: true }, /* Delete (Delete PC Key) */
      9: { row: 4, mask: 0x02, shiftKey: 16, type: 'key', layoutRowOrder: 15, inner1: 'GRAPH', oneAction: true }, /* GRAPH (Tab PC Key)  */
      81: { row: 2, mask: 0x01, type: 'key', layoutRowOrder: 16, inner1: 'Q' }, /* Q (Q PC Key) */
      87: { row: 2, mask: 0x02, type: 'key', layoutRowOrder: 17, inner1: 'W' }, /* W (W PC Key) */
      69: { row: 2, mask: 0x04, type: 'key', layoutRowOrder: 18, inner1: 'E' }, /* E (E PC Key) */
      82: { row: 2, mask: 0x08, type: 'key', layoutRowOrder: 19, inner1: 'R', inner2: '<', inner3: 'RUN' }, /* R (R PC Key) */
      84: { row: 2, mask: 0x10, type: 'key', layoutRowOrder: 20, inner1: 'T', inner2: '>' }, /* T (T PC Key) */
      89: { row: 5, mask: 0x10, type: 'key', layoutRowOrder: 21, inner1: 'Y' }, /* Y (Y PC Key) */
      85: { row: 5, mask: 0x08, type: 'key', layoutRowOrder: 22, inner1: 'U' }, /* U (U PC Key) */
      73: { row: 5, mask: 0x04, type: 'key', layoutRowOrder: 23, inner1: 'I', inner2: 'CODE' }, /* I (I PC Key) */
      79: { row: 5, mask: 0x02, type: 'key', layoutRowOrder: 24, inner1: 'O' }, /* O (O PC Key) */
      80: { row: 5, mask: 0x01, type: 'key', layoutRowOrder: 25, inner1: 'P' }, /* P (P PC Key) */

      20: { row: 7, mask: 0x02, shiftKey: 16, type: 'key', layoutRowOrder: 26, inner1: 'EXTEND MODE', oneAction: true, gridColumn: '1 / 3', gridRow: '3' }, /* EXTEND MODE (Caps lock PC Key) */
      221: { row: 3, mask: 0x01, shiftKey: 16, type: 'key', layoutRowOrder: 27, inner1: 'EDIT', oneAction: true }, /* EDIT (¡ PC Key)  */
      65: { row: 1, mask: 0x01, type: 'key', layoutRowOrder: 28, inner1: 'A' }, /* A (A PC Key) */
      83: { row: 1, mask: 0x02, type: 'key', layoutRowOrder: 29, inner1: 'S' }, /* S (S PC Key) */
      68: { row: 1, mask: 0x04, type: 'key', layoutRowOrder: 30, inner1: 'D' }, /* D (D PC Key) */
      70: { row: 1, mask: 0x08, type: 'key', layoutRowOrder: 31, inner1: 'F' }, /* F (F PC Key) */
      71: { row: 1, mask: 0x10, type: 'key', layoutRowOrder: 32, inner1: 'G' }, /* G (G PC Key) */
      72: { row: 6, mask: 0x10, type: 'key', layoutRowOrder: 33, inner1: 'H', inner2: '&#8593;' }, /* H (H PC Key) */
      74: { row: 6, mask: 0x08, type: 'key', layoutRowOrder: 34, inner1: 'J', inner2: '-', inner3: 'LOAD' }, /* J (J PC Key) */
      75: { row: 6, mask: 0x04, type: 'key', layoutRowOrder: 35, inner1: 'K', inner2: '+' }, /* K (K PC Key) */
      76: { row: 6, mask: 0x02, type: 'key', layoutRowOrder: 36, inner1: 'L', inner2: '=' }, /* L (L PC Key) */
      13: { row: 6, mask: 0x01, type: 'key', layoutRowOrder: 38, inner1: 'ENTER', oneAction: true, gridColumn: '13 / 14', gridRow: '2 / 4' }, /* Enter (Enter PC Key) */

      500: { row: 0, mask: 0x01, type: 'key', layoutRowOrder: 39, inner1: 'CAPS SHIFT', shift: true, oneAction: true, gridColumn: '1 / 3', gridRow: '4' }, /* CAPS SHIFT LEFT (Shift PC Key) */
      226: { row: 3, mask: 0x02, shiftKey: 16, type: 'key', layoutRowOrder: 40, inner1: 'CAPS LOCK', oneAction: true, lock: true }, /* CAPS LOCK (<> PC Key)  */
      90: { row: 0, mask: 0x02, type: 'key', layoutRowOrder: 41, inner1: 'Z', inner2: ":" }, /* Z (Z PC Key) */
      88: { row: 0, mask: 0x04, type: 'key', layoutRowOrder: 42, inner1: 'X', inner2: "&pound;" }, /* X (X PC Key) */
      67: { row: 0, mask: 0x08, type: 'key', layoutRowOrder: 43, inner1: 'C', inner2: '?' }, /* C (C PC Key) */
      86: { row: 0, mask: 0x10, type: 'key', layoutRowOrder: 44, inner1: 'V', inner2: "/" }, /* V (V PC Key) */
      66: { row: 7, mask: 0x10, type: 'key', layoutRowOrder: 45, inner1: 'B', inner2: "*" }, /* B (B PC Key) */
      78: { row: 7, mask: 0x08, type: 'key', layoutRowOrder: 46, inner1: 'N' }, /* N (N PC Key) */
      77: { row: 7, mask: 0x04, type: 'key', layoutRowOrder: 47, inner1: 'M' }, /* M (M PC Key) */
      190: { row: 7, mask: 0x04, shiftKey: 17, type: 'key', layoutRowOrder: 48, inner1: '.' }, /* . (. PC Key) */
      16: { row: 0, mask: 0x01, type: 'key', layoutRowOrder: 49, inner1: 'CAPS SHIFT', shift: true, oneAction: true, gridColumn: '12 / 14', gridRow: '4' },  /* CAPS SHIFT RIGHT (RIGHT LEFT PC Key) */

      17: { row: 7, mask: 0x02, type: 'key', layoutRowOrder: 50, inner1: 'SYMB<br/>SHIFT', shift: true, oneAction: true }, /* SYMB SHIF (CTRL PC Key) */
      189: { row: 5, mask: 0x02, shiftKey: 17, type: 'key', layoutRowOrder: 51, inner1: ';' }, /* ; (- PC key)*/
      222: { row: 5, mask: 0x01, shiftKey: 17, type: 'key', layoutRowOrder: 52, inner1: '"' }, /* " (´ PC key)*/
      37: { row: 3, mask: 0x10, shiftKey: 16, type: 'key', layoutRowOrder: 53, inner1: '&#129144;' }, /* Left arrow (Left arrow PC Key) */
      39: { row: 4, mask: 0x04, shiftKey: 16, type: 'key', layoutRowOrder: 54, inner1: '&#129146;' }, /* Right arrow (Right arrow PC Key) */
      32: { row: 7, mask: 0x01, type: 'key', layoutRowOrder: 55, oneAction: true, gridColumn: '6 / 10' }, /* space (Space PC Key) */
      38: { row: 4, mask: 0x08, shiftKey: 16, type: 'key', layoutRowOrder: 56, inner1: '&#129145;' }, /* Up arrow (Up arrow PC Key) */
      40: { row: 4, mask: 0x10, shiftKey: 16, type: 'key', layoutRowOrder: 57, inner1: '&#129147;' }, /* Down arrow (Down arrow PC Key) */
      188: { row: 7, mask: 0x08, shiftKey: 17, type: 'key', layoutRowOrder: 58, inner1: ',' }, /* " */
      501: { row: 7, mask: 0x02, type: 'key', layoutRowOrder: 59, inner1: 'SYMB<br/>SHIFT', shift: true, oneAction: true }, /* SYMB SHIF (CTRL PC Key) */
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

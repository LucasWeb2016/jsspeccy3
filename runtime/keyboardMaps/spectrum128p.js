export class spectrum128pKeyboardMap {
  constructor() {
    this.keycodes = {
      220: { row: 3, mask: 0x04, shiftKey: 16, type: 'key', layoutRowOrder: 1, inner1: 'TRUE<br/>VIDEO', oneAction: true }, /* TRUE VIDEO (º PC Key)) */
      187: { row: 3, mask: 0x08, shiftKey: 16, type: 'key', layoutRowOrder: 2, inner1: 'INV<br/>VIDEO', oneAction: true }, /* INV VIDEO (+ PC Key) */
      49: { row: 3, mask: 0x01, type: 'key', layoutRowOrder: 3, inner1: '1', inner2: '<div class="zx-key one"><span></span></div>', inner3: '!', top1: 'BLUE', top2: 'DEF FN' }, /* 1 (1 PC Key) */
      50: { row: 3, mask: 0x02, type: 'key', layoutRowOrder: 4, top1: 'RED', top2: 'FN', inner1: '2', inner2: '<div class="zx-key two"><span></span></div>', inner3: '@' }, /* 2 (2 PC Key)*/
      51: { row: 3, mask: 0x04, type: 'key', layoutRowOrder: 5, top1: 'MAGENTA', inner1: '3', inner2: '<div class="zx-key three"><span></span></div>', inner3: '#', top2: 'LINE' }, /* 3 (3 PC Key)*/
      52: { row: 3, mask: 0x08, type: 'key', layoutRowOrder: 6, top1: 'GREEN', inner1: '4', inner2: '<div class="zx-key four"><span></span></div>', inner3: '$', top2: 'OPEN#' }, /* 4 (4 PC Key)*/
      53: { row: 3, mask: 0x10, type: 'key', layoutRowOrder: 7, top1: 'CYAN', inner1: '5', inner2: '<div class="zx-key five"><span></span></div>', inner3: '%', top2: 'CLOSE#' }, /* 5 (5 PC Key)*/
      54: { row: 4, mask: 0x10, type: 'key', layoutRowOrder: 8, top1: 'YELLOW', inner1: '6', inner2: '<div class="zx-key six"><span></span><span></span></div>', inner3: '&', top2: 'MOVE' }, /* 6 (6 PC Key)*/
      55: { row: 4, mask: 0x08, type: 'key', layoutRowOrder: 9, top1: 'WHITE', inner1: '7', inner2: '<div class="zx-key seven"><span></span></div>', inner3: '\'', top2: 'ERASE' }, /* 7 (7 PC Key)*/
      56: { row: 4, mask: 0x04, type: 'key', layoutRowOrder: 10, inner1: '8', inner2: '<div class="zx-key nine"></div>', inner3: '(', top2: 'POINT' }, /* 8 (8 PC Key)*/
      57: { row: 4, mask: 0x02, type: 'key', layoutRowOrder: 11, inner1: '9', inner3: ')', top2: 'CAT' }, /* 9 (9 PC Key)*/
      48: { row: 4, mask: 0x01, type: 'key', layoutRowOrder: 12, top1: 'BLACK', inner1: '0', inner3: '_', top2: 'FORMAT' }, /* 0 (0 PC Key)*/
      219: { row: 7, mask: 0x01, shiftKey: 16, type: 'key', layoutRowOrder: 13, inner1: 'BREAK', oneAction: true }, /* BREAK (' PC Key) */

      8: { row: 4, mask: 0x01, shiftKey: 16, type: 'key', layoutRowOrder: 14, inner1: 'DELETE', oneAction: true }, /* Delete (Delete PC Key) */
      9: { row: 4, mask: 0x02, shiftKey: 16, type: 'key', layoutRowOrder: 15, inner1: 'GRAPH', oneAction: true }, /* GRAPH (Tab PC Key)  */
      81: { row: 2, mask: 0x01, type: 'key', layoutRowOrder: 16, top1: 'SIN', inner1: 'Q', inner2: '<=', inner3: 'PLOT', top2: 'ASN' }, /* Q (Q PC Key) */
      87: { row: 2, mask: 0x02, type: 'key', layoutRowOrder: 17, top1: 'COS', inner1: 'W', inner2: '<>', inner3: 'DRAW', top2: 'ACS' }, /* W (W PC Key) */
      69: { row: 2, mask: 0x04, type: 'key', layoutRowOrder: 18, top1: 'TAN', inner1: 'E', inner2: '>=', inner3: 'REM', top2: 'ATN' }, /* E (E PC Key) */
      82: { row: 2, mask: 0x08, type: 'key', layoutRowOrder: 19, top1: 'INT', inner1: 'R', inner2: '<', inner3: 'RUN', top2: 'VERIFY' }, /* R (R PC Key) */
      84: { row: 2, mask: 0x10, type: 'key', layoutRowOrder: 20, top1: 'RND', inner1: 'T', inner2: '>', inner3: 'RAND', top2: 'MERGE' }, /* T (T PC Key) */
      89: { row: 5, mask: 0x10, type: 'key', layoutRowOrder: 21, top1: 'STR$', inner1: 'Y', inner2: 'AND', inner3: 'RETURN', top2: '[' }, /* Y (Y PC Key) */
      85: { row: 5, mask: 0x08, type: 'key', layoutRowOrder: 22, top1: 'CHR$', inner1: 'U', inner2: 'OR', inner3: 'IF', top2: ']' }, /* U (U PC Key) */
      73: { row: 5, mask: 0x04, type: 'key', layoutRowOrder: 23, top1: 'CODE', inner1: 'I', inner2: 'AT', inner3: 'INPUT', top2: 'IN' }, /* I (I PC Key) */
      79: { row: 5, mask: 0x02, type: 'key', layoutRowOrder: 24, top1: 'PEEK', inner1: 'O', inner2: ';', inner3: 'POKE', top2: 'OUT' }, /* O (O PC Key) */
      80: { row: 5, mask: 0x01, type: 'key', layoutRowOrder: 25, top1: 'TAB', inner1: 'P', inner2: '\"', inner3: 'PRINT', top2: '&#169;' }, /* P (P PC Key) */

      20: { row: 7, mask: 0x02, shiftKey: 16, type: 'key', layoutRowOrder: 26, inner1: 'EXTEND<br/>MODE', oneAction: true, gridColumn: '1 / 3', gridRow: '3' }, /* EXTEND MODE (Caps lock PC Key) */
      221: { row: 3, mask: 0x01, shiftKey: 16, type: 'key', layoutRowOrder: 27, inner1: 'EDIT', oneAction: true }, /* EDIT (¡ PC Key)  */
      65: { row: 1, mask: 0x01, type: 'key', layoutRowOrder: 28, top1: 'READ', inner1: 'A', inner2: 'STOP', inner3: 'NEW', top2: '&#126;' }, /* A (A PC Key) */
      83: { row: 1, mask: 0x02, type: 'key', layoutRowOrder: 29, top1: 'RESTORE', inner1: 'S', inner2: 'NOT', inner3: 'SAVE', top2: '|' }, /* S (S PC Key) */
      68: { row: 1, mask: 0x04, type: 'key', layoutRowOrder: 30, top1: 'DATA', inner1: 'D', inner2: 'STEP', inner3: 'DIM', top2: '\\' }, /* D (D PC Key) */
      70: { row: 1, mask: 0x08, type: 'key', layoutRowOrder: 31, top1: 'SGN', inner1: 'F', inner2: 'TO', inner3: 'FOR', top2: '{' }, /* F (F PC Key) */
      71: { row: 1, mask: 0x10, type: 'key', layoutRowOrder: 32, top1: 'ABS', inner1: 'G', inner2: 'THEN', inner3: 'GOTO', top2: '}' }, /* G (G PC Key) */
      72: { row: 6, mask: 0x10, type: 'key', layoutRowOrder: 33, top1: 'SQR', inner1: 'H', inner2: '&#8593;', inner3: 'GOSUB', top2: 'CIRCLE' }, /* H (H PC Key) */
      74: { row: 6, mask: 0x08, type: 'key', layoutRowOrder: 34, top1: 'VAL', inner1: 'J', inner2: '-', inner3: 'LOAD', top2: 'VAL$' }, /* J (J PC Key) */
      75: { row: 6, mask: 0x04, type: 'key', layoutRowOrder: 35, top1: 'LEN', inner1: 'K', inner2: '+', inner3: 'LIST', top2: 'SCREEN$' }, /* K (K PC Key) */
      76: { row: 6, mask: 0x02, type: 'key', layoutRowOrder: 36, top1: 'USR', inner1: 'L', inner2: '=', inner3: 'LET', top2: 'ATTR' }, /* L (L PC Key) */
      13: { row: 6, mask: 0x01, type: 'key', layoutRowOrder: 38, inner1: 'ENTER', oneAction: true, gridColumn: '13 / 14', gridRow: '2 / 4' }, /* Enter (Enter PC Key) */

      500: { row: 0, mask: 0x01, type: 'key', layoutRowOrder: 39, inner1: 'CAPS<br/>SHIFT', shift: true, oneAction: true, gridColumn: '1 / 3', gridRow: '4' }, /* CAPS SHIFT LEFT (Shift PC Key) */
      226: { row: 3, mask: 0x02, shiftKey: 16, type: 'key', layoutRowOrder: 40, inner1: 'CAPS LOCK', oneAction: true, lock: true }, /* CAPS LOCK (<> PC Key)  */
      90: { row: 0, mask: 0x02, type: 'key', layoutRowOrder: 41, top1: 'LN', inner1: 'Z', inner2: ":", inner3: 'COPY', top2: 'BEEP' }, /* Z (Z PC Key) */
      88: { row: 0, mask: 0x04, type: 'key', layoutRowOrder: 42, top1: 'EXP', inner1: 'X', inner2: "&pound;", inner3: 'CLEAR', top2: 'INK' }, /* X (X PC Key) */
      67: { row: 0, mask: 0x08, type: 'key', layoutRowOrder: 43, top1: 'LPRINT', inner1: 'C', inner2: "?", inner3: 'CONT', top2: 'PAPER' }, /* C (C PC Key) */
      86: { row: 0, mask: 0x10, type: 'key', layoutRowOrder: 44, top1: 'LLIST', inner1: 'V', inner2: "/", inner3: 'CLS', top2: 'FLASH' }, /* V (V PC Key) */
      66: { row: 7, mask: 0x10, type: 'key', layoutRowOrder: 45, top1: 'BIN', inner1: 'B', inner2: "*", inner3: 'BORDER', top2: 'BRIGHT' }, /* B (B PC Key) */
      78: { row: 7, mask: 0x08, type: 'key', layoutRowOrder: 46, top1: 'INKEY$', inner1: 'N', inner2: ",", inner3: 'NEXT', top2: 'OVER' }, /* N (N PC Key) */
      77: { row: 7, mask: 0x04, type: 'key', layoutRowOrder: 47, top1: 'PI', inner1: 'M', inner2: ".", inner3: 'PAUSE', top2: 'INVERSE' }, /* M (M PC Key) */
      190: { row: 7, mask: 0x04, shiftKey: 17, type: 'key', layoutRowOrder: 48, inner1: '.' }, /* . (. PC Key) */
      16: { row: 0, mask: 0x01, type: 'key', layoutRowOrder: 49, inner1: 'CAPS<br/>SHIFT', shift: true, oneAction: true, gridColumn: '12 / 14', gridRow: '4' },  /* CAPS SHIFT RIGHT (RIGHT LEFT PC Key) */

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
    const codesArray = Object.keys(this.keycodes)
      .filter(item => this.keycodes[item].type == 'key')
      .map(item => ({ ...this.keycodes[item], id: item }))
      .sort((a, b) => a.layoutRowOrder - b.layoutRowOrder);
    return codesArray;
  }
}

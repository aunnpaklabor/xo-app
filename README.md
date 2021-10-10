# XO - Web Game

## Setup

#### ต้องการ:

- [Node.js](https://nodejs.org):

Clone Repository โดย run command ใน Terminal ดังนี้

```bash
git clone https://github.com/aunnpaklabor/xo-app.git
```
หรือดาวน์โหลด Repository โดยตรง 
จากนั้น Run commands ใน Terminal ดังนี้

```bash
$ cd xo-app
$ npm install
$ npm start
```

## การออกแบบโปรแกรม

เว็บเกมนี้พัฒนาด้วย React และ Javascript โดยตัวโปรแกรมจะมี 3 ส่วนประกอบหลักๆ คือ `Square` `Board` `Game`

### Square.js
```javascript
export default function Square(props) {
    return (
        <button class="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}
```
ทำหน้าที่รับส่งข้อมูลผ่าน props โดย `props.value` ในที่นี้คือ 'X' หรือ 'O'


### Board.js
```javascript
createBoard (row, col) {
  const board = [];
  let boardCounter =0;

  for (let i = 0; i < row; i+= 1) {
      const column = []; 
      for (let j = 0; j < col; j += 1) {
        column.push(this.renderSquare(boardCounter++))
      }
      board.push(<div key={i} className="board-row">{column}</div>)
  }
  return board;
}

renderSquare(i) {
    return (
        <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        />
    );
}

render() {
    return (
      <div>{this.createBoard(3, 3)}</div>
    );
  }
```
ใน Component นี้ จะทำการสร้างตารางโดยเป็น Array 3x3 และ `renderSquare()` ใช้อัพเดทช่องสี่เหลี่ยมที่ถูกเติมแล้ว

### Game.js
ใน component นี้จะเป็นการรวมฟังก์ชั่นหลักๆของเกมเช่น calculateWinner, handleClick, bot, history play

#### calculateWinner
```javascript
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
```
กำหนดให้ Array ของ 9 Squares นี้ เพิ่อใช้ในการคำนวณหาผู้ชนะเกม
```javascript
const winner = calculateWinner(current.squares);
    let status;
        if (winner) {
            status = "Winner: " + winner;
        }
        else if (isBoardFilled(current.squares)) {
            status = "Draw!";
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }
    return (
    ...)
```

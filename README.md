# XO - Web Game

## Setup

#### ต้องการ:

- [Node.js](https://nodejs.org):

ดาวน์โหลด Repository โดยตรง หรือ Clone Repository โดย run command ใน Terminal ดังนี้

```bash
git clone https://github.com/aunnpaklabor/xo-app.git
```
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
ใน Component นี้ จะทำการสร้างตาราง และ `renderSquare()` ใช้อัพเดทช่องสี่เหลี่ยมที่ถูกเติมแล้ว

### Game.js
ในส่วนนี้จะเป็นการรวมฟังก์ชันหลักๆของเกมเช่น ฟังก์ชันที่ใช้คลิกกระดานสี่เหลี่ยมของเกม, bot, history play

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

#### findBestSquare

```javascript
function findBestSquare(squares, player) { 
    const opponent = player === 'X' ? 'O' : 'X';
    const minimax = (squares, isMax) => {
        const winner = calculateWinner(squares);
      
        if (winner === player) return { square: -1, score: 1 };
      
        if (winner === opponent) return { square: -1, score: -1 };
      
        if (isBoardFilled(squares)) return { square: -1, score: 0 };
      
        const best = { square: -1, score: isMax ? -1000 : 1000 };
        for (let i = 0; i < squares.length; i++) {
            if (squares[i]) {
            continue;
            }

            squares[i] = isMax ? player : opponent;

            const score = minimax(squares, !isMax).score;

            squares[i] = null;
  
            if (isMax) {
                if (score > best.score) {
                    best.score = score;
                    best.square = i;
                }
            } else {
                if (score < best.score) {
                    best.score = score;
                    best.square = i;
                }
            }
      }
      
      return best;
    };

    return minimax(squares, true).square;
}
```
Algorithm ของ Bot ใช้เล่นกับผู้เล่น

## Minimax Algorithm

### Algorithm ใช้ในการพัฒนาตัวเกมนี้คือ Minimax Algorithm

โดยตัว Algorithm นี้ Bot จะสามารถคาดเดาหรือดูสถานการณ์ล่วงหน้าว่าต้องเล่นแบบไหนเพื่อให้จบเกมได้  

สมมติว่าตอนนี้หน้ากระดานเป็นแบบนี้ ซึ่งตาต่อไปเป็นของ Player O  

![image](https://github.com/aunnpaklabor/xo-app/blob/master/1.png)

โดยจุดนี้เราจะเห็นได้ว่ามี 3 รูปแบบการเดินที่เป็นไปได้ แล้วเราสามารถจำลองรูปแบบการเดินทั้งหมดจากหน้ากระดานปัจจุบันไปจนถึงจุดจบของเกมได้ตามนี้

![image](https://github.com/aunnpaklabor/xo-app/blob/master/1_game_tree.png)

จะเห็นได้ชัดว่าบางตัวเลือกในการเดินต่อไปสามารถนำไปสู่ชัยชนะของ Player O ได้เลย ซึ่งบางรูปแบบก็สามารถนำไปสู่ เสมอ หรือ แพ้ ได้เหมือนกัน ดังนั้นเราจะคำนวณคะแนนโดยการถ้าชนะ +1, เสมอ +0 และถ้าแพ้ -1 ตามรูปนี้

![image](https://github.com/aunnpaklabor/xo-app/blob/master/2_game_tree.png)

ถ้า Player O ต้องการเลือกเส้นทางที่จะจบเกมได้คะแนนสูงสุดและในทางกลับกัน Player X ต้องการเลือกเส้นทางที่จะจบเกมด้วยคะแนนต่ำเพื่อทำให้ Player O แพ้ ซึ่งเมื่อถึงตาของ Player O ต้องเลือกการเดินที่ maximize คะแนนได้มากที่สุด และ Player X เลือกการเดินที่ minimize คะแนนให้น้อยที่สุด นี้ทำให้ตัวผู้เล่นนั้นสามารถ backtracking สำหรับการหาคะแนนของทุกรูปแบบการเดินดังนี้

![image](https://github.com/aunnpaklabor/xo-app/blob/master/3_game_tree.png)

เราจะเห็นว่าคะแนนสำหรับการเดินที่เป็นไปได้ 3 รูปแบบของ Player O จากซ้ายไปขวาคือ 0, +1, -1 เมื่อเป็นฝั่ง maximize player ตัว Player O ควรเลือกการเดิน +1 คะแนนเพื่อนำไปสู่ชัยชนะโดยทันที







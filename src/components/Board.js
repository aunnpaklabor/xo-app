import React, { Component } from 'react'
import Square from './Square';

export default class Board extends Component {
    
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
}

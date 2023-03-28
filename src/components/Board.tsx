import Cell from './Cell';
import { BoardShape } from '../types';

interface Props {
  currentBoard: BoardShape;
}

function Board({ currentBoard }: Props) {
  return (
    <div className="board">
      {currentBoard.map((row, rowIndex) => (
        <div className="row" key={`${rowIndex}`}>
          {row.map((cell, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} type={cell} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;

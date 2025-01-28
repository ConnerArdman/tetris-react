import Cell from './Cell';
import ParticleEffect from './ParticleEffect';
import { BoardShape, Block } from '../types';

interface Props {
  currentBoard: BoardShape;
  clearedRows?: { rowIndex: number; blocks: Block[] }[];
}

function Board({ currentBoard, clearedRows = [] }: Props) {
  return (
    <div className="board" role="grid">
      {currentBoard.map((row, rowIndex) => (
        <div className="row" key={`${rowIndex}`}>
          {row.map((cell, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} type={cell} />
          ))}
        </div>
      ))}
      {clearedRows.map(({ rowIndex, blocks }) => (
        <ParticleEffect key={rowIndex} rowIndex={rowIndex} blocks={blocks} />
      ))}
    </div>
  );
}

export default Board;

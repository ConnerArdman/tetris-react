import Cell from './Cell';
import ParticleEffect from './ParticleEffect';
import { BoardShape, Block, EmptyCell } from '../types';

interface Props {
  currentBoard: BoardShape;
  clearedRows?: { rowIndex: number; blocks: (Block | EmptyCell)[] }[];
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
      <div className="particle-effects-wrapper" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {clearedRows.map(({ rowIndex, blocks }) => (
          <ParticleEffect key={rowIndex} rowIndex={rowIndex} blocks={blocks} />
        ))}
      </div>
    </div>
  );
}

export default Board;

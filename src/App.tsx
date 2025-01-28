import Board from './components/Board';
import UpcomingBlocks from './components/UpcomingBlocks';
import HighScores from './components/HighScores';
import { useTetris } from './hooks/useTetris';
import { debugFillRow } from './hooks/useTetrisBoard';
import { Block } from './types';

function App() {
  const { board, startGame, isPlaying, score, upcomingBlocks, clearedRows, dispatchBoard } = useTetris();

  return (
    <div className="app">
      <h1>Tetris</h1>
      <Board currentBoard={board} clearedRows={clearedRows} />
      <div className="controls">
        <h2>Score: {score}</h2>
        {isPlaying ? (
          <>
            <UpcomingBlocks upcomingBlocks={upcomingBlocks} />
            <button onClick={() => {
              const newBoard = debugFillRow(board);
              dispatchBoard({ type: 'commit', newBoard, newBlock: Block.I });
            }}>
              Force Clear Row
            </button>
          </>
        ) : (
          <>
            <button onClick={startGame}>New Game</button>
            <HighScores />
          </>
        )}
      </div>
    </div>
  );
}

export default App;

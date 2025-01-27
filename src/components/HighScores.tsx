import React from 'react';
import { getHighScores } from '../hooks/useTetris';

function HighScores() {
  const highScores = getHighScores().slice(0, 10);
  
  if (highScores.length === 0) {
    return (
      <div className="high-scores">
        <h2>High Scores</h2>
        <p>No high scores yet!</p>
      </div>
    );
  }

  return (
    <div className="high-scores">
      <h2>High Scores</h2>
      <ol className="high-scores-list">
        {highScores.map((score: number, index: number) => (
          <li key={index} className="high-score-item">
            {score}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default HighScores;

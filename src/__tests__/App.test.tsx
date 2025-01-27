import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders tetris app without crashing', () => {
    render(<App />);
    
    // Check for title
    expect(screen.getByText('Tetris')).toBeInTheDocument();
    
    // Check for New Game button (initial state)
    expect(screen.getByText('New Game')).toBeInTheDocument();
    
    // Check for score
    expect(screen.getByText(/Score:/)).toBeInTheDocument();
    
    // Check for game board (should be present even when not playing)
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  describe('high scores integration', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('shows high scores when game is not being played', () => {
      const scores = [300, 200, 100];
      localStorage.setItem('highScores', JSON.stringify(scores));
      
      render(<App />);
      
      expect(screen.getByText('High Scores')).toBeInTheDocument();
      expect(screen.getByText('300')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('shows "No high scores yet!" when there are no scores', () => {
      render(<App />);
      expect(screen.getByText('No high scores yet!')).toBeInTheDocument();
    });
  });
});

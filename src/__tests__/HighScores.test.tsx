import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import HighScores from '../components/HighScores';

describe('HighScores component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up localStorage after each test
    localStorage.clear();
  });

  it('displays "No high scores yet!" when there are no scores', () => {
    render(<HighScores />);
    expect(screen.getByText('No high scores yet!')).toBeInTheDocument();
  });

  it('displays high scores in descending order', () => {
    // Set up test data
    const scores = [100, 300, 200];
    localStorage.setItem('highScores', JSON.stringify(scores));

    render(<HighScores />);
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
    expect(listItems[0]).toHaveTextContent('300');
    expect(listItems[1]).toHaveTextContent('200');
    expect(listItems[2]).toHaveTextContent('100');
  });

  it('displays at most 10 high scores', () => {
    // Set up test data with more than 10 scores
    const scores = Array.from({ length: 15 }, (_, i) => (i + 1) * 100);
    localStorage.setItem('highScores', JSON.stringify(scores));

    render(<HighScores />);
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(10);
    expect(listItems[0]).toHaveTextContent('1500'); // Highest score
  });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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
});

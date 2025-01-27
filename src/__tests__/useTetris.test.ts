import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { getEmptyBoard, hasCollisions } from '../hooks/useTetrisBoard';
import { SHAPES } from '../types';
import { useTetris } from '../hooks/useTetris';

// Mock the entire useTetrisBoard module
vi.mock('../hooks/useTetrisBoard', async () => {
  const actual = await vi.importActual('../hooks/useTetrisBoard');
  return {
    ...actual,
    hasCollisions: vi.fn().mockReturnValue(false),
    useTetrisBoard: () => [
      {
        board: Array(20).fill(Array(10).fill(0)),
        droppingRow: 0,
        droppingColumn: 3,
        droppingBlock: 'I',
        droppingShape: [[1]],
      },
      vi.fn(), // dispatchBoardState
    ],
  };
});

beforeEach(() => {
  vi.useFakeTimers();
  // Reset all mocks before each test
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
  vi.resetModules();
});

describe('useTetris', () => {
  describe('game initialization', () => {
    it('starts with score of 0', () => {
      const { result } = renderHook(() => useTetris());
      expect(result.current.score).toBe(0);
    });

    it('starts in non-playing state', () => {
      const { result } = renderHook(() => useTetris());
      expect(result.current.isPlaying).toBe(false);
    });

    it('initializes game state when starting new game', () => {
      const { result } = renderHook(() => useTetris());
      
      act(() => {
        result.current.startGame();
      });

      expect(result.current.isPlaying).toBe(true);
      expect(result.current.score).toBe(0);
      expect(result.current.upcomingBlocks.length).toBeGreaterThan(0);
      expect(result.current.board).toBeDefined();
    });
  });

  describe('game board', () => {
    it('has correct dimensions', () => {
      const { result } = renderHook(() => useTetris());
      const board = result.current.board;
      expect(board.length).toBeGreaterThan(0);
      expect(board[0].length).toBeGreaterThan(0);
    });
  });

  describe('high scores', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
      vi.restoreAllMocks();
    });

    it('saves score to high scores on game over', () => {
      // Clear localStorage and set up spy
      localStorage.clear();
      const setScoreSpy = vi.spyOn(Storage.prototype, 'setItem');
      
      // Set up hasCollisions mock to trigger game over
      const { hasCollisions } = await vi.importActual('../hooks/useTetrisBoard');
      vi.mocked(hasCollisions).mockReturnValue(true);
      
      const { result } = renderHook(() => useTetris());
      
      // Start game and set score
      act(() => {
        result.current.startGame();
        // @ts-ignore - accessing private state for testing
        result.current.score = 100;
      });
      
      // Trigger game over by committing position
      act(() => {
        // @ts-ignore - accessing private method for testing
        result.current.commitPosition();
      });

      // Verify game over state
      expect(result.current.isPlaying).toBe(false);
      
      // Verify high score was saved
      expect(setScoreSpy).toHaveBeenCalledWith('highScores', expect.any(String));
      const savedScores = JSON.parse(localStorage.getItem('highScores') || '[]');
      expect(savedScores).toContain(100);
      
      // No need to clean up module-level mock
    });

    it('maintains only top 10 scores in descending order', () => {
      const scores = Array.from({ length: 15 }, (_, i) => i * 100);
      localStorage.setItem('highScores', JSON.stringify(scores));

      const { result } = renderHook(() => useTetris());
      expect(result.current.highScores).toHaveLength(10);
      expect(result.current.highScores[0]).toBe(1400); // Highest score
      expect(result.current.highScores[9]).toBe(500); // 10th highest score
    });

    it('initializes with empty high scores array when localStorage is empty', () => {
      const { result } = renderHook(() => useTetris());
      expect(result.current.highScores).toEqual([]);
    });

    it('handles invalid localStorage data gracefully', () => {
      localStorage.setItem('highScores', 'invalid-json');
      const { result } = renderHook(() => useTetris());
      expect(result.current.highScores).toEqual([]);
    });
  });
});

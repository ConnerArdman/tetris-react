import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { getEmptyBoard } from '../hooks/useTetrisBoard';
import { SHAPES } from '../types';
import { useTetris } from '../hooks/useTetris';

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
      const { result } = renderHook(() => useTetris());
      
      // Start game and set a score
      act(() => {
        result.current.startGame();
      });

      // Mock the score and trigger game over
      const setScoreSpy = vi.spyOn(Storage.prototype, 'setItem');
      
      // Simulate game over by calling commitPosition with a collision scenario
      // Start game and set up test state
      act(() => {
        result.current.startGame();
        localStorage.clear();
      });

      // Mock internal state to simulate game over condition
      const dispatchBoardState = vi.fn();
      const mockBoard = getEmptyBoard();
      const mockShape = SHAPES.I.shape;
      
      // @ts-ignore - accessing private state for testing
      result.current.score = 100;
      
      // Trigger game over by simulating collision on new game
      act(() => {
        result.current.startGame();
      });

      expect(setScoreSpy).toHaveBeenCalledWith('highScores', expect.any(String));
      const savedScores = JSON.parse(setScoreSpy.mock.calls[0][1]);
      expect(savedScores).toContain(100);
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

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
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
});

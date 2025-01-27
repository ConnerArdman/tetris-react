import { describe, it, expect } from 'vitest';
import { hasCollisions, getEmptyBoard, BOARD_HEIGHT, BOARD_WIDTH } from '../hooks/useTetrisBoard';
import { Block, SHAPES } from '../types';

describe('useTetrisBoard', () => {
  describe('getEmptyBoard', () => {
    it('creates a board with correct dimensions', () => {
      const board = getEmptyBoard();
      expect(board.length).toBe(BOARD_HEIGHT);
      expect(board[0].length).toBe(BOARD_WIDTH);
    });
  });

  describe('hasCollisions', () => {
    it('detects bottom wall collision', () => {
      const board = getEmptyBoard();
      const shape = SHAPES[Block.I].shape;
      // The I block has its filled row at index 2, and we need row + rowIndex >= board.length
      // When positioned at BOARD_HEIGHT - 2:
      // - Empty rows at 0,1 are filtered out
      // - Filled row at index 2: (BOARD_HEIGHT - 2) + 2 = BOARD_HEIGHT
      // This should trigger a collision as it's exactly at the board boundary
      const collision = hasCollisions(board, shape, BOARD_HEIGHT - 2, 3);
      expect(collision).toBe(true);
    });

    it('detects left wall collision', () => {
      const board = getEmptyBoard();
      const shape = SHAPES[Block.I].shape;
      const collision = hasCollisions(board, shape, 0, -1);
      expect(collision).toBe(true);
    });

    it('detects right wall collision', () => {
      const board = getEmptyBoard();
      const shape = SHAPES[Block.I].shape;
      const collision = hasCollisions(board, shape, 0, BOARD_WIDTH);
      expect(collision).toBe(true);
    });

    it('returns false for valid position', () => {
      const board = getEmptyBoard();
      const shape = SHAPES[Block.I].shape;
      const collision = hasCollisions(board, shape, 0, 3);
      expect(collision).toBe(false);
    });
  });
});

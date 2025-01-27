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
      // The I block has its filled row at index 2 in a 4x4 grid:
      // [
      //   [false, false, false, false], // row 0
      //   [false, false, false, false], // row 1
      //   [true,  true,  true,  true ], // row 2 (filled row)
      //   [false, false, false, false]  // row 3
      // ]
      // The I-block has its filled cells at row index 2
      // To test bottom collision, we need to position it so that:
      // row + filledRowIndex = BOARD_HEIGHT
      // So: row = BOARD_HEIGHT - filledRowIndex = BOARD_HEIGHT - 2
      const filledRowIndex = 2;
      const startRow = BOARD_HEIGHT - filledRowIndex;
      
      console.log('Board dimensions:', {
        height: BOARD_HEIGHT,
        width: BOARD_WIDTH,
        actualHeight: board.length,
        actualWidth: board[0].length
      });
      console.log('Shape structure:', shape);
      console.log('Testing position:', {
        startRow,
        column: 3,
        filledRowIndex,
        expectedCollisionRow: startRow + filledRowIndex
      });
      
      const collision = hasCollisions(board, shape, startRow, 3);
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

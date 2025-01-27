import { useReducer, Dispatch } from 'react';
import { Block, BlockShape, BoardShape, EmptyCell, SHAPES } from '../types';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

type BoardState = {
  board: BoardShape;
  droppingRow: number;
  droppingColumn: number;
  droppingBlock: Block;
  droppingShape: BlockShape;
};

export function useTetrisBoard(): [BoardState, Dispatch<Action>] {
  const [boardState, dispatchBoardState] = useReducer(
    boardReducer,
    {
      board: [],
      droppingRow: 0,
      droppingColumn: 0,
      droppingBlock: Block.I,
      droppingShape: SHAPES.I.shape,
    },
    (emptyState) => {
      const state = {
        ...emptyState,
        board: getEmptyBoard(),
      };
      return state;
    }
  );

  return [boardState, dispatchBoardState];
}

export function getEmptyBoard(height = BOARD_HEIGHT): BoardShape {
  return Array(height)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(EmptyCell.Empty));
}

export function hasCollisions(
  board: BoardShape,
  currentShape: BlockShape,
  row: number,
  column: number
): boolean {
  // Get the filled row indices
  const filledRowIndices = currentShape
    .map((row, index) => row.some((isSet) => isSet) ? index : -1)
    .filter(index => index !== -1);

  // Check each filled row for collisions
  for (let i = 0; i < filledRowIndices.length; i++) {
    const rowIndex = filledRowIndices[i];
    const shapeRow = currentShape[rowIndex];

    for (let colIndex = 0; colIndex < shapeRow.length; colIndex++) {
      if (shapeRow[colIndex]) { // Only check filled cells
        const boardRow = row + rowIndex;
        const boardCol = column + colIndex;

        if (
          boardRow >= board.length ||
          boardCol >= board[0].length ||
          boardCol < 0 ||
          board[boardRow][boardCol] !== EmptyCell.Empty
        ) {
          return true; // Return immediately when collision is found
        }
      }
    }
  }
  return false;
}

export function getRandomBlock(): Block {
  const blockValues = Object.values(Block);
  return blockValues[Math.floor(Math.random() * blockValues.length)] as Block;
}

function rotateBlock(shape: BlockShape): BlockShape {
  const rows = shape.length;
  const columns = shape[0].length;

  const rotated = Array(rows)
    .fill(null)
    .map(() => Array(columns).fill(false));

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      rotated[column][rows - 1 - row] = shape[row][column];
    }
  }

  return rotated;
}

type Action = {
  type: 'start' | 'drop' | 'commit' | 'move';
  newBoard?: BoardShape;
  newBlock?: Block;
  isPressingLeft?: boolean;
  isPressingRight?: boolean;
  isRotating?: boolean;
};

function boardReducer(state: BoardState, action: Action): BoardState {
  let newState = { ...state };

  switch (action.type) {
    case 'start':
      const firstBlock = getRandomBlock();
      return {
        board: getEmptyBoard(),
        droppingRow: 0,
        droppingColumn: 3,
        droppingBlock: firstBlock,
        droppingShape: SHAPES[firstBlock].shape,
      };
    case 'drop':
      newState.droppingRow++;
      break;
    case 'commit':
      return {
        board: [
          ...getEmptyBoard(BOARD_HEIGHT - action.newBoard!.length),
          ...action.newBoard!,
        ],
        droppingRow: 0,
        droppingColumn: 3,
        droppingBlock: action.newBlock!,
        droppingShape: SHAPES[action.newBlock!].shape,
      };
    case 'move':
      const rotatedShape = action.isRotating
        ? rotateBlock(newState.droppingShape)
        : newState.droppingShape;
      let columnOffset = action.isPressingLeft ? -1 : 0;
      columnOffset = action.isPressingRight ? 1 : columnOffset;
      if (
        !hasCollisions(
          newState.board,
          rotatedShape,
          newState.droppingRow,
          newState.droppingColumn + columnOffset
        )
      ) {
        newState.droppingColumn += columnOffset;
        newState.droppingShape = rotatedShape;
      }
      break;
    default:
      const unhandledType: never = action.type;
      throw new Error(`Unhandled action type: ${unhandledType}`);
  }

  return newState;
}

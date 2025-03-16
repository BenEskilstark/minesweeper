
import {smartGet, smartSet} from '../utils/arraysAndObjects.js';
import {randomIn} from '../utils/stochastic.js';

export const rootReducer = (state, action) => {
  if (state === undefined) state = initState();

  switch (action.type) {
    case 'RESET': {
      return {...state, grid: null, clickMode: "NORMAL", isGameOver: false};
    }
    case 'SET_CLICK_MODE': {
      return {...state, clickMode: action.clickMode};
    }
    case 'RIGHT_CLICK_CELL': {
      const {x, y} = action;
      const {grid, isGameOver} = state;
      if (isGameOver) return state;
      const cell = smartGet(grid, {x, y});
      if (!cell.visible) {
        cell.flagged = !!!cell.flagged;
      }
      return state;
    }
    case 'CLICK_CELL': {
      const {x, y} = action;
      if (state.grid == null) {
        state = initGrid(state, action);
      }
      const {grid, clickMode, isGameOver} = state;
      if (isGameOver) return state;
      if (clickMode == "FLAG") {
        const cell = smartGet(grid, {x, y});
        if (!cell.visible) {
          cell.flagged = true;
        }
        return state;
      }

      const stack = [smartGet(grid, {x, y})];
      const visited = {};
      while (stack.length > 0) {
        const cell = stack.pop();
        cell.visible = true;
        if (cell.value == "💣") return {...state, isGameOver: true};
        if (cell.value == 0) {
          getNeighbors(grid, cell)
            .filter(n => n != undefined)
            .filter(c => !smartGet(visited, {x: c.x, y: c.y}))
            .forEach(c => {
              stack.push(c);
              smartSet(visited, {x: c.x, y: c.y}, true);
            });
        }
      }
      return state;
    }
    default:
      return state;
  }
};

const initGrid = (state, pos) => {
  const grid = {};
  const {width, height, numBombs} = state;
  let bombsLeft = numBombs;
  while (bombsLeft > 0) {
    const x = randomIn(0, width - 1);
    const y = randomIn(0, height - 1);
    if (x == pos.x && y == pos.y) continue;
    if (smartGet(grid, {x, y})) continue;
    smartSet(grid, {x, y}, {value: "💣", x, y});
    bombsLeft--;
  }
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (!smartGet(grid, {x, y})) {
        const cell = {
          x, y,
          value: getNeighbors(grid, {x, y})
            .filter(n => n?.value == "💣")
            .length,
        };
        smartSet(grid, {x, y}, cell);
      }
    }
  }
  return {...state, grid};
}

export const getNeighbors = (grid, {x, y}) => {
  const neighborDiffs = [
    {x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1},
    {x: -1, y: 0},                 {x: 1, y: 0},
    {x: -1, y: 1},  {x: 0, y: 1},  {x: 1, y: 1},
  ];
  const neighbors = [];
  for (let diff of neighborDiffs) {
    neighbors.push(smartGet(grid, {x: x + diff.x, y: y + diff.y}));
  }
  return neighbors;
}

export const colors = ["tan", "blue", "green", "red", "purple", "brown", "orange", "pink", "black"];

export const initState = () => {
  return {
    width: 10, height: 10,
    numBombs: 10,
    grid: null,
    clickMode: "NORMAL",
  };
}



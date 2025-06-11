let board = [];
let solution = [];

function solveSudoku(grid) {
  const findEmpty = () => {
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (grid[r][c] === '') return [r, c];
    return null;
  };

  const isValid = (num, row, col) => {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
      const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const boxCol = 3 * Math.floor(col / 3) + i % 3;
      if (grid[boxRow][boxCol] === num) return false;
    }
    return true;
  };

  const solve = () => {
    const pos = findEmpty();
    if (!pos) return true;
    const [row, col] = pos;

    for (let n = 1; n <= 9; n++) {
      if (isValid(n, row, col)) {
        grid[row][col] = n;
        if (solve()) return true;
        grid[row][col] = '';
      }
    }
    return false;
  };

  solve();
}

function removeCells(grid, count) {
  while (count > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (grid[row][col] !== '') {
      grid[row][col] = '';
      count--;
    }
  }
}


function generateSudokuBoard() {
  const fullGrid = Array.from({ length: 9 }, () => Array(9).fill(''));
  solveSudoku(fullGrid);
  solution = JSON.parse(JSON.stringify(fullGrid));
  const puzzle = JSON.parse(JSON.stringify(fullGrid));
  removeCells(puzzle, 40);
  board = puzzle;
}


function renderBoard() {
  const container = document.getElementById('sudoku-board');
  container.innerHTML = '';

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement('input');
      cell.type = 'text';
      cell.maxLength = 1;
      cell.dataset.row = r;
      cell.dataset.col = c;

      if (board[r][c] !== '') {
        cell.value = board[r][c];
        cell.classList.add('prefilled');
      }
      container.appendChild(cell);
    }
  }
}


function checkSolution() {
  const current = Array.from({ length: 9 }, () => Array(9).fill(''));
  let valid = true;

  document.querySelectorAll('#sudoku-board input').forEach(input => {
    const row = +input.dataset.row;
    const col = +input.dataset.col;
    const val = input.value.trim();

    if (val === '') return;

    if (/^[1-9]$/.test(val)) {
      current[row][col] = Number(val);
    } else if (!input.classList.contains('prefilled')) {
      valid = false;
    }
  });

  if (!valid) {
    document.getElementById('message').textContent = "Invalid input! Only numbers 1-9 allowed.";
    return;
  }

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === '' && current[r][c] !== solution[r][c]) {
        document.getElementById('message').textContent = "Incorrect solution. Keep trying!";
        return;
      }
    }
  }

  document.getElementById('message').textContent = "🎉 Correct! Puzzle Solved!";
}


function resetBoard() {
  document.querySelectorAll('#sudoku-board input:not(.prefilled)').forEach(input => {
    input.value = '';
  });
  document.getElementById('message').textContent = '';
}


function newGame() {
  generateSudokuBoard();
  renderBoard();
  document.getElementById('message').textContent = '';
}

window.onload = newGame;

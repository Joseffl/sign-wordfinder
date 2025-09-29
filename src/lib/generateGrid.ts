type Direction = "H" | "V" | "D1" | "D2"; // H: horizontal, V: vertical, D1: diagonal ↘, D2: diagonal ↙

interface GridResult {
  grid: string[][];
  placedWords: string[];
}

export function generateGrid(words: string[], size = 10): GridResult {
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(""));
  const placedWords: string[] = [];
  const directions: Direction[] = ["H", "V", "D1", "D2"];

  const shuffle = <T>(array: T[]) => [...array].sort(() => Math.random() - 0.5);

  for (const word of shuffle(words)) {
    let placedSuccessfully = false;

    for (let attempts = 0; attempts < 50; attempts++) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);

      if (canPlaceWord(grid, word.toUpperCase(), row, col, dir)) {
        placeWord(grid, word.toUpperCase(), row, col, dir);
        placedWords.push(word.toUpperCase());
        placedSuccessfully = true;
        break;
      }
    }

    // If word cannot be placed, just skip it
    if (!placedSuccessfully) continue;
  }

  // Fill empty spaces with random letters
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
    }
  }

  return { grid, placedWords };
}

// Check if a word can be placed at the given position and direction
function canPlaceWord(grid: string[][], word: string, row: number, col: number, dir: Direction) {
  const size = grid.length;

  for (let i = 0; i < word.length; i++) {
    let r = row;
    let c = col;

    switch (dir) {
      case "H":
        c += i;
        break;
      case "V":
        r += i;
        break;
      case "D1":
        r += i;
        c += i;
        break;
      case "D2":
        r += i;
        c -= i;
        break;
    }

    if (r < 0 || c < 0 || r >= size || c >= size) return false;
    if (grid[r][c] && grid[r][c] !== word[i]) return false;
  }

  return true;
}

// Place the word in the grid
function placeWord(grid: string[][], word: string, row: number, col: number, dir: Direction) {
  for (let i = 0; i < word.length; i++) {
    switch (dir) {
      case "H":
        grid[row][col + i] = word[i];
        break;
      case "V":
        grid[row + i][col] = word[i];
        break;
      case "D1":
        grid[row + i][col + i] = word[i];
        break;
      case "D2":
        grid[row + i][col - i] = word[i];
        break;
    }
  }
}

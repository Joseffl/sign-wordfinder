type Direction = "H" | "V" | "D1" | "D2"; // H: horizontal, V: vertical, D1: diagonal ↘, D2: diagonal ↙

interface GridResult {
  grid: string[][];
  placedWords: string[];
}

export function generateGrid(words: string[], size = 10): GridResult {
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(""));
  const placedWords: string[] = [];

  const directions: Direction[] = ["H", "V", "D1", "D2"];

  const shuffle = <T>(array: T[]) => array.sort(() => Math.random() - 0.5);

  for (let word of shuffle(words)) {
    let placed = false;

    for (let attempts = 0; attempts < 50; attempts++) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);

      if (canPlaceWord(grid, word.toUpperCase(), row, col, dir)) {
        placeWord(grid, word.toUpperCase(), row, col, dir);
        placedWords.push(word.toUpperCase());
        placed = true;
        break;
      }
    }
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

// Helper to check placement
function canPlaceWord(grid: string[][], word: string, row: number, col: number, dir: Direction) {
  const size = grid.length;
  for (let i = 0; i < word.length; i++) {
    let r = row, c = col;
    if (dir === "H") c += i;
    else if (dir === "V") r += i;
    else if (dir === "D1") { r += i; c += i; }
    else if (dir === "D2") { r += i; c -= i; }

    if (r < 0 || c < 0 || r >= size || c >= size) return false;
    if (grid[r][c] && grid[r][c] !== word[i]) return false;
  }
  return true;
}

// Helper to place the word
function placeWord(grid: string[][], word: string, row: number, col: number, dir: Direction) {
  for (let i = 0; i < word.length; i++) {
    if (dir === "H") grid[row][col + i] = word[i];
    else if (dir === "V") grid[row + i][col] = word[i];
    else if (dir === "D1") grid[row + i][col + i] = word[i];
    else if (dir === "D2") grid[row + i][col - i] = word[i];
  }
}

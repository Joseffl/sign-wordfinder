type Direction = "H" | "V"; 

interface GridResult {
  grid: string[][];
  placedWords: string[];
}

export function generateGrid(words: string[], size = 10): GridResult {
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(""));
  const placedWords: string[] = [];
  const directions: Direction[] = ["H", "V"];

  const shuffle = <T>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

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

    if (!placedSuccessfully) continue;
  }

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) {
        grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }

  return { grid, placedWords };
}

function canPlaceWord(grid: string[][], word: string, row: number, col: number, dir: Direction): boolean {
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
    }

    if (r < 0 || c < 0 || r >= size || c >= size) return false;
    if (grid[r][c] && grid[r][c] !== word[i]) return false;
  }

  return true;
}

function placeWord(grid: string[][], word: string, row: number, col: number, dir: Direction): void {
  for (let i = 0; i < word.length; i++) {
    switch (dir) {
      case "H":
        grid[row][col + i] = word[i];
        break;
      case "V":
        grid[row + i][col] = word[i];
        break;
    }
  }
}

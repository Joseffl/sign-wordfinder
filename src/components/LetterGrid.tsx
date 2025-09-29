"use client";

import { useState, useRef } from "react";

interface LetterGridProps {
  grid: string[][];
  placedWords: string[];
  foundWords: string[];
  setFoundWords: (words: string[]) => void;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

interface Cell {
  row: number;
  col: number;
}

const LetterGrid: React.FC<LetterGridProps> = ({
  grid,
  placedWords,
  foundWords,
  setFoundWords,
  setScore,
}) => {
  // Hooks always at the top
  const [selection, setSelection] = useState<Cell[]>([]);
  const isDragging = useRef(false);

  if (!grid.length) return null;

  const getSelectedWord = (cells: Cell[]) =>
    cells.map((cell) => grid[cell.row][cell.col]).join("").toUpperCase();

  const handleMouseDown = (row: number, col: number) => {
    isDragging.current = true;
    setSelection([{ row, col }]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isDragging.current) return;
    const last = selection[selection.length - 1];
    if (last && (last.row !== row || last.col !== col)) {
      setSelection((prev) => [...prev, { row, col }]);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    const word = getSelectedWord(selection);

    if (placedWords.includes(word) && !foundWords.includes(word)) {
      setFoundWords([...foundWords, word]);
      setScore((prev) => prev + 10);
    }

    setSelection([]);
  };

  // Touch support
  const handleTouchStart = (row: number, col: number) => handleMouseDown(row, col);

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const target = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    if (!target) return;
    const row = Number(target.getAttribute("data-row"));
    const col = Number(target.getAttribute("data-col"));
    if (!isNaN(row) && !isNaN(col)) handleMouseEnter(row, col);
  };
  const handleTouchEnd = () => handleMouseUp();

  const isCellFound = (r: number, c: number) => {
    for (const word of foundWords) {
      // Check all possible horizontal, vertical, diagonal positions
      const positions = findWordPositions(word, grid);
      if (positions.some((pos) => pos.row === r && pos.col === c)) return true;
    }
    return false;
  };

  return (
    <div
      className="grid gap-1 touch-none w-full max-w-lg mx-auto"
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, minmax(2rem, 3rem))`,
        gridTemplateRows: `repeat(${grid.length}, minmax(2rem, 3rem))`,
      }}
      onMouseLeave={() => isDragging.current && setSelection([])}
    >
      {grid.map((row, rIdx) =>
        row.map((letter, cIdx) => {
          const isSelected = selection.some((cell) => cell.row === rIdx && cell.col === cIdx);
          const isFound = isCellFound(rIdx, cIdx);

          return (
            <div
              key={`${rIdx}-${cIdx}`}
              data-row={rIdx}
              data-col={cIdx}
              onMouseDown={() => handleMouseDown(rIdx, cIdx)}
              onMouseEnter={() => handleMouseEnter(rIdx, cIdx)}
              onMouseUp={handleMouseUp}
              onTouchStart={() => handleTouchStart(rIdx, cIdx)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`flex items-center justify-center font-bold cursor-pointer select-none rounded text-[clamp(1rem,2vw,1.25rem)] sm:text-xl ${
                isFound
                  ? "bg-green-500 text-white"
                  : isSelected
                  ? "bg-yellow-400 text-white"
                  : "bg-orange-200 text-orange-800"
              }`}
            >
              {letter}
            </div>
          );
        })
      )}
    </div>
  );
};

// Helper: find positions of a word in grid (H, V, D1, D2)
function findWordPositions(word: string, grid: string[][]) {
  // const positions: { row: number; col: number }[] = [];
  const size = grid.length;
  const dirs = [
    { dr: 0, dc: 1 }, // H
    { dr: 1, dc: 0 }, // V
    { dr: 1, dc: 1 }, // D1
    { dr: 1, dc: -1 }, // D2
  ];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      for (const { dr, dc } of dirs) {
        let match = true;
        const tempPos = [];
        for (let i = 0; i < word.length; i++) {
          const nr = r + dr * i;
          const nc = c + dc * i;
          if (nr < 0 || nc < 0 || nr >= size || nc >= size || grid[nr][nc] !== word[i]) {
            match = false;
            break;
          }
          tempPos.push({ row: nr, col: nc });
        }
        if (match) return tempPos; // return first match
      }
    }
  }

  return [];
}

export default LetterGrid;

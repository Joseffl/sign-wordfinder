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
  const [selection, setSelection] = useState<Cell[]>([]);
  const isDragging = useRef(false);

  if (!grid.length) return null;

  const getSelectedWord = (cells: Cell[]) =>
    cells.map((cell) => grid[cell.row][cell.col]).join("").toUpperCase();

  // --- Selection helpers ---
  const startSelection = (row: number, col: number) => {
    isDragging.current = true;
    setSelection([{ row, col }]);
  };

  const extendSelection = (row: number, col: number) => {
    if (!isDragging.current) return;
    const last = selection[selection.length - 1];
    if (!last || last.row !== row || last.col !== col) {
      setSelection((prev) => [...prev, { row, col }]);
    }
  };

  const endSelection = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const word = getSelectedWord(selection);
    if (placedWords.includes(word) && !foundWords.includes(word)) {
      setFoundWords([...foundWords, word]);
      setScore((prev) => prev + 10);
    }

    setSelection([]);
  };

  // --- Touch support ---
  const handleTouchStart = (row: number, col: number, e: React.TouchEvent) => {
    e.preventDefault();
    startSelection(row, col);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;

    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!target) return;

    const row = Number(target.getAttribute("data-row"));
    const col = Number(target.getAttribute("data-col"));
    if (!isNaN(row) && !isNaN(col)) {
      extendSelection(row, col);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    endSelection();
  };

  // --- Found state checker ---
  const isCellFound = (r: number, c: number) => {
    for (const word of foundWords) {
      const positions = findWordPositions(word, grid);
      if (positions.some((pos) => pos.row === r && pos.col === c)) return true;
    }
    return false;
  };

  return (
    <div
      className="grid gap-1 touch-none w-full max-w-lg mx-auto select-none"
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, minmax(2rem, 3rem))`,
        gridTemplateRows: `repeat(${grid.length}, minmax(2rem, 3rem))`,
      }}
      onMouseLeave={() => isDragging.current && setSelection([])}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {grid.map((row, rIdx) =>
        row.map((letter, cIdx) => {
          const isSelected = selection.some(
            (cell) => cell.row === rIdx && cell.col === cIdx
          );
          const isFound = isCellFound(rIdx, cIdx);

          return (
            <div
              key={`${rIdx}-${cIdx}`}
              data-row={rIdx}
              data-col={cIdx}
              onMouseDown={() => startSelection(rIdx, cIdx)}
              onMouseEnter={() => extendSelection(rIdx, cIdx)}
              onMouseUp={endSelection}
              onTouchStart={(e) => handleTouchStart(rIdx, cIdx, e)}
              className={`flex items-center justify-center font-bold cursor-pointer rounded text-[clamp(1rem,2vw,1.25rem)] sm:text-xl ${
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

// --- Helper: find positions of a word in grid ---
function findWordPositions(word: string, grid: string[][]) {
  const size = grid.length;
  const dirs = [
    { dr: 0, dc: 1 }, // horizontal
    { dr: 1, dc: 0 }, // vertical
    { dr: 1, dc: 1 }, // diagonal ↘
    { dr: 1, dc: -1 }, // diagonal ↙
  ];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      for (const { dr, dc } of dirs) {
        let match = true;
        const tempPos = [];
        for (let i = 0; i < word.length; i++) {
          const nr = r + dr * i;
          const nc = c + dc * i;
          if (
            nr < 0 ||
            nc < 0 ||
            nr >= size ||
            nc >= size ||
            grid[nr][nc] !== word[i]
          ) {
            match = false;
            break;
          }
          tempPos.push({ row: nr, col: nc });
        }
        if (match) return tempPos;
      }
    }
  }
  return [];
}

export default LetterGrid;


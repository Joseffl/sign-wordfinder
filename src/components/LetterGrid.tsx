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
  if (!grid.length) return null;

  const [selection, setSelection] = useState<Cell[]>([]);
  const isDragging = useRef(false);

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
          const isFound = foundWords.some((w) =>
            w.split("").every(
              (l, idx) => grid[selection[idx]?.row || 0][selection[idx]?.col || 0] === l
            )
          );

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

export default LetterGrid;

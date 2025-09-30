
"use client";

import React, { useState } from "react";

interface LetterGridProps {
  grid: string[][];
  placedWords: string[];
  foundWords: string[];
  setFoundWords: React.Dispatch<React.SetStateAction<string[]>>;
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
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);

  const handleCellClick = (row: number, col: number) => {
    const cell: Cell = { row, col };

    // Prevent duplicate clicks on the same cell
    if (selectedCells.some((c) => c.row === row && c.col === col)) return;

    const newSelection = [...selectedCells, cell];
    setSelectedCells(newSelection);

    const word = newSelection.map((c) => grid[c.row][c.col]).join("");

    if (placedWords.includes(word) && !foundWords.includes(word)) {
      // Update found words & score safely
      setFoundWords((prev) => [...prev, word]);
      setScore((prev) => prev + 10); // +10 per word
    }
  };

  return (
    <div
      className="grid gap-1"
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, 3rem)`,
        gridTemplateRows: `repeat(${grid.length}, 3rem)`,
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((letter, colIndex) => {
          const isSelected = selectedCells.some(
            (c) => c.row === rowIndex && c.col === colIndex
          );

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              className={`flex items-center justify-center border rounded text-lg font-bold 
                ${isSelected ? "bg-purple-400 text-white" : "bg-white text-black"}`}
            >
              {letter}
            </button>
          );
        })
      )}
    </div>
  );
};

export default LetterGrid;


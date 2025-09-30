"use client";

import { useState, useEffect } from "react";

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
  const [startCell, setStartCell] = useState<Cell | null>(null);
  const [endCell, setEndCell] = useState<Cell | null>(null);
  const [highlightedCells, setHighlightedCells] = useState<Cell[]>([]);
  const [permanentHighlights, setPermanentHighlights] = useState<Cell[]>([]);

  useEffect(() => {
    setPermanentHighlights([]);
    setHighlightedCells([]);
    setStartCell(null);
    setEndCell(null);
  }, [grid]);

  const handleMouseDown = (row: number, col: number) => {
    setStartCell({ row, col });
    setEndCell(null);
    setHighlightedCells([{ row, col }]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (startCell) {
      const possibleEnd = { row, col };
      if (
        possibleEnd.row === startCell.row ||
        possibleEnd.col === startCell.col
      ) {
        setEndCell(possibleEnd);
        updateHighlightedCells(startCell, possibleEnd);
      }
    }
  };

  const handleMouseUp = () => {
    if (startCell && endCell) {
      const word = getWordFromCells(startCell, endCell);
      if (placedWords.includes(word) && !foundWords.includes(word)) {
        setFoundWords([...foundWords, word]);
        setScore((prev) => prev + 10);
        const wordCells = getCellsBetween(startCell, endCell);
        setPermanentHighlights((prev) => [...prev, ...wordCells]);
      }
    }
    setStartCell(null);
    setEndCell(null);
    setHighlightedCells([]);
  };

  const updateHighlightedCells = (start: Cell, end: Cell) => {
    setHighlightedCells(getCellsBetween(start, end));
  };

  const getCellsBetween = (start: Cell, end: Cell): Cell[] => {
    const cells: Cell[] = [];
    if (start.row === end.row) {
      const [min, max] = [Math.min(start.col, end.col), Math.max(start.col, end.col)];
      for (let c = min; c <= max; c++) cells.push({ row: start.row, col: c });
    } else if (start.col === end.col) {
      const [min, max] = [Math.min(start.row, end.row), Math.max(start.row, end.row)];
      for (let r = min; r <= max; r++) cells.push({ row: r, col: start.col });
    }
    return cells;
  };

  const getWordFromCells = (start: Cell, end: Cell): string => {
    const cells = getCellsBetween(start, end);
    return cells.map((cell) => grid[cell.row][cell.col]).join("");
  };

  const isCellHighlighted = (row: number, col: number) =>
    highlightedCells.some((cell) => cell.row === row && cell.col === col);

  const isCellPermanent = (row: number, col: number) =>
    permanentHighlights.some((cell) => cell.row === row && cell.col === col);

  return (
    <div className="w-full max-w-full flex justify-center px-2">
      <div
        className="grid touch-none select-none w-full max-w-[90vw]"
        style={{
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          aspectRatio: "1 / 1", 
        }}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
      >
        {grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const highlighted = isCellHighlighted(rowIndex, colIndex);
            const permanent = isCellPermanent(rowIndex, colIndex);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`flex items-center justify-center border font-bold text-lg transition-colors duration-200
                  ${
                    permanent
                      ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white border-orange-600"
                      : highlighted
                      ? "bg-yellow-300 border-yellow-500"
                      : "bg-white border-gray-400 text-black"
                  }
                `}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                onTouchStart={() => handleMouseDown(rowIndex, colIndex)}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  const target = document.elementFromPoint(
                    touch.clientX,
                    touch.clientY
                  );
                  if (
                    target &&
                    target instanceof HTMLElement &&
                    target.dataset.row !== undefined &&
                    target.dataset.col !== undefined
                  ) {
                    const r = parseInt(target.dataset.row, 10);
                    const c = parseInt(target.dataset.col, 10);
                    handleMouseEnter(r, c);
                  }
                }}
                data-row={rowIndex}
                data-col={colIndex}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LetterGrid;


"use client";

import React, { useCallback, useRef, useState } from "react";

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
  const gridRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const [selection, setSelection] = useState<Cell[]>([]);

  // --- Helpers ---
  const getSelectedWord = useCallback(
    (cells: Cell[]) =>
      cells.map((cell) => grid[cell.row][cell.col]).join("").toUpperCase(),
    [grid]
  );

  const coordsToCell = useCallback(
    (clientX: number, clientY: number): Cell | null => {
      const container = gridRef.current;
      if (!container) return null;
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;

      const cols = grid[0].length;
      const rows = grid.length;
      const cellWidth = rect.width / cols;
      const cellHeight = rect.height / rows;

      const col = Math.floor(x / cellWidth);
      const row = Math.floor(y / cellHeight);

      if (row < 0 || col < 0 || row >= rows || col >= cols) return null;
      return { row, col };
    },
    [grid]
  );

  const pushCellIfNew = useCallback((cell: Cell | null) => {
    if (!cell) return;
    setSelection((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.row === cell.row && last.col === cell.col) return prev;
      if (prev.some((c) => c.row === cell.row && c.col === cell.col)) return prev;
      return [...prev, cell];
    });
  }, []);

  const finalizeSelection = useCallback(() => {
    if (selection.length === 0) return;

    const word = getSelectedWord(selection);
    if (placedWords.includes(word) && !foundWords.includes(word)) {
      setFoundWords((prev) => [...prev, word]);
      setScore((prev) => prev + 10);
    }

    setSelection([]);
  }, [selection, placedWords, foundWords, getSelectedWord, setFoundWords, setScore]);

  // --- Early exit AFTER hooks are defined ---
  if (!grid || grid.length === 0) {
    return <div>No grid available</div>;
  }

  return (
    <div
      ref={gridRef}
      className="grid gap-1 touch-none w-full max-w-lg mx-auto select-none"
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
        gridTemplateRows: `repeat(${grid.length}, 1fr)`,
        touchAction: "none",
        userSelect: "none",
      }}
      onPointerDown={(e) => {
        pointerIdRef.current = e.pointerId;
        (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
        setSelection([]);
        const cell = coordsToCell(e.clientX, e.clientY);
        pushCellIfNew(cell);
        e.preventDefault();
      }}
      onPointerMove={(e) => {
        if (pointerIdRef.current !== e.pointerId) return;
        const cell = coordsToCell(e.clientX, e.clientY);
        pushCellIfNew(cell);
      }}
      onPointerUp={(e) => {
        if (pointerIdRef.current !== e.pointerId) return;
        (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
        pointerIdRef.current = null;
        finalizeSelection();
      }}
      onPointerCancel={(e) => {
        if (pointerIdRef.current !== e.pointerId) return;
        (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
        pointerIdRef.current = null;
        setSelection([]);
      }}
      onPointerLeave={() => {
        if (pointerIdRef.current !== null) {
          finalizeSelection();
          pointerIdRef.current = null;
        }
      }}
    >
      {grid.map((rowArr, rIdx) =>
        rowArr.map((letter, cIdx) => {
          const isSelected = selection.some(
            (cell) => cell.row === rIdx && cell.col === cIdx
          );
          const isFound = false; // placeholder until you re-add highlighting

          return (
            <div
              key={`${rIdx}-${cIdx}`}
              className={`flex items-center justify-center font-bold cursor-pointer rounded 
                text-[clamp(0.75rem,1.5vw,1.25rem)] sm:text-lg
                ${
                  isFound
                    ? "bg-green-500 text-white"
                    : isSelected
                    ? "bg-yellow-400 text-white"
                    : "bg-orange-200 text-orange-800"
                }`}
              style={{ aspectRatio: "1 / 1" }}
              onClick={(ev) => {
                ev.stopPropagation();
                pushCellIfNew({ row: rIdx, col: cIdx });
              }}
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


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

  if (!grid || grid.length === 0) return null;

  const getSelectedWord = (cells: Cell[]) =>
    cells.map((cell) => grid[cell.row][cell.col]).join("").toUpperCase();

  // compute row/col from client coordinates relative to container
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

  // Add cell to selection if it is new & not duplicate
  const pushCellIfNew = useCallback((cell: Cell | null) => {
    if (!cell) return;
    setSelection((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.row === cell.row && last.col === cell.col) return prev;
      // avoid adding if cell already exists anywhere in selection
      if (prev.some((c) => c.row === cell.row && c.col === cell.col)) return prev;
      return [...prev, cell];
    });
  }, []);

  // finalize selection and check word
  const finalizeSelection = useCallback(() => {
    if (selection.length === 0) return;

    const word = getSelectedWord(selection); // already uppercase
    if (placedWords.includes(word) && !foundWords.includes(word)) {
      // update found words and score
      setFoundWords((prev) => [...prev, word]);
      setScore((prev) => prev + 10); // +10 per word
    }

    setSelection([]);
  }, [selection, placedWords, foundWords, setFoundWords, setScore]);

  // Pointer handlers
  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    // Start tracking this pointer
    pointerIdRef.current = e.pointerId;
    // Capture pointer so we continue receiving move/up events even if the pointer leaves the element
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);

    // Fresh selection
    setSelection([]);

    const cell = coordsToCell(e.clientX, e.clientY);
    pushCellIfNew(cell);

    // Prevent default to avoid scrolling/pinch issues
    e.preventDefault();
  };

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (pointerIdRef.current !== e.pointerId) return; // ignore other pointers
    const cell = coordsToCell(e.clientX, e.clientY);
    pushCellIfNew(cell);
  };

  const handlePointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (pointerIdRef.current !== e.pointerId) return;
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    pointerIdRef.current = null;
    finalizeSelection();
  };

  const handlePointerCancel: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (pointerIdRef.current !== e.pointerId) return;
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    pointerIdRef.current = null;
    setSelection([]); // abort
  };

  const isCellFound = (r: number, c: number) => {
    for (const word of foundWords) {
      const positions = findWordPositions(word, grid);
      if (positions.some((pos) => pos.row === r && pos.col === c)) return true;
    }
    return false;
  };

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
  onPointerDown={handlePointerDown}
  onPointerMove={handlePointerMove}
  onPointerUp={handlePointerUp}
  onPointerCancel={handlePointerCancel}
  onPointerLeave={(e) => {
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
      const isFound = isCellFound(rIdx, cIdx);

      return (
        <div
          key={`${rIdx}-${cIdx}`}
          className={`flex items-center justify-center font-bold cursor-pointer rounded 
            text-[clamp(0.75rem,1.5vw,1.25rem)] sm:text-lg
            ${isFound
              ? "bg-green-500 text-white"
              : isSelected
              ? "bg-yellow-400 text-white"
              : "bg-orange-200 text-orange-800"}`}
          style={{
            aspectRatio: "1 / 1", // ensures perfect square cells
          }}
          onClick={(ev) => {
            ev.stopPropagation();
            const cell = { row: rIdx, col: cIdx };
            pushCellIfNew(cell);
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

// --- Helper: find positions of a word in grid ---
function findWordPositions(word: string, grid: string[][]) {
  const size = grid.length;
  const dirs = [
    { dr: 0, dc: 1 }, // horizontal →
    { dr: 1, dc: 0 }, // vertical ↓
    { dr: 1, dc: 1 }, // diagonal ↘
    { dr: 1, dc: -1 }, // diagonal ↙
  ];

  // ensure word is uppercase (grid letters likely uppercase)
  const W = word.toUpperCase();

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      for (const { dr, dc } of dirs) {
        let match = true;
        const tempPos: { row: number; col: number }[] = [];
        for (let i = 0; i < W.length; i++) {
          const nr = r + dr * i;
          const nc = c + dc * i;
          if (
            nr < 0 ||
            nc < 0 ||
            nr >= size ||
            nc >= size ||
            grid[nr][nc] !== W[i]
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

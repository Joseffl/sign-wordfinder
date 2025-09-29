"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import LetterGrid from "@/components/LetterGrid";
import WordList from "@/components/WordList";
import Timer from "@/components/Timer";
import ScoreBoard from "@/components/ScoreBoard";
import WinModal from "@/components/WinModal";
import LoseModal from "@/components/LoseModal";
import { generateGrid } from "@/lib/generateGrid";
import wordbank from "@/data/wordbank.json";

const GameContent = () => {
  const searchParams = useSearchParams();
  const mode = Number(searchParams.get("mode")) || 30;

  const [grid, setGrid] = useState<string[][]>([]);
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const timerKey = useRef<number>(0);

  const startNewGame = useCallback(() => {
    const allWords = [
      ...wordbank.SignProjectTerms,
      ...wordbank.TechnicalAndBlockchainTerms,
      ...wordbank.IdentityAndVerificationTerms,
      ...wordbank.TokenAndDistributionTerms,
      ...wordbank.LegalAndAgreementTerms,
      ...wordbank.EcosystemAndAdoptionTerms,
    ];

    const selectedWords = shuffleArray(allWords).slice(0, 10);
    const { grid: newGrid, placedWords: newPlacedWords } = generateGrid(selectedWords, 10);

    setPlacedWords(newPlacedWords.map((w) => w.toUpperCase()));
    setGrid(newGrid);
    setFoundWords([]);
    setScore(0);
    setGameOver(false);
    setGameWon(false);

    timerKey.current += 1;
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    if (placedWords.length > 0 && foundWords.length === placedWords.length) {
      setGameWon(true);
      setGameOver(true);
    }
  }, [foundWords, placedWords]);

  const handleTimeUp = () => {
    if (foundWords.length !== placedWords.length) {
      setGameOver(true);
      setGameWon(false);
    }
  };

  const shuffleArray = (arr: string[]) => [...arr].sort(() => Math.random() - 0.5);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
      <div className="flex-1 p-4 flex flex-col items-center w-full max-w-4xl mx-auto">
        <div className="w-full flex justify-between items-center mb-4">
          <Timer
            key={timerKey.current}
            duration={mode}
            onTimeUp={handleTimeUp}
            isPaused={gameOver}
          />
          <ScoreBoard
            score={score}
            foundWordsCount={foundWords.length}
            totalWords={placedWords.length}
          />
        </div>

        {grid.length > 0 && (
          <LetterGrid
            grid={grid}
            placedWords={placedWords}
            foundWords={foundWords}
            setFoundWords={(words) => {
              setFoundWords(words);
              setScore(words.length * 10);
            }}
            setScore={setScore}
          />
        )}

        <WordList words={placedWords} foundWords={foundWords} />
      </div>

      <footer className="text-center py-4 text-white font-semibold">
        Made with ❤️ by Joe
      </footer>

      {gameWon && gameOver && (
        <WinModal
          isOpen={true}
          score={score}
          totalWords={placedWords.length}
          onRestart={startNewGame}
        />
      )}
      {!gameWon && gameOver && (
        <LoseModal isOpen={true} onRestart={startNewGame} />
      )}
    </div>
  );
};

export default GameContent;
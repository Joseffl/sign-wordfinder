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
import ResultsModal from "@/components/ResultsModal";

const GameContent = () => {
  const searchParams = useSearchParams();

  const playerName = searchParams.get("name") || "Player";
  const difficulty = searchParams.get("difficulty") || "easy";
  const time = Number(searchParams.get("time")) || 60;

  const [grid, setGrid] = useState<string[][]>([]);
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // oranges & bonus tracking
  const [orangesEarned, setOrangesEarned] = useState(0);
  const [isBonus, setIsBonus] = useState(false);

  const timerKey = useRef<number>(0);
  const lastTimeRemaining = useRef<number>(time);

  // Helper to shuffle words
  const shuffleArray = (arr: string[]) =>
    [...arr].sort(() => Math.random() - 0.5);

  // Decide word count & directions based on difficulty
  const getGameSettings = (diff: string, time: number) => {
    let wordCount = 7;
    let directions: ("H" | "V" | "D1" | "D2")[] = ["H", "V"];
    let gridSize = 10;

    if (diff === "easy") {
      wordCount = Math.min(5 + Math.floor(time / 30), 7);
      directions = ["H", "V"];
      gridSize = 10;
    } else if (diff === "medium") {
      wordCount = Math.min(8 + Math.floor(time / 30), 10);
      directions = ["H", "V", "D1"];
      gridSize = 12;
    } else if (diff === "hard") {
      wordCount = Math.min(10 + Math.floor(time / 30), 15);
      directions = ["H", "V", "D1", "D2"];
      gridSize = 14;
    }

    return { wordCount, directions, gridSize };
  };

  const startNewGame = useCallback(() => {
    const { wordCount, directions, gridSize } = getGameSettings(
      difficulty,
      time
    );

    const allWords = [
      ...wordbank.SignProjectTerms,
      ...wordbank.TechnicalAndBlockchainTerms,
      ...wordbank.IdentityAndVerificationTerms,
      ...wordbank.TokenAndDistributionTerms,
      ...wordbank.LegalAndAgreementTerms,
      ...wordbank.EcosystemAndAdoptionTerms,
    ];

    const selectedWords = shuffleArray(allWords).slice(0, wordCount);
    const { grid: newGrid, placedWords: newPlacedWords } = generateGrid(
      selectedWords,
      gridSize,
    );

    setPlacedWords(newPlacedWords.map((w) => w.toUpperCase()));
    setGrid(newGrid);
    setFoundWords([]);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setOrangesEarned(0);
    setIsBonus(false);

    timerKey.current += 1;
    lastTimeRemaining.current = time;
  }, [difficulty, time]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    if (placedWords.length > 0 && foundWords.length === placedWords.length) {
      // Defer bonus/oranges scoring
      setTimeout(() => {
        const bonus = lastTimeRemaining.current > 0;
        const baseOranges = score;
        setOrangesEarned(bonus ? Math.floor(baseOranges * 1.5) : baseOranges);
        setIsBonus(bonus);
        setGameWon(true);
        setGameOver(true);
      }, 0);
    }
  }, [foundWords, placedWords, score]);

  const handleTimeUp = (timeRemaining: number) => {
    lastTimeRemaining.current = timeRemaining;

    if (foundWords.length !== placedWords.length) {
      setTimeout(() => {
        const baseOranges = score;
        setOrangesEarned(baseOranges);
        setIsBonus(false);
        setGameWon(false);
        setGameOver(true);
      }, 0);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
      <div className="flex-1 p-4 flex flex-col items-center w-full max-w-4xl mx-auto">
        <div className="w-full flex justify-between items-center mb-4">
          <Timer
            key={timerKey.current}
            duration={time}
            onTimeUp={handleTimeUp}
            isPaused={gameOver}
            onTick={(t) => (lastTimeRemaining.current = t)}
          />
          <ScoreBoard
            score={score}
            foundWordsCount={foundWords.length}
            totalWords={placedWords.length}
          />
        </div>

        <h2 className="text-lg font-bold text-white mb-2">
          Player: {playerName} ({difficulty.toUpperCase()} mode)
        </h2>

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

      {/* Results Modal */}
      {gameOver && (
        <ResultsModal
          isOpen={true}
          onRestart={startNewGame}
          onExit={() => (window.location.href = "/")}
          foundWords={foundWords.length}
          totalWords={placedWords.length}
          oranges={orangesEarned}
          isBonus={isBonus}
        />
      )}
    </div>
  );
};

export default GameContent;

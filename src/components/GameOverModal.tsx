"use client";

import { useRouter } from "next/navigation";

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  foundWords: string[];
  totalWords: number;
  onRestart: () => void;
}

const getRank = (score: number) => {
  if (score >= 80) return "Platinum";
  if (score >= 50) return "Gold";
  if (score >= 30) return "Silver";
  return "Bronze";
};

const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  foundWords,
  totalWords,
  onRestart,
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-11/12 md:w-1/3 text-center shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-orange-600">Game Over!</h2>
        <p className="mb-2 text-black">Score: {score}</p>
        <p className="mb-2 text-black">Rank: {getRank(score)}</p>
        <p className="mb-4 text-black">
          Words Found: {foundWords.length}/{totalWords}
        </p>

        <ul className="mb-4 max-h-40 overflow-y-auto text-left px-4">
          {foundWords.map((word) => (
            <li key={word} className="text-green-600 font-semibold">
              ✅ {word.toUpperCase()}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition"
          >
            Play Again
          </button>
          <button
            onClick={() => router.push("/")} // navigate to home
            className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;

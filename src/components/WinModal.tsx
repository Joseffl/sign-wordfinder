"use client";

import { useRouter } from "next/navigation";

interface WinModalProps {
  isOpen: boolean;
  score: number;
  totalWords: number;
  onRestart: () => void;
}

const WinModal: React.FC<WinModalProps> = ({ isOpen, score, totalWords, onRestart }) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-11/12 md:w-1/3 text-center shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-green-600">🎉 You Win!</h2>
        <p className="mb-2 text-black">Score: {score}</p>
        <p className="mb-4 text-black">You found all {totalWords} words!</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition"
          >
            Play Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinModal;

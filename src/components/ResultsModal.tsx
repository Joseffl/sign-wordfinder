"use client";

interface ResultsModalProps {
  isOpen: boolean;
  onRestart: () => void;
  onExit: () => void;
  foundWords: number;
  totalWords: number;
  oranges: number;
  isBonus: boolean;
}

const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  onRestart,
  onExit,
  foundWords,
  totalWords,
  oranges,
  isBonus,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-11/12 md:w-1/3 text-center shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-orange-600">
          {foundWords === totalWords ? "🎉 Perfect Run!" : "⏰ Time's Up!"}
        </h2>

        <p className="mb-2 text-black font-medium">
          You found {foundWords} / {totalWords} words.
        </p>

        <p className="text-lg font-semibold text-orange-500">
          🍊 {oranges} oranges earned {isBonus && "(+50% Bonus!)"}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition"
          >
            Play Again
          </button>
          <button
            onClick={onExit}
            className="bg-gray-200 text-black px-6 py-2 rounded-lg font-bold hover:scale-105 transition"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;

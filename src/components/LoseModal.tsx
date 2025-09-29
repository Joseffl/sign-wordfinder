"use client";

import { useRouter } from "next/navigation";

interface LoseModalProps {
  isOpen: boolean;
  onRestart: () => void;
}

const LoseModal: React.FC<LoseModalProps> = ({ isOpen, onRestart }) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-11/12 md:w-1/3 text-center shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-red-600">😞 You Lose!</h2>
        <p className="mb-4 text-black">Time’s up! Better luck next time.</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition"
          >
            Try Again
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

export default LoseModal;

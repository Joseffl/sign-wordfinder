"use client";

interface ScoreBoardProps {
  score: number;
  foundWordsCount: number;
  totalWords: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, foundWordsCount, totalWords }) => {
  return (
    <div className="flex justify-between items-center bg-orange-200 p-3 rounded text-orange-800 font-semibold shadow-md gap-2">
      <div>Score: {score}</div>
      <div>
        Found: {foundWordsCount}/{totalWords}
      </div>
    </div>
  );
};

export default ScoreBoard;

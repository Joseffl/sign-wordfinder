"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const SetupPage = () => {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [time, setTime] = useState(60);

  const handleStartGame = () => {
    if (!playerName) return alert("Please enter your name!");

    router.push(
      `/game?name=${encodeURIComponent(playerName)}&difficulty=${difficulty}&time=${time}`
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-300 via-orange-400 to-orange-600">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-orange-600 text-center">
            Game Setup
          </h2>

          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-2 border border-orange-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-gray-400 text-gray-800 "
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-orange-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-500 "
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Limit
            </label>
            <select
              value={time}
              onChange={(e) => setTime(Number(e.target.value))}
              className="w-full px-4 py-2 border border-orange-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 "
            >
              <option value={30}>30s</option>
              <option value={60}>60s</option>
              <option value={90}>90s</option>
            </select>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full py-3 rounded-lg bg-orange-600 text-white font-bold shadow-md hover:scale-105 transition"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;

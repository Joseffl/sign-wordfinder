"use client";

import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();

  const handleStart = (mode: number) => {
    router.push(`/game?mode=${mode}`);
  };


  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
      <div className="text-center space-y-8 text-white">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">
          Sign Word Finder
        </h1>
        <p className="text-lg md:text-xl font-light">
          Find as many Sign-related words as you can before time runs out!
        </p>

        {/* Mode buttons */}
        <div className="flex flex-col space-y-4 max-w-xs mx-auto">
          <button
            onClick={() => handleStart(60)}
            className="px-6 py-3 rounded-lg bg-white text-orange-600 font-semibold shadow-md hover:scale-105 transition"
          >
            60s Blitz
          </button>
          <button
            onClick={() => handleStart(120)}
            className="px-6 py-3 rounded-lg bg-white text-orange-600 font-semibold shadow-md hover:scale-105 transition"
          >
            120s Classic
          </button>
          <button
            onClick={() => handleStart(180)}
            className="px-6 py-3 rounded-lg bg-white text-orange-600 font-semibold shadow-md hover:scale-105 transition"
          >
            180s Marathon
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

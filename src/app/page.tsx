"use client";

import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();

  const handleStart = () => {
    router.push("/setup");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-8 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">
            Sign Word Finder
          </h1>
          <p className="text-lg md:text-xl font-light max-w-md mx-auto">
            Find as many Sign-related words as you can before time runs out!  
            Challenge yourself and earn oranges 🍊 
          </p>

          <button
            onClick={handleStart}
            className="px-8 py-4 rounded-lg bg-white text-orange-600 font-semibold shadow-lg hover:scale-105 transition"
          >
            Get Started
          </button>
        </div>
      </div>

      <footer className="text-center py-4 text-white font-semibold">
        Made with ❤️ by Joe
      </footer>
    </div>
  );
};

export default LandingPage;

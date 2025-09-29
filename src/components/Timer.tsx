"use client";

import { useState, useEffect } from "react";

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isPaused?: boolean; // pause the countdown
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isPaused = false }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration); // reset when duration changes
  }, [duration]);

  useEffect(() => {
    if (isPaused) return; // do nothing if paused
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isPaused, onTimeUp]);

  // Format time mm:ss
  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div className="text-white font-bold text-xl">
      {minutes}:{seconds}
    </div>
  );
};

export default Timer;

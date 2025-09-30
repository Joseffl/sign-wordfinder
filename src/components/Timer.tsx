"use client";

import { useEffect, useState } from "react";

interface TimerProps {
  duration: number;
  onTimeUp: (timeRemaining: number) => void;
  onTick?: (timeRemaining: number) => void;
  isPaused: boolean;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, onTick, isPaused }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (isPaused) return;

    if (timeLeft <= 0) {
      onTimeUp(0);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(interval);
          onTimeUp(0);
          return 0;
        }
        if (onTick) onTick(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isPaused, onTimeUp, onTick]);

  return (
    <div className="text-2xl font-bold text-white">
      Time: {timeLeft}s
    </div>
  );
};

export default Timer;

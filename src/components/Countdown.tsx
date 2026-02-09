import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownProps {
  // Set your target date and relationship start date
  targetDate?: Date;
  startDate?: Date;
}

// Default dates - update these!
const DEFAULT_TARGET = new Date('2025-02-14T00:00:00'); // Valentine's Day 2025
const DEFAULT_START = new Date('2023-01-01T00:00:00'); // When you started dating

export function Countdown({
  targetDate = DEFAULT_TARGET,
  startDate = DEFAULT_START,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));
  const [daysTogether, setDaysTogether] = useState(getDaysTogether(startDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
      setDaysTogether(getDaysTogether(startDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, startDate]);

  const isPast = timeLeft.total <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-4 z-40"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-3 text-center">
        {/* Days together counter */}
        <div className="mb-2 pb-2 border-b border-pink-soft/30">
          <span className="text-2xl font-display text-pink-soft">{daysTogether}</span>
          <p className="text-xs text-text-dark/50">days together</p>
        </div>

        {/* Countdown or celebration */}
        {!isPast ? (
          <div>
            <p className="text-xs text-text-dark/50 mb-1">Valentine's Day</p>
            <div className="flex gap-2 text-center">
              <TimeUnit value={timeLeft.days} label="d" />
              <TimeUnit value={timeLeft.hours} label="h" />
              <TimeUnit value={timeLeft.minutes} label="m" />
            </div>
          </div>
        ) : (
          <div>
            <span className="text-lg">💝</span>
            <p className="text-xs text-text-dark/60">Happy Valentine's!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline">
      <span className="text-lg font-display text-text-dark">{value}</span>
      <span className="text-xs text-text-dark/50">{label}</span>
    </div>
  );
}

function getTimeLeft(targetDate: Date) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  return {
    total: diff,
    days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
    hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
    minutes: Math.max(0, Math.floor((diff / 1000 / 60) % 60)),
    seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
  };
}

function getDaysTogether(startDate: Date) {
  const now = new Date();
  const diff = now.getTime() - startDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

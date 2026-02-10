import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownProps {
  startDate?: Date;
}

const DEFAULT_START = new Date('2021-09-18T00:00:00'); // Anniversary date

export function Countdown({ startDate = DEFAULT_START }: CountdownProps) {
  const [daysTogether, setDaysTogether] = useState(getDaysTogether(startDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setDaysTogether(getDaysTogether(startDate));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [startDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-4 z-40"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-3 text-center">
        <span className="text-2xl font-display text-pink-soft">{daysTogether}</span>
        <p className="text-xs text-text-dark/50">days together</p>
      </div>
    </motion.div>
  );
}

function getDaysTogether(startDate: Date) {
  const now = new Date();
  const diff = now.getTime() - startDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

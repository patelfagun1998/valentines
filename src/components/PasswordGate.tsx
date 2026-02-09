import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WatercolorHeart } from './WatercolorHeart';

const CORRECT_PASSWORD = 'I love Fagun';

export function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState<'question' | 'password'>('question');
  const [password, setPassword] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleYesClick = () => {
    setStep('password');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === CORRECT_PASSWORD.toLowerCase()) {
      setIsOpening(true);
      setTimeout(onSuccess, 2000);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lavender/50 via-pink-soft/30 to-peach/50 overflow-hidden font-body">
      {/* Soft floating hearts background */}
      <FloatingHearts />

      <AnimatePresence mode="wait">
        {!isOpening ? (
          <motion.div
            key="polaroid"
            className={`relative ${isShaking ? 'shake' : ''}`}
            initial={{ scale: 0.9, opacity: 0, rotate: -3 }}
            animate={{ scale: 1, opacity: 1, rotate: -2 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            whileHover={{ rotate: 0 }}
          >
            {/* Polaroid frame */}
            <div className="bg-white p-5 pb-20 max-w-xs relative">
              {/* Photo area with gradient */}
              <div className="bg-gradient-to-br from-lavender via-pink-soft/50 to-peach aspect-square flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {step === 'question' ? (
                    <motion.div
                      key="question"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center p-6"
                    >
                      <motion.div
                        className="mb-6"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <WatercolorHeart size={80} animate={false} />
                      </motion.div>
                      <h1 className="text-2xl font-display text-text-dark mb-6">
                        Are you Dhanushikka?
                      </h1>
                      <motion.button
                        onClick={handleYesClick}
                        className="text-text-dark font-body text-lg px-6 py-2.5 relative"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Cloud/bouncy outline */}
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox="0 0 120 50"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M10,25
                               Q5,15 15,10
                               Q25,5 35,8
                               Q45,3 55,6
                               Q65,2 75,7
                               Q85,4 95,10
                               Q110,8 115,20
                               Q120,30 110,38
                               Q100,48 85,45
                               Q70,50 55,46
                               Q40,50 25,45
                               Q10,48 5,38
                               Q0,28 10,25 Z"
                            fill="none"
                            stroke="#5D4037"
                            strokeWidth="1.5"
                          />
                        </svg>
                        <span className="relative z-10">Prove it</span>
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="password"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center p-6 w-full"
                    >
                      <p className="text-lg font-body text-text-dark/70 mb-4 italic">
                        What's the magic words?
                      </p>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                          type="text"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password..."
                          className="w-full px-4 py-3 rounded-lg border border-pink-soft/50 bg-white/90 font-body text-text-dark placeholder:text-text-dark/30 focus:outline-none focus:border-pink-soft transition-all"
                          autoFocus
                        />
                        <motion.button
                          type="submit"
                          className="w-full bg-lavender text-text-dark font-body px-6 py-2.5 rounded-full hover:bg-lavender/80 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Open
                        </motion.button>
                      </form>
                      <motion.button
                        onClick={() => setStep('question')}
                        className="mt-3 text-text-dark/50 font-body text-sm hover:text-text-dark/70 transition-colors"
                      >
                        ← Back
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Polaroid bottom text area */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="font-display text-text-dark/60 text-sm tracking-wide">
                  February 2025
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="opening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.6, opacity: 1 }}
              transition={{
                duration: 1.8,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <WatercolorHeart size={120} animate={false} />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.8,
                duration: 0.6,
                ease: 'easeOut'
              }}
              className="mt-8 text-3xl font-display text-text-dark"
            >
              Welcome, my love...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FloatingHearts() {
  const hearts = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {hearts.map((i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${15 + i * 14}%`,
          }}
          initial={{
            y: '110vh',
            opacity: 0.3,
          }}
          animate={{
            y: '-10vh',
          }}
          transition={{
            duration: 18 + i * 2,
            repeat: Infinity,
            delay: i * 2.5,
            ease: 'linear',
          }}
        >
          <WatercolorHeart size={25 + i * 5} animate={false} />
        </motion.div>
      ))}
    </div>
  );
}

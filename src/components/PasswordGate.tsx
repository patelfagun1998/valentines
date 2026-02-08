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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lavender via-pink-soft/50 to-peach/50 overflow-hidden">
      {/* Soft floating hearts background */}
      <FloatingHearts />

      {/* Main envelope */}
      <motion.div
        className={`relative ${isShaking ? 'shake' : ''}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <AnimatePresence mode="wait">
          {!isOpening ? (
            <motion.div
              key="envelope"
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative"
            >
              {/* Envelope body */}
              <div className="w-96 h-64 bg-gradient-to-b from-cream via-cream to-peach/30 rounded-lg shadow-2xl relative overflow-hidden">
                {/* Paper texture */}
                <div className="absolute inset-0 opacity-5">
                  <div className="h-full w-full" style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 12px, #5D4037 12px, #5D4037 13px)'
                  }} />
                </div>

                {/* Envelope flap */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-28 origin-top"
                  style={{
                    background: 'linear-gradient(180deg, #FFDAB9 0%, #FFB5C5 50%, #E6E6FA 100%)',
                    clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                  }}
                  animate={step === 'password' ? { rotateX: 0 } : { rotateX: 0 }}
                />

                {/* Wax seal */}
                <motion.div
                  className="absolute top-20 left-1/2 -translate-x-1/2 z-10"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 via-red-500 to-rose-600 shadow-lg flex items-center justify-center relative">
                    {/* Seal texture */}
                    <div className="absolute inset-1 rounded-full border-2 border-rose-300/30" />
                    <WatercolorHeart size={36} animate={false} />
                  </div>
                </motion.div>

                {/* Content area */}
                <div className="absolute bottom-0 left-0 right-0 top-32 flex flex-col items-center justify-center p-6">
                  <AnimatePresence mode="wait">
                    {step === 'question' ? (
                      <motion.div
                        key="question"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-center"
                      >
                        <h1 className="text-3xl font-display text-text-dark mb-6 tracking-wide">
                          Are you Dhanushikka?
                        </h1>
                        <motion.button
                          onClick={handleYesClick}
                          className="bg-gradient-to-r from-pink-soft to-lavender text-text-dark font-body text-lg px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Yes, that's me
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="password"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-center w-full px-4"
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
                            className="w-full px-4 py-3 rounded-lg border border-pink-soft/50 bg-white/80 font-body text-text-dark placeholder:text-text-dark/30 focus:outline-none focus:border-pink-soft focus:ring-2 focus:ring-pink-soft/20 transition-all"
                            autoFocus
                          />
                          <motion.button
                            type="submit"
                            className="w-full bg-gradient-to-r from-lavender to-mint text-text-dark font-body px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow"
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
              </div>

              {/* Envelope shadow */}
              <div className="absolute -bottom-4 left-4 right-4 h-8 bg-black/10 blur-xl rounded-full" />
            </motion.div>
          ) : (
            <motion.div
              key="opening"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 1, rotate: 0 }}
                animate={{
                  scale: [1, 1.5, 2],
                  rotate: [0, -5, 5, 0],
                }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              >
                <WatercolorHeart size={150} animate={false} />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-2xl font-display text-text-dark"
              >
                Welcome, my love...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
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
          initial={{
            x: `${15 + i * 15}vw`,
            y: '110vh',
            opacity: 0.4,
          }}
          animate={{
            y: '-10vh',
            x: `${15 + i * 15 + (Math.random() - 0.5) * 10}vw`,
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 2,
            ease: 'linear',
          }}
        >
          <WatercolorHeart size={30 + Math.random() * 20} animate={false} />
        </motion.div>
      ))}
    </div>
  );
}

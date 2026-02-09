import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Add your songs here - place audio files in /public/music/
const playlist = [
  { id: '1', title: '[Song 1]', src: '/music/song1.mp3' },
  { id: '2', title: '[Song 2]', src: '/music/song2.mp3' },
  // Add more songs...
];

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = playlist[currentTrack];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  if (playlist.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 z-50"
    >
      <audio
        ref={audioRef}
        src={currentSong?.src}
        onEnded={nextTrack}
      />

      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 w-64"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-display text-text-dark">Now Playing</span>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-text-dark/50 hover:text-text-dark"
              >
                ✕
              </button>
            </div>

            {/* Track info */}
            <p className="text-text-dark font-body text-sm truncate mb-3">
              {currentSong?.title || 'No track'}
            </p>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={prevTrack}
                className="text-text-dark/60 hover:text-text-dark transition-colors"
              >
                ⏮
              </button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-pink-soft flex items-center justify-center hover:bg-pink-soft/80 transition-colors"
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                onClick={nextTrack}
                className="text-text-dark/60 hover:text-text-dark transition-colors"
              >
                ⏭
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setIsExpanded(true)}
            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
          >
            <span className="text-xl">{isPlaying ? '🎵' : '🎶'}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Add your YouTube videos here - use the video ID from the URL
// Example: https://www.youtube.com/watch?v=xFrGuyw1V8s -> ID is "xFrGuyw1V8s"
const playlist = [
  { id: 'xFrGuyw1V8s', title: 'Dancing Queen - ABBA' },
  // Add more songs:
  // { id: 'VIDEO_ID', title: 'Song Title - Artist' },
];

export function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded

  const currentSong = playlist[currentTrack];

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
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 w-80"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-display text-text-dark">Now Playing</span>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-text-dark/50 hover:text-text-dark text-lg leading-none"
                aria-label="Close player"
              >
                ×
              </button>
            </div>

            {/* YouTube Player */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3">
              <iframe
                src={`https://www.youtube.com/embed/${currentSong.id}?autoplay=1&rel=0`}
                title={currentSong.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Track info */}
            <p className="text-text-dark font-body text-sm truncate mb-3 text-center">
              {currentSong?.title || 'No track'}
            </p>

            {/* Track navigation (if multiple songs) */}
            {playlist.length > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={prevTrack}
                  className="text-text-dark/60 hover:text-text-dark transition-colors text-lg"
                  aria-label="Previous track"
                >
                  ⏮
                </button>
                <span className="text-text-dark/40 text-sm">
                  {currentTrack + 1} / {playlist.length}
                </span>
                <button
                  onClick={nextTrack}
                  className="text-text-dark/60 hover:text-text-dark transition-colors text-lg"
                  aria-label="Next track"
                >
                  ⏭
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setIsExpanded(true)}
            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
            aria-label="Open music player"
          >
            <span className="text-xl">🎵</span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Add your YouTube videos here - use the video ID from the URL
const playlist = [
  { id: 'xFrGuyw1V8s', title: 'Dancing Queen - ABBA' },
  // { id: 'VIDEO_ID', title: 'Song Title - Artist' },
];

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSong = playlist[currentTrack];

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT) {
      initPlayer();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = initPlayer;
  }, []);

  const initPlayer = () => {
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    playerRef.current = new window.YT.Player('yt-player', {
      height: '1',
      width: '1',
      videoId: currentSong.id,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: () => {
          setIsReady(true);
          setIsPlaying(true);
        },
        onStateChange: (event: YT.OnStateChangeEvent) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          if (event.data === window.YT.PlayerState.ENDED) {
            nextTrack();
          }
        },
      },
    });
  };

  // Change track
  useEffect(() => {
    if (playerRef.current && isReady) {
      playerRef.current.loadVideoById(currentSong.id);
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

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
      {/* Hidden YouTube Player */}
      <div className="absolute -left-[9999px]" ref={containerRef}>
        <div id="yt-player" />
      </div>

      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 w-64"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-display text-text-dark">Now Playing</span>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-text-dark/50 hover:text-text-dark text-lg leading-none"
                aria-label="Minimize player"
              >
                −
              </button>
            </div>

            {/* Track info */}
            <p className="text-text-dark font-body text-sm truncate mb-4 text-center">
              {currentSong?.title || 'No track'}
            </p>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              {playlist.length > 1 && (
                <button
                  onClick={prevTrack}
                  className="text-text-dark/60 hover:text-text-dark transition-colors text-lg"
                  aria-label="Previous track"
                >
                  ⏮
                </button>
              )}
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-pink-soft flex items-center justify-center hover:bg-pink-soft/80 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              {playlist.length > 1 && (
                <button
                  onClick={nextTrack}
                  className="text-text-dark/60 hover:text-text-dark transition-colors text-lg"
                  aria-label="Next track"
                >
                  ⏭
                </button>
              )}
            </div>
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
            <span className="text-xl">{isPlaying ? '🎵' : '🎶'}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

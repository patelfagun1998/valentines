import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Letter } from './Letter';
import { WatercolorHeart } from './WatercolorHeart';
import { WorldMap, LocationDetail } from './WorldMap';
import { Timeline } from './Timeline';
// import { LoveNotes } from './LoveNotes'; // Hidden for now
import { MusicPlayer } from './MusicPlayer';
import { Countdown } from './Countdown';

// Letters data - add more entries here
const letters = [
  {
    id: '2025-02-14',
    date: 'February 14, 2025',
    title: "Valentine's Day",
    content: `[Your Valentine's Day letter content here]

[Add your paragraphs...]

[Signature]`,
  },
  // Add more letters like:
  // {
  //   id: '2025-02-15',
  //   date: 'February 15, 2025',
  //   title: 'The Day After',
  //   content: `...`,
  // },
];

type Tab = 'home' | 'letter' | 'map' | 'timeline' | 'notes';

const tabs: { id: Tab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'letter', label: 'Letters' },
  { id: 'map', label: 'Our World' },
  { id: 'timeline', label: 'Timeline' },
  // { id: 'notes', label: 'Love Notes' }, // Hidden for now
];

export function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  const openLatestLetter = () => {
    if (letters.length > 0) {
      setSelectedLetterId(letters[0].id);
      setActiveTab('letter');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender/30 via-cream to-peach/30 font-body">
      {/* Persistent elements */}
      <MusicPlayer />
      <Countdown />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-cream/80 backdrop-blur-sm border-b border-pink-soft/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-pink-soft text-text-dark'
                    : 'text-text-dark/60 hover:text-text-dark hover:bg-pink-soft/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="py-12 px-4">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && <WelcomeContent key="home" onOpenLetter={openLatestLetter} />}
          {activeTab === 'letter' && <LetterContent key="letter" initialLetterId={selectedLetterId} onClearSelection={() => setSelectedLetterId(null)} />}
          {activeTab === 'map' && (
            <MapContent
              key="map"
              selectedLocationId={selectedLocationId}
              onSelectLocation={setSelectedLocationId}
            />
          )}
          {activeTab === 'timeline' && <TimelineContent key="timeline" />}
          {/* {activeTab === 'notes' && <LoveNotesContent key="notes" />} */}
        </AnimatePresence>
      </main>
    </div>
  );
}

function WelcomeContent({ onOpenLetter }: { onOpenLetter: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="text-center max-w-2xl mx-auto"
    >
      <h1 className="text-5xl font-display text-text-dark mb-4">
        Welcome, Dhanushikka
      </h1>
      <p className="text-xl text-text-dark/70 mb-10">
        You made it inside!
      </p>

      {/* Clickable Envelope */}
      <motion.button
        onClick={onOpenLetter}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="relative mx-auto cursor-pointer"
      >
        <svg width="280" height="200" viewBox="0 0 280 200" fill="none">

          {/* Envelope body (back) */}
          <rect x="10" y="30" width="260" height="160" rx="4" fill="#e8d4b0" />

          {/* Inner V fold lines on body */}
          <path d="M10 30 L140 120 L270 30" fill="none" stroke="#d4c4a0" strokeWidth="1" />

          {/* Bottom flap (left triangle) */}
          <path d="M10 190 L10 80 L130 190 Z" fill="#f0ddb8" />

          {/* Bottom flap (right triangle) */}
          <path d="M270 190 L270 80 L150 190 Z" fill="#ecdbb5" />

          {/* Bottom edge */}
          <path d="M10 190 L130 190 L140 180 L150 190 L270 190" fill="none" stroke="#d4c4a0" strokeWidth="0.5" />

          {/* Top flap (closed) */}
          <path d="M10 30 L140 110 L270 30 Z" fill="url(#flapGradient)" />

          {/* Flap fold shadow */}
          <path d="M10 30 L140 110 L270 30" fill="none" stroke="#c9b89a" strokeWidth="1" />

          <defs>
            <linearGradient id="flapGradient" x1="140" y1="30" x2="140" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f5e6c8" />
              <stop offset="100%" stopColor="#e8d8b8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Wax seal - centered on flap point (140, 110) */}
        <motion.div
          initial={{ scale: 0, x: '-50%' }}
          animate={{ scale: 1, x: '-50%' }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="absolute z-20"
          style={{ top: '82px', left: '50%' }}
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 via-red-500 to-rose-700 shadow-lg flex items-center justify-center">
            <div className="absolute inset-0.5 rounded-full border border-rose-300/20" />
            <WatercolorHeart size={28} animate={false} />
          </div>
        </motion.div>

      </motion.button>
    </motion.div>
  );
}

function LetterContent({ initialLetterId, onClearSelection }: { initialLetterId: string | null; onClearSelection: () => void }) {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(initialLetterId);
  const activeLetter = letters.find((l) => l.id === selectedLetter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {!selectedLetter ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display text-text-dark">Letters</h2>
            </div>

            {/* Timeline of letters */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-pink-soft/40" />

              {letters.map((letter, i) => (
                <motion.button
                  key={letter.id}
                  onClick={() => setSelectedLetter(letter.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="relative flex items-center gap-4 w-full text-left py-4 group"
                >
                  {/* Dot on timeline */}
                  <div className="relative z-10 w-12 h-12 rounded-full bg-cream border-2 border-pink-soft flex items-center justify-center group-hover:bg-pink-soft/20 transition-colors">
                    <WatercolorHeart size={24} animate={false} />
                  </div>

                  {/* Letter card */}
                  <div className="flex-1 bg-white/60 rounded-lg p-4 shadow-sm group-hover:shadow-md transition-shadow">
                    <p className="font-display text-text-dark text-lg">{letter.date}</p>
                    <p className="text-text-dark/60 text-sm">{letter.title}</p>
                  </div>
                </motion.button>
              ))}

              {letters.length === 0 && (
                <p className="text-center text-text-dark/50 py-8 italic">
                  No letters yet...
                </p>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Back button */}
            <button
              onClick={() => { setSelectedLetter(null); onClearSelection(); }}
              className="mb-6 text-text-dark/60 hover:text-text-dark transition-colors flex items-center gap-2"
            >
              <span>←</span>
              <span>Back to letters</span>
            </button>

            <div className="text-center mb-6">
              <p className="text-text-dark/60">{activeLetter?.date}</p>
              <h2 className="text-2xl font-display text-text-dark">{activeLetter?.title}</h2>
            </div>

            <Letter content={activeLetter?.content} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MapContent({
  selectedLocationId,
  onSelectLocation,
}: {
  selectedLocationId: string | null;
  onSelectLocation: (id: string | null) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {!selectedLocationId ? (
          <WorldMap key="map" onSelectLocation={onSelectLocation} />
        ) : (
          <LocationDetail
            key="detail"
            locationId={selectedLocationId}
            onBack={() => onSelectLocation(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TimelineContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Timeline />
    </motion.div>
  );
}

// Hidden for now - uncomment when ready to show Love Notes
// function LoveNotesContent() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ duration: 0.3 }}
//     >
//       <LoveNotes />
//     </motion.div>
//   );
// }

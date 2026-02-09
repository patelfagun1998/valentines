import { motion } from 'framer-motion';
import { WatercolorHeart } from './WatercolorHeart';

// Itinerary items - add your plans here
const itineraryItems = [
  {
    id: '1',
    time: '10:00 AM',
    title: '[Activity 1]',
    description: '[Details]',
    icon: '🌅',
  },
  {
    id: '2',
    time: '12:30 PM',
    title: '[Activity 2]',
    description: '[Details]',
    icon: '🍽️',
  },
  {
    id: '3',
    time: '3:00 PM',
    title: '[Activity 3]',
    description: '[Details]',
    icon: '🎭',
  },
  {
    id: '4',
    time: '7:00 PM',
    title: '[Activity 4]',
    description: '[Details]',
    icon: '🌙',
  },
  // Add more items...
];

export function Itinerary() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-display text-text-dark">Our Day</h2>
        <p className="text-text-dark/60 mt-2">Valentine's Day 2025</p>
      </div>

      {/* Itinerary as a journal/planner style */}
      <div className="bg-white/70 rounded-lg shadow-lg overflow-hidden">
        {/* Header decoration */}
        <div className="h-3 bg-gradient-to-r from-pink-soft via-lavender to-mint" />

        <div className="p-6">
          {itineraryItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex gap-4 py-5 ${
                i !== itineraryItems.length - 1 ? 'border-b border-pink-soft/20' : ''
              }`}
            >
              {/* Time column */}
              <div className="w-20 flex-shrink-0 text-right">
                <span className="text-text-dark/50 text-sm">{item.time}</span>
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-lavender/30 flex items-center justify-center text-2xl flex-shrink-0">
                {item.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-display text-lg text-text-dark">{item.title}</h3>
                <p className="text-text-dark/60 mt-1">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-cream/50 p-4 flex items-center justify-center gap-2">
          <WatercolorHeart size={20} animate={false} />
          <span className="text-text-dark/50 text-sm">Best day ever</span>
          <WatercolorHeart size={20} animate={false} />
        </div>
      </div>
    </div>
  );
}

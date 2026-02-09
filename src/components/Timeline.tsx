import { motion } from 'framer-motion';
import { WatercolorHeart } from './WatercolorHeart';

// Timeline milestones - add your dates here
const milestones = [
  {
    id: '1',
    date: 'January 2023',
    title: '[First milestone]',
    description: '[Description]',
  },
  {
    id: '2',
    date: 'March 2023',
    title: '[Second milestone]',
    description: '[Description]',
  },
  {
    id: '3',
    date: 'June 2023',
    title: '[Third milestone]',
    description: '[Description]',
  },
  // Add more milestones...
];

export function Timeline() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-display text-text-dark">Our Story</h2>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-soft via-lavender to-mint" />

        {milestones.map((milestone, i) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="relative pl-20 pb-12 last:pb-0"
          >
            {/* Timeline dot */}
            <div className="absolute left-5 top-1 w-6 h-6 rounded-full bg-cream border-2 border-pink-soft flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-pink-soft" />
            </div>

            {/* Content card */}
            <div className="bg-white/60 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-sm text-text-dark/50">{milestone.date}</span>
              <h3 className="font-display text-xl text-text-dark mt-1">{milestone.title}</h3>
              <p className="text-text-dark/70 mt-2">{milestone.description}</p>
            </div>
          </motion.div>
        ))}

        {/* Future marker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: milestones.length * 0.15 }}
          className="relative pl-20"
        >
          <div className="absolute left-4 top-1">
            <WatercolorHeart size={24} animate={false} />
          </div>
          <p className="text-text-dark/40 italic pt-1">And many more to come...</p>
        </motion.div>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';

// Love notes - add your reasons here
const notes = [
  { id: '1', text: '[Reason 1]', color: 'bg-pink-soft' },
  { id: '2', text: '[Reason 2]', color: 'bg-lavender' },
  { id: '3', text: '[Reason 3]', color: 'bg-mint' },
  { id: '4', text: '[Reason 4]', color: 'bg-peach' },
  { id: '5', text: '[Reason 5]', color: 'bg-pink-soft' },
  { id: '6', text: '[Reason 6]', color: 'bg-lavender' },
  // Add more notes...
];

// Random rotation for each note
const getRotation = (index: number) => {
  const rotations = [-3, 2, -2, 3, -1, 2, -3, 1];
  return rotations[index % rotations.length];
};

export function LoveNotes() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-display text-text-dark">Why I Love You</h2>
      </div>

      {/* Notes grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {notes.map((note, i) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: getRotation(i),
            }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
            whileHover={{
              scale: 1.05,
              rotate: 0,
              zIndex: 10,
            }}
            className={`${note.color} p-5 rounded shadow-md cursor-default relative`}
            style={{
              minHeight: '120px',
            }}
          >
            {/* Tape effect */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-cream/60 rounded-sm" />

            <p className="text-text-dark font-body text-center leading-relaxed">
              {note.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Bottom decoration */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: notes.length * 0.08 + 0.3 }}
        className="text-center text-text-dark/40 mt-10 italic"
      >
        ...and a million more reasons
      </motion.p>
    </div>
  );
}

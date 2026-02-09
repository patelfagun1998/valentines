import { motion } from 'framer-motion';
import { WatercolorHeart } from './WatercolorHeart';

interface LetterProps {
  content?: string;
}

const defaultContent = `[Your letter content here]

[Add your paragraphs...]

[Signature]`;

export function Letter({ content = defaultContent }: LetterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      <div className="relative">
        {/* Paper shadow layers for depth */}
        <div className="absolute inset-0 bg-amber-900/10 rounded transform rotate-1 translate-x-1 translate-y-1" />
        <div className="absolute inset-0 bg-amber-800/10 rounded transform -rotate-1 translate-x-0.5 translate-y-0.5" />

        {/* Main parchment */}
        <div
          className="relative rounded p-8 md:p-12"
          style={{
            background: 'linear-gradient(135deg, #f5e6c8 0%, #f0ddb8 25%, #ebd5a8 50%, #f0ddb8 75%, #f5e6c8 100%)',
            boxShadow: 'inset 0 0 40px rgba(139, 90, 43, 0.15), 0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Subtle paper texture overlay */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none rounded"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Wax seal at top */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 via-red-500 to-rose-700 shadow-lg flex items-center justify-center"
            >
              <div className="absolute inset-1 rounded-full border border-rose-300/30" />
              <WatercolorHeart size={28} animate={false} />
            </motion.div>
          </div>

          {/* Letter content */}
          <div className="mt-6 relative">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {content.split('\n\n').map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.15, duration: 0.4 }}
                  className={`text-text-dark leading-relaxed mb-6 last:mb-0 ${
                    i === 0 ? 'text-xl font-display' : 'font-body'
                  } ${
                    paragraph.startsWith('Forever') || paragraph.startsWith('Love,') || paragraph.startsWith('Fagun')
                      ? 'text-right font-display text-lg italic'
                      : ''
                  }`}
                  style={{
                    textShadow: '0 1px 1px rgba(255,255,255,0.5)',
                  }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>
          </div>

          {/* Decorative corner flourishes */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-700/20 rounded-tl" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-700/20 rounded-tr" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-700/20 rounded-bl" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-700/20 rounded-br" />
        </div>
      </div>
    </motion.div>
  );
}

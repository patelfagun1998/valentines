import { motion } from 'framer-motion';

interface WatercolorHeartProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function WatercolorHeart({ size = 100, className = '', animate = true }: WatercolorHeartProps) {
  const HeartSvg = (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <defs>
        <radialGradient id="watercolorSolid" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFB5C5" stopOpacity="1" />
          <stop offset="50%" stopColor="#FFB5C5" stopOpacity="0.9" />
          <stop offset="75%" stopColor="#E6E6FA" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFDAB9" stopOpacity="0.7" />
        </radialGradient>
        <filter id="watercolorBlend" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </defs>
      {/* Shadow layer */}
      <path
        d="M50 88 C18 55, 2 32, 14 18 C28 2, 46 8, 50 26 C54 8, 72 2, 86 18 C98 32, 82 55, 50 88"
        fill="#5D4037"
        opacity="0.08"
        transform="translate(2, 3)"
      />
      {/* Main heart */}
      <path
        d="M50 88 C18 55, 2 32, 14 18 C28 2, 46 8, 50 26 C54 8, 72 2, 86 18 C98 32, 82 55, 50 88"
        fill="url(#watercolorSolid)"
        filter="url(#watercolorBlend)"
      />
      {/* Highlight */}
      <ellipse cx="35" cy="30" rx="8" ry="6" fill="white" opacity="0.3" />
    </svg>
  );

  if (!animate) {
    return HeartSvg;
  }

  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {HeartSvg}
    </motion.div>
  );
}

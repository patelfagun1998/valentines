import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import { WatercolorHeart } from './WatercolorHeart';

// GeoJSON for world map
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Location data - add your locations here
// coordinates are [longitude, latitude]
export const locations = [
  {
    id: 'paris',
    name: 'Paris',
    coordinates: [2.3522, 48.8566] as [number, number],
    date: 'June 2024',
    description: '[Add description]',
    photos: [] as string[],
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    coordinates: [139.6917, 35.6895] as [number, number],
    date: 'March 2024',
    description: '[Add description]',
    photos: [] as string[],
  },
  // Add more locations:
  // {
  //   id: 'new-york',
  //   name: 'New York',
  //   coordinates: [-74.006, 40.7128] as [number, number],
  //   date: 'December 2023',
  //   description: 'Our first trip together',
  //   photos: ['/photos/ny-1.jpg', '/photos/ny-2.jpg'],
  // },
];

interface WorldMapProps {
  onSelectLocation: (locationId: string) => void;
}

export function WorldMap({ onSelectLocation }: WorldMapProps) {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-display text-text-dark">Our World</h2>
      </div>

      <div className="relative bg-lavender/20 rounded-2xl overflow-hidden shadow-lg">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [0, 30],
          }}
          style={{ width: '100%', height: 'auto' }}
        >
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#E6E6FA"
                    stroke="#D4C4E8"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: '#DCD0E8' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {locations.map((location) => (
              <Marker
                key={location.id}
                coordinates={location.coordinates}
                onMouseEnter={() => setHoveredLocation(location.id)}
                onMouseLeave={() => setHoveredLocation(null)}
                onClick={() => onSelectLocation(location.id)}
                style={{ cursor: 'pointer' }}
              >
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {/* Heart marker */}
                  <circle
                    r={8}
                    fill="#FFB5C5"
                    stroke="#fff"
                    strokeWidth={2}
                    filter="drop-shadow(0 2px 3px rgba(0,0,0,0.2))"
                  />
                  {/* Pulse animation ring */}
                  <circle
                    r={8}
                    fill="none"
                    stroke="#FFB5C5"
                    strokeWidth={1}
                    opacity={0.5}
                  >
                    <animate
                      attributeName="r"
                      from="8"
                      to="16"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.5"
                      to="0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </motion.g>

                {/* Tooltip */}
                {hoveredLocation === location.id && (
                  <g>
                    <rect
                      x={-40}
                      y={-45}
                      width={80}
                      height={30}
                      rx={4}
                      fill="white"
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
                    />
                    <text
                      textAnchor="middle"
                      y={-25}
                      style={{
                        fontFamily: 'Italiana, serif',
                        fontSize: '12px',
                        fill: '#5D4037',
                      }}
                    >
                      {location.name}
                    </text>
                  </g>
                )}
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6 text-text-dark/60 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-pink-soft" />
          <span>{locations.length} places visited together</span>
        </div>
      </div>
    </div>
  );
}

interface LocationDetailProps {
  locationId: string;
  onBack: () => void;
}

export function LocationDetail({ locationId, onBack }: LocationDetailProps) {
  const location = locations.find((l) => l.id === locationId);

  if (!location) {
    return <div>Location not found</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <button
        onClick={onBack}
        className="mb-6 text-text-dark/60 hover:text-text-dark transition-colors flex items-center gap-2"
      >
        <span>←</span>
        <span>Back to map</span>
      </button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-display text-text-dark">{location.name}</h2>
        <p className="text-text-dark/60 mt-1">{location.date}</p>
      </div>

      {location.description && (
        <p className="text-center text-text-dark/70 mb-8">{location.description}</p>
      )}

      {/* Photo grid */}
      {location.photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {location.photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="aspect-square bg-white p-2 shadow-md"
              style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 2}deg)` }}
            >
              <img
                src={photo}
                alt={`${location.name} photo ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-lavender/20 rounded-lg">
          <WatercolorHeart size={60} animate={false} />
          <p className="text-text-dark/50 mt-4 italic">[Photos coming soon]</p>
        </div>
      )}
    </motion.div>
  );
}

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import { WatercolorHeart } from './WatercolorHeart';
import photosManifest from '../data/photos-manifest.json';

// GeoJSON for world map
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Location configs - coordinates and metadata
// Photos are loaded automatically from the manifest (generated at build time)
const locationConfigs: LocationConfig[] = [
  {
    id: 'seattle',
    name: 'Seattle',
    coordinates: [-122.3321, 47.6062] as [number, number],
    date: '',
    description: '',
  },
  {
    id: 'new-york',
    name: 'New York',
    coordinates: [-74.006, 40.7128] as [number, number],
    date: '',
    description: '',
  },
  {
    id: 'lake-tahoe',
    name: 'Lake Tahoe',
    coordinates: [-120.0324, 39.0968] as [number, number],
    date: '',
    description: '',
  },
  {
    id: 'kauai',
    name: 'Kauai',
    coordinates: [-159.526, 22.0964] as [number, number],
    date: '',
    description: '',
  },
  {
    id: 'san-francisco',
    name: 'San Francisco',
    coordinates: [-122.4194, 37.7749] as [number, number],
    date: '',
    description: '',
  },
  {
    id: 'vancouver',
    name: 'Vancouver',
    coordinates: [-123.1216, 49.2827] as [number, number],
    date: '',
    description: '',
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    coordinates: [4.9041, 52.3676] as [number, number],
    date: '',
    description: '',
  },
  {
    id: 'paris',
    name: 'Paris',
    coordinates: [2.3522, 48.8566] as [number, number],
    date: '',
    description: '',
  },
  {
    id: 'cologne',
    name: 'Cologne',
    coordinates: [6.9603, 50.9375] as [number, number],
    date: '',
    description: '',
  },
  {
    id: 'berlin',
    name: 'Berlin',
    coordinates: [13.405, 52.52] as [number, number],
    date: '',
    description: '',
  },
  {
    id: 'mallorca',
    name: 'Mallorca',
    coordinates: [2.6502, 39.5696] as [number, number],
    date: '',
    description: '',
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    coordinates: [2.1734, 41.3851] as [number, number],
    date: '',
    description: '',
  },
  {
    id: 'orlando',
    name: 'Orlando',
    coordinates: [-81.3792, 28.5383] as [number, number],
    date: '',
    description: '',
  },
  {
    id: 'yosemite',
    name: 'Yosemite',
    coordinates: [-119.5383, 37.8651] as [number, number],
    date: '',
    description: '',
  },
  {
    id: 'coachella',
    name: 'Coachella',
    coordinates: [-116.1739, 33.6803] as [number, number],
    date: '',
    description: '',
  },
  {
    id: 'san-diego',
    name: 'San Diego',
    coordinates: [-117.1611, 32.7157] as [number, number],
    date: '',
    description: '',
    photosId: 'socal-trip',
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    coordinates: [-118.2437, 34.0522] as [number, number],
    date: '',
    description: '',
    photosId: 'socal-trip',
  },
  {
    id: 'joshua-tree',
    name: 'Joshua Tree',
    coordinates: [-116.3131, 34.1347] as [number, number],
    date: '',
    description: '',
    photosId: 'socal-trip',
  },
  {
    id: 'olympic-national-park',
    name: 'Olympic National Park',
    coordinates: [-123.4979, 47.8021] as [number, number],
    date: '',
    description: '',
  },
  {
    id: 'boston',
    name: 'Boston',
    coordinates: [-71.0589, 42.3601] as [number, number],
    date: '',
    description: '',
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    coordinates: [72.5714, 23.0225] as [number, number],
    date: '',
    description: '',
  },
  {
    id: 'chennai',
    name: 'Chennai',
    coordinates: [80.2707, 13.0827] as [number, number],
    date: '',
    description: '',
  },
];

interface LocationConfig {
  id: string;
  name: string;
  coordinates: [number, number];
  date: string;
  description: string;
  photosId?: string; // Override which album folder to use for photos
}

interface Location extends LocationConfig {
  photos: string[];
  photosId: string;
}

// Merge configs with photo manifest
export const locations: Location[] = locationConfigs.map((config) => {
  const photoKey = config.photosId || config.id;
  const manifestData = (photosManifest as Record<string, { name: string; photos: string[] }>)[photoKey];
  return {
    ...config,
    photosId: photoKey,
    photos: manifestData?.photos || [],
  };
});

interface WorldMapProps {
  onSelectLocation: (locationId: string) => void;
}

export function WorldMap({ onSelectLocation }: WorldMapProps) {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scale factor for markers (inverse of zoom for consistent visual size)
  const markerScale = 1 / zoom;

  // Prevent page scroll while map is visible
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleMouseEnter = useCallback((locationId: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredLocation(locationId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredLocation(null);
    }, 100);
  }, []);

  return (
    <div className="w-full -mx-4 px-4 -mt-8">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-display text-text-dark">Our World</h2>
      </div>

      <div className="relative bg-lavender/20 rounded-2xl overflow-hidden shadow-lg" style={{ height: 'calc(100vh - 180px)', minHeight: '300px' }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 150,
            center: [-40, 35],
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup onMoveEnd={({ zoom: z }) => setZoom(z)}>
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
                      hover: { outline: 'none' },
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
                onMouseEnter={() => handleMouseEnter(location.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => onSelectLocation(location.id)}
                style={{ cursor: 'pointer' }}
              >
                <g style={{ transform: `scale(${markerScale})`, transition: 'transform 0.1s ease-out' }}>
                  <motion.g
                    initial={{ scale: 0 }}
                    animate={{ scale: hoveredLocation === location.id ? 1.2 : 1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
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
                    <g style={{ pointerEvents: 'none' }}>
                      <rect
                        x={-50}
                        y={-45}
                        width={100}
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
                </g>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Legend */}
      <div className="relative z-10 flex justify-center gap-6 mt-3 text-text-dark/60 text-sm">
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
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  if (!location) {
    return <div>Location not found</div>;
  }

  const hasPhotos = location.photos.length > 0;

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
        {location.date && <p className="text-text-dark/60 mt-1">{location.date}</p>}
      </div>

      {location.description && (
        <p className="text-center text-text-dark/70 mb-8">{location.description}</p>
      )}

      {/* Photo grid with lazy loading */}
      {hasPhotos ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {location.photos.map((filename, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.05, 0.5) }}
              className="aspect-square bg-white p-2 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 2}deg)` }}
              onClick={() => setSelectedPhoto(i)}
              whileHover={{ scale: 1.02, rotate: 0 }}
            >
              <img
                src={`/photos/${location.photosId}/${filename}`}
                alt={`${location.name} photo ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-lavender/20 rounded-lg">
          <WatercolorHeart size={60} animate={false} />
          <p className="text-text-dark/50 mt-4 italic">Photos coming soon</p>
        </div>
      )}

      {/* Photo Lightbox */}
      <AnimatePresence>
        {selectedPhoto !== null && (
          <LightboxOverlay
            location={location}
            selectedPhoto={selectedPhoto}
            onClose={() => setSelectedPhoto(null)}
            onPrev={() => setSelectedPhoto(selectedPhoto - 1)}
            onNext={() => setSelectedPhoto(selectedPhoto + 1)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LightboxOverlay({
  location,
  selectedPhoto,
  onClose,
  onPrev,
  onNext,
}: {
  location: Location;
  selectedPhoto: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const hasPrev = selectedPhoto > 0;
  const hasNext = selectedPhoto < location.photos.length - 1;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrev, hasNext, onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Image container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={`/photos/${location.photosId}/${location.photos[selectedPhoto]}`}
          alt={`${location.name} photo ${selectedPhoto + 1}`}
          className="max-w-full max-h-[80vh] object-contain"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
          <p className="font-display text-xl">{location.name}</p>
          <p className="text-white/70 text-sm">
            Photo {selectedPhoto + 1} of {location.photos.length}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white text-xl transition-colors"
        >
          ×
        </button>
      </motion.div>

      {/* Navigation arrows — placed on the overlay so they're never clipped */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white text-2xl transition-colors z-10"
        >
          ‹
        </button>
      )}
      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white text-2xl transition-colors z-10"
        >
          ›
        </button>
      )}
    </motion.div>
  );
}

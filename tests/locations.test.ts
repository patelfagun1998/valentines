import { describe, it, expect } from 'vitest';
import { locations } from '../src/components/WorldMap';
import photosManifest from '../src/data/photos-manifest.json';
import fs from 'fs';
import path from 'path';

describe('Location data', () => {
  it('should have unique location ids', () => {
    const ids = locations.map((l) => l.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have unique location names', () => {
    const names = locations.map((l) => l.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  it('should have valid coordinates for all locations', () => {
    for (const location of locations) {
      expect(location.coordinates).toHaveLength(2);
      const [lng, lat] = location.coordinates;
      expect(lng).toBeGreaterThanOrEqual(-180);
      expect(lng).toBeLessThanOrEqual(180);
      expect(lat).toBeGreaterThanOrEqual(-90);
      expect(lat).toBeLessThanOrEqual(90);
    }
  });

  it('should have a non-empty name for all locations', () => {
    for (const location of locations) {
      expect(location.name.trim().length).toBeGreaterThan(0);
    }
  });

  it('should have a non-empty id for all locations', () => {
    for (const location of locations) {
      expect(location.id.trim().length).toBeGreaterThan(0);
    }
  });
});

describe('Photos manifest', () => {
  const manifest = photosManifest as Record<string, { name: string; photos: string[] }>;

  it('should have at least one album', () => {
    expect(Object.keys(manifest).length).toBeGreaterThan(0);
  });

  it('every manifest album should have a photos array', () => {
    for (const [key, album] of Object.entries(manifest)) {
      expect(Array.isArray(album.photos), `${key} should have a photos array`).toBe(true);
    }
  });

  it('every manifest album should have a name', () => {
    for (const [key, album] of Object.entries(manifest)) {
      expect(album.name, `${key} should have a name`).toBeTruthy();
    }
  });

  it('photo files referenced in manifest should exist on disk', () => {
    for (const [albumId, album] of Object.entries(manifest)) {
      const albumDir = path.resolve(__dirname, '..', 'public', 'photos', albumId);
      if (!fs.existsSync(albumDir)) continue; // skip albums whose dirs haven't been created yet
      for (const photo of album.photos) {
        const photoPath = path.join(albumDir, photo);
        expect(fs.existsSync(photoPath), `Missing file: ${photoPath}`).toBe(true);
      }
    }
  });
});

describe('Location-manifest integration', () => {
  it('locations with a photosId override should resolve to a valid manifest album', () => {
    for (const location of locations) {
      if (location.photos.length > 0) {
        const manifestEntry = (photosManifest as Record<string, unknown>)[location.photosId];
        expect(manifestEntry, `${location.id} references photosId "${location.photosId}" which is missing from manifest`).toBeTruthy();
      }
    }
  });

  it('locations sharing a photosId should all get the same photos', () => {
    const grouped = new Map<string, typeof locations>();
    for (const loc of locations) {
      const group = grouped.get(loc.photosId) || [];
      group.push(loc);
      grouped.set(loc.photosId, group);
    }
    for (const [photosId, group] of grouped) {
      if (group.length > 1) {
        const firstPhotos = JSON.stringify(group[0].photos);
        for (const loc of group.slice(1)) {
          expect(JSON.stringify(loc.photos), `${loc.id} should share photos with ${group[0].id} via ${photosId}`).toBe(firstPhotos);
        }
      }
    }
  });
});

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const PHOTOS_DIR = path.join(ROOT_DIR, 'public', 'photos');
const MANIFEST_PATH = path.join(ROOT_DIR, 'src', 'data', 'photos-manifest.json');

// Location configs with Google Photos links
const locations = [
  {
    id: 'seattle',
    name: 'Seattle',
    googlePhotosLink: 'https://photos.app.goo.gl/7P6z2JjEF24G5NN58',
  },
  {
    id: 'new-york',
    name: 'New York',
    googlePhotosLink: 'https://photos.app.goo.gl/qrteA37sDmG7GGtVA',
  },
  {
    id: 'lake-tahoe',
    name: 'Lake Tahoe',
    googlePhotosLink: 'https://photos.app.goo.gl/BbvXKvphV8WLUCrk7',
  },
  {
    id: 'kauai',
    name: 'Kauai',
    googlePhotosLink: 'https://photos.app.goo.gl/bSAxudWt1uaBMnQr5',
  },
  {
    id: 'san-francisco',
    name: 'San Francisco',
    googlePhotosLink: 'https://photos.app.goo.gl/onm5RMYKnDM7qGQm7',
  },
  {
    id: 'vancouver',
    name: 'Vancouver',
    googlePhotosLink: 'https://photos.app.goo.gl/YtQ8p8MtngTDe6eZ9',
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    googlePhotosLink: 'https://photos.app.goo.gl/QH3qzPn7yibZ2ZoP9',
  },
  {
    id: 'paris',
    name: 'Paris',
    googlePhotosLink: 'https://photos.app.goo.gl/mu2ZHATgUaR1cRDK9',
  },
  {
    id: 'cologne',
    name: 'Cologne',
    googlePhotosLink: 'https://photos.app.goo.gl/TeoMVTVKqoqKjAes5',
  },
  {
    id: 'berlin',
    name: 'Berlin',
    googlePhotosLink: 'https://photos.app.goo.gl/YnQKtgp3GGLR6tKp7',
  },
  {
    id: 'mallorca',
    name: 'Mallorca',
    googlePhotosLink: 'https://photos.app.goo.gl/Gk12ZW35phxno2L79',
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    googlePhotosLink: 'https://photos.app.goo.gl/PH9aSdcVvwwwQgsH9',
  },
  {
    id: 'orlando',
    name: 'Orlando',
    googlePhotosLink: 'https://photos.app.goo.gl/dA1JAYbrnzFZc3ev9',
  },
];

const REQUEST_TIMEOUT = 30000;

/**
 * Download file from URL with redirect handling
 */
function downloadFile(url, destPath, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      reject(new Error('Too many redirects'));
      return;
    }

    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, { timeout: REQUEST_TIMEOUT }, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadFile(response.headers.location, destPath, maxRedirects - 1)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: HTTP ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(destPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    });

    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Fetch image URLs from Google Photos album using dedicated library
 */
async function fetchAlbumImages(albumUrl) {
  console.log('  Fetching album images...');

  try {
    const { fetchImageUrls } = await import('google-photos-album-image-url-fetch');
    const imageUrls = await fetchImageUrls(albumUrl);

    if (!imageUrls || imageUrls.length === 0) {
      console.log('  No images found in album');
      return [];
    }

    console.log(`  Found ${imageUrls.length} images in album`);
    return imageUrls;
  } catch (error) {
    console.error(`  Error fetching album: ${error.message}`);
    return [];
  }
}

async function processLocation(location) {
  console.log(`\nProcessing: ${location.name}`);

  const locationDir = path.join(PHOTOS_DIR, location.id);

  // Create directory if it doesn't exist
  if (!fs.existsSync(locationDir)) {
    fs.mkdirSync(locationDir, { recursive: true });
  }

  // Check if we already have photos
  const existingPhotos = fs.readdirSync(locationDir).filter(f =>
    /\.(jpg|jpeg|png|webp)$/i.test(f)
  );

  if (existingPhotos.length > 0) {
    console.log(`  Found ${existingPhotos.length} existing photos, skipping download`);
    return existingPhotos;
  }

  if (!location.googlePhotosLink) {
    console.log(`  No Google Photos link configured`);
    return [];
  }

  try {
    const imageData = await fetchAlbumImages(location.googlePhotosLink);
    const downloadedFiles = [];

    for (let i = 0; i < imageData.length; i++) {
      const item = imageData[i];
      // The library returns objects with url property, or just strings
      const imageUrl = typeof item === 'string' ? item : item.url;

      if (!imageUrl) continue;

      // Get high-resolution version
      let highResUrl = imageUrl;
      if (imageUrl.includes('googleusercontent.com')) {
        highResUrl = imageUrl.split('=')[0] + '=w2048-h2048';
      }

      const filename = `photo_${String(i + 1).padStart(3, '0')}.jpg`;
      const filepath = path.join(locationDir, filename);

      console.log(`  Downloading ${i + 1}/${imageData.length}: ${filename}`);

      try {
        await downloadFile(highResUrl, filepath);
        downloadedFiles.push(filename);
      } catch (err) {
        console.error(`  Failed to download: ${err.message}`);
      }

      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return downloadedFiles;
  } catch (error) {
    console.error(`  Error processing album: ${error.message}`);
    return [];
  }
}

async function main() {
  console.log('=== Photo Download Script ===\n');

  // Ensure directories exist
  if (!fs.existsSync(PHOTOS_DIR)) {
    fs.mkdirSync(PHOTOS_DIR, { recursive: true });
  }

  const dataDir = path.dirname(MANIFEST_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const manifest = {};

  for (const location of locations) {
    const photos = await processLocation(location);
    manifest[location.id] = {
      name: location.name,
      photos: photos,
    };
  }

  // Write manifest file
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest written to: ${MANIFEST_PATH}`);

  console.log('\n=== Done ===');
}

main().catch(console.error);

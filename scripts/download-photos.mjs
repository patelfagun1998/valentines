import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import https from 'https';
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
  // Add more locations here
];

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function scrapeGooglePhotosAlbum(url) {
  console.log(`Launching browser to scrape: ${url}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait for images to load
    await page.waitForSelector('img', { timeout: 30000 });

    // Scroll to load all images
    await autoScroll(page);

    // Extract high-res image URLs
    const imageUrls = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const urls = [];

      images.forEach((img) => {
        let src = img.src;
        // Google Photos uses =w and =h parameters for sizing
        // Remove size constraints to get full resolution
        if (src && src.includes('googleusercontent.com')) {
          // Get highest resolution by modifying URL
          src = src.replace(/=w\d+(-h\d+)?(-[a-z]+)?/gi, '=w2048');
          if (!urls.includes(src)) {
            urls.push(src);
          }
        }
      });

      return urls;
    });

    await browser.close();
    return imageUrls;
  } catch (error) {
    await browser.close();
    throw error;
  }
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 500;
      const timer = setInterval(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight || totalHeight > 10000) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });

  // Wait a bit for images to load after scrolling
  await new Promise((r) => setTimeout(r, 2000));
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
    const imageUrls = await scrapeGooglePhotosAlbum(location.googlePhotosLink);
    console.log(`  Found ${imageUrls.length} images`);

    const downloadedFiles = [];

    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      const filename = `photo_${String(i + 1).padStart(3, '0')}.jpg`;
      const filepath = path.join(locationDir, filename);

      console.log(`  Downloading ${i + 1}/${imageUrls.length}: ${filename}`);

      try {
        await downloadImage(url, filepath);
        downloadedFiles.push(filename);
      } catch (err) {
        console.error(`  Failed to download: ${err.message}`);
      }
    }

    return downloadedFiles;
  } catch (error) {
    console.error(`  Error scraping album: ${error.message}`);
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

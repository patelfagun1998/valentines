import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve(__dirname, '..', 'public');
const srcDir = path.resolve(__dirname, '..', 'src');

describe('Project structure', () => {
  it('should have required page files', () => {
    const pages = ['index.astro', 'entry-options.astro', 'preview.astro'];
    for (const page of pages) {
      const pagePath = path.join(srcDir, 'pages', page);
      expect(fs.existsSync(pagePath), `Missing page: ${page}`).toBe(true);
    }
  });

  it('should have required component files', () => {
    const components = [
      'Countdown.tsx',
      'HomePage.tsx',
      'Letter.tsx',
      'LoveNotes.tsx',
      'MusicPlayer.tsx',
      'PasswordGate.tsx',
      'PasswordGateWrapper.tsx',
      'Timeline.tsx',
      'WatercolorHeart.tsx',
      'WorldMap.tsx',
    ];
    for (const component of components) {
      const componentPath = path.join(srcDir, 'components', component);
      expect(fs.existsSync(componentPath), `Missing component: ${component}`).toBe(true);
    }
  });

  it('should have a photos-manifest.json', () => {
    const manifestPath = path.join(srcDir, 'data', 'photos-manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const content = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(typeof content).toBe('object');
  });

  it('should have a public/photos directory', () => {
    const photosDir = path.join(publicDir, 'photos');
    expect(fs.existsSync(photosDir)).toBe(true);
  });

  it('should have the layout file', () => {
    const layoutPath = path.join(srcDir, 'layouts', 'Layout.astro');
    expect(fs.existsSync(layoutPath)).toBe(true);
  });
});

describe('Config files', () => {
  const root = path.resolve(__dirname, '..');

  it('should have astro.config.mjs', () => {
    expect(fs.existsSync(path.join(root, 'astro.config.mjs'))).toBe(true);
  });

  it('should have tailwind.config.mjs', () => {
    expect(fs.existsSync(path.join(root, 'tailwind.config.mjs'))).toBe(true);
  });

  it('should have tsconfig.json', () => {
    expect(fs.existsSync(path.join(root, 'tsconfig.json'))).toBe(true);
  });

  it('should have package.json with required scripts', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'));
    expect(pkg.scripts.build).toBeTruthy();
    expect(pkg.scripts.dev).toBeTruthy();
    expect(pkg.scripts.test).toBeTruthy();
  });
});

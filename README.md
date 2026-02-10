# Valentines

A Valentine's Day website built with Astro, React, Tailwind CSS, and Framer Motion.

## Features

- **Password-gated entry** — a playful "Are you Dhanushikka?" door with a wax-sealed envelope
- **Love letters** — handwritten-style letters on parchment with wax seal details
- **Interactive world map** — pinned locations you've visited together, with heart markers for special cities
- **Photo galleries** — polaroid-style grids with a full lightbox (keyboard nav, prev/next)
- **Memory timeline** — scrollable milestones of the relationship
- **Days-together counter** — always visible in the corner
- **Music player** — background playlist support

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | [Astro](https://astro.build) |
| UI | [React 19](https://react.dev) |
| Styling | [Tailwind CSS](https://tailwindcss.com) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Maps | [react-simple-maps](https://www.react-simple-maps.io/) |
| Testing | [Vitest](https://vitest.dev) |
| CI | GitHub Actions |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/      # React components
│   ├── Countdown.tsx
│   ├── HomePage.tsx
│   ├── Letter.tsx
│   ├── LoveNotes.tsx
│   ├── MusicPlayer.tsx
│   ├── PasswordGate.tsx
│   ├── PasswordGateWrapper.tsx
│   ├── Timeline.tsx
│   ├── WatercolorHeart.tsx
│   └── WorldMap.tsx
├── data/
│   └── photos-manifest.json
├── layouts/
│   └── Layout.astro
├── pages/
│   ├── index.astro
│   ├── entry-options.astro
│   └── preview.astro
└── styles/
    └── global.css

public/
└── photos/          # Photo albums by location

tests/               # Vitest test suites
scripts/             # Utility scripts
```

## Adding Locations

Locations are configured in `src/components/WorldMap.tsx`. Each location has coordinates, a name, and optionally a `photosId` to share a photo album with another location.

Photos go in `public/photos/<album-id>/` and are registered in `src/data/photos-manifest.json`.

## Pushing Changes

All changes go through PRs with CI checks. Use the helper script:

```bash
bash scripts/push-pr.sh "Your commit message"
```

This creates a branch, opens a PR with auto-merge enabled, and switches back to `main`. The PR merges automatically once tests and build pass.

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Soft Pink | `#FFB5C5` | Primary accent, markers |
| Lavender | `#E6E6FA` | Backgrounds, map land |
| Mint | `#B5EAD7` | Secondary accent |
| Peach | `#FFDAB9` | Warm backgrounds |
| Cream | `#FFF8E7` | Base background |
| Text Dark | `#5D4037` | Body text |

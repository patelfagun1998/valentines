import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Timeline Data', () => {
  it('should have timeline milestones defined', () => {
    const timelinePath = path.join(process.cwd(), 'src', 'components', 'Timeline.tsx');
    const content = fs.readFileSync(timelinePath, 'utf-8');

    // Check that milestones array exists and has content
    expect(content).toContain('const milestones');
    expect(content).toContain('Met for the first time');
    expect(content).toContain('get engaged');
  });

  it('should have chronological milestones from 2021 to 2026', () => {
    const timelinePath = path.join(process.cwd(), 'src', 'components', 'Timeline.tsx');
    const content = fs.readFileSync(timelinePath, 'utf-8');

    expect(content).toContain('2021');
    expect(content).toContain('2022');
    expect(content).toContain('2023');
    expect(content).toContain('2024');
    expect(content).toContain('2025');
    expect(content).toContain('2026');
  });
});

describe('Letter Content', () => {
  it('should load letter from markdown file', () => {
    const homepagePath = path.join(process.cwd(), 'src', 'components', 'HomePage.tsx');
    const content = fs.readFileSync(homepagePath, 'utf-8');

    // Verify it imports the markdown file
    expect(content).toContain("import valentines2025Raw from '../assets/fagun_valentines.md?raw'");
    expect(content).toContain('parseMarkdown');
  });
});

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Assets', () => {
  it('should have the valentines letter markdown file', () => {
    const letterPath = path.join(process.cwd(), 'src', 'assets', 'fagun_valentines.md');
    expect(fs.existsSync(letterPath)).toBe(true);
  });

  it('should have valid frontmatter in letter', () => {
    const letterPath = path.join(process.cwd(), 'src', 'assets', 'fagun_valentines.md');
    const content = fs.readFileSync(letterPath, 'utf-8');

    expect(content).toContain('---');
    expect(content).toContain('id:');
    expect(content).toContain('date:');
    expect(content).toContain('title:');
  });

  it('should have letter content after frontmatter', () => {
    const letterPath = path.join(process.cwd(), 'src', 'assets', 'fagun_valentines.md');
    const content = fs.readFileSync(letterPath, 'utf-8');

    expect(content).toContain('Dear Dhanushikka');
    expect(content).toContain('Fagun');
  });
});

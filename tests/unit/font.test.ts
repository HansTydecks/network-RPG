import { describe, expect, it } from 'vitest';
import { CELL_H, GLYPHS, measureText, wrapText } from '../../src/engine/gfx/fontGlyphs';

describe('Pixelschrift', () => {
  it('jede Glyphe passt in die Zelle und hat gleich breite Zeilen', () => {
    for (const [ch, [top, spec]] of Object.entries(GLYPHS)) {
      const lines = spec.split('/');
      expect(top + lines.length, `Glyphe ${ch}`).toBeLessThanOrEqual(CELL_H);
      const widths = new Set(lines.map((l) => l.length));
      expect(widths.size, `Glyphe ${ch} hat ungleiche Zeilenbreiten`).toBe(1);
      expect(/^[.#/]+$/.test(spec), `Glyphe ${ch}`).toBe(true);
    }
  });

  it('enthält Alphabet, Ziffern und Umlaute', () => {
    for (const ch of 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÄÖÜäöüß0123456789.,!?:-()') {
      expect(GLYPHS[ch], ch).toBeDefined();
    }
  });

  it('bricht Text passend um', () => {
    const lines = wrapText('Hallo Alex! Das Internet ist weg – im ganzen Dorf.', 80);
    for (const l of lines) expect(measureText(l)).toBeLessThanOrEqual(80);
    expect(lines.join(' ')).toBe('Hallo Alex! Das Internet ist weg – im ganzen Dorf.');
  });
});

import { ALIASES } from '../../src/engine/gfx/fontGlyphs';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : p.endsWith('.ts') ? [p] : [];
  });
}

describe('Schrift deckt alle Spieltexte ab', () => {
  it('jedes Zeichen in String-Literalen der Inhalte und UI existiert als Glyphe', () => {
    const missing = new Set<string>();
    for (const f of [...files('src/content'), ...files('src/engine/ui'), ...files('src/engine/scenes')]) {
      if (f.includes('/art/')) continue;
      const src = readFileSync(f, 'utf8');
      for (const m of src.matchAll(/'((?:[^'\\\n]|\\.)*)'|`([^`]*)`/g)) {
        const text = (m[1] ?? m[2] ?? '').replace(/\\n/g, '').replace(/\$\{[^}]*\}/g, '').replace(/\\'/g, "'");
        for (const ch of text) if (ch !== ' ' && ch !== '\\' && ch !== '\n' && !GLYPHS[ch] && !ALIASES[ch] && ch.charCodeAt(0) > 31) missing.add(ch);
      }
    }
    expect([...missing]).toEqual([]);
  });
});

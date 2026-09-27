import { describe, expect, it } from 'vitest';
import { TILES } from '../../src/content/art/tiles';
import { CHARACTERS, characterFrames, pingFrames } from '../../src/content/art/characters';
import { PixBuf } from '../../src/engine/gfx/pixbuf';

describe('Grafiken', () => {
  it('alle Kacheln zeichnen ohne Fehler, Boden-Kacheln sind deckend', () => {
    const ids = new Set<string>();
    for (const t of TILES) {
      expect(ids.has(t.id), `doppelte Kachel ${t.id}`).toBe(false);
      ids.add(t.id);
      const b = new PixBuf(16, 16);
      t.draw(b);
      const filled = b.data.filter(Boolean).length;
      expect(filled, t.id).toBeGreaterThan(0);
      if (t.layer === 'ground') expect(filled, `${t.id} muss deckend sein`).toBe(256);
    }
  });

  it('Figuren haben 9 Frames mit sichtbaren Pixeln', () => {
    for (const c of CHARACTERS) {
      const frames = characterFrames(c);
      expect(frames).toHaveLength(9);
      for (const f of frames) expect(f.data.filter(Boolean).length).toBeGreaterThan(40);
    }
    expect(pingFrames()).toHaveLength(4);
  });
});

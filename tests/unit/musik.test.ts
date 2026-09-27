import { describe, expect, it } from 'vitest';
import { KARTEN_LIED, LIEDER, akkord, liedLaenge, melodieToene, midi, musterToene } from '../../src/engine/audio/musikLogic';
import { MAP_IDS } from '../../src/content/registry';

describe('Musik', () => {
  it('Noten und Akkorde werden richtig gelesen', () => {
    expect(midi('A4')).toBe(69);
    expect(midi('C4')).toBe(60);
    expect(midi('Bb3')).toBe(58);
    expect(akkord('Am').toene.slice(0, 3)).toEqual([0, 3, 7]);
    expect(akkord('F#m').grund).toBe(midi('F#3'));
  });

  it('jede Karte hat ein Lied', () => {
    for (const id of MAP_IDS) expect(KARTEN_LIED[id], id).toBeDefined();
  });

  for (const [id, l] of Object.entries(LIEDER)) {
    describe(`Lied ${id}`, () => {
      it('Melodie und Muster passen in die Takte', () => {
        expect(l.melodie.trim().split(/\s+/).length).toBe(liedLaenge(l));
        for (const m of [l.bass, l.begleitung, l.drums]) if (m) expect(m.trim().split(/\s+/).length).toBe(8);
        expect(musterToene(l.bass, l.akkorde, 0, false).length).toBeGreaterThan(0);
      });

      it('der erste Melodieton jedes Takts gehört zum Akkord', () => {
        const toene = melodieToene(l.melodie);
        l.akkorde.forEach((a, takt) => {
          const erster = toene.find((t) => t.start >= takt * 8 && t.start < takt * 8 + 8);
          if (!erster) return;
          const { grund, toene: ak } = akkord(a);
          const klasse = (((erster.midi - grund) % 12) + 12) % 12;
          expect(ak.slice(0, 3), `${id} Takt ${takt + 1} (${a})`).toContain(klasse);
        });
      });

      it('Melodie bleibt in einem angenehmen Tonbereich', () => {
        for (const t of melodieToene(l.melodie)) expect(t.midi >= midi('F#4') && t.midi <= midi('E6')).toBe(true);
      });
    });
  }
});

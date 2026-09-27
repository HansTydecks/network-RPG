import { describe, expect, it } from 'vitest';
import { SPIEL_DEFS } from '../../src/content/spiele';
import { wrapText, measureText } from '../../src/engine/gfx/fontGlyphs';
import { caesar } from '../../src/minigames/generischLogic';
import { tabellenBreiten, zusatzHoehe, type QuizFrage } from '../../src/minigames/quizLogic';

const passt = (t: string, w: number, n: number) => wrapText(t, w).length <= n;

/** Höhe, die eine Quizfrage mit Antworten braucht (vgl. QuizModal.zeigeFrage). */
function quizHoehe(f: QuizFrage): number {
  const x = f.antwortenX ?? 10;
  let h = wrapText(`9/9: ${f.frage}`, 300).length * 11 + 8 + zusatzHoehe(f);
  if (f.nebeneinander) h += 11;
  else for (const o of f.optionen) h += wrapText(o.text, 310 - x - 14).length * 11 + 3;
  return h;
}

describe('Datenbasierte Minispiele', () => {
  it('Register ist vorhanden', () => expect(typeof SPIEL_DEFS).toBe('object'));
  for (const [id, d] of Object.entries(SPIEL_DEFS)) {
    describe(id, () => {
      it('Metadaten und Klassenstufe', () => {
        expect(d.titel.length).toBeGreaterThan(2);
        expect([7, 8, 9, 10, 11]).toContain(d.stufe);
        expect(d.lehrplan).toMatch(/SN|BW|Schulcurriculum/);
        expect(measureText(d.titel)).toBeLessThan(290);
      });
      if (d.art === 'quiz') {
        it('jede Frage hat genau eine richtige Antwort, höchstens 4 Antworten, alles passt auf die Tafel', () => {
          for (const f of d.fragen) {
            expect(f.optionen.filter((o) => o.ok).length, f.frage).toBe(1);
            expect(f.optionen.length).toBeLessThanOrEqual(4);
            if (!f.bild) expect(quizHoehe(f), `zu hoch: ${f.frage}`).toBeLessThanOrEqual(104);
            else expect(wrapText(f.frage, 300).length, f.frage).toBeLessThanOrEqual(2);
            if (f.tabelle) expect(tabellenBreiten(f.tabelle).reduce((a, b) => a + b, 10), 'Tabelle zu breit').toBeLessThanOrEqual(312);
            if (f.code) for (const z of f.code) expect(measureText(z), z).toBeLessThanOrEqual(300);
            if (f.nebeneinander) expect(f.optionen.reduce((w, o) => w + measureText(o.text) + 30, 18)).toBeLessThanOrEqual(320);
            for (const o of f.optionen) {
              expect(o.erklaerung.length).toBeGreaterThan(5);
              expect(passt(`Richtig! ${o.erklaerung} (Leertaste)`, 300, 3), o.erklaerung).toBe(true);
            }
          }
          expect(passt(d.schluss, 300, 3)).toBe(true);
          if (d.intro) expect(passt(d.intro, 300, 3)).toBe(true);
        });
      }
      if (d.art === 'reihenfolge') {
        it('Schritte passen in die Spalten', () => {
          const a = d.aufgabe;
          expect(a.schritte.length).toBeLessThanOrEqual(7);
          const hoehe = a.schritte.reduce((h, s) => h + wrapText(`9. ${s}`, 290).length * 10 + 2, 24 + 6);
          expect(hoehe, 'Schritte zu lang').toBeLessThanOrEqual(124);
          expect(new Set(a.schritte).size).toBe(a.schritte.length);
          for (const t of [a.intro, a.schluss, ...(a.hinweise ?? []).map((h) => `Noch nicht. ${h}`)]) expect(passt(t, 300, 3), t).toBe(true);
        });
      }
      if (d.art === 'kampf') {
        it('jede Runde hat genau einen richtigen Konter', () => {
          for (const r of d.kampf.runden) {
            expect(r.optionen.filter((o) => o.ok).length, r.angriff).toBe(1);
            expect(wrapText(`${d.kampf.gegner}: „${r.angriff}"`, 215).length * 10 + r.optionen.reduce((h, o) => h + wrapText(o.text, 200).length * 10 + 3, 32)).toBeLessThanOrEqual(104);
            for (const o of r.optionen) expect(passt(`Das hilft hier nicht. ${o.erklaerung}`, 300, 3), o.erklaerung).toBe(true);
          }
        });
      }
      if (d.art === 'caesar') {
        it('der Schlüssel ergibt lesbaren Text', () => {
          const klar = caesar(d.aufgabe.geheim, -d.aufgabe.schluessel);
          expect(klar).toMatch(/^[A-ZÄÖÜ .,!?]+$/);
          expect(klar).not.toBe(d.aufgabe.geheim);
        });
      }
    });
  }
});

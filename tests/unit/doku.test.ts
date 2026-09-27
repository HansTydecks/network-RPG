/**
 * Hält docs/MINISPIELE.md und docs/NETZBUCH.md mit den Spieldaten synchron.
 * Neu erzeugen: DOKU_SCHREIBEN=1 npx vitest run tests/unit/doku.test.ts
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { MINIGAME_META } from '../../src/minigames/meta';
import { LEXICON } from '../../src/content/lexicon';

const STUFE = (s: number) => (s >= 11 ? 'Oberstufe' : `Klasse ${s}`);
const KAPITEL: Record<number, string> = { 7: 'Kapitel 1 – Kabelitz', 8: 'Kapitel 2 – Knotenburg', 9: 'Kapitel 3 – Unter Tage', 10: 'Kapitel 4 – Die Werkstatt', 11: 'Kapitel 5 – Einmal um die Welt' };

function minispiele(): string {
  const zeilen = ['# Minispiele in NETZBLICK', '', 'Automatisch aus den Spieldaten erzeugt (`tests/unit/doku.test.ts`). Jedes Minispiel lässt sich direkt öffnen: `?minispiel=<id>`.', ''];
  for (const s of [7, 8, 9, 10, 11]) {
    zeilen.push(`## ${KAPITEL[s]} (${STUFE(s)})`, '', '| ID | Minispiel | Lehrplan |', '|---|---|---|');
    for (const [id, m] of Object.entries(MINIGAME_META).filter(([, m]) => m.stufe === s)) zeilen.push(`| \`${id}\` | ${m.titel} | ${m.lehrplan} |`);
    zeilen.push('');
  }
  return zeilen.join('\n');
}

function netzbuch(): string {
  const zeilen = ['# Netzbuch (Merksätze für den Hefter)', '', 'Automatisch aus den Spieldaten erzeugt (`tests/unit/doku.test.ts`).', ''];
  for (const s of [7, 8, 9, 10, 11]) {
    zeilen.push(`## ${STUFE(s)}`, '');
    for (const [, e] of Object.entries(LEXICON).filter(([id, e]) => e.stufe === s && id !== 'betriebssystem')) zeilen.push(`### ${e.titel}`, '', e.text, '', `*${e.lehrplan}*`, '');
  }
  return zeilen.join('\n');
}

describe('Dokumentation', () => {
  for (const [datei, inhalt] of [
    ['docs/MINISPIELE.md', minispiele()],
    ['docs/NETZBUCH.md', netzbuch()],
  ] as const) {
    it(`${datei} ist aktuell`, () => {
      if (process.env.DOKU_SCHREIBEN) writeFileSync(datei, inhalt + '\n');
      expect(readFileSync(datei, 'utf8')).toBe(inhalt + '\n');
    });
  }
});

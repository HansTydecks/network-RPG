import { describe, expect, it } from 'vitest';
import { wrapText, measureText } from '../../src/engine/gfx/fontGlyphs';
import { QUESTS } from '../../src/content/quests';
import { LEXICON } from '../../src/content/lexicon';
import { ITEMS } from '../../src/content/items';
import { MAPS } from '../../src/content/maps';
import { PING_SCAN } from '../../src/content/dialog/scan';
import { ADRESS_HINWEIS, BRIEF_SLOTS } from '../../src/minigames/briefLogic';
import { SORT_RUNDEN, sortHinweis } from '../../src/minigames/sortierenLogic';
import { BAUTEILE } from '../../src/minigames/evaLogic';
import { DATEI_FRAGEN, EINHEITEN_FRAGEN, SCHNELLER_FRAGEN } from '../../src/minigames/m2bLogic';

/** Diese Werte spiegeln die Layouts in Hud.ts, minigames/base.ts, ObjectCard.ts und InfoPanel.ts. */
const QUEST_W = 290 - 12; // abzüglich „▸ "
const FEEDBACK_W = 300;
const FEEDBACK_LINES = 3;

const fits = (text: string, width: number, lines: number) => wrapText(text, width).length <= lines;

describe('Texte passen in ihre Kästen (kein Überlauf)', () => {
  it('Aufgabentitel: höchstens 2 Zeilen', () => {
    for (const [id, q] of Object.entries(QUESTS)) expect(fits(q.titel, QUEST_W, 2), id).toBe(true);
  });

  it('Minispiel-Rückmeldungen: höchstens 3 Zeilen', () => {
    const texte = [
      ...BRIEF_SLOTS.flatMap((s) => s.optionen.map((o) => `Ping: ${o.kommentar ?? ''}`)),
      ...ADRESS_HINWEIS.map((h) => `Ping: ${h}`),
      ...SORT_RUNDEN.map((r) => r.ansage),
      ...SORT_RUNDEN.flatMap((r, i) => r.briefe.map((b) => `Hmm, das passt nicht. ${sortHinweis(i, b)}`)),
      ...BAUTEILE.map((b) => `Richtig! ${b.hinweis}`),
      ...[...EINHEITEN_FRAGEN, ...DATEI_FRAGEN, ...SCHNELLER_FRAGEN].flatMap((f) => f.optionen.map((o) => `Richtig! ${o.erklaerung} (Leertaste)`)),
    ];
    for (const t of texte) expect(fits(t, FEEDBACK_W, FEEDBACK_LINES), t).toBe(true);
  });

  it('Brief-Antworten passen in die rechte Spalte (höchstens 3 Zeilen à 120 px)', () => {
    for (const s of BRIEF_SLOTS) {
      expect(fits(s.frage, 136, 2), s.frage).toBe(true);
      for (const o of s.optionen) expect(fits(o.text, 120, 3), o.text).toBe(true);
    }
  });

  it('Netzbuch-Texte passen ins Netzbuch (Titel + 9 Zeilen à 188 px)', () => {
    for (const [id, e] of Object.entries(LEXICON)) expect(fits(e.text, 188, 9), id).toBe(true);
  });

  it('Item-Beschreibungen passen in den Rucksack', () => {
    for (const [id, it] of Object.entries(ITEMS)) expect(fits(it.beschreibung, 188, 9), id).toBe(true);
  });

  it('Objektkarten: Klasse und Methoden passen in eine Zeile, Werte höchstens 2 Zeilen', () => {
    const scans = [PING_SCAN];
    for (const m of Object.values(MAPS)) for (const e of m.entities) if ((e.kind === 'npc' || e.kind === 'interact') && e.scan) scans.push(e.scan);
    for (const s of scans) {
      expect(measureText(`${s.name} : ${s.klasse}`), s.name).toBeLessThanOrEqual(270);
      for (const m of s.methoden) expect(measureText(`${m}()`), m).toBeLessThanOrEqual(270);
      for (const [k, v] of s.attribute) expect(fits(`${k} = ${v}`, 260, 2), `${s.name}.${k}`).toBe(true);
    }
  });
});

import { ABSENDER } from '../../src/minigames/briefLogic';
describe('Umschlag', () => {
  it('Absender endet vor dem Briefmarkenfeld (x = 136, Text beginnt bei x = 16)', () => {
    for (const l of ABSENDER) expect(measureText(l), l).toBeLessThanOrEqual(116);
  });
});

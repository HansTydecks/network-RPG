import { describe, expect, it } from 'vitest';
import { ADRESSE, BRIEF_SLOTS } from '../../src/minigames/briefLogic';
import { SORT_RUNDEN } from '../../src/minigames/sortierenLogic';
import { BAUTEILE } from '../../src/minigames/evaLogic';
import { MINIGAME_META } from '../../src/minigames/meta';
import { ITEMS } from '../../src/content/items';

describe('Minispiel „Brief an Lina"', () => {
  it('jede Zeile hat mindestens eine richtige Antwort, falsche haben eine Erklärung', () => {
    for (const slot of BRIEF_SLOTS) {
      expect(slot.optionen.some((o) => o.ok), slot.frage).toBe(true);
      for (const o of slot.optionen) if (!o.ok) expect(o.kommentar, o.text).toBeTruthy();
    }
  });
  it('Adresse: Name, Straße mit Nummer, PLZ (5 Ziffern) und Ort', () => {
    expect(ADRESSE[2]).toMatch(/^\d{5} \S+/);
    expect(ADRESSE[1]).toMatch(/\d+$/);
  });
});

describe('Minispiel Sortiermaschine', () => {
  it('das richtige Fach passt zur Postleitzahl der Runde', () => {
    const [r1, r2, r3] = SORT_RUNDEN;
    for (const b of r1.briefe) expect(r1.faecher[b.fach].startsWith(b.plz[0])).toBe(true);
    for (const b of r2.briefe) expect(r2.faecher[b.fach].startsWith(b.plz.slice(0, 2))).toBe(true);
    for (const b of r3.briefe) {
      const passend = r3.faecher.findIndex((f) => f.startsWith(b.plz));
      expect(b.fach).toBe(passend >= 0 ? passend : 2);
    }
  });
  it('Alex\' Brief kommt ganz am Ende', () => {
    const letzte = SORT_RUNDEN[2].briefe;
    expect(letzte[letzte.length - 1].vonAlex).toBe(true);
    expect(letzte.filter((b) => b.vonAlex)).toHaveLength(1);
  });
});

describe('Minispiel EVA-Werkbank', () => {
  it('genau der Speicherchip gehört zu „Speichern", alle anderen zu E, V oder A', () => {
    expect(BAUTEILE.filter((b) => b.fach === 'S').map((b) => b.name)).toEqual(['Speicherchip']);
    for (const f of ['E', 'V', 'A'] as const) expect(BAUTEILE.some((b) => b.fach === f)).toBe(true);
  });
});

describe('FUNKSTILLEs Zettel', () => {
  it('ist Caesar-verschlüsselt (Verschiebung 3) und ergibt den Treffpunkt aus Kapitel 2', () => {
    const geheim = ITEMS.zettel_funkstille.beschreibung.match(/„([A-Z ]+)"/)![1];
    const klar = geheim.replace(/[A-Z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 65 - 3 + 26) % 26) + 65));
    expect(klar).toBe('TREFFPUNKT ALTES FERNMELDEAMT');
  });
});

describe('Minispiel-Register', () => {
  it('jedes Minispiel hat Metadaten', async () => {
    const src = (await import('node:fs')).readFileSync('src/minigames/index.ts', 'utf8');
    const ids = [...src.matchAll(/^  (\w+): \w+Minigame,$/gm)].map((m) => m[1]);
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) expect(MINIGAME_META[id], id).toBeDefined();
  });
});

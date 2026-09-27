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

import { BITSCHLOESSER, GEHEIMWORT, PIXELWAND, binaerText, bitsZuZahl, buchstabeZuZahl, zahlZuBits } from '../../src/minigames/binaerLogic';
import { KRUEMEL_LEVEL, MAX_BLOECKE, fuehreAus } from '../../src/minigames/kruemelLogic';
import { ZUSTAND_AUFGABEN } from '../../src/minigames/zustandLogic';
import { FOTO_START, fotoRichtig, wendeAn } from '../../src/minigames/fotoLogic';

describe('Binärzahlen', () => {
  it('rechnet hin und zurück', () => {
    for (const n of [0, 1, 5, 42, 128, 200, 255]) expect(bitsZuZahl(zahlZuBits(n))).toBe(n);
    expect(binaerText(5)).toBe('00000101');
    expect(bitsZuZahl(zahlZuBits(42))).toBe(42);
  });
  it('Bit-Schlösser sind mit 8 Bit lösbar', () => {
    for (const s of BITSCHLOESSER) expect(s.ziel).toBeLessThanOrEqual(255);
  });
  it('Pixelwand: 8×8 Binärzeilen', () => {
    expect(PIXELWAND).toHaveLength(8);
    for (const r of PIXELWAND) expect(r).toMatch(/^[01]{8}$/);
  });
  it('Geheimwort passt in 5 Bit je Buchstabe', () => {
    for (const c of GEHEIMWORT) expect(buchstabeZuZahl(c)).toBeGreaterThanOrEqual(1);
    for (const c of GEHEIMWORT) expect(buchstabeZuZahl(c)).toBeLessThanOrEqual(31);
  });
});

describe('Krümel-Blöcke', () => {
  for (const [id, level] of Object.entries(KRUEMEL_LEVEL)) {
    it(`Level ${id}: Musterlösung klappt mit höchstens ${MAX_BLOECKE} Blöcken`, () => {
      expect(level.loesung.length).toBeLessThanOrEqual(MAX_BLOECKE);
      expect(fuehreAus(level, level.loesung).geschafft).toBe(true);
    });
    it(`Level ${id}: Fehler werden erkannt`, () => {
      expect(fuehreAus(level, []).geschafft).toBe(false);
      expect(fuehreAus(level, ['aufnehmen']).schritte[0].fehler).toBeTruthy();
    });
  }
  it('Wand erkennt Krümel', () => {
    const r = fuehreAus(KRUEMEL_LEVEL.garten, ['links', 'vor']);
    expect(r.schritte[1].fehler).toMatch(/Wand/);
  });
});

describe('Zustandsdiagramm', () => {
  it('der fehlende Übergang ist nicht schon vorhanden und die falschen Optionen unterscheiden sich', () => {
    for (const a of Object.values(ZUSTAND_AUFGABEN)) {
      const key = (u: { von: string; nach: string; ereignis: string }) => `${u.von}>${u.nach}:${u.ereignis}`;
      expect(a.uebergaenge.map(key)).not.toContain(key(a.fehlt));
      for (const f of a.falsch) expect(key(f)).not.toBe(key(a.fehlt));
    }
  });
});

describe('Fotolabor', () => {
  it('Start ist falsch, richtige Einstellung ist Schwarz-Weiß ohne Negativ', () => {
    expect(fotoRichtig(FOTO_START)).toBe(false);
    expect(fotoRichtig({ negativ: false, rot: true, gruen: true, blau: true, graustufen: true })).toBe(true);
    expect(wendeAn([200, 100, 50], { negativ: true, rot: true, gruen: true, blau: true, graustufen: false })).toEqual([55, 155, 205]);
  });
});

describe('Minispiele M2b (Laden, Dorffest, Reparatur)', async () => {
  const m = await import('../../src/minigames/m2bLogic');
  const { PLAKAT_FRAGEN } = await import('../../src/minigames/plakatLogic');
  const alle = { einheiten: m.EINHEITEN_FRAGEN, dateien: m.DATEI_FRAGEN, schneller: m.SCHNELLER_FRAGEN, plakat: PLAKAT_FRAGEN };

  for (const [id, fragen] of Object.entries(alle)) {
    it(`${id}: jede Frage hat genau eine richtige Antwort, jede Antwort eine Erklärung`, () => {
      for (const f of fragen) {
        expect(f.optionen.filter((o) => o.ok).length, f.frage).toBe(1);
        for (const o of f.optionen) expect(o.erklaerung.length).toBeGreaterThan(10);
      }
    });
  }

  it('USB-Stick: alles zusammen passt nicht, Wichtiges plus Video oder Fotos schon', () => {
    const alles = m.STICK_DATEIEN.map(() => true);
    expect(m.stickPasst(alles).ok).toBe(false);
    const mitVideo = m.STICK_DATEIEN.map((d) => d.pflicht || d.name.startsWith('festvideo'));
    expect(m.stickPasst(mitVideo).ok).toBe(true);
    const mitFotos = m.STICK_DATEIEN.map((d) => d.pflicht || d.name.startsWith('800'));
    expect(m.stickPasst(mitFotos).ok).toBe(true);
    expect(m.stickPasst(m.STICK_DATEIEN.map((d) => d.pflicht)).ok).toBe(false);
  });

  it('Tabelle: Summe stimmt, Formeln haben genau eine richtige Option', () => {
    expect(m.kuchenSumme()).toBe(2 * 12 + 1.5 * 20 + 1.5 * 16 + 1 * 30);
    for (const f of m.TABELLE_FRAGEN_TEXT) expect(f.optionen[f.richtig]).toMatch(/^=/);
  });

  it('Was ist schneller: Internet gewinnt bei kleinen, Ping bei riesigen Datenmengen', () => {
    expect(m.internetSekunden(800)).toBeLessThan(m.PING_MINUTEN * 60);
    expect(m.internetSekunden(2_000_000)).toBeGreaterThan(m.PING_MINUTEN * 60);
  });

  it('Kabelsalat: fünf verschiedene Anschlüsse, alle mit 8 Bit darstellbar', () => {
    expect(new Set(m.KABELSALAT_ANSCHLUESSE).size).toBe(5);
    for (const n of m.KABELSALAT_ANSCHLUESSE) expect(n).toBeLessThan(256);
  });
});

describe('Krümel-Blöcke mit Kontrollstrukturen (Klasse 8)', () => {
  it('Wiederholung ohne ⟲ Ende und ⟲ Ende ohne Wiederholung werden erklärt', () => {
    expect(fuehreAus(KRUEMEL_LEVEL.kanal1, ['wdh4', 'vor']).schritte[0].fehler).toMatch(/fehlt das ⟲ Ende/);
    expect(fuehreAus(KRUEMEL_LEVEL.kanal1, ['ende']).schritte[0].fehler).toMatch(/keiner Wiederholung/);
  });
  it('die Treppe im Kabelkanal braucht eine Wiederholung: als reine Sequenz wären es mehr als 10 Blöcke', () => {
    const sequenz = ['vor', 'rechts', 'vor', 'links', 'vor', 'rechts', 'vor', 'links', 'vor', 'rechts', 'vor', 'links', 'vor', 'rechts', 'vor', 'links', 'aufnehmen'] as const;
    expect(fuehreAus(KRUEMEL_LEVEL.kanal1, [...sequenz]).geschafft).toBe(true);
    expect(sequenz.length).toBeGreaterThan(MAX_BLOECKE);
  });
  it('„wenn Wand: rechts" dreht nur vor einer Wand', () => {
    const r = fuehreAus(KRUEMEL_LEVEL.kanal2, ['wenn']);
    expect(r.schritte[0].r).toBe(KRUEMEL_LEVEL.kanal2.startRichtung);
  });
  it('„solange frei: vor" fährt bis zur Wand und stößt nie an', () => {
    const r = fuehreAus(KRUEMEL_LEVEL.schacht, ['solange']);
    expect(r.schritte.every((s) => !s.fehler)).toBe(true);
    expect(r.schritte[r.schritte.length - 1].x).toBe(7);
  });
  it('verschachtelte Wiederholungen laufen richtig oft', () => {
    const r = fuehreAus(KRUEMEL_LEVEL.schacht, ['wdh2', 'wdh3', 'links', 'ende', 'ende']);
    expect(r.schritte.length).toBe(6);
  });
});

describe('Quizze Kapitel 2', async () => {
  const k = await import('../../src/minigames/k2aLogic');
  for (const [id, fragen] of Object.entries({ algorithmus: k.ALGORITHMUS_FRAGEN, clientserver: k.CLIENT_SERVER_FRAGEN })) {
    it(`${id}: genau eine richtige Antwort, alle mit Erklärung`, () => {
      for (const f of fragen) {
        expect(f.optionen.filter((o) => o.ok).length, f.frage).toBe(1);
        for (const o of f.optionen) expect(o.erklaerung.length).toBeGreaterThan(10);
      }
    });
  }
});

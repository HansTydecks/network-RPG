/**
 * Krümel-Blöcke (SN Kl. 7 LB 3): Befehle in Reihenfolge (Sequenz), höchstens 10 Blöcke.
 * Raster: # Wand, . frei, S Start, Z Ziel (dort „aufnehmen").
 */
export type Block = 'vor' | 'links' | 'rechts' | 'aufnehmen';
export type Richtung = 0 | 1 | 2 | 3; // 0 hoch, 1 rechts, 2 runter, 3 links

export const MAX_BLOECKE = 10;

export interface KruemelLevel {
  titel: string;
  auftrag: string;
  raster: string[];
  startRichtung: Richtung;
  loesung: Block[];
}

export const KRUEMEL_LEVEL: Record<string, KruemelLevel> = {
  garten: {
    titel: 'Emils Garten',
    auftrag: 'Emil: „Krümel soll zum Sandkasten: zwei Felder vor, rechts drehen, drei Felder vor und dort den Sand aufnehmen."',
    raster: ['#######', '#...Z.#', '#.##..#', '#S....#', '#######'],
    startRichtung: 0,
    loesung: ['vor', 'vor', 'rechts', 'vor', 'vor', 'vor', 'aufnehmen'],
  },
  gully: {
    titel: 'Im Gully',
    auftrag: 'Der Schlüssel liegt rechts oben. Plane Krümels Weg selbst – es gibt nur einen!',
    raster: ['######', '#S.#Z#', '#.##.#', '#....#', '######'],
    startRichtung: 2,
    loesung: ['vor', 'vor', 'links', 'vor', 'vor', 'vor', 'links', 'vor', 'vor', 'aufnehmen'],
  },
  kasten: {
    titel: 'Im grauen Kasten',
    auftrag: 'Herr Kowalski: „Der Reset-Knopf ist ganz hinten, zwischen den Kabeln. Krümel muss ihn drücken (aufnehmen)."',
    raster: ['#######', '#S..#.#', '##.##.#', '#...Z.#', '#######'],
    startRichtung: 1,
    loesung: ['vor', 'rechts', 'vor', 'vor', 'links', 'vor', 'vor', 'aufnehmen'],
  },
};

const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];

export interface Schritt {
  x: number;
  y: number;
  r: Richtung;
  fehler?: string;
  aufgenommen?: boolean;
}

export function findeStart(level: KruemelLevel): { x: number; y: number } {
  for (let y = 0; y < level.raster.length; y++) {
    const x = level.raster[y].indexOf('S');
    if (x >= 0) return { x, y };
  }
  throw new Error('Kein Start');
}

/** Führt ein Programm aus und liefert jeden Zwischenschritt (für die Animation). */
export function fuehreAus(level: KruemelLevel, programm: Block[]): { schritte: Schritt[]; geschafft: boolean } {
  let { x, y } = findeStart(level);
  let r = level.startRichtung;
  const schritte: Schritt[] = [];
  let geschafft = false;
  for (const [i, b] of programm.entries()) {
    if (b === 'links') r = ((r + 3) % 4) as Richtung;
    else if (b === 'rechts') r = ((r + 1) % 4) as Richtung;
    else if (b === 'vor') {
      const nx = x + DX[r];
      const ny = y + DY[r];
      if (level.raster[ny]?.[nx] === '#' || level.raster[ny]?.[nx] === undefined) {
        schritte.push({ x, y, r, fehler: `Schritt ${i + 1}: Krümel stößt gegen eine Wand!` });
        return { schritte, geschafft: false };
      }
      x = nx;
      y = ny;
    } else if (b === 'aufnehmen') {
      if (level.raster[y][x] === 'Z') {
        geschafft = true;
        schritte.push({ x, y, r, aufgenommen: true });
        continue;
      }
      schritte.push({ x, y, r, fehler: `Schritt ${i + 1}: Hier gibt es nichts aufzunehmen.` });
      return { schritte, geschafft: false };
    }
    schritte.push({ x, y, r });
  }
  return { schritte, geschafft };
}

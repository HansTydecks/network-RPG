/**
 * Krümel-Blöcke: Befehle in Reihenfolge (Sequenz, SN Kl. 7 LB 3), höchstens 10 Blöcke.
 * Ab Klasse 8 (LB 1) kommen Kontrollstrukturen dazu: Zählschleife (⟳ n× … ⟲ Ende),
 * kopfgesteuerte Schleife („solange vorne frei: vor") und Verzweigung („wenn Wand: rechts drehen").
 * Raster: # Wand, . frei, S Start, Z Ziel (dort „aufnehmen").
 */
export type Wiederhole = 'wdh2' | 'wdh3' | 'wdh4' | 'wdh5' | 'wdh6' | 'wdh7' | 'wdh8' | 'wdh9';
export type Block = 'vor' | 'links' | 'rechts' | 'aufnehmen' | 'ende' | 'wenn' | 'solange' | Wiederhole;
/** Knöpfe auf der Fernbedienung; „wdh" steht für alle Wiederhole-Blöcke. */
export type BlockArt = 'vor' | 'links' | 'rechts' | 'aufnehmen' | 'wdh' | 'ende' | 'wenn' | 'solange';

export const GRUNDBLOECKE: BlockArt[] = ['vor', 'links', 'rechts', 'aufnehmen'];

export function istWiederhole(b: Block): b is Wiederhole {
  return b.startsWith('wdh');
}

export function blockArt(b: Block): BlockArt {
  return istWiederhole(b) ? 'wdh' : (b as BlockArt);
}
export type Richtung = 0 | 1 | 2 | 3; // 0 hoch, 1 rechts, 2 runter, 3 links

export const MAX_BLOECKE = 10;

export interface KruemelLevel {
  titel: string;
  auftrag: string;
  raster: string[];
  startRichtung: Richtung;
  loesung: Block[];
  /** Verfügbare Blöcke (Standard: nur Sequenz). */
  bloecke?: BlockArt[];
  /** Klassenstufe, ab der das Level vorkommt (Standard 7). */
  stufe?: number;
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
  // ---------- Kapitel 2 (Klasse 8) ----------
  kanal1: {
    titel: 'Kabelkanal der Schule',
    auftrag: 'Der Kanal geht wie eine Treppe nach oben. Zu viele Schritte für 10 Blöcke – aber immer dasselbe Muster!',
    raster: ['#######', '####.Z#', '###..##', '##..###', '#..####', '#S#####'],
    startRichtung: 0,
    loesung: ['wdh4', 'vor', 'rechts', 'vor', 'links', 'ende', 'aufnehmen'],
    bloecke: ['vor', 'links', 'rechts', 'aufnehmen', 'wdh', 'ende'],
    stufe: 8,
  },
  kanal2: {
    titel: 'Hinter der Biegung',
    auftrag: 'Ein Gang ums Eck. Krümel soll selbst merken, wann er abbiegt: „Wenn vorne Wand ist, dann rechts drehen."',
    raster: ['#######', '#S....#', '#####.#', '#####.#', '###Z..#', '#######'],
    startRichtung: 1,
    loesung: ['wdh9', 'wenn', 'vor', 'ende', 'aufnehmen'],
    bloecke: ['vor', 'links', 'rechts', 'aufnehmen', 'wdh', 'ende', 'wenn'],
    stufe: 8,
  },
  schacht: {
    titel: 'Der lange Kabelschacht',
    auftrag: 'Die Gänge sind verschieden lang. „Solange frei: vor" fährt Krümel geradeaus bis zur nächsten Wand.',
    raster: ['#########', '#S......#', '#######.#', '##......#', '##.######', '##Z######'],
    startRichtung: 1,
    loesung: ['solange', 'rechts', 'solange', 'rechts', 'solange', 'links', 'solange', 'aufnehmen'],
    bloecke: ['vor', 'links', 'rechts', 'aufnehmen', 'wdh', 'ende', 'wenn', 'solange'],
    stufe: 8,
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
  /** Welcher Block gerade ausgeführt wird (für die Anzeige). */
  block?: number;
}

export function findeStart(level: KruemelLevel): { x: number; y: number } {
  for (let y = 0; y < level.raster.length; y++) {
    const x = level.raster[y].indexOf('S');
    if (x >= 0) return { x, y };
  }
  throw new Error('Kein Start');
}

type Knoten = { idx: number; b: Block } | { idx: number; n: number; kinder: Knoten[] };

/** Baut aus der Blockreihe einen Baum (Wiederholungen enthalten ihre Blöcke). */
function parse(programm: Block[]): { baum: Knoten[] } | { fehler: string; idx: number } {
  const wurzel: Knoten[] = [];
  const stapel: { idx: number; n: number; kinder: Knoten[] }[] = [];
  for (const [idx, b] of programm.entries()) {
    const ziel = stapel.length ? stapel[stapel.length - 1].kinder : wurzel;
    if (istWiederhole(b)) {
      const k = { idx, n: Number(b.slice(3)), kinder: [] as Knoten[] };
      ziel.push(k);
      stapel.push(k);
    } else if (b === 'ende') {
      if (!stapel.length) return { fehler: `Block ${idx + 1}: ⟲ Ende gehört zu keiner Wiederholung.`, idx };
      stapel.pop();
    } else ziel.push({ idx, b });
  }
  if (stapel.length) {
    const offen = stapel[stapel.length - 1];
    return { fehler: `Zur Wiederholung in Block ${offen.idx + 1} fehlt das ⟲ Ende.`, idx: offen.idx };
  }
  return { baum: wurzel };
}

const MAX_SCHRITTE = 400;

/** Führt ein Programm aus und liefert jeden Zwischenschritt (für die Animation). */
export function fuehreAus(level: KruemelLevel, programm: Block[]): { schritte: Schritt[]; geschafft: boolean } {
  const start = findeStart(level);
  let x = start.x;
  let y = start.y;
  let r = level.startRichtung;
  const schritte: Schritt[] = [];
  let geschafft = false;
  const p = parse(programm);
  if ('fehler' in p) return { schritte: [{ x, y, r, fehler: p.fehler, block: p.idx }], geschafft: false };

  const wandVorne = () => {
    const c = level.raster[y + DY[r]]?.[x + DX[r]];
    return c === '#' || c === undefined;
  };
  // Liefert false, wenn das Programm abbricht (Fehler).
  const lauf = (knoten: Knoten[]): boolean => {
    for (const k of knoten) {
      if (schritte.length > MAX_SCHRITTE) {
        schritte.push({ x, y, r, fehler: 'Krümel fährt und fährt … Das Programm hört nicht auf!', block: k.idx });
        return false;
      }
      if ('kinder' in k) {
        for (let n = 0; n < k.n; n++) if (!lauf(k.kinder)) return false;
        continue;
      }
      const i = k.idx;
      const b = k.b;
      if (b === 'links') r = ((r + 3) % 4) as Richtung;
      else if (b === 'rechts') r = ((r + 1) % 4) as Richtung;
      else if (b === 'wenn') {
        if (wandVorne()) r = ((r + 1) % 4) as Richtung;
      } else if (b === 'solange') {
        while (!wandVorne()) {
          x += DX[r];
          y += DY[r];
          schritte.push({ x, y, r, block: i });
          if (schritte.length > MAX_SCHRITTE) {
            schritte.push({ x, y, r, fehler: 'Krümel fährt und fährt … Das Programm hört nicht auf!', block: i });
            return false;
          }
        }
        continue;
      } else if (b === 'vor') {
        if (wandVorne()) {
          schritte.push({ x, y, r, fehler: `Schritt ${i + 1}: Krümel stößt gegen eine Wand!`, block: i });
          return false;
        }
        x += DX[r];
        y += DY[r];
      } else if (b === 'aufnehmen') {
        if (level.raster[y][x] === 'Z') {
          geschafft = true;
          schritte.push({ x, y, r, aufgenommen: true, block: i });
          continue;
        }
        schritte.push({ x, y, r, fehler: `Schritt ${i + 1}: Hier gibt es nichts aufzunehmen.`, block: i });
        return false;
      }
      schritte.push({ x, y, r, block: i });
    }
    return true;
  };
  lauf(p.baum);
  return { schritte, geschafft };
}

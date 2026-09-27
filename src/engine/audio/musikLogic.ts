/**
 * Musik als Daten, ohne WebAudio (testbar in Node).
 * Ein Lied besteht aus Akkorden (ein Akkord je Takt), einer handgeschriebenen Melodie
 * (8 Achtel je Takt: Notenname, „-" = halten, „." = Pause) und Mustern, aus denen
 * Bass, Begleitung und Schlagzeug automatisch zu den Akkorden erzeugt werden.
 */

export type Welle = 'puls12' | 'puls25' | 'puls50' | 'dreieck' | 'sinus';

export interface Lied {
  bpm: number;
  akkorde: string[];
  melodie: string;
  /** Bass je Achtel: R = Grundton, 5 = Quinte, 8 = Oktave, „." = Pause, „-" = halten. */
  bass: string;
  /** Begleitung je Achtel: 1/3/5/7 = Akkordtöne, 8 = Grundton oben, „." = Pause. */
  begleitung?: string;
  /** Schlagzeug je Achtel: k = Kick, s = Snare, h = Hi-Hat, o = offene Hi-Hat, „." = Pause. */
  drums?: string;
  lead: Welle;
  /** Lautstärke der Melodie (0–1). */
  laut?: number;
}

export type LiedId = 'titel' | 'dorf' | 'zuhause' | 'museum' | 'stadt' | 'drinnen' | 'stollen' | 'welt' | 'nacht' | 'minispiel' | 'kampf' | 'ende';

const T = (...takte: string[]) => takte.join(' ');

export const LIEDER: Record<LiedId, Lied> = {
  titel: {
    bpm: 120,
    akkorde: ['C', 'G', 'Am', 'F', 'C', 'G', 'F', 'G'],
    melodie: T(
      'G4 - C5 - E5 - G5 -', 'D5 C5 B4 - G4 - B4 -', 'A4 - C5 - E5 - A5 -', 'A5 G5 F5 - C5 - A4 -',
      'G4 - C5 E5 G5 - E5 C5', 'D5 - B4 - D5 G5 F5 D5', 'C5 - A4 C5 F5 - E5 D5', 'D5 - - - B4 - . .',
    ),
    bass: 'R . R 5 8 . 5 .',
    begleitung: '. 3 5 . . 3 5 .',
    drums: 'k . h . s . h h',
    lead: 'puls25',
  },
  dorf: {
    bpm: 112,
    akkorde: ['F', 'C', 'Dm', 'Bb', 'F', 'C', 'Bb', 'C'],
    melodie: T(
      'C5 - A4 C5 F5 - A5 -', 'G5 - E5 - C5 - G4 -', 'A4 - D5 - F5 - A5 G5', 'F5 - D5 - Bb4 - D5 -',
      'C5 A4 C5 F5 A5 - G5 F5', 'E5 - G5 - C6 - Bb5 G5', 'F5 - D5 F5 Bb5 - A5 G5', 'G5 - E5 - C5 - . .',
    ),
    bass: 'R . 5 . R . 5 .',
    begleitung: '. 1 3 5 . 1 3 5',
    drums: 'k . h k s . h .',
    lead: 'puls25',
  },
  zuhause: {
    bpm: 92,
    akkorde: ['G', 'Em', 'C', 'D', 'G', 'Em', 'C', 'D'],
    melodie: T(
      'B4 - D5 - G5 - - -', 'G5 F#5 E5 - B4 - - -', 'C5 - E5 - G5 - E5 -', 'F#5 - - - D5 - A4 -',
      'B4 - D5 G5 B5 - A5 G5', 'G5 - E5 - B4 - E5 -', 'E5 - D5 C5 E5 - G5 -', 'F#5 - A5 - D5 - . .',
    ),
    bass: 'R - - - 5 - - -',
    begleitung: '1 3 5 3 8 3 5 3',
    lead: 'dreieck',
    laut: 0.9,
  },
  museum: {
    bpm: 84,
    akkorde: ['Am', 'F', 'C', 'E', 'Am', 'F', 'C', 'E'],
    melodie: T(
      'E5 - - - A5 - G5 E5', 'F5 - - - C5 - A4 -', 'G4 - C5 - E5 - D5 C5', 'B4 - - - G#4 - . .',
      'A4 - C5 - E5 - A5 -', 'A5 - F5 - C5 - F5 -', 'E5 - G5 - C6 - B5 G5', 'G#5 - - - E5 - . .',
    ),
    bass: 'R - - - R - - -',
    begleitung: '1 . 5 . 3 . 5 .',
    lead: 'sinus',
    laut: 0.9,
  },
  stadt: {
    bpm: 128,
    akkorde: ['D', 'A', 'Bm', 'G', 'D', 'A', 'G', 'A'],
    melodie: T(
      'F#5 - A5 F#5 D5 - A4 -', 'C#5 - E5 - A5 - E5 -', 'D5 - F#5 - B5 - A5 F#5', 'G5 - - B4 D5 - G5 -',
      'A5 - F#5 A5 D6 - A5 F#5', 'E5 - C#5 E5 A5 - G5 E5', 'D5 - B4 D5 G5 - F#5 E5', 'E5 - - - C#5 - . .',
    ),
    bass: 'R 8 R 8 5 8 R 8',
    begleitung: '. . 3 . . . 5 .',
    drums: 'k h s h k k s h',
    lead: 'puls25',
  },
  drinnen: {
    bpm: 100,
    akkorde: ['C', 'Am', 'Dm', 'G', 'C', 'Am', 'Dm', 'G'],
    melodie: T(
      'E5 - G5 - E5 - C5 -', 'C5 - E5 - A5 - G5 E5', 'F5 - A5 - F5 - D5 -', 'B4 - D5 - G5 - - -',
      'G5 - E5 G5 C6 - B5 A5', 'A5 - E5 - C5 - E5 -', 'D5 - F5 A5 G5 - F5 D5', 'B4 - D5 - G4 - . .',
    ),
    bass: 'R . 5 . R . 5 .',
    begleitung: '. 3 . 5 . 3 . 5',
    drums: 'k . h . . . h .',
    lead: 'puls12',
    laut: 0.8,
  },
  stollen: {
    bpm: 96,
    akkorde: ['Dm', 'Bb', 'C', 'A', 'Dm', 'Bb', 'C', 'A'],
    melodie: T(
      'D5 - F5 - A5 - F5 D5', 'D5 - - - Bb4 - D5 -', 'E5 - G5 - C5 - E5 G5', 'C#5 - - - A4 - . .',
      'A5 - G5 F5 E5 - D5 -', 'F5 - D5 - Bb4 - F5 -', 'G5 - E5 - C6 - G5 E5', 'E5 - C#5 - A4 - . .',
    ),
    bass: 'R R . R 5 . R .',
    begleitung: '1 5 8 5 1 5 8 5',
    drums: 'k . . h s . . h',
    lead: 'puls50',
    laut: 0.75,
  },
  welt: {
    bpm: 118,
    akkorde: ['A', 'E', 'F#m', 'D', 'A', 'E', 'D', 'E'],
    melodie: T(
      'E5 - A5 - C#6 - B5 A5', 'G#5 - E5 - B4 - E5 -', 'F#5 - A5 - C#6 - A5 F#5', 'A5 - F#5 - D5 - F#5 -',
      'C#5 - E5 A5 C#6 - E6 C#6', 'B5 - G#5 - E5 - G#5 B5', 'A5 - F#5 - D5 F#5 A5 F#5', 'E5 - - - G#5 - . .',
    ),
    bass: 'R . R . 5 . 8 .',
    begleitung: '1 3 5 8 5 3 1 3',
    drums: 'k . h k s . h o',
    lead: 'puls25',
  },
  nacht: {
    bpm: 76,
    akkorde: ['Am', 'F', 'Dm', 'E', 'Am', 'F', 'Dm', 'E'],
    melodie: T(
      'A4 - - C5 E5 - - -', 'F5 - E5 - C5 - - -', 'D5 - F5 - A5 - G5 F5', 'E5 - - - G#4 - B4 -',
      'C5 - B4 A4 E5 - - -', 'A5 - G5 - F5 - C5 -', 'D5 - E5 F5 A5 - F5 D5', 'E5 - - - - - . .',
    ),
    bass: 'R - - - - - - -',
    begleitung: '1 . 3 . 5 . 3 .',
    drums: '. . h . . . h .',
    lead: 'sinus',
    laut: 0.85,
  },
  minispiel: {
    bpm: 108,
    akkorde: ['C', 'Am', 'F', 'G', 'C', 'Am', 'F', 'G'],
    melodie: T(
      'C5 . E5 . G5 . E5 .', 'A4 . C5 . E5 . C5 .', 'F5 . A5 . C6 . A5 G5', 'G5 . D5 . B4 . D5 .',
      'E5 . G5 C6 . G5 E5 .', 'C5 . E5 A5 . E5 C5 .', 'A4 . C5 F5 . A5 G5 F5', 'D5 - G5 - B4 - . .',
    ),
    bass: 'R . . R . . 5 .',
    begleitung: '. . 5 . . 3 . .',
    drums: 'k . h . s . h .',
    lead: 'puls12',
    laut: 0.7,
  },
  kampf: {
    bpm: 150,
    akkorde: ['Em', 'C', 'D', 'B', 'Em', 'C', 'D', 'B'],
    melodie: T(
      'E5 . E5 G5 B5 - A5 G5', 'E5 . E5 G5 C6 - B5 G5', 'F#5 . F#5 A5 D6 - C6 A5', 'D#6 - B5 - F#5 - D#5 -',
      'B4 E5 G5 B5 E6 - D6 B5', 'C6 - G5 - E5 - G5 C6', 'A5 F#5 D5 F#5 A5 D6 C6 A5', 'B5 - - - D#5 F#5 B5 .',
    ),
    bass: 'R R 8 R R R 8 R',
    begleitung: '1 . 5 . 1 . 5 .',
    drums: 'k h s h k k s h',
    lead: 'puls25',
  },
  ende: {
    bpm: 88,
    akkorde: ['F', 'Am', 'Bb', 'C', 'F', 'Am', 'Bb', 'C'],
    melodie: T(
      'A4 - C5 - F5 - - E5', 'E5 - - - C5 - A4 -', 'D5 - F5 - Bb5 - A5 G5', 'G5 - - - E5 - C5 -',
      'F5 - A5 - C6 - A5 F5', 'E5 - C5 - E5 - A5 -', 'F5 - D5 - Bb4 - D5 F5', 'E5 - - - C5 - . .',
    ),
    bass: 'R - 5 - 8 - 5 -',
    begleitung: '1 3 5 8 5 3 1 3',
    drums: 'k . h . s . h .',
    lead: 'dreieck',
  },
};

const NOTEN: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** „C#5" → MIDI-Nummer (C4 = 60). */
export function midi(note: string): number {
  const m = note.match(/^([A-G])([#b]?)(-?\d)$/);
  if (!m) throw new Error(`Unbekannte Note ${note}`);
  return NOTEN[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (Number(m[3]) + 1) * 12;
}

export function frequenz(midiNr: number): number {
  return 440 * Math.pow(2, (midiNr - 69) / 12);
}

/** Akkordtöne als Halbtöne über dem Grundton, dazu der Grundton (Oktave 3). */
export function akkord(name: string): { grund: number; toene: number[] } {
  const m = name.match(/^([A-G])([#b]?)(m?)(7?)$/);
  if (!m) throw new Error(`Unbekannter Akkord ${name}`);
  const grund = midi(`${m[1]}${m[2]}3`);
  const toene = [0, m[3] ? 3 : 4, 7, m[3] ? 10 : m[4] ? 10 : 11];
  return { grund, toene };
}

export interface Ton {
  /** Start in Achteln ab Liedanfang. */
  start: number;
  /** Länge in Achteln. */
  laenge: number;
  midi: number;
}

function schritte(muster: string): string[] {
  return muster.trim().split(/\s+/);
}

/** Melodie in Töne umwandeln; „-" verlängert den vorigen Ton. */
export function melodieToene(melodie: string): Ton[] {
  const out: Ton[] = [];
  schritte(melodie).forEach((s, i) => {
    if (s === '-') {
      if (out.length && out[out.length - 1].start + out[out.length - 1].laenge === i) out[out.length - 1].laenge++;
    } else if (s !== '.') out.push({ start: i, laenge: 1, midi: midi(s) });
  });
  return out;
}

/** Ein Muster (8 Achtel) über alle Takte legen und aus den Akkorden Töne machen. */
export function musterToene(muster: string, akkorde: string[], oktave: number, begleitung: boolean): Ton[] {
  const s = schritte(muster);
  const out: Ton[] = [];
  akkorde.forEach((a, takt) => {
    const { grund, toene } = akkord(a);
    s.forEach((x, i) => {
      const start = takt * s.length + i;
      if (x === '-') {
        const letzter = out[out.length - 1];
        if (letzter && letzter.start + letzter.laenge === start) letzter.laenge++;
        return;
      }
      if (x === '.') return;
      const basis = grund + oktave * 12;
      let n: number;
      if (begleitung) n = basis + (x === '8' ? 12 : toene[{ '1': 0, '3': 1, '5': 2, '7': 3 }[x] ?? 0]);
      else n = basis + (x === '5' ? 7 : x === '8' ? 12 : 0);
      out.push({ start, laenge: 1, midi: n });
    });
  });
  return out;
}

export function liedLaenge(l: Lied): number {
  return l.akkorde.length * 8;
}

/** Welches Lied auf welcher Karte läuft. */
export const KARTEN_LIED: Record<string, LiedId> = {
  alex_zimmer: 'zuhause',
  wohnzimmer: 'zuhause',
  kabelitz: 'dorf',
  dorfplatz: 'dorf',
  silberbach: 'dorf',
  briefzentrum: 'drinnen',
  dorfladen: 'zuhause',
  museum: 'museum',
  knotenburg: 'stadt',
  gymnasium: 'drinnen',
  bibliothek: 'museum',
  fernmeldeamt: 'stollen',
  netzleitstelle: 'drinnen',
  silberstollen: 'stollen',
  werkstatt: 'drinnen',
  weltkarte: 'welt',
  frankfurt: 'welt',
  landestation: 'welt',
  island: 'welt',
  tokio: 'welt',
  sydney: 'welt',
  opas_keller: 'nacht',
};

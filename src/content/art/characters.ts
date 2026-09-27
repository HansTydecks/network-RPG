import { PAL } from '../../engine/gfx/palette';
import { PixBuf } from '../../engine/gfx/pixbuf';

/**
 * Figuren-Vorlage (16×16, Chibi-Stil). Rollen-Buchstaben werden pro Figur eingefärbt:
 * o Umriss, s Haut, e Auge, h Haare, c Oberteil, p Hose, f Schuhe, g Brille/Extra.
 * Frames je Richtung: 0 = stehen, 1 = Schritt A, 2 = Schritt B. „right" = gespiegeltes „left".
 */
const HEAD_DOWN = [
  '............',
  '...oooooo...',
  '..ohhhhhho..',
  '.ohhhhhhhho.',
  '.ohhhhhhhho.',
  '.ohssssssho.',
  '.osesssseso.',
  '.ossssssssо.'.replace('о', 'o'),
  '..oossssoo..',
];
const HEAD_UP = [
  '............',
  '...oooooo...',
  '..ohhhhhho..',
  '.ohhhhhhhho.',
  '.ohhhhhhhho.',
  '.ohhhhhhhho.',
  '.ohhhhhhhho.',
  '.ohhhhhhhho.',
  '..oohhhhoo..',
];
const HEAD_LEFT = [
  '............',
  '...ooooo....',
  '..ohhhhhoo..',
  '.ohhhhhhhho.',
  '.ohhhhhhhho.',
  '.osshhhhhho.',
  '.oeshhhhhho.',
  '.ossshhhhho.',
  '..oossssoo..',
];
const BODY_FRONT = ['.occcccccco.', 'osccccccccso', 'osccccccccso', '.oppppppppo.'];
const BODY_SIDE = ['..occcccco..', '..occcscco..', '..occcscco..', '..oppppppo..'];
const LEGS_FRONT = [
  ['.oppo..oppo.', '.oppo..oppo.', '.offo..offo.'],
  ['.oppo..oppo.', '.offo..oppo.', '..oo...offo.'],
  ['.oppo..oppo.', '.oppo..offo.', '.offo...oo..'],
];
const LEGS_SIDE = [
  ['...oppppo...', '...oppppo...', '...offffo...'],
  ['..oppo.oppo.', '.oppo...oppo', '.offo...offo'],
  ['...opppo....', '..oppppo....', '..offffo....'],
];

export type CharDir = 'down' | 'up' | 'left';

export interface CharColors {
  s: string; // Haut
  h: string; // Haare
  c: string; // Oberteil
  p: string; // Hose
  f: string; // Schuhe
  e?: string;
}

function frame(dir: CharDir, step: number, col: CharColors, extra?: (b: PixBuf, dir: CharDir) => void): PixBuf {
  const head = dir === 'down' ? HEAD_DOWN : dir === 'up' ? HEAD_UP : HEAD_LEFT;
  const body = dir === 'left' ? BODY_SIDE : BODY_FRONT;
  const legs = (dir === 'left' ? LEGS_SIDE : LEGS_FRONT)[step];
  const grid = [...head, ...body, ...legs].map((r) => r.padStart(14, '.').padEnd(16, '.'));
  const b = new PixBuf(16, 16);
  b.grid(grid, { o: PAL.ink, s: col.s, e: col.e ?? PAL.ink, h: col.h, c: col.c, p: col.p, f: col.f });
  extra?.(b, dir);
  return b;
}

export interface CharacterArt {
  id: string;
  colors: CharColors;
  extra?: (b: PixBuf, dir: CharDir) => void;
}

/** Opa Werner trägt eine Brille (nur von vorn und seitlich sichtbar). */
const opaBrille = (b: PixBuf, dir: CharDir) => {
  if (dir === 'down') b.hline(4, 6, 3, PAL.grau1).hline(9, 6, 3, PAL.grau1).set(7, 6, PAL.grau1).set(8, 6, PAL.grau1);
  if (dir === 'left') b.hline(3, 6, 3, PAL.grau1);
};

export const CHARACTERS: CharacterArt[] = [
  { id: 'alex', colors: { s: PAL.haut1, h: PAL.braun2, c: PAL.blau3, p: PAL.blau1, f: PAL.rot2 } },
  { id: 'opa', colors: { s: PAL.haut1, h: PAL.grau4, c: PAL.braun3, p: PAL.grau2, f: PAL.braun1 }, extra: opaBrille },
  { id: 'mama', colors: { s: PAL.haut2, h: PAL.braun1, c: PAL.lila2, p: PAL.grau1, f: PAL.ink } },
  { id: 'papa', colors: { s: PAL.haut1, h: PAL.gelb, c: PAL.gruen3, p: PAL.gruen1, f: PAL.weiss } },
];

/** 9 Frames: down 0–2, up 3–5, left 6–8. */
export function characterFrames(art: CharacterArt): PixBuf[] {
  const out: PixBuf[] = [];
  for (const dir of ['down', 'up', 'left'] as CharDir[]) for (let s = 0; s < 3; s++) out.push(frame(dir, s, art.colors, art.extra));
  return out;
}

/** Ping, die Brieftaube: grau mit schillerndem Hals. Frames: 0/1 Stehen (nicken), 2/3 Flattern. */
const PING_ROWS = [
  [
    '................',
    '................',
    '.....ooo........',
    '....ogggo.......',
    '...oyeggo.......',
    '..obbggnno......',
    '....onnnnoo.....',
    '....ogggggoo....',
    '...ogggggggoo...',
    '...oggwwgggggo..',
    '...ogwwwwgggoo..',
    '....ogggggoo....',
    '.....ooooo......',
    '......b.b.......',
    '.....bb.bb......',
    '................',
  ],
  [
    '................',
    '................',
    '................',
    '.....ooo........',
    '....ogggo.......',
    '...oyeggo.......',
    '..obbgnnno......',
    '....onnnnoo.....',
    '...ogggggggoo...',
    '...oggwwgggggo..',
    '...ogwwwwgggoo..',
    '....ogggggoo....',
    '.....ooooo......',
    '......b.b.......',
    '.....bb.bb......',
    '................',
  ],
  [
    '................',
    '..oo.......oo...',
    '.owwo.ooo.owwo..',
    '.owwwoggg owwwo.'.replace(' ', 'o'),
    '..owwyeggowwo...',
    '...obbggnno.....',
    '....onnnnoo.....',
    '....ogggggoo....',
    '...ogggggggoo...',
    '...oggggggggo...',
    '....ogggggoo....',
    '.....ooooo......',
    '......b.b.......',
    '................',
    '................',
    '................',
  ],
];

export function pingFrames(): PixBuf[] {
  const legend = { o: PAL.ink, g: PAL.grau3, w: PAL.grau4, n: PAL.lila2, y: PAL.orange, e: PAL.ink, b: PAL.orange };
  const f = PING_ROWS.map((r) => new PixBuf(16, 16).grid(r, legend));
  // Hals schillert grün im zweiten Nick-Frame
  const f1 = f[1].recolor({ [PAL.lila2]: PAL.gruen3 });
  return [f[0], f1, f[2], f[2].flipX()];
}

/** Kleiner Briefumschlag für Datenpakete im Netzblick (8×6). */
export function packetSprite(): PixBuf {
  const b = new PixBuf(8, 6);
  b.rect(0, 0, 8, 6, PAL.netzPaket).frame(0, 0, 8, 6, PAL.ink);
  b.set(1, 1, PAL.ink).set(2, 2, PAL.ink).set(3, 3, PAL.ink).set(4, 3, PAL.ink).set(5, 2, PAL.ink).set(6, 1, PAL.ink);
  return b;
}

/** Symbol der Brille für Inventar und Hinweise (16×16). */
export function netzblickIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.frame(1, 5, 6, 5, PAL.ink).frame(9, 5, 6, 5, PAL.ink).hline(7, 6, 2, PAL.ink);
  b.rect(2, 6, 4, 3, PAL.netzKabel).rect(10, 6, 4, 3, PAL.netzKabel);
  b.set(2, 6, PAL.weiss).set(10, 6, PAL.weiss);
  b.vline(0, 6, 2, PAL.ink).vline(15, 6, 2, PAL.ink);
  return b;
}

CHARACTERS.push(
  { id: 'krause', colors: { s: PAL.haut1, h: PAL.rot2, c: PAL.gelb, p: PAL.blau1, f: PAL.ink } },
  { id: 'oezdemir', colors: { s: PAL.haut2, h: PAL.ink, c: PAL.blau2, p: PAL.grau1, f: PAL.braun1 } },
);

/** Opa Werners Katze Morse (grau getigert). Frames: 0 sitzen, 1 Schwanz schwingt. */
const MORSE_ROWS = [
  [
    '................',
    '................',
    '................',
    '....o...o.......',
    '...ogo.ogo......',
    '...ogggggo......',
    '...ogegegoo.....',
    '...ogggpggo.....',
    '....oggggo......',
    '...ogdgdggo.....',
    '..oggggggggo....',
    '..ogdggggdgo..o.',
    '..oggggggggo.ogo',
    '..ogggggggggoggo',
    '...owwooowwoooo.',
    '................',
  ],
  [
    '................',
    '................',
    '................',
    '....o...o.......',
    '...ogo.ogo......',
    '...ogggggo......',
    '...ogegegoo.....',
    '...ogggpggo.....',
    '....oggggo....o.',
    '...ogdgdggo..ogo',
    '..oggggggggo.ogo',
    '..ogdggggdgo.ogo',
    '..oggggggggoggo.',
    '..ogggggggggoo..',
    '...owwooowwo....',
    '................',
  ],
];

export function morseFrames(): PixBuf[] {
  const legend = { o: PAL.ink, g: PAL.grau3, d: PAL.grau2, e: PAL.gruen4, p: PAL.rot3, w: PAL.weiss };
  return MORSE_ROWS.map((r) => new PixBuf(16, 16).grid(r, legend));
}

export function briefIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.rect(1, 4, 14, 9, PAL.weiss).frame(1, 4, 14, 9, PAL.ink);
  for (let i = 0; i < 6; i++) b.set(2 + i, 5 + Math.floor(i / 2), PAL.grau2).set(13 - i, 5 + Math.floor(i / 2), PAL.grau2);
  b.hline(4, 10, 7, PAL.grau3);
  return b;
}

export function markeIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.rect(3, 2, 10, 12, PAL.weiss);
  for (let x = 3; x < 13; x += 2) b.set(x, 2, null).set(x, 13, null);
  for (let y = 2; y < 14; y += 2) b.set(3, y, null).set(12, y, null);
  b.rect(5, 4, 6, 8, PAL.blau3);
  b.rect(6, 7, 3, 2, PAL.grau3).set(9, 7, PAL.grau4).set(6, 6, PAL.grau3).set(5, 7, PAL.orange);
  return b;
}

export function zettelIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.rect(3, 1, 10, 14, PAL.creme).frame(3, 1, 10, 14, PAL.braun3);
  b.vline(8, 3, 5, PAL.ink).hline(6, 4, 5, PAL.ink).hline(7, 6, 3, PAL.ink);
  for (let i = 0; i < 6; i++) b.set(5 + i, 3 + i, PAL.rot3);
  b.hline(5, 10, 6, PAL.grau2).hline(5, 12, 5, PAL.grau2);
  return b;
}

/** Das Zeichen von FUNKSTILLE: eine durchgestrichene Antenne. */
export function funkstilleSymbol(): PixBuf {
  const b = new PixBuf(16, 16);
  b.vline(7, 4, 11, PAL.grau4).vline(8, 4, 11, PAL.grau4);
  b.hline(4, 6, 8, PAL.grau4).hline(5, 9, 6, PAL.grau4);
  b.rect(6, 14, 4, 2, PAL.grau4);
  for (let i = 0; i < 14; i++) b.set(1 + i, 1 + i, PAL.rot3).set(2 + i, 1 + i, PAL.rot3);
  return b;
}

CHARACTERS.push(
  { id: 'kowalski', colors: { s: PAL.haut2, h: PAL.braun1, c: PAL.orange, p: PAL.blau1, f: PAL.ink } },
  { id: 'froehlich', colors: { s: PAL.haut1, h: PAL.weiss, c: PAL.lila2, p: PAL.lila1, f: PAL.braun1 } },
  { id: 'emil', colors: { s: PAL.haut1, h: PAL.gelb, c: PAL.rot3, p: PAL.blau2, f: PAL.weiss } },
);

/** Krümel, der Saugroboter (von oben). Frames: 0 aus, 1 an (Lämpchen). */
export function kruemelFrames(): PixBuf[] {
  return [0, 1].map((f) => {
    const s = new PixBuf(16, 16);
    s.disc(7.5, 9, 6, PAL.grau2).disc(7.5, 8.5, 5, PAL.grau4).disc(7.5, 8.5, 2, PAL.grau3);
    s.set(7, 4, f ? PAL.gruen4 : PAL.grau1).set(8, 4, f ? PAL.gruen4 : PAL.grau1);
    s.hline(3, 13, 10, PAL.grau1);
    return s.outline(PAL.ink);
  });
}

export function binaerKarteIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.rect(1, 4, 14, 9, PAL.creme).frame(1, 4, 14, 9, PAL.braun2);
  for (let i = 0; i < 6; i++) b.rect(2 + i * 2, 7, 1, 3, i % 2 ? PAL.ink : PAL.grau3);
  b.hline(3, 5, 9, PAL.blau2);
  return b;
}

export function fernbedienungIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.rect(4, 2, 8, 12, PAL.grau1).frame(4, 2, 8, 12, PAL.ink);
  b.rect(6, 4, 4, 2, PAL.gruen3).rect(6, 7, 2, 2, PAL.rot3).rect(8, 7, 2, 2, PAL.gelb).rect(6, 10, 4, 2, PAL.blau3);
  return b;
}

export function schluesselIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.disc(5, 8, 3, PAL.gelb).disc(5, 8, 1, null);
  b.hline(8, 8, 6, PAL.gelb).vline(12, 9, 2, PAL.gelb).vline(10, 9, 2, PAL.gelb);
  return b.outline(PAL.ink);
}

export function fotoIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.rect(1, 3, 14, 11, PAL.weiss).rect(2, 4, 12, 8, PAL.grau2);
  b.disc(6, 8, 2, PAL.grau4).rect(9, 7, 3, 4, PAL.grau3);
  return b.outline(PAL.ink);
}

CHARACTERS.push(
  { id: 'nguyen', colors: { s: PAL.haut2, h: PAL.ink, c: PAL.gruen2, p: PAL.grau1, f: PAL.braun1 } },
  { id: 'haendler', colors: { s: PAL.haut1, h: PAL.orange, c: PAL.lila2, p: PAL.braun2, f: PAL.ink } },
  { id: 'lehmann', colors: { s: PAL.haut1, h: PAL.braun2, c: PAL.blau2, p: PAL.grau1, f: PAL.ink } },
  { id: 'lina', colors: { s: PAL.haut3, h: PAL.ink, c: PAL.gelb, p: PAL.lila1, f: PAL.rot2 } },
);

export function kabelbinderIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  for (let i = 0; i < 3; i++) b.hline(2, 4 + i * 4, 12, [PAL.ink, PAL.weiss, PAL.ink][i]).set(13, 3 + i * 4, PAL.grau2);
  return b.outline(PAL.grau1);
}

export function usbIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.rect(4, 3, 8, 10, PAL.blau2).rect(6, 0, 4, 3, PAL.grau4).set(7, 1, PAL.ink).set(8, 1, PAL.ink);
  b.rect(6, 7, 4, 2, PAL.weiss);
  return b.outline(PAL.ink);
}

// Kapitel 2: Knotenburg
CHARACTERS.push(
  { id: 'work', colors: { s: PAL.haut2, h: PAL.braun1, c: PAL.blau4, p: PAL.grau1, f: PAL.ink }, extra: opaBrille },
  { id: 'mia', colors: { s: PAL.haut1, h: PAL.rot2, c: PAL.gruen3, p: PAL.blau1, f: PAL.weiss } },
  { id: 'jonas', colors: { s: PAL.haut3, h: PAL.ink, c: PAL.orange, p: PAL.grau2, f: PAL.ink } },
  { id: 'fahrer', colors: { s: PAL.haut1, h: PAL.gelb, c: PAL.blau2, p: PAL.blau1, f: PAL.ink } },
  { id: 'passant', colors: { s: PAL.haut2, h: PAL.grau3, c: PAL.braun2, p: PAL.grau1, f: PAL.braun1 } },
);

/** Brille v2: wie v1, mit Antennen-Symbol für Funk und Pakete. */
export function netzblickV2Icon(): PixBuf {
  const b = netzblickIcon();
  b.vline(13, 1, 4, PAL.netzFunk).set(12, 1, PAL.netzFunk).set(14, 1, PAL.netzFunk);
  b.rect(1, 1, 4, 3, PAL.netzPaket).frame(1, 1, 4, 3, PAL.ink);
  return b;
}

/** Fremder USB-Stick mit FUNKSTILLEs Zeichen. */
export function fremderStickIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.rect(4, 3, 8, 10, PAL.ink).rect(6, 13, 4, 2, PAL.grau4);
  b.vline(8, 5, 6, PAL.grau4).hline(6, 6, 5, PAL.grau4);
  for (let i = 0; i < 6; i++) b.set(5 + i, 4 + i, PAL.rot3);
  return b;
}

/** Alter Schlüsselanhänger „Schlüssel 7". */
export function schluessel7Icon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.disc(5, 5, 3, PAL.gelb).disc(5, 5, 1, PAL.ink);
  b.hline(8, 5, 6, PAL.gelb).vline(12, 6, 2, PAL.gelb).vline(10, 6, 2, PAL.gelb);
  b.rect(6, 9, 7, 5, PAL.braun3).frame(6, 9, 7, 5, PAL.braun1);
  b.set(9, 11, PAL.ink).set(10, 11, PAL.ink);
  return b;
}

CHARACTERS.push(
  { id: 'pino', colors: { s: PAL.haut2, h: PAL.ink, c: PAL.weiss, p: PAL.rot2, f: PAL.ink } },
  { id: 'lange', colors: { s: PAL.haut1, h: PAL.grau3, c: PAL.creme, p: PAL.grau2, f: PAL.braun1 } },
  { id: 'schulz', colors: { s: PAL.haut1, h: PAL.braun3, c: PAL.gruen2, p: PAL.grau1, f: PAL.ink } },
  { id: 'berger', colors: { s: PAL.haut1, h: PAL.weiss, c: PAL.rot3, p: PAL.lila1, f: PAL.braun1 } },
  { id: 'weber', colors: { s: PAL.haut3, h: PAL.braun1, c: PAL.lila2, p: PAL.blau1, f: PAL.ink }, extra: opaBrille },
  { id: 'sommer', colors: { s: PAL.haut1, h: PAL.orange, c: PAL.gelb, p: PAL.braun2, f: PAL.ink } },
);

export function echtheitslupeIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.disc(6, 6, 5, PAL.grau4).disc(6, 6, 4, PAL.blau4).disc(5, 5, 1.5, PAL.weiss);
  for (let i = 0; i < 5; i++) b.rect(9 + i, 9 + i, 2, 2, PAL.braun2);
  b.set(5, 8, PAL.gruen3).set(6, 9, PAL.gruen3).set(7, 7, PAL.gruen3).set(8, 6, PAL.gruen3);
  return b;
}

export function caesarScheibeIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.disc(7.5, 7.5, 7, PAL.braun3).disc(7.5, 7.5, 5, PAL.creme).disc(7.5, 7.5, 2, PAL.braun2);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    b.set(Math.round(7.5 + Math.cos(a) * 6), Math.round(7.5 + Math.sin(a) * 6), PAL.ink);
  }
  b.vline(7, 1, 3, PAL.rot3);
  return b;
}

export function taubenfederIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  for (let i = 0; i < 11; i++) b.set(3 + i, 13 - i, PAL.grau1);
  for (let i = 1; i < 10; i++) b.hline(3 + i, 12 - i, 3, PAL.grau3).set(2 + i, 13 - i, PAL.grau4);
  b.rect(3, 12, 3, 2, PAL.gelb);
  return b;
}

// Kapitel 3
CHARACTERS.push(
  { id: 'yilmaz', colors: { s: PAL.haut2, h: PAL.ink, c: PAL.weiss, p: PAL.blau1, f: PAL.ink }, extra: opaBrille },
  { id: 'kalle', colors: { s: PAL.haut1, h: PAL.grau3, c: PAL.gelb, p: PAL.grau1, f: PAL.braun1 } },
);

/** Brille v3 mit Lupe für Datenpakete. */
export function netzblickV3Icon(): PixBuf {
  const b = netzblickV2Icon();
  b.disc(12, 12, 3, PAL.gelb).disc(12, 12, 2, PAL.blau4).set(15, 15, PAL.gelb).set(14, 14, PAL.gelb);
  return b;
}

export function schluesselpaarIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.disc(4, 4, 3, PAL.gelb).disc(4, 4, 1, PAL.ink).hline(6, 4, 6, PAL.gelb).vline(10, 5, 2, PAL.gelb);
  b.rect(8, 9, 6, 5, PAL.grau4).frame(8, 9, 6, 5, PAL.grau1);
  b.hline(9, 7, 4, PAL.grau3).vline(9, 7, 2, PAL.grau3).vline(12, 7, 2, PAL.grau3).set(11, 11, PAL.ink);
  return b;
}

export function grubenlampeIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.rect(5, 5, 6, 9, PAL.grau2).frame(5, 5, 6, 9, PAL.ink).rect(6, 7, 4, 4, PAL.gelb);
  b.hline(6, 3, 4, PAL.grau1).vline(5, 3, 2, PAL.grau1).vline(10, 3, 2, PAL.grau1);
  return b;
}

// Kapitel 4
CHARACTERS.push(
  { id: 'kevin', colors: { s: PAL.haut1, h: PAL.lila2, c: PAL.ink, p: PAL.grau1, f: PAL.rot2 } },
  { id: 'schubert', colors: { s: PAL.haut1, h: PAL.grau4, c: PAL.braun2, p: PAL.grau2, f: PAL.ink }, extra: opaBrille },
);

export function postkarteIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.rect(1, 3, 14, 10, PAL.creme).frame(1, 3, 14, 10, PAL.braun2);
  b.rect(10, 4, 4, 4, PAL.blau3).disc(9, 6, 2, PAL.grau3);
  b.hline(3, 9, 6, PAL.grau2).hline(3, 11, 5, PAL.grau2);
  return b;
}

export function quelltextIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.disc(7, 7, 6, PAL.grau4).disc(7, 7, 5, PAL.nacht);
  b.set(5, 6, PAL.netzKabel).set(4, 7, PAL.netzKabel).set(5, 8, PAL.netzKabel);
  b.set(9, 6, PAL.netzKabel).set(10, 7, PAL.netzKabel).set(9, 8, PAL.netzKabel).set(7, 5, PAL.gelb).set(7, 9, PAL.gelb);
  for (let i = 0; i < 4; i++) b.rect(11 + i, 11 + i, 2, 2, PAL.braun2);
  return b;
}

export function reisepassIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.rect(3, 1, 10, 14, PAL.rot1).frame(3, 1, 10, 14, PAL.ink);
  b.disc(8, 7, 2.5, PAL.gelb).hline(5, 11, 6, PAL.gelb);
  return b;
}

// Kapitel 5
CHARACTERS.push(
  { id: 'ada', colors: { s: PAL.haut2, h: PAL.rot2, c: PAL.netzKabel, p: PAL.grau1, f: PAL.ink }, extra: opaBrille },
  { id: 'leon', colors: { s: PAL.haut1, h: PAL.braun3, c: PAL.gruen3, p: PAL.blau1, f: PAL.weiss } },
  { id: 'sato', colors: { s: PAL.haut1, h: PAL.ink, c: PAL.rot2, p: PAL.grau1, f: PAL.ink } },
  { id: 'sigrun', colors: { s: PAL.haut1, h: PAL.gelb, c: PAL.blau3, p: PAL.grau2, f: PAL.braun1 } },
  { id: 'kapitaenin', colors: { s: PAL.haut3, h: PAL.weiss, c: PAL.blau1, p: PAL.blau1, f: PAL.ink } },
);

export function netzblickV4Icon(): PixBuf {
  const b = netzblickV3Icon();
  b.disc(3, 12, 3, PAL.blau3).set(2, 11, PAL.gruen3).set(3, 13, PAL.gruen3).set(4, 11, PAL.gruen3);
  return b;
}

export function subnetzmaskeIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.rect(1, 4, 14, 7, PAL.ink).frame(1, 4, 14, 7, PAL.grau3);
  b.disc(5, 7, 2, PAL.gelb).disc(10, 7, 2, PAL.gelb);
  b.hline(0, 6, 1, PAL.grau3).hline(15, 6, 1, PAL.grau3);
  return b;
}

export function kompassIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.disc(7.5, 7.5, 7, PAL.gelb).disc(7.5, 7.5, 6, PAL.creme);
  for (let i = 0; i < 5; i++) b.set(7, 2 + i, PAL.rot3).set(8, 13 - i, PAL.grau2);
  b.set(7, 7, PAL.ink).set(8, 8, PAL.ink);
  return b;
}

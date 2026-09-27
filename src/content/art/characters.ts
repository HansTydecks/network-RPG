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

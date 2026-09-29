import { PAL } from '../../engine/gfx/palette';
import { PixBuf, rows } from '../../engine/gfx/pixbuf';
import { dunkler, heller, mitAlpha, mix } from '../../engine/gfx/farbe';
import { CHARACTERS, pingFrames, type CharDir } from './characters';
import type { TileDef } from './tiles';

/**
 * Flavor: Deko-Kacheln, Figuren ohne feste Aufgabe, Tiere, Umgebungs-Sprites
 * und Symbole für die Geheimnisse. Alles ohne Lehrplanbezug – nur für Atmosphäre.
 */

const GOLD = '#ffd84a';
const GOLD_DUNKEL = '#c89a2a';

export const FLAVOR_TILES: TileDef[] = [
  {
    id: 'muelltonne',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(4, 5, 8, 10, PAL.grau2).vline(6, 6, 8, PAL.grau1).vline(9, 6, 8, PAL.grau1);
      b.rect(3, 3, 10, 2, PAL.grau3).hline(6, 2, 4, PAL.grau1);
      b.set(4, 15, PAL.ink).set(11, 15, PAL.ink);
    },
  },
  {
    id: 'fahrrad',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      for (const cx of [3.5, 12.5]) {
        b.disc(cx, 11.5, 3.5, PAL.ink);
        b.disc(cx, 11.5, 2.4, null);
        b.set(Math.floor(cx), 11, PAL.grau3);
      }
      for (let i = 0; i < 6; i++) b.set(4 + i, 11 - Math.floor(i / 2), PAL.rot3);
      b.hline(6, 8, 5, PAL.rot3).vline(10, 7, 5, PAL.rot3).hline(9, 6, 3, PAL.ink).hline(5, 7, 3, PAL.braun1);
    },
  },
  {
    id: 'blumenkuebel',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(3, 9, 10, 6, PAL.braun2).hline(3, 9, 10, PAL.braun3).hline(4, 15, 8, PAL.braun1);
      b.disc(7.5, 6, 4.5, PAL.gruen2);
      for (const [x, y, c] of [[5, 4, PAL.rot3], [9, 3, PAL.gelb], [11, 6, PAL.lila2], [6, 7, PAL.weiss], [8, 5, PAL.rot3]] as const) b.set(x, y, c).set(x + 1, y, heller(c, 0.3));
    },
  },
  {
    id: 'brunnen',
    layer: 'deco',
    solid: true,
    info: 'Ein alter Brunnen.',
    draw: (b) => {
      b.disc(7.5, 8.5, 7, PAL.grau2).disc(7.5, 8.5, 5.5, PAL.grau3).disc(7.5, 8.5, 4.2, PAL.blau2);
      b.set(5, 7, PAL.blau4).set(6, 7, PAL.blau4).set(9, 10, PAL.blau3).set(10, 9, PAL.blau4);
      b.vline(7, 0, 5, PAL.braun1).vline(8, 0, 5, PAL.braun1);
    },
  },
  {
    id: 'pfuetze',
    layer: 'deco',
    draw: (b) => {
      const rand = mix(PAL.blau2, PAL.grau2, 0.4);
      for (let y = 6; y < 13; y++)
        for (let x = 2; x < 14; x++) {
          const d = ((x - 7.5) / 6) ** 2 + ((y - 9.5) / 3.3) ** 2;
          if (d < 1) b.set(x, y, mitAlpha(d > 0.7 ? rand : PAL.blau3, 0.7));
        }
      b.hline(5, 8, 3, mitAlpha(PAL.weiss, 0.8)).set(10, 11, mitAlpha(PAL.weiss, 0.6));
    },
  },
  {
    id: 'steine',
    layer: 'deco',
    draw: (b) => {
      for (const [x, y, w] of [[3, 10, 3], [9, 5, 2], [11, 12, 3]] as const) {
        b.hline(x, y, w, PAL.grau3).hline(x, y + 1, w, PAL.grau2).set(x, y, PAL.grau4);
      }
    },
  },
  {
    id: 'pilze',
    layer: 'deco',
    draw: (b) => {
      for (const [x, y] of [[4, 9], [10, 11]] as const) {
        b.vline(x + 1, y + 2, 2, PAL.creme);
        b.hline(x, y, 3, PAL.rot3).hline(x - 1, y + 1, 5, PAL.rot2).set(x + 1, y, PAL.weiss).set(x - 1, y + 1, PAL.weiss);
      }
    },
  },
  {
    id: 'laub',
    layer: 'deco',
    draw: (b) => {
      const farben = [PAL.orange, PAL.gelb, PAL.braun3, PAL.rot3];
      [[2, 3], [7, 5], [12, 2], [4, 10], [10, 9], [13, 13], [6, 13], [1, 7]].forEach(([x, y], i) => {
        const c = farben[i % farben.length];
        b.set(x, y, c).set(x + 1, y, c).set(x, y + 1, dunkler(c, 0.25));
      });
    },
  },
  {
    id: 'gartenzwerg',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.grid(
        rows(`
          .......r........
          ......rr........
          ......rrr.......
          .....rrrr.......
          .....ssss.......
          ....wwwwww......
          ....wwwwww......
          .....bwwb.......
          ....bbbbbb......
          ....bbbbbb......
          .....p..p.......
          ....kk..kk......`),
        { r: PAL.rot3, s: PAL.haut1, w: PAL.weiss, b: PAL.blau2, p: PAL.braun2, k: PAL.braun1 },
        2,
        3,
      );
    },
  },
  {
    id: 'hydrant',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(6, 5, 4, 10, PAL.rot2).rect(5, 4, 6, 2, PAL.rot3).rect(4, 8, 8, 2, PAL.rot3).hline(6, 3, 4, PAL.rot3);
      b.set(7, 6, PAL.gelb).rect(5, 15, 6, 1, PAL.grau1);
    },
  },
  {
    id: 'litfass',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(3, 2, 10, 14, PAL.grau4).rect(2, 1, 12, 2, PAL.gruen1);
      b.rect(4, 4, 4, 5, PAL.gelb).rect(8, 4, 4, 3, PAL.blau3).rect(8, 7, 4, 6, PAL.rot3).rect(4, 9, 4, 4, PAL.lila2);
      b.hline(5, 6, 2, PAL.ink).hline(9, 9, 2, PAL.weiss);
    },
  },
  {
    id: 'wegweiser',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.vline(7, 2, 14, PAL.braun1).vline(8, 2, 14, PAL.braun2);
      b.rect(2, 3, 10, 3, PAL.creme).set(12, 4, PAL.creme).hline(3, 4, 6, PAL.grau2);
      b.rect(4, 7, 10, 3, PAL.creme).set(3, 8, PAL.creme).hline(6, 8, 6, PAL.grau2);
    },
  },
  {
    id: 'wanduhr',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.disc(7.5, 7.5, 5.5, PAL.braun2).disc(7.5, 7.5, 4.5, PAL.weiss);
      b.vline(7, 4, 4, PAL.ink).hline(8, 7, 3, PAL.ink).set(7, 3, PAL.grau2).set(12, 7, PAL.grau2).set(3, 8, PAL.grau2).set(8, 12, PAL.grau2);
    },
  },
  {
    id: 'poster',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(3, 2, 10, 12, PAL.blau1).frame(3, 2, 10, 12, PAL.weiss);
      b.disc(8, 7, 2.5, PAL.gelb);
      for (let i = 0; i < 5; i++) b.set(4 + i * 2, 12, PAL.gruen3).set(5 + i * 2, 11, PAL.gruen2);
      b.set(5, 4, PAL.weiss).set(11, 5, PAL.weiss).set(10, 3, PAL.weiss);
    },
  },
  {
    id: 'zimmerpflanze',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(5, 11, 6, 5, PAL.braun2).hline(4, 11, 8, PAL.braun3);
      for (const [cx, cy, r] of [[5, 6, 3], [10, 5, 3], [7.5, 3, 3], [8, 8, 3]] as const) b.disc(cx, cy, r, PAL.gruen2);
      b.disc(6, 4, 1.3, PAL.gruen3).disc(10, 4, 1.2, PAL.gruen3).vline(7, 7, 4, PAL.gruen1);
    },
  },
  {
    id: 'wasserspender',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(4, 8, 8, 8, PAL.weiss).frame(4, 8, 8, 8, PAL.grau3).rect(7, 10, 2, 2, PAL.blau2);
      b.rect(5, 1, 6, 7, mix(PAL.blau4, PAL.weiss, 0.3)).rect(6, 2, 1, 5, PAL.weiss).hline(6, 0, 4, PAL.blau2);
    },
  },
  {
    id: 'stuhl',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(4, 2, 8, 6, PAL.braun2).rect(5, 3, 6, 4, PAL.braun3).rect(3, 8, 10, 3, PAL.braun3).hline(3, 8, 10, PAL.braun4);
      b.vline(4, 11, 5, PAL.braun1).vline(11, 11, 5, PAL.braun1);
    },
  },
  {
    id: 'buecherstapel',
    layer: 'deco',
    draw: (b) => {
      b.rect(4, 12, 8, 2, PAL.rot2).rect(5, 10, 7, 2, PAL.blau2).rect(4, 8, 7, 2, PAL.gruen2);
      b.hline(4, 12, 8, PAL.rot3).hline(5, 10, 7, PAL.blau3).hline(4, 8, 7, PAL.gruen3).vline(11, 12, 2, PAL.creme);
    },
  },
  {
    id: 'automat',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(2, 1, 12, 15, PAL.rot2).rect(3, 2, 7, 10, mix(PAL.blau4, PAL.ink, 0.5));
      for (let y = 3; y < 11; y += 3) for (let x = 4; x < 9; x += 2) b.set(x, y, [PAL.gelb, PAL.gruen3, PAL.orange][(x + y) % 3]).set(x, y + 1, PAL.weiss);
      b.rect(11, 3, 2, 4, PAL.grau4).rect(4, 13, 5, 2, PAL.ink);
    },
  },
  {
    id: 'goldfeder',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      for (let i = 0; i < 9; i++) {
        const x = 4 + i;
        const y = 12 - i;
        b.set(x, y, GOLD_DUNKEL).set(x - 1, y - 1, GOLD).set(x, y - 2, GOLD).set(x + 1, y - 1, heller(GOLD, 0.4));
      }
      b.set(3, 13, GOLD_DUNKEL).set(2, 14, GOLD_DUNKEL);
      b.set(13, 2, PAL.weiss).set(12, 3, PAL.weiss).set(14, 3, PAL.weiss).set(13, 4, PAL.weiss).set(3, 5, PAL.weiss);
    },
  },
];

// ---------- Figuren ohne feste Aufgabe ----------

const muetze = (farbe: string) => (b: PixBuf, dir: CharDir) => {
  b.hline(4, 1, 8, farbe).hline(3, 2, 10, farbe).set(dir === 'left' ? 2 : 12, 3, farbe);
};
const kappe = (farbe: string) => (b: PixBuf, dir: CharDir) => {
  b.hline(4, 1, 8, farbe).hline(3, 2, 10, farbe);
  if (dir === 'down') b.hline(4, 3, 8, dunkler(farbe, 0.3));
  if (dir === 'left') b.hline(1, 3, 4, dunkler(farbe, 0.3));
};
const stirnband = (b: PixBuf) => b.hline(3, 3, 10, PAL.rot3);
const bart = (b: PixBuf, dir: CharDir) => {
  if (dir === 'down') b.hline(4, 8, 8, PAL.grau4).hline(5, 9, 6, PAL.grau4);
  if (dir === 'left') b.hline(2, 8, 4, PAL.grau4);
};

CHARACTERS.push(
  { id: 'joggerin', colors: { s: PAL.haut3, h: PAL.ink, c: PAL.rot3, p: PAL.ink, f: PAL.weiss }, extra: stirnband },
  { id: 'rentner', colors: { s: PAL.haut1, h: PAL.grau4, c: PAL.gruen2, p: PAL.braun2, f: PAL.braun1 }, extra: kappe(PAL.grau2) },
  { id: 'kind_a', colors: { s: PAL.haut2, h: PAL.orange, c: PAL.gelb, p: PAL.blau3, f: PAL.rot2 } },
  { id: 'kind_b', colors: { s: PAL.haut3, h: PAL.ink, c: PAL.gruen3, p: PAL.grau1, f: PAL.weiss } },
  { id: 'marktfrau', colors: { s: PAL.haut1, h: PAL.rot2, c: PAL.weiss, p: PAL.blau1, f: PAL.ink }, extra: muetze(PAL.gruen2) },
  { id: 'musiker', colors: { s: PAL.haut2, h: PAL.braun1, c: PAL.lila1, p: PAL.ink, f: PAL.braun1 }, extra: kappe(PAL.ink) },
  { id: 'skater', colors: { s: PAL.haut1, h: PAL.gelb, c: PAL.orange, p: PAL.grau2, f: PAL.ink }, extra: kappe(PAL.blau2) },
  { id: 'bote', colors: { s: PAL.haut3, h: PAL.braun1, c: PAL.gelb, p: PAL.braun1, f: PAL.ink }, extra: kappe(PAL.gelb) },
  { id: 'touristin', colors: { s: PAL.haut1, h: PAL.braun3, c: PAL.blau4, p: PAL.weiss, f: PAL.braun2 }, extra: muetze(PAL.creme) },
  { id: 'hausmeister', colors: { s: PAL.haut2, h: PAL.grau3, c: PAL.blau2, p: PAL.blau1, f: PAL.ink }, extra: bart },
  { id: 'leserin', colors: { s: PAL.haut1, h: PAL.lila1, c: PAL.braun3, p: PAL.grau2, f: PAL.ink } },
  { id: 'wanderer', colors: { s: PAL.haut2, h: PAL.braun2, c: PAL.gruen1, p: PAL.braun2, f: PAL.braun1 }, extra: muetze(PAL.rot2) },
  { id: 'reisende', colors: { s: PAL.haut3, h: PAL.ink, c: PAL.grau4, p: PAL.blau1, f: PAL.ink } },
  { id: 'fischer', colors: { s: PAL.haut1, h: PAL.gelb, c: PAL.gelb, p: PAL.blau1, f: PAL.ink }, extra: muetze(PAL.gelb) },
  { id: 'surferin', colors: { s: PAL.haut2, h: PAL.gelb, c: PAL.blau3, p: PAL.blau3, f: PAL.haut2 } },
);

// ---------- Tiere ----------

const HUND = [
  rows(`
    ................
    ................
    ................
    ................
    ................
    ..oo............
    .obbo......o....
    obebbo....obo...
    obbbbbooooobo...
    .oonbbbbbbbbo...
    ...obbbbbbbbo...
    ...obwwwwbbo....
    ...obo.obo.o....
    ...oo..oo.......
    ................
    ................`),
  rows(`
    ................
    ................
    ................
    ................
    ................
    ..oo.......o....
    .obbo.....obo...
    obebbo....obo...
    obbbbbooooobo...
    .oonbbbbbbbbo...
    ...obbbbbbbbo...
    ...obwwwwbbo....
    ...obo..obo.....
    ....oo..oo......
    ................
    ................`),
];

const ENTE = [
  rows(`
    ................
    ................
    ................
    ................
    ................
    .......ooo......
    ......ogggo.....
    .....yogego.....
    ......ogggo.....
    ....oowwwwwo....
    ...owwwwwwwwo...
    ...owwwgwwwwo...
    ....owwwwwwo....
    .....oooooo.....
    ......y..y......
    ................`),
  rows(`
    ................
    ................
    ................
    ................
    ................
    ................
    .......ooo......
    ......ogggo.....
    .....yogego.....
    ....oowgggwo....
    ...owwwwwwwwo...
    ...owwwgwwwwo...
    ....owwwwwwo....
    .....oooooo.....
    .....y....y.....
    ................`),
];

export function hundFrames(): PixBuf[] {
  const legend = { o: PAL.ink, b: PAL.braun3, e: PAL.ink, n: PAL.ink, w: PAL.creme };
  return HUND.map((r) => new PixBuf(16, 16).grid(r, legend));
}

export function enteFrames(): PixBuf[] {
  const legend = { o: PAL.ink, g: PAL.gruen2, e: PAL.ink, y: PAL.orange, w: PAL.weiss };
  return ENTE.map((r) => new PixBuf(16, 16).grid(r, legend));
}

// ---------- Umgebung ----------

function blatt(farbe: string, stiel: string = PAL.braun1): PixBuf[] {
  const a = new PixBuf(5, 4);
  a.hline(1, 0, 3, farbe).hline(0, 1, 4, farbe).hline(1, 2, 3, dunkler(farbe, 0.2)).set(4, 3, stiel).set(0, 1, heller(farbe, 0.3));
  const b = new PixBuf(5, 4);
  b.hline(1, 1, 3, farbe).hline(0, 2, 3, dunkler(farbe, 0.2)).set(4, 0, stiel).set(1, 1, heller(farbe, 0.3));
  return [a, b];
}

export const blattFrames = () => [...blatt(PAL.orange), ...blatt(PAL.gelb), ...blatt(PAL.gruen3, PAL.gruen1)];
export const bluetenFrames = () => blatt('#ffb3d9', '#ff8ac4');

export function schmetterlingFrames(): PixBuf[] {
  const auf = new PixBuf(5, 4);
  auf.set(0, 0, PAL.gelb).set(1, 0, PAL.gelb).set(3, 0, PAL.gelb).set(4, 0, PAL.gelb).set(0, 1, PAL.orange).set(4, 1, PAL.orange).vline(2, 0, 4, PAL.ink);
  auf.set(1, 1, PAL.gelb).set(3, 1, PAL.gelb);
  const zu = new PixBuf(5, 4);
  zu.set(1, 1, PAL.gelb).set(3, 1, PAL.gelb).set(1, 2, PAL.orange).set(3, 2, PAL.orange).vline(2, 0, 4, PAL.ink);
  return [auf, zu];
}

export function moeweFrames(): PixBuf[] {
  const a = new PixBuf(9, 4);
  a.set(0, 0, PAL.grau4).set(1, 1, PAL.weiss).set(2, 1, PAL.weiss).set(3, 2, PAL.weiss).set(4, 2, PAL.grau3).set(5, 2, PAL.weiss).set(6, 1, PAL.weiss).set(7, 1, PAL.weiss).set(8, 0, PAL.grau4);
  const b = new PixBuf(9, 4);
  b.hline(1, 2, 3, PAL.weiss).set(4, 2, PAL.grau3).hline(5, 2, 3, PAL.weiss).set(0, 3, PAL.grau4).set(8, 3, PAL.grau4);
  return [a, b];
}

export function flockeBild(): PixBuf {
  return new PixBuf(3, 3).set(1, 0, PAL.weiss).set(0, 1, PAL.weiss).set(1, 1, PAL.weiss).set(2, 1, PAL.weiss).set(1, 2, PAL.weiss);
}

export function gluehwurmBild(): PixBuf {
  const b = new PixBuf(5, 5);
  for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++) {
    const d = Math.abs(x - 2) + Math.abs(y - 2);
    if (d === 0) b.set(x, y, '#f4ffa0');
    else if (d === 1) b.set(x, y, mitAlpha('#d8ff5a', 0.8));
    else if (d === 2) b.set(x, y, mitAlpha('#d8ff5a', 0.25));
  }
  return b;
}

export function wolkenschatten(): PixBuf {
  const b = new PixBuf(48, 24);
  for (let y = 0; y < 24; y++)
    for (let x = 0; x < 48; x++) {
      const d = ((x - 23.5) / 24) ** 2 + ((y - 11.5) / 12) ** 2;
      if (d < 1) b.set(x, y, mitAlpha(PAL.ink, d < 0.6 ? 0.16 : 0.09));
    }
  return b;
}

export function tropfenBild(): PixBuf {
  return new PixBuf(1, 3).set(0, 0, mitAlpha(PAL.blau4, 0.5)).set(0, 1, PAL.blau4).set(0, 2, PAL.weiss);
}

// ---------- Symbole der Geheimnisse ----------

export function goldfederIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  FLAVOR_TILES.find((t) => t.id === 'goldfeder')!.draw(b);
  return b;
}

export function morseGeschenkIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.disc(7, 9, 4, PAL.grau3).disc(10, 7, 2, PAL.grau3).disc(10.5, 5, 1.2, PAL.rot3);
  b.set(11, 7, PAL.ink).set(12, 8, PAL.rot3);
  for (let i = 0; i < 5; i++) b.set(2 - Math.floor(i / 3) + i, 12 + (i % 2), PAL.grau2);
  return b;
}

export function taubenringIcon(): PixBuf {
  const b = new PixBuf(16, 16);
  b.disc(7.5, 8, 6, GOLD_DUNKEL).disc(7.5, 8, 5, GOLD).disc(7.5, 8, 3, null);
  b.set(4, 5, heller(GOLD, 0.6)).set(5, 4, heller(GOLD, 0.6)).set(12, 2, PAL.weiss).set(13, 3, PAL.weiss);
  return b;
}

/** Ping mit Sonnenbrille (Konami-Code auf dem Titelbild). */
export function pingCoolFrames(): PixBuf[] {
  const brille = (f: PixBuf): PixBuf => {
    const out = f.crop(0, 0, f.w, f.h);
    for (let y = 0; y < out.h; y++)
      for (let x = 0; x < out.w; x++)
        if (out.get(x, y) === PAL.orange) {
          out.set(x + 1, y, PAL.ink).set(x + 2, y, PAL.ink).set(x + 1, y - 1, PAL.ink).set(x + 2, y - 1, mitAlpha(PAL.weiss, 1)).set(x + 3, y - 1, PAL.ink);
          return out;
        }
    return out;
  };
  const [a, b, c] = pingFrames();
  const cool = [brille(a), brille(b), brille(c)];
  return [...cool, cool[2].flipX()];
}

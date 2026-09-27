import { PAL } from '../../engine/gfx/palette';
import { PixBuf, rng, rows } from '../../engine/gfx/pixbuf';

/**
 * Alle Kacheln (16×16) von NETZBLICK – selbst gezeichnet, als Code.
 * ground = deckende Bodenkachel, deco = Objekt mit Transparenz über dem Boden.
 * Die Reihenfolge bestimmt den Kachel-Index; neue Kacheln hinten anfügen.
 */
export interface TileDef {
  id: string;
  layer: 'ground' | 'deco';
  solid?: boolean;
  /** Beschreibung für Schilder/Untersuchen ohne eigenes Script. */
  info?: string;
  draw(b: PixBuf): void;
}

const T = 16;

function speckle(b: PixBuf, seed: number, colors: string[], density: number) {
  const r = rng(seed);
  for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) if (r() < density) b.set(x, y, colors[Math.floor(r() * colors.length)]);
}

function grass(b: PixBuf, seed = 1) {
  b.rect(0, 0, T, T, PAL.gruen3);
  speckle(b, seed, [PAL.gruen2], 0.12);
  const r = rng(seed + 99);
  for (let i = 0; i < 4; i++) {
    const x = Math.floor(r() * 14) + 1;
    const y = Math.floor(r() * 13) + 2;
    b.set(x, y, PAL.gruen2).set(x + 1, y - 1, PAL.gruen2).set(x - 1, y - 1, PAL.gruen4);
  }
}

function path(b: PixBuf, seed = 5) {
  b.rect(0, 0, T, T, PAL.braun4);
  speckle(b, seed, [PAL.braun3, PAL.creme], 0.1);
}

function planks(b: PixBuf) {
  b.rect(0, 0, T, T, PAL.braun3);
  for (let y = 3; y < T; y += 4) b.hline(0, y, T, PAL.braun2);
  const r = rng(11);
  for (let y = 0; y < T; y += 4) {
    const x = Math.floor(r() * 12) + 2;
    b.vline(x, y, 3, PAL.braun2);
    b.set(Math.floor(r() * 14) + 1, y + 1, PAL.braun4);
  }
}

function roof(b: PixBuf, edgeL: boolean, edgeR: boolean) {
  b.rect(0, 0, T, T, PAL.rot2);
  for (let y = 0; y < T; y += 4) {
    b.hline(0, y + 3, T, PAL.rot1);
    const off = (y / 4) % 2 === 0 ? 0 : 4;
    for (let x = off; x < T; x += 8) b.vline(x, y, 3, PAL.rot1);
    b.hline(0, y, T, PAL.rot3);
  }
  if (edgeL) b.vline(0, 0, T, PAL.ink);
  if (edgeR) b.vline(T - 1, 0, T, PAL.ink);
}

function eave(b: PixBuf, edgeL: boolean, edgeR: boolean) {
  roof(b, edgeL, edgeR);
  b.rect(0, 10, T, 6, null);
  b.hline(0, 9, T, PAL.ink).hline(0, 10, T, PAL.rot1);
  b.rect(0, 11, T, 5, PAL.creme);
  b.hline(0, 11, T, PAL.braun4);
  if (edgeL) b.vline(0, 9, 7, PAL.ink);
  if (edgeR) b.vline(T - 1, 9, 7, PAL.ink);
}

function wall(b: PixBuf, edgeL: boolean, edgeR: boolean) {
  b.rect(0, 0, T, T, PAL.creme);
  speckle(b, 21, [PAL.braun4], 0.05);
  b.hline(0, T - 2, T, PAL.braun3).hline(0, T - 1, T, PAL.ink);
  if (edgeL) b.vline(0, 0, T, PAL.ink);
  if (edgeR) b.vline(T - 1, 0, T, PAL.ink);
}

function tree(part: 'tl' | 'tr' | 'bl' | 'br'): (b: PixBuf) => void {
  const big = new PixBuf(32, 32);
  big.disc(15.5, 12, 11, PAL.gruen1);
  big.disc(15.5, 11, 10, PAL.gruen2);
  big.disc(13, 8, 6, PAL.gruen3);
  big.disc(11, 6, 2.5, PAL.gruen4);
  const r = rng(7);
  for (let i = 0; i < 30; i++) {
    const x = Math.floor(r() * 22) + 5;
    const y = Math.floor(r() * 18) + 3;
    if (big.get(x, y) === PAL.gruen2) big.set(x, y, PAL.gruen1);
  }
  big.rect(13, 21, 6, 9, PAL.braun2).vline(13, 21, 9, PAL.braun1).vline(18, 21, 9, PAL.braun1);
  big.hline(12, 30, 8, PAL.braun1);
  const withOutline = big.outline(PAL.ink);
  const ox = part.endsWith('r') ? 16 : 0;
  const oy = part.startsWith('b') ? 16 : 0;
  const piece = withOutline.crop(ox, oy, 16, 16);
  return (b) => b.blit(piece);
}

const FLOWER_ROWS = rows(`
  ................
  ..r.......y.....
  .rwr.....ywy....
  ..r..g....y.....
  ..g..g....g..r..
  ..g.......g.rwr.
  ...............r.
  ....y........g..
  ...ywy.......g..
  ....y...r.......
  ....g..rwr......
  ....g...r.......
  ........g.......
  ................
  ................
  ................`);

export const TILES: TileDef[] = [
  { id: 'leer', layer: 'ground', solid: true, draw: (b) => b.rect(0, 0, T, T, PAL.ink) },
  { id: 'gras', layer: 'ground', draw: (b) => grass(b, 1) },
  { id: 'gras2', layer: 'ground', draw: (b) => grass(b, 2) },
  { id: 'weg', layer: 'ground', draw: (b) => path(b, 5) },
  { id: 'weg2', layer: 'ground', draw: (b) => path(b, 6) },
  {
    id: 'blumen',
    layer: 'ground',
    draw: (b) => {
      grass(b, 3);
      b.grid(FLOWER_ROWS, { r: PAL.rot3, y: PAL.gelb, w: PAL.weiss, g: PAL.gruen1 });
    },
  },
  {
    id: 'strasse',
    layer: 'ground',
    draw: (b) => {
      b.rect(0, 0, T, T, PAL.grau2);
      speckle(b, 31, [PAL.grau1, PAL.grau3], 0.08);
    },
  },
  {
    id: 'strasse_mitte',
    layer: 'ground',
    draw: (b) => {
      b.rect(0, 0, T, T, PAL.grau2);
      speckle(b, 32, [PAL.grau1, PAL.grau3], 0.08);
      b.rect(2, 7, 6, 2, PAL.weiss).rect(10, 7, 5, 2, PAL.weiss);
    },
  },
  { id: 'dielen', layer: 'ground', draw: planks },
  {
    id: 'teppich',
    layer: 'ground',
    draw: (b) => {
      // nahtlos kachelbar, damit mehrere Kacheln einen großen Teppich ergeben
      b.rect(0, 0, T, T, PAL.blau2);
      for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) if ((x + y) % 8 === 0 || (x - y + 16) % 8 === 0) b.set(x, y, PAL.blau3);
      b.set(4, 0, PAL.gelb).set(12, 8, PAL.gelb).set(4, 8, PAL.gelb).set(12, 0, PAL.gelb);
    },
  },
  {
    id: 'innenwand',
    layer: 'ground',
    solid: true,
    draw: (b) => {
      b.rect(0, 0, T, T, PAL.creme);
      for (let x = 2; x < T; x += 4) b.vline(x, 0, 12, PAL.gelb);
      b.rect(0, 12, T, 4, PAL.braun2);
      b.hline(0, 12, T, PAL.braun1).hline(0, 15, T, PAL.ink);
    },
  },
  {
    id: 'fussmatte',
    layer: 'ground',
    draw: (b) => {
      planks(b);
      b.rect(2, 4, 12, 9, PAL.rot2).frame(2, 4, 12, 9, PAL.rot1);
      for (let x = 4; x < 12; x += 2) b.vline(x, 6, 5, PAL.rot3);
    },
  },
  // --- Außen-Deko ---
  { id: 'baum_ol', layer: 'deco', solid: true, draw: tree('tl') },
  { id: 'baum_or', layer: 'deco', solid: true, draw: tree('tr') },
  { id: 'baum_ul', layer: 'deco', solid: true, draw: tree('bl') },
  { id: 'baum_ur', layer: 'deco', solid: true, draw: tree('br') },
  {
    id: 'busch',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      const s = new PixBuf(T, T);
      s.disc(7.5, 9, 6.5, PAL.gruen2).disc(6, 7, 3.5, PAL.gruen3).disc(5, 6, 1.2, PAL.gruen4);
      s.set(10, 11, PAL.gruen1).set(9, 12, PAL.gruen1).set(11, 9, PAL.gruen1);
      b.blit(s.outline(PAL.ink));
    },
  },
  {
    id: 'zaun',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 5, T, 2, PAL.braun4).rect(0, 10, T, 2, PAL.braun4);
      b.hline(0, 7, T, PAL.braun2).hline(0, 12, T, PAL.braun2);
      for (const x of [2, 12]) b.rect(x, 2, 3, 13, PAL.braun4).vline(x + 2, 2, 13, PAL.braun2).frame(x, 2, 3, 13, PAL.ink);
    },
  },
  { id: 'dach_l', layer: 'deco', solid: true, draw: (b) => roof(b, true, false) },
  { id: 'dach_m', layer: 'deco', solid: true, draw: (b) => roof(b, false, false) },
  { id: 'dach_r', layer: 'deco', solid: true, draw: (b) => roof(b, false, true) },
  { id: 'traufe_l', layer: 'deco', solid: true, draw: (b) => eave(b, true, false) },
  { id: 'traufe_m', layer: 'deco', solid: true, draw: (b) => eave(b, false, false) },
  { id: 'traufe_r', layer: 'deco', solid: true, draw: (b) => eave(b, false, true) },
  { id: 'wand_l', layer: 'deco', solid: true, draw: (b) => wall(b, true, false) },
  { id: 'wand_m', layer: 'deco', solid: true, draw: (b) => wall(b, false, false) },
  { id: 'wand_r', layer: 'deco', solid: true, draw: (b) => wall(b, false, true) },
  {
    id: 'fenster',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      wall(b, false, false);
      b.rect(3, 2, 10, 9, PAL.blau3).frame(2, 1, 12, 11, PAL.ink);
      b.vline(7, 2, 9, PAL.weiss).hline(3, 6, 10, PAL.weiss);
      b.set(4, 3, PAL.blau4).set(5, 3, PAL.blau4).set(4, 4, PAL.blau4);
      b.hline(2, 12, 12, PAL.braun3);
    },
  },
  {
    id: 'tuer',
    layer: 'deco',
    draw: (b) => {
      wall(b, false, false);
      b.rect(3, 1, 10, 15, PAL.braun2).frame(3, 1, 10, 15, PAL.ink);
      b.rect(5, 3, 6, 4, PAL.braun3).rect(5, 9, 6, 5, PAL.braun3);
      b.set(11, 9, PAL.gelb);
    },
  },
  {
    id: 'schild',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(7, 9, 2, 7, PAL.braun2).vline(7, 9, 7, PAL.braun1);
      b.rect(2, 2, 12, 8, PAL.braun4).frame(2, 2, 12, 8, PAL.ink);
      b.hline(4, 4, 8, PAL.braun2).hline(4, 6, 6, PAL.braun2);
    },
  },
  {
    id: 'briefkasten',
    layer: 'deco',
    solid: true,
    info: 'Ein gelber Briefkasten. „Leerung: 17:00 Uhr".',
    draw: (b) => {
      b.rect(7, 10, 2, 6, PAL.grau1);
      b.rect(3, 2, 10, 9, PAL.gelb).frame(3, 2, 10, 9, PAL.ink);
      b.hline(4, 3, 8, PAL.creme);
      b.rect(5, 5, 6, 1, PAL.ink);
      b.rect(6, 7, 4, 2, PAL.blau1);
    },
  },
  {
    id: 'verteilerkasten',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(2, 3, 12, 12, PAL.grau3).frame(2, 3, 12, 12, PAL.ink);
      b.hline(3, 4, 10, PAL.grau4).vline(3, 4, 10, PAL.grau4);
      b.vline(8, 4, 10, PAL.grau2);
      b.rect(6, 8, 1, 2, PAL.grau1).rect(9, 8, 1, 2, PAL.grau1);
      b.rect(4, 11, 3, 1, PAL.grau2);
      b.hline(1, 15, 14, PAL.grau1);
    },
  },
  {
    id: 'antenne',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.vline(7, 2, 14, PAL.grau2).vline(8, 2, 14, PAL.grau1);
      for (const [y, w] of [[3, 10], [6, 8], [9, 6]] as const) b.hline(8 - w / 2, y, w, PAL.grau3);
      b.set(7, 1, PAL.rot3).set(8, 1, PAL.rot3);
      b.rect(5, 14, 6, 2, PAL.grau1);
    },
  },
  {
    id: 'taubenschlag_o',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      for (let y = 4; y < T; y++) {
        const inset = Math.max(0, 8 - (y - 4) * 2);
        b.hline(inset, y, T - 2 * inset, PAL.rot2);
      }
      b.hline(0, 15, T, PAL.rot1);
      b.rect(6, 1, 4, 4, PAL.braun3).frame(6, 1, 4, 4, PAL.ink);
    },
  },
  {
    id: 'taubenschlag_u',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(1, 0, 14, 16, PAL.braun3).frame(1, 0, 14, 16, PAL.ink);
      for (let x = 3; x < 14; x += 3) b.vline(x, 1, 14, PAL.braun2);
      b.rect(4, 3, 3, 3, PAL.ink).rect(9, 3, 3, 3, PAL.ink);
      b.rect(10, 9, 3, 4, PAL.grau1).rect(11, 10, 1, 1, PAL.netzPaket);
    },
  },
  // --- Innen-Deko ---
  {
    id: 'bett_o',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(1, 2, 14, 14, PAL.braun2).frame(1, 2, 14, 14, PAL.ink);
      b.rect(3, 4, 10, 6, PAL.weiss).frame(3, 4, 10, 6, PAL.grau3);
      b.rect(2, 11, 12, 5, PAL.blau2);
      b.hline(2, 11, 12, PAL.blau3);
    },
  },
  {
    id: 'bett_u',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(1, 0, 14, 14, PAL.blau2).vline(1, 0, 14, PAL.ink).vline(14, 0, 14, PAL.ink);
      for (let y = 2; y < 12; y += 4) b.hline(2, y, 12, PAL.blau3);
      b.rect(1, 13, 14, 3, PAL.braun2).frame(1, 13, 14, 3, PAL.ink);
    },
  },
  {
    id: 'schreibtisch',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 6, 16, 4, PAL.braun3).hline(0, 6, 16, PAL.braun4).hline(0, 9, 16, PAL.braun1);
      b.rect(1, 10, 2, 6, PAL.braun2).rect(13, 10, 2, 6, PAL.braun2);
    },
  },
  {
    id: 'computer',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 6, 16, 4, PAL.braun3).hline(0, 6, 16, PAL.braun4).hline(0, 9, 16, PAL.braun1);
      b.rect(1, 10, 2, 6, PAL.braun2).rect(13, 10, 2, 6, PAL.braun2);
      b.rect(3, 0, 10, 7, PAL.grau1).rect(4, 1, 8, 5, PAL.blau2);
      b.hline(5, 2, 4, PAL.blau4).hline(5, 4, 5, PAL.blau3);
      b.rect(7, 7, 2, 1, PAL.grau1);
    },
  },
  {
    id: 'kalender',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 0, T, T, null);
      b.rect(4, 1, 8, 10, PAL.weiss).frame(4, 1, 8, 10, PAL.ink);
      b.rect(5, 2, 6, 2, PAL.rot2);
      for (let y = 5; y < 10; y += 2) for (let x = 5; x < 11; x += 2) b.set(x, y, PAL.grau2);
      b.set(9, 7, PAL.rot3);
      b.set(7, 0, PAL.ink).set(8, 0, PAL.ink);
    },
  },
  {
    id: 'regal',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(1, 0, 14, 16, PAL.braun2).frame(1, 0, 14, 16, PAL.ink);
      for (const y of [5, 10]) b.hline(2, y, 12, PAL.braun1);
      const colors = [PAL.rot2, PAL.blau2, PAL.gelb, PAL.gruen2, PAL.lila2];
      let x = 2;
      for (const c of colors) {
        b.rect(x, 1, 2, 4, c);
        b.rect(x + 1, 6, 2, 4, colors[(colors.indexOf(c) + 2) % 5]);
        x += 2;
      }
      b.rect(3, 11, 4, 4, PAL.grau3).rect(9, 12, 4, 3, PAL.braun4);
    },
  },
  {
    id: 'pflanze',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      const s = new PixBuf(T, T);
      s.disc(8, 6, 4.5, PAL.gruen2).disc(6, 5, 2, PAL.gruen3);
      s.rect(5, 10, 6, 5, PAL.braun3).hline(5, 10, 6, PAL.braun4);
      b.blit(s.outline(PAL.ink));
    },
  },
  {
    id: 'paket',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(3, 6, 10, 8, PAL.braun4).frame(3, 6, 10, 8, PAL.ink);
      b.vline(8, 6, 8, PAL.braun2).hline(3, 9, 10, PAL.braun2);
      b.rect(4, 11, 3, 2, PAL.weiss);
    },
  },
  {
    id: 'innenfenster',
    layer: 'ground',
    solid: true,
    draw: (b) => {
      b.rect(0, 0, T, T, PAL.creme);
      for (let x = 2; x < T; x += 4) b.vline(x, 0, 12, PAL.gelb);
      b.rect(0, 12, T, 4, PAL.braun2).hline(0, 12, T, PAL.braun1).hline(0, 15, T, PAL.ink);
      b.rect(3, 1, 10, 9, PAL.blau4).frame(2, 0, 12, 11, PAL.braun1);
      b.vline(7, 1, 9, PAL.weiss).hline(3, 5, 10, PAL.weiss);
      b.rect(3, 7, 4, 2, PAL.gruen3).rect(8, 8, 5, 1, PAL.gruen3);
    },
  },
];

export const TILE_INDEX: Record<string, number> = Object.fromEntries(TILES.map((t, i) => [t.id, i]));

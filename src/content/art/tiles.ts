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
  // --- Erdgeschoss (Kapitel 1) ---
  {
    id: 'treppe',
    layer: 'ground',
    draw: (b) => {
      planks(b);
      for (let y = 1; y < T; y += 4) {
        b.rect(1, y, 14, 3, PAL.braun4).hline(1, y + 3, 14, PAL.braun1);
      }
      b.vline(0, 0, T, PAL.braun1).vline(15, 0, T, PAL.braun1);
    },
  },
  {
    id: 'fliesen',
    layer: 'ground',
    draw: (b) => {
      b.rect(0, 0, T, T, PAL.grau4);
      b.rect(0, 0, 8, 8, PAL.weiss).rect(8, 8, 8, 8, PAL.weiss);
      b.hline(0, 7, T, PAL.grau3).vline(7, 0, T, PAL.grau3).hline(0, 15, T, PAL.grau3).vline(15, 0, T, PAL.grau3);
    },
  },
  {
    id: 'sofa_l',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(1, 3, 15, 12, PAL.gruen2).rect(1, 3, 4, 12, PAL.gruen1);
      b.rect(5, 9, 11, 5, PAL.gruen3);
      b.frame(1, 3, 16, 12, PAL.ink).vline(5, 4, 10, PAL.ink);
      b.rect(2, 15, 2, 1, PAL.braun1);
    },
  },
  {
    id: 'sofa_r',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 3, 15, 12, PAL.gruen2).rect(11, 3, 4, 12, PAL.gruen1);
      b.rect(0, 9, 11, 5, PAL.gruen3);
      b.frame(-1, 3, 16, 12, PAL.ink).vline(10, 4, 10, PAL.ink);
      b.rect(12, 15, 2, 1, PAL.braun1);
    },
  },
  {
    id: 'esstisch',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 5, 16, 6, PAL.braun3).hline(0, 5, 16, PAL.braun4).hline(0, 10, 16, PAL.braun1);
      b.rect(1, 11, 2, 5, PAL.braun2).rect(13, 11, 2, 5, PAL.braun2);
    },
  },
  {
    id: 'tisch_laptop',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 5, 16, 6, PAL.braun3).hline(0, 5, 16, PAL.braun4).hline(0, 10, 16, PAL.braun1);
      b.rect(1, 11, 2, 5, PAL.braun2).rect(13, 11, 2, 5, PAL.braun2);
      b.rect(4, 0, 9, 6, PAL.grau1).rect(5, 1, 7, 4, PAL.blau2);
      b.set(8, 2, PAL.rot3).set(7, 3, PAL.rot3).set(9, 3, PAL.rot3);
      b.rect(3, 6, 11, 2, PAL.grau3);
    },
  },
  {
    id: 'kueche',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 4, 16, 12, PAL.weiss).hline(0, 4, 16, PAL.grau3).rect(0, 5, 16, 2, PAL.grau2);
      b.frame(2, 9, 5, 6, PAL.grau3).frame(9, 9, 5, 6, PAL.grau3);
      b.disc(4.5, 5.5, 1.5, PAL.ink).disc(11.5, 5.5, 1.5, PAL.ink);
      b.hline(0, 15, 16, PAL.ink);
    },
  },
  {
    id: 'kuehlschrank',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(2, 0, 12, 16, PAL.weiss).frame(2, 0, 12, 16, PAL.ink);
      b.hline(3, 6, 10, PAL.grau3).vline(11, 2, 3, PAL.grau2).vline(11, 8, 4, PAL.grau2);
      b.rect(5, 9, 3, 3, PAL.gelb).rect(4, 2, 2, 2, PAL.rot3);
    },
  },
  {
    id: 'fernseher',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(1, 2, 14, 9, PAL.ink).rect(2, 3, 12, 7, PAL.grau1);
      b.set(4, 4, PAL.grau2).set(5, 4, PAL.grau2);
      b.rect(3, 11, 10, 5, PAL.braun2).hline(3, 11, 10, PAL.braun3);
    },
  },
  {
    id: 'router',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(3, 6, 10, 5, PAL.weiss).frame(3, 6, 10, 5, PAL.ink);
      b.vline(5, 2, 4, PAL.grau1).vline(10, 2, 4, PAL.grau1);
      b.set(5, 8, PAL.gruen3).set(7, 8, PAL.gruen3).set(9, 8, PAL.rot3).set(11, 8, PAL.grau3);
      b.hline(4, 11, 8, PAL.braun1);
    },
  },
  // --- Briefzentrum ---
  {
    id: 'beton',
    layer: 'ground',
    draw: (b) => {
      b.rect(0, 0, T, T, PAL.grau3);
      speckle(b, 41, [PAL.grau2, PAL.grau4], 0.08);
      b.hline(0, 15, T, PAL.grau2).vline(15, 0, T, PAL.grau2);
    },
  },
  {
    id: 'hallenwand',
    layer: 'ground',
    solid: true,
    draw: (b) => {
      b.rect(0, 0, T, T, PAL.grau2);
      for (let y = 2; y < 12; y += 3) b.hline(0, y, T, PAL.grau1);
      b.rect(0, 12, T, 4, PAL.gelb);
      for (let x = 0; x < T; x += 4) b.rect(x, 12, 2, 4, PAL.ink);
    },
  },
  {
    id: 'band',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 4, 16, 9, PAL.ink).rect(0, 5, 16, 7, PAL.grau1);
      for (let x = 1; x < 16; x += 4) b.vline(x, 5, 7, PAL.grau2);
      b.rect(2, 13, 2, 3, PAL.grau2).rect(12, 13, 2, 3, PAL.grau2);
      b.rect(5, 6, 6, 4, PAL.weiss).frame(5, 6, 6, 4, PAL.grau3);
    },
  },
  {
    id: 'fach',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 0, 16, 16, PAL.blau1);
      for (const [x, y] of [[1, 1], [8, 1], [1, 8], [8, 8]] as const) {
        b.rect(x, y, 7, 6, PAL.ink);
        b.rect(x + 1, y + 2, 5, 4, PAL.weiss);
      }
      b.frame(0, 0, 16, 16, PAL.ink);
    },
  },
  {
    id: 'briefkiste',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(1, 6, 14, 9, PAL.gelb).frame(1, 6, 14, 9, PAL.ink);
      for (let x = 3; x < 14; x += 3) b.rect(x, 3, 2, 5, x % 2 ? PAL.weiss : PAL.creme).frame(x, 3, 2, 5, PAL.grau3);
      b.hline(2, 10, 12, PAL.orange);
    },
  },
  {
    id: 'maschine_l',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 0, 16, 16, PAL.grau4).frame(0, 0, 17, 16, PAL.ink);
      b.rect(2, 2, 10, 6, PAL.ink).rect(3, 3, 8, 4, PAL.gruen1);
      b.hline(4, 4, 5, PAL.netzDefekt);
      b.rect(2, 10, 3, 3, PAL.rot3).rect(7, 10, 3, 3, PAL.gruen3);
    },
  },
  {
    id: 'maschine_r',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 0, 16, 16, PAL.grau4).frame(-1, 0, 17, 16, PAL.ink);
      for (let y = 2; y < 14; y += 3) b.hline(2, y, 12, PAL.grau2);
      b.rect(10, 11, 4, 4, PAL.gelb);
    },
  },
  {
    id: 'tor',
    layer: 'ground',
    draw: (b) => {
      b.rect(0, 0, T, T, PAL.grau3);
      for (let x = -16; x < 16; x += 6) for (let y = 0; y < T; y++) b.set(x + y, y, PAL.gelb).set(x + y + 1, y, PAL.gelb).set(x + y + 2, y, PAL.gelb);
    },
  },
  // --- Außen, Kapitel 1 ---
  {
    id: 'postauto_l',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      const s = new PixBuf(T, T);
      s.rect(1, 3, 15, 10, PAL.gelb).rect(2, 4, 6, 4, PAL.blau4);
      s.hline(1, 9, 15, PAL.orange);
      s.disc(5, 13, 2.5, PAL.ink).disc(5, 13, 1, PAL.grau3);
      b.blit(s.outline(PAL.ink));
    },
  },
  {
    id: 'postauto_r',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      const s = new PixBuf(T, T);
      s.rect(0, 1, 14, 12, PAL.gelb);
      s.hline(0, 9, 14, PAL.orange);
      s.rect(4, 3, 6, 4, PAL.orange).rect(5, 4, 4, 2, PAL.gelb);
      s.disc(10, 13, 2.5, PAL.ink).disc(10, 13, 1, PAL.grau3);
      b.blit(s.outline(PAL.ink));
    },
  },
  // --- Kapitel 1, M2a: Kabelitz/Dorfplatz ---
  {
    id: 'gully',
    layer: 'ground',
    draw: (b) => {
      path(b, 7);
      b.rect(2, 3, 12, 10, PAL.grau1).frame(2, 3, 12, 10, PAL.ink);
      for (let x = 4; x < 13; x += 2) b.vline(x, 4, 8, PAL.ink);
      b.set(9, 9, PAL.gelb);
    },
  },
  {
    id: 'pflaster',
    layer: 'ground',
    draw: (b) => {
      b.rect(0, 0, T, T, PAL.grau3);
      for (let y = 0; y < T; y += 4) {
        b.hline(0, y + 3, T, PAL.grau2);
        const off = (y / 4) % 2 ? 0 : 3;
        for (let x = off; x < T; x += 6) b.vline(x, y, 3, PAL.grau2);
      }
      speckle(b, 51, [PAL.grau4], 0.05);
    },
  },
  {
    id: 'transporter_l',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      const s = new PixBuf(T, T);
      s.rect(1, 3, 15, 10, PAL.weiss).rect(2, 4, 6, 4, PAL.blau4).hline(1, 9, 15, PAL.orange);
      s.disc(5, 13, 2.5, PAL.ink).disc(5, 13, 1, PAL.grau3);
      b.blit(s.outline(PAL.ink));
    },
  },
  {
    id: 'transporter_r',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      const s = new PixBuf(T, T);
      s.rect(0, 1, 14, 12, PAL.weiss).hline(0, 9, 14, PAL.orange);
      s.rect(3, 3, 8, 3, PAL.blau2);
      s.disc(10, 13, 2.5, PAL.ink).disc(10, 13, 1, PAL.grau3);
      b.blit(s.outline(PAL.ink));
    },
  },
  {
    id: 'sandkasten',
    layer: 'ground',
    draw: (b) => {
      b.rect(0, 0, T, T, PAL.braun3);
      b.rect(1, 1, 14, 14, PAL.gelb);
      speckle(b, 61, [PAL.braun4, PAL.creme], 0.15);
      b.frame(0, 0, 16, 16, PAL.braun2);
    },
  },
  {
    id: 'ladestation',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(3, 6, 10, 8, PAL.grau4).frame(3, 6, 10, 8, PAL.ink);
      b.rect(5, 8, 6, 2, PAL.grau1).set(7, 11, PAL.gruen3).set(8, 11, PAL.gruen3);
      b.hline(2, 14, 12, PAL.grau2);
    },
  },
  {
    id: 'kabelschacht',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(2, 4, 12, 10, PAL.grau2).frame(2, 4, 12, 10, PAL.ink);
      b.rect(4, 6, 8, 6, PAL.ink);
      b.hline(5, 8, 6, PAL.netzKabel).hline(5, 10, 4, PAL.netzFunk);
    },
  },
  {
    id: 'laterne',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.vline(7, 5, 11, PAL.grau1).vline(8, 5, 11, PAL.ink);
      b.rect(5, 1, 6, 5, PAL.gelb).frame(5, 1, 6, 5, PAL.ink);
      b.rect(5, 15, 6, 1, PAL.ink);
    },
  },
  {
    id: 'bank',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(1, 5, 14, 3, PAL.braun3).rect(1, 9, 14, 3, PAL.braun3);
      b.hline(1, 8, 14, PAL.braun1).hline(1, 12, 14, PAL.braun1);
      b.rect(2, 12, 2, 4, PAL.grau1).rect(12, 12, 2, 4, PAL.grau1);
    },
  },
  {
    id: 'museumsschild',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(7, 10, 2, 6, PAL.braun1);
      b.rect(1, 2, 14, 9, PAL.blau1).frame(1, 2, 14, 9, PAL.ink);
      b.hline(3, 4, 10, PAL.gelb).hline(3, 6, 7, PAL.weiss).hline(3, 8, 9, PAL.weiss);
    },
  },
  // --- Museum ---
  {
    id: 'parkett',
    layer: 'ground',
    draw: (b) => {
      b.rect(0, 0, T, T, PAL.braun2);
      for (let y = 0; y < T; y += 4) for (let x = (y / 4) % 2 ? 0 : 4; x < T; x += 8) b.rect(x, y, 4, 4, PAL.braun3);
      b.hline(0, 15, T, PAL.braun1);
    },
  },
  {
    id: 'museumswand',
    layer: 'ground',
    solid: true,
    draw: (b) => {
      b.rect(0, 0, T, T, PAL.lila1);
      for (let x = 0; x < T; x += 4) b.vline(x, 0, 12, PAL.lila2);
      b.rect(0, 12, T, 4, PAL.braun1).hline(0, 12, T, PAL.gelb);
    },
  },
  {
    id: 'bilderrahmen',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(3, 1, 10, 9, PAL.gelb).rect(4, 2, 8, 7, PAL.creme);
      b.disc(8, 5, 2, PAL.haut2).rect(6, 7, 5, 2, PAL.ink);
    },
  },
  ...(['rechenuhr', 'pascaline', 'leibniz', 'lovelace', 'turing', 'neumann'] as const).map(
    (motiv): TileDef => ({
      id: `vitrine_${motiv}`,
      layer: 'deco',
      solid: true,
      draw: (b) => {
        b.rect(1, 9, 14, 7, PAL.braun1).frame(1, 9, 14, 7, PAL.ink);
        b.rect(2, 1, 12, 9, PAL.blau4).frame(2, 1, 12, 9, PAL.grau2);
        b.set(3, 2, PAL.weiss).set(4, 2, PAL.weiss).set(3, 3, PAL.weiss);
        if (motiv === 'rechenuhr') b.rect(5, 4, 6, 5, PAL.braun3).disc(8, 6, 1.5, PAL.gelb);
        if (motiv === 'pascaline') b.rect(4, 5, 8, 4, PAL.gelb).disc(6, 7, 1, PAL.ink).disc(10, 7, 1, PAL.ink);
        if (motiv === 'leibniz') b.rect(5, 3, 6, 6, PAL.creme).hline(6, 4, 1, PAL.ink).hline(8, 4, 2, PAL.ink).hline(6, 6, 2, PAL.ink).hline(9, 6, 1, PAL.ink);
        if (motiv === 'lovelace') b.rect(5, 4, 6, 5, PAL.rot2).vline(8, 4, 5, PAL.gelb);
        if (motiv === 'turing') for (let x = 3; x < 13; x += 2) b.rect(x, 6, 1, 2, x % 4 === 1 ? PAL.ink : PAL.weiss).hline(3, 5, 10, PAL.grau2);
        if (motiv === 'neumann') b.frame(4, 3, 3, 3, PAL.ink).frame(9, 3, 3, 3, PAL.ink).frame(6, 6, 4, 3, PAL.ink);
        b.rect(5, 11, 6, 2, PAL.gelb);
      },
    }),
  ),
  {
    id: 'z3_l',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 0, 16, 16, PAL.grau2).frame(0, 0, 17, 16, PAL.ink);
      for (let y = 2; y < 14; y += 3) for (let x = 2; x < 15; x += 3) b.rect(x, y, 2, 2, (x + y) % 2 ? PAL.gelb : PAL.grau1);
    },
  },
  {
    id: 'z3_r',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 0, 16, 16, PAL.grau2).frame(-1, 0, 17, 16, PAL.ink);
      b.rect(2, 2, 12, 6, PAL.ink);
      for (let x = 3; x < 13; x += 2) b.set(x, 4, x % 3 ? PAL.rot3 : PAL.gruen3);
      b.rect(3, 10, 10, 4, PAL.grau4).hline(4, 12, 8, PAL.grau1);
    },
  },
  {
    id: 'fernschreiber',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(1, 6, 14, 9, PAL.gruen1).frame(1, 6, 14, 9, PAL.ink);
      b.rect(3, 11, 10, 3, PAL.grau1);
      for (let x = 4; x < 12; x += 2) b.set(x, 12, PAL.grau4);
      b.rect(4, 1, 8, 6, PAL.creme).frame(4, 1, 8, 6, PAL.grau2);
      b.hline(5, 3, 5, PAL.grau2).hline(5, 5, 3, PAL.grau2);
    },
  },
  {
    id: 'archivtuer',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(1, 0, 14, 16, PAL.braun1).frame(1, 0, 14, 16, PAL.ink);
      b.rect(2, 2, 12, 4, PAL.ink);
      for (let i = 0; i < 8; i++) b.set(3 + i + (i > 3 ? 1 : 0), 3, i % 3 === 0 ? PAL.gelb : PAL.grau1).set(3 + i + (i > 3 ? 1 : 0), 4, PAL.grau1);
      b.rect(6, 9, 4, 4, PAL.grau3).set(8, 11, PAL.ink);
    },
  },
  {
    id: 'pixelwand',
    layer: 'ground',
    solid: true,
    draw: (b) => {
      b.rect(0, 0, T, T, PAL.lila1);
      b.rect(1, 1, 14, 10, PAL.weiss).frame(1, 1, 14, 10, PAL.ink);
      for (let y = 2; y < 10; y += 2) for (let x = 2; x < 14; x += 2) if ((x * 3 + y) % 5 < 2) b.rect(x, y, 2, 2, PAL.ink);
      b.rect(0, 12, T, 4, PAL.braun1).hline(0, 12, T, PAL.gelb);
    },
  },
  {
    id: 'pult',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(2, 5, 12, 5, PAL.braun3).hline(2, 5, 12, PAL.braun4).frame(2, 5, 12, 5, PAL.ink);
      b.rect(4, 6, 8, 3, PAL.creme);
      b.rect(3, 10, 2, 6, PAL.braun1).rect(11, 10, 2, 6, PAL.braun1);
    },
  },
  // --- Kapitel 1, M2b: Dorfladen und Dorffest ---
  {
    id: 'ladenregal',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 1, 16, 15, PAL.braun2).frame(0, 1, 16, 15, PAL.ink);
      for (const y of [5, 10]) b.hline(1, y, 14, PAL.braun1);
      const farben = [PAL.rot3, PAL.gelb, PAL.blau3, PAL.gruen3, PAL.orange, PAL.weiss];
      for (let i = 0; i < 6; i++) {
        b.rect(2 + i * 2, 2, 2, 3, farben[i]);
        b.rect(2 + i * 2, 7, 2, 3, farben[(i + 3) % 6]);
        b.rect(2 + i * 2, 11, 2, 4, farben[(i + 1) % 6]);
      }
    },
  },
  {
    id: 'kasse',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 7, 16, 9, PAL.braun3).hline(0, 7, 16, PAL.braun4).frame(0, 7, 16, 9, PAL.ink);
      b.rect(3, 1, 9, 6, PAL.grau1).rect(4, 2, 7, 3, PAL.gruen4);
      b.rect(12, 4, 3, 3, PAL.grau2).rect(12, 3, 3, 1, PAL.blau4);
    },
  },
  {
    id: 'pfandautomat',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(2, 0, 12, 16, PAL.gruen2).frame(2, 0, 12, 16, PAL.ink);
      b.rect(4, 2, 8, 4, PAL.ink).disc(8, 4, 1.5, PAL.grau3);
      b.rect(4, 8, 8, 2, PAL.grau4).rect(5, 12, 6, 2, PAL.weiss);
      b.set(11, 9, PAL.rot3);
    },
  },
  {
    id: 'karren_l',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      const s = new PixBuf(T, T);
      s.rect(1, 3, 15, 8, PAL.braun3).hline(1, 3, 15, PAL.braun4);
      for (let x = 2; x < 16; x += 4) s.rect(x, 1, 3, 2, [PAL.rot3, PAL.gelb, PAL.blau3, PAL.gruen3][x % 4]);
      s.disc(5, 12, 3, PAL.braun1).disc(5, 12, 1, PAL.gelb);
      b.blit(s.outline(PAL.ink));
    },
  },
  {
    id: 'karren_r',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      const s = new PixBuf(T, T);
      s.rect(0, 3, 12, 8, PAL.braun3).hline(0, 3, 12, PAL.braun4);
      s.rect(2, 0, 6, 3, PAL.lila2);
      s.disc(9, 12, 3, PAL.braun1).disc(9, 12, 1, PAL.gelb);
      s.hline(12, 6, 4, PAL.braun1);
      b.blit(s.outline(PAL.ink));
    },
  },
  {
    id: 'buehne',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 5, 16, 11, PAL.braun2).hline(0, 5, 16, PAL.braun4);
      for (let x = 0; x < 16; x += 4) b.vline(x, 6, 10, PAL.braun1);
      b.rect(0, 0, 16, 5, PAL.rot2);
      for (let x = 1; x < 16; x += 3) b.vline(x, 0, 5, PAL.rot1);
    },
  },
  {
    id: 'kuchenstand',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 0, 16, 4, PAL.weiss);
      for (let x = 0; x < 16; x += 4) b.rect(x, 0, 2, 4, PAL.rot3);
      b.rect(1, 8, 14, 8, PAL.braun3).frame(1, 8, 14, 8, PAL.ink);
      b.disc(5, 7, 2.5, PAL.braun4).rect(3, 6, 5, 1, PAL.rot3).disc(11, 7, 2.5, PAL.creme);
    },
  },
  {
    id: 'wimpel',
    layer: 'deco',
    draw: (b) => {
      b.hline(0, 2, 16, PAL.grau1);
      const f = [PAL.rot3, PAL.gelb, PAL.blau3, PAL.gruen3];
      for (let i = 0; i < 4; i++) for (let y = 0; y < 4; y++) b.hline(i * 4 + y / 2, 3 + y, 4 - y, f[i]);
    },
  },
  // --- Kapitel 2: Knotenburg und Gymnasium ---
  {
    id: 'bushalt',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.vline(7, 6, 10, PAL.grau1).vline(8, 6, 10, PAL.grau2);
      b.disc(7.5, 4.5, 4.5, PAL.gelb).disc(7.5, 4.5, 3.5, PAL.gruen2);
      b.vline(6, 2, 5, PAL.gelb).vline(9, 2, 5, PAL.gelb).hline(6, 4, 4, PAL.gelb);
      b.rect(5, 15, 6, 1, PAL.ink);
    },
  },
  {
    id: 'spind',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(1, 0, 14, 16, PAL.blau2).frame(1, 0, 14, 16, PAL.ink);
      b.vline(8, 1, 14, PAL.blau1);
      for (const x of [3, 10]) b.hline(x, 3, 3, PAL.blau1).hline(x, 5, 3, PAL.blau1);
      b.set(6, 9, PAL.grau4).set(10, 9, PAL.grau4);
    },
  },
  {
    id: 'tafel',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 2, 16, 11, PAL.gruen1).frame(0, 2, 16, 11, PAL.braun2);
      b.hline(2, 5, 7, PAL.grau4).hline(2, 8, 10, PAL.grau4).set(12, 5, PAL.grau4);
      b.hline(1, 13, 14, PAL.braun3);
    },
  },
  {
    id: 'serverschrank',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(2, 0, 12, 16, PAL.grau1).frame(2, 0, 12, 16, PAL.ink);
      for (let y = 2; y < 15; y += 3) {
        b.hline(4, y, 8, PAL.grau2);
        b.set(11, y, y % 2 ? PAL.gruen4 : PAL.netzKabel);
      }
    },
  },
  {
    id: 'schulschild',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.vline(3, 9, 7, PAL.braun1).vline(12, 9, 7, PAL.braun1);
      b.rect(1, 2, 14, 8, PAL.blau2).frame(1, 2, 14, 8, PAL.ink);
      b.hline(3, 4, 10, PAL.weiss).hline(3, 6, 7, PAL.weiss);
      b.set(12, 6, PAL.gelb);
    },
  },
  {
    id: 'schulbank',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 6, 16, 5, PAL.braun3).hline(0, 6, 16, PAL.braun4).frame(0, 6, 16, 5, PAL.braun1);
      b.vline(1, 11, 5, PAL.grau1).vline(14, 11, 5, PAL.grau1);
      b.rect(4, 7, 5, 3, PAL.weiss).hline(5, 8, 3, PAL.grau3);
    },
  },
  {
    id: 'klappenschrank',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 1, 16, 15, PAL.braun2).frame(0, 1, 16, 15, PAL.braun1);
      for (let y = 3; y < 10; y += 3) for (let x = 2; x < 15; x += 3) b.rect(x, y, 2, 2, (x + y) % 2 ? PAL.gelb : PAL.ink);
      b.rect(1, 11, 14, 4, PAL.braun3);
      b.vline(4, 11, 3, PAL.rot2).vline(9, 11, 3, PAL.ink).vline(12, 11, 2, PAL.rot2);
    },
  },
  {
    id: 'relais',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(1, 0, 14, 16, PAL.grau2).frame(1, 0, 14, 16, PAL.ink);
      for (let y = 2; y < 15; y += 3) for (let x = 3; x < 13; x += 3) b.rect(x, y, 2, 2, PAL.grau4).set(x, y, PAL.ink);
    },
  },
  {
    id: 'buecherregal',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 0, 16, 16, PAL.braun2).frame(0, 0, 16, 16, PAL.braun1);
      const f = [PAL.rot2, PAL.blau2, PAL.gruen2, PAL.gelb, PAL.lila2, PAL.orange];
      for (const y of [1, 6, 11]) {
        for (let x = 1; x < 15; x += 2) b.rect(x, y, 2, 4, f[(x + y) % f.length]);
        b.hline(1, y + 4, 14, PAL.braun1);
      }
    },
  },
  {
    id: 'lesetisch',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 5, 16, 6, PAL.braun3).hline(0, 5, 16, PAL.braun4).frame(0, 5, 16, 6, PAL.braun1);
      b.rect(2, 11, 2, 5, PAL.braun2).rect(12, 11, 2, 5, PAL.braun2);
      b.rect(5, 6, 6, 3, PAL.creme).vline(8, 6, 3, PAL.grau3);
    },
  },
  {
    id: 'backstand',
    layer: 'deco',
    solid: true,
    draw: (b) => {
      b.rect(0, 0, 16, 4, PAL.braun4);
      for (let x = 0; x < 16; x += 4) b.rect(x, 0, 2, 4, PAL.braun2);
      b.rect(1, 8, 14, 8, PAL.braun3).frame(1, 8, 14, 8, PAL.ink);
      b.disc(4, 7, 2, PAL.braun4).disc(8, 7, 2, PAL.gelb).disc(12, 7, 2, PAL.braun4);
    },
  },
];

export const TILE_INDEX: Record<string, number> = Object.fromEntries(TILES.map((t, i) => [t.id, i]));

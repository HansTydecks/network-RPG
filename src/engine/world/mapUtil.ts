import { TILE_INDEX, TILES } from '../../content/art/tiles';
import type { MapDef } from './MapDef';

export interface ParsedMap {
  width: number;
  height: number;
  ground: number[][];
  deco: number[][]; // -1 = leer
  solid: boolean[][];
}

export function parseMap(def: MapDef): ParsedMap {
  const height = def.ground.length;
  const width = def.ground[0].length;
  const lookup = (ch: string): number => {
    if (ch === ' ') return -1;
    const id = def.legend[ch];
    if (id === undefined) throw new Error(`Karte ${def.id}: Zeichen „${ch}" fehlt in der Legende`);
    const idx = TILE_INDEX[id];
    if (idx === undefined) throw new Error(`Karte ${def.id}: Kachel „${id}" gibt es nicht`);
    return idx;
  };
  const ground = def.ground.map((row) => [...row].map(lookup));
  const deco = (def.deco ?? def.ground.map((r) => ' '.repeat(r.length))).map((row) => [...row].map(lookup));
  const solid = ground.map((row, y) =>
    row.map((g, x) => {
      const d = deco[y]?.[x] ?? -1;
      return Boolean(TILES[g]?.solid) || (d >= 0 && Boolean(TILES[d].solid));
    }),
  );
  for (const [x, y] of def.extraSolid ?? []) if (solid[y]) solid[y][x] = true;
  return { width, height, ground, deco, solid };
}

const KANTEN_ZIEL = new Set(['weg', 'weg2', 'pflaster', 'sand', 'beton']);
const GRAS = new Set(['gras', 'gras2', 'blumen']);
const WASSER = new Set(['meer', 'route']);
const LAND = new Set(['land', 'eis', 'sand', 'gras', 'gras2']);
/** Hohe Dinge, die einen Schatten auf den Boden darunter werfen. */
const WIRFT_SCHATTEN = /^(traufe|wand|fenster|tuer|innenwand|innenfenster|hallenwand|museumswand|fels|taubenschlag_u|kueche|kuehlschrank|regal|buecherregal|ladenregal|spind|serverschrank|archivtuer|klappenschrank|relais|pixelwand)/;

/**
 * Überlagerungen, die aus der Karte berechnet werden: Grasränder über Wegen
 * und weiche Schatten unter Wänden. -1 = nichts.
 */
export function ueberlagerungen(p: ParsedMap): { kanten: number[][]; schatten: number[][] } {
  const id = (x: number, y: number, ebene: 'ground' | 'deco') => {
    const i = p[ebene][y]?.[x] ?? -1;
    return i >= 0 ? TILES[i].id : null;
  };
  const oben = (x: number, y: number) => id(x, y, 'deco') ?? id(x, y, 'ground');
  const gras = (x: number, y: number) => GRAS.has(id(x, y, 'ground') ?? '');
  const land = (x: number, y: number) => LAND.has(id(x, y, 'ground') ?? '');
  const maske = (x: number, y: number, f: (x: number, y: number) => boolean) =>
    (f(x, y - 1) ? 1 : 0) | (f(x + 1, y) ? 2 : 0) | (f(x, y + 1) ? 4 : 0) | (f(x - 1, y) ? 8 : 0);
  const kanten = p.ground.map((row, y) =>
    row.map((_, x) => {
      const hier = id(x, y, 'ground') ?? '';
      const [art, m] = KANTEN_ZIEL.has(hier) ? ['kante', maske(x, y, gras)] : WASSER.has(hier) ? ['kueste', maske(x, y, land)] : ['', 0];
      return m ? TILE_INDEX[`${art}_${m}`] : -1;
    }),
  );
  const schatten = p.ground.map((row, y) =>
    row.map((_, x) => {
      if (y === 0 || WIRFT_SCHATTEN.test(oben(x, y) ?? '')) return -1;
      return WIRFT_SCHATTEN.test(oben(x, y - 1) ?? '') ? TILE_INDEX.ao_n : -1;
    }),
  );
  return { kanten, schatten };
}

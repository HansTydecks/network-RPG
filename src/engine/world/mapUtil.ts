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

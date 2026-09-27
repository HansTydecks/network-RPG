import { describe, expect, it } from 'vitest';
import { MAPS } from '../../src/content/maps';
import { MAP_IDS } from '../../src/content/registry';
import { parseMap } from '../../src/engine/world/mapUtil';
import type { Script } from '../../src/engine/script/Script';

/** Alle Stellen, an denen man eine Karte betreten kann (Warps und Script-Warps aus allen Karten). */
function eingaenge(map: string): [number, number][] {
  const out: [number, number][] = [];
  const walk = (s: Script) => {
    for (const c of s) {
      if (c.op === 'warp' && c.map === map) out.push([c.x, c.y]);
      if (c.op === 'if') {
        walk(c.then);
        walk(c.else ?? []);
      }
      if (c.op === 'choice') for (const o of c.options) walk(o.then);
    }
  };
  for (const m of Object.values(MAPS)) {
    for (const e of m.entities) {
      if (e.kind === 'warp' && e.to.map === map) out.push([e.to.x, e.to.y]);
      if ('script' in e) walk(e.script);
    }
    walk(m.onEnter ?? []);
  }
  return out;
}

describe('Erreichbarkeit', () => {
  for (const id of MAP_IDS) {
    it(`${id}: jede Figur und jeder Gegenstand ist von einem Eingang aus erreichbar`, () => {
      const def = MAPS[id];
      const p = parseMap(def);
      const solid = p.solid.map((r) => [...r]);
      // Gegenstände und Figuren blockieren – außer sie sind nur zeitweise da (z. B. eine Tür, die später verschwindet)
      for (const e of def.entities) if (((e.kind === 'interact' && e.tile) || e.kind === 'npc') && !e.visibleIf) solid[e.y][e.x] = true;
      const start = eingaenge(id);
      expect(start.length, 'Karte hat keinen Eingang').toBeGreaterThan(0);
      const seen = new Set<string>();
      const queue = start.filter(([x, y]) => !solid[y]?.[x]);
      for (const [x, y] of queue) seen.add(`${x},${y}`);
      while (queue.length) {
        const [x, y] = queue.shift()!;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= p.width || ny >= p.height || solid[ny][nx] || seen.has(`${nx},${ny}`)) continue;
          seen.add(`${nx},${ny}`);
          queue.push([nx, ny]);
        }
      }
      for (const e of def.entities) {
        const selbst = seen.has(`${e.x},${e.y}`);
        const nachbar = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => seen.has(`${e.x + dx},${e.y + dy}`));
        const name = 'id' in e ? e.id : `${e.kind} ${e.x},${e.y}`;
        if (e.kind === 'trigger') expect(selbst, `${name} nicht erreichbar`).toBe(true);
        else expect(selbst || nachbar, `${name} nicht erreichbar`).toBe(true);
      }
    });
  }
});

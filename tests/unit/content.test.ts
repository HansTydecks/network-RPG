import { describe, expect, it } from 'vitest';
import { MAPS } from '../../src/content/maps';
import { parseMap } from '../../src/engine/world/mapUtil';
import { ITEM_IDS, LEXICON_IDS, MAP_IDS, QUEST_IDS } from '../../src/content/registry';
import { ITEMS } from '../../src/content/items';
import { LEXICON } from '../../src/content/lexicon';
import { QUESTS } from '../../src/content/quests';
import { SPEAKERS } from '../../src/content/speakers';
import type { Command, Cond, Script } from '../../src/engine/script/Script';
import { KRUEMEL_LEVEL } from '../../src/minigames/kruemelLogic';
import { NETZBLICK_ERSTMALS } from '../../src/content/dialog/netzblick';
import { MINIGAME_META as MINIGAMES } from '../../src/minigames/meta';
import { TILE_INDEX } from '../../src/content/art/tiles';

/** Kapitel je Karte → höchste erlaubte Klassenstufe (Spiralcurriculum). */
const MAP_STUFE: Record<string, number> = {
  alex_zimmer: 7,
  kabelitz: 7,
  wohnzimmer: 7,
  briefzentrum: 7,
  dorfplatz: 7,
  museum: 7,
  dorfladen: 7,
  knotenburg: 8,
  gymnasium: 8,
};

/** Durchläuft ein Script und merkt sich, ab welcher Klassenstufe ein Befehl erreichbar ist ({ stufeMin } in Bedingungen). */
function* walkStufe(script: Script, stufe: number): Generator<[Command, number]> {
  for (const c of script) {
    yield [c, stufe];
    if (c.op === 'if') {
      yield* walkStufe(c.then, Math.max(stufe, stufeAus(c.cond)));
      yield* walkStufe(c.else ?? [], stufe);
    }
    if (c.op === 'choice') for (const o of c.options) yield* walkStufe(o.then, stufe);
  }
}

function stufeAus(c: Cond): number {
  if ('stufeMin' in c) return c.stufeMin;
  if ('all' in c) return Math.max(0, ...c.all.map(stufeAus));
  return 0;
}

function* walk(script: Script): Generator<Command> {
  for (const c of script) {
    yield c;
    if (c.op === 'if') {
      yield* walk(c.then);
      yield* walk(c.else ?? []);
    }
    if (c.op === 'choice') for (const o of c.options) yield* walk(o.then);
  }
}

function scriptsOf(mapId: keyof typeof MAPS): Script[] {
  const m = MAPS[mapId];
  const out: Script[] = [m.onEnter ?? []];
  for (const e of m.entities) if ('script' in e) out.push(e.script);
  return out;
}

describe('Inhalte', () => {
  it('jede Karte im Register existiert und jede Karte ist registriert', () => {
    expect(Object.keys(MAPS).sort()).toEqual([...MAP_IDS].sort());
  });

  it('Register haben Definitionen', () => {
    for (const id of ITEM_IDS) expect(ITEMS[id], id).toBeDefined();
    for (const id of LEXICON_IDS) expect(LEXICON[id], id).toBeDefined();
    for (const id of QUEST_IDS) expect(QUESTS[id], id).toBeDefined();
  });

  for (const id of MAP_IDS) {
    describe(`Karte ${id}`, () => {
      const def = MAPS[id];
      const parsed = parseMap(def);

      it('ist rechteckig und Ebenen sind gleich groß', () => {
        for (const row of def.ground) expect(row.length).toBe(parsed.width);
        if (def.deco) {
          expect(def.deco.length).toBe(parsed.height);
          for (const row of def.deco) expect(row.length).toBe(parsed.width);
        }
      });

      it('Entities liegen auf der Karte, Figuren nicht in Wänden', () => {
        for (const e of def.entities) {
          expect(e.x >= 0 && e.x < parsed.width && e.y >= 0 && e.y < parsed.height, JSON.stringify(e)).toBe(true);
          if (e.kind === 'npc' || e.kind === 'warp' || e.kind === 'trigger') expect(parsed.solid[e.y][e.x], `${e.kind} auf blockierter Kachel`).toBe(false);
        }
      });

      it('Warps führen auf begehbare Kacheln', () => {
        for (const e of def.entities) {
          if (e.kind !== 'warp') continue;
          const target = parseMap(MAPS[e.to.map]);
          expect(target.solid[e.to.y]?.[e.to.x], `Ziel ${e.to.map} ${e.to.x},${e.to.y}`).toBe(false);
        }
      });

      it('Gegenstände nutzen vorhandene Kacheln', () => {
        for (const e of def.entities) if (e.kind === 'interact' && e.tile) expect(TILE_INDEX[e.tile], e.tile).toBeDefined();
      });

      it('Kabel verlaufen waagerecht/senkrecht und verbinden bekannte Geräte', () => {
        const ids = new Set(def.net?.devices.map((d) => d.id));
        for (const c of def.net?.cables ?? []) {
          expect(ids.has(c.from) && ids.has(c.to)).toBe(true);
          for (let i = 1; i < c.path.length; i++) {
            const [ax, ay] = c.path[i - 1];
            const [bx, by] = c.path[i];
            expect(ax === bx || ay === by, `${c.from}→${c.to}`).toBe(true);
          }
        }
      });

      it('Sprecher sind bekannt und Netzbuch-Einträge passen zur Klassenstufe', () => {
        for (const s of scriptsOf(id))
          for (const [c, bedingt] of walkStufe(s, MAP_STUFE[id])) {
            if (c.op === 'say' && c.who) expect(SPEAKERS[c.who], c.who).toBeDefined();
            if (c.op === 'lexicon') expect(LEXICON[c.id].stufe, `${c.id} zu früh`).toBeLessThanOrEqual(bedingt);
            if (c.op === 'minigame') {
              const [mg, param] = c.id.split(':');
              expect(MINIGAMES[mg], `Minispiel ${c.id}`).toBeDefined();
              expect(MINIGAMES[mg].stufe, `Minispiel ${c.id} zu früh`).toBeLessThanOrEqual(bedingt);
              if (mg === 'bloecke') expect(KRUEMEL_LEVEL[param]?.stufe ?? 7, `Level ${param} zu früh`).toBeLessThanOrEqual(bedingt);
            }
            if (c.op === 'warp') expect(parseMap(MAPS[c.map]).solid[c.y][c.x], `Script-Warp ${c.map}`).toBe(false);
          }
      });
    });
  }

  it('Netzblick-Einführung nutzt nur Inhalte der Klasse 7', () => {
    for (const c of walk(NETZBLICK_ERSTMALS)) if (c.op === 'lexicon') expect(LEXICON[c.id].stufe).toBe(7);
  });
});

describe('Museum', () => {
  it('die richtige Antwort steht nicht bei jedem Exponat an derselben Stelle, jedes Exponat zeigt ein Bild', () => {
    const positionen = new Set<number>();
    for (const e of MAPS.museum.entities) {
      if (e.kind !== 'interact' || !e.id.match(/schickard|pascal|lovelace|turing|zuse$|neumann/)) continue;
      expect(e.script[0]).toMatchObject({ op: 'bild' });
      for (const c of walk(e.script)) if (c.op === 'choice') positionen.add(c.options.findIndex((o) => o.then.some((t) => t.op === 'flag')));
    }
    expect(positionen.size).toBeGreaterThan(1);
  });
});

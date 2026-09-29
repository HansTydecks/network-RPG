import { describe, expect, it } from 'vitest';
import { FLAVOR } from '../../src/content/flavor';
import { MAPS } from '../../src/content/maps';
import { FLAG_IDS, type MapId } from '../../src/content/registry';
import { opaEpilog } from '../../src/content/dialog/kapitel5';
import { runScript, type ScriptHost } from '../../src/engine/script/ScriptRunner';
import type { Script } from '../../src/engine/script/Script';
import { newGameState } from '../../src/engine/state/GameState';
import { parseMap } from '../../src/engine/world/mapUtil';
import { wanderSchritt } from '../../src/engine/world/wandern';
import { ambienteFuer } from '../../src/engine/world/ambienteLogic';
import { KONAMI, konamiErkannt } from '../../src/engine/state/geheimnisse';

function host(): ScriptHost & { toasts: string[] } {
  const toasts: string[] = [];
  const nichts = async () => {};
  return {
    state: newGameState(),
    toasts,
    say: nichts,
    choose: async () => 0,
    toast: async (t: string) => void toasts.push(t),
    itemReceived: nichts,
    questChanged: () => {},
    lexiconUnlocked: nichts,
    wait: nichts,
    warp: nichts,
    turnPlayer: () => {},
    calendar: nichts,
    save: nichts,
    interlude: nichts,
    minigame: nichts,
    faceNpc: () => {},
    refresh: () => {},
    bytesChanged: nichts,
    showBild: () => {},
  };
}

function* befehle(s: Script): Generator<Script[number]> {
  for (const c of s) {
    yield c;
    if (c.op === 'if') {
      yield* befehle(c.then);
      yield* befehle(c.else ?? []);
    }
    if (c.op === 'choice') for (const o of c.options) yield* befehle(o.then);
    if (c.op === 'zaehle') yield* befehle(c.dann ?? []);
  }
}

describe('Flavor', () => {
  it('Zähler setzt Flags der Reihe nach und löst am Ende aus', async () => {
    const h = host();
    const s: Script = [{ op: 'zaehle', praefix: 'morse', bis: 3, je: ['eins', 'Stand {n}'], dann: [{ op: 'give', item: 'morse_geschenk' }] }];
    for (let i = 0; i < 4; i++) await runScript(s, h);
    expect(h.toasts).toEqual(['eins', 'Stand 2', 'Stand 3']);
    expect(h.state.items.has('morse_geschenk')).toBe(true);
    expect(h.state.flags.has('morse_3')).toBe(true);
  });

  it('alle Zähler-Flags stehen im Register', () => {
    const flags = new Set<string>(FLAG_IDS);
    const skripte: Script[] = [opaEpilog];
    for (const m of Object.values(MAPS)) for (const e of m.entities) if ('script' in e) skripte.push(e.script);
    let gefunden = 0;
    for (const s of skripte)
      for (const c of befehle(s))
        if (c.op === 'zaehle') {
          gefunden++;
          for (let n = 1; n <= c.bis; n++) expect(flags.has(`${c.praefix}_${n}`), `${c.praefix}_${n}`).toBe(true);
        }
    expect(gefunden).toBeGreaterThanOrEqual(10);
  });

  it('acht goldene Federn an verschiedenen Orten', () => {
    const federn = Object.values(FLAVOR).flatMap((f) => (f?.entities ?? []).filter((e) => 'tile' in e && e.tile === 'goldfeder'));
    expect(federn.length).toBe(8);
    expect(new Set(federn.map((e) => ('id' in e ? e.id : ''))).size).toBe(8);
  });

  it('Opa gibt den Ring nur mit allen acht Federn', async () => {
    const h = host();
    await runScript(opaEpilog, h);
    expect(h.state.items.has('taubenring_gold')).toBe(false);
    for (let n = 1; n <= 8; n++) h.state.flags.add(`federzahl_${n}` as never);
    await runScript(opaEpilog, h);
    expect(h.state.items.has('taubenring_gold')).toBe(true);
  });

  it('Flavor-Gegenstände versperren keine Wege', () => {
    for (const [id, f] of Object.entries(FLAVOR)) {
      const def = MAPS[id as MapId];
      const p = parseMap(def);
      const flavorIds = new Set((f?.entities ?? []).map((e) => ('id' in e ? e.id : '')));
      const blockiert = (mitFlavor: boolean) => {
        const solid = p.solid.map((r) => [...r]);
        for (const e of def.entities) {
          const istFlavor = 'id' in e && flavorIds.has(e.id);
          if (istFlavor && !mitFlavor) continue;
          if (((e.kind === 'interact' && e.tile) || e.kind === 'npc') && !e.visibleIf) solid[e.y][e.x] = true;
        }
        return solid;
      };
      const erreichbar = (solid: boolean[][]) => {
        const start = def.entities.filter((e) => e.kind === 'warp').map((e) => [e.x, e.y] as [number, number]);
        const seen = new Set(start.map(([x, y]) => `${x},${y}`));
        const q = [...start];
        while (q.length) {
          const [x, y] = q.shift()!;
          for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= p.width || ny >= p.height || solid[ny][nx] || seen.has(`${nx},${ny}`)) continue;
            seen.add(`${nx},${ny}`);
            q.push([nx, ny]);
          }
        }
        return seen;
      };
      const ohne = erreichbar(blockiert(false));
      const mit = erreichbar(blockiert(true));
      const eigene = new Set((f?.entities ?? []).map((e) => `${e.x},${e.y}`));
      for (const k of ohne) if (!mit.has(k) && !eigene.has(k)) throw new Error(`${id}: Flavor versperrt ${k}`);
    }
  });

  it('herumlaufende Figuren bleiben im Radius und auf freien Feldern', () => {
    let pos = { x: 5, y: 5 };
    const frei = (x: number, y: number) => !(x === 6 && y === 5);
    for (let i = 0; i < 500; i++) {
      const d = wanderSchritt({ x: 5, y: 5 }, pos, 2, frei);
      if (!d) continue;
      const [dx, dy] = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[d];
      pos = { x: pos.x + dx, y: pos.y + dy };
      expect(Math.abs(pos.x - 5) <= 2 && Math.abs(pos.y - 5) <= 2).toBe(true);
      expect(frei(pos.x, pos.y)).toBe(true);
    }
  });

  it('Umgebungs-Effekte passen zu Ort und Tageszeit', () => {
    expect(ambienteFuer('kabelitz', true, false)).toContain('blatt');
    expect(ambienteFuer('kabelitz', true, true)).toEqual(['gluehwurm']);
    expect(ambienteFuer('island', false, false)).toEqual([]);
    expect(ambienteFuer('silberstollen', false, false)).toContain('staub');
    expect(ambienteFuer('wohnzimmer', false, false)).toEqual([]);
  });

  it('Konami-Code wird erkannt', () => {
    expect(konamiErkannt(['KeyX', ...KONAMI])).toBe(true);
    expect(konamiErkannt(KONAMI.slice(1))).toBe(false);
  });
});

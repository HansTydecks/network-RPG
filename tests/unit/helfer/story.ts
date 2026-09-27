/**
 * Story-Simulator: spielt die Handlung ohne Grafik durch. Jeder Schritt spricht eine Figur an
 * oder untersucht etwas; der Simulator prüft, ob sie gerade sichtbar ist, und führt ihr Script aus.
 * Auswahlfragen beantwortet er mit der ersten Möglichkeit, Minispiele gelten als gelöst.
 */
import { MAPS } from '../../../src/content/maps';
import { evalCond, type Script } from '../../../src/engine/script/Script';
import { runScript, type ScriptHost } from '../../../src/engine/script/ScriptRunner';
import { newGameState, type GameState } from '../../../src/engine/state/GameState';
import type { MapId } from '../../../src/content/registry';
import { KAPITEL_START } from '../../../src/content/kapitel';

export interface Protokoll {
  minispiele: string[];
  gesagt: string[];
}

export function host(state: GameState, log: Protokoll, auswahl: number[] = []): ScriptHost {
  return {
    state,
    say: async (who, text) => void log.gesagt.push(`${who ?? ''}: ${text}`),
    choose: async () => auswahl.shift() ?? 0,
    toast: async () => {},
    itemReceived: async () => {},
    questChanged: (id) => void (state.questId = id),
    lexiconUnlocked: async () => {},
    wait: async () => {},
    warp: async (map, x, y) => {
      state.mapId = map;
      state.x = x;
      state.y = y;
    },
    turnPlayer: () => {},
    calendar: async () => {},
    save: async () => {},
    interlude: async () => {},
    minigame: async (id) => void log.minispiele.push(id),
    faceNpc: () => {},
    refresh: () => {},
    bytesChanged: async () => {},
    showBild: () => {},
  };
}

export class Story {
  state = newGameState();
  log: Protokoll = { minispiele: [], gesagt: [] };

  /** Zustand wie nach dem Kalender-Code für diese Klassenstufe (inkl. Einstiegsszene). */
  async kapitel(stufe: number) {
    const k = KAPITEL_START[stufe];
    for (const i of k.items) this.state.items.add(i);
    for (const i of k.wegnehmen ?? []) this.state.items.delete(i);
    for (const f of k.flags) this.state.flags.add(f);
    for (const l of k.lexicon) this.state.lexicon.add(l);
    this.state.stufe = stufe as GameState['stufe'];
    await this.run(k.intro);
  }

  async run(script: Script, auswahl: number[] = []) {
    await runScript(script, host(this.state, this.log, auswahl));
  }

  /** Figur oder Gegenstand auf einer Karte ansprechen. */
  async an(map: MapId, id: string, auswahl: number[] = []) {
    const e = MAPS[map].entities.find((x) => 'id' in x && x.id === id);
    if (!e || !('script' in e)) throw new Error(`${map}/${id} gibt es nicht`);
    const sichtbar = e.kind === 'trigger' ? !e.activeIf || evalCond(e.activeIf, this.state) : !('visibleIf' in e) || !e.visibleIf || evalCond(e.visibleIf, this.state);
    if (!sichtbar) throw new Error(`${map}/${id} ist gerade nicht sichtbar/aktiv (Quest: ${this.state.questId})`);
    this.state.mapId = map;
    await this.run(e.script, auswahl);
    // Betreten einer Karte per Script: onEnter wie im Spiel nachholen
    const ziel = MAPS[this.state.mapId];
    if (this.state.mapId !== map && ziel.onEnter) await this.run(ziel.onEnter);
  }

  /** Karte betreten (onEnter ausführen). */
  async betrete(map: MapId) {
    this.state.mapId = map;
    if (MAPS[map].onEnter) await this.run(MAPS[map].onEnter!);
  }

  hat(flag: string) {
    return this.state.flags.has(flag as never);
  }
}

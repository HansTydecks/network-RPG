import type { ItemId, LexiconId, MapId, QuestId } from '../../content/registry';
import type { Dir, GameState } from '../state/GameState';
import { evalCond, type Script } from './Script';

/** Alles, was ein Script in der Spielwelt auslösen kann. Im Test durch eine Attrappe ersetzt. */
export interface ScriptHost {
  state: GameState;
  say(who: string | undefined, text: string): Promise<void>;
  choose(who: string | undefined, text: string | undefined, labels: string[]): Promise<number>;
  toast(text: string): Promise<void>;
  itemReceived(item: ItemId): Promise<void>;
  questChanged(id: QuestId | null): void;
  lexiconUnlocked(id: LexiconId): Promise<void>;
  wait(ms: number): Promise<void>;
  warp(map: MapId, x: number, y: number, dir: Dir): Promise<void>;
  turnPlayer(dir: Dir): void;
  calendar(): Promise<void>;
  save(): Promise<void>;
  interlude(text: string): Promise<void>;
  minigame(id: string): Promise<void>;
  faceNpc(npc: string, dir: Dir): void;
  refresh(): void;
}

export async function runScript(script: Script, host: ScriptHost): Promise<void> {
  for (const cmd of script) {
    switch (cmd.op) {
      case 'say':
        await host.say(cmd.who, cmd.text);
        break;
      case 'choice': {
        const i = await host.choose(cmd.who, cmd.text, cmd.options.map((o) => o.label));
        await runScript(cmd.options[i]?.then ?? [], host);
        break;
      }
      case 'give':
        if (!host.state.items.has(cmd.item)) {
          host.state.items.add(cmd.item);
          await host.itemReceived(cmd.item);
        }
        break;
      case 'flag':
        if (cmd.value) host.state.flags.add(cmd.flag);
        else host.state.flags.delete(cmd.flag);
        break;
      case 'if':
        await runScript(evalCond(cmd.cond, host.state) ? cmd.then : (cmd.else ?? []), host);
        break;
      case 'quest':
        host.state.questId = cmd.id;
        host.questChanged(cmd.id);
        break;
      case 'lexicon':
        if (!host.state.lexicon.has(cmd.id)) {
          host.state.lexicon.add(cmd.id);
          await host.lexiconUnlocked(cmd.id);
        }
        break;
      case 'wait':
        await host.wait(cmd.ms);
        break;
      case 'warp':
        await host.warp(cmd.map, cmd.x, cmd.y, cmd.dir);
        break;
      case 'turn':
        host.turnPlayer(cmd.dir);
        break;
      case 'toast':
        await host.toast(cmd.text);
        break;
      case 'calendar':
        await host.calendar();
        break;
      case 'save':
        await host.save();
        break;
      case 'take':
        host.state.items.delete(cmd.item);
        break;
      case 'interlude':
        await host.interlude(cmd.text);
        break;
      case 'minigame':
        await host.minigame(cmd.id);
        break;
      case 'face':
        host.faceNpc(cmd.npc, cmd.dir);
        break;
      case 'refresh':
        host.refresh();
        break;
    }
  }
}

import type { FlagId, ItemId, LexiconId, MapId, QuestId } from '../../content/registry';
import type { Dir, GameState } from '../state/GameState';

/**
 * Story-Ereignisse sind Daten: eine Liste von Befehlen, die der ScriptRunner der Reihe nach ausführt.
 * So bleiben Dialoge und Abläufe lesbar und von der Engine getrennt.
 */
export type Cond =
  | { flag: FlagId }
  | { item: ItemId }
  | { stufeMin: number }
  | { bytesMin: number }
  | { not: Cond }
  | { all: Cond[] };

export type Command =
  | { op: 'say'; who?: string; text: string }
  | { op: 'choice'; who?: string; text?: string; options: { label: string; then: Script }[] }
  | { op: 'give'; item: ItemId }
  | { op: 'flag'; flag: FlagId; value: boolean }
  | { op: 'if'; cond: Cond; then: Script; else?: Script }
  | { op: 'quest'; id: QuestId | null }
  | { op: 'lexicon'; id: LexiconId }
  | { op: 'wait'; ms: number }
  | { op: 'warp'; map: MapId; x: number; y: number; dir: Dir }
  | { op: 'turn'; dir: Dir }
  | { op: 'toast'; text: string }
  | { op: 'calendar' }
  | { op: 'save' }
  | { op: 'take'; item: ItemId }
  | { op: 'interlude'; text: string }
  | { op: 'minigame'; id: string }
  | { op: 'face'; npc: string; dir: Dir }
  | { op: 'refresh' }
  /** Zeigt ein Bild neben dem Dialog (null blendet es aus). */
  | { op: 'bild'; key: string | null }
  | { op: 'earn'; amount: number }
  | { op: 'pay'; amount: number }
  /**
   * Zähler über Flags `<praefix>_1 … <praefix>_<bis>`: setzt das nächste freie Flag,
   * zeigt `je[n-1]` (letzter Text gilt weiter, {n} = Zählerstand) und führt beim letzten Mal `dann` aus.
   */
  | { op: 'zaehle'; praefix: string; bis: number; je?: string[]; dann?: Script };

export type Script = Command[];

// Kurzschreibweisen für Inhaltsdateien
export const say = (who: string | undefined, text: string): Command => ({ op: 'say', who, text });
export const narrate = (text: string): Command => ({ op: 'say', text });
export const choice = (text: string | undefined, options: [string, Script][], who?: string): Command => ({
  op: 'choice',
  who,
  text,
  options: options.map(([label, then]) => ({ label, then })),
});
export const give = (item: ItemId): Command => ({ op: 'give', item });
export const setFlag = (flag: FlagId, value = true): Command => ({ op: 'flag', flag, value });
export const when = (cond: Cond, then: Script, otherwise?: Script): Command => ({ op: 'if', cond, then, else: otherwise });
export const quest = (id: QuestId | null): Command => ({ op: 'quest', id });
export const lexicon = (id: LexiconId): Command => ({ op: 'lexicon', id });
export const wait = (ms: number): Command => ({ op: 'wait', ms });
export const warp = (map: MapId, x: number, y: number, dir: Dir): Command => ({ op: 'warp', map, x, y, dir });
export const toast = (text: string): Command => ({ op: 'toast', text });
export const take = (item: ItemId): Command => ({ op: 'take', item });
export const interlude = (text: string): Command => ({ op: 'interlude', text });
export const minigame = (id: string): Command => ({ op: 'minigame', id });
export const earn = (amount: number): Command => ({ op: 'earn', amount });
export const pay = (amount: number): Command => ({ op: 'pay', amount });
export const bild = (key: string | null): Command => ({ op: 'bild', key });
export const zaehle = (praefix: string, bis: number, je?: string[], dann?: Script): Command => ({ op: 'zaehle', praefix, bis, je, dann });
export const faceNpc =(npc: string, dir: Dir): Command => ({ op: 'face', npc, dir });

export function evalCond(c: Cond, s: GameState): boolean {
  if ('flag' in c) return s.flags.has(c.flag);
  if ('item' in c) return s.items.has(c.item);
  if ('stufeMin' in c) return s.stufe >= c.stufeMin;
  if ('bytesMin' in c) return s.bytes >= c.bytesMin;
  if ('not' in c) return !evalCond(c.not, s);
  return c.all.every((x) => evalCond(x, s));
}

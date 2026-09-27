import type { FlagId, ItemId, LexiconId, MapId, QuestId } from '../../content/registry';

export type Dir = 'down' | 'up' | 'left' | 'right';
export const DIRS: Dir[] = ['down', 'up', 'left', 'right'];

/** Klassenstufe: 7–10, 11 steht für die Oberstufe. */
export type Stufe = 7 | 8 | 9 | 10 | 11;

export interface GameState {
  mapId: MapId;
  x: number;
  y: number;
  dir: Dir;
  stufe: Stufe;
  bytes: number;
  questId: QuestId | null;
  flags: Set<FlagId>;
  items: Set<ItemId>;
  lexicon: Set<LexiconId>;
}

export function newGameState(): GameState {
  return {
    mapId: 'alex_zimmer',
    x: 3,
    y: 3,
    dir: 'down',
    stufe: 7,
    bytes: 0,
    questId: null,
    flags: new Set(),
    items: new Set(),
    lexicon: new Set(),
  };
}

export function cloneState(s: GameState): GameState {
  return { ...s, flags: new Set(s.flags), items: new Set(s.items), lexicon: new Set(s.lexicon) };
}

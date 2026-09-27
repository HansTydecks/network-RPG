import type { GameState } from '../engine/state/GameState';

/** Tageszeit ergibt sich aus dem Fortschritt der Geschichte. */
export type Tageszeit = 'vormittag' | 'nachmittag';

export function tag(s: GameState): number {
  return s.flags.has('tag2') ? 2 : 1;
}

export function tageszeit(s: GameState): Tageszeit {
  return s.flags.has('zurueck_zuhause') ? 'nachmittag' : 'vormittag';
}

export function zeitLabel(s: GameState): string {
  if (!s.flags.has('prolog_gesehen')) return '';
  return `Tag ${tag(s)} · ${tageszeit(s) === 'nachmittag' ? 'Nachmittag' : 'Vormittag'}`;
}

/** Farbton über Außenkarten (Farbe, Deckkraft). */
export function tageszeitTint(s: GameState): [number, number] | null {
  return tageszeit(s) === 'nachmittag' ? [0xff8a30, 0.2] : null;
}

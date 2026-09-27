import type { GameState } from '../engine/state/GameState';

/** Tageszeit ergibt sich aus dem Fortschritt der Geschichte. */
export type Tageszeit = 'vormittag' | 'nachmittag' | 'nacht';

const WOCHENTAGE = ['Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

export function tag(s: GameState): number {
  if (s.flags.has('tag4')) return 4;
  if (s.flags.has('tag3')) return 3;
  return s.flags.has('tag2') ? 2 : 1;
}

export function tageszeit(s: GameState): Tageszeit {
  switch (tag(s)) {
    case 4:
      if (s.flags.has('nacht')) return 'nacht';
      return s.flags.has('lina_da') ? 'nachmittag' : 'vormittag';
    case 3:
      return s.flags.has('kvz_repariert') ? 'nachmittag' : 'vormittag';
    case 2:
      return s.flags.has('zurueck_zuhause') ? 'nachmittag' : 'vormittag';
    default:
      return 'vormittag';
  }
}

const ZEIT_NAME: Record<Tageszeit, string> = { vormittag: 'Vormittag', nachmittag: 'Nachmittag', nacht: 'Nacht' };

export function zeitLabel(s: GameState): string {
  if (!s.flags.has('prolog_gesehen')) return '';
  return `${WOCHENTAGE[tag(s) - 1]} · ${ZEIT_NAME[tageszeit(s)]}`;
}

/** Farbton über der Karte (Farbe, Deckkraft). Nachts ist es auch drinnen dunkler. */
export function tageszeitTint(s: GameState, draussen: boolean): [number, number] | null {
  const z = tageszeit(s);
  if (z === 'nacht') return [0x10144a, draussen ? 0.5 : 0.3];
  return z === 'nachmittag' && draussen ? [0xff8a30, 0.2] : null;
}

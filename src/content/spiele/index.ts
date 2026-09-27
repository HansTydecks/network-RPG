import type { SpielDef } from '../../minigames/defs';
import { KAPITEL2_SPIELE } from './kapitel2';

/** Alle Minispiele, die als Daten beschrieben sind (Kapitel 2 ab M3b und später). */
export const SPIEL_DEFS: Record<string, SpielDef> = {
  ...KAPITEL2_SPIELE,
};

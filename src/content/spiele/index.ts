import type { SpielDef } from '../../minigames/defs';
import { KAPITEL2_SPIELE } from './kapitel2';
import { KAPITEL3_SPIELE } from './kapitel3';
import { KAPITEL4_SPIELE } from './kapitel4';

/** Alle Minispiele, die als Daten beschrieben sind (Kapitel 2 ab M3b und später). */
export const SPIEL_DEFS: Record<string, SpielDef> = {
  ...KAPITEL2_SPIELE,
  ...KAPITEL3_SPIELE,
  ...KAPITEL4_SPIELE,
};

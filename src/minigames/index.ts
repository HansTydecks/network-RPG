import type { Minigame } from './base';
import { briefMinigame } from './brief';
import { sortierMinigame } from './sortieren';
import { evaMinigame } from './eva';
import { briefreiseMinigame } from './briefreise';

/** Alle Minispiele. Jedes ist in der Geschichte und später im Trainingsraum nutzbar (Metadaten: meta.ts). */
export const MINIGAMES: Record<string, Minigame> = {
  brief: briefMinigame,
  sortieren: sortierMinigame,
  eva: evaMinigame,
  briefreise: briefreiseMinigame,
};

import type { Minigame } from './base';
import { briefMinigame } from './brief';
import { sortierMinigame } from './sortieren';
import { evaMinigame } from './eva';
import { briefreiseMinigame } from './briefreise';
import { bitschlossMinigame } from './bitschloss';
import { pixelwandMinigame } from './pixelwand';
import { geheimtextMinigame } from './geheimtext';
import { fotolaborMinigame } from './fotolabor';
import { bloeckeMinigame } from './bloecke';
import { zustandMinigame } from './zustand';
import { dateienMinigame, einheitenMinigame, kabelsalatMinigame, schnellerMinigame, tabelleMinigame } from './m2b';
import { plakatMinigame } from './plakat';

/** Alle Minispiele. Jedes ist in der Geschichte und später im Trainingsraum nutzbar (Metadaten: meta.ts). */
export const MINIGAMES: Record<string, Minigame> = {
  brief: briefMinigame,
  sortieren: sortierMinigame,
  eva: evaMinigame,
  briefreise: briefreiseMinigame,
  bitschloss: bitschlossMinigame,
  pixelwand: pixelwandMinigame,
  geheimtext: geheimtextMinigame,
  fotolabor: fotolaborMinigame,
  bloecke: bloeckeMinigame,
  zustand: zustandMinigame,
  einheiten: einheitenMinigame,
  dateien: dateienMinigame,
  tabelle: tabelleMinigame,
  schneller: schnellerMinigame,
  kabelsalat: kabelsalatMinigame,
  plakat: plakatMinigame,
};

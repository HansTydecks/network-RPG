import type { MapDef } from '../../engine/world/MapDef';
import { narrate } from '../../engine/script/Script';
import { yilmazScript } from '../dialog/kapitel3';

export const netzleitstelle: MapDef = {
  id: 'netzleitstelle',
  name: 'Netzleitstelle KnotenNetz',
  outside: '#0b1030',
  legend: {
    W: 'innenwand', f: 'fliesen', M: 'fussmatte',
    B: 'grossbildschirm', C: 'computer', S: 'serverschrank', P: 'pflanze',
  },
  ground: [
    'WWWWWWWWWWWWWW',
    'ffffffffffffff',
    'ffffffffffffff',
    'ffffffffffffff',
    'ffffffffffffff',
    'ffffffffffffff',
    'ffffffffffffff',
    'ffffffffffffff',
    'ffffffMfffffff',
  ],
  deco: [
    '  BBBBBBBBBB  ',
    'S            S',
    '              ',
    '  C C    C C  ',
    '              ',
    '  C C    C C  ',
    '              ',
    'P            P',
    '              ',
  ],
  entities: [
    { kind: 'warp', x: 6, y: 8, to: { map: 'knotenburg', x: 23, y: 16, dir: 'down' } },
    { kind: 'npc', id: 'yilmaz', sprite: 'yilmaz', x: 7, y: 2, dir: 'down', script: yilmazScript },
    {
      kind: 'interact',
      id: 'wand',
      x: 6,
      y: 0,
      script: [narrate('Eine riesige Bildschirmwand: eine Karte der Region mit leuchtenden Linien. Jede Linie ist eine Leitung, jeder Punkt ein Knoten.')],
      scan: { name: 'bildschirmwand', klasse: 'Anzeige', attribute: [['zeigt', 'Netz der Region'], ['stoerungen', '0']], methoden: ['anzeigen', 'alarmieren'] },
    },
    { kind: 'interact', id: 'arbeitsplatz', x: 2, y: 3, script: [narrate('Ein Arbeitsplatz der Netzleitstelle. Zahlenkolonnen laufen über den Bildschirm: Pakete pro Sekunde.')] },
    { kind: 'interact', id: 'server_nls', x: 0, y: 1, script: [narrate('Ein Serverschrank. Dahinter liegt noch der alte Klappenschrank – als Erinnerung, sagt ein Schild.')] },
  ],
};

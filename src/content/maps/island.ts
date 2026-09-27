import type { MapDef } from '../../engine/world/MapDef';
import { narrate } from '../../engine/script/Script';
import { sigrunScript } from '../dialog/kapitel5';

export const island: MapDef = {
  id: 'island',
  name: 'Grünes Rechenzentrum Island',
  outside: '#0b1030',
  legend: { W: 'innenwand', f: 'fliesen', M: 'fussmatte', B: 'grossbildschirm', S: 'serverschrank' },
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
    ' S S S  S S S ',
    '              ',
    ' S S S  S S S ',
    '              ',
    '              ',
    '              ',
  ],
  entities: [
    { kind: 'warp', x: 6, y: 8, to: { map: 'weltkarte', x: 9, y: 2, dir: 'down' } },
    { kind: 'npc', id: 'sigrun', sprite: 'sigrun', x: 7, y: 2, dir: 'down', script: sigrunScript },
    { kind: 'interact', id: 'erdwaerme', x: 1, y: 3, script: [narrate('Kühlung mit Erdwärme und Polarluft, Strom zu 100 Prozent aus Wasserkraft. Die Server hier laufen fast klimaneutral.')] },
  ],
};

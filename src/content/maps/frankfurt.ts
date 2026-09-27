import type { MapDef } from '../../engine/world/MapDef';
import { narrate } from '../../engine/script/Script';
import { adaFrankfurt } from '../dialog/kapitel5';

export const frankfurt: MapDef = {
  id: 'frankfurt',
  name: 'Internetknoten Frankfurt',
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
    '  SS SS  SS S ',
    '              ',
    '  SS SS  SS S ',
    '              ',
    '              ',
    '              ',
  ],
  entities: [
    { kind: 'warp', x: 6, y: 8, to: { map: 'weltkarte', x: 13, y: 4, dir: 'down' } },
    { kind: 'npc', id: 'ada_ffm', sprite: 'ada', x: 7, y: 2, dir: 'down', script: adaFrankfurt },
    { kind: 'interact', id: 'racks_ffm', x: 2, y: 3, script: [narrate('Reihen über Reihen von Serverschränken. Jedes Lämpchen ist ein Netz, das hier mit anderen Daten tauscht.')] },
  ],
};

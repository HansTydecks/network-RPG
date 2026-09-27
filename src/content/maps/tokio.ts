import type { MapDef } from '../../engine/world/MapDef';
import { narrate } from '../../engine/script/Script';
import { satoScript } from '../dialog/kapitel5';

export const tokio: MapDef = {
  id: 'tokio',
  name: 'Root-Server Tokio',
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
    '    SSSSSS    ',
    '              ',
    '              ',
    '              ',
    '              ',
    '              ',
  ],
  entities: [
    { kind: 'warp', x: 6, y: 8, to: { map: 'weltkarte', x: 27, y: 5, dir: 'down' } },
    { kind: 'npc', id: 'sato', sprite: 'sato', x: 7, y: 2, dir: 'down', script: satoScript },
    { kind: 'interact', id: 'rootserver', x: 5, y: 3, script: [narrate('Eine Kopie eines Root-Servers. Hier beginnt jede Namensauflösung der Welt – ganz oben im Baum.')], scan: { name: 'rootserver', klasse: 'DNS-Server', attribute: [['ebene', 'Wurzel (.)'], ['kopien', 'hunderte weltweit']], methoden: ['verweisen'] } },
  ],
};

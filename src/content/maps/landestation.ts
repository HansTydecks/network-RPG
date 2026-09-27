import type { MapDef } from '../../engine/world/MapDef';
import { narrate } from '../../engine/script/Script';
import { kapitaeninScript } from '../dialog/kapitel5';

export const landestation: MapDef = {
  id: 'landestation',
  name: 'Seekabel-Landestation am Atlantik',
  outdoor: true,
  legend: { '~': 'meer', s: 'sand', M: 'fussmatte', K: 'kabeltrommel', L: 'lore' },
  ground: [
    '~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~',
    'ssssssssssssssss',
    'ssssssssssssssss',
    'ssssssssssssssss',
    'ssssssssssssssss',
    'ssssssssssssssss',
    'ssssssssssssssss',
    'ssssssssssssssss',
    'sssssssMssssssss',
  ],
  deco: [
    '                ',
    '                ',
    '                ',
    '                ',
    '    K      K    ',
    '                ',
    '                ',
    '  L             ',
    '                ',
    '                ',
  ],
  entities: [
    { kind: 'warp', x: 7, y: 9, to: { map: 'weltkarte', x: 12, y: 7, dir: 'down' } },
    { kind: 'npc', id: 'kapitaenin', sprite: 'kapitaenin', x: 8, y: 4, dir: 'down', script: kapitaeninScript },
    { kind: 'interact', id: 'trommel', x: 4, y: 4, script: [narrate('Eine riesige Kabeltrommel. Seekabel sind kaum dicker als ein Gartenschlauch – und liegen trotzdem quer durch den Ozean.')], scan: { name: 'seekabel', klasse: 'Glasfaserkabel', attribute: [['laenge', '6.600 km'], ['fasern', '16 Paare']], methoden: ['uebertragen'] } },
  ],
};

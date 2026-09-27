import type { MapDef } from '../../engine/world/MapDef';
import { narrate } from '../../engine/script/Script';
import { leonScript } from '../dialog/kapitel5';

export const sydney: MapDef = {
  id: 'sydney',
  name: 'Café am Hafen, Sydney',
  outside: '#0b1030',
  legend: { W: 'innenwand', I: 'innenfenster', _: 'dielen', M: 'fussmatte', t: 'theke', k: 'kaffeetisch', P: 'pflanze' },
  ground: [
    'WWIWWWWWWWIWWW',
    '______________',
    '______________',
    '______________',
    '______________',
    '______________',
    '______________',
    '______________',
    '______M_______',
  ],
  deco: [
    '              ',
    '              ',
    '     ttttt    ',
    '              ',
    '  k       k   ',
    '              ',
    '  k       k  P',
    '              ',
    'P             ',
  ],
  entities: [
    { kind: 'warp', x: 6, y: 8, to: { map: 'weltkarte', x: 26, y: 12, dir: 'down' } },
    { kind: 'npc', id: 'leon', sprite: 'leon', x: 7, y: 1, dir: 'down', script: leonScript },
    { kind: 'interact', id: 'theke', x: 7, y: 2, script: leonScript },
    { kind: 'interact', id: 'hafen', x: 2, y: 0, script: [narrate('Draußen: der Hafen von Sydney. Irgendwo da unten im Meer liegt ein Seekabel.')] },
  ],
};

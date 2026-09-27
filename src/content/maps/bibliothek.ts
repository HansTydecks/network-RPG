import type { MapDef } from '../../engine/world/MapDef';
import { narrate } from '../../engine/script/Script';
import { bibPc, weberScript } from '../dialog/kapitel2b';

export const bibliothek: MapDef = {
  id: 'bibliothek',
  name: 'Stadtbibliothek',
  outside: '#1a1c2c',
  legend: {
    W: 'innenwand', I: 'innenfenster', _: 'parkett', M: 'fussmatte',
    R: 'buecherregal', t: 'lesetisch', C: 'computer', P: 'pflanze',
  },
  ground: [
    'WWIWWWWWIWWW',
    '____________',
    '____________',
    '____________',
    '____________',
    '____________',
    '____________',
    '____________',
    '_____M______',
  ],
  deco: [
    '            ',
    'RRR  RRRR  P',
    '            ',
    'RRR         ',
    '          t ',
    '    tt      ',
    '  C         ',
    'R          P',
    '            ',
  ],
  entities: [
    { kind: 'warp', x: 5, y: 8, to: { map: 'knotenburg', x: 5, y: 16, dir: 'down' } },
    { kind: 'npc', id: 'weber', sprite: 'weber', x: 10, y: 3, dir: 'down', script: weberScript },
    { kind: 'interact', id: 'theke', x: 10, y: 4, script: weberScript },
    { kind: 'interact', id: 'bib_pc', x: 2, y: 6, script: bibPc, scan: { name: 'bibliotheks_pc', klasse: 'Computer', attribute: [['ort', 'Bibliothek'], ['nutzung', 'öffentlich']], methoden: ['suchen', 'drucken'] } },
    { kind: 'interact', id: 'regal_a', x: 1, y: 1, script: [narrate('Bücher über Geschichte. Eins heißt „Vom Telegrafen zum Internet".')] },
    { kind: 'interact', id: 'regal_b', x: 6, y: 1, script: [narrate('Lexika, Atlanten und ein Regal voller Zeitungen. Echte, aus Papier.')] },
    { kind: 'interact', id: 'regal_c', x: 1, y: 3, script: [narrate('Krimis. Einer heißt „Das Phantom im Netz". Passend.')] },
    { kind: 'interact', id: 'lesetisch', x: 4, y: 5, script: [narrate('Ein Lesetisch. Jemand hat eine Zeitung liegen lassen: „Knotenburger Tageblatt – Rathaus steht! Brand-Foto ist eine Fälschung"')] },
  ],
};

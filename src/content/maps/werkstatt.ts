import type { MapDef } from '../../engine/world/MapDef';
import { narrate } from '../../engine/script/Script';
import { kevinScript, linaK4, schubertScript } from '../dialog/kapitel4';

export const werkstatt: MapDef = {
  id: 'werkstatt',
  name: 'Die Werkstatt',
  outside: '#1a1c2c',
  legend: {
    W: 'innenwand', I: 'innenfenster', _: 'beton', M: 'fussmatte',
    b: 'schulbank', C: 'computer', t: 'tafel', S: 'serverschrank', L: 'lore', P: 'pflanze', X: 'briefkiste',
  },
  ground: [
    'WWIWWWWWWWWWIWWW',
    '________________',
    '________________',
    '________________',
    '________________',
    '________________',
    '________________',
    '________________',
    '________________',
    '_______M________',
  ],
  deco: [
    '     tt         ',
    'S             X ',
    '                ',
    ' bb  bb  bb  bb ',
    '                ',
    '  C          C  ',
    '                ',
    'P             P ',
    '                ',
    '                ',
  ],
  entities: [
    { kind: 'warp', x: 7, y: 9, to: { map: 'knotenburg', x: 28, y: 16, dir: 'left' } },
    { kind: 'npc', id: 'kevin', sprite: 'kevin', x: 8, y: 2, dir: 'down', script: kevinScript },
    { kind: 'npc', id: 'schubert', sprite: 'schubert', x: 3, y: 5, dir: 'left', script: schubertScript },
    { kind: 'npc', id: 'lina_k4', sprite: 'lina', x: 12, y: 5, dir: 'right', script: linaK4 },
    {
      kind: 'interact',
      id: 'himbeere',
      x: 0,
      y: 1,
      script: [narrate('„Die Himbeere": ein Rechner, so klein wie eine Tafel Schokolade. Kevin hat ihn in einen Serverschrank gebaut – „wegen der Optik".')],
      scan: { name: 'himbeere', klasse: 'Einplatinenrechner', attribute: [['groesse', '8 × 5 cm'], ['dienst', 'Notfall-Chat']], methoden: ['antworten', 'speichern'] },
    },
    { kind: 'interact', id: 'tafel_w', x: 5, y: 0, script: [narrate('Auf dem Whiteboard: „Regel Nr. 1: Nur hacken, was dir gehört – oder wofür du die Erlaubnis hast."')] },
    { kind: 'interact', id: 'werkbank', x: 5, y: 3, script: [narrate('Eine Werkbank voller Kabel, Lötkolben und halb fertiger Roboter.')] },
    { kind: 'interact', id: 'kiste_w', x: 14, y: 1, script: [narrate('Eine Kiste mit alten Handys. „Zum Ausschlachten – nicht zum Klauen!", steht darauf.')] },
  ],
};

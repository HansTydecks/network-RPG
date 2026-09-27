import type { MapDef } from '../../engine/world/MapDef';
import { narrate } from '../../engine/script/Script';
import { busSilberbach, kalleScript, stollenEingang } from '../dialog/kapitel3';

export const silberbach: MapDef = {
  id: 'silberbach',
  name: 'Silberbach im Erzgebirge',
  outdoor: true,
  legend: {
    '.': 'gras', ',': 'gras2', '=': 'weg', '#': 'strasse', X: 'fels',
    T: 'baum_ol', Y: 'baum_or', U: 'baum_ul', I: 'baum_ur', b: 'busch',
    E: 'stolleneingang', S: 'stollenschild', L: 'lore', H: 'bushalt', '!': 'schild',
  },
  ground: [
    'XXXXXXXXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXXXXXXXX',
    'XXXXXXXXXX.XXXXXXXXX',
    '..,......=...,......',
    '.........=.....,....',
    '..,......=..........',
    '.........=....,.....',
    '.====================',
    '====================',
    '####################',
    '####################',
  ].map((r) => r.slice(0, 20)),
  deco: [
    '                    ',
    '                    ',
    '                    ',
    '          E         ',
    'TY      S     L   TY',
    'UI                UI',
    'TY                TY',
    'UI             !  UI',
    '                    ',
    '  H                 ',
    '                    ',
    '                    ',
  ],
  extraSolid: [[10, 3]],
  entities: [
    { kind: 'interact', id: 'eingang', x: 10, y: 3, script: stollenEingang },
    { kind: 'npc', id: 'kalle', sprite: 'kalle', x: 12, y: 5, dir: 'left', script: kalleScript },
    { kind: 'interact', id: 'bushalt_sb', x: 2, y: 9, script: busSilberbach },
    { kind: 'interact', id: 'stollenschild', x: 8, y: 4, script: [narrate('„Silberstollen – seit 1520. Heute: Rechenzentrum Erzgebirge. Glück auf!"')] },
    { kind: 'interact', id: 'lore_sb', x: 14, y: 4, script: [narrate('Eine alte Lore. Früher fuhr man damit Silbererz aus dem Berg. Heute stehen Blumen darin.')] },
    { kind: 'interact', id: 'freibad', x: 15, y: 7, script: [narrate('„Freibad Silberbach – beheizt mit der Abwärme des Rechenzentrums. Wassertemperatur: 26 °C"')] },
  ],
};

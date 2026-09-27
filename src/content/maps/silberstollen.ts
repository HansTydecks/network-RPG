import type { MapDef } from '../../engine/world/MapDef';
import { narrate } from '../../engine/script/Script';
import { halle, kernScript } from '../dialog/kapitel3';

/** Der Silberstollen: sechs Hallen hintereinander, getrennt durch Gitter. */
export const silberstollen: MapDef = {
  id: 'silberstollen',
  name: 'Silberstollen – Rechenzentrum',
  outside: '#0b1030',
  legend: {
    '#': 'fels', '.': 'stollenboden',
    F: 'glasfaser', S: 'serverschrank', R: 'router', B: 'grossbildschirm', Q: 'buecherregal', L: 'lore',
  },
  ground: [
    '##############################',
    '#.....#....#....#....#....#..#',
    '#.....#....#....#....#....#..#',
    '#.....#....#....#....#....#..#',
    '#.....#....#....#....#....#..#',
    '#.....#....#....#....#....#..#',
    '.............................#',
    '#.....#....#....#....#....#..#',
    '#.....#....#....#....#....#..#',
    '#.....#....#....#....#....#..#',
    '#.....#....#....#....#....#..#',
    '##############################',
  ],
  deco: [
    '                              ',
    '                              ',
    '  FFF   SS   RR   BB   QQ   S ',
    '                            S ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '                              ',
    '  L              L            ',
    '                              ',
    '                              ',
  ],
  entities: [
    { kind: 'warp', x: 0, y: 6, to: { map: 'silberbach', x: 10, y: 4, dir: 'down' } },
    { kind: 'interact', id: 'halle1', x: 3, y: 2, script: halle('k3_raum1', 'Die Glasfaser-Halle. Durch manche Kabel flitzen Lichtblitze, andere sind durchtrennt.', 'medien', 'uebertragungsmedien') },
    { kind: 'interact', id: 'halle2', x: 8, y: 2, script: halle('k3_raum2', 'Die Switch-Kammer. Zwei Geräte blinken um die Wette.', 'switch_router', 'switch_router') },
    { kind: 'interact', id: 'halle3', x: 13, y: 2, script: halle('k3_raum3', 'Das Router-Labyrinth. Pakete rasen im Kreis, werden immer blasser und verschwinden.', 'schleife') },
    { kind: 'interact', id: 'halle4', x: 18, y: 2, script: halle('k3_raum4', 'Die Paketflut! Auf der Bildschirmwand türmen sich Millionen Pakete.', 'filter') },
    { kind: 'interact', id: 'halle5', x: 23, y: 2, script: halle('k3_raum5', 'Das Adressbuch-Gewölbe. Regale voller Einträge: Namen und Nummern.', 'dns', 'dns') },
    { kind: 'interact', id: 'kern', x: 28, y: 3, script: kernScript, scan: { name: 'kernserver', klasse: 'Server', attribute: [['ort', 'Silberstollen'], ['last', 'sehr hoch']], methoden: ['antworten', 'weiterleiten'] } },
    { kind: 'interact', id: 'gitter1', x: 6, y: 6, tile: 'gitter', visibleIf: { not: { flag: 'k3_raum1' } }, script: [narrate('Ein Gitter versperrt den Weg. Das Gerät in dieser Halle hat bestimmt etwas damit zu tun.')] },
    { kind: 'interact', id: 'gitter2', x: 11, y: 6, tile: 'gitter', visibleIf: { not: { flag: 'k3_raum2' } }, script: [narrate('Wieder ein Gitter. Löse zuerst das Rätsel dieser Halle.')] },
    { kind: 'interact', id: 'gitter3', x: 16, y: 6, tile: 'gitter', visibleIf: { not: { flag: 'k3_raum3' } }, script: [narrate('Das Gitter bleibt zu, solange die Pakete im Kreis laufen.')] },
    { kind: 'interact', id: 'gitter4', x: 21, y: 6, tile: 'gitter', visibleIf: { not: { flag: 'k3_raum4' } }, script: [narrate('Hinter dem Gitter rauscht die Paketflut.')] },
    { kind: 'interact', id: 'gitter5', x: 26, y: 6, tile: 'gitter', visibleIf: { not: { flag: 'k3_raum5' } }, script: [narrate('Das letzte Gitter. Dahinter flackert es gewaltig.')] },
    { kind: 'interact', id: 'lore_st', x: 2, y: 9, script: [narrate('Eine Lore voller Kabelrollen. Kalle hat „Glück auf!" daraufgemalt.')] },
  ],
  net: {
    devices: [
      { id: 'eingang', x: 1, y: 10, label: 'Zuleitung' },
      { id: 'kern', x: 28, y: 10, label: 'Kernserver' },
    ],
    cables: [{ from: 'eingang', to: 'kern', medium: 'glasfaser', path: [[1, 10], [28, 10]] }],
  },
};

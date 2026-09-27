import type { MapDef } from '../../engine/world/MapDef';
import { narrate, say } from '../../engine/script/Script';
import { laptopScript } from '../dialog/kapitel2b';

export const fernmeldeamt: MapDef = {
  id: 'fernmeldeamt',
  name: 'Altes Fernmeldeamt',
  outside: '#0b1030',
  legend: {
    W: 'innenwand', b: 'beton', M: 'fussmatte',
    K: 'klappenschrank', R: 'relais', F: 'fernschreiber', L: 'tisch_laptop', X: 'briefkiste',
  },
  ground: [
    'WWWWWWWWWWWWWW',
    'bbbbbbbbbbbbbb',
    'bbbbbbbbbbbbbb',
    'bbbbbbbbbbbbbb',
    'bbbbbbbbbbbbbb',
    'bbbbbbbbbbbbbb',
    'bbbbbbbbbbbbbb',
    'bbbbbbbbbbbbbb',
    'bbbbbbbbbbbbbb',
    'bbbbbbMbbbbbbb',
  ],
  deco: [
    '              ',
    'KKK   F  RRRR ',
    '              ',
    '              ',
    '              ',
    '       L      ',
    '              ',
    'X           X ',
    '              ',
    '              ',
  ],
  entities: [
    { kind: 'warp', x: 6, y: 9, to: { map: 'knotenburg', x: 23, y: 16, dir: 'down' } },
    {
      kind: 'interact',
      id: 'klappenschrank',
      x: 1,
      y: 1,
      script: [
        narrate('Ein riesiger Holzschrank mit Steckbuchsen und Kabeln: ein Klappenschrank. Früher haben hier Menschen Telefongespräche von Hand verbunden.'),
        say('ping', 'Stell dir vor: Für jedes Telefonat wurde eine feste Leitung gesteckt. Heute reist alles in kleinen Paketen.'),
      ],
      scan: { name: 'klappenschrank', klasse: 'Vermittlung', attribute: [['baujahr', '1952'], ['zustand', 'außer Betrieb']], methoden: ['verbinden'] },
    },
    { kind: 'interact', id: 'klappenschrank2', x: 2, y: 1, script: [narrate('An einer Buchse hängt ein Zettel: „Fräulein vom Amt – Platz 3".')] },
    { kind: 'interact', id: 'fernschreiber_fma', x: 6, y: 1, script: [narrate('Ein alter Fernschreiber. Im Papier stehen Reihen von Buchstaben – aber das Gerät ist ausgesteckt.')] },
    { kind: 'interact', id: 'relais', x: 10, y: 1, script: [narrate('Reihen von Relais, verstaubt und still. Nur eins klickt leise – seltsam.')] },
    { kind: 'interact', id: 'laptop', x: 7, y: 5, script: laptopScript, scan: { name: 'laptop', klasse: 'Laptop', attribute: [['besitzer', 'unbekannt'], ['akku', '87 %']], methoden: ['mailsVerschicken', 'selbstLoeschen'] } },
    { kind: 'interact', id: 'kiste', x: 0, y: 7, script: [narrate('Eine Kiste mit alten Telegrammen. Obenauf: „Glückwunsch zur Geburt – Werner"? Das Papier ist vergilbt.')] },
  ],
};

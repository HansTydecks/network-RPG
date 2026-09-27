import type { MapDef } from '../../engine/world/MapDef';
import { choice, narrate, quest, say, setFlag, give, when } from '../../engine/script/Script';

export const alexZimmer: MapDef = {
  id: 'alex_zimmer',
  name: 'Alex\' Zimmer',
  outside: '#1a1c2c',
  legend: {
    W: 'innenwand', I: 'innenfenster', _: 'dielen', t: 'teppich', M: 'fussmatte',
    k: 'kalender', B: 'bett_o', b: 'bett_u', D: 'schreibtisch', C: 'computer', R: 'regal', P: 'pflanze', p: 'paket',
  },
  ground: [
    'WWIWWWWIWW',
    '__________',
    '__________',
    '___tttt___',
    '___tttt___',
    '__________',
    '__________',
    '____M_____',
  ],
  deco: [
    '    k     ',
    'B     DCRP',
    'b         ',
    '          ',
    '        p ',
    '          ',
    '          ',
    '          ',
  ],
  entities: [
    { kind: 'warp', x: 4, y: 7, to: { map: 'kabelitz', x: 6, y: 8, dir: 'down' } },
    { kind: 'interact', id: 'kalender', x: 4, y: 0, script: [{ op: 'calendar' }] },
    {
      kind: 'interact',
      id: 'computer',
      x: 7,
      y: 1,
      script: [narrate('Dein Computer. Hier kannst du deinen Spielstand speichern.'), { op: 'save' }],
    },
    { kind: 'interact', id: 'bett', x: 0, y: 1, script: [narrate('Dein Bett. Noch fünf Minuten …? Nein – draußen wartet ein Abenteuer!')] },
    { kind: 'interact', id: 'bett2', x: 0, y: 2, script: [narrate('Dein Bett. Noch fünf Minuten …? Nein – draußen wartet ein Abenteuer!')] },
    {
      kind: 'interact',
      id: 'regal',
      x: 8,
      y: 1,
      script: [narrate('Bücher über Tauben, über den Weltraum – und eins mit dem Titel „Wie funktioniert das Internet?". Noch ungelesen.')],
    },
    { kind: 'interact', id: 'fenster1', x: 2, y: 0, script: [narrate('Draußen scheint die Sonne über Kabelitz.')] },
    { kind: 'interact', id: 'fenster2', x: 7, y: 0, script: [narrate('Nebenan sieht man Opa Werners Taubenschlag.')] },
    {
      kind: 'interact',
      id: 'paket',
      x: 8,
      y: 4,
      script: [
        when(
          { flag: 'paket_geoeffnet' },
          [narrate('Das leere Paket von Tante Ada. Ping sitzt gern darin.')],
          [
            narrate('Ein Paket! Absender: Tante Ada, Frankfurt am Main.'),
            narrate('Darin liegt eine seltsame Brille mit winzigen Kabeln – und ein Brief.'),
            say('ada', 'Hallo Alex! Diese Brille ist ein Prototyp. Sie zeigt, was sonst unsichtbar ist: Kabel, Geräte und Daten.'),
            say('ada', 'Setz sie draußen mal auf (Taste N) und schau dich um. Du wirst staunen! Liebe Grüße, Tante Ada'),
            give('netzblick_v1'),
            setFlag('paket_geoeffnet'),
            say('ping', 'Gurr! Eine Brille für Daten? Probier sie draußen aus!'),
            quest('m0_kabel'),
          ],
        ),
      ],
    },
  ],
  onEnter: [
    when({ not: { flag: 'intro_gesehen' } }, [
      say('ping', 'Ping! Guten Morgen, Alex!'),
      say('ping', 'Mit den Pfeiltasten oder W A S D läufst du herum. Mit Leertaste oder Enter sprichst du mit Leuten und untersuchst Dinge.'),
      say('ping', 'Wenn du nicht weiterweißt, drück H. Dann helfe ich dir – dafür bin ich da!'),
      say('ping', 'Mit M öffnest du das Menü. Und der Kalender an der Wand? Da blätterst du ins nächste Schuljahr – aber nur mit dem Code deiner Lehrkraft.'),
      choice('Alles klar?', [
        ['Alles klar!', [say('ping', 'Dann los! Gurr!')]],
        ['Nochmal langsam …', [say('ping', 'Laufen: Pfeiltasten. Reden: Leertaste. Hilfe: H. Menü: M. Brille: N. Du schaffst das!')]],
      ]),
      setFlag('intro_gesehen'),
      setFlag('ping_dabei'),
      quest('m0_zimmer'),
    ]),
  ],
};

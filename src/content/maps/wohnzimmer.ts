import type { MapDef } from '../../engine/world/MapDef';
import { choice, interlude, narrate, quest, say, setFlag, warp, when } from '../../engine/script/Script';

const mamaScript = [
  when(
    { not: { flag: 'mama_gesprochen' } },
    [
      say('mama', 'Da bist du ja! Stell dir vor: Das Internet ist weg. Im ganzen Dorf!'),
      say('mama', 'Ich müsste dringend eine Datei an meine Firma schicken. Und das Handy hat hier in Kabelitz ja sowieso kein Netz.'),
      say('ping', 'Gurr …'),
      say('mama', 'Und du wolltest doch Lina zu deinem Geburtstag am Samstag einladen, oder? Hm. Wie machen wir das jetzt bloß?'),
      setFlag('mama_gesprochen'),
      quest('q1_lina'),
    ],
    [
      when(
        { flag: 'brille_gebaut' },
        [
          when(
            { flag: 'zettel_gefunden' },
            [say('mama', 'Der graue Kasten an der Ecke ist aufgebrochen? Das muss ich sofort melden – wenn ich nur telefonieren könnte!')],
            [say('mama', 'Immer noch kein Internet. Meine Firma denkt bestimmt, ich mache blau.')],
          ),
        ],
        [
          when(
            { flag: 'zurueck_zuhause' },
            [say('mama', 'Na, wie war es im Briefzentrum? Das Paket von Tante Ada hab ich dir hoch in dein Zimmer gestellt.')],
            [
              when(
                { flag: 'brief_geschrieben' },
                [say('mama', 'Eine Briefmarke? Hab ich seit Jahren keine mehr gekauft. Frag doch Opa Werner, der sammelt die!')],
                [
                  when(
                    { flag: 'idee_brief' },
                    [say('mama', 'Einen Brief schreiben? Gute Idee! Papier und Umschläge liegen an deinem Schreibtisch.')],
                    [say('mama', 'Vielleicht weiß Opa Werner Rat? Der kennt sich mit so was aus.')],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  ),
];

export const wohnzimmer: MapDef = {
  id: 'wohnzimmer',
  name: 'Wohnzimmer',
  outside: '#1a1c2c',
  legend: {
    W: 'innenwand', I: 'innenfenster', _: 'dielen', f: 'fliesen', S: 'treppe', M: 'fussmatte', t: 'teppich',
    k: 'kueche', K: 'kuehlschrank', T: 'fernseher', l: 'sofa_l', r: 'sofa_r', L: 'tisch_laptop', e: 'esstisch', R: 'router', P: 'pflanze',
  },
  ground: [
    'WWWIWWIWWWWW',
    'S_______ffff',
    '________ffff',
    '__ttt___ffff',
    '__ttt_______',
    '____________',
    '____________',
    '____________',
    '_____M______',
  ],
  deco: [
    '  R         ',
    '   T    kkkK',
    '            ',
    '  lr        ',
    '       Le   ',
    '            ',
    '            ',
    '           P',
    '            ',
  ],
  entities: [
    { kind: 'warp', x: 0, y: 1, to: { map: 'alex_zimmer', x: 4, y: 6, dir: 'up' } },
    { kind: 'warp', x: 5, y: 8, to: { map: 'kabelitz', x: 6, y: 8, dir: 'down' } },
    { kind: 'npc', id: 'mama', sprite: 'mama', x: 7, y: 5, dir: 'up', script: mamaScript },
    {
      kind: 'npc',
      id: 'papa',
      sprite: 'papa',
      x: 4,
      y: 3,
      dir: 'left',
      script: [
        when(
          { flag: 'tag2' },
          [say('papa', 'Guten Morgen! Heute hab ich endlich frei. Ohne Internet … dann lese ich eben mal wieder die Zeitung. Die ist aus Papier!')],
          [
            when(
              { flag: 'papa_gesprochen' },
              [say('papa', 'Zzz … Brieftauben … Zzz …')],
              [
                say('papa', '*gähn* … Oh, Alex. Ich hatte Nachtschicht im Krankenhaus. Gib mir noch ein Stündchen …'),
                say('papa', 'Das Internet ist weg? Hmm … Dann ruft wenigstens niemand an.'),
                setFlag('papa_gesprochen'),
              ],
            ),
          ],
        ),
      ],
    },
    {
      kind: 'npc',
      id: 'krause',
      sprite: 'krause',
      x: 5,
      y: 7,
      dir: 'up',
      visibleIf: { all: [{ flag: 'tag2' }, { not: { flag: 'krause_getroffen' } }] },
      script: [
        say('krause', 'Guten Morgen! Ich bin Frau Krause, eure Postbotin. Das hier ist ein Paket für dich – von einer Ada aus Frankfurt.'),
        narrate('Ein Paket! Mama nimmt es und stellt es beiseite.'),
        say('mama', 'Das packst du nachher aus, ja?'),
        say('krause', 'Und ich hab noch eine Bitte: Bei uns im Briefzentrum ist Chaos. Die Sortiermaschine hängt am Internet – und das ist ja weg. Jetzt sortieren wir alles von Hand.'),
        say('krause', 'Deine Mama meinte, du hilfst gern. Kommst du mit? Dein Brief an Lina steckt da übrigens auch irgendwo drin!'),
        choice(undefined, [
          ['Klar, ich komme mit!', [say('krause', 'Prima! Das Postauto steht draußen.')]],
          ['Muss das sein?', [say('krause', 'Ohne Hilfe schaffen wir es heute nicht. Und Lina wartet doch auf deinen Brief!'), say('ping', 'Gurr! Komm schon, das wird spannend!')]],
        ]),
        setFlag('krause_getroffen'),
        setFlag('paket_erhalten'),
        interlude('Mit dem Postauto geht es nach Knotenburg, in die Stadt …'),
        warp('briefzentrum', 7, 7, 'up'),
        quest('q1_sortieren'),
      ],
    },
    {
      kind: 'interact',
      id: 'router',
      x: 2,
      y: 0,
      script: [
        narrate('Ein weißer Kasten mit Antennen und blinkenden Lämpchen. Eine Lampe leuchtet rot.'),
        say('ping', 'Keine Ahnung, was der macht. Aber das rote Licht sieht nicht gut aus.'),
        setFlag('router_gesehen'),
      ],
      scan: {
        name: 'kasten',
        klasse: '??? (unbekannt)',
        attribute: [['lampen', 'grün, grün, rot'], ['antennen', '2']],
        methoden: ['???'],
      },
    },
    {
      kind: 'interact',
      id: 'fernseher',
      x: 3,
      y: 1,
      script: [narrate('Der Fernseher zeigt nur: „Keine Verbindung".')],
      scan: { name: 'fernseher', klasse: 'Fernseher', attribute: [['bildschirm', '55 Zoll'], ['sender', 'keiner']], methoden: ['einschalten', 'umschalten', 'ausschalten'] },
    },
    {
      kind: 'interact',
      id: 'kuehlschrank',
      x: 11,
      y: 1,
      script: [narrate('Im Kühlschrank: Milch, Käse und ein großes Stück Stollen von Opa Werner.')],
      scan: {
        name: 'kuehlschrank',
        klasse: 'Kühlschrank',
        attribute: [['temperatur', '5 °C'], ['inhalt', 'Milch, Käse, Stollen']],
        methoden: ['kuehlen', 'oeffnen', 'schliessen'],
      },
    },
    { kind: 'interact', id: 'kueche', x: 9, y: 1, script: [narrate('Die Küche. Es riecht nach Kaffee.')] },
    {
      kind: 'interact',
      id: 'laptop',
      x: 7,
      y: 4,
      script: [narrate('Mamas Laptop. Auf dem Bildschirm: „Keine Internetverbindung".')],
      scan: { name: 'laptop', klasse: 'Laptop', attribute: [['akku', '64 %'], ['internet', 'keine Verbindung']], methoden: ['aufklappen', 'speichern', 'senden'] },
    },
  ],
};

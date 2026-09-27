import type { MapDef } from '../../engine/world/MapDef';
import { choice, give, interlude, lexicon, minigame, narrate, quest, say, setFlag, warp, when, type Script } from '../../engine/script/Script';

export const alexZimmer: MapDef = {
  id: 'alex_zimmer',
  name: 'Alex\' Zimmer',
  outside: '#1a1c2c',
  legend: {
    W: 'innenwand', I: 'innenfenster', _: 'dielen', t: 'teppich', M: 'fussmatte',
    k: 'kalender', B: 'bett_o', b: 'bett_u', D: 'schreibtisch', C: 'computer', R: 'regal', P: 'pflanze',
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
    '          ',
    '          ',
    '          ',
    '          ',
  ],
  entities: [
    { kind: 'warp', x: 4, y: 7, to: { map: 'wohnzimmer', x: 1, y: 1, dir: 'down' } },
    {
      kind: 'interact',
      id: 'kalender',
      x: 4,
      y: 0,
      script: [{ op: 'calendar' }],
      scan: { name: 'schulkalender', klasse: 'Kalender', attribute: [['monat', 'September'], ['markiert', 'Samstag: Geburtstag!']], methoden: ['umblaettern'] },
    },
    {
      kind: 'interact',
      id: 'schreibtisch',
      x: 6,
      y: 1,
      script: [
        when(
          { flag: 'brief_geschrieben' },
          [narrate('Hier hast du den Brief an Lina geschrieben. Ein paar leere Umschläge liegen noch da.')],
          [
            when(
              { flag: 'idee_brief' },
              [
                narrate('Papier, Stift, Umschläge – alles da. Los geht\'s!'),
                minigame('brief'),
                give('brief'),
                setFlag('brief_geschrieben'),
                say('ping', 'Auf dem Papier stehen jetzt nur Striche und Kringel – das sind Daten.'),
                say('ping', 'Erst wenn Lina sie liest und versteht, werden daraus Informationen: Geburtstag, Samstag, 15 Uhr, bei dir. Gurr!'),
                lexicon('information_daten'),
                say('ping', 'Jetzt fehlt nur noch eine Briefmarke. Wer hat denn so was heute noch?'),
                quest('q1_marke'),
              ],
              [narrate('Dein Schreibtisch. Stifte, Papier und ein paar leere Umschläge.')],
            ),
          ],
        ),
      ],
    },
    {
      kind: 'interact',
      id: 'computer',
      x: 7,
      y: 1,
      script: [
        when({ all: [{ stufeMin: 8 }, { not: { flag: 'k2_ada_update' } }] }, adaUpdate(), [
        when(
          { all: [{ flag: 'kvz_repariert' }, { not: { flag: 'email_gesendet' } }] },
          emailSchreiben(),
          [
            when(
              { flag: 'kvz_repariert' },
              [narrate('Dein Computer. In der Ecke steht „Verbunden". Das Internet ist wieder da!')],
              [narrate('Dein Computer. „Keine Internetverbindung" steht in der Ecke. Speichern geht aber trotzdem.')],
            ),
          ],
        ),
        ]),
        { op: 'save' },
      ],
      scan: {
        name: 'computer',
        klasse: 'Computer',
        attribute: [['bildschirm', '24 Zoll'], ['farbe', 'schwarz'], ['internet', 'keine Verbindung']],
        methoden: ['starten', 'speichern', 'herunterfahren'],
      },
    },
    {
      kind: 'interact',
      id: 'bett',
      x: 0,
      y: 1,
      script: bettScript(),
      scan: { name: 'bett', klasse: 'Bett', attribute: [['farbe', 'blau'], ['laenge', '2 m']], methoden: [] },
    },
    { kind: 'interact', id: 'bett2', x: 0, y: 2, script: bettScript() },
    {
      kind: 'interact',
      id: 'regal',
      x: 8,
      y: 1,
      script: [narrate('Bücher über Tauben, über den Weltraum – und eins mit dem Titel „Wie funktioniert das Internet?". Noch ungelesen.')],
      scan: { name: 'regal', klasse: 'Regal', attribute: [['anzahlBuecher', '23'], ['material', 'Holz']], methoden: [] },
    },
    { kind: 'interact', id: 'fenster1', x: 2, y: 0, script: [narrate('Draußen liegt Kabelitz in der Sonne.')] },
    { kind: 'interact', id: 'fenster2', x: 7, y: 0, script: [narrate('Nebenan sieht man Opa Werners Taubenschlag und seine große Antenne.')] },
    {
      kind: 'interact',
      id: 'paket',
      x: 8,
      y: 4,
      tile: 'paket',
      visibleIf: { flag: 'paket_erhalten' },
      scan: { name: 'paket', klasse: 'Paket', attribute: [['absender', 'Tante Ada, Frankfurt'], ['gewicht', '1,2 kg'], ['inhalt', 'leer']], methoden: ['oeffnen'] },
      script: [
        when(
          { flag: 'brille_gebaut' },
          [narrate('Das leere Paket von Tante Ada. Ping sitzt gern darin.')],
          [
            narrate('Das Paket von Tante Ada! Darin: ein Brillengestell, viele winzige Bauteile und ein Brief.'),
            say('ada', 'Hallo Alex! Hier ist ein Prototyp, an dem ich gerade arbeite: eine Brille, die Unsichtbares sichtbar macht – Kabel, Geräte, Daten.'),
            say('ada', 'Ich habe sie extra nicht fertig zusammengebaut. Wenn du sie selbst baust, verstehst du, wie sie funktioniert.'),
            say('ada', 'Alles Gute schon mal zum Geburtstag! Deine Tante Ada'),
            minigame('eva'),
            lexicon('eva'),
            give('netzblick_v1'),
            setFlag('brille_gebaut'),
            say('ping', 'Gurr! Eine Brille, die Daten sieht? Setz sie draußen auf – mit der Taste N!'),
            quest('q1_brille'),
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
        ['Alles klar!', [say('ping', 'Prima! Gurr!')]],
        ['Nochmal langsam …', [say('ping', 'Laufen: Pfeiltasten. Reden: Leertaste. Hilfe: H. Menü: M. Du schaffst das!')]],
      ]),
      narrate('Von unten ruft jemand:'),
      say('mama', 'Aaaalex! Kommst du mal runter? Das Internet ist weg!'),
      setFlag('intro_gesehen'),
      setFlag('ping_dabei'),
      quest('q1_mama'),
    ]),
  ],
};

function bettScript(): Script {
  return [
    when(
      { all: [{ flag: 'laden_zu_gesehen' }, { not: { flag: 'tag3' } }] },
      [
        narrate('Was für ein Tag! Du kuschelst dich ins Bett. Ping macht es sich auf dem Regal gemütlich.'),
        interlude('Am nächsten Morgen'),
        setFlag('tag3'),
        warp('alex_zimmer', 1, 2, 'down'),
        say('ping', 'Ping! Guten Morgen! Heute hat der Dorfladen wieder offen.'),
        say('ping', 'Aber Kabelbinder gibt es nicht umsonst. Im Laden bezahlt man mit Bytes – und dein Rucksack ist ziemlich leer.'),
        say('ping', 'Vielleicht kann jemand im Dorf Hilfe gebrauchen? Frag doch mal Herrn Nguyen im Laden.'),
        quest('q1_bytes'),
      ],
      [
        when(
          { all: [{ flag: 'email_gesendet' }, { not: { flag: 'tag4' } }] },
          [
            narrate('Morgen ist dein Geburtstag! Vor Aufregung kannst du kaum einschlafen … aber irgendwann doch.'),
            interlude('Samstag – dein Geburtstag!'),
            setFlag('tag4'),
            warp('alex_zimmer', 1, 2, 'down'),
            say('ping', 'Ping, ping, ping! Alles Gute zum Geburtstag, Alex!'),
            say('mama', 'Alles Gute, Geburtstagskind! Komm runter, es gibt Frühstück!'),
            interlude('Am Nachmittag'),
            setFlag('lina_da'),
            say('ping', 'Gleich beginnt das Dorffest! Und Lina ist mit dem Bus gekommen – sie wartet auf dem Dorfplatz.'),
            quest('q1_fest'),
          ],
          [
            when(
              { all: [{ flag: 'nacht' }, { not: { stufeMin: 8 } }] },
              [narrate('Dein Bett. Nach so einem Tag schläfst du bestimmt sofort ein … wenn da nicht diese Nachricht wäre.')],
              [narrate('Dein Bett. Noch fünf Minuten …? Nein – es gibt zu tun!')],
            ),
          ],
        ),
      ],
    ),
  ];
}

function emailSchreiben(): Script {
  return [
    narrate('Dein Computer. In der Ecke steht: „Verbunden". Das Internet ist zurück!'),
    narrate('Du schreibst Tante Ada eine E-Mail: „Danke für die Brille! Stell dir vor, ich habe geholfen, das Internet in Kabelitz zu reparieren!"'),
    narrate('Du klickst auf „Senden".'),
    minigame('briefreise:email'),
    say('ping', '0,8 Sekunden! Dein Brief an Lina war über zwei Tage unterwegs.'),
    narrate('Pling! Eine Antwort von Tante Ada.'),
    say('ada', 'Hallo Alex! Was für tolle Neuigkeiten! Ich bin so stolz auf dich. Pass gut auf die Brille auf – und auf dich!'),
    say('ping', 'Ist das Internet eigentlich immer schneller als ein Brief? Oder als eine Brieftaube? Gurr …'),
    minigame('schneller'),
    lexicon('uebertragungsrate'),
    setFlag('email_gesendet'),
    say('ping', 'Morgen ist Samstag: dein Geburtstag und das Dorffest! Zeit fürs Bett.'),
    quest('q1_samstag'),
  ];
}

/** Kapitel 2: Videoanruf von Tante Ada, Update auf Brille v2. */
function adaUpdate(): Script {
  return [
    narrate('Auf dem Bildschirm blinkt: „Videoanruf von Tante Ada".'),
    say('ada', 'Hallo Alex! Erster Tag am Gymnasium – aufgeregt? Ich hab ein Geschenk für dich: ein Update für deine Brille!'),
    say('ada', 'Leg sie mal neben den Computer … So, das Update läuft über das Internet zu dir. Fertig!'),
    give('netzblick_v2'),
    say('ada', 'Ab jetzt siehst du nicht nur Kabel, sondern auch Funkwellen – zum Beispiel vom WLAN. In der Stadt wirst du staunen!'),
    say('ada', 'Und Alex: Wenn dir in Knotenburg etwas Seltsames auffällt, melde dich. Viel Spaß in der neuen Schule!'),
    setFlag('k2_ada_update'),
    say('ping', 'Los geht\'s! Der Bus nach Knotenburg hält an der Haltestelle rechts im Dorf, vor Emils Haus.'),
    quest('k2_bus'),
  ];
}

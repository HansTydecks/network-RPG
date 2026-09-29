import type { EntityDef, MapDef } from '../../engine/world/MapDef';
import { choice, earn, give, narrate, pay, say, setFlag, when, zaehle, type Script } from '../../engine/script/Script';
import type { FlagId, MapId } from '../registry';

/**
 * Flavor: Figuren ohne feste Aufgabe, Deko und kleine Geheimnisse ohne Lehrplanbezug.
 * Wird beim Laden an die Karten angehängt, die Story-Karten bleiben unverändert.
 */
export interface Flavor {
  entities?: EntityDef[];
  dekor?: MapDef['dekor'];
}

// ---------- Goldene Federn ----------

const FEDER_TEXTE = [
  'Eine goldene Feder! (1 von 8)',
  'Noch eine goldene Feder! (2 von 8)',
  'Goldene Feder 3 von 8. Ping pfeift unschuldig vor sich hin.',
  'Goldene Feder 4 von 8! Ping: „Die hab ich nicht verloren. Ehrlich. Gurr.“',
  'Goldene Feder 5 von 8.',
  'Goldene Feder 6 von 8. Wer verliert so viele Federn?',
  'Goldene Feder 7 von 8! Nur noch eine …',
  'Alle 8 goldenen Federn gefunden!',
];

function feder(flag: FlagId, x: number, y: number): EntityDef {
  return {
    kind: 'interact',
    id: flag,
    x,
    y,
    tile: 'goldfeder',
    visibleIf: { not: { flag } },
    script: [
      narrate('Da glitzert etwas … eine goldene Taubenfeder!'),
      setFlag(flag),
      give('goldfedern'),
      zaehle('federzahl', 8, FEDER_TEXTE, [
        say('ping', 'Alle acht! Die sehen aus wie die Siegerfedern aus Opa Werners alten Fotos. Vielleicht sollte er sie mal sehen … Gurr.'),
      ]),
      { op: 'refresh' },
    ],
  };
}

// ---------- Kleine Helfer ----------

const ding = (id: string, x: number, y: number, tile: string, script: Script): EntityDef => ({ kind: 'interact', id, x, y, tile, script });
const stelle = (id: string, x: number, y: number, script: Script): EntityDef => ({ kind: 'interact', id, x, y, script });
const figur = (id: string, sprite: string, x: number, y: number, script: Script, wandern?: number, anim?: string): EntityDef => ({
  kind: 'npc',
  id,
  sprite,
  anim,
  x,
  y,
  dir: 'down',
  wandern,
  script,
});
/** Figuren, die nachts zu Hause sind (in der Nacht des Finales). */
const tagsueber = (e: EntityDef): EntityDef => ({ ...e, visibleIf: { not: { flag: 'k5_nacht' } } }) as EntityDef;

// ---------- Wunschbrunnen ----------

const WUENSCHE = [
  'Plitsch. Du wünschst dir, dass es morgen keine Hausaufgaben gibt.',
  'Plitsch. Du wünschst dir einen Hund. Oder zwei.',
  'Plitsch. Du wünschst dir, dass Opa Werners Stollen nie ausgeht.',
  'Plitsch. Du wünschst dir, dass das WLAN bis in den Garten reicht.',
  'Plitsch. Du wünschst dir, fliegen zu können. Wie Ping.',
  'Plitsch. Du wünschst dir Sommerferien. Jetzt sofort.',
  'Plitsch. Du wünschst dir, dass Krümel nie wieder im Kreis fährt.',
  'Plitsch. Du wünschst dir einen Nachtisch. Einen großen.',
  'Plitsch. Du wünschst dir … ach, das bleibt geheim.',
  'Plitsch! Aus dem Brunnen blubbert es. Da liegt ja etwas auf dem Grund!',
];

const brunnen: Script = [
  when(
    { flag: 'brunnen_10' },
    [narrate('Der Brunnen plätschert zufrieden. Er hat genug Wünsche für dieses Jahr.')],
    [
      narrate('Ein alter Wunschbrunnen. Auf dem Grund glitzern Münzen – und ein paar Bytes.'),
      choice('Ein Byte hineinwerfen?', [
        [
          'Ja, ein Byte!',
          [
            when(
              { bytesMin: 1 },
              [pay(1), zaehle('brunnen', 10, WUENSCHE, [narrate('Du fischst einen kleinen Beutel heraus. Darin: 256 Byte!'), earn(256)])],
              [narrate('Du hast kein einziges Byte dabei. Der Brunnen blubbert enttäuscht.')],
            ),
          ],
        ],
        ['Lieber nicht', [narrate('Du behältst dein Byte. Der Brunnen sagt nichts. Brunnen sagen nie etwas.')]],
      ]),
    ],
  ),
];

// ---------- Die Karten ----------

export const FLAVOR: Partial<Record<MapId, Flavor>> = {
  kabelitz: {
    entities: [
      ...[
      figur('joggerin', 'joggerin', 11, 11, [
        when(
          { stufeMin: 9 },
          [say('joggerin', 'Morgen! Ich laufe jeden Tag eine Runde ums Dorf. Seit Jahren. Bello hat mich noch nie eingeholt.')],
          [say('joggerin', 'Hallo! Nicht stehen bleiben, sonst fange ich wieder an zu schnaufen. Hff. Hff.')],
        ),
      ], 3),
      figur('bello', 'hund', 13, 11, [say('bello', 'Wuff!'), narrate('Bello wedelt so heftig mit dem Schwanz, dass er fast umfällt.')], 3, 'hund_idle'),
      figur('rentner', 'rentner', 3, 11, [
        say('rentner', 'Weißte, wie viele Tauben heute über das Dorf geflogen sind? Siebzehn. Ich zähle jeden Tag.'),
        say('rentner', 'Gestern waren es nur zwölf. Die Wetterlage, nehme ich an.'),
      ]),
      figur('paula', 'kind_a', 20, 12, [say('kind_a', 'Wir spielen Verstecken! Malik ist dran. Er zählt schon seit zehn Minuten. Ich glaube, er hat vergessen, bis wohin.')], 1),
      figur('malik', 'kind_b', 18, 11, [say('kind_b', '… achtundneunzig, neunundneunzig, hundert … hundertundeins … wie weit sollte ich nochmal zählen?')], 1),
      ].map(tagsueber),
      ding('muelltonne_kab', 9, 7, 'muelltonne', [narrate('Eine Mülltonne. Riecht nach Montag.')]),
      ding('fahrrad_kab', 13, 7, 'fahrrad', [narrate('Ein rotes Fahrrad. Der Sattel ist noch warm. Wer ist hier gerade abgestiegen?')]),
      ding('zwerg_kab', 4, 9, 'gartenzwerg', [
        narrate('Ein Gartenzwerg mit Angel. Er schaut dich an, als wüsste er etwas.'),
        narrate('Unter seinem Fuß klebt ein Zettel: „Hier war nie ein Schatz. Suche woanders.“'),
      ]),
      feder('feder_kabelitz', 27, 3),
    ],
    dekor: [
      { x: 3, y: 3, tile: 'pilze' },
      { x: 12, y: 4, tile: 'steine' },
      { x: 8, y: 11, tile: 'laub' },
      { x: 20, y: 15, tile: 'pfuetze' },
      { x: 26, y: 10, tile: 'laub' },
    ],
  },

  dorfplatz: {
    entities: [
      figur('marktfrau', 'marktfrau', 9, 12, [
        say('marktfrau', 'Frische Äpfel! Knackige Äpfel! Äpfel, die aussehen wie Birnen! Nein, Moment, das sind Birnen.'),
      ]),
      figur('ente', 'ente', 4, 13, [say('ente', 'Quak.'), narrate('Die Ente schaut dich an. Dann schaut sie weg. Das Gespräch ist beendet.')], 2, 'ente_idle'),
      ding('brunnen', 24, 12, 'brunnen', brunnen),
      ding('wegweiser_dp', 17, 2, 'wegweiser', [
        narrate('Ein Wegweiser: „Kabelitz 0 km · Knotenburg 12 km · Mond 384.400 km“.'),
        choice('Die Rückseite ansehen?', [
          ['Umdrehen', [narrate('Auf der Rückseite steht klein: „Wer das liest, hat zu viel Zeit. Schön, oder?“')]],
          ['Weitergehen', []],
        ]),
      ]),
      ding('litfass_dp', 4, 2, 'litfass', [narrate('Ein Plakat: „Dorffest am Samstag! Mit Kuchen, Musik und dem legendären Eierlauf.“ Jemand hat einen Schnurrbart auf das Ei gemalt.')]),
      ding('muelltonne_dp', 13, 5, 'muelltonne', [narrate('In der Mülltonne liegt ein Stapel alter Zeitungen. Schlagzeile von 1998: „Internet – nur eine Mode?“')]),
      feder('feder_dorfplatz', 27, 1),
    ],
    dekor: [
      { x: 7, y: 2, tile: 'laub' },
      { x: 10, y: 9, tile: 'pfuetze' },
      { x: 22, y: 2, tile: 'pilze' },
    ],
  },

  museum: {
    entities: [
      stelle('smiley', 0, 0, [
        narrate('Ganz in der Ecke, fast hinter dem Vorhang, hängt ein winziger Rahmen.'),
        narrate('Darin: :-)   Darunter: „Das erste Smiley in einer Nachricht, 1982. Leihgabe von niemandem.“'),
        say('ping', 'Das hat Frau Fröhlich bestimmt selbst aufgehängt. Gurr.'),
      ]),
      ding('pflanze_mus', 7, 8, 'zimmerpflanze', [narrate('Eine Zimmerpflanze. Auf dem Schildchen steht: „Exponat Nr. 0 – bitte nicht gießen, sie ist aus Plastik.“')]),
      feder('feder_museum', 11, 1),
    ],
  },

  dorfladen: {
    entities: [
      figur('kunde', 'rentner', 8, 6, [say('kunde', 'Ich suche seit zwanzig Minuten die Milch. Herr Nguyen stellt sie jede Woche woanders hin. Er sagt, das hält fit.')]),
    ],
  },

  alex_zimmer: {
    entities: [
      stelle('konsole', 9, 1, [
        narrate('Hinter dem Schrank klemmt etwas … eine uralte Spielkonsole! Mit einem Spiel namens „Taubenjagd 3“.'),
        narrate('Du drückst den Knopf. Auf dem Bildschirm steht: „HIGHSCORE: PING – 999999“.'),
        say('ping', 'Ich sag ja nur: Übung macht die Meisterin. Gurr!'),
      ]),
    ],
  },

  knotenburg: {
    entities: [
      figur('musiker', 'musiker', 5, 11, [
        say('musiker', 'Ich spiele heute nur ein Lied. Das dafür den ganzen Tag. Wünsch dir was – solange es dieses Lied ist.'),
      ]),
      figur('skater', 'skater', 8, 9, [
        when(
          { stufeMin: 9 },
          [say('skater', 'Ich hab jetzt einen neuen Trick. Er heißt „Hinfallen mit Stil“. Den kann ich richtig gut.')],
          [say('skater', 'Achtung, ich übe! Also … du bist sicher, solange du nicht direkt neben mir stehst. Oder hinter mir. Oder vor mir.')],
        ),
      ], 3),
      figur('bote', 'bote', 24, 10, [say('bote', 'Paket für … äh … „Herrn Emil und Krümel, Kabelitz“? Ist das eine Person oder zwei?')], 2),
      figur('touristin', 'touristin', 20, 18, [say('touristin', 'Entschuldigung, wo ist hier die berühmte Sehenswürdigkeit? Welche? Keine Ahnung, ich hoffe, es gibt eine.')], 3),
      ding('litfass_kb', 9, 12, 'litfass', [narrate('Ein Plakat: „Katze entlaufen. Hört auf den Namen Kiste. Kommt, wenn man nicht ruft.“')]),
      ding('muelltonne_kb', 19, 12, 'muelltonne', [narrate('Jemand hat auf die Mülltonne geschrieben: „Ich bin keine Tonne, ich bin ein Gefühl.“')]),
      ding('automat_kb', 26, 7, 'automat', [
        narrate('Ein Getränkeautomat. Er schluckt Münzen und gibt dafür … nichts. Wie ein Sparschwein mit Licht.'),
      ]),
      ding('hydrant_kb', 3, 10, 'hydrant', [narrate('Ein Hydrant. Ein Hund hat hier eindeutig schon eine Nachricht hinterlassen.')]),
      feder('feder_knotenburg', 27, 13),
    ],
    dekor: [
      { x: 6, y: 8, tile: 'pfuetze' },
      { x: 22, y: 17, tile: 'laub' },
    ],
  },

  gymnasium: {
    entities: [
      figur('hausmeister', 'hausmeister', 2, 6, [
        say('hausmeister', 'Wer hat schon wieder Kaugummi unter den Tisch im Informatikraum geklebt? Ich finde es heraus. Ich finde immer alles heraus.'),
      ], 2),
      figur('paula_schule', 'kind_a', 15, 7, [say('kind_a', 'Ich bin schon so lange auf dem Flur, dass ich den Stundenplan vergessen habe. Ist jetzt Mathe oder Pause? Bitte sag Pause.')]),
      ding('uhr_gym', 7, 0, 'wanduhr', [narrate('Die Schuluhr geht fünf Minuten vor. Das ist Absicht, sagt der Hausmeister. Es hilft nur nichts.')]),
      ding('wasser_gym', 1, 8, 'wasserspender', [narrate('Du trinkst einen Schluck. Blubb. Erfrischend – und ein bisschen nach Plastikbecher.')]),
    ],
  },

  bibliothek: {
    entities: [
      figur('leserin', 'leserin', 7, 5, [say('leserin', 'Pssst!'), narrate('Sie liest weiter. Das Buch heißt „Wie man leise niest“.')]),
      feder('feder_bibliothek', 10, 7),
    ],
    dekor: [{ x: 3, y: 6, tile: 'buecherstapel' }],
  },

  silberbach: {
    entities: [
      figur('wanderer', 'wanderer', 5, 6, [
        say('wanderer', 'Glück auf! Ich wandere von Hütte zu Hütte. Heute schon drei Hütten. Keine hatte Kuchen. Ein schwarzer Tag.'),
      ], 2),
      feder('feder_silberbach', 17, 4),
    ],
    dekor: [
      { x: 3, y: 5, tile: 'pilze' },
      { x: 12, y: 6, tile: 'steine' },
      { x: 16, y: 7, tile: 'laub' },
    ],
  },

  silberstollen: {
    entities: [
      stelle('kritzelei', 3, 0, [narrate('In den Fels geritzt: „KALLE WAR HIER – 1987“. Darunter, kleiner: „IMMER NOCH – 2026“.')]),
      feder('feder_stollen', 28, 10),
    ],
  },

  frankfurt: {
    entities: [figur('reisende_ffm', 'reisende', 1, 7, [say('reisende', 'Mein Zug hat vier Minuten Verspätung. Ich nutze die Zeit und lerne Jonglieren. Mit Äpfeln. Bisher mit einem.')])],
  },

  island: {
    entities: [figur('fischer', 'fischer', 12, 6, [say('fischer', 'Hier ist es so still, dass man die Wale husten hört. Oder war das mein Nachbar?')])],
  },

  tokio: {
    entities: [
      figur('reisende_tok', 'reisende', 2, 6, [say('reisende', 'Die Züge hier sind so pünktlich, dass ich einmal vor der Abfahrt angekommen bin. Also, später als der Zug.')], 2),
      feder('feder_tokio', 12, 7),
    ],
  },

  sydney: {
    entities: [figur('surferin', 'surferin', 12, 5, [say('surferin', 'Ich warte auf die perfekte Welle. Seit Dienstag. Letztes Jahr. Aber sie kommt, ich spüre es!')])],
  },
};

/** Hängt Flavor an die Karten (Figuren, Dinge, Deko). */
export function mitFlavor<T extends Record<string, MapDef>>(maps: T): T {
  for (const [id, f] of Object.entries(FLAVOR)) {
    const m = maps[id];
    if (!m || !f) continue;
    m.entities = [...m.entities, ...(f.entities ?? [])];
    m.dekor = [...(m.dekor ?? []), ...(f.dekor ?? [])];
  }
  return maps;
}

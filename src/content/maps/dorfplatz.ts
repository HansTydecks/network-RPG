import type { MapDef } from '../../engine/world/MapDef';
import type { InteractDef } from '../../engine/world/MapDef';
import type { Cond } from '../../engine/script/Script';
import { earn, give, interlude, lexicon, minigame, narrate, quest, say, setFlag, warp, when, type Script } from '../../engine/script/Script';
import { bytesCheck } from './dorfladen';
import { nachSchluessel } from '../dialog/kapitel2b';

/** Freitag: Händler und Frau Lehmann sind auf dem Platz. */
const TAG3: Cond = { all: [{ flag: 'tag3' }, { not: { flag: 'tag4' } }] };
/** Samstag bis zum Abend: das Dorffest. */
const FEST_TAG: Cond = { all: [{ flag: 'tag4' }, { not: { flag: 'nacht' } }] };

export const dorfplatz: MapDef = {
  id: 'dorfplatz',
  name: 'Dorfplatz Kabelitz',
  outdoor: true,
  legend: {
    '.': 'gras', ',': 'gras2', '=': 'weg', p: 'pflaster',
    T: 'baum_ol', Y: 'baum_or', U: 'baum_ul', I: 'baum_ur', b: 'busch',
    '<': 'dach_l', '^': 'dach_m', '>': 'dach_r', '[': 'traufe_l', _: 'traufe_m', ']': 'traufe_r',
    '(': 'wand_l', w: 'wand_m', ')': 'wand_r', F: 'fenster', D: 'tuer',
    M: 'museumsschild', K: 'kabelschacht', L: 'laterne', B: 'bank',
  },
  ground: [
    '....,.....,....=..............',
    '.......,..,....=...,..,.......',
    '....,..........=,............,',
    '..........,....=............,.',
    '....,,.........=.,...........,',
    '......,........=,......,......',
    '....,........,.=..,...,...,...',
    ',....=.........=......=.....,.',
    '.,.pppppppppppppppppppppppp...',
    '...pppppppppppppppppppppppp...',
    '..,pppppppppppppppppppppppp...',
    '.............,................',
    '.,....................,.......',
    ',....,........................',
    '..,.,....,............,..,,...',
    '..............................',
  ],
  deco: [
    'TYbbbbbbbbbbbbb bbbbbbbbbbbbTY',
    'UI                          UI',
    'TY                          TY',
    'UI<^^^^^>           <^^^>   UI',
    'TY<^^^^^>           <^^^>   TY',
    'UI[_____] K         [___]   UI',
    'TY(FwDwF)           (FDF)   TY',
    'UI     M                    UI',
    'TY                          TY',
    'UI L                      L UI',
    'TY                          TY',
    'UI                          UI',
    'TY         B      B         TY',
    'UI    b                b    UI',
    '                              ',
    '  bbbbbbbbbbbbbbbbbbbbbbbbbb  ',
  ],
  extraSolid: [[22, 6]],
  entities: [
    { kind: 'warp', x: 15, y: 0, to: { map: 'kabelitz', x: 15, y: 18, dir: 'up' } },
    { kind: 'warp', x: 5, y: 6, to: { map: 'museum', x: 3, y: 7, dir: 'up' } },
    {
      kind: 'interact',
      id: 'museumsschild',
      x: 7,
      y: 7,
      script: [narrate('„Dorfmuseum Kabelitz – Von der Rechenuhr zum Computer. Eintritt frei!"')],
    },
    {
      kind: 'interact',
      id: 'laden_tuer',
      x: 22,
      y: 6,
      script: [
        when(
          { flag: 'tag3' },
          [warp('dorfladen', 4, 6, 'up')],
          [
            narrate('Ein Zettel an der Tür: „Heute wegen Inventur geschlossen. Morgen wieder da! – Herr Nguyen"'),
            when({ all: [{ flag: 'schluessel_gefunden' }, { not: { flag: 'laden_zu_gesehen' } }] }, [
              say('ping', 'Mist, ausgerechnet heute! Dann müssen wir morgen wiederkommen.'),
              say('ping', 'Es wird sowieso schon dunkel. Ab nach Hause ins Bett – morgen früh geht es weiter. Gurr!'),
              setFlag('laden_zu_gesehen'),
              quest('q1_schlafen'),
            ]),
          ],
        ),
      ],
    },
    {
      kind: 'npc',
      id: 'haendler',
      sprite: 'haendler',
      x: 25,
      y: 11,
      dir: 'left',
      visibleIf: TAG3,
      script: [
        when(
          { not: { flag: 'haendler_gesprochen' } },
          [
            say('haendler', 'Hereinspaziert! Händler Hubert, Speicher aller Art! USB-Sticks, Speicherkarten, Festplatten – alles zum Superpreis!'),
            say('haendler', 'Na, junger Mensch aus Kabelitz, sollen wir ein bisschen tauschen? Ich mache dir faire Angebote … hehe.'),
            say('ping', 'Faire Angebote? Da passen wir lieber gut auf. Gurr!'),
            minigame('einheiten'),
            lexicon('einheiten'),
            setFlag('haendler_gesprochen'),
            say('haendler', 'Na so was! Du hast mich durchschaut. Kilo heißt 1.000, Kibi heißt 1.024 – das weißt du also.'),
            when({ not: { flag: 'haendler_bonus' } }, [
              say('haendler', 'Hier, 250 Byte. Dafür erzählst du niemandem von meinen kleinen Tricks, ja?'),
              earn(250),
              setFlag('haendler_bonus'),
              bytesCheck(),
            ]),
          ],
          [say('haendler', 'Heute keine Tricks mehr, versprochen! Ein Megabyte sind 1.000 Kilobyte. Ein Mebibyte sind 1.024 Kibibyte. Ehrenwort!')],
        ),
      ],
    },
    {
      kind: 'interact',
      id: 'karren_l',
      x: 26,
      y: 10,
      tile: 'karren_l',
      visibleIf: TAG3,
      script: [narrate('Huberts Karren. Kisten voller USB-Sticks und Speicherkarten. „64 GB – nur heute!"')],
      scan: { name: 'karren', klasse: 'Verkaufskarren', attribute: [['ware', 'Speicher'], ['besitzer', 'Händler Hubert']], methoden: ['verkaufen'] },
    },
    {
      kind: 'interact',
      id: 'karren_r',
      x: 27,
      y: 10,
      tile: 'karren_r',
      visibleIf: TAG3,
      script: [narrate('Huberts Karren. Kisten voller USB-Sticks und Speicherkarten. „64 GB – nur heute!"')],
    },
    { kind: 'npc', id: 'lehmann', sprite: 'lehmann', x: 14, y: 11, dir: 'down', visibleIf: TAG3, script: lehmannScript() },
    {
      kind: 'npc',
      id: 'lehmann_fest',
      sprite: 'lehmann',
      x: 14,
      y: 12,
      dir: 'down',
      visibleIf: FEST_TAG,
      script: [
        say('lehmann', 'Herzlich willkommen zum Dorffest! Dank dir haben wir einen Ablaufplan und eine Kuchenkasse, die von selbst rechnet.'),
        say('lehmann', 'Und alles Gute zum Geburtstag, Alex!'),
      ],
    },
    { kind: 'npc', id: 'lina', sprite: 'lina', x: 16, y: 11, dir: 'down', visibleIf: FEST_TAG, script: linaScript() },
    {
      kind: 'npc',
      id: 'opa_fest',
      sprite: 'opa',
      x: 20,
      y: 11,
      dir: 'down',
      visibleIf: FEST_TAG,
      script: [
        say('opa', 'Na, Geburtstagskind! Ein Stück Stollen? Selbst gebacken, nach Oma Gerdas Rezept.'),
        say('opa', 'Schön, wenn alle mal wieder zusammensitzen. Ganz ohne Handys … na ja, fast.'),
      ],
    },
    ...festDeko(),
    {
      kind: 'interact',
      id: 'kabelschacht',
      x: 10,
      y: 5,
      script: [
        when({ all: [{ stufeMin: 8 }, { item: 'block_fernbedienung' }] }, schachtKapitel2(), [
        when(
          { flag: 'kruemel_repariert' },
          [
            narrate('Ein langer, verwinkelter Kabelschacht. Krümel würde hineinpassen – aber der Weg ist viel länger als 10 Befehle.'),
            say('ping', 'Dafür bräuchte man einen Trick, damit Krümel Befehle wiederholt … Gurr. Merken wir uns!'),
            setFlag('schacht_gesehen'),
          ],
          [narrate('Ein Kabelschacht mit Deckel. Innen ist es eng und dunkel.')],
        ),
        ]),
      ],
      scan: { name: 'kabelschacht', klasse: 'Schacht', attribute: [['laenge', 'ca. 40 m'], ['inhalt', 'Kabel']], methoden: ['oeffnen'] },
    },
    {
      kind: 'interact',
      id: 'bank',
      x: 11,
      y: 12,
      script: [narrate('Eine Bank. Hier sitzen die Leute beim Dorffest und essen Kuchen.')],
    },
  ],
};

/** Bühne, Wimpel und Kuchenstand stehen ab Samstag. */
function festDeko(): InteractDef[] {
  const fest: Cond = { all: [{ flag: 'tag4' }, { not: { stufeMin: 8 } }] };
  const buehne: Script = [narrate('Die Bühne fürs Dorffest. Hier hält Frau Lehmann ihre Rede.')];
  const deko: InteractDef[] = [12, 13, 14, 15, 16, 17].map((x) => ({
    kind: 'interact',
    id: `buehne_${x}`,
    x,
    y: 13,
    tile: x === 12 || x === 17 ? 'wimpel' : 'buehne',
    visibleIf: fest,
    script: x === 12 || x === 17 ? [narrate('Bunte Wimpel flattern im Wind.')] : buehne,
  }));
  deko.push({
    kind: 'interact',
    id: 'kuchenstand',
    x: 21,
    y: 11,
    tile: 'kuchenstand',
    visibleIf: fest,
    script: [narrate('Der Kuchenstand. Auf einem Zettel steht: „Kuchen 1,50 € – die Tabelle rechnet mit!"')],
    scan: { name: 'kuchenstand', klasse: 'Stand', attribute: [['angebot', 'Kuchen, Stollen'], ['preis', '1,50 €']], methoden: ['verkaufen'] },
  });
  return deko;
}

function lehmannScript(): Script {
  return [
    when(
      { not: { flag: 'dateien_fertig' } },
      [
        say('lehmann', 'Ach, Alex! Am Samstag ist Dorffest, und ohne Internet funktioniert gar nichts.'),
        say('lehmann', 'Alles fürs Fest ist auf diesem USB-Stick. Aber da herrscht das reinste Chaos! Kannst du mir helfen? Ich zahle auch – 800 Byte.'),
        setFlag('lehmann_gesprochen'),
        minigame('dateien'),
        lexicon('dateitypen'),
        say('lehmann', 'Wunderbar, jetzt finde ich alles wieder! Hier sind deine 800 Byte.'),
        earn(800),
        setFlag('dateien_fertig'),
        say('lehmann', 'Die Dateien sind jetzt auf meinem Laptop. Behalte den Stick als Dankeschön!'),
        give('usb_stick'),
        say('lehmann', 'Ach, und wenn du noch Zeit hast: Die Abrechnung vom Kuchenverkauf macht mir auch Kopfzerbrechen.'),
        bytesCheck(),
      ],
      [
        when(
          { not: { flag: 'tabelle_fertig' } },
          [
            say('lehmann', 'Die Kuchenabrechnung! Ich rechne alles mit dem Taschenrechner – und jedes Mal kommt etwas anderes heraus.'),
            say('ping', 'Mit einer Tabellenkalkulation rechnet der Computer. Man muss ihm nur sagen, wie!'),
            minigame('tabelle'),
            lexicon('tabellenkalkulation'),
            say('lehmann', 'Die Tabelle rechnet ganz von selbst! Wenn ich eine Zahl ändere, stimmt die Summe trotzdem. Hier, 700 Byte für dich.'),
            earn(700),
            setFlag('tabelle_fertig'),
            bytesCheck(),
          ],
          [say('lehmann', 'Ablaufplan fertig, Kuchenkasse fertig. Jetzt fehlt nur noch das Internet – aber darum kümmerst du dich ja, habe ich gehört!')],
        ),
      ],
    ),
  ];
}

function linaScript(): Script {
  return [
    when(
      { flag: 'plakat_fertig' },
      [say('lina', 'Das war der beste Geburtstag überhaupt! Und nächstes Mal schreibst du mir eine E-Mail, ja? Hihi.')],
      [
        say('lina', 'Alex! Alles Gute zum Geburtstag!'),
        say('lina', 'Dein Brief kam am Freitag an. Guck, ich hab ihn mitgebracht! Ich hab mich riesig gefreut.'),
        say('ping', 'Mittwoch eingeworfen, Freitag angekommen: 2 Tage und 3 Stunden! Die E-Mail an Tante Ada war in 0,8 Sekunden da.'),
        say('lina', 'Und stell dir vor: Frau Lehmann hat gefragt, ob ich das Plakat fürs nächste Dorffest mache. Hilfst du mir?'),
        minigame('plakat'),
        lexicon('pixel_vektor'),
        lexicon('inhalt_design'),
        setFlag('plakat_fertig'),
        narrate('Frau Lehmann tritt auf die Bühne und klopft ans Mikrofon.'),
        say('lehmann', 'Liebe Kabelitzerinnen und Kabelitzer! Heute feiern wir nicht nur unser Dorffest – heute hat auch jemand Geburtstag!'),
        narrate('Das ganze Dorf singt für dich. Emil tanzt mit Krümel, Mama und Papa klatschen, und Opa Werner bringt ein riesiges Stück Stollen.'),
        say('opa', 'Für das Geburtstagskind! Und für die beste Briefeschreiberei im ganzen Dorf.'),
        setFlag('geburtstag_gefeiert'),
        interlude('Am Abend, nach dem Fest …'),
        setFlag('nacht'),
        warp('alex_zimmer', 7, 2, 'up'),
        narrate('Du willst gerade ins Bett gehen, da leuchtet dein Bildschirm auf. Ganz von allein.'),
        narrate('Auf dem Bildschirm erscheint eine durchgestrichene Antenne.'),
        say('funkstille', 'Du hast meine Stille gestört, Alex. Das war erst der Anfang.'),
        narrate('Dann wird der Bildschirm wieder schwarz.'),
        say('ping', 'G-gurr …'),
        narrate('Ping fliegt ans Fenster und starrt hinüber zum Nachbargarten.'),
        say('ping', 'Wer ist FUNKSTILLE? Und was hat er vor? Das müssen wir herausfinden!'),
        setFlag('kapitel1_fertig'),
        quest('q1_kapitel_ende'),
        interlude('Ende von Kapitel 1'),
        say('ping', 'Das Schuljahr ist bald vorbei. Wenn es weitergeht, weiß deine Lehrkraft, wie du den Kalender umblätterst.'),
        say('ping', 'Bis dahin kannst du in Kabelitz alles erkunden, was du noch nicht gesehen hast. Gurr!'),
      ],
    ),
  ];
}

/** Backtracking aus Kapitel 1: Mit Schleifen schafft Krümel jetzt den langen Schacht. */
function schachtKapitel2(): Script {
  return [
    when(
      { flag: 'k2_schacht' },
      [narrate('Der lange Kabelschacht. Hier hat Krümel den alten Schlüssel gefunden.')],
      [
        narrate('Der lange, verwinkelte Kabelschacht. Letztes Jahr war er für Krümel zu lang.'),
        say('ping', 'Jetzt kennt Krümel Wiederholungen! Und es gibt noch einen Block: „▲▲ solange frei: vor". Krümel fährt dann so lange geradeaus, bis vorne eine Wand ist.'),
        minigame('bloecke:schacht'),
        lexicon('wiederholung'),
        narrate('Ganz hinten im Schacht findet Krümel etwas Glänzendes: einen alten Schlüssel mit Anhänger.'),
        give('schluessel7'),
        setFlag('k2_schacht'),
        nachSchluessel,
        say('ping', '„Fernmeldeamt Knotenburg – Schlüssel 7"? Das alte Fernmeldeamt steht doch in Knotenburg! Wie kommt der Schlüssel denn hierher?'),
      ],
    ),
  ];
}

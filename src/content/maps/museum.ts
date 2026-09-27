import type { MapDef } from '../../engine/world/MapDef';
import type { Command, Script } from '../../engine/script/Script';
import { choice, give, lexicon, minigame, narrate, quest, say, setFlag, when } from '../../engine/script/Script';
import type { FlagId } from '../registry';

/** Ein Exponat: Tafel lesen, Frage beantworten. Richtig → Exponat zählt als gesehen. */
function exponat(flag: FlagId, tafel: string[], frage: string, antworten: [string, boolean][], erklaerung: string): Script {
  return [
    ...tafel.map((t) => narrate(t)),
    when({ flag }, [narrate('(Dieses Exponat kennst du schon.)')], [
      choice(
        frage,
        antworten.map(([label, ok]): [string, Script] => [
          label,
          ok ? [say('froehlich', `Richtig! ${erklaerung}`), setFlag(flag), pioniereCheck()] : [say('froehlich', `Nicht ganz. ${erklaerung}`)],
        ]),
      ),
    ]),
  ];
}

const ALLE_EXPONATE: FlagId[] = ['exp_schickard', 'exp_pascal', 'exp_leibniz', 'exp_lovelace', 'exp_zuse', 'exp_turing', 'exp_neumann'];

function pioniereCheck(): Command {
  return when({ all: [...ALLE_EXPONATE.map((f) => ({ flag: f })), { not: { flag: 'pioniere_belohnt' } }] }, [
    say('froehlich', 'Du hast alle sieben Exponate gesehen! Da kennt sich jemand richtig gut mit Rechentechnik aus.'),
    lexicon('pioniere'),
    setFlag('pioniere_belohnt'),
  ]);
}

/** Sind Schlösser, Pixelwand und Geheimtext gelöst, kann Alex Binärzahlen lesen. */
function binaerCheck(): Command {
  return when({ all: [{ flag: 'schloss3' }, { flag: 'pixelwand_geloest' }, { flag: 'geheimtext_geloest' }, { not: { flag: 'binaer_gelernt' } }] }, [
    setFlag('binaer_gelernt'),
    say('ping', 'Zahlen, Bilder, Texte – alles nur Nullen und Einsen! Jetzt kannst du die Schilder im grauen Kasten lesen. Gurr!'),
    quest('q1_zurueck_kowalski'),
  ]);
}

export const museum: MapDef = {
  id: 'museum',
  name: 'Dorfmuseum',
  outside: '#1a1c2c',
  legend: {
    W: 'museumswand', P: 'pixelwand', _: 'parkett', M: 'fussmatte',
    r: 'bilderrahmen', a: 'vitrine_rechenuhr', b: 'vitrine_pascaline', c: 'vitrine_leibniz', d: 'vitrine_lovelace',
    e: 'vitrine_turing', f: 'vitrine_neumann', z: 'z3_l', Z: 'z3_r', u: 'pult', F: 'fernschreiber',
  },
  ground: [
    'WWWWWWWWWWPW',
    '________W___',
    '________W___',
    '________W___',
    '____________',
    '________W___',
    '________W___',
    '________W___',
    '___M____W___',
  ],
  deco: [
    '  r   r     ',
    ' a b c      ',
    '            ',
    '          u ',
    ' d    e     ',
    '            ',
    ' zZ   f   u ',
    '           F',
    '            ',
  ],
  entities: [
    { kind: 'warp', x: 3, y: 8, to: { map: 'dorfplatz', x: 5, y: 7, dir: 'down' } },
    {
      kind: 'npc',
      id: 'froehlich',
      sprite: 'froehlich',
      x: 4,
      y: 4,
      dir: 'down',
      script: [
        when(
          { not: { flag: 'froehlich_gesprochen' } },
          [
            say('froehlich', 'Willkommen im Dorfmuseum Kabelitz! Ich bin Frau Fröhlich.'),
            say('froehlich', 'Hier zeigen wir, wie alles anfing: Rechenmaschinen, Lochstreifen, Relais – die Urgroßeltern eurer Handys!'),
            setFlag('froehlich_gesprochen'),
            when({ flag: 'kowalski_auftrag' }, [
              narrate('Du erzählst ihr von den Schildern im grauen Kasten: 00000101, 00001100 …'),
              say('froehlich', 'Nullen und Einsen? Binärzahlen! Da bist du hier genau richtig. Schau dir das Leibniz-Exponat an – oben in der Mitte.'),
            ]),
          ],
          [
            when(
              { flag: 'foto_restauriert' },
              [say('froehlich', 'Auf dem Foto ist der junge Werner Lösch! Der hat früher im Fernmeldeamt in Knotenburg gearbeitet. Mit Brieftauben, stell dir vor.')],
              [
                when(
                  { flag: 'binaer_gelernt' },
                  [
                    say('froehlich', 'Du kannst jetzt Binärzahlen lesen – Leibniz wäre stolz!'),
                    when({ not: { flag: 'foto_auftrag' } }, [
                      say('froehlich', 'Ach, noch was: Im Archiv liegt ein altes Foto, das unser Scanner verhunzt hat. Kannst du es im Fotolabor retten? Das Pult unten im Archiv.'),
                      setFlag('foto_auftrag'),
                    ]),
                  ],
                  [
                    when(
                      { item: 'binaer_karte' },
                      [say('froehlich', 'Mit der Binär-Karte schaffst du die Archivtür rechts. Dahinter warten noch zwei Rätsel!')],
                      [say('froehlich', 'Schau dich ruhig um! Das Leibniz-Exponat oben in der Mitte ist mein Lieblingsstück.')],
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ],
    },
    {
      kind: 'interact',
      id: 'schickard',
      x: 1,
      y: 1,
      script: exponat(
        'exp_schickard',
        ['„Wilhelm Schickard, 1623: die Rechenuhr. Die erste bekannte Rechenmaschine der Welt – mit Zahnrädern."'],
        'Was konnte die Rechenuhr?',
        [['Addieren und subtrahieren', true], ['Musik abspielen', false], ['Briefe verschicken', false]],
        'Mit Zahnrädern konnte sie addieren und subtrahieren.',
      ),
    },
    {
      kind: 'interact',
      id: 'pascal',
      x: 3,
      y: 1,
      script: exponat(
        'exp_pascal',
        ['„Blaise Pascal, 1642: die Pascaline. Pascal war erst 19 Jahre alt, als er sie baute."'],
        'Wofür baute Pascal seine Maschine?',
        [['Für ein Computerspiel', false], ['Als Hilfe für seinen Vater', true], ['Zum Kuchenbacken', false]],
        'Sein Vater musste als Steuerbeamter endlos rechnen – die Pascaline half ihm dabei.',
      ),
    },
    {
      kind: 'interact',
      id: 'leibniz',
      x: 5,
      y: 1,
      script: [
        narrate('„Gottfried Wilhelm Leibniz, 1703 – geboren in Leipzig. Er beschrieb das Binärsystem: Jede Zahl lässt sich mit nur zwei Ziffern schreiben, 0 und 1."'),
        when(
          { item: 'binaer_karte' },
          [narrate('(Dieses Exponat kennst du schon. Deine Binär-Karte hast du im Rucksack.)')],
          [
            say('froehlich', 'Stell dir acht Lampen nebeneinander vor. Jede Lampe hat einen Wert: 128, 64, 32, 16, 8, 4, 2 und 1.'),
            say('froehlich', 'Leuchtet eine Lampe, schreibt man 1 und zählt ihren Wert. Ist sie aus, schreibt man 0. 00000101 heißt also: 4 + 1 = 5.'),
            choice('Wie viel ist dann 00000011?', [
              ['3', [say('froehlich', 'Genau! 2 + 1 = 3.')]],
              ['11', [say('froehlich', 'Fast! Die Ziffern sehen aus wie elf, aber es gilt: 2 + 1 = 3.')]],
              ['2', [say('froehlich', 'Nicht ganz: Beide Lampen ganz rechts leuchten, also 2 + 1 = 3.')]],
            ]),
            say('froehlich', 'Hier, nimm die Binär-Karte mit. Darauf stehen die Werte – damit schaffst du auch die Archivtür rechts!'),
            give('binaer_karte'),
            setFlag('exp_leibniz'),
            lexicon('binaerzahlen'),
            quest('q1_archiv'),
            pioniereCheck(),
          ],
        ),
      ],
    },
    {
      kind: 'interact',
      id: 'lovelace',
      x: 1,
      y: 4,
      script: exponat(
        'exp_lovelace',
        ['„Ada Lovelace, 1843: Sie schrieb als Erste ein Programm für eine Rechenmaschine – lange bevor es Computer gab."'],
        'Was schrieb Ada Lovelace auf?',
        [['Eine E-Mail', false], ['Ein Kochrezept', false], ['Ein Programm', true]],
        'Ada Lovelace gilt als erste Programmiererin der Welt.',
      ),
    },
    {
      kind: 'interact',
      id: 'turing',
      x: 6,
      y: 4,
      script: exponat(
        'exp_turing',
        ['„Alan Turing, 1936: die Turingmaschine. Ein Band mit Zeichen und ein paar klare Regeln – so kann man alles Berechenbare beschreiben."'],
        'Was ist eine Turingmaschine?',
        [['Ein Gedankenmodell für Rechner', true], ['Ein Staubsauger', false], ['Eine Waschmaschine', false]],
        'Die Turingmaschine ist ein Modell – man braucht keine echte Maschine dafür.',
      ),
    },
    {
      kind: 'interact',
      id: 'zuse',
      x: 1,
      y: 6,
      script: exponat(
        'exp_zuse',
        ['„Konrad Zuse, 1941: die Z3 – der erste funktionierende programmierbare Computer. Zuse wuchs in Hoyerswerda in Sachsen auf."', 'Die Z3 klickt leise vor sich hin: Hunderte Relais schalten an und aus.'],
        'Womit rechnete die Z3?',
        [['Mit Holzkugeln', false], ['Mit Relais und Binärzahlen', true], ['Mit Dampfkraft', false]],
        'Relais sind Schalter: an = 1, aus = 0. Die Z3 rechnete binär!',
      ),
    },
    { kind: 'interact', id: 'zuse2', x: 2, y: 6, script: [narrate('Die Z3 klickt leise vor sich hin: Hunderte Relais schalten an und aus.')] },
    {
      kind: 'interact',
      id: 'neumann',
      x: 6,
      y: 6,
      script: exponat(
        'exp_neumann',
        ['„John von Neumann, 1945: Er beschrieb den Bauplan fast aller heutigen Computer: Prozessor, Speicher, Eingabe und Ausgabe."'],
        'Wo kennst du diesen Bauplan schon her?',
        [['Von meiner Brille (EVA + Speicher)', true], ['Von einem Fahrrad', false], ['Von einem Brief', false]],
        'Genau wie deine Brille: Eingabe, Verarbeitung, Ausgabe – und Speicher.',
      ),
    },
    { kind: 'interact', id: 'bild1', x: 2, y: 0, script: [narrate('Ein Porträt von Ada Lovelace.')] },
    { kind: 'interact', id: 'bild2', x: 6, y: 0, script: [narrate('Ein Porträt von Konrad Zuse vor der Z3.')] },
    {
      kind: 'interact',
      id: 'archivtuer',
      x: 8,
      y: 4,
      tile: 'archivtuer',
      visibleIf: { not: { flag: 'schloss3' } },
      script: [
        when(
          { item: 'binaer_karte' },
          [
            narrate('Die Archivtür hat drei Schlösser mit je acht Lampen.'),
            when({ not: { flag: 'schloss1' } }, [minigame('bitschloss:1'), setFlag('schloss1')]),
            when({ not: { flag: 'schloss2' } }, [minigame('bitschloss:2'), setFlag('schloss2')]),
            when({ not: { flag: 'schloss3' } }, [minigame('bitschloss:3'), setFlag('schloss3')]),
            narrate('Die Archivtür schwingt auf!'),
            say('ping', 'Gurr! Dahinter ist das Archiv. Schau dir die Wand und das Pult an!'),
          ],
          [narrate('Eine Tür mit drei Reihen aus je acht Lampen. Ohne zu wissen, was die Lampen bedeuten, keine Chance.')],
        ),
      ],
    },
    {
      kind: 'interact',
      id: 'pixelwand',
      x: 10,
      y: 0,
      script: [
        when(
          { flag: 'pixelwand_geloest' },
          [narrate('Die Pixelwand zeigt eine Taube – aus lauter Nullen und Einsen.')],
          [minigame('pixelwand'), lexicon('bilder_als_zahlen'), setFlag('pixelwand_geloest'), binaerCheck()],
        ),
      ],
    },
    {
      kind: 'interact',
      id: 'geheimtext',
      x: 10,
      y: 3,
      script: [
        when(
          { flag: 'geheimtext_geloest' },
          [narrate('Auf dem Zettel steht jetzt lesbar: KABELITZ.')],
          [minigame('geheimtext'), lexicon('text_als_zahlen'), setFlag('geheimtext_geloest'), binaerCheck()],
        ),
      ],
    },
    {
      kind: 'interact',
      id: 'fotolabor',
      x: 10,
      y: 6,
      script: [
        when(
          { flag: 'foto_restauriert' },
          [narrate('Das Fotolabor. Das gerettete Foto hast du im Rucksack.')],
          [
            when(
              { flag: 'foto_auftrag' },
              [
                minigame('fotolabor'),
                lexicon('farbkanaele'),
                give('restauriertes_foto'),
                setFlag('foto_restauriert'),
                say('ping', 'Ein junger Mann mit Brieftauben … „W. L." … Ist das etwa Opa Werner? Gurr!'),
              ],
              [narrate('Ein Arbeitstisch mit Scanner und Bildschirm: das Fotolabor des Museums.')],
            ),
          ],
        ),
      ],
    },
    {
      kind: 'interact',
      id: 'fernschreiber',
      x: 11,
      y: 7,
      script: [
        narrate('Ein alter Fernschreiber. Frau Fröhlich sagt, er druckt manchmal nachts Zeichensalat aus – obwohl er an nichts angeschlossen ist.'),
        setFlag('fernschreiber_gesehen'),
      ],
      scan: {
        name: 'fernschreiber',
        klasse: 'Fernschreiber',
        attribute: [['baujahr', '1962'], ['anschluss', 'keiner (?)']],
        methoden: ['drucken', 'empfangen'],
      },
    },
  ],
};

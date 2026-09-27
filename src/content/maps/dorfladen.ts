import type { MapDef } from '../../engine/world/MapDef';
import { choice, earn, give, minigame, narrate, pay, quest, say, setFlag, when, type Command, type Script } from '../../engine/script/Script';

/** Kabelbinder kosten 2 KB. Wer genug Bytes hat, bekommt die nächste Aufgabe. */
export const KABELBINDER_PREIS = 2000;

export function bytesCheck(): Command {
  return when({ all: [{ bytesMin: KABELBINDER_PREIS }, { not: { flag: 'kabelbinder_gekauft' } }] }, [
    say('ping', 'Du hast jetzt mindestens 2.000 Byte, also 2 KB! Das reicht für die Kabelbinder. Ab in den Dorfladen!'),
    quest('q1_kaufen'),
  ]);
}

const terminal: Command = when({ not: { flag: 'terminal_gesehen' } }, [
  narrate('Herr Nguyen dreht das Kartenterminal zu dir. Auf dem Bildschirm steht: „Bitte hier tippen".'),
  choice('Wie merkt der Bildschirm, wo du tippst?', [
    ['Eine Kamera filmt mich', [say('nguyen', 'Ha, nein, gefilmt wird hier niemand. Unter dem Glas liegt ein feines Netz aus Leiterbahnen. Dein Finger verändert dort winzige elektrische Felder.')]],
    ['Mein Finger leitet Strom', [say('nguyen', 'Genau! Unter dem Glas liegt ein feines Netz aus Leiterbahnen. Dein Finger verändert dort winzige elektrische Felder – so weiß das Gerät, wo du tippst.')]],
    ['Er hört das Tippen', [say('nguyen', 'Knapp daneben! Unter dem Glas liegt ein feines Netz aus Leiterbahnen. Dein Finger verändert dort winzige elektrische Felder.')]],
  ]),
  say('ping', 'Ein Touchscreen ist also Eingabe und Ausgabe in einem: Er zeigt etwas an und merkt, wo du tippst. Gurr!'),
  setFlag('terminal_gesehen'),
]);

const kaufen: Script = [
  say('nguyen', 'Eine Packung Kabelbinder? Macht 2 KB, also 2.000 Byte.'),
  terminal,
  narrate('Du tippst auf „Bezahlen". Piep!'),
  pay(KABELBINDER_PREIS),
  give('kabelbinder'),
  setFlag('kabelbinder_gekauft'),
  say('nguyen', 'Danke schön! Und grüß Herrn Kowalski. Wenn das Internet wieder geht, kann ich endlich wieder Ware bestellen.'),
  quest('q1_reparatur'),
];

const nguyenScript: Script = [
  when(
    { flag: 'kabelbinder_gekauft' },
    [
      when(
        { flag: 'kvz_repariert' },
        [say('nguyen', 'Das Internet ist wieder da! Meine Bestellungen sind schon unterwegs. Danke, Alex!')],
        [say('nguyen', 'Viel Erfolg bei der Reparatur! Ganz Kabelitz drückt euch die Daumen.')],
      ),
    ],
    [
      when(
        { not: { flag: 'nguyen_gesprochen' } },
        [
          say('nguyen', 'Guten Morgen, Alex! Entschuldige wegen gestern – Inventur. Da zählt man jede einzelne Dose.'),
          say('nguyen', 'Kabelbinder? Hab ich. Eine Packung kostet 2 KB. Das sind 2.000 Byte.'),
          say('ping', 'In Kabelitz bezahlt man mit Bytes. Wie viele du hast, siehst du im Rucksack (Taste M).'),
          say('nguyen', 'Knapp bei Kasse? Dann hätte ich einen Job für dich: Mein Pfandautomat da hinten ist kaputt. Reparier ihn, und ich zahle dir 500 Byte.'),
          say('nguyen', 'Und auf dem Dorfplatz sucht Frau Lehmann bestimmt Hilfe fürs Dorffest am Samstag.'),
          setFlag('nguyen_gesprochen'),
          when({ bytesMin: KABELBINDER_PREIS }, kaufen, [quest('q1_bytes')]),
        ],
        [
          when({ bytesMin: KABELBINDER_PREIS }, kaufen, [
            say('nguyen', 'Kabelbinder kosten 2 KB, also 2.000 Byte. Da fehlt dir noch was.'),
            when({ not: { flag: 'pfand_repariert' } }, [say('nguyen', 'Wie wär\'s mit meinem Pfandautomaten? 500 Byte für die Reparatur!')]),
          ]),
        ],
      ),
    ],
  ),
];

export const dorfladen: MapDef = {
  id: 'dorfladen',
  name: 'Dorfladen Nguyen',
  outside: '#1a1c2c',
  legend: {
    W: 'innenwand', I: 'innenfenster', _: 'fliesen', M: 'fussmatte',
    R: 'ladenregal', K: 'kasse', A: 'pfandautomat', P: 'pflanze',
  },
  ground: [
    'WWIWWWWIWW',
    '__________',
    '__________',
    '__________',
    '__________',
    '__________',
    '__________',
    '____M_____',
  ],
  deco: [
    '          ',
    'RRR   RR A',
    '          ',
    'RR        ',
    '      K   ',
    'RR        ',
    '         P',
    '          ',
  ],
  entities: [
    { kind: 'warp', x: 4, y: 7, to: { map: 'dorfplatz', x: 22, y: 7, dir: 'down' } },
    { kind: 'npc', id: 'nguyen', sprite: 'nguyen', x: 6, y: 3, dir: 'down', script: nguyenScript },
    {
      kind: 'interact',
      id: 'kasse',
      x: 6,
      y: 4,
      script: nguyenScript,
      scan: { name: 'kartenterminal', klasse: 'Terminal', attribute: [['bildschirm', 'Touchscreen'], ['waehrung', 'Byte']], methoden: ['bezahlen', 'bonDrucken'] },
    },
    {
      kind: 'interact',
      id: 'pfandautomat',
      x: 9,
      y: 1,
      scan: {
        name: 'pfandautomat',
        klasse: 'Pfandautomat',
        attribute: [['zustand', 'bereit'], ['flaschen', '312']],
        methoden: ['flascheAnnehmen', 'pruefen', 'bonDrucken'],
      },
      script: [
        when(
          { flag: 'pfand_repariert' },
          [narrate('Der Pfandautomat summt zufrieden. „Bitte Flasche einlegen."')],
          [
            when(
              { not: { flag: 'nguyen_gesprochen' } },
              [narrate('Ein Pfandautomat. Ein Zettel klebt daran: „Außer Betrieb".')],
              [
                narrate('Der Pfandautomat schluckt Flaschen – und spuckt sie wieder aus. Oder er druckt einen Bon, ohne dass eine Flasche drin war.'),
                say('ping', 'Der Automat ist ein EVA-System. Überleg mal, was bei ihm die Eingabe ist!'),
                choice('Was ist beim Pfandautomaten die Eingabe?', [
                  ['Der Strom', [say('ping', 'Strom braucht er, klar. Aber die Eingabe sind die Daten, die er bekommt: Der Scanner liest den Strichcode der Flasche.')]],
                  ['Der Bon', [say('ping', 'Der Bon kommt ja am Ende heraus – das ist die Ausgabe. Eingabe ist die Flasche: Ein Scanner liest ihren Strichcode.')]],
                  ['Die Flasche', [say('ping', 'Genau! Ein Scanner liest den Strichcode der Flasche. Verarbeitet wird: Pfandflasche oder nicht? Ausgabe ist der Bon.')]],
                ]),
                say('ping', 'In der Klappe hängt ein Zustandsdiagramm. Da stimmt etwas nicht …'),
                minigame('zustand:pfand'),
                narrate('Du legst eine Flasche ein. Surr … prüfen … angenommen! Ein Bon kommt heraus: „25 Cent".'),
                say('nguyen', 'Er geht wieder! Großartig. Hier, wie versprochen: 500 Byte.'),
                earn(500),
                setFlag('pfand_repariert'),
                bytesCheck(),
              ],
            ),
          ],
        ),
      ],
    },
    {
      kind: 'interact',
      id: 'regal1',
      x: 1,
      y: 1,
      script: [narrate('Nudeln, Reis, Konserven. Alles ordentlich gezählt – Inventur eben.')],
      scan: { name: 'regal', klasse: 'Regal', attribute: [['inhalt', 'Nudeln'], ['anzahl', '48 Packungen']], methoden: [] },
    },
    { kind: 'interact', id: 'regal2', x: 6, y: 1, script: [narrate('Brause, Saft und Wasser. Die Flaschen haben alle einen Strichcode für den Pfandautomaten.')] },
    { kind: 'interact', id: 'regal3', x: 0, y: 3, script: [narrate('Schrauben, Batterien, Glühbirnen – und ganz unten Kabelbinder!')] },
    { kind: 'interact', id: 'regal4', x: 1, y: 5, script: [narrate('Zeitschriften. Auf einer steht: „Internet in jedes Dorf!"')] },
  ],
};

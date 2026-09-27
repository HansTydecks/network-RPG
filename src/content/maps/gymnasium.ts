import type { InteractDef, MapDef } from '../../engine/world/MapDef';
import { lexicon, minigame, narrate, quest, say, setFlag, take, when, type Script } from '../../engine/script/Script';
import { workK3 } from '../dialog/kapitel3';
import { workK4 } from '../dialog/kapitel4';
import { workK5 } from '../dialog/kapitel5';
import { miaMittwoch, pcDienstag, sommerScript, workDienstag, workMittwoch } from '../dialog/kapitel2b';

const workMontag: Script = [
  when(
    { not: { flag: 'k2_work_gesprochen' } },
    [
      say('work', 'Ah, du musst Alex sein! Willkommen am Gymnasium Knotenburg. Ich bin Herr Work – ja, wie „Network". Haha. Mit dem Namen musste ich ja Informatiklehrer werden.'),
      say('work', 'Wir fangen gleich mit einer Frage an: Ist euer Schulweg ein Algorithmus?'),
      say('mia', 'Ein Algo-was?'),
      say('work', 'Ein Algorithmus ist eine Anleitung, mit der man ein Problem Schritt für Schritt löst. Ich lese euch ein paar Anleitungen vor. Ihr entscheidet!'),
      setFlag('k2_work_gesprochen'),
      minigame('algorithmus'),
      lexicon('algorithmus_eigenschaften'),
      setFlag('k2_algorithmus'),
      say('work', 'Sehr gut! Eindeutig, ausführbar, endlich – das merken wir uns.'),
      say('work', 'Algorithmen stecken übrigens überall: in Apps, in Spielen, sogar in dieser Schule. Wie kommt zum Beispiel euer Stundenplan auf den Bildschirm?'),
      say('work', 'Alex, schau dir doch mal einen der PCs genauer an. Was passiert da eigentlich?'),
      say('ping', 'Das ist ein Job für deine Brille! Die hat jetzt ja das Update von Tante Ada.'),
      quest('k2_clientserver'),
    ],
    [
      when(
        { not: { flag: 'k2_clientserver' } },
        [say('work', 'Schau dir einen der PCs an. Woher bekommt er den Stundenplan?')],
        [
          when(
            { not: { flag: 'k2_kanal_auftrag' } },
            [
              say('work', 'Genau: Die PCs sind Clients, im Serverraum läuft der Server. Anfrage, Antwort – so einfach.'),
              say('work', 'Nur … seit gestern kommen seltsame Anfragen bei unserem Server an. Nachts! Und sie kommen aus dem Kabelkanal im Hof.'),
              say('work', 'Da muss jemand etwas angeschlossen haben. Aber in den Kanal passt kein Mensch.'),
              say('ping', 'Aber ein Saugroboter! Alex hat Krümel dabei!'),
              narrate('Du zeigst Herrn Work Krümel und die Block-Fernbedienung.'),
              say('work', 'Ein programmierbarer Roboter! Darf ich mal? … So. Ich habe dir zwei neue Knöpfe freigeschaltet: Wiederholen und Wenn.'),
              say('work', 'Der Kanal ist lang. Mit nur zehn Blöcken schaffst du das nur, wenn Krümel Befehle wiederholt. Die Klappe ist draußen rechts neben dem Eingang.'),
              setFlag('k2_kanal_auftrag'),
              quest('k2_kanal'),
            ],
            [
              when(
                { all: [{ flag: 'k2_kanal2' }, { not: { flag: 'k2_stick_abgegeben' } }] },
                [
                  narrate('Du zeigst Herrn Work den schwarzen USB-Stick mit der durchgestrichenen Antenne.'),
                  say('work', 'Der steckte im Kabelkanal? An einem Kabel zum Serverraum? Dann kamen daher die nächtlichen Anfragen!'),
                  say('work', 'Gut, dass du ihn nicht in einen Computer gesteckt hast. Auf fremden Sticks kann Schadsoftware sein. Niemals einfach einstecken!'),
                  say('work', 'Ich schließe ihn weg. Morgen untersuchen wir ihn gemeinsam – an einem Rechner ohne Netzwerk.'),
                  take('fremder_stick'),
                  say('ping', 'FUNKSTILLE war hier … an unserer Schule. Gurr …'),
                  say('work', 'Für heute ist Schluss. Der Bus nach Kabelitz fährt an der Haltestelle am Markt. Bis morgen, Alex!'),
                  setFlag('k2_stick_abgegeben'),
                  quest('k2_heim'),
                ],
                [
                  when(
                    { flag: 'k2_stick_abgegeben' },
                    [say('work', 'Bis morgen, Alex! Und denk dran: Fremde Sticks niemals einstecken.')],
                    [say('work', 'Die Klappe zum Kabelkanal ist draußen rechts neben dem Schuleingang. Viel Erfolg, Krümel!')],
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

const workScript: Script = [when({ stufeMin: 11 }, workK5, [when({ stufeMin: 10 }, workK4, [when({ stufeMin: 9 }, workK3, [when({ flag: 'k2_mittwoch' }, workMittwoch, [when({ flag: 'k2_dienstag' }, workDienstag, workMontag)])])])])];

const pcMontag: Script = [
  when(
    { all: [{ flag: 'k2_work_gesprochen' }, { not: { flag: 'k2_clientserver' } }] },
    [
      narrate('Auf dem Bildschirm: „Stundenplan wird geladen …"'),
      narrate('Mit der Brille siehst du ein kleines Paket aus dem PC huschen: „Anfrage: Zeig mir den Stundenplan!" Es flitzt durchs Kabel in den Serverraum.'),
      narrate('Kurz darauf kommt ein Paket zurück: „Antwort: Hier ist der Stundenplan!" Auf dem Bildschirm erscheint die Tabelle.'),
      say('ping', 'Der PC fragt, der Rechner im Serverraum antwortet. Wie heißen die beiden?'),
      minigame('clientserver'),
      lexicon('client_server'),
      setFlag('k2_clientserver'),
      say('ping', 'Erzählen wir das Herrn Work!'),
    ],
    [narrate('Ein Schul-PC. Auf dem Bildschirm: „Anmelden bei KnotenLern". Dein Passwort weißt du noch nicht.')],
  ),
];

const pcScript: Script = [when({ flag: 'k2_dienstag' }, pcDienstag, pcMontag)];

export const gymnasium: MapDef = {
  id: 'gymnasium',
  name: 'Gymnasium Knotenburg',
  outside: '#1a1c2c',
  legend: {
    W: 'innenwand', I: 'innenfenster', _: 'parkett', f: 'fliesen', M: 'fussmatte',
    s: 'spind', t: 'tafel', C: 'computer', D: 'tuer', R: 'router', P: 'pflanze', X: 'serverschrank',
  },
  ground: [
    'WWWWWWWWIWWWWIWW',
    'fffffW__________',
    'fffffW__________',
    'fffffW__________',
    'fffffW__________',
    'fffffW__________',
    'fffffW__________',
    'fffff___________',
    'fffffW__________',
    'ffMffWWWWWWWWWWW',
  ],
  deco: [
    'ss  D     tt R  ',
    '               P',
    '                ',
    '       C C  C C ',
    '                ',
    '       C C  C C ',
    '                ',
    '                ',
    'P               ',
    '                ',
  ],
  entities: [
    { kind: 'warp', x: 2, y: 9, to: { map: 'knotenburg', x: 14, y: 6, dir: 'down' } },
    { kind: 'npc', id: 'work', sprite: 'work', x: 12, y: 1, dir: 'down', script: workScript },
    { kind: 'interact', id: 'tafel_l', x: 10, y: 0, script: [narrate('An der Tafel steht: „Algorithmus = eindeutig · ausführbar · endlich"')] },
    { kind: 'interact', id: 'tafel_r', x: 11, y: 0, script: [narrate('Daneben: „Client und Server – wer fragt, wer antwortet?"')] },
    ...[
      [7, 3],
      [9, 3],
      [12, 3],
      [14, 3],
      [7, 5],
      [9, 5],
      [12, 5],
      [14, 5],
    ].map(
      ([x, y], i): InteractDef => ({
        kind: 'interact',
        id: `pc${i}`,
        x,
        y,
        script: pcScript,
        scan: { name: `pc${i + 1}`, klasse: 'Computer', attribute: [['raum', 'Informatik'], ['rolle', 'Client']], methoden: ['anfragen', 'anzeigen'] },
      }),
    ),
    {
      kind: 'interact',
      id: 'ap',
      x: 13,
      y: 0,
      script: [narrate('Ein kleines weißes Kästchen an der Wand mit blinkenden Lämpchen. Darauf steht „Access Point".')],
      scan: { name: 'accesspoint', klasse: 'WLAN-Gerät', attribute: [['funk', 'WLAN'], ['reichweite', 'ca. 30 m']], methoden: ['senden', 'empfangen'] },
    },
    {
      kind: 'interact',
      id: 'serverraum',
      x: 4,
      y: 0,
      script: [
        narrate('„Serverraum – Zutritt nur für Admins". Neben der Tür ein Tastenfeld und ein Schild: „Code + Bestätigung per Handy".'),
        say('ping', 'Dahinter steht der Server, der allen PCs antwortet. Hier kommen wir nicht rein. Noch nicht!'),
      ],
      scan: { name: 'serverraum_tuer', klasse: 'Tür', attribute: [['schloss', 'Code + Handy'], ['zutritt', 'nur Admins']], methoden: ['oeffnen (gesperrt)'] },
    },
    { kind: 'interact', id: 'spind1', x: 0, y: 0, script: [narrate('Spinde der Klasse 8b. Einer hat einen Aufkleber: „Nicht vergessen: Passwort geheim halten!"')] },
    { kind: 'interact', id: 'spind2', x: 1, y: 0, script: [narrate('Ein Spind mit Vorhängeschloss. Vier Ziffern – wie viele Möglichkeiten es da wohl gibt?')] },
    {
      kind: 'npc',
      id: 'mia',
      sprite: 'mia',
      x: 8,
      y: 6,
      dir: 'up',
      script: [
        when({ flag: 'k2_mittwoch' }, miaMittwoch, [
        when(
          { flag: 'k2_algorithmus' },
          [say('mia', 'Mein Schulweg ist ein Algorithmus! Aber „Mach was Schönes" nicht. Muss ich meiner Oma erzählen.')],
          [
            say('mia', 'Hi! Ich bin Mia. Du bist neu? Aus Kabelitz? Da war doch letztes Jahr das Internet weg!'),
            say('mia', 'Sprich mal mit Herrn Work vorne an der Tafel. Der ist echt nett – auch wenn er schlechte Witze macht.'),
          ],
        ),
        ]),
      ],
    },
    {
      kind: 'npc',
      id: 'jonas',
      sprite: 'jonas',
      x: 13,
      y: 6,
      dir: 'up',
      visibleIf: { not: { flag: 'k2_stick_abgegeben' } },
      script: [
        say('jonas', 'Jonas. Hi. Ich hab heute früh eine komische Mail bekommen: „Ihr KnotenNetz-Konto wird in 24 Stunden gesperrt!"'),
        say('jonas', 'Ich hab noch nicht draufgeklickt. Sollte ich?'),
        say('ping', 'Lieber nicht! Das klingt verdächtig … Gurr.'),
      ],
    },
    { kind: 'npc', id: 'sommer', sprite: 'sommer', x: 3, y: 4, dir: 'right', visibleIf: { all: [{ flag: 'k2_mittwoch' }, { not: { stufeMin: 9 } }] }, script: sommerScript },
  ],
  net: {
    devices: [
      { id: 'server', x: 4, y: 0, label: 'Serverraum' },
      { id: 'pcs', x: 7, y: 3, label: 'Schul-PCs' },
    ],
    cables: [
      { from: 'pcs', to: 'server', medium: 'kupfer', path: [[7, 3], [7, 7], [4, 7], [4, 0]] },
      { from: 'pcs', to: 'server', medium: 'kupfer', path: [[14, 5], [14, 7], [4, 7], [4, 0]] },
    ],
    funk: [{ x: 13, y: 0, reichweite: 4, label: 'Access Point' }],
  },
};

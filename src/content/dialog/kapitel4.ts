/**
 * Kapitel 4 (Klasse 10): „Die Werkstatt". KrümelScript, HTML, reguläre Ausdrücke,
 * ein eigener Chat-Dienst, maschinelle Entscheidungen und FUNKSTILLEs Stimme.
 */
import { give, interlude, lexicon, minigame, narrate, quest, say, setFlag, warp, when, type Script } from '../../engine/script/Script';

export const KAPITEL4_START: Script = [
  interlude('Sommerferien …'),
  interlude('Ein Jahr später: Alex ist in Klasse 10.'),
  warp('alex_zimmer', 3, 3, 'down'),
  say('ping', 'Ping! Klasse 10, Alex! Und unten wartet Post auf dich.'),
  narrate('Mama hält dir eine Postkarte hin: „Grüße aus Bad Elster! Die Kur tut gut. Euer Werner."'),
  say('mama', 'Opa Werner ist für ein paar Wochen zur Kur gefahren. Ganz plötzlich. Er hat nicht mal Tschüss gesagt.'),
  give('postkarte'),
  setFlag('k4_postkarte'),
  narrate('Da piept dein Handy. Eine Nachricht von Herrn Work: „Alex! Die Webseiten der Stadt und der Schule sind verschandelt: DAS INTERNET IST GESCHLOSSEN. GEHT NACH DRAUSSEN! Treffpunkt: die Werkstatt in der alten Fabrik."'),
  say('ping', 'Die alte Fabrik liegt rechts hinter Knotenburg. Auf zum Bus!'),
  quest('k4_werkstatt'),
];

/** Gehweg am rechten Rand von Knotenburg: ab Klasse 10 geht es zur Werkstatt. */
export const fabrikWeg: Script = [
  when(
    { stufeMin: 10 },
    [warp('werkstatt', 7, 8, 'up')],
    [narrate('Da geht es zum alten Fabrikgelände. Heute gibt es dort nichts zu tun.'), { op: 'turn', dir: 'left' }],
  ),
];

export const kevinScript: Script = [
  when(
    { not: { flag: 'k4_kruemel' } },
    [
      say('kevin', 'Ey, du bist Alex, oder? Kevin. Mir gehört die Werkstatt hier. Früher hab ich … na ja, Dinge gehackt, die ich nicht hacken sollte. Heute helfe ich lieber.'),
      say('kevin', 'Herr Work hat erzählt, du hast so eine Brille. Hier – eine Quelltext-Linse. Damit siehst du den HTML-Code hinter jedem Bildschirm.'),
      give('quelltext_linse'),
      setFlag('k4_kevin'),
      say('kevin', 'Aber zuerst dein Roboter. Blöcke sind was für Kleine. Ab jetzt schreibt Krümel Text: KrümelScript!'),
      minigame('datentypen'),
      lexicon('datentypen'),
      minigame('fehlermeldung'),
      lexicon('fehlermeldungen'),
      lexicon('syntax_semantik'),
      minigame('unterprogramm'),
      lexicon('unterprogramme'),
      say('kevin', 'Und was steckt eigentlich in Krümel drin?'),
      minigame('robotik'),
      lexicon('robotik'),
      setFlag('k4_kruemel'),
      setFlag('k4_robotik'),
      say('kevin', 'Stark. Jetzt zur Rathaus-Seite: Herr Schubert sitzt dort drüben am Rechner. Er ist blind und kommt gar nicht mehr an die Termine vom Bürgeramt.'),
      quest('k4_html'),
    ],
    [
      when(
        { not: { flag: 'k4_regex' } },
        [say('kevin', 'Erst die Rathaus-Seite, dann das Spam-Problem im Forum. Lina kümmert sich um das Forum.')],
        [
          when(
            { not: { flag: 'k4_bus' } },
            [
              say('kevin', 'Die großen Dienste werden dauernd angegriffen. Wir bauen einen eigenen Notfall-Chat für Knotenburg – auf der Himbeere hier. Kleiner Rechner, große Wirkung.'),
              minigame('chatserver'),
              lexicon('client_server_dienst'),
              minigame('chatbot'),
              minigame('binaersuche'),
              lexicon('suchen_sortieren'),
              setFlag('k4_chat'),
              narrate('Im neuen Chat taucht sofort eine Nachricht auf: „Der Stadtbus fährt über Rot!"'),
              say('kevin', 'Der autonome Stadtbus! Den steuert ein Programm. Schauen wir uns seine Regeln an.'),
              minigame('bedingungen'),
              lexicon('bedingungen'),
              minigame('stadtbus'),
              lexicon('maschinen_entscheiden'),
              setFlag('k4_bus'),
              narrate('Kevins Rechner piept: „Neue Sprachnachricht von: FUNKSTILLE".'),
              say('kevin', 'Er hat sich gemeldet. Die Stimme ist verzerrt. Aber verzerren kann man rückgängig machen …'),
              quest('k4_stimme'),
            ],
            [
              when(
                { not: { flag: 'k4_stimme' } },
                [
                  minigame('stimme'),
                  lexicon('zeitabhaengige_medien'),
                  setFlag('k4_stimme'),
                  say('kevin', 'Hör mal: ein älterer Mann. Sächsisch. „Nu, gloar." Und im Hintergrund gurren Tauben.'),
                  say('kevin', 'Tauben … Das passt zur Feder, die du damals gefunden hast. Der Taubenverein Kabelitz?'),
                  say('ping', 'Aber im Verein sind doch nur Opa Werner, Gustav Klein und Frau Fröhlich. Frau Fröhlich ist keine ältere Männerstimme, Gustav lebt auf Mallorca … und Opa ist zur Kur!'),
                  narrate('Du ziehst die Postkarte aus dem Rucksack. „Grüße aus Bad Elster". Der Poststempel ist verwischt. Nur „…itz" kann man noch lesen.'),
                  say('ping', '„…itz"? Das kann doch alles Mögliche sein. … Oder? Gurr.'),
                  narrate('Da geht die Tür auf. Tante Ada steht in der Werkstatt, den Rollkoffer noch in der Hand.'),
                  say('ada', 'Alex! Endlich. Ich komme direkt aus Frankfurt. Jemand manipuliert weltweit die Namensauflösung – das Adressbuch des Internets.'),
                  say('ada', 'Alle Spuren führen zu Paketen, die irgendwo aus Sachsen kommen. Ich brauche dich auf einer Reise um die Welt. Pack deinen Koffer!'),
                  give('reisepass'),
                  setFlag('kapitel4_fertig'),
                  quest('k4_kapitel_ende'),
                  interlude('Ende von Kapitel 4'),
                  say('ping', 'Um die Welt! Aber erst nach dem Schuljahr. Deine Lehrkraft kennt den Code für den Kalender. Gurr!'),
                ],
                [say('kevin', 'Gute Reise, Alex! Und wenn du Hilfe brauchst: Der Notfall-Chat läuft.')],
              ),
            ],
          ),
        ],
      ),
    ],
  ),
];

export const schubertScript: Script = [
  when(
    { flag: 'k4_html' },
    [say('schubert', 'Mein Screenreader liest mir alles wieder vor: „Überschrift: Bürgeramt Knotenburg. Bild: Das Rathaus am Markt." Herrlich!')],
    [
      when(
        { flag: 'k4_kruemel' },
        [
          say('schubert', 'Guten Tag! Ich bin Herr Schubert. Ich sehe nichts, aber mein Screenreader liest mir Webseiten vor. Seit gestern sagt er auf der Rathaus-Seite nur noch „Bild, Bild, Bild".'),
          narrate('Mit der Quelltext-Linse siehst du hinter dem Bildschirm den HTML-Code.'),
          minigame('html_struktur'),
          lexicon('html'),
          minigame('html_barriere'),
          lexicon('barrierefreiheit'),
          minigame('css'),
          lexicon('css'),
          setFlag('k4_html'),
          say('schubert', 'Wunderbar! Endlich finde ich die Termine wieder. Vielen Dank, Alex!'),
          say('ping', 'Lina winkt vom Forum-Rechner. Da ist was los!'),
          quest('k4_regex'),
        ],
        [say('schubert', 'Guten Tag! Kevin hilft mir gleich mit der Rathaus-Seite, sagt er.')],
      ),
    ],
  ),
];

export const linaK4: Script = [
  when(
    { flag: 'k4_regex' },
    [say('lina', 'Das Forum ist sauber! Und ich habe gelernt: Ein gutes Muster spart tausend Klicks.')],
    [
      when(
        { flag: 'k4_html' },
        [
          say('lina', 'Alex! Schön, dich zu sehen! Ich helfe Kevin seit ein paar Wochen in der Werkstatt. Und jetzt flutet FUNKSTILLE das Stadtforum mit Spam.'),
          say('lina', 'Hunderte Adressen: info1@spam.biz, info2@spam.biz … Einzeln löschen dauert ewig. Wir brauchen ein Muster!'),
          minigame('regex_finden'),
          lexicon('regex'),
          minigame('regex_validieren'),
          setFlag('k4_regex'),
          say('lina', 'Weg damit! Kevin will jetzt einen eigenen Chat bauen. Frag ihn mal!'),
          quest('k4_chat'),
        ],
        [say('lina', 'Alex! Wie schön! Hilf erst Herrn Schubert, dann hab ich auch was für dich.')],
      ),
    ],
  ),
];

export const emilK4: Script = [
  when(
    { flag: 'k4_emil' },
    [say('emil', 'Mein Roboter fährt jetzt nur, wenn das Licht an ist UND nichts im Weg ist. Genau wie er soll!')],
    [
      say('emil', 'Alex! Du bist doch jetzt so ein Programmier-Profi. Mein Spielzeugroboter fährt immer los, auch wenn er gegen die Wand knallt!'),
      minigame('bedingungen'),
      lexicon('bedingungen'),
      setFlag('k4_emil'),
      say('emil', 'Er bremst! Du bist die beste Person der Welt! … Nach Krümel.'),
    ],
  ),
];

export const mamaK4: Script = [
  say('mama', 'Opa Werner auf Kur … Er hat nicht mal seinen Taubenschlag abgegeben. Wer füttert denn jetzt die Tauben?'),
];

export const workK4: Script = [
  say('work', 'Alex! Die Stadtseiten sind ein Chaos. Kevin in der Werkstatt hilft uns – die alte Fabrik rechts hinter dem Markt.'),
];

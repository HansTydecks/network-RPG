/**
 * Kapitel 2, M3a (Klasse 8): Algorithmusbegriff und Client/Server.
 */
import type { QuizFrage } from './quiz';

// ---------- Algorithmus oder nicht? (SN Kl. 8 LB 1: Begriff, Eigenschaften, Alltag) ----------
export const ALGORITHMUS_FRAGEN: QuizFrage[] = [
  {
    frage: 'Mia: „Mein Schulweg: Haustür zu, links bis zur Ampel, bei Grün rüber, dann 200 m geradeaus zum Bus." Ist das ein Algorithmus?',
    optionen: [
      { text: 'Ja', ok: true, erklaerung: 'Jeder Schritt ist klar, machbar, und am Ende ist Mia am Bus. Eindeutig, ausführbar, endlich.' },
      { text: 'Nein, nicht eindeutig', ok: false, erklaerung: 'Welcher Schritt wäre denn unklar? Links, Ampel, bei Grün, 200 m – das ist ziemlich genau.' },
      { text: 'Nein, hört nie auf', ok: false, erklaerung: 'Doch: Am Bus ist der Weg zu Ende.' },
    ],
  },
  {
    frage: 'Jonas: „Mach was Schönes!" Ist das ein Algorithmus?',
    optionen: [
      { text: 'Ja', ok: false, erklaerung: 'Was genau soll man denn tun? Malen? Singen? Jeder würde etwas anderes machen.' },
      { text: 'Nein, nicht eindeutig', ok: true, erklaerung: 'Genau! „Etwas Schönes" kann alles sein. Ein Algorithmus muss eindeutig sagen, was zu tun ist.' },
      { text: 'Nein, nicht ausführbar', ok: false, erklaerung: 'Ausführen könnte man schon irgendwas – aber was genau? Das Problem ist ein anderes.' },
    ],
  },
  {
    frage: 'Auf einem Zettel: „1. Rühre den Teig. 2. Gehe zu Schritt 1." Ist das ein Algorithmus?',
    optionen: [
      { text: 'Ja', ok: false, erklaerung: 'Wann bist du denn fertig? Nie!' },
      { text: 'Nein, nicht eindeutig', ok: false, erklaerung: 'Die Schritte sind klar. Aber was passiert am Ende?' },
      { text: 'Nein, hört nie auf', ok: true, erklaerung: 'Richtig! Ein Algorithmus muss endlich sein, also irgendwann aufhören.' },
    ],
  },
  {
    frage: '„Handy entsperren: Wisch nach oben, gib die 4-stellige PIN ein, tippe auf OK." Ist das ein Algorithmus?',
    optionen: [
      { text: 'Ja', ok: true, erklaerung: 'Drei klare Schritte, jeder machbar, danach ist Schluss. Ein Algorithmus aus dem Alltag.' },
      { text: 'Nein, nicht ausführbar', ok: false, erklaerung: 'Wischen, tippen, OK drücken – das kann jede Person mit Handy.' },
      { text: 'Nein, hört nie auf', ok: false, erklaerung: 'Nach „OK" ist das Handy entsperrt. Fertig.' },
    ],
  },
  {
    frage: '„Flieg mit den Armen zum Mond und zurück." Ist das ein Algorithmus?',
    optionen: [
      { text: 'Ja', ok: false, erklaerung: 'Probier es mal aus … Klappt nicht, oder?' },
      { text: 'Nein, nicht ausführbar', ok: true, erklaerung: 'Genau! Jeder Schritt eines Algorithmus muss auch wirklich machbar sein.' },
      { text: 'Nein, nicht eindeutig', ok: false, erklaerung: 'Klar ist die Anweisung schon. Aber kann man sie ausführen?' },
    ],
  },
  {
    frage: 'Herr Work: „Eine App zeigt euch immer mehr Videos, die ihr lange anschaut." Steckt da ein Algorithmus dahinter?',
    optionen: [
      { text: 'Ja', ok: true, erklaerung: 'Richtig! Ein Programm entscheidet nach festen Regeln, was ihr als Nächstes seht – ein Algorithmus im Alltag.' },
      { text: 'Nein, das ist Zufall', ok: false, erklaerung: 'Zufall ist das nicht: Die App merkt sich, was ihr anschaut, und wählt nach Regeln aus.' },
    ],
  },
];

// ---------- Client oder Server? (Schulcurriculum Kl. 8: Client/Server) ----------
export const CLIENT_SERVER_FRAGEN: QuizFrage[] = [
  {
    frage: 'Dein Handy fragt: „Schick mir das nächste Video!" Was ist dein Handy hier?',
    optionen: [
      { text: 'Client', ok: true, erklaerung: 'Das Handy stellt eine Anfrage – es ist der Client.' },
      { text: 'Server', ok: false, erklaerung: 'Das Handy will etwas haben. Wer fragt, ist der Client.' },
    ],
  },
  {
    frage: 'Der Rechner der Videoplattform schickt das Video zurück. Was ist er?',
    optionen: [
      { text: 'Client', ok: false, erklaerung: 'Er fragt nicht, er antwortet und stellt Daten bereit.' },
      { text: 'Server', ok: true, erklaerung: 'Genau! Er beantwortet Anfragen und stellt Daten bereit: ein Server.' },
    ],
  },
  {
    frage: 'Im Serverraum läuft ein Programm, das allen Schul-PCs den Stundenplan schickt. Ist das Programm ein Server?',
    optionen: [
      { text: 'Ja', ok: true, erklaerung: 'Richtig! Ein Server muss kein großes Gerät sein. Oft ist er einfach ein Programm.' },
      { text: 'Nein, nur Geräte sind Server', ok: false, erklaerung: 'Server sind oft einfach Programme, die Anfragen beantworten.' },
    ],
  },
  {
    frage: 'Alle 30 PCs im Raum fragen gleichzeitig nach dem Stundenplan. Welches Problem kann entstehen?',
    optionen: [
      { text: 'Der Server wird überlastet', ok: true, erklaerung: 'Genau! Fällt der Server aus oder ist überlastet, bekommt niemand mehr eine Antwort.' },
      { text: 'Die PCs werden zu Servern', ok: false, erklaerung: 'Die PCs bleiben Clients. Aber was passiert mit dem einen Server bei so vielen Anfragen?' },
      { text: 'Gar keins', ok: false, erklaerung: 'Stell dir vor, 30 Leute fragen dich gleichzeitig etwas …' },
    ],
  },
];

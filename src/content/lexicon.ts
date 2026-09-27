import type { LexiconId } from './registry';

/**
 * Netzbuch-Einträge. Sie werden erst NACH einer Entdeckung freigeschaltet (induktiv).
 * `stufe` und `lehrplan` dienen der Spiralcurriculum-Prüfung.
 */
export interface LexiconEntry {
  titel: string;
  text: string;
  stufe: number;
  lehrplan: string;
}

export const LEXICON: Record<LexiconId, LexiconEntry> = {
  kabel: {
    titel: 'Kabel',
    text: 'Unter Straßen und in Wänden liegen Kabel. Über sie reisen Daten von Gerät zu Gerät – man sieht sie nur nicht.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 2 (Informatiksysteme) – Einblick',
  },
  kabelverzweiger: {
    titel: 'Der graue Kasten',
    text: 'Die grauen Kästen am Straßenrand heißen Kabelverzweiger. Hier laufen die Leitungen aus vielen Häusern zusammen und gehen gemeinsam weiter in die Stadt.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 2 (Informatiksysteme) – Einblick',
  },
  information_daten: {
    titel: 'Information und Daten',
    text: 'Auf dem Papier stehen nur Zeichen: Das sind Daten. Erst wenn jemand sie liest und versteht, werden daraus Informationen. Damit Lina weiß, wann und wo gefeiert wird, müssen die Daten vollständig und eindeutig sein.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 1 – Begriffe Informationen und Daten',
  },
  uebertragung: {
    titel: 'Übertragung braucht Zeit',
    text: 'Dein Brief reiste vom Briefkasten über das Postauto und das Briefzentrum bis zu Linas Briefkasten: 2 Tage und 3 Stunden. Wie lange Daten unterwegs sind, hängt vom Weg und vom Transportmittel ab.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 1 – Übertragungsrate (Einstieg)',
  },
  eva: {
    titel: 'Eingabe – Verarbeitung – Ausgabe',
    text: 'EVA-Prinzip: Eingabegeräte (Kamera, Mikrofon, Taster) nehmen etwas auf, der Prozessor verarbeitet es, Ausgabegeräte (Display, Lautsprecher) geben etwas aus. Damit sich ein Gerät etwas dauerhaft merkt, braucht es einen Speicher.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 2 – EVA-Modell, Erweiterung um Speichern',
  },
  // derzeit ungenutzt (Minispiel entfernt), bleibt wegen der Speichercodes im Register
  betriebssystem: {
    titel: 'Betriebssystem',
    text: 'Das Betriebssystem ist das wichtigste Programm eines Computers. Es verwaltet den Speicher, steuert die Geräte an, ordnet Dateien und startet und beendet Programme. Handys, Laptops und sogar die Brille haben eins.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 2 – Aufgaben des Betriebssystems',
  },
  binaerzahlen: {
    titel: 'Binärzahlen',
    text: 'Computer kennen nur zwei Zustände: an (1) und aus (0). Jede Stelle einer Binärzahl hat einen Wert: 128, 64, 32, 16, 8, 4, 2, 1. Man addiert die Werte, bei denen eine 1 steht: 00101010 = 32 + 8 + 2 = 42. Eine Stelle heißt Bit, acht Bit sind ein Byte.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 1 – Darstellen von Daten als Binärzahlen (Dezimalzahlen)',
  },
  bilder_als_zahlen: {
    titel: 'Bilder als Zahlen',
    text: 'Ein Pixelbild besteht aus vielen kleinen Punkten. Bei einem Schwarz-Weiß-Bild steht jede 1 für einen schwarzen und jede 0 für einen weißen Punkt. So wird aus Zahlen ein Bild – und aus einem Bild werden Zahlen.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 1 – Darstellen von Daten als Binärzahlen (Bild)',
  },
  text_als_zahlen: {
    titel: 'Text als Zahlen',
    text: 'Auch Buchstaben kann man als Zahlen speichern. Man braucht nur eine Tabelle, die jedem Buchstaben eine Zahl zuordnet – im Museum war A = 1, B = 2 und so weiter. Wer die Tabelle kennt, kann den Text zurückübersetzen.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 1 – Darstellen von Daten als Binärzahlen (Text)',
  },
  pioniere: {
    titel: 'Pioniere der Rechentechnik',
    text: 'Schickard (Rechenuhr, 1623), Pascal (Rechenmaschine, 1642), Leibniz (Binärsystem, 1703), Ada Lovelace (erstes Programm, 1843), Alan Turing (Turingmaschine, 1936), Konrad Zuse (Z3, 1941), John von Neumann (Bauplan heutiger Computer, 1945).',
    stufe: 7,
    lehrplan: 'SN Kl. 7 WB 3 – Geschichte der Rechentechnik',
  },
  algorithmus: {
    titel: 'Algorithmus',
    text: 'Eine genaue Schritt-für-Schritt-Anleitung heißt Algorithmus. Krümel führt die Befehle der Reihe nach aus (Sequenz). Ist ein Schritt falsch oder fehlt einer, kommt Krümel nicht ans Ziel – Computer machen genau das, was man ihnen sagt.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 3 – Algorithmen, Umsetzung verbaler Beschreibungen in Blöcke',
  },
  zustandsdiagramm: {
    titel: 'Zustandsdiagramm',
    text: 'Viele Geräte sind immer in einem bestimmten Zustand, z. B. „saugen" oder „laden". Ein Ereignis wie „Akku leer" führt zu einem anderen Zustand. Ein Zustandsdiagramm zeigt die Zustände als Kästen und die Übergänge als Pfeile.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 2 – Zustandsdiagramm, Übergangsgraph',
  },
  farbkanaele: {
    titel: 'Farbkanäle',
    text: 'Ein Farbbild besteht aus drei Kanälen: Rot, Grün und Blau. Fehlt ein Kanal, stimmen die Farben nicht. Ein Negativ vertauscht hell und dunkel. Bei Graustufen hat jeder Punkt nur eine Helligkeit.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 WB 2 – Computergrafik (Farbkanäle, Graustufen, Negativ)',
  },
  objekt: {
    titel: 'Objekt und Klasse',
    text: 'Morse ist ein Objekt der Klasse „Katze". Eine Klasse ist der Bauplan, ein Objekt ein konkretes Ding. Objekte haben Attribute mit Werten (Farbe = grau) und Methoden, also Dinge, die sie tun können (miauen()).',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 1 – Objektorientierung: Klasse, Objekt, Attribut, Methode',
  },
};

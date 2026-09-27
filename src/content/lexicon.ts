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
  objekt: {
    titel: 'Objekt und Klasse',
    text: 'Morse ist ein Objekt der Klasse „Katze". Eine Klasse ist der Bauplan, ein Objekt ein konkretes Ding. Objekte haben Attribute mit Werten (Farbe = grau) und Methoden, also Dinge, die sie tun können (miauen()).',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 1 – Objektorientierung: Klasse, Objekt, Attribut, Methode',
  },
};

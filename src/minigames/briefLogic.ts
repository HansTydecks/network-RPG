/**
 * Brief an Lina: Inhalt (Information vs. Daten, Kl. 7) und Umschlag (Adresse als Erfahrung).
 * Nur vollständige und eindeutige Angaben werden akzeptiert – so merkt man induktiv,
 * welche Daten nötig sind, damit beim Empfänger die richtige Information ankommt.
 */
export interface BriefOption {
  text: string;
  ok: boolean;
  kommentar?: string;
}

export interface BriefSlot {
  frage: string;
  optionen: BriefOption[];
}

export const BRIEF_SLOTS: BriefSlot[] = [
  {
    frage: 'Wie beginnst du den Brief?',
    optionen: [
      { text: 'Hallo Lina,', ok: true },
      { text: 'Sehr geehrte Frau Wagner,', ok: true, kommentar: 'Ganz schön förmlich für eine Freundin! Aber gut.' },
      { text: 'Hey du,', ok: false, kommentar: '„Hey du" – wer ist gemeint? Wenn Mama den Brief findet, weiß sie nicht, für wen er ist.' },
    ],
  },
  {
    frage: 'Was möchtest du Lina mitteilen?',
    optionen: [
      { text: 'ich lade dich zu meinem Geburtstag ein!', ok: true },
      { text: 'mir ist langweilig.', ok: false, kommentar: 'Dann weiß Lina gar nicht, dass sie eingeladen ist.' },
      { text: 'du weißt schon.', ok: false, kommentar: 'Weiß Lina das wirklich? Schreib lieber genau hin, worum es geht.' },
    ],
  },
  {
    frage: 'Wann ist die Feier?',
    optionen: [
      { text: 'Die Feier ist irgendwann am Wochenende', ok: false, kommentar: '„Irgendwann"? Dann weiß Lina nicht, wann sie kommen soll.' },
      { text: 'Die Feier ist am Samstag um 15 Uhr', ok: true },
      { text: 'Die Feier ist bald', ok: false, kommentar: 'Wann ist „bald"? Morgen? Nächstes Jahr?' },
    ],
  },
  {
    frage: 'Wo wird gefeiert?',
    optionen: [
      { text: 'bei mir.', ok: false, kommentar: 'Lina war noch nie bei dir zu Hause. Woher soll sie wissen, wo „bei mir" ist?' },
      { text: 'bei mir zu Hause, Dorfstraße 3 in Kabelitz.', ok: true },
    ],
  },
  {
    frage: 'Wie verabschiedest du dich?',
    optionen: [
      { text: 'Tschüss!', ok: false, kommentar: 'Von wem ist der Brief? Lina muss wissen, wer sie einlädt.' },
      { text: 'Bis Samstag! Alex', ok: true },
    ],
  },
];

/** Die drei Zeilen der Empfängeradresse in richtiger Reihenfolge. */
export const ADRESSE = ['Lina Wagner', 'Lindenweg 7', '09400 Knotenburg'] as const;

export const ADRESS_HINWEIS = [
  'In die erste Zeile gehört, WER den Brief bekommt.',
  'In die zweite Zeile gehört, WO genau das Haus steht: Straße und Hausnummer.',
  'In die letzte Zeile gehören Postleitzahl und Ort.',
];

/** Absender (drei Zeilen, damit er neben die Briefmarke passt). */
export const ABSENDER = ['Alex', 'Dorfstraße 3', '09421 Kabelitz'];

export function briefText(auswahl: number[]): string[] {
  return auswahl.map((opt, slot) => BRIEF_SLOTS[slot].optionen[opt].text);
}

import type { QuizFrage } from './quiz';

/**
 * Inhalte der Minispiele aus M2b (alle SN Kl. 7). Ohne Phaser, damit sie testbar sind.
 */

// ---------- Einheiten-Händler (LB 1: Präfixe, SI- und Binärpräfixe) ----------
export const EINHEITEN_FRAGEN: QuizFrage[] = [
  {
    frage: 'Hubert: „Ich tausche 1 KB gegen 1.000 Byte. Guter Tausch, was?"',
    optionen: [
      { text: 'Das ist genau gleich viel.', ok: true, erklaerung: 'Kilo heißt tausend: 1 KB = 1.000 Byte.' },
      { text: '1 KB ist viel mehr.', ok: false, erklaerung: 'Kilo kennst du vom Kilometer: 1 km = 1.000 m. Genauso ist 1 KB = 1.000 Byte.' },
      { text: '1.000 Byte sind mehr.', ok: false, erklaerung: 'Rechne nach: Kilo bedeutet tausend.' },
    ],
  },
  {
    frage: 'Hubert: „Und was ist mehr: 1.500 MB oder 1,2 GB?"',
    optionen: [
      { text: '1,2 GB', ok: false, erklaerung: '1 GB = 1.000 MB, also sind 1,2 GB = 1.200 MB.' },
      { text: '1.500 MB', ok: true, erklaerung: '1,2 GB sind nur 1.200 MB – 1.500 MB sind mehr.' },
      { text: 'Beides gleich', ok: false, erklaerung: 'Rechne GB in MB um: mal 1.000.' },
    ],
  },
  {
    frage: 'Hubert: „Mein 64-GB-Stick zeigt am Computer nur 59,6 GiB an. Kaputt! Kaufst du ihn mir trotzdem ab – für die Hälfte?"',
    optionen: [
      { text: 'Der Stick ist kaputt, lieber nicht.', ok: false, erklaerung: 'Kaputt ist er nicht! Schau mal auf die Einheit: GB oder GiB?' },
      { text: 'Der Stick ist in Ordnung – GiB ist eine andere Einheit.', ok: true, erklaerung: 'Computer rechnen oft mit 1.024 statt 1.000: 64 GB sind etwa 59,6 GiB. Gleich viel Platz, nur anders gezählt.' },
    ],
  },
  {
    frage: 'Hubert: „Letzte Frage: 1 MiB oder 1 MB – was ist mehr?"',
    optionen: [
      { text: '1 MB', ok: false, erklaerung: 'MiB rechnet mit 1.024: 1 MiB = 1.024 × 1.024 Byte.' },
      { text: '1 MiB', ok: true, erklaerung: '1 MiB = 1.048.576 Byte, 1 MB = 1.000.000 Byte.' },
      { text: 'Gleich viel', ok: false, erklaerung: 'Das „i" macht den Unterschied: Mebi rechnet mit 1.024.' },
    ],
  },
];

// ---------- Datei-Chaos (LB 2: Dateityp ↔ Anwendung, Dateinamen; LB 1: Speicherkapazität) ----------
export const DATEI_FRAGEN: QuizFrage[] = [
  {
    frage: 'Frau Lehmann: „Womit öffne ich tombola.xlsx?"',
    optionen: [
      { text: 'Mit der Tabellenkalkulation', ok: true, erklaerung: '.xlsx ist eine Tabelle.' },
      { text: 'Mit dem Musikplayer', ok: false, erklaerung: 'Musik endet auf .mp3. Was bedeutet .xlsx?' },
      { text: 'Mit dem Bildprogramm', ok: false, erklaerung: 'Bilder enden auf .png oder .jpg.' },
    ],
  },
  {
    frage: '„Und plakat.png?"',
    optionen: [
      { text: 'Mit der Textverarbeitung', ok: false, erklaerung: 'Texte enden auf .docx. .png ist etwas anderes.' },
      { text: 'Mit dem Bildprogramm', ok: true, erklaerung: '.png ist eine Bilddatei.' },
      { text: 'Mit dem Videoplayer', ok: false, erklaerung: 'Videos enden auf .mp4.' },
    ],
  },
  {
    frage: '„Und festmusik.mp3?"',
    optionen: [
      { text: 'Mit dem Musikplayer', ok: true, erklaerung: '.mp3 ist eine Audiodatei.' },
      { text: 'Mit der Tabellenkalkulation', ok: false, erklaerung: 'Tabellen enden auf .xlsx.' },
    ],
  },
  {
    frage: '„Diese Datei heißt Neues Dokument (7) final FINAL.docx. Welcher Name ist besser?"',
    optionen: [
      { text: 'asdf.docx', ok: false, erklaerung: 'Daran erkennt später niemand, was drin ist.' },
      { text: 'Dorffest_Ablauf.docx', ok: true, erklaerung: 'Ein guter Name sagt, was in der Datei steht.' },
      { text: 'Datei.docx', ok: false, erklaerung: 'Zu allgemein – jede Datei ist eine Datei.' },
    ],
  },
];

export interface StickDatei {
  name: string;
  mb: number;
  pflicht: boolean;
  gruppe?: 'medien';
}

export const STICK_KAPAZITAET_MB = 4000;

export const STICK_DATEIEN: StickDatei[] = [
  { name: 'Dorffest_Ablauf.docx', mb: 0.05, pflicht: true },
  { name: 'tombola.xlsx', mb: 0.03, pflicht: true },
  { name: 'plakat.png', mb: 8, pflicht: true },
  { name: 'festmusik.mp3', mb: 120, pflicht: true },
  { name: 'festvideo_2025.mp4', mb: 3200, pflicht: false, gruppe: 'medien' },
  { name: '800 Fotos (je 4 MB)', mb: 3200, pflicht: false, gruppe: 'medien' },
];

/** Passt die Auswahl auf den Stick, ist alles Wichtige dabei und genau eins von Video/Fotos? */
export function stickPasst(auswahl: boolean[]): { ok: boolean; mb: number; grund?: string } {
  const mb = STICK_DATEIEN.reduce((s, d, i) => s + (auswahl[i] ? d.mb : 0), 0);
  if (mb > STICK_KAPAZITAET_MB) return { ok: false, mb, grund: 'Zu viel! Der Stick hat nur 4 GB = 4.000 MB.' };
  if (STICK_DATEIEN.some((d, i) => d.pflicht && !auswahl[i])) return { ok: false, mb, grund: 'Es fehlt noch etwas Wichtiges für das Fest.' };
  if (!STICK_DATEIEN.some((d, i) => d.gruppe === 'medien' && auswahl[i])) return { ok: false, mb, grund: 'Frau Lehmann möchte das Video ODER die Fotos zeigen.' };
  return { ok: true, mb };
}

// ---------- Tabellenkalkulation (LB 1: Automatisierung) ----------
export const KUCHEN = [
  { name: 'Stollen', preis: 2, anzahl: 12 },
  { name: 'Eierschecke', preis: 1.5, anzahl: 20 },
  { name: 'Apfelkuchen', preis: 1.5, anzahl: 16 },
  { name: 'Muffins', preis: 1, anzahl: 30 },
];

export const TABELLE_FRAGEN_TEXT = [
  { frage: 'In D2 soll stehen, wie viel Geld der Stollen bringt. Welche Formel passt?', optionen: ['=B2*C2', '=B2+C2', '=D2'], richtig: 0 },
  { frage: 'Die Formel wird nach unten kopiert. In D6 soll die Gesamtsumme stehen. Welche Formel?', optionen: ['=D2+D5', '=SUMME(D2:D5)', '=SUMME(B2:B5)'], richtig: 1 },
];

export function kuchenSumme(): number {
  return KUCHEN.reduce((s, k) => s + k.preis * k.anzahl, 0);
}

// ---------- Was ist schneller? (LB 1: Übertragungsrate) ----------
/** Annahmen: Internet 50 Mbit/s ≈ 6 MB/s; Ping fliegt 10 km in 20 Minuten mit einer microSD-Karte. */
export const INTERNET_MB_PRO_S = 6;
export const PING_MINUTEN = 20;

export function internetSekunden(mb: number): number {
  return mb / INTERNET_MB_PRO_S;
}

export const SCHNELLER_FRAGEN: QuizFrage[] = [
  {
    frage: 'Eine kurze Nachricht (1 KB) an Lina nach Knotenburg. Was ist am schnellsten?',
    optionen: [
      { text: 'Ein Brief', ok: false, erklaerung: 'Ein Brief braucht mindestens einen Tag.' },
      { text: 'Das Internet', ok: true, erklaerung: '1 KB ist winzig – in einem Bruchteil einer Sekunde ist die Nachricht da.' },
      { text: 'Ping mit einer Speicherkarte', ok: false, erklaerung: 'Ping braucht 20 Minuten. Das Internet ist viel schneller.' },
    ],
  },
  {
    frage: '200 Urlaubsfotos (800 MB) an Lina. Internet: ca. 6 MB pro Sekunde. Ping: 20 Minuten. Was ist schneller?',
    optionen: [
      { text: 'Das Internet', ok: true, erklaerung: '800 MB ÷ 6 MB/s ≈ 133 Sekunden, also gut 2 Minuten. Ping bräuchte 20 Minuten.' },
      { text: 'Ping mit einer Speicherkarte', ok: false, erklaerung: 'Rechne: 800 MB ÷ 6 MB pro Sekunde ≈ 133 Sekunden. Wie lange braucht Ping?' },
    ],
  },
  {
    frage: 'Das ganze Filmarchiv des Museums (2 TB = 2.000.000 MB) zu Lina. Was ist schneller?',
    optionen: [
      { text: 'Das Internet', ok: false, erklaerung: '2.000.000 MB ÷ 6 MB/s ≈ 333.333 Sekunden – fast 4 Tage! Wie lange braucht Ping?' },
      { text: 'Ping mit einer 2-TB-Speicherkarte', ok: true, erklaerung: 'Ping braucht nur 20 Minuten, das Internet fast 4 Tage! Bei riesigen Datenmengen gewinnt die Taube.' },
    ],
  },
];

// ---------- Kabelsalat (LB 1: Binär ↔ Dezimal) ----------
export const KABELSALAT_ANSCHLUESSE = [5, 12, 19, 24, 33];

// ---------- Pfandautomat: kommt in zustandLogic.ts als Aufgabe „pfand" ----------

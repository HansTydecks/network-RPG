/**
 * Logik der wiederverwendbaren Minispiele (ohne Phaser, testbar).
 */
import type { QuizFrage } from './quiz';

// ---------- Zuordnen: jede Karte gehört in genau eine Kategorie ----------
export interface ZuordnenKarte {
  text: string;
  kategorie: number;
  /** Erklärung, warum die Karte in diese Kategorie gehört. */
  warum: string;
}

/** Baut aus Karten und Kategorien ein Quiz mit fester Knopf-Reihenfolge. */
export function zuordnen(frage: string, kategorien: string[], karten: ZuordnenKarte[]): QuizFrage[] {
  const kurz = kategorien.every((k) => k.length <= 12);
  return karten.map((k) => ({
    frage: `${frage}\n${k.text}`,
    festeReihenfolge: true,
    nebeneinander: kurz,
    optionen: kategorien.map((name, i) => ({
      text: name,
      ok: i === k.kategorie,
      erklaerung: i === k.kategorie ? k.warum : `Nicht ganz. ${k.warum}`,
    })),
  }));
}

// ---------- Reihenfolge ----------
export interface ReihenfolgeAufgabe {
  titel: string;
  intro: string;
  /** Schritte in der richtigen Reihenfolge. */
  schritte: string[];
  /** Hinweis, wenn ein Schritt zu früh gewählt wird (optional je Schritt). */
  hinweise?: string[];
  schluss: string;
}

/** Ist `gewaehlt` der richtige nächste Schritt, nachdem `fertig` Schritte gelegt sind? */
export function naechsterSchrittRichtig(a: ReihenfolgeAufgabe, fertig: number, gewaehlt: string): boolean {
  return a.schritte[fertig] === gewaehlt;
}

// ---------- Caesar ----------
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Verschiebt jeden Buchstaben um `n` Stellen im Alphabet (andere Zeichen bleiben). */
export function caesar(text: string, n: number): string {
  return [...text.toUpperCase()]
    .map((c) => {
      const i = ABC.indexOf(c);
      return i < 0 ? c : ABC[(((i + n) % 26) + 26) % 26];
    })
    .join('');
}

// ---------- Passwortsicherheit ----------
export const ZEICHENVORRAT = [
  { name: 'nur Ziffern', anzahl: 10 },
  { name: 'Kleinbuchstaben', anzahl: 26 },
  { name: 'Groß- und Kleinbuchstaben', anzahl: 52 },
  { name: 'Buchstaben und Ziffern', anzahl: 62 },
  { name: 'Buchstaben, Ziffern, Sonderzeichen', anzahl: 94 },
];

/** Annahme: Ein Angriffsrechner probiert 10 Milliarden Passwörter pro Sekunde. */
export const VERSUCHE_PRO_SEKUNDE = 1e10;

export function kombinationen(vorrat: number, laenge: number): number {
  return Math.pow(vorrat, laenge);
}

/** Mittlere Zeit zum Knacken (Hälfte aller Möglichkeiten) in Sekunden. */
export function knackzeitSekunden(vorrat: number, laenge: number): number {
  return kombinationen(vorrat, laenge) / 2 / VERSUCHE_PRO_SEKUNDE;
}

export function zeitText(sek: number): string {
  if (sek < 1) return 'weniger als 1 Sekunde';
  if (sek < 60) return `${Math.round(sek)} Sekunden`;
  if (sek < 3600) return `${Math.round(sek / 60)} Minuten`;
  if (sek < 86400) return `${Math.round(sek / 3600)} Stunden`;
  if (sek < 31536000) return `${Math.round(sek / 86400)} Tage`;
  const jahre = sek / 31536000;
  if (jahre < 1e6) return `${Math.round(jahre).toLocaleString('de-DE')} Jahre`;
  return `mehr als eine Million Jahre`;
}

export function zahlText(n: number): string {
  if (n < 1e7) return Math.round(n).toLocaleString('de-DE');
  const exp = Math.floor(Math.log10(n));
  return `ca. 10 hoch ${exp}`;
}

/** Ziel der Passwort-Schmiede: mindestens 100 Jahre. */
export const PASSWORT_ZIEL_SEKUNDEN = 100 * 31536000;

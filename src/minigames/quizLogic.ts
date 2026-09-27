/** Datentypen und Hilfsfunktionen des Quiz (ohne Phaser, für Inhalte und Tests). */
import type Phaser from 'phaser';
import { measureText } from '../engine/gfx/fontGlyphs';

export interface QuizOption {
  text: string;
  ok: boolean;
  /** Erklärung nach der Antwort (bei falscher Antwort als Denkanstoß). */
  erklaerung: string;
}

export interface QuizFrage {
  frage: string;
  optionen: QuizOption[];
  /** Optional: eigene Zeichnung im Bereich y 22–124 (z. B. eine Tabelle). Liefert erzeugte Objekte zurück. */
  bild?: (scene: Phaser.Scene, g: Phaser.GameObjects.Graphics, fertig: boolean) => Phaser.GameObjects.GameObject[];
  /** Wo die Antworten stehen: unter der Frage (Standard) oder rechts neben einem Bild. */
  antwortenX?: number;
  /** Kurze Antworten (z. B. Formeln) nebeneinander in einer Zeile. */
  nebeneinander?: boolean;
  /** Antworten nicht mischen (z. B. „links"/„rechts" passend zum Bild). */
  festeReihenfolge?: boolean;
  /** Eine Tabelle unter der Frage (z. B. Datenbank, Routingtabelle). */
  tabelle?: { kopf: string[]; zeilen: string[][] };
  /** Programmcode oder HTML unter der Frage, Zeile für Zeile. */
  code?: string[];
}

/** Spaltenbreiten einer Tabelle (gemeinsam mit den Tests genutzt). */
export function tabellenBreiten(t: { kopf: string[]; zeilen: string[][] }): number[] {
  return t.kopf.map((k, i) => Math.max(measureText(k), ...t.zeilen.map((z) => measureText(z[i] ?? ''))) + 8);
}

/** Höhe von Tabelle bzw. Code in Pixeln. */
export function zusatzHoehe(f: QuizFrage): number {
  let h = 0;
  if (f.tabelle) h += (f.tabelle.zeilen.length + 1) * 11 + 6;
  if (f.code) h += f.code.length * 10 + 8;
  return h;
}

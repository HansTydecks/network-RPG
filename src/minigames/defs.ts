/**
 * Minispiele als reine Daten (ohne Phaser). Die Kapitel-Dateien in src/content/spiele/
 * beschreiben ihre Spiele so; index.ts macht daraus spielbare Minispiele, meta.ts die Metadaten.
 */
import type { QuizFrage } from './quiz';
import type { ReihenfolgeAufgabe } from './generischLogic';
import type { CaesarAufgabe, Kampf } from './generischTypen';

export interface SpielMeta {
  titel: string;
  stufe: number;
  lehrplan: string;
}

export type SpielDef = SpielMeta &
  (
    | { art: 'quiz'; fragen: QuizFrage[]; schluss: string; intro?: string }
    | { art: 'reihenfolge'; aufgabe: ReihenfolgeAufgabe }
    | { art: 'kampf'; kampf: Kampf }
    | { art: 'caesar'; aufgabe: CaesarAufgabe }
    | { art: 'passwort' }
  );

import { normalizeCode } from './base32';
import { sha256Hex } from './sha256';
import type { Stufe } from './GameState';

/**
 * Klassenstufen-Codes für den Schulkalender in Alex' Zimmer.
 * Hier stehen nur gesalzene SHA-256-Hashwerte. Die Klartext-Codes kennt nur die Lehrkraft
 * (Lehrerhandbuch, nicht im Repository). Neue Hashes erzeugt: `node tools/kalender-code.mjs CODE`.
 */
export const CALENDAR_SALT = 'netzblick-kalender-v1:';

export interface CalendarEntry {
  stufe: Stufe;
  hash: string;
}

export function hashCalendarCode(code: string): string {
  return sha256Hex(CALENDAR_SALT + normalizeCode(code));
}

/** Liefert die freigeschaltete Klassenstufe oder null, wenn der Code nicht stimmt. */
export function checkCalendarCode(code: string, entries: readonly CalendarEntry[]): Stufe | null {
  const h = hashCalendarCode(code);
  return entries.find((e) => e.hash === h)?.stufe ?? null;
}

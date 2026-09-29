/**
 * Kleine Geheimnisse, die nur im Browser gespeichert werden (rein kosmetisch,
 * gehören nicht zum Speichercode).
 */
const SONNENBRILLE = 'netzblick_ping_cool';

export function pingMitSonnenbrille(): boolean {
  try {
    return localStorage.getItem(SONNENBRILLE) === '1';
  } catch {
    return false;
  }
}

export function setzePingSonnenbrille(an: boolean) {
  try {
    if (an) localStorage.setItem(SONNENBRILLE, '1');
    else localStorage.removeItem(SONNENBRILLE);
  } catch {
    /* ohne Speicher eben ohne Brille */
  }
}

/** Der Konami-Code: ↑ ↑ ↓ ↓ ← → ← → B A */
export const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

/** Prüft, ob die letzten Tasten den Konami-Code ergeben. */
export function konamiErkannt(verlauf: string[]): boolean {
  return verlauf.length >= KONAMI.length && KONAMI.every((k, i) => verlauf[verlauf.length - KONAMI.length + i] === k);
}

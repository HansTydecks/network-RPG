import { decodeSaveCode, encodeSaveCode } from './SaveCode';
import type { GameState } from './GameState';

const KEY = 'netzblick.spielstand';

/** Automatisches Speichern im Browser. Kann auf Schulrechnern fehlen – daher immer try/catch. */
export function autosave(state: GameState): string {
  const code = encodeSaveCode(state);
  try {
    localStorage.setItem(KEY, code);
  } catch {
    /* Speicher nicht verfügbar – der Speichercode bleibt der Weg zurück. */
  }
  return code;
}

export function loadAutosave(): GameState | null {
  try {
    const code = localStorage.getItem(KEY);
    return code ? decodeSaveCode(code) : null;
  } catch {
    return null;
  }
}

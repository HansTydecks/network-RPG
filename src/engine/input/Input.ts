/**
 * Einheitliche Eingabe: Tastatur, Gamepad-ähnliche Touch-Knöpfe und Klicks landen
 * auf denselben virtuellen Tasten. Szenen fragen nur „ist A gerade gedrückt worden?".
 */
export type Button = 'up' | 'down' | 'left' | 'right' | 'a' | 'b' | 'menu' | 'help' | 'net';

const KEYMAP: Record<string, Button> = {
  ArrowUp: 'up', KeyW: 'up',
  ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  Space: 'a', Enter: 'a', KeyE: 'a',
  Escape: 'b', Backspace: 'b', ShiftLeft: 'b', ShiftRight: 'b', KeyX: 'b',
  KeyM: 'menu', Tab: 'menu',
  KeyH: 'help',
  KeyN: 'net',
};

export class Input {
  private held = new Set<Button>();
  private pressedThisFrame = new Set<Button>();
  private pending = new Set<Button>();
  private heldSince = new Map<Button, number>();
  /** Getippte Zeichen (für Code-Eingaben). */
  private typed: string[] = [];
  /** Solange true, landen Buchstaben nur in `typed` (Code-Eingabe). */
  textMode = false;

  constructor(target: Window = window) {
    target.addEventListener('keydown', (e) => {
      if (this.textMode && e.key.length === 1) {
        this.typed.push(e.key);
        e.preventDefault();
        return;
      }
      if (this.textMode && e.code === 'Enter') {
        this.typed.push('\n');
        e.preventDefault();
        return;
      }
      if (this.textMode && e.code === 'Backspace') {
        this.typed.push('\b');
        e.preventDefault();
        return;
      }
      const b = KEYMAP[e.code];
      if (!b) return;
      e.preventDefault();
      if (!e.repeat) this.press(b);
    });
    target.addEventListener('keyup', (e) => {
      const b = KEYMAP[e.code];
      if (b) this.release(b);
    });
    target.addEventListener('blur', () => {
      for (const b of [...this.held]) this.release(b);
    });
  }

  press(b: Button) {
    if (!this.held.has(b)) {
      this.held.add(b);
      this.heldSince.set(b, performance.now());
      this.pending.add(b);
    }
  }

  /** Kurzer Druck ohne Halten (z. B. Tippen auf den Bildschirm). */
  tap(b: Button) {
    this.pending.add(b);
  }

  release(b: Button) {
    this.held.delete(b);
    this.heldSince.delete(b);
  }

  /** Einmal pro Spielschritt aufrufen. */
  update() {
    this.pressedThisFrame = this.pending;
    this.pending = new Set();
  }

  isDown(b: Button): boolean {
    return this.held.has(b);
  }

  justPressed(b: Button): boolean {
    return this.pressedThisFrame.has(b);
  }

  /** Verbraucht einen Tastendruck, damit ihn nicht zwei Systeme gleichzeitig auswerten. */
  consume(b: Button): boolean {
    if (!this.pressedThisFrame.has(b)) return false;
    this.pressedThisFrame.delete(b);
    return true;
  }

  heldFor(b: Button): number {
    const t = this.heldSince.get(b);
    return t === undefined ? 0 : performance.now() - t;
  }

  takeTyped(): string[] {
    const t = this.typed;
    this.typed = [];
    return t;
  }

  /** Aktuell gehaltene Richtung (letzte gedrückte gewinnt). */
  direction(): 'up' | 'down' | 'left' | 'right' | null {
    let best: 'up' | 'down' | 'left' | 'right' | null = null;
    let bestT = -1;
    for (const d of ['up', 'down', 'left', 'right'] as const) {
      const t = this.heldSince.get(d);
      if (t !== undefined && t > bestT) {
        best = d;
        bestT = t;
      }
    }
    return best;
  }
}

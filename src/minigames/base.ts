import Phaser from 'phaser';
import { PAL } from '../engine/gfx/palette';
import { wrapText } from '../engine/gfx/fontGlyphs';
import type { Input } from '../engine/input/Input';
import type { GameState } from '../engine/state/GameState';
import { drawPanel, screenContainer, uiText, type Modal } from '../engine/ui/widgets';

/** Rückmeldung: bis zu 3 Zeilen à FEEDBACK_WIDTH px. Inhalte eines Minispiels enden bei y = 124. */
export const FEEDBACK_LINES = 3;
export const FEEDBACK_WIDTH = 300;

export interface MinigameContext {
  scene: Phaser.Scene;
  input: Input;
  state: GameState;
  push(modal: Modal): void;
  /** Optionaler Parameter aus dem Script, z. B. das Level bei minigame('bloecke:gully'). */
  param?: string;
}

/** Ein Minispiel ist eine Funktion, die das Minispiel zeigt und endet, wenn es geschafft ist. */
export type Minigame = (ctx: MinigameContext) => Promise<void>;

/**
 * Grundgerüst für Minispiele: Vollbild-Tafel mit Titel, Anleitung und Rückmeldezeile.
 * `solutionKeys()` liefert für automatische Tests die nächsten richtigen Tasten.
 */
export abstract class MinigameModal implements Modal {
  done = false;
  protected root: Phaser.GameObjects.Container;
  protected gfx: Phaser.GameObjects.Graphics;
  private feedbackLines: Phaser.GameObjects.BitmapText[] = [];
  private helpText: Phaser.GameObjects.BitmapText;

  constructor(protected scene: Phaser.Scene, title: string, help: string, private resolve: () => void) {
    this.root = screenContainer(scene, 1200);
    this.gfx = scene.add.graphics();
    drawPanel(this.gfx, 0, 0, 320, 180, PAL.ink, 1);
    this.root.add(this.gfx);
    this.root.add(uiText(scene, 10, 8, title, PAL.gelb));
    this.helpText = uiText(scene, 10, 166, help, PAL.grau3);
    this.root.add(this.helpText);
    for (let i = 0; i < FEEDBACK_LINES; i++) {
      const t = uiText(scene, 10, 129 + i * 11, '', PAL.netzKabel);
      this.feedbackLines.push(t);
      this.root.add(t);
    }
    (window as unknown as { __minigame?: MinigameModal }).__minigame = this;
  }

  protected setHelp(text: string) {
    this.helpText.setText(text);
  }

  protected feedback(text: string, color: string = PAL.netzKabel) {
    const lines = wrapText(text, FEEDBACK_WIDTH);
    if (lines.length > FEEDBACK_LINES) console.warn(`Rückmeldung zu lang (${lines.length} Zeilen): ${text}`);
    this.feedbackLines.forEach((l, i) => l.setText(lines[i] ?? '').setTint(parseInt(color.slice(1), 16)));
  }

  protected finish() {
    if (this.done) return;
    this.done = true;
    (window as unknown as { __minigame?: MinigameModal }).__minigame = undefined;
    this.resolve();
  }

  /** Für Tests: welche Tasten jetzt richtig wären (z. B. ['ArrowDown', 'Space']). */
  abstract solutionKeys(): string[];

  abstract update(input: Input, dt: number): void;

  destroy() {
    this.root.destroy(true);
  }
}

/** Mischt eine Liste reproduzierbar (gleicher Startwert → gleiche Reihenfolge). */
export function shuffled<T>(items: readonly T[], seed: number): T[] {
  const out = [...items];
  let a = seed >>> 0;
  const rnd = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

import Phaser from 'phaser';
import { FONT_KEY } from '../gfx/textures';
import { PAL, hexToInt } from '../gfx/palette';
import type { Input } from '../input/Input';

export const UI_DEPTH = 1000;
export const SCREEN_W = 320;
export const SCREEN_H = 180;

/** Fenster im Stil alter Konsolen-RPGs: dunkler Grund, heller Doppelrahmen. */
export function drawPanel(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, fill: string = PAL.ink) {
  g.fillStyle(hexToInt(fill), 0.96).fillRect(x, y, w, h);
  g.lineStyle(1, hexToInt(PAL.weiss), 1).strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
  g.lineStyle(1, hexToInt(PAL.grau2), 1).strokeRect(x + 3.5, y + 3.5, w - 7, h - 7);
}

export function uiText(scene: Phaser.Scene, x: number, y: number, text: string, color: string = PAL.weiss) {
  return scene.add.bitmapText(x, y, FONT_KEY, text).setTint(hexToInt(color)).setScrollFactor(0);
}

/** Ein modales UI-Element bekommt Eingaben, solange es oben auf dem Stapel liegt. */
export interface Modal {
  update(input: Input, dt: number): void;
  destroy(): void;
  done: boolean;
}

export class UiStack {
  private stack: Modal[] = [];
  get active(): boolean {
    return this.stack.length > 0;
  }
  push<T extends Modal>(m: T): T {
    this.stack.push(m);
    return m;
  }
  update(input: Input, dt: number) {
    const top = this.stack[this.stack.length - 1];
    if (!top) return;
    top.update(input, dt);
    if (top.done) {
      top.destroy();
      this.stack.pop();
    }
  }
  clear() {
    for (const m of this.stack) m.destroy();
    this.stack = [];
  }
}

/** Container, der fest am Bildschirm klebt (nicht mit der Kamera scrollt). */
export function screenContainer(scene: Phaser.Scene, depth = UI_DEPTH) {
  return scene.add.container(0, 0).setScrollFactor(0).setDepth(depth);
}

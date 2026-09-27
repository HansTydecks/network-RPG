import Phaser from 'phaser';
import { wrapText } from '../gfx/fontGlyphs';
import { PAL } from '../gfx/palette';
import type { Input } from '../input/Input';
import { SCREEN_W, drawPanel, screenContainer, uiText, type Modal } from './widgets';

const LINES = 3;
const BOX = { x: 4, y: 126, w: SCREEN_W - 8, h: 50 };
const TEXT_W = BOX.w - 20;
export const CHARS_PER_SECOND = 45;

/** Dialogfenster mit Schreibmaschinen-Effekt. A/Leertaste: beschleunigen bzw. weiter. */
export class DialogBox implements Modal {
  done = false;
  private root: Phaser.GameObjects.Container;
  private lines: Phaser.GameObjects.BitmapText[] = [];
  private arrow: Phaser.GameObjects.BitmapText;
  private pages: string[][];
  private page = 0;
  private shown = 0;
  private blink = 0;

  constructor(
    scene: Phaser.Scene,
    name: string | undefined,
    text: string,
    private resolve: () => void,
    /** Nach dem letzten Weiter offen bleiben (z. B. unter einer Auswahl), bis close() gerufen wird. */
    private hold = false,
  ) {
    this.root = screenContainer(scene, 1100);
    const g = scene.add.graphics();
    drawPanel(g, BOX.x, BOX.y, BOX.w, BOX.h);
    this.root.add(g);
    if (name) {
      const tag = scene.add.graphics();
      const w = name.length * 6 + 14;
      drawPanel(tag, BOX.x + 6, BOX.y - 13, w, 16, PAL.blau1);
      this.root.add(tag);
      this.root.add(uiText(scene, BOX.x + 13, BOX.y - 9, name, PAL.gelb));
    }
    for (let i = 0; i < LINES; i++) {
      const t = uiText(scene, BOX.x + 10, BOX.y + 8 + i * 12, '');
      this.lines.push(t);
      this.root.add(t);
    }
    this.arrow = uiText(scene, BOX.x + BOX.w - 14, BOX.y + BOX.h - 13, '▾', PAL.gelb).setVisible(false);
    this.root.add(this.arrow);
    const all = wrapText(text, TEXT_W);
    this.pages = [];
    for (let i = 0; i < all.length; i += LINES) this.pages.push(all.slice(i, i + LINES));
  }

  private pageLength(): number {
    return this.pages[this.page].join('').length;
  }

  private render() {
    let left = Math.floor(this.shown);
    this.pages[this.page].forEach((line, i) => {
      const n = Math.max(0, Math.min(line.length, left));
      this.lines[i].setText(line.slice(0, n));
      left -= line.length;
    });
    for (let i = this.pages[this.page].length; i < LINES; i++) this.lines[i].setText('');
  }

  private held = false;

  close() {
    this.done = true;
  }

  update(input: Input, dt: number) {
    if (this.held) return;
    const total = this.pageLength();
    const complete = this.shown >= total;
    if (!complete) {
      this.shown = Math.min(total, this.shown + (dt / 1000) * CHARS_PER_SECOND);
      if (input.consume('a') || input.consume('b')) this.shown = total;
      this.render();
      this.arrow.setVisible(false);
      return;
    }
    this.blink += dt;
    this.arrow.setVisible(Math.floor(this.blink / 350) % 2 === 0);
    if (input.consume('a') || input.consume('b')) {
      if (this.page < this.pages.length - 1) {
        this.page++;
        this.shown = 0;
        this.render();
      } else {
        if (this.hold) {
          this.held = true;
          this.arrow.setVisible(false);
        } else this.done = true;
        this.resolve();
      }
    }
  }

  destroy() {
    this.root.destroy(true);
  }
}

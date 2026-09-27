import Phaser from 'phaser';
import { PAL } from '../gfx/palette';
import { measureText, wrapText } from '../gfx/fontGlyphs';
import type { Input } from '../input/Input';
import { screenContainer, uiText, type Modal } from './widgets';

/** Schwarzer Bildschirm mit Text in der Mitte, z. B. „Am nächsten Morgen …". */
export class Interlude implements Modal {
  done = false;
  private root: Phaser.GameObjects.Container;
  private t = 0;
  private bg: Phaser.GameObjects.Rectangle;
  private texts: Phaser.GameObjects.BitmapText[] = [];

  constructor(scene: Phaser.Scene, text: string, private resolve: () => void) {
    this.root = screenContainer(scene, 1400);
    this.bg = scene.add.rectangle(0, 0, 320, 180, 0x000000, 1).setOrigin(0).setScrollFactor(0).setAlpha(0);
    this.root.add(this.bg);
    const lines = wrapText(text, 280);
    lines.forEach((l, i) => {
      const t = uiText(scene, Math.round(160 - measureText(l) / 2), Math.round(84 - (lines.length * 12) / 2 + i * 12), l, PAL.weiss).setAlpha(0);
      this.texts.push(t);
      this.root.add(t);
    });
  }

  update(input: Input, dt: number) {
    this.t += dt;
    this.bg.setAlpha(Math.min(1, this.t / 300));
    const a = Math.max(0, Math.min(1, (this.t - 300) / 400));
    for (const t of this.texts) t.setAlpha(a);
    if ((this.t > 700 && (input.consume('a') || input.consume('b'))) || this.t > 4200) {
      this.done = true;
      this.resolve();
    }
  }

  destroy() {
    this.root.destroy(true);
  }
}

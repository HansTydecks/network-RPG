import Phaser from 'phaser';
import { wrapText } from '../gfx/fontGlyphs';
import { PAL } from '../gfx/palette';
import type { Input } from '../input/Input';
import { drawPanel, screenContainer, uiText, type Modal } from './widgets';

export interface InfoEntry {
  titel: string;
  text: string;
  icon?: string;
}

/** Liste links, Details rechts – für Rucksack und Netzbuch. */
export class InfoPanel implements Modal {
  done = false;
  private root: Phaser.GameObjects.Container;
  private titles: Phaser.GameObjects.BitmapText[] = [];
  private detail: Phaser.GameObjects.BitmapText[] = [];
  private icon?: Phaser.GameObjects.Image;
  private index = 0;

  constructor(private scene: Phaser.Scene, heading: string, private entries: InfoEntry[], emptyText: string, private onClose: () => void = () => {}) {
    this.root = screenContainer(scene, 1250);
    const g = scene.add.graphics();
    drawPanel(g, 0, 0, 320, 180);
    g.lineStyle(1, 0x566c86, 1).lineBetween(110.5, 20, 110.5, 168);
    this.root.add(g);
    this.root.add(uiText(scene, 12, 10, heading, PAL.gelb));
    this.root.add(uiText(scene, 200, 10, 'B/Esc = zurück', PAL.grau3));
    if (entries.length === 0) {
      this.root.add(uiText(scene, 12, 28, emptyText, PAL.grau3));
      return;
    }
    entries.forEach((e, i) => {
      const t = uiText(scene, 18, 26 + i * 12, e.titel.length > 15 ? e.titel.slice(0, 14) + '…' : e.titel);
      t.setInteractive(new Phaser.Geom.Rectangle(-6, -2, 94, 12), Phaser.Geom.Rectangle.Contains);
      t.on('pointerdown', () => this.select(i));
      this.titles.push(t);
      this.root.add(t);
    });
    for (let i = 0; i < 11; i++) {
      const t = uiText(scene, 118, 44 + i * 11, '');
      this.detail.push(t);
      this.root.add(t);
    }
    this.select(0);
  }

  private select(i: number) {
    this.index = i;
    this.titles.forEach((t, j) => t.setTint(j === i ? 0xffcd75 : 0xf4f4f4).setText((j === i ? '▸' : ' ') + t.text.replace(/^[▸ ]/, '')));
    const e = this.entries[i];
    const lines = [e.titel, '', ...wrapText(e.text, 188)];
    this.detail.forEach((d, j) => d.setText(lines[j] ?? '').setTint(j === 0 ? 0x73eff7 : 0xf4f4f4));
    this.icon?.destroy();
    this.icon = undefined;
    if (e.icon) {
      this.icon = this.scene.add.image(290, 30, e.icon).setScrollFactor(0).setScale(2);
      this.root.add(this.icon);
    }
  }

  update(input: Input) {
    if (this.entries.length) {
      if (input.consume('up')) this.select((this.index - 1 + this.entries.length) % this.entries.length);
      if (input.consume('down')) this.select((this.index + 1) % this.entries.length);
    }
    if (input.consume('b') || input.consume('menu') || input.consume('a')) {
      this.done = true;
      this.onClose();
    }
  }

  destroy() {
    this.root.destroy(true);
  }
}

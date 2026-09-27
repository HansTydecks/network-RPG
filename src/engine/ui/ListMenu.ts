import Phaser from 'phaser';
import { measureText } from '../gfx/fontGlyphs';
import { PAL } from '../gfx/palette';
import type { Input } from '../input/Input';
import { drawPanel, screenContainer, uiText, type Modal } from './widgets';

export interface ListMenuOptions {
  x?: number;
  y?: number;
  /** 'right-bottom' legt das Menü rechts über das Dialogfenster. */
  anchor?: 'right-bottom' | 'center' | 'right-top' | 'free';
  cancellable?: boolean;
  title?: string;
}

/** Auswahlliste mit Cursor. Liefert den Index oder -1 (abgebrochen). */
export class ListMenu implements Modal {
  done = false;
  private root: Phaser.GameObjects.Container;
  private cursor: Phaser.GameObjects.BitmapText;
  private index = 0;
  private itemsY: number[] = [];
  private x0: number;

  constructor(scene: Phaser.Scene, private labels: string[], private resolve: (i: number) => void, private opts: ListMenuOptions = {}) {
    this.root = screenContainer(scene, 1200);
    const titleW = opts.title ? measureText(opts.title) : 0;
    const w = Math.max(titleW, ...labels.map((l) => measureText(l))) + 28;
    const h = labels.length * 12 + 14 + (opts.title ? 12 : 0);
    let x = opts.x ?? 0;
    let y = opts.y ?? 0;
    if (opts.anchor === 'right-bottom' || !opts.anchor) {
      x = 320 - w - 4;
      y = 124 - h;
    } else if (opts.anchor === 'center') {
      x = Math.floor((320 - w) / 2);
      y = Math.floor((180 - h) / 2);
    } else if (opts.anchor === 'right-top') {
      x = 320 - w - 4;
      y = 4;
    }
    const g = scene.add.graphics();
    drawPanel(g, x, y, w, h);
    this.root.add(g);
    let ty = y + 8;
    if (opts.title) {
      this.root.add(uiText(scene, x + 10, ty, opts.title, PAL.gelb));
      ty += 12;
    }
    labels.forEach((l, i) => {
      this.itemsY.push(ty + i * 12);
      const t = uiText(scene, x + 16, ty + i * 12, l);
      t.setInteractive(new Phaser.Geom.Rectangle(-12, -2, w - 8, 12), Phaser.Geom.Rectangle.Contains);
      t.on('pointerdown', () => {
        this.index = i;
        this.move(0);
        this.finish(i);
      });
      this.root.add(t);
    });
    this.x0 = x + 8;
    this.cursor = uiText(scene, this.x0, this.itemsY[0], '▸', PAL.gelb);
    this.root.add(this.cursor);
  }

  private move(d: number) {
    this.index = (this.index + d + this.labels.length) % this.labels.length;
    this.cursor.setY(this.itemsY[this.index]);
  }

  private finish(i: number) {
    if (this.done) return;
    this.done = true;
    this.resolve(i);
  }

  update(input: Input) {
    if (input.consume('up')) this.move(-1);
    if (input.consume('down')) this.move(1);
    if (input.consume('a')) this.finish(this.index);
    else if (this.opts.cancellable && (input.consume('b') || input.consume('menu'))) this.finish(-1);
  }

  destroy() {
    this.root.destroy(true);
  }
}

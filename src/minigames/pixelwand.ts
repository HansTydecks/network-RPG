import Phaser from 'phaser';
import { PAL, hexToInt } from '../engine/gfx/palette';
import type { Input } from '../engine/input/Input';
import { uiText } from '../engine/ui/widgets';
import { PIXELWAND } from './binaerLogic';
import { MinigameModal, type Minigame } from './base';

const CELL = 11;
const GX = 110;
const GY = 26;

/** Pixelwand: Binärzeilen ausmalen (1 = schwarz). Heraus kommt ein Bild. */
class PixelwandModal extends MinigameModal {
  private grid = PIXELWAND.map((r) => [...r].map(() => false));
  private cx = 0;
  private cy = 0;
  private draw: Phaser.GameObjects.Graphics;
  private ende = false;

  constructor(scene: Phaser.Scene, resolve: () => void) {
    super(scene, 'Die Pixelwand', 'Pfeile bewegen · Leertaste malen/löschen', resolve);
    this.draw = scene.add.graphics().setScrollFactor(0);
    this.root.add(this.draw);
    PIXELWAND.forEach((row, y) => this.root.add(uiText(scene, 40, GY + y * CELL + 1, row, PAL.grau4)));
    const zone = scene.add.zone(GX, GY, 8 * CELL, 8 * CELL).setOrigin(0).setScrollFactor(0).setInteractive();
    zone.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.cx = Math.floor((p.x - GX) / CELL);
      this.cy = Math.floor((p.y - GY) / CELL);
      this.toggle();
    });
    this.root.add(zone);
    this.root.add(uiText(scene, 214, 30, 'Jede Zeile ist eine Binärzahl. Male jedes Feld mit einer 1 schwarz aus.', PAL.weiss, 96));
    this.feedback('Frau Fröhlich: „So hat man früher Bilder in Computern gespeichert – als lauter Nullen und Einsen."');
    this.render();
  }

  private correct() {
    return this.grid.every((row, y) => row.every((v, x) => v === (PIXELWAND[y][x] === '1')));
  }

  private render() {
    const g = this.draw.clear();
    g.fillStyle(hexToInt(PAL.grau3), 1).fillRect(GX - 2, GY - 2, 8 * CELL + 3, 8 * CELL + 3);
    this.grid.forEach((row, y) =>
      row.forEach((v, x) => {
        g.fillStyle(hexToInt(v ? PAL.ink : PAL.weiss), 1).fillRect(GX + x * CELL, GY + y * CELL, CELL - 1, CELL - 1);
      }),
    );
    if (!this.ende) g.lineStyle(1, hexToInt(PAL.rot3), 1).strokeRect(GX + this.cx * CELL - 0.5, GY + this.cy * CELL - 0.5, CELL, CELL);
    g.lineStyle(1, hexToInt(PAL.gelb), 1).strokeRect(36.5, GY + this.cy * CELL - 0.5, 52, CELL);
  }

  private toggle() {
    if (this.ende) return this.finish();
    this.grid[this.cy][this.cx] = !this.grid[this.cy][this.cx];
    if (this.correct()) {
      this.ende = true;
      this.feedback('Eine Taube! Aus 64 Nullen und Einsen ist ein Bild geworden. (Leertaste)');
      this.setHelp('Leertaste: weiter');
    }
    this.render();
  }

  solutionKeys(): string[] {
    if (this.ende) return ['Space'];
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 8; x++)
        if (this.grid[y][x] !== (PIXELWAND[y][x] === '1')) {
          const keys: string[] = [];
          for (let i = 0; i < Math.abs(x - this.cx); i++) keys.push(x > this.cx ? 'ArrowRight' : 'ArrowLeft');
          for (let i = 0; i < Math.abs(y - this.cy); i++) keys.push(y > this.cy ? 'ArrowDown' : 'ArrowUp');
          return [...keys, 'Space'];
        }
    return [];
  }

  update(input: Input) {
    if (input.consume('left')) this.cx = Math.max(0, this.cx - 1);
    if (input.consume('right')) this.cx = Math.min(7, this.cx + 1);
    if (input.consume('up')) this.cy = Math.max(0, this.cy - 1);
    if (input.consume('down')) this.cy = Math.min(7, this.cy + 1);
    if (input.consume('a')) this.toggle();
    this.render();
  }
}

export const pixelwandMinigame: Minigame = (ctx) => new Promise((resolve) => ctx.push(new PixelwandModal(ctx.scene, resolve)));

import Phaser from 'phaser';
import { PAL, hexToInt } from '../engine/gfx/palette';
import { measureText } from '../engine/gfx/fontGlyphs';
import type { Input } from '../engine/input/Input';
import { uiText } from '../engine/ui/widgets';
import { BITSCHLOESSER, STELLENWERTE, bitsZuZahl, zahlZuBits } from './binaerLogic';
import { MinigameModal, type Minigame } from './base';

const X0 = 34;
const DX = 32;

/** Bit-Schloss: 8 Lampen an/aus, bis die Zahl stimmt. param = Nummer des Schlosses (1–3). */
class BitschlossModal extends MinigameModal {
  private bits = Array<boolean>(8).fill(false);
  private cursor = 0;
  private draw: Phaser.GameObjects.Graphics;
  private values: Phaser.GameObjects.BitmapText[] = [];
  private digits: Phaser.GameObjects.BitmapText[] = [];
  private sum: Phaser.GameObjects.BitmapText;
  private ende = false;

  constructor(scene: Phaser.Scene, private nr: number, resolve: () => void) {
    super(scene, `Bit-Schloss ${nr} von 3`, '←→ Lampe wählen · Leertaste an/aus', resolve);
    const l = BITSCHLOESSER[nr - 1];
    this.draw = scene.add.graphics().setScrollFactor(0);
    this.root.add(this.draw);
    this.root.add(uiText(scene, 10, 24, l.text, PAL.weiss, 300));
    STELLENWERTE.forEach((w, i) => {
      const x = X0 + i * DX;
      const v = uiText(scene, Math.round(x - measureText(String(w)) / 2), 88, String(w), PAL.grau4);
      const d = uiText(scene, x - 2, 74, '0', PAL.gelb);
      const zone = scene.add.zone(x - 12, 44, 24, 40).setOrigin(0).setScrollFactor(0).setInteractive();
      zone.on('pointerdown', () => {
        this.cursor = i;
        this.toggle();
      });
      this.values.push(v);
      this.digits.push(d);
      this.root.add([v, d, zone]);
    });
    this.sum = uiText(scene, 10, 106, '', PAL.netzKabel);
    this.root.add(this.sum);
    this.feedback('Jede Lampe hat einen Wert. Eine leuchtende Lampe (1) zählt ihren Wert, eine dunkle (0) zählt nichts.');
    this.render();
  }

  private get ziel() {
    return BITSCHLOESSER[this.nr - 1].ziel;
  }

  private render() {
    const g = this.draw.clear();
    this.bits.forEach((b, i) => {
      const x = X0 + i * DX;
      g.fillStyle(hexToInt(b ? PAL.gelb : PAL.grau1), 1).fillCircle(x, 56, 9);
      g.lineStyle(1, hexToInt(PAL.ink), 1).strokeCircle(x, 56, 9);
      if (b) g.fillStyle(0xffffff, 0.6).fillCircle(x - 3, 53, 2);
      if (i === this.cursor) g.lineStyle(1, hexToInt(PAL.netzKabel), 1).strokeRect(x - 13.5, 43.5, 27, 56);
      this.digits[i].setText(b ? '1' : '0');
    });
    const n = bitsZuZahl(this.bits);
    const zeigen = BITSCHLOESSER[this.nr - 1].summeZeigen || this.ende;
    const teile = STELLENWERTE.filter((_, i) => this.bits[i]);
    this.sum.setText(zeigen ? `${teile.length ? teile.join(' + ') : '0'} = ${n}   (Ziel: ${this.ziel})` : `Ziel: ${this.ziel}`);
  }

  private toggle() {
    if (this.ende) return this.finish();
    this.bits[this.cursor] = !this.bits[this.cursor];
    if (bitsZuZahl(this.bits) === this.ziel) {
      this.ende = true;
      this.feedback(`Klick! Das Schloss springt auf. ${this.ziel} ist binär ${this.bits.map((b) => (b ? 1 : 0)).join('')}. (Leertaste)`);
      this.setHelp('Leertaste: weiter');
    }
    this.render();
  }

  solutionKeys(): string[] {
    if (this.ende) return ['Space'];
    const soll = zahlZuBits(this.ziel);
    const i = soll.findIndex((b, j) => b !== this.bits[j]);
    const keys: string[] = [];
    const d = i > this.cursor ? 'ArrowRight' : 'ArrowLeft';
    for (let k = 0; k < Math.abs(i - this.cursor); k++) keys.push(d);
    return [...keys, 'Space'];
  }

  update(input: Input) {
    if (input.consume('left')) this.cursor = Math.max(0, this.cursor - 1);
    if (input.consume('right')) this.cursor = Math.min(7, this.cursor + 1);
    if (input.consume('a')) this.toggle();
    this.render();
  }
}

export const bitschlossMinigame: Minigame = (ctx) =>
  new Promise((resolve) => ctx.push(new BitschlossModal(ctx.scene, Math.max(1, Math.min(3, Number(ctx.param ?? 1))), resolve)));

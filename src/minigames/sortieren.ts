import Phaser from 'phaser';
import { PAL, hexToInt } from '../engine/gfx/palette';
import { measureText } from '../engine/gfx/fontGlyphs';
import type { Input } from '../engine/input/Input';
import { uiText } from '../engine/ui/widgets';
import { SORT_RUNDEN, sortHinweis } from './sortierenLogic';
import { MinigameModal, type Minigame } from './base';

const BIN_W = 96;
const BIN_Y = 86;

class SortModal extends MinigameModal {
  private runde = 0;
  private index = 0;
  private cursor = 1;
  private fehler = 0;
  private card: Phaser.GameObjects.BitmapText[] = [];
  private binTexts: Phaser.GameObjects.BitmapText[] = [];
  private status: Phaser.GameObjects.BitmapText;
  private draw: Phaser.GameObjects.Graphics;
  private wait = 0;
  private ende = false;

  constructor(scene: Phaser.Scene, resolve: () => void) {
    super(scene, 'Die Sortiermaschine', '←→ Fach wählen · Leertaste einsortieren', resolve);
    this.draw = scene.add.graphics().setScrollFactor(0);
    this.root.add(this.draw);
    for (let i = 0; i < 3; i++) {
      const t = uiText(scene, 0, 0, '', PAL.ink);
      this.card.push(t);
      this.root.add(t);
    }
    for (let i = 0; i < 3; i++) {
      const t = uiText(scene, 0, BIN_Y + 20, '');
      this.binTexts.push(t);
      this.root.add(t);
      const zone = scene.add.zone(10 + i * (BIN_W + 4), BIN_Y, BIN_W, 34).setOrigin(0).setScrollFactor(0).setInteractive();
      zone.on('pointerdown', () => {
        this.cursor = i;
        this.drop();
      });
      this.root.add(zone);
    }
    this.status = uiText(scene, 220, 8, '', PAL.grau4);
    this.root.add(this.status);
    this.feedback(SORT_RUNDEN[0].ansage);
    this.render();
  }

  private get brief() {
    return SORT_RUNDEN[this.runde].briefe[this.index];
  }

  private render() {
    const g = this.draw.clear();
    // Förderband
    g.fillStyle(hexToInt(PAL.grau1), 1).fillRect(10, 24, 300, 56);
    g.fillStyle(hexToInt(PAL.grau2), 1);
    for (let x = 14; x < 310; x += 12) g.fillRect(x, 26, 6, 2).fillRect(x, 76, 6, 2);
    if (!this.ende) {
      const br = this.brief;
      g.fillStyle(hexToInt(br.vonAlex ? PAL.creme : PAL.weiss), 1).fillRect(80, 30, 160, 44);
      g.lineStyle(1, hexToInt(PAL.grau3), 1).strokeRect(80.5, 30.5, 159, 43);
      if (br.vonAlex) {
        g.fillStyle(hexToInt(PAL.blau3), 1).fillRect(220, 34, 14, 16);
        g.fillStyle(hexToInt(PAL.grau3), 1).fillRect(224, 40, 6, 4);
      }
      const lines = [br.name, br.strasse, `${br.plz} ${br.ort}`];
      lines.forEach((l, i) => this.card[i].setText(l).setPosition(88, 37 + i * 11));
    } else this.card.forEach((c) => c.setText(''));
    // Fächer
    const faecher = SORT_RUNDEN[this.runde].faecher;
    faecher.forEach((f, i) => {
      const x = 10 + i * (BIN_W + 4);
      const sel = i === this.cursor;
      g.fillStyle(hexToInt(sel ? PAL.blau2 : PAL.blau1), 1).fillRect(x, BIN_Y, BIN_W, 34);
      g.lineStyle(1, hexToInt(sel ? PAL.gelb : PAL.grau2), 1).strokeRect(x + 0.5, BIN_Y + 0.5, BIN_W - 1, 33);
      this.binTexts[i].setText(f).setPosition(Math.round(x + BIN_W / 2 - measureText(f) / 2), BIN_Y + 12).setTint(hexToInt(sel ? PAL.gelb : PAL.weiss));
    });
    const total = SORT_RUNDEN[this.runde].briefe.length;
    const st = `Runde ${this.runde + 1}/3 · Brief ${Math.min(this.index + 1, total)}/${total}`;
    this.status.setText(st).setX(Math.round(310 - measureText(st)));
  }

  private drop() {
    if (this.ende || this.wait > 0) return;
    const br = this.brief;
    if (this.cursor !== br.fach) {
      this.fehler++;
      this.feedback(`Hmm, das passt nicht. ${sortHinweis(this.runde, br)}`, PAL.orange);
      return;
    }
    if (br.vonAlex) this.feedback('Frau Krause: „Da ist ja dein Brief an Lina! Morgen Mittag liegt er in ihrem Briefkasten."');
    else this.feedback('Richtig einsortiert!');
    this.index++;
    if (this.index >= SORT_RUNDEN[this.runde].briefe.length) {
      this.runde++;
      this.index = 0;
      if (this.runde >= SORT_RUNDEN.length) {
        this.runde = SORT_RUNDEN.length - 1;
        this.ende = true;
        this.setHelp('Leertaste: fertig');
        this.feedback(`Geschafft! Alle Briefe sind sortiert${this.fehler === 0 ? ' – ohne einen einzigen Fehler!' : '.'} Frau Krause strahlt.`);
      } else {
        this.wait = 400;
        this.feedback(SORT_RUNDEN[this.runde].ansage);
      }
    }
    this.render();
  }

  solutionKeys(): string[] {
    if (this.ende) return ['Space'];
    if (this.wait > 0) return [];
    const keys: string[] = [];
    const target = this.brief.fach;
    const d = target > this.cursor ? 'ArrowRight' : 'ArrowLeft';
    for (let i = 0; i < Math.abs(target - this.cursor); i++) keys.push(d);
    return [...keys, 'Space'];
  }

  update(input: Input, dt: number) {
    if (this.wait > 0) this.wait -= dt;
    if (this.ende) {
      if (input.consume('a')) this.finish();
      return;
    }
    if (input.consume('left')) this.cursor = Math.max(0, this.cursor - 1);
    if (input.consume('right')) this.cursor = Math.min(2, this.cursor + 1);
    if (input.consume('a')) this.drop();
    this.render();
  }
}

export const sortierMinigame: Minigame = (ctx) => new Promise((resolve) => ctx.push(new SortModal(ctx.scene, resolve)));

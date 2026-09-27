import Phaser from 'phaser';
import { PAL, hexToInt } from '../engine/gfx/palette';
import { measureText } from '../engine/gfx/fontGlyphs';
import type { Input } from '../engine/input/Input';
import { uiText } from '../engine/ui/widgets';
import { GEHEIMWORT, binaerText, buchstabeZuZahl } from './binaerLogic';
import { MinigameModal, type Minigame } from './base';

const X0 = 26;
const DX = 36;

/** Geheimtext: Jede 5-Bit-Zahl ist der Platz eines Buchstabens im Alphabet (A = 1). */
class GeheimtextModal extends MinigameModal {
  private letters = [...GEHEIMWORT].map(() => 0); // 0 = noch leer, 1 = A …
  private cursor = 0;
  private draw: Phaser.GameObjects.Graphics;
  private slots: Phaser.GameObjects.BitmapText[] = [];
  private ende = false;

  constructor(scene: Phaser.Scene, resolve: () => void) {
    super(scene, 'Der Geheimtext', '←→ Stelle · ↑↓ Buchstabe', resolve);
    this.draw = scene.add.graphics().setScrollFactor(0);
    this.root.add(this.draw);
    this.root.add(uiText(scene, 10, 22, 'Auf dem Pult liegt ein Zettel mit Binärzahlen. Jede Zahl ist der Platz eines Buchstabens im Alphabet: A = 1, B = 2 …', PAL.weiss, 300));
    [...GEHEIMWORT].forEach((c, i) => {
      const x = X0 + i * DX;
      const code = binaerText(buchstabeZuZahl(c), 5);
      this.root.add(uiText(scene, Math.round(x - measureText(code) / 2), 50, code, PAL.netzKabel));
      const t = uiText(scene, x - 3, 68, '');
      this.slots.push(t);
      this.root.add(t);
    });
    const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.root.add(uiText(scene, 10, 92, [...abc.slice(0, 13)].map((c, i) => `${c}${i + 1}`).join(' '), PAL.grau3));
    this.root.add(uiText(scene, 10, 104, [...abc.slice(13)].map((c, i) => `${c}${i + 14}`).join(' '), PAL.grau3));
    this.feedback('Tipp: Rechne die Binärzahl mit deiner Binär-Karte um (16, 8, 4, 2, 1). 00011 = 2 + 1 = 3 = C.');
    this.render();
  }

  private render() {
    const g = this.draw.clear();
    this.letters.forEach((l, i) => {
      const x = X0 + i * DX;
      const richtig = l === buchstabeZuZahl(GEHEIMWORT[i]);
      g.fillStyle(hexToInt(richtig && this.ende ? PAL.gruen1 : PAL.blau1), 1).fillRect(x - 12, 64, 24, 18);
      g.lineStyle(1, hexToInt(i === this.cursor && !this.ende ? PAL.gelb : PAL.grau2), 1).strokeRect(x - 11.5, 64.5, 23, 17);
      this.slots[i].setText(l ? String.fromCharCode(64 + l) : '?').setX(Math.round(x - measureText(l ? String.fromCharCode(64 + l) : '?') / 2));
    });
  }

  private change(d: number) {
    const cur = this.letters[this.cursor];
    this.letters[this.cursor] = cur === 0 ? (d > 0 ? 1 : 26) : ((cur - 1 + d + 26) % 26) + 1;
    if (this.letters.every((l, i) => l === buchstabeZuZahl(GEHEIMWORT[i]))) {
      this.ende = true;
      this.feedback(`„${GEHEIMWORT}"! Mit einer Tabelle wird aus Zahlen wieder Text. (Leertaste)`);
      this.setHelp('Leertaste: weiter');
    }
    this.render();
  }

  solutionKeys(): string[] {
    if (this.ende) return ['Space'];
    const i = this.letters.findIndex((l, j) => l !== buchstabeZuZahl(GEHEIMWORT[j]));
    const keys: string[] = [];
    for (let k = 0; k < Math.abs(i - this.cursor); k++) keys.push(i > this.cursor ? 'ArrowRight' : 'ArrowLeft');
    if (this.letters[i] === 0) return [...keys, 'ArrowDown'];
    const soll = buchstabeZuZahl(GEHEIMWORT[i]);
    const ist = this.letters[i];
    const vor = (soll - ist + 26) % 26;
    for (let k = 0; k < (vor <= 13 ? vor : 26 - vor); k++) keys.push(vor <= 13 ? 'ArrowDown' : 'ArrowUp');
    return keys.length ? keys : ['ArrowDown'];
  }

  update(input: Input) {
    if (this.ende) {
      if (input.consume('a')) this.finish();
      return;
    }
    if (input.consume('left')) this.cursor = Math.max(0, this.cursor - 1);
    if (input.consume('right')) this.cursor = Math.min(this.letters.length - 1, this.cursor + 1);
    if (input.consume('down')) this.change(1);
    if (input.consume('up')) this.change(-1);
    this.render();
  }
}

export const geheimtextMinigame: Minigame = (ctx) => new Promise((resolve) => ctx.push(new GeheimtextModal(ctx.scene, resolve)));

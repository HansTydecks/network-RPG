import Phaser from 'phaser';
import { PAL, hexToInt } from '../engine/gfx/palette';
import type { Input } from '../engine/input/Input';
import { uiText } from '../engine/ui/widgets';
import { MinigameModal, type Minigame } from './base';
import { OS_AUFGABEN } from './osLogic';



class OsModal extends MinigameModal {
  private cursor = 0;
  private marked = new Set<number>();
  private rows: Phaser.GameObjects.BitmapText[] = [];
  private boot: Phaser.GameObjects.BitmapText;
  private ende = false;

  constructor(scene: Phaser.Scene, resolve: () => void) {
    super(scene, 'NetzBlick OS startet …', '↑↓ wählen · Leertaste an/aus · „Fertig" bestätigen', resolve);
    this.boot = uiText(scene, 16, 26, 'NetzBlick OS 0.1 · Prototyp · © Ada\nWelche Aufgaben übernimmt das Betriebssystem?', PAL.gruen4);
    this.root.add(this.boot);
    [...OS_AUFGABEN.map((a) => a.text), 'Fertig'].forEach((_, i) => {
      const t = uiText(scene, 22, 54 + i * 12, '');
      t.setInteractive(new Phaser.Geom.Rectangle(-8, -2, 240, 12), Phaser.Geom.Rectangle.Contains);
      t.on('pointerdown', () => {
        this.cursor = i;
        this.toggle();
      });
      this.rows.push(t);
      this.root.add(t);
    });
    this.feedback('Kreuze alle Aufgaben an, die ein Betriebssystem erledigt.');
    this.render();
  }

  private render() {
    OS_AUFGABEN.forEach((a, i) => {
      this.rows[i].setText(`${i === this.cursor ? '▸' : ' '} [${this.marked.has(i) ? 'X' : ' '}] ${a.text}`).setTint(hexToInt(i === this.cursor ? PAL.gelb : PAL.weiss));
    });
    const f = OS_AUFGABEN.length;
    this.rows[f].setText(`${this.cursor === f ? '▸' : ' '} Fertig`).setTint(hexToInt(this.cursor === f ? PAL.gelb : PAL.netzKabel));
  }

  private toggle() {
    if (this.ende) return this.finish();
    if (this.cursor < OS_AUFGABEN.length) {
      if (this.marked.has(this.cursor)) this.marked.delete(this.cursor);
      else this.marked.add(this.cursor);
    } else {
      const falsch = OS_AUFGABEN.map((a, i) => (a.richtig !== this.marked.has(i) ? i : -1)).filter((i) => i >= 0);
      if (falsch.length) {
        const f = OS_AUFGABEN[falsch[0]];
        this.feedback(
          f.richtig ? `Da fehlt noch etwas. Überleg mal: „${f.text}" – wer macht das im Gerät?` : `„${f.text}"? Das macht kein Betriebssystem, auch wenn es praktisch wäre!`,
          PAL.orange,
        );
      } else {
        this.ende = true;
        this.boot.setText('NetzBlick OS 0.1 · Prototyp · © Ada\nSpeicher OK · Kamera OK · Displays OK · Start!');
        this.feedback('Das Betriebssystem verwaltet Speicher, Geräte, Dateien und Programme. Die Brille ist bereit! (Leertaste)');
        this.setHelp('Leertaste: weiter');
      }
    }
    this.render();
  }

  solutionKeys(): string[] {
    if (this.ende) return ['Space'];
    const need = OS_AUFGABEN.map((a, i) => (a.richtig !== this.marked.has(i) ? i : -1)).filter((i) => i >= 0);
    const target = need[0] ?? OS_AUFGABEN.length;
    const keys: string[] = [];
    const d = target > this.cursor ? 'ArrowDown' : 'ArrowUp';
    for (let i = 0; i < Math.abs(target - this.cursor); i++) keys.push(d);
    return [...keys, 'Space'];
  }

  update(input: Input) {
    const n = OS_AUFGABEN.length + 1;
    if (input.consume('up')) this.cursor = (this.cursor - 1 + n) % n;
    if (input.consume('down')) this.cursor = (this.cursor + 1) % n;
    if (input.consume('a')) this.toggle();
    this.render();
  }
}

export const osMinigame: Minigame = (ctx) => new Promise((resolve) => ctx.push(new OsModal(ctx.scene, resolve)));

import Phaser from 'phaser';
import { PAL, hexToInt } from '../engine/gfx/palette';
import { measureText, wrapText } from '../engine/gfx/fontGlyphs';
import type { Input } from '../engine/input/Input';
import { uiText } from '../engine/ui/widgets';
import { BAUTEILE, FACH_NAMEN, type Fach } from './evaLogic';
import { MinigameModal, type Minigame } from './base';

class EvaModal extends MinigameModal {
  private placed = new Map<number, Fach>();
  private part = 0;
  private fach = 0;
  private faecher: Fach[] = ['E', 'V', 'A'];
  private list: Phaser.GameObjects.BitmapText[] = [];
  private binTexts: Phaser.GameObjects.BitmapText[] = [];
  private draw: Phaser.GameObjects.Graphics;
  private ende = false;

  constructor(scene: Phaser.Scene, resolve: () => void) {
    super(scene, 'Die Brille zusammenbauen', '↑↓ Bauteil · ←→ Fach · Leertaste einsetzen', resolve);
    this.draw = scene.add.graphics().setScrollFactor(0);
    this.root.add(this.draw);
    BAUTEILE.forEach((_, i) => {
      const t = uiText(scene, 16, 28 + i * 12, '');
      t.setInteractive(new Phaser.Geom.Rectangle(-6, -2, 110, 12), Phaser.Geom.Rectangle.Contains);
      t.on('pointerdown', () => {
        if (!this.placed.has(i)) this.part = i;
        this.render();
      });
      this.list.push(t);
      this.root.add(t);
    });
    for (let i = 0; i < 4; i++) {
      const t = uiText(scene, 0, 0, '');
      this.binTexts.push(t);
      this.root.add(t);
    }
    this.feedback('Tante Ada: „Ordne jedes Bauteil zu. Was nimmt etwas auf, was verarbeitet, was gibt aus?"');
    this.render();
  }

  /** Fächer im 2×2-Raster rechts: Eingabe, Verarbeitung / Ausgabe, Speichern. */
  private binRect(i: number) {
    return { x: 130 + (i % 2) * 92, y: 24 + Math.floor(i / 2) * 51, w: 88, h: 48 };
  }

  private render() {
    const g = this.draw.clear();
    g.lineStyle(1, hexToInt(PAL.grau2), 1).lineBetween(125.5, 24, 125.5, 122);
    BAUTEILE.forEach((b, i) => {
      const done = this.placed.has(i);
      const sel = i === this.part && !done;
      this.list[i].setText(`${sel ? '▸' : ' '} ${b.name}`).setTint(hexToInt(done ? PAL.grau2 : sel ? PAL.gelb : PAL.weiss));
    });
    this.binTexts.forEach((t) => t.setText(''));
    this.faecher.forEach((f, i) => {
      const r = this.binRect(i);
      const sel = i === this.fach;
      g.fillStyle(hexToInt(f === 'S' ? PAL.lila1 : PAL.blau1), 1).fillRect(r.x, r.y, r.w, r.h);
      g.lineStyle(1, hexToInt(sel ? PAL.gelb : PAL.grau2), 1).strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1);
      const inside = [...this.placed].filter(([, pf]) => pf === f).map(([idx]) => BAUTEILE[idx].name);
      const label = FACH_NAMEN[f];
      const lines = [label, ...inside.flatMap((n) => wrapText(n, r.w - 8))];
      this.binTexts[i]
        .setText(lines.join('\n'))
        .setPosition(Math.round(r.x + r.w / 2 - measureText(label) / 2), r.y + 5)
        .setTint(hexToInt(sel ? PAL.gelb : PAL.weiss));
    });
  }

  private nextPart() {
    const open = BAUTEILE.map((_, i) => i).filter((i) => !this.placed.has(i));
    this.part = open[0] ?? -1;
  }

  private place() {
    if (this.part < 0) return;
    const b = BAUTEILE[this.part];
    const f = this.faecher[this.fach];
    if (b.fach === 'S' && !this.faecher.includes('S')) {
      this.faecher.push('S');
      this.fach = 3;
      this.feedback('Der Speicherchip passt nirgends … Die Brille soll sich Dinge auch dann merken, wenn sie aus ist. Dafür braucht sie ein viertes Fach: Speichern!', PAL.orange);
      this.render();
      return;
    }
    if (b.fach !== f) {
      this.feedback(b.hinweis, PAL.orange);
      return;
    }
    this.placed.set(this.part, f);
    this.feedback(`Richtig! ${b.hinweis}`);
    this.nextPart();
    if (this.placed.size === BAUTEILE.length) {
      this.ende = true;
      this.setHelp('Leertaste: Brille einschalten');
      this.feedback('Alle Teile sitzen! Eingabe – Verarbeitung – Ausgabe, und dazu Speichern. Die Brille kann starten.');
    }
    this.render();
  }

  solutionKeys(): string[] {
    if (this.ende) return ['Space'];
    const target = BAUTEILE[this.part].fach;
    const idx = this.faecher.indexOf(target);
    if (idx < 0) return ['Space']; // Speicher-Fach erst freischalten
    const keys: string[] = [];
    const d = idx > this.fach ? 'ArrowRight' : 'ArrowLeft';
    for (let i = 0; i < Math.abs(idx - this.fach); i++) keys.push(d);
    return [...keys, 'Space'];
  }

  update(input: Input) {
    if (this.ende) {
      if (input.consume('a')) this.finish();
      return;
    }
    const open = BAUTEILE.map((_, i) => i).filter((i) => !this.placed.has(i));
    if (input.consume('up')) this.part = open[(open.indexOf(this.part) - 1 + open.length) % open.length];
    if (input.consume('down')) this.part = open[(open.indexOf(this.part) + 1) % open.length];
    if (input.consume('left')) this.fach = Math.max(0, this.fach - 1);
    if (input.consume('right')) this.fach = Math.min(this.faecher.length - 1, this.fach + 1);
    if (input.consume('a')) this.place();
    this.render();
  }
}

export const evaMinigame: Minigame = (ctx) => new Promise((resolve) => ctx.push(new EvaModal(ctx.scene, resolve)));

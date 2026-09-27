import Phaser from 'phaser';
import { PAL, hexToInt } from '../engine/gfx/palette';
import { measureText } from '../engine/gfx/fontGlyphs';
import type { Input } from '../engine/input/Input';
import { uiText } from '../engine/ui/widgets';
import { ZUSTAND_AUFGABEN, uebergangText, type Uebergang, type ZustandAufgabe } from './zustandLogic';
import { MinigameModal, shuffled, type Minigame } from './base';

const BOX_H = 16;

/** Zustandsdiagramm: Zustände als Kästen, Übergänge als Pfeile; ein Pfeil fehlt. param = Aufgaben-ID. */
class ZustandModal extends MinigameModal {
  private optionen: Uebergang[];
  private cursor = 0;
  private draw: Phaser.GameObjects.Graphics;
  private optTexts: Phaser.GameObjects.BitmapText[] = [];
  private labels: Phaser.GameObjects.BitmapText[] = [];
  private ende = false;

  constructor(scene: Phaser.Scene, private a: ZustandAufgabe, resolve: () => void) {
    super(scene, a.titel, '↑↓ wählen · Leertaste einsetzen', resolve);
    this.optionen = shuffled([a.fehlt, ...a.falsch], 3);
    this.draw = scene.add.graphics().setScrollFactor(0);
    this.root.add(this.draw);
    for (const z of a.zustaende) this.root.add(uiText(scene, Math.round(z.x - measureText(z.name) / 2), z.y - 4, z.name));
    for (let i = 0; i < a.uebergaenge.length + 1; i++) {
      const t = uiText(scene, 0, 0, '', PAL.grau4);
      this.labels.push(t);
      this.root.add(t);
    }
    this.optionen.forEach((_o, i) => {
      const t = uiText(scene, 18, 22 + i * 11, '');
      t.setInteractive(new Phaser.Geom.Rectangle(-8, -2, 290, 12), Phaser.Geom.Rectangle.Contains);
      t.on('pointerdown', () => {
        this.cursor = i;
        this.choose();
      });
      this.optTexts.push(t);
      this.root.add(t);
    });
    this.feedback(a.einleitung);
    this.render();
  }

  private box(id: string) {
    const z = this.a.zustaende.find((s) => s.id === id)!;
    const w = measureText(z.name) + 12;
    return { x: z.x - w / 2, y: z.y - BOX_H / 2, w, h: BOX_H, cx: z.x, cy: z.y };
  }

  private arrow(g: Phaser.GameObjects.Graphics, u: Uebergang, color: string, dashed: boolean, labelIndex: number, label: string) {
    const a = this.box(u.von);
    const b = this.box(u.nach);
    const lt = this.labels[labelIndex];
    if (u.von === u.nach) {
      g.lineStyle(1, hexToInt(color), 1).strokeCircle(a.cx + a.w / 2, a.cy - 8, 6);
      lt.setText(label).setPosition(a.cx + a.w / 2 + 8, a.cy - 20);
      return;
    }
    const dx = b.cx - a.cx;
    const dy = b.cy - a.cy;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    const sx = a.cx + ux * (a.w / 2) * Math.abs(ux) + ux * 2;
    const sy = a.cy + uy * (BOX_H / 2 + 2);
    const ex = b.cx - ux * (b.w / 2) * Math.abs(ux) - ux * 2;
    const ey = b.cy - uy * (BOX_H / 2 + 2);
    g.lineStyle(1, hexToInt(color), 1);
    if (dashed) {
      const n = Math.floor(Math.hypot(ex - sx, ey - sy) / 6);
      for (let i = 0; i < n; i += 2) g.lineBetween(sx + ((ex - sx) * i) / n, sy + ((ey - sy) * i) / n, sx + ((ex - sx) * (i + 1)) / n, sy + ((ey - sy) * (i + 1)) / n);
    } else g.lineBetween(sx, sy, ex, ey);
    g.fillStyle(hexToInt(color), 1).fillTriangle(ex, ey, ex - ux * 6 - uy * 3, ey - uy * 6 + ux * 3, ex - ux * 6 + uy * 3, ey - uy * 6 - ux * 3);
    if (u.label) lt.setText(label).setPosition(u.label[0], u.label[1]);
    else lt.setText(label).setPosition(Math.round((sx + ex) / 2 - measureText(label) / 2 + uy * 10), Math.round((sy + ey) / 2 - 10 - ux * 4));
  }

  private render() {
    const g = this.draw.clear();
    g.fillStyle(hexToInt(PAL.nacht), 1).fillRect(8, 58, 304, 68);
    for (const z of this.a.zustaende) {
      const b = this.box(z.id);
      g.fillStyle(hexToInt(PAL.blau1), 1).fillRoundedRect(b.x, b.y, b.w, b.h, 4);
      g.lineStyle(1, hexToInt(PAL.weiss), 1).strokeRoundedRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1, 4);
    }
    this.a.uebergaenge.forEach((u, i) => this.arrow(g, u, PAL.weiss, false, i, u.ereignis));
    const last = this.a.uebergaenge.length;
    if (this.ende) this.arrow(g, this.a.fehlt, PAL.gruen4, false, last, this.a.fehlt.ereignis);
    else this.labels[last].setText('');
    this.optTexts.forEach((t, i) => t.setText(`${i === this.cursor ? '▸' : ' '} ${uebergangText(this.optionen[i], this.a)}`).setTint(hexToInt(i === this.cursor ? PAL.gelb : PAL.weiss)));
  }

  private choose() {
    if (this.ende) return this.finish();
    const o = this.optionen[this.cursor];
    if (o === this.a.fehlt) {
      this.ende = true;
      this.feedback(`${this.a.erklaerung} (Leertaste)`);
      this.setHelp('Leertaste: weiter');
    } else if (o.von === o.nach) this.feedback('Dann würde es im selben Zustand bleiben – genau das ist ja das Problem!', PAL.orange);
    else this.feedback('Passt das zum Ereignis? Überleg, in welchem Zustand das Gerät gerade ist, wenn das passiert.', PAL.orange);
    this.render();
  }

  solutionKeys(): string[] {
    if (this.ende) return ['Space'];
    const i = this.optionen.indexOf(this.a.fehlt);
    const keys: string[] = [];
    for (let k = 0; k < Math.abs(i - this.cursor); k++) keys.push(i > this.cursor ? 'ArrowDown' : 'ArrowUp');
    return [...keys, 'Space'];
  }

  update(input: Input) {
    if (input.consume('up')) this.cursor = (this.cursor + this.optionen.length - 1) % this.optionen.length;
    if (input.consume('down')) this.cursor = (this.cursor + 1) % this.optionen.length;
    if (input.consume('a')) this.choose();
    this.render();
  }
}

export const zustandMinigame: Minigame = (ctx) =>
  new Promise((resolve) => ctx.push(new ZustandModal(ctx.scene, ZUSTAND_AUFGABEN[ctx.param ?? 'kruemel'] ?? ZUSTAND_AUFGABEN.kruemel, resolve)));

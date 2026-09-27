import Phaser from 'phaser';
import { PAL, hexToInt } from '../engine/gfx/palette';
import { measureText } from '../engine/gfx/fontGlyphs';
import type { Input } from '../engine/input/Input';
import { uiText } from '../engine/ui/widgets';
import { KRUEMEL_LEVEL, MAX_BLOECKE, findeStart, fuehreAus, type Block, type KruemelLevel, type Schritt } from './kruemelLogic';
import { MinigameModal, type Minigame } from './base';

const CELL = 12;
const PALETTE: { id: Block | 'loeschen' | 'start'; label: string }[] = [
  { id: 'vor', label: '▲ vor' },
  { id: 'links', label: '↰ links' },
  { id: 'rechts', label: '↱ rechts' },
  { id: 'aufnehmen', label: '✦ aufnehmen' },
  { id: 'loeschen', label: '⌫' },
  { id: 'start', label: '▶ Start' },
];

/** Krümel-Blöcke: Befehle in Reihenfolge stecken, dann ausführen lassen. param = Level-ID. */
class BloeckeModal extends MinigameModal {
  private programm: Block[] = [];
  private sel = 0;
  private draw: Phaser.GameObjects.Graphics;
  private paletteTexts: Phaser.GameObjects.BitmapText[] = [];
  private progTexts: Phaser.GameObjects.BitmapText[] = [];
  private kruemel: Phaser.GameObjects.Image;
  private laufend: { schritte: Schritt[]; i: number; t: number; geschafft: boolean } | null = null;
  private pos: Schritt;
  private ende = false;
  private gx: number;
  private gy = 50;

  constructor(scene: Phaser.Scene, private level: KruemelLevel, resolve: () => void) {
    super(scene, `Krümel programmieren: ${level.titel}`, '←→ Block · Leertaste stecken/ausführen', resolve);
    this.root.add(uiText(scene, 10, 22, level.auftrag, PAL.weiss, 300));
    this.draw = scene.add.graphics().setScrollFactor(0);
    this.root.add(this.draw);
    this.gx = 10;
    const start = findeStart(level);
    this.pos = { ...start, r: level.startRichtung };
    this.kruemel = scene.add.image(0, 0, 'kruemel', 1).setScrollFactor(0).setScale(CELL / 16);
    this.root.add(this.kruemel);
    // Palette in bis zu zwei Zeilen rechts neben dem Raster
    let x = 110;
    let y = 52;
    PALETTE.forEach((p) => {
      const w = measureText(p.label) + 10;
      if (x + w > 312) {
        x = 110;
        y += 14;
      }
      const t = uiText(scene, x, y, p.label);
      t.setInteractive(new Phaser.Geom.Rectangle(-4, -3, w, 14), Phaser.Geom.Rectangle.Contains);
      t.on('pointerdown', () => {
        this.sel = PALETTE.indexOf(p);
        this.press();
      });
      this.paletteTexts.push(t);
      this.root.add(t);
      x += w;
    });
    this.root.add(uiText(scene, 110, 86, 'Programm:', PAL.grau4));
    for (let i = 0; i < MAX_BLOECKE; i++) {
      const t = uiText(scene, 0, 101, '', PAL.netzKabel);
      this.progTexts.push(t);
      this.root.add(t);
    }
    this.feedback(`Stecke höchstens ${MAX_BLOECKE} Blöcke hintereinander und drück dann „▶ Start". Krümel macht genau, was dasteht.`);
    this.render();
  }

  private render() {
    const g = this.draw.clear();
    this.level.raster.forEach((row, y) =>
      [...row].forEach((c, x) => {
        const col = c === '#' ? PAL.grau1 : c === 'Z' ? PAL.gelb : PAL.gruen2;
        g.fillStyle(hexToInt(col), 1).fillRect(this.gx + x * CELL, this.gy + y * CELL, CELL - 1, CELL - 1);
      }),
    );
    this.kruemel.setPosition(this.gx + this.pos.x * CELL + CELL / 2 - 0.5, this.gy + this.pos.y * CELL + CELL / 2 - 0.5).setAngle(this.pos.r * 90);
    this.paletteTexts.forEach((t, i) => t.setTint(hexToInt(i === this.sel ? PAL.gelb : PAL.weiss)));
    const icon = (b: Block) => PALETTE.find((p) => p.id === b)!.label.split(' ')[0];
    this.progTexts.forEach((t, i) => {
      const b = this.programm[i];
      const aktiv = this.laufend !== null && this.laufend.i === i;
      const x = 110 + i * 20;
      g.fillStyle(hexToInt(aktiv ? PAL.gelb : b ? PAL.blau2 : PAL.nacht), 1).fillRect(x, 98, 18, 16);
      g.lineStyle(1, hexToInt(b ? PAL.weiss : PAL.grau2), 1).strokeRect(x + 0.5, 98.5, 17, 15);
      const txt = b ? icon(b) : String(i + 1);
      t.setText(txt).setPosition(Math.round(x + 9 - measureText(txt) / 2), 101).setTint(hexToInt(aktiv ? PAL.ink : b ? PAL.weiss : PAL.grau2));
    });
    // Rahmen um gewählten Paletten-Block
    const t = this.paletteTexts[this.sel];
    g.lineStyle(1, hexToInt(PAL.gelb), 1).strokeRect(t.x - 3.5, t.y - 2.5, measureText(t.text) + 6, 13);
  }

  private press() {
    if (this.ende) return this.finish();
    if (this.laufend) return;
    const p = PALETTE[this.sel];
    if (p.id === 'loeschen') this.programm.pop();
    else if (p.id === 'start') {
      const r = fuehreAus(this.level, this.programm);
      const start = findeStart(this.level);
      this.pos = { ...start, r: this.level.startRichtung };
      this.laufend = { schritte: r.schritte, i: 0, t: 0, geschafft: r.geschafft };
      this.feedback('Krümel fährt los …');
    } else if (this.programm.length < MAX_BLOECKE) this.programm.push(p.id);
    else this.feedback(`Mehr als ${MAX_BLOECKE} Blöcke passen nicht auf die Fernbedienung.`, PAL.orange);
    this.render();
  }

  private stepRun(dt: number) {
    const l = this.laufend!;
    l.t += dt;
    if (l.t < 380) return;
    l.t = 0;
    const s = l.schritte[l.i];
    if (!s) {
      this.laufend = null;
      if (l.geschafft) {
        this.ende = true;
        this.feedback('Geschafft! Krümel hat genau das getan, was du programmiert hast. (Leertaste)');
        this.setHelp('Leertaste: weiter');
      } else {
        this.feedback('Krümel ist stehen geblieben, aber nicht am Ziel. Prüfe dein Programm Schritt für Schritt!', PAL.orange);
        const start = findeStart(this.level);
        this.pos = { ...start, r: this.level.startRichtung };
      }
      this.render();
      return;
    }
    this.pos = s;
    if (s.fehler) {
      this.laufend = null;
      this.feedback(`${s.fehler} Ändere dein Programm (⌫ löscht den letzten Block).`, PAL.orange);
    } else l.i++;
    this.render();
  }

  solutionKeys(): string[] {
    if (this.ende) return ['Space'];
    if (this.laufend) return [];
    const soll = this.level.loesung;
    const passt = this.programm.every((b, i) => soll[i] === b);
    let ziel: number;
    if (!passt) ziel = PALETTE.findIndex((p) => p.id === 'loeschen');
    else if (this.programm.length === soll.length) ziel = PALETTE.findIndex((p) => p.id === 'start');
    else ziel = PALETTE.findIndex((p) => p.id === soll[this.programm.length]);
    const keys: string[] = [];
    for (let k = 0; k < Math.abs(ziel - this.sel); k++) keys.push(ziel > this.sel ? 'ArrowRight' : 'ArrowLeft');
    return [...keys, 'Space'];
  }

  update(input: Input, dt: number) {
    if (this.laufend) {
      this.stepRun(dt);
      input.consume('a');
      return;
    }
    if (input.consume('left')) this.sel = (this.sel + PALETTE.length - 1) % PALETTE.length;
    if (input.consume('right')) this.sel = (this.sel + 1) % PALETTE.length;
    if (input.consume('b')) this.programm.pop();
    if (input.consume('a')) this.press();
    this.render();
  }
}

export const bloeckeMinigame: Minigame = (ctx) =>
  new Promise((resolve) => ctx.push(new BloeckeModal(ctx.scene, KRUEMEL_LEVEL[ctx.param ?? 'garten'] ?? KRUEMEL_LEVEL.garten, resolve)));

import Phaser from 'phaser';
import { PAL, hexToInt } from '../engine/gfx/palette';
import { measureText, wrapText } from '../engine/gfx/fontGlyphs';
import type { Input } from '../engine/input/Input';
import { uiText } from '../engine/ui/widgets';
import { MinigameModal } from './base';

export interface QuizOption {
  text: string;
  ok: boolean;
  /** Erklärung nach der Antwort (bei falscher Antwort als Denkanstoß). */
  erklaerung: string;
}

export interface QuizFrage {
  frage: string;
  optionen: QuizOption[];
  /** Optional: eigene Zeichnung im Bereich y 22–124 (z. B. eine Tabelle). Liefert erzeugte Objekte zurück. */
  bild?: (scene: Phaser.Scene, g: Phaser.GameObjects.Graphics, fertig: boolean) => Phaser.GameObjects.GameObject[];
  /** Wo die Antworten stehen: unter der Frage (Standard) oder rechts neben einem Bild. */
  antwortenX?: number;
  /** Kurze Antworten (z. B. Formeln) nebeneinander in einer Zeile. */
  nebeneinander?: boolean;
}

/**
 * Allgemeines Quiz-Minispiel: eine Frage nach der anderen, falsche Antworten erklären,
 * richtige führen weiter. Grundlage für Einheiten-Händler, Datei-Chaos, Tabellen, „Was ist schneller?".
 */
export class QuizModal extends MinigameModal {
  private index = 0;
  private cursor = 0;
  private frageText: Phaser.GameObjects.BitmapText;
  private optTexts: Phaser.GameObjects.BitmapText[] = [];
  private bildGfx: Phaser.GameObjects.Graphics;
  private bildObjekte: Phaser.GameObjects.GameObject[] = [];
  private beantwortet = false;
  private ende = false;

  constructor(scene: Phaser.Scene, title: string, private fragen: QuizFrage[], private schluss: string, resolve: () => void, intro?: string) {
    super(scene, title, '↑↓ wählen · Leertaste antworten', resolve);
    this.bildGfx = scene.add.graphics().setScrollFactor(0);
    this.root.add(this.bildGfx);
    this.frageText = uiText(scene, 10, 22, '');
    this.root.add(this.frageText);
    for (let i = 0; i < 4; i++) {
      const t = uiText(scene, 18, 0, '');
      t.setInteractive(new Phaser.Geom.Rectangle(-8, -2, 290, 12), Phaser.Geom.Rectangle.Contains);
      t.on('pointerdown', () => {
        this.cursor = i;
        this.antworten();
      });
      this.optTexts.push(t);
      this.root.add(t);
    }
    if (intro) this.feedback(intro);
    this.zeigeFrage();
  }

  private get frage() {
    return this.fragen[this.index];
  }

  private zeigeFrage() {
    this.beantwortet = false;
    this.cursor = 0;
    for (const o of this.bildObjekte) o.destroy();
    this.bildGfx.clear();
    const f = this.frage;
    const x = f.antwortenX ?? 10;
    const w = 310 - x;
    this.frageText.setText(wrapText(`${this.index + 1}/${this.fragen.length}: ${f.frage}`, f.antwortenX ? 300 : 300).join('\n'));
    this.bildObjekte = f.bild ? f.bild(this.scene, this.bildGfx, false) : [];
    for (const o of this.bildObjekte) this.root.add(o);
    let y = 22 + this.frageText.getTextBounds().local.height + 8;
    let ox = x + 8;
    this.optTexts.forEach((t, i) => {
      const o = f.optionen[i];
      const lines = o ? (f.nebeneinander ? [o.text] : wrapText(o.text, w - 14)) : [];
      t.setPosition(ox, y);
      t.setData('lines', lines);
      if (f.nebeneinander) ox += (o ? measureText(o.text) : 0) + 30;
      else y += lines.length * 11 + 3;
    });
    this.render();
  }

  private render() {
    const f = this.frage;
    this.optTexts.forEach((t, i) => {
      const o = f.optionen[i];
      const lines: string[] = t.getData('lines') ?? [];
      t.setText(o ? `${i === this.cursor ? '▸ ' : '  '}${lines.join('\n  ')}` : '').setTint(hexToInt(i === this.cursor ? PAL.gelb : PAL.weiss));
    });
  }

  private antworten() {
    if (this.ende) return this.finish();
    if (this.beantwortet) {
      this.index++;
      if (this.index >= this.fragen.length) {
        this.ende = true;
        this.feedback(this.schluss);
        this.setHelp('Leertaste: weiter');
        this.optTexts.forEach((t) => t.setText(''));
        this.frageText.setText('');
        for (const o of this.bildObjekte) o.destroy();
        this.bildGfx.clear();
        return;
      }
      this.feedback('');
      this.zeigeFrage();
      return;
    }
    const o = this.frage.optionen[this.cursor];
    if (!o) return;
    if (o.ok) {
      this.beantwortet = true;
      this.feedback(`Richtig! ${o.erklaerung} (Leertaste)`);
      if (this.frage.bild) {
        for (const b of this.bildObjekte) b.destroy();
        this.bildGfx.clear();
        this.bildObjekte = this.frage.bild(this.scene, this.bildGfx, true);
        for (const b of this.bildObjekte) this.root.add(b);
      }
    } else this.feedback(o.erklaerung, PAL.orange);
  }

  solutionKeys(): string[] {
    if (this.ende || this.beantwortet) return ['Space'];
    const i = this.frage.optionen.findIndex((o) => o.ok);
    const keys: string[] = [];
    for (let k = 0; k < Math.abs(i - this.cursor); k++) keys.push(i > this.cursor ? 'ArrowDown' : 'ArrowUp');
    return [...keys, 'Space'];
  }

  update(input: Input) {
    if (!this.beantwortet && !this.ende) {
      const n = this.frage.optionen.length;
      if (input.consume('up') || input.consume('left')) this.cursor = (this.cursor + n - 1) % n;
      if (input.consume('down') || input.consume('right')) this.cursor = (this.cursor + 1) % n;
      this.render();
    }
    if (input.consume('a')) this.antworten();
  }
}

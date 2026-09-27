import Phaser from 'phaser';
import { PAL, hexToInt } from '../engine/gfx/palette';
import { measureText, wrapText } from '../engine/gfx/fontGlyphs';
import type { Input } from '../engine/input/Input';
import { uiText } from '../engine/ui/widgets';
import { richtigeAn, seedAus } from '../engine/util/mischen';
import { MinigameModal } from './base';
import { tabellenBreiten, type QuizFrage } from './quizLogic';

export type { QuizFrage, QuizOption } from './quizLogic';

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
  private zusatz: Phaser.GameObjects.GameObject[] = [];
  private beantwortet = false;
  private ende = false;

  private fragen: QuizFrage[];

  constructor(scene: Phaser.Scene, title: string, fragen: QuizFrage[], private schluss: string, resolve: () => void, intro?: string) {
    super(scene, title, '↑↓ wählen · Leertaste antworten', resolve);
    // Die richtige Antwort wandert von Frage zu Frage an eine andere Stelle.
    const start = seedAus(title);
    this.fragen = fragen.map((f, i) => (f.festeReihenfolge ? f : { ...f, optionen: richtigeAn(f.optionen, (o) => o.ok, start + i * 2) }));
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
    for (const o of this.zusatz) o.destroy();
    this.zusatz = [];
    if (f.tabelle) y = this.zeichneTabelle(f.tabelle, y - 4) + 4;
    if (f.code) y = this.zeichneCode(f.code, y - 4) + 4;
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

  private zeichneTabelle(t: { kopf: string[]; zeilen: string[][] }, y0: number): number {
    const breiten = tabellenBreiten(t);
    const g = this.bildGfx;
    [t.kopf, ...t.zeilen].forEach((zeile, r) => {
      let x = 10;
      zeile.forEach((zelle, c) => {
        g.fillStyle(hexToInt(r === 0 ? PAL.grau2 : PAL.creme), 1).fillRect(x, y0 + r * 11, breiten[c] - 1, 10);
        const tx = this.scene.add.bitmapText(x + 3, y0 + r * 11 + 1, 'kabelitz', zelle).setTint(hexToInt(PAL.ink)).setScrollFactor(0);
        this.root.add(tx);
        this.zusatz.push(tx);
        x += breiten[c];
      });
    });
    return y0 + (t.zeilen.length + 1) * 11 + 2;
  }

  private zeichneCode(zeilen: string[], y0: number): number {
    const g = this.bildGfx;
    g.fillStyle(hexToInt(PAL.nacht), 1).fillRect(8, y0, 304, zeilen.length * 10 + 4);
    zeilen.forEach((z, i) => {
      const tx = this.scene.add.bitmapText(12, y0 + 2 + i * 10, 'kabelitz', z).setTint(hexToInt(PAL.netzKabel)).setScrollFactor(0);
      this.root.add(tx);
      this.zusatz.push(tx);
    });
    return y0 + zeilen.length * 10 + 4;
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
        for (const o of this.zusatz) o.destroy();
        this.zusatz = [];
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

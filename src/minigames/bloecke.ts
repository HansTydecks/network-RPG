import Phaser from 'phaser';
import { PAL, hexToInt } from '../engine/gfx/palette';
import { measureText } from '../engine/gfx/fontGlyphs';
import type { Input } from '../engine/input/Input';
import { uiText } from '../engine/ui/widgets';
import { GRUNDBLOECKE, KRUEMEL_LEVEL, MAX_BLOECKE, blockArt, findeStart, fuehreAus, istWiederhole, type Block, type BlockArt, type KruemelLevel, type Schritt, type Wiederhole } from './kruemelLogic';
import { MinigameModal, type Minigame } from './base';

type Knopf = BlockArt | 'loeschen' | 'start';
const LABEL: Record<Knopf, string> = {
  vor: '▲ vor',
  links: '↰ links',
  rechts: '↱ rechts',
  aufnehmen: '✦ aufnehmen',
  wdh: '⟳ 3×',
  ende: '⟲ Ende',
  wenn: '? wenn Wand: ↱',
  solange: '▲▲ solange frei',
  loeschen: '⌫',
  start: '▶ Start',
};

/** Kurzform im Programmfeld. */
function icon(b: Block): string {
  if (istWiederhole(b)) return `⟳${b.slice(3)}`;
  return { vor: '▲', links: '↰', rechts: '↱', aufnehmen: '✦', ende: '⟲', wenn: '?↱', solange: '▲▲' }[b as Exclude<Block, Wiederhole>];
}

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
  private gy = 46;
  /** Kachelgröße im Raster: breite Level werden etwas kleiner gezeichnet. */
  private cell: number;
  private palette: Knopf[];
  private anzahl = 3;
  private progY = 101;

  constructor(scene: Phaser.Scene, private level: KruemelLevel, resolve: () => void) {
    super(scene, `Krümel programmieren: ${level.titel}`, '←→ Block · Leertaste stecken/ausführen', resolve);
    this.root.add(uiText(scene, 10, 22, level.auftrag, PAL.weiss, 300));
    this.draw = scene.add.graphics().setScrollFactor(0);
    this.root.add(this.draw);
    this.gx = 10;
    this.cell = level.raster[0].length > 7 ? 10 : 12;
    const start = findeStart(level);
    this.pos = { ...start, r: level.startRichtung };
    this.kruemel = scene.add.image(0, 0, 'kruemel', 1).setScrollFactor(0).setScale(this.cell / 16);
    this.root.add(this.kruemel);
    this.palette = [...(level.bloecke ?? GRUNDBLOECKE), 'loeschen', 'start'];
    const hatKontroll = this.palette.some((k) => k === 'wdh' || k === 'wenn' || k === 'solange');
    // Palette in mehreren Zeilen rechts neben dem Raster
    let x = 110;
    let y = 47;
    this.palette.forEach((k, i) => {
      const w = measureText(LABEL[k]) + 10;
      if (x + w > 312) {
        x = 110;
        y += 13;
      }
      const t = uiText(scene, x, y, LABEL[k]);
      t.setInteractive(new Phaser.Geom.Rectangle(-4, -3, w, 14), Phaser.Geom.Rectangle.Contains);
      t.on('pointerdown', () => {
        this.sel = i;
        this.press();
      });
      this.paletteTexts.push(t);
      this.root.add(t);
      x += w;
    });
    this.progY = Math.max(101, y + 26);
    this.root.add(uiText(scene, 110, this.progY - 13, 'Programm:', PAL.grau4));
    for (let i = 0; i < MAX_BLOECKE; i++) {
      const t = uiText(scene, 0, this.progY, '', PAL.netzKabel);
      this.progTexts.push(t);
      this.root.add(t);
    }
    if (this.palette.includes('wdh')) this.setHelp('←→ Block · ↑↓ Anzahl · Leertaste stecken/ausführen');
    this.feedback(
      hatKontroll
        ? `Höchstens ${MAX_BLOECKE} Blöcke! ⟳ wiederholt alle Blöcke bis zum ⟲ Ende so oft, wie du mit ↑↓ einstellst.`
        : `Stecke höchstens ${MAX_BLOECKE} Blöcke hintereinander und drück dann „▶ Start". Krümel macht genau, was dasteht.`,
    );
    this.render();
  }

  private render() {
    const g = this.draw.clear();
    this.level.raster.forEach((row, y) =>
      [...row].forEach((c, x) => {
        const col = c === '#' ? PAL.grau1 : c === 'Z' ? PAL.gelb : PAL.gruen2;
        g.fillStyle(hexToInt(col), 1).fillRect(this.gx + x * this.cell, this.gy + y * this.cell, this.cell - 1, this.cell - 1);
      }),
    );
    this.kruemel.setPosition(this.gx + this.pos.x * this.cell + this.cell / 2 - 0.5, this.gy + this.pos.y * this.cell + this.cell / 2 - 0.5).setAngle(this.pos.r * 90);
    this.paletteTexts.forEach((t, i) => {
      if (this.palette[i] === 'wdh') t.setText(`⟳ ${this.anzahl}×`);
      t.setTint(hexToInt(i === this.sel ? PAL.gelb : PAL.weiss));
    });
    const aktivBlock = this.laufend ? this.laufend.schritte[Math.max(0, this.laufend.i - 1)]?.block : undefined;
    const py = this.progY - 3;
    this.progTexts.forEach((t, i) => {
      const b = this.programm[i];
      const aktiv = this.laufend !== null && aktivBlock === i;
      const x = 110 + i * 20;
      const kontroll = b && (istWiederhole(b) || b === 'ende' || b === 'wenn' || b === 'solange');
      g.fillStyle(hexToInt(aktiv ? PAL.gelb : b ? (kontroll ? PAL.lila2 : PAL.blau2) : PAL.nacht), 1).fillRect(x, py, 18, 16);
      g.lineStyle(1, hexToInt(b ? PAL.weiss : PAL.grau2), 1).strokeRect(x + 0.5, py + 0.5, 17, 15);
      const txt = b ? icon(b) : String(i + 1);
      t.setText(txt).setPosition(Math.round(x + 9 - measureText(txt) / 2), this.progY).setTint(hexToInt(aktiv ? PAL.ink : b ? PAL.weiss : PAL.grau2));
    });
    // Rahmen um gewählten Paletten-Block
    const t = this.paletteTexts[this.sel];
    g.lineStyle(1, hexToInt(PAL.gelb), 1).strokeRect(t.x - 3.5, t.y - 2.5, measureText(t.text) + 6, 13);
  }

  private press() {
    if (this.ende) return this.finish();
    if (this.laufend) return;
    const k = this.palette[this.sel];
    if (k === 'loeschen') this.programm.pop();
    else if (k === 'start') {
      const r = fuehreAus(this.level, this.programm);
      const start = findeStart(this.level);
      this.pos = { ...start, r: this.level.startRichtung };
      this.laufend = { schritte: r.schritte, i: 0, t: 0, geschafft: r.geschafft };
      this.feedback('Krümel fährt los …');
    } else if (this.programm.length < MAX_BLOECKE) this.programm.push(k === 'wdh' ? (`wdh${this.anzahl}` as Wiederhole) : k);
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
    const naechster = soll[this.programm.length];
    if (!passt) ziel = this.palette.indexOf('loeschen');
    else if (this.programm.length === soll.length) ziel = this.palette.indexOf('start');
    else ziel = this.palette.indexOf(blockArt(naechster));
    const keys: string[] = [];
    for (let k = 0; k < Math.abs(ziel - this.sel); k++) keys.push(ziel > this.sel ? 'ArrowRight' : 'ArrowLeft');
    if (passt && naechster && istWiederhole(naechster)) {
      const n = Number(naechster.slice(3));
      for (let k = 0; k < Math.abs(n - this.anzahl); k++) keys.push(n > this.anzahl ? 'ArrowUp' : 'ArrowDown');
    }
    return [...keys, 'Space'];
  }

  update(input: Input, dt: number) {
    if (this.laufend) {
      this.stepRun(dt);
      input.consume('a');
      return;
    }
    const n = this.palette.length;
    if (input.consume('left')) this.sel = (this.sel + n - 1) % n;
    if (input.consume('right')) this.sel = (this.sel + 1) % n;
    if (input.consume('up')) this.anzahl = Math.min(9, this.anzahl + 1);
    if (input.consume('down')) this.anzahl = Math.max(2, this.anzahl - 1);
    if (input.consume('b')) this.programm.pop();
    if (input.consume('a')) this.press();
    this.render();
  }
}

export const bloeckeMinigame: Minigame = (ctx) =>
  new Promise((resolve) => ctx.push(new BloeckeModal(ctx.scene, KRUEMEL_LEVEL[ctx.param ?? 'garten'] ?? KRUEMEL_LEVEL.garten, resolve)));

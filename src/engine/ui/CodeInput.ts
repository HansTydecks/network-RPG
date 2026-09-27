import Phaser from 'phaser';
import { audio } from '../audio/Audio';
import { ALPHABET, groupCode, normalizeCode } from '../state/base32';
import { PAL } from '../gfx/palette';
import type { Input } from '../input/Input';
import { drawPanel, screenContainer, setWrapped, uiText, type Modal } from './widgets';

const COLS = 8;
const KEYS = [...ALPHABET, '⌫', 'OK'];

/**
 * Code-Eingabe im Retro-Stil (für Kalender-Codes und Speichercodes).
 * Bedienbar mit Pfeiltasten + A, direkt per Tastatur oder durch Antippen.
 */
export class CodeInput implements Modal {
  done = false;
  private root: Phaser.GameObjects.Container;
  private value = '';
  private sel = 0;
  private display: Phaser.GameObjects.BitmapText;
  private cursor: Phaser.GameObjects.Graphics;
  private keyPos: { x: number; y: number; w: number }[] = [];
  private blink = 0;

  constructor(scene: Phaser.Scene, title: string, private maxLen: number, private resolve: (code: string | null) => void, private input: Input) {
    input.textMode = true;
    input.takeTyped();
    this.root = screenContainer(scene, 1300);
    const w = 236;
    const h = 140;
    const x = Math.floor((320 - w) / 2);
    const y = 22;
    const g = scene.add.graphics();
    drawPanel(g, x, y, w, h);
    this.root.add(g);
    this.root.add(uiText(scene, x + 10, y + 8, title, PAL.gelb));
    this.display = uiText(scene, x + 10, y + 24, '', PAL.netzKabel);
    this.root.add(this.display);
    KEYS.forEach((k, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const kx = x + 14 + col * 26;
      const ky = y + 50 + row * 14;
      const kw = k.length > 1 ? 22 : 10;
      this.keyPos.push({ x: kx, y: ky, w: kw });
      const t = uiText(scene, kx + 2, ky + 2, k);
      t.setInteractive(new Phaser.Geom.Rectangle(-3, -3, kw + 4, 14), Phaser.Geom.Rectangle.Contains);
      t.on('pointerdown', () => {
        this.sel = i;
        this.press();
      });
      this.root.add(t);
    });
    this.root.add(uiText(scene, x + 10, y + h - 16, 'Tippen oder wählen · Esc = Abbrechen', PAL.grau3));
    this.cursor = scene.add.graphics();
    this.root.add(this.cursor);
    this.refresh();
  }

  private refresh() {
    // Vierergruppen mit Leerzeichen, damit lange Codes umbrechen statt über den Rand zu laufen
    const shown = groupCode(this.value).replace(/-/g, ' ');
    setWrapped(this.display, shown + (this.value.length < this.maxLen && Math.floor(this.blink / 400) % 2 === 0 ? '_' : ''), 216);
    const k = this.keyPos[this.sel];
    this.cursor.clear().lineStyle(1, 0xffcd75, 1).strokeRect(k.x - 1.5, k.y - 0.5, k.w + 4, 13);
  }

  private add(ch: string) {
    const n = normalizeCode(ch);
    if (n.length === 1 && ALPHABET.includes(n) && this.value.length < this.maxLen) this.value += n;
  }

  private finish(code: string | null) {
    if (this.done) return;
    this.done = true;
    this.input.textMode = false;
    this.resolve(code);
  }

  private press() {
    const k = KEYS[this.sel];
    if (k === '⌫') this.value = this.value.slice(0, -1);
    else if (k === 'OK') this.finish(this.value);
    else this.add(k);
    this.refresh();
  }

  update(input: Input, dt: number) {
    this.blink += dt;
    for (const ch of input.takeTyped()) {
      audio.sfx('tippen');
      if (ch === '\b') this.value = this.value.slice(0, -1);
      else if (ch === '\n') return this.finish(this.value);
      else this.add(ch);
    }
    if (input.consume('left')) this.sel = (this.sel - 1 + KEYS.length) % KEYS.length;
    if (input.consume('right')) this.sel = (this.sel + 1) % KEYS.length;
    if (input.consume('up')) this.sel = Math.max(0, this.sel - COLS);
    if (input.consume('down')) this.sel = Math.min(KEYS.length - 1, this.sel + COLS);
    if (input.consume('a')) this.press();
    if (input.consume('b')) return this.finish(null);
    this.refresh();
  }

  destroy() {
    this.input.textMode = false;
    this.root.destroy(true);
  }
}

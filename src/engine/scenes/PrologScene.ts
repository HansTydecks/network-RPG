import Phaser from 'phaser';
import { PROLOG_SCREEN } from '../../content/art/prolog';
import { PAL, hexToInt } from '../gfx/palette';
import { FONT_KEY } from '../gfx/textures';
import { measureText } from '../gfx/fontGlyphs';
import type { Input } from '../input/Input';

/** Was auf dem Monitor im Keller erscheint (Zeile für Zeile getippt). */
const ZEILEN = ['> verbinde …', '> KABELITZ: 214 Geräte', '> Leitung: kappen', '> PHASE 1 AKTIV', '> BEGINNE FUNKSTILLE.'];

/**
 * Prolog: Nacht, ein Keller, jemand tippt. Man sieht nur eine Hand im Strickjackenärmel,
 * einen Klappenschrank, einen Taubenkäfig und eine Tasse. Überspringen mit Esc.
 */
export class PrologScene extends Phaser.Scene {
  private inp!: Input;
  private t = 0;
  private lines: Phaser.GameObjects.BitmapText[] = [];
  private hand!: Phaser.GameObjects.Sprite;
  private symbol!: Phaser.GameObjects.Image;
  private caption!: Phaser.GameObjects.BitmapText;
  private leaving = false;

  constructor() {
    super('Prolog');
  }

  create() {
    this.inp = this.registry.get('input');
    this.t = 0;
    this.leaving = false;
    this.lines = [];
    this.cameras.main.setBackgroundColor('#000000');
    this.add.image(0, 0, 'prolog_bg').setOrigin(0);
    ZEILEN.forEach((_, i) => {
      const t = this.add.bitmapText(PROLOG_SCREEN.x + 3, PROLOG_SCREEN.y + 3 + i * 10, FONT_KEY, '').setTint(0x7dff9a);
      this.lines.push(t);
    });
    this.hand = this.add.sprite(176, 116, 'prolog_hand', 0).setOrigin(0);
    this.symbol = this.add.image(PROLOG_SCREEN.x + PROLOG_SCREEN.w / 2, PROLOG_SCREEN.y + PROLOG_SCREEN.h / 2, 'funkstille').setScale(2).setAlpha(0);
    const text = 'Irgendwo in Kabelitz, mitten in der Nacht …';
    this.caption = this.add.bitmapText(Math.round(160 - measureText(text) / 2), 6, FONT_KEY, text).setTint(hexToInt(PAL.grau4));
    this.add.bitmapText(4, 170, FONT_KEY, 'Esc: überspringen').setTint(hexToInt(PAL.grau2));
    this.cameras.main.fadeIn(800);
  }

  private leave() {
    if (this.leaving) return;
    this.leaving = true;
    this.cameras.main.fadeOut(900);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('World'));
  }

  update(_time: number, dt: number) {
    this.t += dt;
    const chars = Math.max(0, (this.t - 1200) / 70);
    let left = chars;
    ZEILEN.forEach((z, i) => {
      const n = Math.max(0, Math.min(z.length, Math.floor(left)));
      this.lines[i].setText(z.slice(0, n));
      left -= z.length + 6; // kurze Pause nach jeder Zeile
    });
    const typing = left < 0 && chars > 0;
    this.hand.setFrame(typing ? Math.floor(this.t / 110) % 2 : 0);
    const allTyped = left >= 0;
    if (allTyped) {
      const k = Math.min(1, (left - 0) / 25);
      for (const l of this.lines) l.setAlpha(1 - k);
      this.symbol.setAlpha(k);
      if (left > 60) this.caption.setText('');
      if (left > 70) this.leave();
    }
    if (this.inp.consume('b') || this.inp.consume('menu')) this.leave();
    this.inp.consume('a');
  }
}

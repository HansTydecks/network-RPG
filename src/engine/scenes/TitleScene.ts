import Phaser from 'phaser';
import { PAL, hexToInt } from '../gfx/palette';
import { FONT_KEY } from '../gfx/textures';
import { measureText } from '../gfx/fontGlyphs';
import type { Input } from '../input/Input';
import { newGameState, type GameState } from '../state/GameState';
import { decodeSaveCode } from '../state/SaveCode';
import { loadAutosave } from '../state/storage';
import { CodeInput } from '../ui/CodeInput';
import { DialogBox } from '../ui/DialogBox';
import { ListMenu } from '../ui/ListMenu';
import { UiStack, type Modal } from '../ui/widgets';
import { addTouchControls, isTouchDevice } from '../ui/TouchControls';

/** Titelbild: nächtlicher Himmel, leuchtende Kabel, Ping fliegt vorbei. */
export class TitleScene extends Phaser.Scene {
  private inp!: Input;
  private ui = new UiStack();
  private gfx!: Phaser.GameObjects.Graphics;
  private t = 0;
  private stars: { x: number; y: number; p: number }[] = [];
  private ping!: Phaser.GameObjects.Sprite;

  constructor() {
    super('Title');
  }

  create() {
    this.inp = this.registry.get('input');
    this.ui = new UiStack();
    this.cameras.main.setBackgroundColor(PAL.nacht);
    for (let i = 0; i < 40; i++) this.stars.push({ x: Math.random() * 320, y: Math.random() * 110, p: Math.random() * 6 });
    this.gfx = this.add.graphics();
    const title = this.add.bitmapText(160, 28, FONT_KEY, 'NETZBLICK').setOrigin(0.5, 0).setScale(3).setTint(hexToInt(PAL.netzKabel));
    title.setX(Math.round(160 - (measureText('NETZBLICK') * 3) / 2)).setOrigin(0, 0);
    const sub = 'Alex und die Funkstille';
    this.add.bitmapText(Math.round(160 - measureText(sub) / 2), 62, FONT_KEY, sub).setTint(hexToInt(PAL.gelb));
    const foot = 'Ein Informatik-Abenteuer · Testversion M0';
    this.add.bitmapText(Math.round(160 - measureText(foot) / 2), 168, FONT_KEY, foot).setTint(hexToInt(PAL.grau2));
    this.ping = this.add.sprite(-20, 90, 'ping', 2).play('ping_flap');
    if (isTouchDevice()) addTouchControls(this, this.inp).setDpadVisible(false);
    this.cameras.main.fadeIn(400);
    this.showMenu();
  }

  private modal<T>(make: (r: (v: T) => void) => Modal): Promise<T> {
    return new Promise((resolve) => this.ui.push(make(resolve)));
  }

  private async showMenu() {
    const saved = loadAutosave();
    const options: [string, () => Promise<void> | void][] = [];
    if (saved) options.push(['Weiterspielen', () => this.start(saved)]);
    options.push(['Neues Spiel', () => this.start(newGameState())]);
    options.push(['Speichercode eingeben', () => this.enterCode()]);
    const i = await this.modal<number>((r) => new ListMenu(this, options.map((o) => o[0]), r, { anchor: 'free', x: 110, y: 84 }));
    await options[i][1]();
  }

  private async enterCode() {
    const code = await this.modal<string | null>((r) => new CodeInput(this, 'Dein Speichercode:', 32, r, this.inp));
    if (code) {
      const state = decodeSaveCode(code);
      if (state) return this.start(state);
      await this.modal<void>((r) => new DialogBox(this, 'Ping', 'Gurr? Dieser Code funktioniert nicht. Prüf noch einmal jeden Buchstaben!', r));
    }
    this.showMenu();
  }

  private start(state: GameState) {
    this.registry.set('state', state);
    this.cameras.main.fadeOut(300);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('World'));
  }

  update(_time: number, dt: number) {
    this.t += dt;
    this.ui.update(this.inp, dt);
    const g = this.gfx.clear();
    for (const s of this.stars) {
      const a = 0.4 + 0.6 * Math.abs(Math.sin(this.t / 700 + s.p));
      g.fillStyle(0xffffff, a).fillRect(Math.round(s.x), Math.round(s.y), 1, 1);
    }
    // Hügel mit leuchtenden Kabeln
    g.fillStyle(hexToInt(PAL.gruen1), 1).fillRect(0, 130, 320, 50);
    const pulse = 0.5 + 0.5 * Math.sin(this.t / 300);
    g.lineStyle(3, hexToInt(PAL.netzKabel), 0.2 + 0.1 * pulse);
    g.lineBetween(0, 150, 320, 150).lineBetween(60, 150, 60, 130).lineBetween(250, 150, 250, 130);
    g.lineStyle(1, hexToInt(PAL.netzKabel), 1);
    g.lineBetween(0, 150, 320, 150).lineBetween(60, 150, 60, 130).lineBetween(250, 150, 250, 130);
    const px = (this.t / 12) % 360;
    g.fillStyle(hexToInt(PAL.netzPaket), 1).fillRect(Math.round(px) - 20, 148, 6, 4);
    this.ping.setPosition(((this.t / 20) % 380) - 30, 100 + Math.sin(this.t / 400) * 8);
  }
}

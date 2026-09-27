import Phaser from 'phaser';
import { PAL, hexToInt } from '../engine/gfx/palette';
import type { Input } from '../engine/input/Input';
import { uiText } from '../engine/ui/widgets';
import { PixBuf } from '../engine/gfx/pixbuf';
import { FOTO_START, fotoRichtig, wendeAn, type FotoEinstellung } from './fotoLogic';
import { MinigameModal, type Minigame } from './base';

const W = 48;
const H = 32;
const SCALE = 3;

/** Das alte Foto: junger Mann mit Brieftauben vor einem Klappenschrank, 1974. */
function altesFoto(): PixBuf {
  const b = new PixBuf(W, H, '#8a7b66');
  b.rect(0, 22, W, 10, '#5e5446');
  // Klappenschrank links
  b.rect(2, 4, 16, 20, '#4a3a2a');
  for (let y = 6; y < 22; y += 4) for (let x = 4; x < 17; x += 4) b.rect(x, y, 2, 2, '#1e1a16');
  // Mann (Mitte)
  b.disc(28, 9, 3.5, '#e0c2a2').rect(25, 5, 7, 2, '#f0f0f0');
  b.rect(23, 13, 10, 11, '#3b4a6b').rect(21, 14, 2, 7, '#e0c2a2').rect(33, 14, 2, 7, '#e0c2a2');
  b.rect(24, 24, 3, 6, '#2a2a2a').rect(29, 24, 3, 6, '#2a2a2a');
  // Tauben rechts
  for (const [x, y] of [[38, 12], [42, 16], [37, 19]] as const) b.disc(x, y, 2.5, '#b0b0b8').set(x - 3, y - 1, '#e08040');
  return b;
}

const OPTIONEN: { key: keyof FotoEinstellung; label: string }[] = [
  { key: 'negativ', label: 'Negativ umkehren' },
  { key: 'rot', label: 'Rot-Kanal' },
  { key: 'gruen', label: 'Grün-Kanal' },
  { key: 'blau', label: 'Blau-Kanal' },
  { key: 'graustufen', label: 'Graustufen' },
];

class FotolaborModal extends MinigameModal {
  private e: FotoEinstellung = { ...FOTO_START };
  private cursor = 0;
  private rows: Phaser.GameObjects.BitmapText[] = [];
  private tex: Phaser.Textures.CanvasTexture;
  private foto = altesFoto();
  private ende = false;

  constructor(scene: Phaser.Scene, resolve: () => void) {
    super(scene, 'Das Fotolabor', '↑↓ wählen · Leertaste an/aus', resolve);
    if (scene.textures.exists('fotolabor')) scene.textures.remove('fotolabor');
    this.tex = scene.textures.createCanvas('fotolabor', W * SCALE, H * SCALE)!;
    this.root.add(scene.add.image(12, 24, 'fotolabor').setOrigin(0).setScrollFactor(0));
    OPTIONEN.forEach((_o, i) => {
      const t = uiText(scene, 170, 30 + i * 14, '');
      t.setInteractive(new Phaser.Geom.Rectangle(-6, -2, 140, 13), Phaser.Geom.Rectangle.Contains);
      t.on('pointerdown', () => {
        this.cursor = i;
        this.toggle();
      });
      this.rows.push(t);
      this.root.add(t);
    });
    this.feedback('Frau Fröhlich: „Das Foto ist von 1974 – also schwarz-weiß. Aber der Scanner hat alles verdreht. Kannst du es retten?"');
    this.render();
  }

  private render() {
    const ctx = this.tex.getContext();
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const hex = this.foto.get(x, y) ?? '#000000';
        const [r, g, b] = wendeAn([parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)], this.e);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
      }
    this.tex.refresh();
    OPTIONEN.forEach((o, i) => {
      this.rows[i].setText(`${i === this.cursor ? '▸' : ' '} [${this.e[o.key] ? 'X' : ' '}] ${o.label}`).setTint(hexToInt(i === this.cursor ? PAL.gelb : PAL.weiss));
    });
  }

  private toggle() {
    if (this.ende) return this.finish();
    const k = OPTIONEN[this.cursor].key;
    this.e[k] = !this.e[k];
    if (fotoRichtig(this.e)) {
      this.ende = true;
      this.feedback('Das Foto ist gerettet! Ein junger Mann mit Brieftauben im Fernmeldeamt. Auf der Rückseite steht „W. L., 1974". (Leertaste)');
      this.setHelp('Leertaste: weiter');
    }
    this.render();
  }

  solutionKeys(): string[] {
    if (this.ende) return ['Space'];
    const soll: FotoEinstellung = { negativ: false, rot: true, gruen: true, blau: true, graustufen: true };
    const i = OPTIONEN.findIndex((o) => this.e[o.key] !== soll[o.key]);
    const keys: string[] = [];
    for (let k = 0; k < Math.abs(i - this.cursor); k++) keys.push(i > this.cursor ? 'ArrowDown' : 'ArrowUp');
    return [...keys, 'Space'];
  }

  update(input: Input) {
    if (input.consume('up')) this.cursor = (this.cursor + OPTIONEN.length - 1) % OPTIONEN.length;
    if (input.consume('down')) this.cursor = (this.cursor + 1) % OPTIONEN.length;
    if (input.consume('a')) this.toggle();
    this.render();
  }
}

export const fotolaborMinigame: Minigame = (ctx) => new Promise((resolve) => ctx.push(new FotolaborModal(ctx.scene, resolve)));

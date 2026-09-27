import Phaser from 'phaser';
import { PAL, hexToInt } from '../engine/gfx/palette';
import { measureText } from '../engine/gfx/fontGlyphs';
import type { Input } from '../engine/input/Input';
import { uiText } from '../engine/ui/widgets';
import { MinigameModal, type Minigame } from './base';

/** Die Reise des Briefs als Zeitleiste. Endet mit der Gesamtdauer: 2 Tage und 3 Stunden. */
export const STATIONEN_EMAIL = [
  { ort: 'Dein Computer', zeit: '0,00 s' },
  { ort: 'Grauer Kasten', zeit: '0,01 s' },
  { ort: 'Knotenburg', zeit: '0,05 s' },
  { ort: 'Frankfurt', zeit: '0,30 s' },
  { ort: 'Adas Postfach', zeit: '0,80 s' },
];

export const STATIONEN = [
  { ort: 'Briefkasten', zeit: 'Tag 1, 10:15' },
  { ort: 'Postauto', zeit: 'Tag 1, 17:00' },
  { ort: 'Briefzentrum', zeit: 'Tag 2, 09:30' },
  { ort: 'Zustellerin', zeit: 'Tag 3, 08:00' },
  { ort: 'Linas Briefkasten', zeit: 'Tag 3, 13:15' },
];

class ReiseModal extends MinigameModal {
  private stationen: typeof STATIONEN;
  private t = 0;
  private gfxLine: Phaser.GameObjects.Graphics;
  private letter: Phaser.GameObjects.Image;
  private labels: Phaser.GameObjects.BitmapText[] = [];
  private summary: Phaser.GameObjects.BitmapText;

  constructor(scene: Phaser.Scene, resolve: () => void, private email = false) {
    super(scene, email ? 'Die Reise deiner E-Mail' : 'Die Reise deines Briefs', 'Leertaste: weiter', resolve);
    this.stationen = email ? STATIONEN_EMAIL : STATIONEN;
    this.gfxLine = scene.add.graphics().setScrollFactor(0);
    this.root.add(this.gfxLine);
    this.stationen.forEach((s, i) => {
      const x = this.x(i);
      const clampX = (w: number) => Math.round(Math.max(12, Math.min(306 - w, x - w / 2)));
      const a = uiText(scene, clampX(measureText(s.ort)), i % 2 ? 84 : 44, s.ort).setAlpha(0);
      const b = uiText(scene, clampX(measureText(s.zeit)), i % 2 ? 95 : 55, s.zeit, PAL.grau4).setAlpha(0);
      this.labels.push(a, b);
      this.root.add([a, b]);
    });
    this.letter = scene.add.image(this.x(0), 72, email ? 'paket_netz' : 'icon_brief').setScrollFactor(0);
    this.root.add(this.letter);
    const sum = email ? 'E-Mail: 0,8 Sekunden · Brief: 2 Tage und 3 Stunden' : 'Unterwegs: 2 Tage und 3 Stunden';
    this.summary = uiText(scene, 60, 114, sum, PAL.gelb).setAlpha(0);
    this.summary.setX(Math.round(160 - measureText(sum) / 2));
    this.root.add(this.summary);
    this.feedback(
      email
        ? 'Deine E-Mail reist in Datenpaketen durch Kabel: über den grauen Kasten, Knotenburg und Frankfurt bis in Tante Adas Postfach.'
        : 'So reist ein Brief: vom Briefkasten über das Postauto und das Briefzentrum bis zu Lina.',
    );
  }

  private x(i: number) {
    return 40 + i * 60;
  }

  private get progress() {
    return Math.min(this.stationen.length - 1, this.t / (this.email ? 450 : 900));
  }

  solutionKeys(): string[] {
    return ['Space'];
  }

  update(input: Input, dt: number) {
    this.t += dt;
    const p = this.progress;
    const g = this.gfxLine.clear();
    g.lineStyle(2, hexToInt(PAL.grau2), 1).lineBetween(this.x(0), 72, this.x(this.stationen.length - 1), 72);
    g.lineStyle(2, hexToInt(PAL.gelb), 1).lineBetween(this.x(0), 72, this.x(0) + p * 60, 72);
    this.stationen.forEach((_, i) => {
      const reached = p >= i;
      g.fillStyle(hexToInt(reached ? PAL.gelb : PAL.grau2), 1).fillCircle(this.x(i), 72, 4);
      this.labels[i * 2].setAlpha(reached ? 1 : 0.25);
      this.labels[i * 2 + 1].setAlpha(reached ? 1 : 0);
    });
    this.letter.setPosition(Math.round(this.x(0) + p * 60), 64);
    const done = p >= this.stationen.length - 1;
    this.summary.setAlpha(done ? 1 : 0);
    if (input.consume('a')) {
      if (done) this.finish();
      else this.t = 900 * (this.stationen.length - 1);
    }
  }
}

export const briefreiseMinigame: Minigame = (ctx) => new Promise((resolve) => ctx.push(new ReiseModal(ctx.scene, resolve, ctx.param === 'email')));

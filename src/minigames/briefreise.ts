import Phaser from 'phaser';
import { PAL, hexToInt } from '../engine/gfx/palette';
import { measureText } from '../engine/gfx/fontGlyphs';
import type { Input } from '../engine/input/Input';
import { uiText } from '../engine/ui/widgets';
import { MinigameModal, type Minigame } from './base';

/** Die Reise des Briefs als Zeitleiste. Endet mit der Gesamtdauer: 2 Tage und 3 Stunden. */
export const STATIONEN = [
  { ort: 'Briefkasten', zeit: 'Tag 1, 10:15' },
  { ort: 'Postauto', zeit: 'Tag 1, 17:00' },
  { ort: 'Briefzentrum', zeit: 'Tag 2, 09:30' },
  { ort: 'Zustellerin', zeit: 'Tag 3, 08:00' },
  { ort: 'Linas Briefkasten', zeit: 'Tag 3, 13:15' },
];

class ReiseModal extends MinigameModal {
  private t = 0;
  private gfxLine: Phaser.GameObjects.Graphics;
  private letter: Phaser.GameObjects.Image;
  private labels: Phaser.GameObjects.BitmapText[] = [];
  private summary: Phaser.GameObjects.BitmapText;

  constructor(scene: Phaser.Scene, resolve: () => void) {
    super(scene, 'Die Reise deines Briefs', 'Leertaste: weiter', resolve);
    this.gfxLine = scene.add.graphics().setScrollFactor(0);
    this.root.add(this.gfxLine);
    STATIONEN.forEach((s, i) => {
      const x = this.x(i);
      const clampX = (w: number) => Math.round(Math.max(8, Math.min(312 - w, x - w / 2)));
      const a = uiText(scene, clampX(measureText(s.ort)), i % 2 ? 84 : 44, s.ort).setAlpha(0);
      const b = uiText(scene, clampX(measureText(s.zeit)), i % 2 ? 95 : 55, s.zeit, PAL.grau4).setAlpha(0);
      this.labels.push(a, b);
      this.root.add([a, b]);
    });
    this.letter = scene.add.image(this.x(0), 72, 'icon_brief').setScrollFactor(0);
    this.root.add(this.letter);
    this.summary = uiText(scene, 60, 114, 'Unterwegs: 2 Tage und 3 Stunden', PAL.gelb).setAlpha(0);
    this.summary.setX(Math.round(160 - measureText('Unterwegs: 2 Tage und 3 Stunden') / 2));
    this.root.add(this.summary);
    this.feedback('So reist ein Brief: vom Briefkasten über das Postauto und das Briefzentrum bis zu Lina.');
  }

  private x(i: number) {
    return 40 + i * 60;
  }

  private get progress() {
    return Math.min(STATIONEN.length - 1, this.t / 900);
  }

  solutionKeys(): string[] {
    return ['Space'];
  }

  update(input: Input, dt: number) {
    this.t += dt;
    const p = this.progress;
    const g = this.gfxLine.clear();
    g.lineStyle(2, hexToInt(PAL.grau2), 1).lineBetween(this.x(0), 72, this.x(STATIONEN.length - 1), 72);
    g.lineStyle(2, hexToInt(PAL.gelb), 1).lineBetween(this.x(0), 72, this.x(0) + p * 60, 72);
    STATIONEN.forEach((_, i) => {
      const reached = p >= i;
      g.fillStyle(hexToInt(reached ? PAL.gelb : PAL.grau2), 1).fillCircle(this.x(i), 72, 4);
      this.labels[i * 2].setAlpha(reached ? 1 : 0.25);
      this.labels[i * 2 + 1].setAlpha(reached ? 1 : 0);
    });
    this.letter.setPosition(Math.round(this.x(0) + p * 60), 64);
    const done = p >= STATIONEN.length - 1;
    this.summary.setAlpha(done ? 1 : 0);
    if (input.consume('a')) {
      if (done) this.finish();
      else this.t = 900 * (STATIONEN.length - 1);
    }
  }
}

export const briefreiseMinigame: Minigame = (ctx) => new Promise((resolve) => ctx.push(new ReiseModal(ctx.scene, resolve)));

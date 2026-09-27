import Phaser from 'phaser';
import { measureText } from '../gfx/fontGlyphs';
import { PAL } from '../gfx/palette';
import { drawPanel, screenContainer, uiText, type Modal } from './widgets';
import type { Input } from '../input/Input';

/** Immer sichtbare Aufgabenzeile oben links + Hinweis auf die Hilfe-Taste. */
export class Hud {
  private root: Phaser.GameObjects.Container;
  private panel: Phaser.GameObjects.Graphics;
  private text: Phaser.GameObjects.BitmapText;
  private netTag: Phaser.GameObjects.BitmapText;

  constructor(scene: Phaser.Scene) {
    this.root = screenContainer(scene, 900);
    this.panel = scene.add.graphics();
    this.text = uiText(scene, 10, 7, '');
    this.netTag = uiText(scene, 250, 166, 'NETZBLICK AN', PAL.netzKabel).setVisible(false);
    this.root.add([this.panel, this.text, this.netTag]);
  }

  setQuest(title: string | null) {
    this.panel.clear();
    this.text.setText('');
    if (!title) return;
    const label = `▸ ${title}`;
    const w = Math.min(312, measureText(label) + 14);
    drawPanel(this.panel, 2, 2, w, 18);
    this.text.setText(label);
  }

  setNet(on: boolean) {
    this.netTag.setVisible(on);
  }

  setVisible(v: boolean) {
    this.root.setVisible(v);
  }
}

/** Kurze Meldung oben in der Mitte (z. B. „Erhalten: …"). Weiter mit A oder nach Zeitablauf. */
export class Toast implements Modal {
  done = false;
  private root: Phaser.GameObjects.Container;
  private t = 0;

  constructor(scene: Phaser.Scene, text: string, private resolve: () => void, icon?: string) {
    this.root = screenContainer(scene, 1150);
    const w = measureText(text) + (icon ? 34 : 20);
    const x = Math.floor((320 - w) / 2);
    const g = scene.add.graphics();
    drawPanel(g, x, 40, w, 26, PAL.blau1);
    this.root.add(g);
    if (icon) this.root.add(scene.add.image(x + 16, 53, icon).setScrollFactor(0));
    this.root.add(uiText(scene, x + (icon ? 28 : 10), 48, text, PAL.gelb));
  }

  update(input: Input, dt: number) {
    this.t += dt;
    if (this.t > 2200 || (this.t > 250 && (input.consume('a') || input.consume('b')))) {
      this.done = true;
      this.resolve();
    }
  }

  destroy() {
    this.root.destroy(true);
  }
}

import Phaser from 'phaser';
import { measureText, wrapText } from '../gfx/fontGlyphs';
import { PAL, hexToInt } from '../gfx/palette';
import { drawPanel, screenContainer, uiText, type Modal } from './widgets';
import type { Button, Input } from '../input/Input';
import { audio, type Geraeusch } from '../audio/Audio';

/** Tastenhinweise oben rechts; per Maus/Finger auch anklickbar. */
const TASTEN: [string, string, Button][] = [
  ['M', 'Menü', 'menu'],
  ['H', 'Hilfe', 'help'],
  ['N', 'Brille', 'net'],
];

/**
 * Schlankes HUD: Tageszeit unten links, Tastenhinweise oben rechts, „Netzblick an".
 * Die aktuelle Aufgabe steht nicht mehr im Bild – Ping nennt sie auf H.
 */
export class Hud {
  private root: Phaser.GameObjects.Container;
  private netTag: Phaser.GameObjects.BitmapText;
  private timeTag: Phaser.GameObjects.BitmapText;
  private timeBg: Phaser.GameObjects.Graphics;
  private neu: Phaser.GameObjects.Container;
  private questId: string | null = null;

  constructor(private scene: Phaser.Scene, input?: Input) {
    this.root = screenContainer(scene, 900);
    this.netTag = uiText(scene, 250, 170, 'NETZBLICK AN', PAL.netzKabel).setVisible(false);
    this.timeTag = uiText(scene, 0, 169, '', PAL.creme);
    this.timeBg = scene.add.graphics();
    this.root.add([this.timeBg, this.netTag, this.timeTag]);

    let x = 318;
    for (const [taste, wort, button] of [...TASTEN].reverse()) {
      const w = measureText(wort) + 13;
      x -= w + 2;
      const g = scene.add.graphics();
      g.fillStyle(hexToInt(PAL.ink), 0.55).fillRect(x, 2, w, 11);
      g.fillStyle(hexToInt(PAL.creme), 0.9).fillRect(x + 1, 3, 8, 9);
      const k = uiText(scene, x + 2, 3, taste, PAL.ink);
      const t = uiText(scene, x + 11, 3, wort, PAL.creme).setAlpha(0.85);
      const hit = scene.add.zone(x, 2, w, 11).setOrigin(0).setScrollFactor(0).setInteractive({ useHandCursor: true });
      if (input) hit.on('pointerdown', () => input.tap(button));
      this.root.add([g, k, t, hit]);
    }

    this.neu = scene.add.container(0, 0).setScrollFactor(0).setVisible(false);
    const hinweis = 'Neue Aufgabe! Frag Ping mit H.';
    const w = measureText(hinweis) + 12;
    const g = scene.add.graphics();
    drawPanel(g, 2, 2, w, 15, PAL.blau1);
    this.neu.add([g, uiText(scene, 8, 5, hinweis, PAL.gelb)]);
    this.root.add(this.neu);
  }

  setTime(label: string) {
    this.timeTag.setText(label).setX(5);
    this.timeBg.clear();
    if (label) this.timeBg.fillStyle(hexToInt(PAL.ink), 0.55).fillRect(2, 167, measureText(label) + 6, 12);
  }

  /** Merkt sich die Aufgabe; bei einer neuen blinkt kurz ein Hinweis auf (blockiert nichts). */
  setQuest(id: string | null, ankuendigen = true) {
    const neu = id !== null && id !== this.questId;
    this.questId = id;
    if (!neu || !ankuendigen) return;
    audio.sfx('quest');
    this.scene.tweens.killTweensOf(this.neu);
    this.neu.setVisible(true).setAlpha(1);
    this.scene.tweens.add({ targets: this.neu, alpha: 0, delay: 3500, duration: 600, onComplete: () => this.neu.setVisible(false) });
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

  constructor(scene: Phaser.Scene, text: string, private resolve: () => void, icon?: string, klang: Geraeusch = 'toast') {
    this.root = screenContainer(scene, 1150);
    audio.sfx(klang);
    const lines = wrapText(text, 260);
    const w = Math.max(...lines.map((l) => measureText(l))) + (icon ? 34 : 20);
    const h = 16 + lines.length * 11;
    const x = Math.floor((320 - w) / 2);
    const g = scene.add.graphics();
    drawPanel(g, x, 40, w, h, PAL.blau1);
    this.root.add(g);
    if (icon) this.root.add(scene.add.image(x + 16, 40 + h / 2, icon).setScrollFactor(0));
    this.root.add(uiText(scene, x + (icon ? 28 : 10), 48, lines.join('\n'), PAL.gelb));
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

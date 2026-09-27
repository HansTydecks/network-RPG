import Phaser from 'phaser';
import { PAL, hexToInt } from '../gfx/palette';
import { measureText } from '../gfx/fontGlyphs';
import type { Input } from '../input/Input';
import type { ScanData } from '../world/MapDef';
import { drawPanel, screenContainer, uiText, type Modal } from './widgets';

/**
 * Objektkarte der Brille – bewusst in der Schreibweise eines Objektdiagramms:
 * „morse : Katze" unterstrichen, darunter Attribute mit Werten und Methoden.
 */
export class ObjectCard implements Modal {
  done = false;
  private root: Phaser.GameObjects.Container;
  private t = 0;

  constructor(scene: Phaser.Scene, data: ScanData, private resolve: () => void) {
    this.root = screenContainer(scene, 1180);
    const head = `${data.name} : ${data.klasse}`;
    const lines = [...data.attribute.map(([k, v]) => `${k} = ${v}`), ...data.methoden.map((m) => `${m}()`)];
    const w = Math.max(150, measureText(head) + 30, ...lines.map((l) => measureText(l) + 30));
    const h = 42 + data.attribute.length * 11 + data.methoden.length * 11 + 6;
    const x = Math.floor((320 - w) / 2);
    const y = Math.max(8, Math.floor((126 - h) / 2));
    const g = scene.add.graphics();
    drawPanel(g, x, y, w, h, PAL.blau1);
    g.fillStyle(hexToInt(PAL.netzKabel), 1).fillRect(x + 4, y + 4, w - 8, 12);
    this.root.add(g);
    this.root.add(uiText(scene, x + 8, y + 5, 'NETZBLICK · Objektkarte', PAL.ink));
    const title = uiText(scene, x + 10, y + 20, head, PAL.gelb);
    this.root.add(title);
    g.lineStyle(1, hexToInt(PAL.gelb), 1).lineBetween(x + 10, y + 31.5, x + 10 + measureText(head), y + 31.5);
    let ly = y + 36;
    g.lineStyle(1, hexToInt(PAL.grau2), 1).lineBetween(x + 6, ly - 1.5, x + w - 6, ly - 1.5);
    for (const [k, v] of data.attribute) {
      this.root.add(uiText(scene, x + 10, ly, k, PAL.grau4));
      this.root.add(uiText(scene, x + 10 + measureText(k), ly, ` = ${v}`, PAL.weiss));
      ly += 11;
    }
    g.lineStyle(1, hexToInt(PAL.grau2), 1).lineBetween(x + 6, ly + 1.5, x + w - 6, ly + 1.5);
    ly += 4;
    for (const m of data.methoden) {
      this.root.add(uiText(scene, x + 10, ly, `${m}()`, PAL.netzKabel));
      ly += 11;
    }
  }

  update(input: Input, dt: number) {
    this.t += dt;
    if (this.t > 200 && (input.consume('a') || input.consume('b'))) {
      this.done = true;
      this.resolve();
    }
  }

  destroy() {
    this.root.destroy(true);
  }
}

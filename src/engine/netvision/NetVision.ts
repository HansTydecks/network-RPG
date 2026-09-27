import Phaser from 'phaser';
import { PAL, hexToInt } from '../gfx/palette';
import { FONT_KEY } from '../gfx/textures';
import type { NetCable, NetDef } from '../world/MapDef';

const TILE = 16;
const DEPTH = 60;

interface Packet {
  sprite: Phaser.GameObjects.Image;
  points: Phaser.Math.Vector2[];
  seg: number;
  t: number;
  speed: number;
}

/**
 * Die NetzBlick-Brille (Stufe v1): Welt wird abgedunkelt, Kabel leuchten, Geräte pulsieren,
 * Datenpakete wandern als kleine Umschläge. Kupfer = durchgezogene Linie, Glasfaser = Doppellinie,
 * defekt = rot gestrichelt (Form + Farbe, damit es auch bei Farbsehschwäche erkennbar bleibt).
 */
export class NetVision {
  on = false;
  private overlay: Phaser.GameObjects.Rectangle;
  private gfx: Phaser.GameObjects.Graphics;
  private labels: Phaser.GameObjects.BitmapText[] = [];
  private packets: Packet[] = [];
  private spawnTimers: number[];
  private time = 0;

  constructor(
    private scene: Phaser.Scene,
    private net: NetDef | undefined,
    mapW: number,
    mapH: number,
    private isBroken: (flag: string) => boolean,
  ) {
    this.overlay = scene.add.rectangle(-200, -200, mapW * TILE + 400, mapH * TILE + 400, hexToInt(PAL.nacht), 0.8).setOrigin(0).setDepth(DEPTH).setVisible(false);
    this.gfx = scene.add.graphics().setDepth(DEPTH + 1).setVisible(false);
    this.spawnTimers = (net?.cables ?? []).map(() => Math.random() * 800);
    for (const d of net?.devices ?? []) {
      const t = scene.add.bitmapText(d.x * TILE + 8, d.y * TILE - 6, FONT_KEY, d.label).setOrigin(0.5, 1).setTint(hexToInt(PAL.netzKabel));
      t.setDepth(DEPTH + 3).setVisible(false);
      this.labels.push(t);
    }
  }

  get hasNetwork(): boolean {
    return (this.net?.cables.length ?? 0) > 0;
  }

  setOn(on: boolean) {
    this.on = on;
    this.overlay.setVisible(on);
    this.gfx.setVisible(on);
    if (!on) {
      for (const p of this.packets) p.sprite.destroy();
      this.packets = [];
      for (const l of this.labels) l.setVisible(false);
    }
  }

  private broken(c: NetCable) {
    return c.brokenFlag ? this.isBroken(c.brokenFlag) : false;
  }

  private points(c: NetCable): Phaser.Math.Vector2[] {
    return c.path.map(([x, y]) => new Phaser.Math.Vector2(x * TILE + 8, y * TILE + 8));
  }

  update(dt: number, playerX: number, playerY: number) {
    if (!this.on || !this.net) return;
    this.time += dt;
    const pulse = 0.5 + 0.5 * Math.sin(this.time / 300);
    const g = this.gfx.clear();

    this.net.cables.forEach((c, i) => {
      const pts = this.points(c);
      if (this.broken(c)) {
        g.lineStyle(1, hexToInt(PAL.netzDefekt), 1);
        for (let k = 1; k < pts.length; k++) {
          const a = pts[k - 1];
          const b = pts[k];
          const len = Phaser.Math.Distance.BetweenPoints(a, b);
          for (let s = 0; s < len; s += 6) {
            const p1 = a.clone().lerp(b, s / len);
            const p2 = a.clone().lerp(b, Math.min(1, (s + 3) / len));
            g.lineBetween(p1.x, p1.y, p2.x, p2.y);
          }
        }
        return;
      }
      const glass = c.medium === 'glasfaser';
      g.lineStyle(glass ? 6 : 4, hexToInt(PAL.netzKabel), 0.18 + 0.08 * pulse);
      g.strokePoints(pts, false);
      if (glass) {
        g.lineStyle(1, hexToInt(PAL.weiss), 0.9);
        g.strokePoints(pts.map((p) => p.clone().add(new Phaser.Math.Vector2(-1, -1))), false);
        g.strokePoints(pts.map((p) => p.clone().add(new Phaser.Math.Vector2(1, 1))), false);
      } else {
        g.lineStyle(1, hexToInt(PAL.netzKabel), 1);
        g.strokePoints(pts, false);
      }
      this.spawnTimers[i] -= dt;
      if (this.spawnTimers[i] <= 0) {
        this.spawnTimers[i] = 700 + Math.random() * 1300;
        const forward = Math.random() < 0.5;
        const path = forward ? pts : [...pts].reverse();
        const sprite = this.scene.add.image(path[0].x, path[0].y, 'paket_netz').setDepth(DEPTH + 2);
        this.packets.push({ sprite, points: path, seg: 0, t: 0, speed: glass ? 90 : 55 });
      }
    });

    for (const d of this.net.devices) {
      const cx = d.x * TILE + 8;
      const cy = d.y * TILE + 8;
      g.lineStyle(1, hexToInt(PAL.netzKabel), 0.4 + 0.6 * pulse).strokeCircle(cx, cy, 5 + 2 * pulse);
      g.fillStyle(hexToInt(PAL.netzKabel), 1).fillRect(cx - 1, cy - 1, 3, 3);
    }
    this.net.devices.forEach((d, i) => {
      const near = Math.abs(d.x - playerX) <= 3 && Math.abs(d.y - playerY) <= 3;
      this.labels[i].setVisible(near);
    });

    this.packets = this.packets.filter((p) => {
      let move = (p.speed * dt) / 1000;
      while (move > 0 && p.seg < p.points.length - 1) {
        const a = p.points[p.seg];
        const b = p.points[p.seg + 1];
        const len = Phaser.Math.Distance.BetweenPoints(a, b) || 1;
        const remain = len * (1 - p.t);
        if (move < remain) {
          p.t += move / len;
          move = 0;
        } else {
          move -= remain;
          p.seg++;
          p.t = 0;
        }
      }
      if (p.seg >= p.points.length - 1) {
        p.sprite.destroy();
        return false;
      }
      const pos = p.points[p.seg].clone().lerp(p.points[p.seg + 1], p.t);
      p.sprite.setPosition(Math.round(pos.x), Math.round(pos.y));
      return true;
    });
  }

  destroy() {
    for (const p of this.packets) p.sprite.destroy();
    this.overlay.destroy();
    this.gfx.destroy();
    for (const l of this.labels) l.destroy();
  }
}

import Phaser from 'phaser';

/**
 * Umgebungs-Effekte ohne Spielfunktion: trudelnde Blätter, Schmetterlinge, Glühwürmchen,
 * Staub, Tropfen, Schnee, Möwen und Wolkenschatten. Alles liegt in der Welt (nicht in der UI)
 * und wird mit jeder Karte neu aufgebaut.
 */
import type { AmbienteArt } from './ambienteLogic';
export { ambienteFuer } from './ambienteLogic';

interface Teilchen {
  obj: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;
  art: AmbienteArt;
  vx: number;
  vy: number;
  phase: number;
  t: number;
  frame0?: number;
  zielX?: number;
  zielY?: number;
}

const TIEFE: Record<AmbienteArt, number> = {
  wolke: 53,
  blatt: 54,
  bluete: 54,
  falter: 54,
  staub: 54,
  tropfen: 54,
  schnee: 54,
  moewe: 54,
  // über der Nacht-Tönung, damit sie leuchten
  gluehwurm: 56,
};

export class Ambiente {
  private teile: Teilchen[] = [];
  private naechster = new Map<AmbienteArt, number>();
  private zeit = 0;

  constructor(
    private scene: Phaser.Scene,
    private arten: AmbienteArt[],
    private weltBreite: number,
    private weltHoehe: number,
  ) {
    const v = this.sicht();
    for (const art of arten) {
      const anzahl = { falter: 2, gluehwurm: 10, staub: 14, schnee: 26, wolke: 2 }[art as string] ?? 0;
      for (let i = 0; i < anzahl; i++) this.neu(art, v.x + Math.random() * v.width, v.y + Math.random() * v.height);
      this.naechster.set(art, 500 + Math.random() * 2000);
    }
  }

  private sicht(): Phaser.Geom.Rectangle {
    return this.scene.cameras.main.worldView;
  }

  private neu(art: AmbienteArt, x: number, y: number) {
    const s = this.scene;
    let obj: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;
    const t: Partial<Teilchen> = { vx: 0, vy: 0, phase: Math.random() * Math.PI * 2, t: 0 };
    switch (art) {
      case 'blatt':
      case 'bluete': {
        const variante = art === 'blatt' ? Math.floor(Math.random() * 3) * 2 : 0;
        obj = s.add.sprite(x, y, art === 'blatt' ? 'amb_blatt' : 'amb_bluete', variante);
        Object.assign(t, { vx: 16 + Math.random() * 12, vy: 7 + Math.random() * 7, frame0: variante });
        break;
      }
      case 'falter':
        obj = s.add.sprite(x, y, 'amb_falter').play('amb_falter_flug');
        Object.assign(t, { zielX: x, zielY: y });
        break;
      case 'gluehwurm':
        obj = s.add.image(x, y, 'amb_gluehwurm');
        Object.assign(t, { vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6 });
        break;
      case 'staub':
        obj = s.add.image(x, y, 'pixel').setTint(0xfff4d6).setAlpha(0.35);
        Object.assign(t, { vx: (Math.random() - 0.5) * 3, vy: -1 - Math.random() * 2 });
        break;
      case 'tropfen':
        obj = s.add.image(x, y, 'amb_tropfen');
        Object.assign(t, { vy: 60 });
        break;
      case 'schnee':
        obj = s.add.image(x, y, 'amb_flocke').setAlpha(0.9);
        Object.assign(t, { vx: -3 + Math.random() * 2, vy: 10 + Math.random() * 10 });
        break;
      case 'moewe':
        obj = s.add.sprite(x, y, 'amb_moewe').play('amb_moewe_flug');
        Object.assign(t, { vx: 26 + Math.random() * 10 });
        break;
      case 'wolke':
        obj = s.add.image(x, y, 'amb_wolke');
        Object.assign(t, { vx: 5 + Math.random() * 3 });
        break;
    }
    obj.setDepth(TIEFE[art]);
    this.teile.push({ ...(t as Teilchen), obj, art });
  }

  update(dt: number) {
    const s = dt / 1000;
    this.zeit += dt;
    const v = this.sicht();
    // Neue Teilchen, die von außen hereinkommen
    for (const art of this.arten) {
      const rest = (this.naechster.get(art) ?? 0) - dt;
      if (rest > 0) {
        this.naechster.set(art, rest);
        continue;
      }
      if (art === 'blatt' || art === 'bluete') {
        this.neu(art, v.x - 6, v.y + Math.random() * v.height * 0.7);
        this.naechster.set(art, (art === 'bluete' ? 1200 : 2600) + Math.random() * 2600);
      } else if (art === 'tropfen') {
        this.neu(art, v.x + Math.random() * v.width, v.y + Math.random() * v.height * 0.6);
        this.naechster.set(art, 1500 + Math.random() * 2000);
      } else if (art === 'moewe') {
        this.neu(art, v.x - 10, v.y + 10 + Math.random() * v.height * 0.6);
        this.naechster.set(art, 6000 + Math.random() * 5000);
      } else this.naechster.set(art, 1e9);
    }

    for (const p of this.teile) {
      p.t += dt;
      const o = p.obj;
      switch (p.art) {
        case 'blatt':
        case 'bluete':
          o.x += p.vx * s;
          o.y += p.vy * s + Math.sin(p.t / 400 + p.phase) * 0.35;
          if (o instanceof Phaser.GameObjects.Sprite) o.setFrame((p.frame0 ?? 0) + (Math.floor(p.t / 260) % 2));
          break;
        case 'falter': {
          if (p.t > 2200 || p.zielX === undefined) {
            p.t = 0;
            p.zielX = Phaser.Math.Clamp(o.x + (Math.random() - 0.5) * 60, v.x + 10, v.right - 10);
            p.zielY = Phaser.Math.Clamp(o.y + (Math.random() - 0.5) * 40, v.y + 10, v.bottom - 30);
          }
          o.x += (p.zielX - o.x) * 0.02 + Math.sin(this.zeit / 90 + p.phase) * 0.3;
          o.y += (p.zielY! - o.y) * 0.02 + Math.cos(this.zeit / 70 + p.phase) * 0.4;
          break;
        }
        case 'gluehwurm':
          o.x += p.vx * s + Math.sin(this.zeit / 900 + p.phase) * 0.1;
          o.y += p.vy * s + Math.cos(this.zeit / 1100 + p.phase) * 0.1;
          o.setAlpha(0.35 + 0.65 * Math.max(0, Math.sin(this.zeit / 600 + p.phase)));
          this.umlaufen(o, v);
          break;
        case 'staub':
          o.x += p.vx * s;
          o.y += p.vy * s;
          this.umlaufen(o, v);
          break;
        case 'schnee':
          o.x += p.vx * s + Math.sin(p.t / 500 + p.phase) * 0.2;
          o.y += p.vy * s;
          this.umlaufen(o, v);
          break;
        case 'tropfen':
          o.y += p.vy * s;
          if (p.t > 450) o.setAlpha(0);
          break;
        case 'moewe':
          o.x += p.vx * s;
          o.y += Math.sin(p.t / 700 + p.phase) * 0.15;
          break;
        case 'wolke':
          o.x += p.vx * s;
          if (o.x - 30 > v.right) o.x = v.x - 30;
          break;
      }
    }
    // Hinausgeflogene Teilchen entfernen
    this.teile = this.teile.filter((p) => {
      const weg = p.obj.x > v.right + 24 || p.obj.y > v.bottom + 24 || p.obj.alpha === 0 || p.obj.x > this.weltBreite + 60 || p.obj.y > this.weltHoehe + 60;
      if (weg) p.obj.destroy();
      return !weg;
    });
  }

  /** Dauerhafte Teilchen am Rand des Bildausschnitts wieder hereinholen. */
  private umlaufen(o: Phaser.GameObjects.Image, v: Phaser.Geom.Rectangle) {
    if (o.x < v.x - 4) o.x = v.right + 2;
    else if (o.x > v.right + 4) o.x = v.x - 2;
    if (o.y < v.y - 4) o.y = v.bottom + 2;
    else if (o.y > v.bottom + 4) o.y = v.y - 2;
  }

  destroy() {
    for (const p of this.teile) p.obj.destroy();
    this.teile = [];
  }
}

import Phaser from 'phaser';
import { PAL, hexToInt } from '../engine/gfx/palette';
import { wrapText } from '../engine/gfx/fontGlyphs';
import type { Input } from '../engine/input/Input';
import { uiText } from '../engine/ui/widgets';
import { seedAus, shuffled } from '../engine/util/mischen';
import { MinigameModal, type Minigame } from './base';
import { QuizModal, type QuizFrage } from './quiz';
import {
  PASSWORT_ZIEL_SEKUNDEN,
  ZEICHENVORRAT,
  caesar,
  kombinationen,
  knackzeitSekunden,
  naechsterSchrittRichtig,
  zahlText,
  zeitText,
  type ReihenfolgeAufgabe,
} from './generischLogic';
import type { CaesarAufgabe, Kampf, KampfRunde } from './generischTypen';
import type { SpielDef } from './defs';

/** Ein Quiz als Minispiel. */
export const quiz =
  (titel: string, fragen: QuizFrage[], schluss: string, intro?: string): Minigame =>
  (ctx) =>
    new Promise((resolve) => ctx.push(new QuizModal(ctx.scene, titel, fragen, schluss, resolve, intro)));

// ---------- Reihenfolge ----------
/** Schritte in die richtige Reihenfolge bringen: immer den nächsten Schritt aus der Liste wählen. */
class ReihenfolgeModal extends MinigameModal {
  private offen: string[];
  private gelegt: string[] = [];
  private cursor = 0;
  private zeilen: Phaser.GameObjects.BitmapText[] = [];
  private ende = false;

  constructor(scene: Phaser.Scene, private a: ReihenfolgeAufgabe, resolve: () => void) {
    super(scene, a.titel, '↑↓ Schritt wählen · Leertaste: kommt als Nächstes', resolve);
    this.offen = shuffled(a.schritte, seedAus(a.titel));
    if (this.offen.every((s, i) => s === a.schritte[i])) this.offen.reverse();
    // Eine Liste in voller Breite: oben die gelegten Schritte (grün), darunter die übrigen zur Auswahl.
    for (let i = 0; i < a.schritte.length; i++) {
      const t = uiText(scene, 12, 0, '');
      t.setInteractive(new Phaser.Geom.Rectangle(-4, -2, 300, 12), Phaser.Geom.Rectangle.Contains);
      t.on('pointerdown', () => {
        const k = i - this.gelegt.length;
        if (k >= 0) {
          this.cursor = k;
          this.waehle();
        }
      });
      this.zeilen.push(t);
      this.root.add(t);
    }
    this.feedback(a.intro);
    this.render();
  }

  private render() {
    let y = 24;
    this.zeilen.forEach((t, i) => {
      const gelegt = i < this.gelegt.length;
      const k = i - this.gelegt.length;
      const text = gelegt ? `${i + 1}. ${this.gelegt[i]}` : `${k === this.cursor && !this.ende ? '▸' : '·'} ${this.offen[k]}`;
      const lines = wrapText(text, 290);
      t.setText(lines.join('\n   ')).setPosition(12, y);
      t.setTint(hexToInt(gelegt ? PAL.gruen4 : k === this.cursor ? PAL.gelb : PAL.weiss));
      y += lines.length * 10 + (i === this.gelegt.length - 1 ? 6 : 2);
    });
  }

  private waehle() {
    if (this.ende) return this.finish();
    const s = this.offen[this.cursor];
    if (!s) return;
    if (naechsterSchrittRichtig(this.a, this.gelegt.length, s)) {
      this.gelegt.push(s);
      this.offen.splice(this.cursor, 1);
      this.cursor = 0;
      if (!this.offen.length) {
        this.ende = true;
        this.feedback(this.a.schluss);
        this.setHelp('Leertaste: weiter');
      } else this.feedback(`Richtig! Schritt ${this.gelegt.length} liegt. Was kommt danach?`);
    } else {
      const h = this.a.hinweise?.[this.gelegt.length];
      this.feedback(h ? `Noch nicht. ${h}` : 'Das kommt später. Was muss davor passieren?', PAL.orange);
    }
    this.render();
  }

  solutionKeys(): string[] {
    if (this.ende) return ['Space'];
    const ziel = this.offen.indexOf(this.a.schritte[this.gelegt.length]);
    const keys: string[] = [];
    for (let k = 0; k < Math.abs(ziel - this.cursor); k++) keys.push(ziel > this.cursor ? 'ArrowDown' : 'ArrowUp');
    return [...keys, 'Space'];
  }

  update(input: Input) {
    const n = this.offen.length;
    if (n && !this.ende) {
      if (input.consume('up')) this.cursor = (this.cursor + n - 1) % n;
      if (input.consume('down')) this.cursor = (this.cursor + 1) % n;
    }
    if (input.consume('a')) this.waehle();
    this.render();
  }
}

export const reihenfolge =
  (a: ReihenfolgeAufgabe): Minigame =>
  (ctx) =>
    new Promise((resolve) => ctx.push(new ReihenfolgeModal(ctx.scene, a, resolve)));

// ---------- Debug-Kampf ----------
/**
 * Debug-Kampf: Der Gegner „greift" mit einem Problem an, Alex kontert mit der richtigen Maßnahme.
 * Jede richtige Antwort kostet den Gegner einen Lebensbalken. Verlieren kann man nicht – nur lernen.
 */
class KampfModal extends MinigameModal {
  private runde = 0;
  private cursor = 0;
  private getroffen = false;
  private ende = false;
  private angriffText: Phaser.GameObjects.BitmapText;
  private opts: Phaser.GameObjects.BitmapText[] = [];
  private draw: Phaser.GameObjects.Graphics;
  private bild?: Phaser.GameObjects.Image;
  private blitz = 0;
  private optionen: KampfRunde['optionen'][];

  constructor(scene: Phaser.Scene, private k: Kampf, resolve: () => void) {
    super(scene, `Debug-Kampf: ${k.gegner}`, '↑↓ Maßnahme wählen · Leertaste: kontern', resolve);
    this.optionen = k.runden.map((r, i) => shuffled(r.optionen, seedAus(k.gegner) + i));
    this.draw = scene.add.graphics().setScrollFactor(0);
    this.root.add(this.draw);
    if (k.bild) {
      this.bild = scene.add.image(270, 56, k.bild, 0).setScrollFactor(0);
      // Kleine Figuren (16×16) groß zeigen – pixelgenau mit ganzzahligem Faktor
      if (this.bild.width <= 16) this.bild.setScale(3);
      this.root.add(this.bild);
    }
    this.angriffText = uiText(scene, 10, 24, '', PAL.rot3);
    this.root.add(this.angriffText);
    for (let i = 0; i < 4; i++) {
      const t = uiText(scene, 18, 0, '');
      t.setInteractive(new Phaser.Geom.Rectangle(-8, -2, 200, 12), Phaser.Geom.Rectangle.Contains);
      t.on('pointerdown', () => {
        this.cursor = i;
        this.kontern();
      });
      this.opts.push(t);
      this.root.add(t);
    }
    this.feedback(k.intro);
    this.zeige();
  }

  private zeige() {
    this.cursor = 0;
    this.getroffen = false;
    const r = this.k.runden[this.runde];
    this.angriffText.setText(wrapText(`${this.k.gegner}: „${r.angriff}"`, 215).join('\n'));
    this.render();
  }

  private render() {
    const g = this.draw.clear();
    const hp = this.k.runden.length - this.runde - (this.getroffen ? 1 : 0);
    g.fillStyle(hexToInt(PAL.grau1), 1).fillRect(234, 88, 72, 6);
    g.fillStyle(hexToInt(PAL.rot3), 1).fillRect(234, 88, (72 * hp) / this.k.runden.length, 6);
    g.lineStyle(1, hexToInt(PAL.weiss), 1).strokeRect(233.5, 87.5, 73, 7);
    if (!this.k.bild) {
      // Glitchling aus Pixel-Rauschen
      for (let i = 0; i < 40; i++) {
        const x = 250 + ((i * 7) % 40);
        const y = 34 + ((i * 13) % 40);
        g.fillStyle(hexToInt(i % 3 ? PAL.netzFunk : PAL.netzDefekt), this.blitz > 0 ? 0.3 : 1).fillRect(x, y, 4, 4);
      }
    } else this.bild?.setAlpha(this.blitz > 0 ? 0.3 : 1);
    if (this.ende) return void this.opts.forEach((t) => t.setText(''));
    const r = this.optionen[this.runde];
    let y = 24 + this.angriffText.getTextBounds().local.height + 8;
    this.opts.forEach((t, i) => {
      const o = r[i];
      const lines = o ? wrapText(o.text, 200) : [];
      t.setText(o ? `${i === this.cursor ? '▸ ' : '  '}${lines.join('\n  ')}` : '').setPosition(18, y).setTint(hexToInt(i === this.cursor ? PAL.gelb : PAL.weiss));
      y += lines.length * 10 + 3;
    });
  }

  private kontern() {
    if (this.ende) return this.finish();
    if (this.getroffen) {
      this.runde++;
      if (this.runde >= this.k.runden.length) {
        this.ende = true;
        this.angriffText.setText(`${this.k.gegner} löst sich in Nullen und Einsen auf!`).setTint(hexToInt(PAL.gruen4));
        this.feedback(this.k.sieg);
        this.setHelp('Leertaste: weiter');
        this.render();
        return;
      }
      this.feedback('');
      return this.zeige();
    }
    const o = this.optionen[this.runde][this.cursor];
    if (!o) return;
    if (o.ok) {
      this.getroffen = true;
      this.blitz = 400;
      this.feedback(`Treffer! ${o.erklaerung} (Leertaste)`, PAL.gruen4);
    } else this.feedback(`Das hilft hier nicht. ${o.erklaerung}`, PAL.orange);
    this.render();
  }

  solutionKeys(): string[] {
    if (this.ende || this.getroffen) return ['Space'];
    const i = this.optionen[this.runde].findIndex((o) => o.ok);
    const keys: string[] = [];
    for (let k = 0; k < Math.abs(i - this.cursor); k++) keys.push(i > this.cursor ? 'ArrowDown' : 'ArrowUp');
    return [...keys, 'Space'];
  }

  update(input: Input, dt: number) {
    if (this.blitz > 0) this.blitz -= dt;
    if (!this.getroffen && !this.ende) {
      const n = this.optionen[this.runde].length;
      if (input.consume('up')) this.cursor = (this.cursor + n - 1) % n;
      if (input.consume('down')) this.cursor = (this.cursor + 1) % n;
    }
    if (input.consume('a')) this.kontern();
    this.render();
  }
}

export const kampf =
  (k: Kampf): Minigame =>
  (ctx) =>
    new Promise((resolve) => ctx.push(new KampfModal(ctx.scene, k, resolve)));

// ---------- Caesar-Scheibe ----------
class CaesarModal extends MinigameModal {
  private n = 0;
  private klar: Phaser.GameObjects.BitmapText;
  private scheibe: Phaser.GameObjects.BitmapText;
  private ende = false;

  constructor(scene: Phaser.Scene, private a: CaesarAufgabe, resolve: () => void) {
    super(scene, a.titel, '←→ Scheibe drehen · Leertaste: das ist lesbar!', resolve);
    this.root.add(uiText(scene, 10, 24, 'Geheimtext:', PAL.grau4));
    this.root.add(uiText(scene, 10, 36, wrapText(a.geheim, 300).join('\n'), PAL.orange));
    this.root.add(uiText(scene, 10, 64, 'Mit der Scheibe entschlüsselt:', PAL.grau4));
    this.klar = uiText(scene, 10, 76, '', PAL.gruen4);
    this.scheibe = uiText(scene, 10, 104, '', PAL.netzKabel);
    this.root.add([this.klar, this.scheibe]);
    this.feedback(a.intro);
    this.render();
  }

  private render() {
    this.klar.setText(wrapText(caesar(this.a.geheim, -this.n), 300).join('\n'));
    const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.scheibe.setText(`Verschiebung ${this.n}:  A→${abc[this.n]}  B→${abc[(this.n + 1) % 26]}  C→${abc[(this.n + 2) % 26]} …`);
  }

  private pruefen() {
    if (this.ende) return this.finish();
    if (this.n === this.a.schluessel) {
      this.ende = true;
      this.feedback(this.a.schluss);
      this.setHelp('Leertaste: weiter');
    } else this.feedback('Das ist noch Buchstabensalat. Dreh die Scheibe weiter!', PAL.orange);
  }

  solutionKeys(): string[] {
    if (this.ende) return ['Space'];
    const keys: string[] = [];
    for (let k = this.n; k !== this.a.schluessel; k = (k + 1) % 26) keys.push('ArrowRight');
    return [...keys, 'Space'];
  }

  update(input: Input) {
    if (!this.ende) {
      if (input.consume('left')) this.n = (this.n + 25) % 26;
      if (input.consume('right')) this.n = (this.n + 1) % 26;
    }
    if (input.consume('a')) this.pruefen();
    this.render();
  }
}

export const caesarSpiel =
  (a: CaesarAufgabe): Minigame =>
  (ctx) =>
    new Promise((resolve) => ctx.push(new CaesarModal(ctx.scene, a, resolve)));

// ---------- Passwort-Schmiede ----------
class PasswortModal extends MinigameModal {
  private laenge = 4;
  private vorrat = 0;
  private zeile = 0;
  private texte: Phaser.GameObjects.BitmapText[] = [];
  private ende = false;
  private balkenGfx: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, resolve: () => void) {
    super(scene, 'Passwort-Schmiede', '↑↓ Zeile · ←→ ändern · Leertaste: Passwort testen', resolve);
    this.balkenGfx = scene.add.graphics().setScrollFactor(0);
    this.root.add(this.balkenGfx);
    for (let i = 0; i < 6; i++) {
      const t = uiText(scene, 14, 26 + i * 16, '');
      this.texte.push(t);
      this.root.add(t);
    }
    this.feedback('FUNKSTILLEs Bot probiert 10 Milliarden Passwörter pro Sekunde. Schmiede ein Passwort, das mindestens 100 Jahre hält!');
    this.render();
  }

  private render() {
    const v = ZEICHENVORRAT[this.vorrat];
    const k = kombinationen(v.anzahl, this.laenge);
    const t = knackzeitSekunden(v.anzahl, this.laenge);
    const sel = (i: number) => (i === this.zeile && !this.ende ? '▸ ' : '  ');
    this.texte[0].setText(`${sel(0)}Länge: ${this.laenge} Zeichen`).setTint(hexToInt(this.zeile === 0 ? PAL.gelb : PAL.weiss));
    this.texte[1].setText(`${sel(1)}Zeichen: ${v.name} (${v.anzahl})`).setTint(hexToInt(this.zeile === 1 ? PAL.gelb : PAL.weiss));
    this.texte[2].setText(`Möglichkeiten: ${v.anzahl} hoch ${this.laenge} = ${zahlText(k)}`).setTint(hexToInt(PAL.grau4));
    this.texte[3].setText(`Knackzeit im Schnitt: ${zeitText(t)}`).setTint(hexToInt(t >= PASSWORT_ZIEL_SEKUNDEN ? PAL.gruen4 : PAL.orange));
    const balken = Math.min(1, Math.log10(Math.max(1, t)) / Math.log10(PASSWORT_ZIEL_SEKUNDEN));
    this.texte[4].setText('Sicherheit:').setTint(hexToInt(PAL.grau4));
    const g = this.balkenGfx.clear();
    g.fillStyle(hexToInt(PAL.grau1), 1).fillRect(84, 92, 200, 8);
    g.fillStyle(hexToInt(balken >= 1 ? PAL.gruen3 : balken > 0.5 ? PAL.gelb : PAL.rot3), 1).fillRect(84, 92, 200 * balken, 8);
    const beispiele = ['4719385026173948', 'kqzmwrtbxplfhsgn', 'KqZmWrTbXpLfHsGn', 'K7qZ2mW9rT4bX1pL', 'k7#Q2m!pX9zR4wT@'];
    this.texte[5].setText(`Beispiel: ${beispiele[this.vorrat].slice(0, this.laenge)}`).setTint(hexToInt(PAL.grau3));
  }

  private testen() {
    if (this.ende) return this.finish();
    const t = knackzeitSekunden(ZEICHENVORRAT[this.vorrat].anzahl, this.laenge);
    if (t >= PASSWORT_ZIEL_SEKUNDEN) {
      this.ende = true;
      this.feedback(`Der Bot gibt auf! ${zeitText(t)} – länger und vielfältiger heißt sicherer. (Leertaste)`, PAL.gruen4);
      this.setHelp('Leertaste: weiter');
    } else this.feedback(`Geknackt nach ${zeitText(t)}! Mach das Passwort länger oder nimm mehr verschiedene Zeichen.`, PAL.orange);
    this.render();
  }

  solutionKeys(): string[] {
    if (this.ende) return ['Space'];
    if (this.vorrat < 3) return this.zeile === 1 ? ['ArrowRight'] : ['ArrowDown'];
    if (this.laenge < 12) return this.zeile === 0 ? ['ArrowRight'] : ['ArrowUp'];
    return ['Space'];
  }

  update(input: Input) {
    if (!this.ende) {
      if (input.consume('up')) this.zeile = 0;
      if (input.consume('down')) this.zeile = 1;
      const d = (input.consume('right') ? 1 : 0) - (input.consume('left') ? 1 : 0);
      if (d && this.zeile === 0) this.laenge = Math.max(1, Math.min(16, this.laenge + d));
      if (d && this.zeile === 1) this.vorrat = Math.max(0, Math.min(ZEICHENVORRAT.length - 1, this.vorrat + d));
    }
    if (input.consume('a')) this.testen();
    if (!this.done) this.render();
  }
}

export const passwortSpiel: Minigame = (ctx) => new Promise((resolve) => ctx.push(new PasswortModal(ctx.scene, resolve)));

/** Macht aus einer Spieldefinition (Daten) ein spielbares Minispiel. */
export function ausDef(d: SpielDef): Minigame {
  switch (d.art) {
    case 'quiz':
      return quiz(d.titel, d.fragen, d.schluss, d.intro);
    case 'reihenfolge':
      return reihenfolge(d.aufgabe);
    case 'kampf':
      return kampf(d.kampf);
    case 'caesar':
      return caesarSpiel(d.aufgabe);
    case 'passwort':
      return passwortSpiel;
  }
}

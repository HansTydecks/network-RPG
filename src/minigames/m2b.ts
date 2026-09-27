import Phaser from 'phaser';
import { PAL, hexToInt } from '../engine/gfx/palette';
import { measureText } from '../engine/gfx/fontGlyphs';
import type { Input } from '../engine/input/Input';
import { uiText } from '../engine/ui/widgets';
import { MinigameModal, shuffled, type Minigame } from './base';
import { QuizModal, type QuizFrage } from './quiz';
import { binaerText } from './binaerLogic';
import {
  DATEI_FRAGEN,
  EINHEITEN_FRAGEN,
  KABELSALAT_ANSCHLUESSE,
  KUCHEN,
  SCHNELLER_FRAGEN,
  STICK_DATEIEN,
  STICK_KAPAZITAET_MB,
  TABELLE_FRAGEN_TEXT,
  kuchenSumme,
  stickPasst,
} from './m2bLogic';

const quiz = (title: string, fragen: QuizFrage[], schluss: string, intro?: string): Minigame => (ctx) =>
  new Promise((resolve) => ctx.push(new QuizModal(ctx.scene, title, fragen, schluss, resolve, intro)));

export const einheitenMinigame = quiz(
  'Händler Hubert handelt mit Bytes',
  EINHEITEN_FRAGEN,
  'Hubert: „Donnerwetter, dich kann man nicht übers Ohr hauen! Hier, ein kleiner Bonus." (Leertaste)',
  'Hubert versucht, dich mit Einheiten zu verwirren. Pass gut auf!',
);

export const schnellerMinigame = quiz(
  'Was ist schneller?',
  SCHNELLER_FRAGEN,
  'Übertragungsrate = Datenmenge ÷ Zeit. Mal gewinnt das Internet, mal die Taube! (Leertaste)',
  'Ping, das Internet oder ein Brief – wer bringt die Daten am schnellsten ans Ziel?',
);

// ---------- Datei-Chaos: erst Quiz, dann USB-Stick packen ----------
class StickModal extends MinigameModal {
  private auswahl = STICK_DATEIEN.map(() => false);
  private cursor = 0;
  private rows: Phaser.GameObjects.BitmapText[] = [];
  private bar: Phaser.GameObjects.Graphics;
  private sumText: Phaser.GameObjects.BitmapText;
  private ende = false;

  constructor(scene: Phaser.Scene, resolve: () => void) {
    super(scene, 'Der USB-Stick (4 GB)', '↑↓ wählen · Leertaste drauf/runter · „Fertig"', resolve);
    this.bar = scene.add.graphics().setScrollFactor(0);
    this.root.add(this.bar);
    [...STICK_DATEIEN.map((d) => d.name), 'Fertig'].forEach((_, i) => {
      const t = uiText(scene, 16, 24 + i * 12, '');
      t.setInteractive(new Phaser.Geom.Rectangle(-6, -2, 290, 12), Phaser.Geom.Rectangle.Contains);
      t.on('pointerdown', () => {
        this.cursor = i;
        this.toggle();
      });
      this.rows.push(t);
      this.root.add(t);
    });
    this.sumText = uiText(scene, 16, 112, '', PAL.netzKabel);
    this.root.add(this.sumText);
    this.feedback('Frau Lehmann: „Alles fürs Fest muss auf den Stick. Das Video oder die Fotos – eins davon soll mit!"');
    this.render();
  }

  private fmt(mb: number) {
    return mb >= 1 ? `${mb.toLocaleString('de-DE')} MB` : `${Math.round(mb * 1000)} KB`;
  }

  private render() {
    STICK_DATEIEN.forEach((d, i) => {
      this.rows[i]
        .setText(`${i === this.cursor ? '▸' : ' '} [${this.auswahl[i] ? 'X' : ' '}] ${d.name} – ${this.fmt(d.mb)}${d.pflicht ? ' (wichtig)' : ''}`)
        .setTint(hexToInt(i === this.cursor ? PAL.gelb : PAL.weiss));
    });
    const f = STICK_DATEIEN.length;
    this.rows[f].setText(`${this.cursor === f ? '▸' : ' '} Fertig`).setTint(hexToInt(this.cursor === f ? PAL.gelb : PAL.netzKabel));
    const mb = stickPasst(this.auswahl).mb;
    const g = this.bar.clear();
    g.fillStyle(hexToInt(PAL.grau1), 1).fillRect(16, 102, 288, 7);
    g.fillStyle(hexToInt(mb > STICK_KAPAZITAET_MB ? PAL.rot3 : PAL.gruen3), 1).fillRect(16, 102, Math.min(288, (288 * mb) / STICK_KAPAZITAET_MB), 7);
    this.sumText.setText(`Belegt: ${Math.round(mb).toLocaleString('de-DE')} MB von 4.000 MB`);
  }

  private toggle() {
    if (this.ende) return this.finish();
    if (this.cursor < STICK_DATEIEN.length) this.auswahl[this.cursor] = !this.auswahl[this.cursor];
    else {
      const r = stickPasst(this.auswahl);
      if (r.ok) {
        this.ende = true;
        this.feedback('Passt! 3.328 MB von 4.000 MB belegt. Frau Lehmann ist begeistert. (Leertaste)');
        this.setHelp('Leertaste: weiter');
      } else this.feedback(r.grund!, PAL.orange);
    }
    this.render();
  }

  solutionKeys(): string[] {
    if (this.ende) return ['Space'];
    const soll = STICK_DATEIEN.map((d, i) => d.pflicht || i === STICK_DATEIEN.findIndex((x) => x.gruppe === 'medien'));
    let i = soll.findIndex((v, j) => v !== this.auswahl[j]);
    if (i < 0) i = STICK_DATEIEN.length;
    const keys: string[] = [];
    for (let k = 0; k < Math.abs(i - this.cursor); k++) keys.push(i > this.cursor ? 'ArrowDown' : 'ArrowUp');
    return [...keys, 'Space'];
  }

  update(input: Input) {
    const n = STICK_DATEIEN.length + 1;
    if (input.consume('up')) this.cursor = (this.cursor + n - 1) % n;
    if (input.consume('down')) this.cursor = (this.cursor + 1) % n;
    if (input.consume('a')) this.toggle();
    this.render();
  }
}

export const dateienMinigame: Minigame = async (ctx) => {
  await quiz('Datei-Chaos', DATEI_FRAGEN, 'Alle Dateien sind sortiert! Jetzt muss alles auf den USB-Stick. (Leertaste)', 'Auf Frau Lehmanns Stick herrscht Chaos. Hilf ihr, Ordnung zu schaffen!')(ctx);
  await new Promise<void>((resolve) => ctx.push(new StickModal(ctx.scene, resolve)));
};

// ---------- Tabellen-Zauber ----------
function tabelleZeichnen(schritt: number) {
  return (scene: Phaser.Scene, g: Phaser.GameObjects.Graphics, fertig: boolean): Phaser.GameObjects.GameObject[] => {
    const zeigeD = schritt > 0 || fertig;
    const zeigeSumme = schritt > 1 || (schritt === 1 && fertig);
    const x0 = 10;
    const y0 = 64;
    const cols = [18, 84, 50, 50, 70];
    const kopf = ['', 'A: Kuchen', 'B: Preis', 'C: Anzahl', 'D: Einnahmen'];
    const objs: Phaser.GameObjects.GameObject[] = [];
    const rows = [kopf, ...KUCHEN.map((k, i) => [String(i + 2), k.name, `${k.preis.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`, String(k.anzahl), zeigeD ? `${(k.preis * k.anzahl).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €` : '']), ['6', '', '', 'Summe:', zeigeSumme ? `${kuchenSumme().toLocaleString('de-DE', { minimumFractionDigits: 2 })} €` : '']];
    rows.forEach((r, ri) => {
      let x = x0;
      r.forEach((c, ci) => {
        const ziel = (schritt === 0 && ri === 1 && ci === 4) || (schritt === 1 && ri === 5 && ci === 4);
        g.fillStyle(hexToInt(ri === 0 || ci === 0 ? PAL.grau2 : ziel && !fertig ? PAL.gelb : PAL.weiss), 1).fillRect(x, y0 + ri * 9, cols[ci] - 1, 8);
        const t = scene.add.bitmapText(x + 2, y0 + ri * 9 - 1, 'kabelitz', c).setTint(hexToInt(PAL.ink)).setScrollFactor(0);
        objs.push(t);
        x += cols[ci];
      });
    });
    return objs;
  };
}

export const tabelleMinigame = quiz(
  'Tabellen-Zauber',
  TABELLE_FRAGEN_TEXT.map((f, schritt) => ({
    frage: f.frage,
    optionen: f.optionen.map((o, i) => ({
      text: o,
      ok: i === f.richtig,
      erklaerung:
        i === f.richtig
          ? schritt === 0
            ? 'Preis mal Anzahl. Kopiert man die Formel nach unten, passt sie sich an: D3 = B3*C3 usw.'
            : 'SUMME addiert den ganzen Bereich D2 bis D5.'
          : schritt === 0
            ? 'Überleg: Einnahmen = Preis … Anzahl?'
            : 'Welche Spalte enthält die Einnahmen? Und sollen alle Zeilen addiert werden?',
    })),
    bild: tabelleZeichnen(schritt),
    nebeneinander: true,
  })),
  'Die Tabelle rechnet jetzt alles automatisch – ändert sich ein Preis, stimmt die Summe sofort wieder. (Leertaste)',
);

// ---------- Kabelsalat ----------
class KabelsalatModal extends MinigameModal {
  private kabel = shuffled(KABELSALAT_ANSCHLUESSE, 11);
  private verbunden: number[] = [];
  private cursor = 0;
  private draw: Phaser.GameObjects.Graphics;
  private kabelTexte: Phaser.GameObjects.BitmapText[] = [];
  private ende = false;

  constructor(scene: Phaser.Scene, resolve: () => void) {
    super(scene, 'Kabelsalat im grauen Kasten', '←→ Kabel wählen · Leertaste anschließen', resolve);
    this.draw = scene.add.graphics().setScrollFactor(0);
    this.root.add(this.draw);
    KABELSALAT_ANSCHLUESSE.forEach((n, i) => this.root.add(uiText(scene, 20, 28 + i * 18, `Anschluss ${binaerText(n)}`, PAL.netzKabel)));
    this.kabel.forEach((n, i) => {
      const t = uiText(scene, 210 + (i % 3) * 34, 40 + Math.floor(i / 3) * 30, String(n));
      t.setInteractive(new Phaser.Geom.Rectangle(-6, -4, 26, 16), Phaser.Geom.Rectangle.Contains);
      t.on('pointerdown', () => {
        this.cursor = i;
        this.anschliessen();
      });
      this.kabelTexte.push(t);
      this.root.add(t);
    });
    this.root.add(uiText(scene, 200, 24, 'Kabel (Nummern):', PAL.grau4));
    this.feedback('Herr Kowalski: „Die Kabel sind mit normalen Zahlen beschriftet, die Anschlüsse binär. Welches Kabel gehört an den gelb markierten Anschluss?"');
    this.render();
  }

  private render() {
    const g = this.draw.clear();
    KABELSALAT_ANSCHLUESSE.forEach((_, i) => {
      const aktiv = i === this.verbunden.length && !this.ende;
      g.fillStyle(hexToInt(aktiv ? PAL.gelb : i < this.verbunden.length ? PAL.gruen3 : PAL.grau2), 1).fillRect(10, 28 + i * 18, 6, 9);
      // Angeschlossene Kabel wandern direkt neben ihren Anschluss.
      if (i < this.verbunden.length) g.lineStyle(2, hexToInt(PAL.gruen3), 1).lineBetween(142, 33 + i * 18, 156, 33 + i * 18);
    });
    this.kabel.forEach((n, i) => {
      const platz = this.verbunden.indexOf(n);
      const benutzt = platz >= 0;
      if (benutzt) this.kabelTexte[i].setPosition(160, 28 + platz * 18);
      this.kabelTexte[i].setTint(hexToInt(benutzt ? PAL.gruen4 : i === this.cursor ? PAL.gelb : PAL.weiss));
      if (i === this.cursor && !benutzt && !this.ende) {
        const t = this.kabelTexte[i];
        g.lineStyle(1, hexToInt(PAL.gelb), 1).strokeRect(t.x - 4.5, t.y - 3.5, measureText(t.text) + 9, 16);
      }
    });
  }

  private anschliessen() {
    if (this.ende) return this.finish();
    const soll = KABELSALAT_ANSCHLUESSE[this.verbunden.length];
    const n = this.kabel[this.cursor];
    if (this.verbunden.includes(n)) return;
    if (n !== soll) {
      this.feedback(`Kabel ${n} passt nicht. Rechne ${binaerText(soll)} mit deiner Binär-Karte um!`, PAL.orange);
      return;
    }
    this.verbunden.push(n);
    this.feedback(`${binaerText(soll)} = ${soll}. Klick – Kabel ${n} sitzt!`);
    if (this.verbunden.length === KABELSALAT_ANSCHLUESSE.length) {
      this.ende = true;
      this.feedback('Alle Kabel sind wieder richtig angeschlossen! (Leertaste)');
      this.setHelp('Leertaste: weiter');
    }
    this.render();
  }

  solutionKeys(): string[] {
    if (this.ende) return ['Space'];
    const i = this.kabel.indexOf(KABELSALAT_ANSCHLUESSE[this.verbunden.length]);
    const keys: string[] = [];
    for (let k = 0; k < Math.abs(i - this.cursor); k++) keys.push(i > this.cursor ? 'ArrowRight' : 'ArrowLeft');
    return [...keys, 'Space'];
  }

  update(input: Input) {
    const n = this.kabel.length;
    if (input.consume('left')) this.cursor = (this.cursor + n - 1) % n;
    if (input.consume('right')) this.cursor = (this.cursor + 1) % n;
    if (input.consume('up')) this.cursor = Math.max(0, this.cursor - 3);
    if (input.consume('down')) this.cursor = Math.min(n - 1, this.cursor + 3);
    if (input.consume('a')) this.anschliessen();
    this.render();
  }
}

export const kabelsalatMinigame: Minigame = (ctx) => new Promise((resolve) => ctx.push(new KabelsalatModal(ctx.scene, resolve)));

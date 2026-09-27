import Phaser from 'phaser';
import { PAL, hexToInt } from '../engine/gfx/palette';
import { wrapText } from '../engine/gfx/fontGlyphs';
import type { Input } from '../engine/input/Input';
import { setWrapped, uiText } from '../engine/ui/widgets';
import { ABSENDER, ADRESSE, ADRESS_HINWEIS, BRIEF_SLOTS } from './briefLogic';
import { MinigameModal, shuffled, type Minigame } from './base';

type Phase = 'brief' | 'umschlag' | 'fertig';

const QUESTION_W = 136;

class BriefModal extends MinigameModal {
  private phase: Phase = 'brief';
  private slot = 0;
  private cursor = 0;
  private chosen: number[] = [];
  private adresse: string[] = [];
  private teile: string[];
  private paper: Phaser.GameObjects.BitmapText[] = [];
  private options: Phaser.GameObjects.BitmapText[] = [];
  private question: Phaser.GameObjects.BitmapText;
  private paperGfx: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, resolve: () => void) {
    super(scene, 'Ein Brief an Lina', '↑↓ wählen · Leertaste nehmen', resolve);
    this.teile = shuffled(ADRESSE, 7);
    this.paperGfx = scene.add.graphics().setScrollFactor(0);
    this.root.add(this.paperGfx);
    for (let i = 0; i < 9; i++) {
      const t = uiText(scene, 18, 30 + i * 11, '', PAL.ink);
      this.paper.push(t);
      this.root.add(t);
    }
    this.question = uiText(scene, 176, 28, '', PAL.gelb);
    this.root.add(this.question);
    for (let i = 0; i < 4; i++) {
      const t = uiText(scene, 184, 44 + i * 22, '');
      t.setInteractive(new Phaser.Geom.Rectangle(-8, -2, 136, 20), Phaser.Geom.Rectangle.Contains);
      t.on('pointerdown', () => {
        this.cursor = i;
        this.choose();
      });
      this.options.push(t);
      this.root.add(t);
    }
    this.feedback('Lina soll genau wissen, worum es geht. Wähle für jede Zeile den passenden Text.');
    this.render();
  }

  private currentOptions(): string[] {
    if (this.phase === 'brief') return BRIEF_SLOTS[this.slot].optionen.map((o) => o.text);
    if (this.phase === 'umschlag') return this.teile.filter((t) => !this.adresse.includes(t));
    return [];
  }

  private render() {
    const g = this.paperGfx.clear();
    this.paper.forEach((p) => p.setText(''));
    if (this.phase === 'brief') {
      g.fillStyle(hexToInt(PAL.creme), 1).fillRect(10, 22, 156, 102);
      g.lineStyle(1, hexToInt(PAL.braun4), 1);
      for (let y = 40; y < 122; y += 11) g.lineBetween(14, y + 0.5, 162, y + 0.5);
      const lines = this.chosen.flatMap((opt, s) => wrapText(BRIEF_SLOTS[s].optionen[opt].text, 140));
      lines.slice(0, 8).forEach((l, i) => this.paper[i].setText(l).setPosition(18, 30 + i * 11).setTint(hexToInt(PAL.ink)));
      setWrapped(this.question, BRIEF_SLOTS[this.slot].frage, QUESTION_W);
    } else {
      // Umschlag
      g.fillStyle(hexToInt(PAL.weiss), 1).fillRect(10, 26, 160, 96);
      g.lineStyle(1, hexToInt(PAL.grau3), 1).strokeRect(10.5, 26.5, 159, 95);
      g.lineStyle(1, hexToInt(PAL.grau2), 1).strokeRect(136.5, 32.5, 26, 30);
      ABSENDER.forEach((l, i) => this.paper[i].setText(l).setPosition(16, 32 + i * 10).setTint(hexToInt(PAL.grau2)));
      this.adresse.forEach((a, i) => this.paper[3 + i].setText(a).setPosition(60, 82 + i * 12).setTint(hexToInt(PAL.ink)));
      for (let i = this.adresse.length; i < 3; i++) this.paper[3 + i].setText('______________').setPosition(60, 82 + i * 12).setTint(hexToInt(PAL.grau3));
      setWrapped(this.question, this.phase === 'umschlag' ? `Zeile ${this.adresse.length + 1} der Adresse:` : 'Fertig!', QUESTION_W);
    }
    const opts = this.currentOptions();
    let y = 30 + this.question.getTextBounds().local.height + 6;
    this.options.forEach((o, i) => {
      const text = opts[i];
      const lines = text ? wrapText(text, 120) : [];
      o.setText(text ? `${i === this.cursor ? '▸ ' : '  '}${lines.join('\n  ')}` : '').setY(y);
      o.setTint(i === this.cursor ? hexToInt(PAL.gelb) : hexToInt(PAL.weiss));
      y += lines.length * 11 + 4;
    });
  }

  private choose() {
    const opts = this.currentOptions();
    if (this.cursor >= opts.length) return;
    if (this.phase === 'brief') {
      const opt = BRIEF_SLOTS[this.slot].optionen[this.cursor];
      if (!opt.ok) {
        this.feedback(`Ping: ${opt.kommentar}`, PAL.orange);
        return;
      }
      this.chosen.push(this.cursor);
      this.feedback(opt.kommentar ? `Ping: ${opt.kommentar}` : 'Gut so!');
      this.slot++;
      this.cursor = 0;
      if (this.slot >= BRIEF_SLOTS.length) {
        this.phase = 'umschlag';
        this.feedback('Der Brief ist fertig! Jetzt kommt Linas Adresse auf den Umschlag. Welche Zeile steht oben?');
      }
    } else if (this.phase === 'umschlag') {
      const pos = this.adresse.length;
      if (opts[this.cursor] !== ADRESSE[pos]) {
        this.feedback(`Ping: ${ADRESS_HINWEIS[pos]}`, PAL.orange);
        return;
      }
      this.adresse.push(opts[this.cursor]);
      this.cursor = 0;
      this.feedback('Richtig!');
      if (this.adresse.length === 3) {
        this.phase = 'fertig';
        this.feedback('Brief und Umschlag sind fertig. Fehlt nur noch die Briefmarke! (Leertaste)');
        this.setHelp('Leertaste: fertig');
      }
    }
    this.render();
  }

  solutionKeys(): string[] {
    if (this.phase === 'fertig') return ['Space'];
    let target: number;
    if (this.phase === 'brief') target = BRIEF_SLOTS[this.slot].optionen.findIndex((o) => o.ok);
    else target = this.currentOptions().indexOf(ADRESSE[this.adresse.length]);
    const keys: string[] = [];
    const n = this.currentOptions().length;
    let c = this.cursor;
    while (c !== target) {
      keys.push('ArrowDown');
      c = (c + 1) % n;
    }
    return [...keys, 'Space'];
  }

  update(input: Input) {
    if (this.phase === 'fertig') {
      if (input.consume('a')) this.finish();
      return;
    }
    const n = this.currentOptions().length;
    if (input.consume('up')) {
      this.cursor = (this.cursor - 1 + n) % n;
      this.render();
    }
    if (input.consume('down')) {
      this.cursor = (this.cursor + 1) % n;
      this.render();
    }
    if (input.consume('a')) this.choose();
  }
}

export const briefMinigame: Minigame = (ctx) =>
  new Promise((resolve) => ctx.push(new BriefModal(ctx.scene, resolve)));

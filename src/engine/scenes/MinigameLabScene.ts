import Phaser from 'phaser';
import { MINIGAMES } from '../../minigames';
import type { Input } from '../input/Input';
import { newGameState } from '../state/GameState';
import { UiStack } from '../ui/widgets';
import { PAL } from '../gfx/palette';

/**
 * Startet ein Minispiel direkt, ohne Geschichte: ?minispiel=brief (oder brief:parameter).
 * Zum Prüfen von Layouts und als Grundlage für den späteren Trainingsraum.
 */
export class MinigameLabScene extends Phaser.Scene {
  private inp!: Input;
  private ui = new UiStack();

  constructor() {
    super('MinigameLab');
  }

  create() {
    this.inp = this.registry.get('input');
    this.ui = new UiStack();
    this.cameras.main.setBackgroundColor(PAL.nacht);
    const id = new URLSearchParams(location.search).get('minispiel') ?? '';
    const [name, param] = id.split(':');
    const mg = MINIGAMES[name];
    if (!mg) {
      this.add.text(10, 10, `Unbekanntes Minispiel: ${id}`);
      return;
    }
    void mg({ scene: this, input: this.inp, state: newGameState(), push: (m) => this.ui.push(m), param }).then(() => this.scene.restart());
  }

  update(_t: number, dt: number) {
    this.ui.update(this.inp, dt);
  }
}

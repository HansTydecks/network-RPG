import Phaser from 'phaser';
import { buildAllTextures, buildAnimations } from '../gfx/textures';

/** Erzeugt beim Start alle Grafiken aus dem Code – es wird nichts geladen. */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    buildAllTextures(this);
    buildAnimations(this);
    const params = new URLSearchParams(location.search);
    if (params.has('kontaktbogen')) this.scene.start('ContactSheet');
    else if (params.has('minispiel')) this.scene.start('MinigameLab');
    else this.scene.start('Title');
  }
}

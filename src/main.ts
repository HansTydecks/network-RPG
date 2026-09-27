import Phaser from 'phaser';
import { Input } from './engine/input/Input';
import { BootScene } from './engine/scenes/BootScene';
import { TitleScene } from './engine/scenes/TitleScene';
import { WorldScene } from './engine/scenes/WorldScene';
import { ContactSheetScene } from './engine/scenes/ContactSheetScene';
import { PrologScene } from './engine/scenes/PrologScene';
import { PAL } from './engine/gfx/palette';

const W = 320;
const H = 180;

/** Ganzzahlige Vergrößerung, damit jeder Pixel gleich groß bleibt. */
function zoomFor(): number {
  return Math.max(1, Math.floor(Math.min(window.innerWidth / W, window.innerHeight / H)));
}

const input = new Input();

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'spiel',
  width: W,
  height: H,
  pixelArt: true,
  roundPixels: true,
  backgroundColor: PAL.nacht,
  scale: { mode: Phaser.Scale.NONE, zoom: zoomFor(), autoCenter: Phaser.Scale.CENTER_BOTH },
  input: { keyboard: false },
  scene: [BootScene, TitleScene, PrologScene, WorldScene, ContactSheetScene],
});

game.registry.set('input', input);
game.events.on(Phaser.Core.Events.PRE_STEP, () => input.update());
window.addEventListener('resize', () => game.scale.setZoom(zoomFor()));

(window as unknown as { __game: Phaser.Game }).__game = game;

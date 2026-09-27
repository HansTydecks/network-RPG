import Phaser from 'phaser';
import { PAL, hexToInt } from '../gfx/palette';
import type { Button, Input } from '../input/Input';
import { uiText } from './widgets';

/** Bildschirm-Knöpfe für Tablets: Steuerkreuz links, A/B rechts, Menü/Hilfe/Brille oben rechts. */
export function isTouchDevice(): boolean {
  return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}

export interface TouchControls {
  /** Steuerkreuz ausblenden, solange ein Dialog offen ist (sonst verdeckt es den Text). */
  setDpadVisible(v: boolean): void;
}

export function addTouchControls(scene: Phaser.Scene, input: Input): TouchControls {
  const depth = 1500;
  const make = (x: number, y: number, r: number, label: string, button: Button) => {
    const c = scene.add.circle(x, y, r, hexToInt(PAL.ink), 0.35).setStrokeStyle(1, hexToInt(PAL.weiss), 0.5);
    c.setScrollFactor(0).setDepth(depth).setInteractive();
    const t = uiText(scene, x - label.length * 3 + 1, y - 5, label).setDepth(depth + 1).setAlpha(0.8);
    c.on('pointerdown', () => input.press(button));
    c.on('pointerup', () => input.release(button));
    c.on('pointerout', () => input.release(button));
    return [c, t] as const;
  };
  const dpad = [
    make(28, 128, 10, '^', 'up'),
    make(28, 164, 10, 'v', 'down'),
    make(10, 146, 10, '<', 'left'),
    make(46, 146, 10, '>', 'right'),
  ].flat();
  make(300, 100, 13, 'A', 'a');
  make(274, 114, 11, 'B', 'b');
  make(304, 32, 8, 'M', 'menu');
  make(304, 52, 8, 'H', 'help');
  make(304, 72, 8, 'N', 'net');
  return {
    setDpadVisible(v: boolean) {
      for (const o of dpad) o.setVisible(v);
    },
  };
}

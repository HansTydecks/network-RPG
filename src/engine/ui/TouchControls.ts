import Phaser from 'phaser';
import { PAL, hexToInt } from '../gfx/palette';
import type { Button, Input } from '../input/Input';
import { uiText } from './widgets';

/**
 * Nur reine Touch-Geräte (Tablet ohne Maus/Touchpad) bekommen Bildschirm-Knöpfe.
 * Laptops und Smartboards mit Touchscreen werden per Tastatur gespielt.
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(any-pointer: fine)').matches;
}

export interface TouchControls {
  /** Steuerkreuz ausblenden, solange ein Dialog offen ist (sonst verdeckt es den Text). */
  setDpadVisible(v: boolean): void;
}

/** Kleines Steuerkreuz unten links, A/B unten rechts. Menü/Hilfe/Brille sitzen als Knöpfe im HUD. */
export function addTouchControls(scene: Phaser.Scene, input: Input): TouchControls {
  const depth = 1500;
  const make = (x: number, y: number, r: number, label: string, button: Button) => {
    const c = scene.add.circle(x, y, r, hexToInt(PAL.ink), 0.3).setStrokeStyle(1, hexToInt(PAL.weiss), 0.4);
    c.setScrollFactor(0).setDepth(depth).setInteractive();
    const t = uiText(scene, x - label.length * 3 + 1, y - 5, label).setDepth(depth + 1).setAlpha(0.7);
    c.on('pointerdown', () => input.press(button));
    c.on('pointerup', () => input.release(button));
    c.on('pointerout', () => input.release(button));
    return [c, t] as const;
  };
  const dpad = [
    make(20, 140, 7, '^', 'up'),
    make(20, 164, 7, 'v', 'down'),
    make(8, 152, 7, '<', 'left'),
    make(32, 152, 7, '>', 'right'),
  ].flat();
  make(306, 156, 9, 'A', 'a');
  make(287, 166, 7, 'B', 'b');
  return {
    setDpadVisible(v: boolean) {
      for (const o of dpad) o.setVisible(v);
    },
  };
}

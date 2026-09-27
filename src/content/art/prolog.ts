import { PAL } from '../../engine/gfx/palette';
import { PixBuf, rng } from '../../engine/gfx/pixbuf';

/**
 * Hintergrund für den Prolog: ein dunkler Keller. Alter Klappenschrank mit Steckern,
 * ein Röhrenmonitor, daneben ein Taubenkäfig im Schatten. Wer genau hinsieht, erkennt Hinweise.
 * Der Bildschirmbereich des Monitors (für den getippten Text) liegt bei x 118–206, y 52–106.
 */
export const PROLOG_SCREEN = { x: 118, y: 52, w: 88, h: 54 };

export function prologBackground(): PixBuf {
  const b = new PixBuf(320, 180, PAL.ink);
  const r = rng(77);
  // Ziegelwand
  for (let y = 0; y < 130; y += 8)
    for (let x = (y / 8) % 2 ? -8 : 0; x < 320; x += 16) {
      b.rect(x + 1, y + 1, 14, 6, PAL.grau1);
      if (r() < 0.3) b.set(x + 2 + Math.floor(r() * 12), y + 2 + Math.floor(r() * 4), PAL.blau1);
    }
  // Boden und Tisch
  b.rect(0, 130, 320, 50, PAL.nacht);
  b.rect(90, 118, 150, 6, PAL.braun1).rect(96, 124, 6, 40, PAL.braun1).rect(228, 124, 6, 40, PAL.braun1);
  // Klappenschrank (links)
  b.rect(12, 30, 64, 96, PAL.braun1).frame(12, 30, 64, 96, PAL.ink);
  for (let row = 0; row < 6; row++)
    for (let col = 0; col < 5; col++) {
      const x = 18 + col * 11;
      const y = 38 + row * 13;
      b.disc(x + 3, y + 3, 2, PAL.ink);
      if (r() < 0.4) b.vline(x + 3, y + 5, 10 + Math.floor(r() * 20), [PAL.rot2, PAL.gelb, PAL.blau2][Math.floor(r() * 3)]);
    }
  // Röhrenmonitor
  b.rect(108, 42, 108, 76, PAL.grau2).frame(108, 42, 108, 76, PAL.ink);
  b.rect(114, 48, 96, 62, PAL.ink);
  b.rect(PROLOG_SCREEN.x, PROLOG_SCREEN.y, PROLOG_SCREEN.w, PROLOG_SCREEN.h, '#06240f');
  b.rect(150, 118 - 4, 24, 4, PAL.grau1);
  b.set(200, 112, PAL.gruen3);
  // Tastatur
  b.rect(120, 121, 84, 8, PAL.grau1).frame(120, 121, 84, 8, PAL.ink);
  for (let x = 123; x < 200; x += 5) b.rect(x, 123, 3, 2, PAL.grau2).rect(x + 1, 126, 3, 1, PAL.grau2);
  // Taubenkäfig rechts im Schatten
  b.rect(250, 70, 50, 48, PAL.nacht).frame(250, 70, 50, 48, PAL.grau1);
  for (let x = 254; x < 300; x += 5) b.vline(x, 71, 46, PAL.grau1);
  b.disc(272, 104, 6, PAL.grau1).disc(278, 99, 3, PAL.grau1).set(280, 98, PAL.orange);
  // Tasse Muckefuck
  b.rect(222, 108, 8, 10, PAL.weiss).frame(222, 108, 8, 10, PAL.grau2).rect(223, 109, 6, 2, PAL.braun1);
  b.vline(231, 110, 4, PAL.grau2);
  // Lichtkegel des Monitors
  for (let y = 118; y < 180; y++) {
    const w = 60 + (y - 118) * 1.4;
    for (let x = Math.floor(162 - w / 2); x < 162 + w / 2; x++) if ((x + y) % 3 === 0 && b.get(x, y) === PAL.nacht) b.set(x, y, PAL.blau1);
  }
  return b;
}

/** Eine Hand im Strickjackenärmel, die tippt (zwei Frames). */
export function prologHand(frame: number): PixBuf {
  const b = new PixBuf(40, 24);
  b.rect(0, 8, 22, 14, PAL.braun2);
  for (let x = 1; x < 22; x += 3) b.vline(x, 9, 12, PAL.braun1);
  b.rect(22, 10, 12, 9, PAL.haut1).frame(22, 10, 12, 9, PAL.ink);
  const f = frame % 2 === 0 ? [0, 3, 0] : [3, 0, 3];
  for (let i = 0; i < 3; i++) b.rect(34, 11 + i * 3, 4, 2, PAL.haut1).set(37, 11 + i * 3 + f[i] / 3, PAL.haut2);
  return b;
}

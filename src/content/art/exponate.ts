import { PAL } from '../../engine/gfx/palette';
import { PixBuf } from '../../engine/gfx/pixbuf';

/**
 * Bilder zu den Exponaten im Dorfmuseum (64×64), selbst gezeichnet.
 * Sie erscheinen neben dem Dialog, während Frau Fröhlich ihre Frage stellt.
 */
const S = 64;

function rahmen(bg: string): PixBuf {
  return new PixBuf(S, S, bg);
}

/** Bilderrahmen zuletzt, damit nichts darüber hinausragt. */
function gerahmt(b: PixBuf): PixBuf {
  return b.frame(0, 0, S, S, PAL.braun1).frame(1, 1, S - 2, S - 2, PAL.braun4).frame(2, 2, S - 4, S - 4, PAL.braun2);
}

/** Brustbild: Gesicht, Augen, Mund, Oberkörper. Haare zeichnet der Aufrufer davor/danach. */
function gesicht(b: PixBuf, haut: string, kleidung: string) {
  b.disc(32, 62, 22, kleidung);
  b.rect(28, 36, 9, 8, haut);
  b.disc(32, 27, 11, haut);
  b.rect(27, 26, 3, 2, PAL.ink).rect(35, 26, 3, 2, PAL.ink);
  b.set(28, 26, PAL.weiss).set(36, 26, PAL.weiss);
  b.hline(30, 33, 5, PAL.rot2);
  b.set(32, 29, PAL.haut2).set(32, 30, PAL.haut2);
}

function zahnrad(b: PixBuf, cx: number, cy: number, r: number, c: string, loch: string) {
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    b.rect(Math.round(cx + Math.cos(a) * r - 1), Math.round(cy + Math.sin(a) * r - 1), 3, 3, c);
  }
  b.disc(cx, cy, r - 1, c).disc(cx, cy, 2, loch);
}

export function schickardBild(): PixBuf {
  const b = rahmen(PAL.creme);
  b.rect(10, 18, 44, 36, PAL.braun2).frame(10, 18, 44, 36, PAL.braun1);
  b.rect(12, 20, 40, 10, PAL.braun3);
  for (let i = 0; i < 6; i++) b.disc(16 + i * 6.4, 25, 2, PAL.weiss);
  zahnrad(b, 20, 42, 6, PAL.gelb, PAL.braun1);
  zahnrad(b, 33, 44, 5, PAL.braun4, PAL.braun1);
  zahnrad(b, 45, 41, 6, PAL.gelb, PAL.braun1);
  b.rect(10, 54, 4, 4, PAL.braun1).rect(50, 54, 4, 4, PAL.braun1);
  return b;
}

export function pascalBild(): PixBuf {
  const b = rahmen(PAL.blau1);
  b.rect(6, 26, 52, 22, PAL.braun4).frame(6, 26, 52, 22, PAL.braun2);
  b.rect(6, 22, 52, 4, PAL.braun3);
  for (let i = 0; i < 6; i++) {
    const x = 12 + i * 8;
    b.disc(x, 38, 3.5, PAL.gelb).disc(x, 38, 1.5, PAL.braun1);
    b.rect(x - 2, 29, 5, 4, PAL.weiss).set(x, 30, PAL.ink).set(x, 31, PAL.ink);
  }
  b.rect(10, 48, 44, 3, PAL.braun2);
  return b;
}

export function leibnizBild(): PixBuf {
  const b = rahmen(PAL.gruen1);
  // große Lockenperücke
  for (const [x, y] of [[20, 20], [44, 20], [18, 30], [46, 30], [18, 40], [46, 40], [21, 48], [43, 48], [32, 15], [25, 16], [39, 16]])
    b.disc(x, y, 7, PAL.braun3);
  for (const [x, y] of [[20, 24], [44, 24], [19, 36], [45, 36], [22, 46], [42, 46]]) b.disc(x, y, 2, PAL.braun2);
  gesicht(b, PAL.haut1, PAL.ink);
  b.rect(29, 42, 7, 7, PAL.weiss).set(32, 48, PAL.grau3);
  return b;
}

export function lovelaceBild(): PixBuf {
  const b = rahmen(PAL.lila1);
  b.disc(32, 22, 14, PAL.braun1);
  b.disc(20, 32, 6, PAL.braun1).disc(44, 32, 6, PAL.braun1);
  gesicht(b, PAL.haut1, PAL.blau2);
  // Scheitel und Haarband
  b.rect(22, 15, 21, 5, PAL.braun1).vline(32, 15, 5, PAL.braun2);
  b.hline(21, 19, 23, PAL.gelb);
  // Spitzenkragen
  for (let i = 0; i < 7; i++) b.disc(23 + i * 3, 44, 1.5, PAL.weiss);
  // Lochkarte als Hinweis auf ihr Programm
  b.rect(46, 44, 12, 14, PAL.creme).frame(46, 44, 12, 14, PAL.braun2);
  for (let i = 0; i < 4; i++) b.set(48 + (i % 2) * 5, 47 + i * 3, PAL.ink).set(50 + (i % 3) * 2, 48 + i * 3, PAL.ink);
  return b;
}

export function turingBild(): PixBuf {
  const b = rahmen(PAL.grau1);
  const band = '011010';
  for (let i = 0; i < band.length; i++) {
    const x = 8 + i * 8;
    b.rect(x, 34, 8, 12, PAL.creme).frame(x, 34, 8, 12, PAL.grau2);
    if (band[i] === '1') b.vline(x + 4, 37, 6, PAL.ink);
    else b.frame(x + 2, 37, 4, 6, PAL.ink);
  }
  // Lese-/Schreibkopf
  b.rect(26, 14, 12, 12, PAL.orange).frame(26, 14, 12, 12, PAL.rot1);
  b.rect(29, 18, 6, 3, PAL.gelb);
  b.rect(30, 26, 4, 4, PAL.rot1).set(31, 30, PAL.rot1).set(32, 31, PAL.rot1);
  b.hline(8, 50, 48, PAL.grau3);
  return b;
}

export function zuseBild(): PixBuf {
  const b = rahmen(PAL.grau2);
  for (const x0 of [8, 34]) {
    b.rect(x0, 10, 22, 46, PAL.grau4).frame(x0, 10, 22, 46, PAL.grau1);
    for (let r = 0; r < 6; r++)
      for (let c = 0; c < 4; c++) {
        const an = (r * 3 + c + x0) % 3 === 0;
        b.rect(x0 + 3 + c * 5, 13 + r * 7, 3, 4, an ? PAL.gelb : PAL.grau1);
      }
  }
  b.rect(8, 56, 48, 3, PAL.grau1);
  return b;
}

export function neumannBild(): PixBuf {
  const b = rahmen(PAL.creme);
  const box = (x: number, y: number, w: number, c: string) => b.rect(x, y, w, 12, c).frame(x, y, w, 12, PAL.ink);
  box(22, 8, 20, PAL.blau3); // Prozessor
  box(22, 44, 20, PAL.gelb); // Speicher
  box(4, 26, 14, PAL.gruen3); // Eingabe
  box(46, 26, 14, PAL.orange); // Ausgabe
  b.vline(32, 20, 24, PAL.ink).hline(18, 32, 4, PAL.ink).hline(42, 32, 4, PAL.ink);
  b.hline(22, 32, 20, PAL.ink);
  b.rect(27, 12, 10, 4, PAL.blau1);
  b.rect(26, 48, 12, 4, PAL.braun2);
  return b;
}

export const EXPONAT_BILDER: Record<string, () => PixBuf> = {
  bild_schickard: () => gerahmt(schickardBild()),
  bild_pascal: () => gerahmt(pascalBild()),
  bild_leibniz: () => gerahmt(leibnizBild()),
  bild_lovelace: () => gerahmt(lovelaceBild()),
  bild_turing: () => gerahmt(turingBild()),
  bild_zuse: () => gerahmt(zuseBild()),
  bild_neumann: () => gerahmt(neumannBild()),
};

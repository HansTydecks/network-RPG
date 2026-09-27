import { PAL } from './palette';
import { PixBuf } from './pixbuf';
import { dunkler, heller, istDeckend, mitAlpha } from './farbe';

/**
 * Automatischer Feinschliff für Objekte und Figuren: Licht kommt von oben links.
 * Obere Kanten werden etwas heller, untere und rechte etwas dunkler, dazu ein weicher
 * Schlagschatten nach rechts unten. Pixel außerhalb des Puffers zählen als „voll",
 * damit Kacheln, die zu größeren Flächen zusammengesetzt werden, keine Streifen bekommen.
 */
export function plastisch(src: PixBuf, licht = 0.2, schatten = 0.2): PixBuf {
  const out = new PixBuf(src.w, src.h);
  const offen = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= src.w || y >= src.h) return false;
    const c = src.get(x, y);
    return !c || c === PAL.ink || !istDeckend(c);
  };
  for (let y = 0; y < src.h; y++)
    for (let x = 0; x < src.w; x++) {
      const c = src.get(x, y);
      if (!istDeckend(c) || c === PAL.ink) {
        out.set(x, y, c);
        continue;
      }
      if (offen(x, y - 1)) out.set(x, y, heller(c, licht));
      else if (offen(x, y + 1)) out.set(x, y, dunkler(c, schatten));
      else if (offen(x + 1, y)) out.set(x, y, dunkler(c, schatten * 0.5));
      else out.set(x, y, c);
    }
  return out;
}

/** Weicher Schlagschatten nach rechts unten in transparente Pixel. */
export function schlagschatten(src: PixBuf): PixBuf {
  const out = new PixBuf(src.w, src.h);
  const voll = (x: number, y: number) => istDeckend(src.get(x, y));
  for (let y = 0; y < src.h; y++)
    for (let x = 0; x < src.w; x++) {
      const c = src.get(x, y);
      if (c) {
        out.set(x, y, c);
        continue;
      }
      if (voll(x - 1, y - 1) || voll(x, y - 1) && voll(x - 1, y)) out.set(x, y, mitAlpha(PAL.ink, 0.3));
      else if (voll(x - 2, y - 2)) out.set(x, y, mitAlpha(PAL.ink, 0.14));
    }
  return out;
}

/** Ovaler Bodenschatten für Figuren. */
export function bodenschatten(w = 12, h = 4): PixBuf {
  const b = new PixBuf(w, h);
  const cx = (w - 1) / 2;
  const cy = (h - 1) / 2;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const d = ((x - cx) / (w / 2)) ** 2 + ((y - cy) / (h / 2)) ** 2;
      if (d <= 1) b.set(x, y, mitAlpha(PAL.ink, d < 0.45 ? 0.34 : 0.2));
    }
  return b;
}

/** Fotolabor (SN Kl. 7 WB 2): Farbkanäle, Negativ, Graustufen. */
export interface FotoEinstellung {
  negativ: boolean;
  rot: boolean;
  gruen: boolean;
  blau: boolean;
  graustufen: boolean;
}

export const FOTO_START: FotoEinstellung = { negativ: true, rot: true, gruen: false, blau: false, graustufen: false };

/** Das Original ist ein Schwarz-Weiß-Foto von 1974. */
export function fotoRichtig(e: FotoEinstellung): boolean {
  return !e.negativ && e.rot && e.gruen && e.blau && e.graustufen;
}

export function wendeAn(rgb: [number, number, number], e: FotoEinstellung): [number, number, number] {
  let [r, g, b] = rgb;
  r = e.rot ? r : 0;
  g = e.gruen ? g : 0;
  b = e.blau ? b : 0;
  if (e.graustufen) {
    const y = Math.round(0.3 * r + 0.59 * g + 0.11 * b);
    r = g = b = y;
  }
  if (e.negativ) [r, g, b] = [255 - r, 255 - g, 255 - b];
  return [r, g, b];
}

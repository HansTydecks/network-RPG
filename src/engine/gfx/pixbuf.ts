/**
 * Pixelpuffer: Alle Grafiken des Spiels werden als Pixel-Raster im Code erzeugt
 * (hand-gezeichnete Text-Raster oder kleine Zeichenfunktionen). Kein externes Asset.
 */
export type Color = string | null; // null = transparent

export class PixBuf {
  readonly data: Color[];
  constructor(readonly w: number, readonly h: number, fill: Color = null) {
    this.data = new Array(w * h).fill(fill);
  }

  get(x: number, y: number): Color {
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return null;
    return this.data[y * this.w + x];
  }

  set(x: number, y: number, c: Color): this {
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return this;
    this.data[y * this.w + x] = c;
    return this;
  }

  rect(x: number, y: number, w: number, h: number, c: Color): this {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.set(i, j, c);
    return this;
  }

  hline(x: number, y: number, len: number, c: Color): this {
    return this.rect(x, y, len, 1, c);
  }

  vline(x: number, y: number, len: number, c: Color): this {
    return this.rect(x, y, 1, len, c);
  }

  /** Umrandung eines Rechtecks. */
  frame(x: number, y: number, w: number, h: number, c: Color): this {
    this.hline(x, y, w, c).hline(x, y + h - 1, w, c);
    return this.vline(x, y, h, c).vline(x + w - 1, y, h, c);
  }

  disc(cx: number, cy: number, r: number, c: Color): this {
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
      for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
        if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) this.set(x, y, c);
    return this;
  }

  /** Überträgt ein Text-Raster. Zeichen ohne Eintrag in der Legende sind transparent. */
  grid(rows: readonly string[], legend: Record<string, Color>, ox = 0, oy = 0): this {
    rows.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        const c = legend[ch];
        if (c !== undefined && c !== null) this.set(ox + x, oy + y, c);
      });
    });
    return this;
  }

  /** Setzt einen anderen Puffer darüber (transparente Pixel bleiben durchsichtig). */
  blit(src: PixBuf, ox = 0, oy = 0): this {
    for (let y = 0; y < src.h; y++)
      for (let x = 0; x < src.w; x++) {
        const c = src.get(x, y);
        if (c) this.set(ox + x, oy + y, c);
      }
    return this;
  }

  crop(x: number, y: number, w: number, h: number): PixBuf {
    const out = new PixBuf(w, h);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) out.set(i, j, this.get(x + i, y + j));
    return out;
  }

  flipX(): PixBuf {
    const out = new PixBuf(this.w, this.h);
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) out.set(this.w - 1 - x, y, this.get(x, y));
    return out;
  }

  /** Ersetzt Farben (für Figuren mit unterschiedlicher Kleidung aus einer Vorlage). */
  recolor(map: Record<string, Color>): PixBuf {
    const out = new PixBuf(this.w, this.h);
    this.data.forEach((c, i) => {
      out.data[i] = c && c in map ? map[c] : c;
    });
    return out;
  }

  /** Umrisslinie um alle nicht-transparenten Pixel (nur in transparente Nachbarn). */
  outline(c: Color): PixBuf {
    const out = new PixBuf(this.w, this.h);
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        const own = this.get(x, y);
        if (own) {
          out.set(x, y, own);
          continue;
        }
        if (this.get(x - 1, y) || this.get(x + 1, y) || this.get(x, y - 1) || this.get(x, y + 1)) out.set(x, y, c);
      }
    return out;
  }
}

/** Deterministischer Zufall (mulberry32), damit Texturen bei jedem Start gleich aussehen. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hilfsfunktion: mehrzeiliges Raster aus einem Template-String. */
export function rows(s: string): string[] {
  return s
    .split('\n')
    .map((r) => r.trim())
    .filter((r) => r.length > 0);
}

/** Farbhelfer für Schattierung: Mischen, Aufhellen, Abdunkeln, Transparenz. */

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1, 7), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function hex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
}

export function mix(a: string, b: string, t: number): string {
  const [r1, g1, b1] = rgb(a);
  const [r2, g2, b2] = rgb(b);
  return hex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

/** Aufhellen Richtung warmes Licht (Creme statt reinem Weiß). */
export function heller(c: string, t: number): string {
  return mix(c, '#fff4d6', t);
}

/** Abdunkeln Richtung Tinte (leicht bläulicher Schatten). */
export function dunkler(c: string, t: number): string {
  return mix(c, '#1a1c2c', t);
}

/** Farbe mit Deckkraft (0–1) als #rrggbbaa. */
export function mitAlpha(c: string, a: number): string {
  return c.slice(0, 7) + Math.round(a * 255).toString(16).padStart(2, '0');
}

export function istDeckend(c: string | null): c is string {
  return !!c && c.length === 7;
}

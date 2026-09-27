/** Mischt eine Liste reproduzierbar (gleicher Startwert → gleiche Reihenfolge). */
export function shuffled<T>(items: readonly T[], seed: number): T[] {
  const out = [...items];
  let a = seed >>> 0;
  const rnd = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Einfacher Startwert aus einem Text, z. B. einer ID. */
export function seedAus(text: string): number {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

/** Setzt die richtigen Einträge an Stelle `pos` (reihum), die übrigen behalten ihre Reihenfolge. */
export function richtigeAn<T>(items: readonly T[], istRichtig: (t: T) => boolean, pos: number): T[] {
  const falsch = items.filter((t) => !istRichtig(t));
  const richtig = items.filter(istRichtig);
  const p = ((pos % items.length) + items.length) % items.length;
  return [...falsch.slice(0, p), ...richtig, ...falsch.slice(p)];
}

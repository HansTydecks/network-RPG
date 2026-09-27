/**
 * Eigene Farbpalette von NETZBLICK. Alle Grafiken verwenden nur diese Farben.
 * Namen statt Hexwerte im Rest des Codes, damit die Palette zentral anpassbar bleibt.
 */
export const PAL = {
  ink: '#1a1c2c',
  nacht: '#0b1030',
  weiss: '#f4f4f4',
  creme: '#fff4d6',
  grau1: '#333c57',
  grau2: '#566c86',
  grau3: '#94b0c2',
  grau4: '#c2c3c7',
  gruen1: '#1e5c3a',
  gruen2: '#2f8f4e',
  gruen3: '#38b764',
  gruen4: '#a7f070',
  braun1: '#4a2c17',
  braun2: '#8f563b',
  braun3: '#c08552',
  braun4: '#e3b37a',
  rot1: '#6e2020',
  rot2: '#a53030',
  rot3: '#e05050',
  orange: '#ef7d57',
  gelb: '#ffcd75',
  blau1: '#29366f',
  blau2: '#3b5dc9',
  blau3: '#41a6f6',
  blau4: '#73eff7',
  haut1: '#f2c3a0',
  haut2: '#d99873',
  haut3: '#8d5a3b',
  lila1: '#4b2a5c',
  lila2: '#8a4fa8',
  // Netzblick-Farben (immer zusätzlich über Form unterscheidbar)
  netzKabel: '#5ff2ff',
  netzFunk: '#ff6bd6',
  netzPaket: '#ffe066',
  netzDefekt: '#ff4d4d',
} as const;

export type PalName = keyof typeof PAL;

export function hexToInt(hex: string): number {
  return parseInt(hex.slice(1), 16);
}

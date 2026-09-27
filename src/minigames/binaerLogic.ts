/** Binärzahlen (SN Kl. 7 LB 1): Stellenwerte, Bit-Schloss, Pixelwand, Geheimtext. */
export const STELLENWERTE = [128, 64, 32, 16, 8, 4, 2, 1];

export function bitsZuZahl(bits: boolean[]): number {
  return bits.reduce((sum, b, i) => sum + (b ? STELLENWERTE[i] : 0), 0);
}

export function zahlZuBits(n: number, stellen = 8): boolean[] {
  const w = STELLENWERTE.slice(8 - stellen);
  return w.map((v) => (n & v) !== 0);
}

export function binaerText(n: number, stellen = 8): string {
  return n.toString(2).padStart(stellen, '0');
}

/** Die drei Schlösser der Archivtür. Beim letzten wird die Summe nicht mehr angezeigt. */
export const BITSCHLOESSER = [
  { ziel: 5, summeZeigen: true, text: 'Schloss 1: Stell die Zahl 5 ein.' },
  { ziel: 42, summeZeigen: true, text: 'Schloss 2: Stell die Zahl 42 ein.' },
  { ziel: 200, summeZeigen: false, text: 'Schloss 3: Stell die Zahl 200 ein – diesmal ohne Anzeige der Summe!' },
  { ziel: 42, summeZeigen: false, text: 'Tastenfeld „Nur für Tauben": Pings Ringnummer endet auf 042. Binär eingeben!' },
];

/** Pixelwand: eine Taube, Zeile für Zeile als Binärzahl (1 = schwarz). */
export const PIXELWAND = ['00110000', '01111000', '11111000', '00111110', '01111111', '01111110', '00111100', '00100100'];

/** Geheimtext: Jede Zahl ist der Platz des Buchstabens im Alphabet (A = 1). 5 Bit reichen bis 31. */
export const GEHEIMWORT = 'KABELITZ';

export function buchstabeZuZahl(c: string): number {
  return c.charCodeAt(0) - 64;
}

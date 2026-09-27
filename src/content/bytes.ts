/** Die Währung in Kabelitz sind Bytes (Einheiten, SN Kl. 7 LB 1). Anzeige mit SI-Präfix: 1 KB = 1000 Byte. */
export function formatBytes(n: number): string {
  const tausender = n.toLocaleString('de-DE');
  if (n < 1000) return `${tausender} Byte`;
  const kb = (n / 1000).toLocaleString('de-DE', { maximumFractionDigits: 2 });
  return `${tausender} Byte (${kb} KB)`;
}

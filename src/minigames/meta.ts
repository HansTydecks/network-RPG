/** Beschreibung aller Minispiele ohne Phaser-Abhängigkeit (für Tests und den späteren Trainingsraum). */
export const MINIGAME_META: Record<string, { titel: string; stufe: number; lehrplan: string }> = {
  brief: { titel: 'Ein Brief an Lina', stufe: 7, lehrplan: 'SN Kl. 7 LB 1 – Informationen und Daten' },
  sortieren: { titel: 'Die Sortiermaschine', stufe: 7, lehrplan: 'SN Kl. 7 LB 1 – Daten strukturieren (Erfahrung Adressen)' },
  eva: { titel: 'Die Brille zusammenbauen', stufe: 7, lehrplan: 'SN Kl. 7 LB 2 – EVA-Modell, Speichern' },
  betriebssystem: { titel: 'NetzBlick OS', stufe: 7, lehrplan: 'SN Kl. 7 LB 2 – Aufgaben des Betriebssystems' },
  briefreise: { titel: 'Die Reise deines Briefs', stufe: 7, lehrplan: 'SN Kl. 7 LB 1 – Übertragung (Einstieg)' },
};

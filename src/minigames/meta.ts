/** Beschreibung aller Minispiele ohne Phaser-Abhängigkeit (für Tests und den späteren Trainingsraum). */
export const MINIGAME_META: Record<string, { titel: string; stufe: number; lehrplan: string }> = {
  brief: { titel: 'Ein Brief an Lina', stufe: 7, lehrplan: 'SN Kl. 7 LB 1 – Informationen und Daten' },
  sortieren: { titel: 'Die Sortiermaschine', stufe: 7, lehrplan: 'SN Kl. 7 LB 1 – Daten strukturieren (Erfahrung Adressen)' },
  eva: { titel: 'Die Brille zusammenbauen', stufe: 7, lehrplan: 'SN Kl. 7 LB 2 – EVA-Modell, Speichern' },
  briefreise: { titel: 'Die Reise deines Briefs', stufe: 7, lehrplan: 'SN Kl. 7 LB 1 – Übertragung (Einstieg)' },
  bitschloss: { titel: 'Bit-Schloss', stufe: 7, lehrplan: 'SN Kl. 7 LB 1 – Dezimalzahlen als Binärzahlen' },
  pixelwand: { titel: 'Die Pixelwand', stufe: 7, lehrplan: 'SN Kl. 7 LB 1 – Bilder als Binärzahlen' },
  geheimtext: { titel: 'Der Geheimtext', stufe: 7, lehrplan: 'SN Kl. 7 LB 1 – Text als Binärzahlen' },
  fotolabor: { titel: 'Das Fotolabor', stufe: 7, lehrplan: 'SN Kl. 7 WB 2 – Farbkanäle, Graustufen, Negativ' },
  bloecke: { titel: 'Krümel programmieren', stufe: 7, lehrplan: 'SN Kl. 7 LB 3 – Algorithmen in Blöcken (Sequenz)' },
  zustand: { titel: 'Zustandsdiagramm', stufe: 7, lehrplan: 'SN Kl. 7 LB 2 – Zustandsdiagramm, Übergangsgraph' },
  einheiten: { titel: 'Händler Hubert', stufe: 7, lehrplan: 'SN Kl. 7 LB 1 – Präfixe, SI- und Binärpräfixe' },
  dateien: { titel: 'Datei-Chaos', stufe: 7, lehrplan: 'SN Kl. 7 LB 2 – Dateityp und Applikation; LB 1 Speicherkapazität' },
  tabelle: { titel: 'Tabellen-Zauber', stufe: 7, lehrplan: 'SN Kl. 7 LB 1 – Tabellenkalkulation' },
  schneller: { titel: 'Was ist schneller?', stufe: 7, lehrplan: 'SN Kl. 7 LB 1 – Übertragungsrate' },
  kabelsalat: { titel: 'Kabelsalat', stufe: 7, lehrplan: 'SN Kl. 7 LB 1 – Binärzahlen' },
  plakat: { titel: 'Linas Plakat', stufe: 7, lehrplan: 'SN Kl. 7 LB 1 – Pixel/Vektor, Objekte, Inhalt und Design' },
};

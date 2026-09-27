/**
 * Sortiermaschine im Briefzentrum: Briefe nach Postleitzahl sortieren.
 * Runde für Runde wird genauer hingeschaut – erst die erste Ziffer, dann zwei, dann die ganze PLZ.
 * (Kl. 7: nur als Erfahrung. Dass Adressen hierarchisch aufgebaut sind, wird erst in Kl. 8 benannt.)
 */
export interface SortBrief {
  name: string;
  strasse: string;
  plz: string;
  ort: string;
  /** Richtiges Fach (Index in `faecher` der Runde). */
  fach: number;
  vonAlex?: boolean;
}

export interface SortRunde {
  ansage: string;
  faecher: string[];
  briefe: SortBrief[];
}

const b = (name: string, strasse: string, plz: string, ort: string, fach: number, vonAlex = false): SortBrief => ({ name, strasse, plz, ort, fach, vonAlex });

export const SORT_RUNDEN: SortRunde[] = [
  {
    ansage: 'Frau Krause: „Erst grob sortieren! Schau nur auf die ERSTE Ziffer der Postleitzahl."',
    faecher: ['0 …', '1 …', '8 …'],
    briefe: [
      b('Familie Schubert', 'Hauptstraße 4', '01067', 'Dresden', 0),
      b('Tom Richter', 'Seeweg 12', '10115', 'Berlin', 1),
      b('Anna Huber', 'Marienplatz 1', '80331', 'München', 2),
      b('Paul Neumann', 'Schillerstraße 8', '04109', 'Leipzig', 0),
      b('Mia Krüger', 'Am Hafen 3', '14467', 'Potsdam', 1),
      b('Lukas Bauer', 'Innstraße 5', '83022', 'Rosenheim', 2),
    ],
  },
  {
    ansage: 'Frau Krause: „Alle Briefe mit 0 bleiben in unserer Gegend. Jetzt zählen die ersten ZWEI Ziffern."',
    faecher: ['01 … Dresden', '04 … Leipzig', '09 … Chemnitz, Erzgebirge'],
    briefe: [
      b('Sophie Lange', 'Elbufer 2', '01069', 'Dresden', 0),
      b('Jonas Weber', 'Ringstraße 9', '04103', 'Leipzig', 1),
      b('Emma Schulz', 'Bergstraße 1', '09111', 'Chemnitz', 2),
      b('Ben Fischer', 'Markt 7', '09400', 'Knotenburg', 2),
      b('Lea Wolf', 'Parkweg 3', '04177', 'Leipzig', 1),
      b('Noah Klein', 'Schlossgasse 5', '01445', 'Radebeul', 0),
    ],
  },
  {
    ansage: 'Frau Krause: „Jetzt ganz genau: die GANZE Postleitzahl. Das hier fahren wir heute noch aus."',
    faecher: ['09400 Knotenburg', '09421 Kabelitz', 'anderer Ort'],
    briefe: [
      b('Bäckerei Lange', 'Dorfstraße 1', '09421', 'Kabelitz', 1),
      b('Stadtbibliothek', 'Markt 2', '09400', 'Knotenburg', 0),
      b('Karl Hoffmann', 'Talweg 4', '09456', 'Annaberg-Buchholz', 2),
      b('Werner Lösch', 'Dorfstraße 5', '09421', 'Kabelitz', 1),
      b('Emil Berger', 'Dorfstraße 7', '09421', 'Kabelitz', 1),
      b('Lina Wagner', 'Lindenweg 7', '09400', 'Knotenburg', 0, true),
    ],
  },
];

/** Tipp bei falschem Fach – verweist auf die Ziffern, die in dieser Runde zählen. */
export function sortHinweis(runde: number, brief: SortBrief): string {
  if (runde === 0) return `Schau auf die erste Ziffer: ${brief.plz[0]}.`;
  if (runde === 1) return `Die ersten zwei Ziffern sind ${brief.plz.slice(0, 2)}.`;
  return `Die ganze Postleitzahl lautet ${brief.plz}. Passt sie zu einem Fach?`;
}

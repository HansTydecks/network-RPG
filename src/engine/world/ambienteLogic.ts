/** Umgebungs-Effekte ohne Spielfunktion (ohne Phaser, damit testbar). */
export type AmbienteArt = 'blatt' | 'bluete' | 'falter' | 'gluehwurm' | 'staub' | 'tropfen' | 'schnee' | 'moewe' | 'wolke';

/** Welche Effekte auf welcher Karte laufen. */
export function ambienteFuer(karte: string, draussen: boolean, nacht: boolean): AmbienteArt[] {
  if (nacht && draussen) return ['gluehwurm'];
  switch (karte) {
    case 'kabelitz':
    case 'dorfplatz':
    case 'silberbach':
      return ['blatt', 'falter'];
    case 'knotenburg':
      return ['blatt'];
    case 'silberstollen':
      return ['staub', 'tropfen'];
    case 'museum':
    case 'bibliothek':
    case 'fernmeldeamt':
    case 'opas_keller':
      return ['staub'];
    case 'weltkarte':
      return ['moewe', 'wolke'];
    case 'landestation':
      return ['moewe', 'wolke'];
    default:
      return [];
  }
}

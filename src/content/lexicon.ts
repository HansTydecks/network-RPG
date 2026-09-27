import type { LexiconId } from './registry';

/**
 * Netzbuch-Einträge. Sie werden erst NACH einer Entdeckung freigeschaltet (induktiv).
 * `stufe` und `lehrplan` dienen der Spiralcurriculum-Prüfung.
 */
export interface LexiconEntry {
  titel: string;
  text: string;
  stufe: number;
  lehrplan: string;
}

export const LEXICON: Record<LexiconId, LexiconEntry> = {
  kabel: {
    titel: 'Kabel',
    text: 'Unter Straßen und in Wänden liegen Kabel. Über sie reisen Daten von Gerät zu Gerät – man sieht sie nur nicht.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 2 (Informatiksysteme) – Einblick',
  },
  kabelverzweiger: {
    titel: 'Der graue Kasten',
    text: 'Die grauen Kästen am Straßenrand heißen Kabelverzweiger. Hier laufen die Leitungen aus vielen Häusern zusammen und gehen gemeinsam weiter in die Stadt.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 2 (Informatiksysteme) – Einblick',
  },
};

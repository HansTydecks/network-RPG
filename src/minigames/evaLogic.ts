/**
 * EVA-Werkbank: Die Bauteile der Brille gehören zu Eingabe, Verarbeitung oder Ausgabe.
 * Der Speicherchip passt in keines der drei Fächer – so wird induktiv entdeckt,
 * dass das EVA-Modell um „Speichern" erweitert werden muss (SN Kl. 7 LB 2).
 */
export type Fach = 'E' | 'V' | 'A' | 'S';

export const FACH_NAMEN: Record<Fach, string> = { E: 'Eingabe', V: 'Verarbeitung', A: 'Ausgabe', S: 'Speichern' };

export interface Bauteil {
  name: string;
  fach: Fach;
  hinweis: string;
}

export const BAUTEILE: Bauteil[] = [
  { name: 'Mini-Kamera', fach: 'E', hinweis: 'Die Kamera nimmt Bilder von außen auf – sie bringt etwas IN die Brille hinein.' },
  { name: 'Mikrofon', fach: 'E', hinweis: 'Das Mikrofon hört zu. Es nimmt Töne von außen auf.' },
  { name: 'Taster', fach: 'E', hinweis: 'Mit dem Taster gibst du der Brille einen Befehl.' },
  { name: 'Prozessor', fach: 'V', hinweis: 'Der Prozessor ist das Gehirn: Er rechnet und verarbeitet alles, was hereinkommt.' },
  { name: 'Arbeitsspeicher', fach: 'V', hinweis: 'Der Arbeitsspeicher ist das Kurzzeitgedächtnis beim Rechnen. Er vergisst alles, wenn der Strom aus ist.' },
  { name: 'Brillen-Displays', fach: 'A', hinweis: 'Die Displays zeigen dir etwas an – sie geben etwas nach AUSSEN.' },
  { name: 'Lautsprecher', fach: 'A', hinweis: 'Der Lautsprecher gibt Töne aus.' },
  { name: 'Speicherchip', fach: 'S', hinweis: 'Der Speicherchip merkt sich Dinge dauerhaft – auch wenn die Brille aus ist.' },
];

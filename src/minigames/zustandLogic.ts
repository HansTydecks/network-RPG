/**
 * Zustandsdiagramm (SN Kl. 7 LB 2): Ein Übergang fehlt und muss ergänzt werden.
 */
export interface Zustand {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface Uebergang {
  von: string;
  nach: string;
  ereignis: string;
  /** Feste Position der Beschriftung, falls sie sonst mit anderem überlappt. */
  label?: [number, number];
}

export interface ZustandAufgabe {
  titel: string;
  einleitung: string;
  zustaende: Zustand[];
  uebergaenge: Uebergang[];
  fehlt: Uebergang;
  falsch: Uebergang[];
  erklaerung: string;
}

export const ZUSTAND_AUFGABEN: Record<string, ZustandAufgabe> = {
  kruemel: {
    titel: 'Krümels Zustandsdiagramm',
    einleitung: 'Krümel saugt, bis der Akku leer ist, und bleibt dann liegen. Welcher Übergang fehlt?',
    zustaende: [
      { id: 'laden', name: 'Laden', x: 60, y: 76 },
      { id: 'saugen', name: 'Saugen', x: 250, y: 76 },
      { id: 'zurueck', name: 'Zur Station', x: 155, y: 112 },
    ],
    uebergaenge: [
      { von: 'laden', nach: 'saugen', ereignis: 'Akku voll' },
      { von: 'zurueck', nach: 'laden', ereignis: 'Station erreicht' },
    ],
    fehlt: { von: 'saugen', nach: 'zurueck', ereignis: 'Akku niedrig' },
    falsch: [
      { von: 'saugen', nach: 'saugen', ereignis: 'Akku niedrig' },
      { von: 'laden', nach: 'zurueck', ereignis: 'Akku voll' },
    ],
    erklaerung: 'Genau! Wird der Akku beim Saugen knapp, fährt Krümel zur Station zurück und lädt.',
  },
  pfand: {
    titel: 'Das Zustandsdiagramm des Pfandautomaten',
    einleitung: 'Der Automat nimmt jede Flasche an – auch die ohne Pfand. Welcher Übergang fehlt?',
    zustaende: [
      { id: 'bereit', name: 'Bereit', x: 44, y: 98 },
      { id: 'pruefen', name: 'Flasche prüfen', x: 150, y: 72 },
      { id: 'angenommen', name: 'Angenommen', x: 266, y: 98 },
      { id: 'abgelehnt', name: 'Abgelehnt', x: 150, y: 116 },
    ],
    uebergaenge: [
      { von: 'bereit', nach: 'pruefen', ereignis: 'Flasche eingelegt', label: [14, 61] },
      { von: 'pruefen', nach: 'angenommen', ereignis: 'Pfandlogo erkannt', label: [204, 64] },
      { von: 'abgelehnt', nach: 'bereit', ereignis: 'Flasche zurück', label: [12, 114] },
    ],
    fehlt: { von: 'pruefen', nach: 'abgelehnt', ereignis: 'kein Pfandlogo', label: [156, 97] },
    falsch: [
      { von: 'pruefen', nach: 'angenommen', ereignis: 'kein Pfandlogo' },
      { von: 'bereit', nach: 'abgelehnt', ereignis: 'Flasche eingelegt' },
    ],
    erklaerung: 'Genau! Ohne Pfandlogo wird die Flasche abgelehnt und kommt zurück.',
  },
};

export function uebergangText(u: Uebergang, a: ZustandAufgabe): string {
  const n = (id: string) => a.zustaende.find((z) => z.id === id)?.name ?? id;
  return `${n(u.von)} → ${n(u.nach)}, wenn „${u.ereignis}"`;
}

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
};

export function uebergangText(u: Uebergang, a: ZustandAufgabe): string {
  const n = (id: string) => a.zustaende.find((z) => z.id === id)?.name ?? id;
  return `${n(u.von)} → ${n(u.nach)}, wenn „${u.ereignis}"`;
}

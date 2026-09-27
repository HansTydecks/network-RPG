import type { QuestId } from './registry';

/** Aufgaben mit dreistufigen Hinweisen für Ping (Richtung → Denkanstoß → Lösungsweg). */
export interface QuestDef {
  titel: string;
  hinweise: [string, string, string];
}

export const QUESTS: Record<QuestId, QuestDef> = {
  m0_zimmer: {
    titel: 'Schau dich in deinem Zimmer um.',
    hinweise: [
      'In deinem Zimmer liegt etwas, das gestern noch nicht da war. Gurr!',
      'Rechts im Zimmer steht ein Paket. Pakete kommen oft von Verwandten …',
      'Stell dich vor das Paket, schau es an und drück Leertaste oder Enter.',
    ],
  },
  m0_draussen: {
    titel: 'Geh nach draußen.',
    hinweise: ['Die Tür ist unten im Zimmer.', 'Die rote Fußmatte zeigt den Ausgang.', 'Lauf auf die Fußmatte unten im Zimmer.'],
  },
  m0_kabel: {
    titel: 'Setz die Brille auf (N) und folge den Kabeln.',
    hinweise: [
      'Geh nach draußen und drück N, um die Brille aufzusetzen.',
      'Die leuchtenden Linien sind Kabel. Aus jedem Haus kommt eins. Wohin laufen sie alle?',
      'Alle Kabel enden am grauen Kasten an der Straße, links neben der Mitte. Untersuche ihn!',
    ],
  },
  m0_fertig: {
    titel: 'Ende der Testversion – Kapitel 1 folgt!',
    hinweise: [
      'Du hast alles geschafft, was es in dieser Testversion gibt.',
      'Probier doch mal den Kalender in deinem Zimmer oder das Speichern am Computer aus.',
      'Mit M öffnest du das Menü. Dort findest du auch das Netzbuch.',
    ],
  },
};

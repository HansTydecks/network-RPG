import type { QuestId } from './registry';

/** Aufgaben mit dreistufigen Hinweisen für Ping (Richtung → Denkanstoß → Lösungsweg). */
export interface QuestDef {
  titel: string;
  hinweise: [string, string, string];
}

export const QUESTS: Record<QuestId, QuestDef> = {
  // --- Testversion M0 (nicht mehr im Spielablauf) ---
  m0_zimmer: { titel: 'Schau dich in deinem Zimmer um.', hinweise: ['Schau dich um.', 'Schau dich um.', 'Schau dich um.'] },
  m0_draussen: { titel: 'Geh nach draußen.', hinweise: ['Die Tür ist unten.', 'Die Tür ist unten.', 'Die Tür ist unten.'] },
  m0_kabel: { titel: 'Folge den Kabeln.', hinweise: ['Drück N.', 'Drück N.', 'Drück N.'] },
  m0_fertig: { titel: 'Ende der Testversion.', hinweise: ['Fertig!', 'Fertig!', 'Fertig!'] },

  // --- Kapitel 1 ---
  q1_mama: {
    titel: 'Geh runter zu Mama.',
    hinweise: [
      'Mama hat nach dir gerufen. Sie ist unten im Wohnzimmer. Gurr!',
      'Die Treppe nach unten ist die rote Matte unten in deinem Zimmer.',
      'Lauf auf die rote Matte, dann zu Mama an den Tisch und sprich sie mit Leertaste an.',
    ],
  },
  q1_lina: {
    titel: 'Finde einen Weg, Lina einzuladen.',
    hinweise: [
      'Kein Internet, kein Handynetz … Vielleicht hat jemand im Dorf eine Idee? Opa Werner weiß doch immer Rat.',
      'Opa Werner steht draußen vor seinem Haus, gleich rechts neben eurem.',
      'Geh durch die Haustür nach draußen, nach rechts zu Opa Werner, und sprich ihn an.',
    ],
  },
  q1_brief: {
    titel: 'Schreib Lina einen Brief (Schreibtisch in deinem Zimmer).',
    hinweise: [
      'Papier und Stift liegen an deinem Schreibtisch oben in deinem Zimmer.',
      'Stell dich vor den Schreibtisch neben dem Computer und drück Leertaste.',
      'Denk daran: Lina muss wissen, WAS, WANN und WO. Und auf den Umschlag kommt ihre Adresse in der richtigen Reihenfolge.',
    ],
  },
  q1_marke: {
    titel: 'Besorg eine Briefmarke.',
    hinweise: [
      'Ohne Briefmarke nimmt die Post den Brief nicht mit. Wer im Dorf sammelt Briefmarken?',
      'Mama hat keine. Aber Opa Werner sammelt sie seit Jahrzehnten!',
      'Geh raus und sprich Opa Werner vor seinem Haus an.',
    ],
  },
  q1_einwerfen: {
    titel: 'Wirf den Brief in den Briefkasten am Dorfplatz.',
    hinweise: [
      'Der gelbe Briefkasten steht unten am Weg, rechts vom Dorfplatz.',
      'Geh von eurem Haus den Weg nach unten und dann nach rechts, bis du den gelben Kasten siehst.',
      'Stell dich vor den gelben Briefkasten und drück Leertaste.',
    ],
  },
  q1_tuer: {
    titel: 'Jemand klingelt! Geh zur Haustür.',
    hinweise: [
      'Es hat geklingelt – vielleicht die Post?',
      'Die Haustür ist unten im Wohnzimmer.',
      'Geh runter ins Wohnzimmer und sprich die Person an der Haustür an.',
    ],
  },
  q1_sortieren: {
    titel: 'Hilf Frau Krause beim Sortieren.',
    hinweise: [
      'Frau Krause steht an der Sortiermaschine im Briefzentrum.',
      'Sprich Frau Krause an. Beim Sortieren helfen dir die Ziffern der Postleitzahl.',
      'Erste Runde: Schau nur auf die erste Ziffer. Dann auf die ersten zwei. Dann auf die ganze Postleitzahl.',
    ],
  },
  q1_paket: {
    titel: 'Öffne Tante Adas Paket in deinem Zimmer.',
    hinweise: [
      'Mama hat das Paket von Tante Ada in dein Zimmer gestellt.',
      'Geh durch die Haustür und die Treppe hoch in dein Zimmer.',
      'Das Paket steht rechts im Zimmer. Stell dich davor und drück Leertaste.',
    ],
  },
  q1_brille: {
    titel: 'Setz die Brille draußen auf (Taste N).',
    hinweise: [
      'Tante Ada schreibt: Draußen gibt es am meisten zu sehen.',
      'Geh aus dem Haus und drück N, um die Brille aufzusetzen.',
      'Mit aufgesetzter Brille kannst du Dinge anschauen (Leertaste): Dann zeigt die Brille ihre Objektkarte.',
    ],
  },
  q1_kasten: {
    titel: 'Untersuche den grauen Kasten an der Straße.',
    hinweise: [
      'Die Kabel aus allen Häusern laufen zu einem Punkt. Folge ihnen!',
      'Die Kabel enden an einem grauen Kasten unten am Weg.',
      'Der graue Kasten steht links neben der Mitte, direkt über dem Weg. Stell dich davor und drück Leertaste.',
    ],
  },
  q1_fortsetzung: {
    titel: 'Fortsetzung folgt …',
    hinweise: [
      'Hier endet die Testversion von Kapitel 1. Bald geht es weiter!',
      'Du kannst mit der Brille Dinge im Dorf scannen und Objektkarten sammeln.',
      'Probier auch das Netzbuch im Menü (M) aus.',
    ],
  },
};

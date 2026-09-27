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
    titel: 'Schreib Lina einen Brief.',
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
    titel: 'Wirf den Brief in den Briefkasten.',
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
    titel: 'Setz draußen die Brille auf (Taste N).',
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
  q1_kowalski: {
    titel: 'Sprich mit dem Techniker am grauen Kasten.',
    hinweise: [
      'Am grauen Kasten steht jetzt ein Mann in Arbeitsjacke.',
      'Der graue Kasten steht unten am Weg. Der Techniker steht links daneben.',
      'Stell dich neben den Techniker und drück Leertaste.',
    ],
  },
  q1_museum: {
    titel: 'Lerne im Dorfmuseum Binärzahlen lesen.',
    hinweise: [
      'Das Dorfmuseum steht am Dorfplatz, südlich von Kabelitz. Frau Fröhlich kennt sich mit alten Zahlen aus.',
      'Geh durch die Lücke in der Buschreihe ganz unten nach Süden. Das Museum ist das große Haus links.',
      'Sprich im Museum mit Frau Fröhlich und schau dir das Leibniz-Exponat an.',
    ],
  },
  q1_archiv: {
    titel: 'Öffne die Archivtür und löse die Rätsel im Archiv.',
    hinweise: [
      'Die Archivtür rechts im Museum hat drei Bit-Schlösser. Nimm deine Binär-Karte zu Hilfe!',
      'Jede Lampe hat einen Wert: 128, 64, 32, 16, 8, 4, 2, 1. Schalte die Lampen an, deren Werte zusammen die Zahl ergeben.',
      'Im Archiv: die Pixelwand (1 = schwarz ausmalen) und das Pult mit dem Geheimtext (Zahl = Platz im Alphabet).',
    ],
  },
  q1_zurueck_kowalski: {
    titel: 'Geh zurück zu Herrn Kowalski.',
    hinweise: [
      'Du kannst jetzt Binärzahlen lesen! Herr Kowalski wartet am grauen Kasten.',
      'Geh zurück nach Kabelitz, zum grauen Kasten unten am Weg.',
      'Sprich Herrn Kowalski an.',
    ],
  },
  q1_emil: {
    titel: 'Frag Emil, ob Krümel helfen kann.',
    hinweise: [
      'Emils Saugroboter Krümel passt durch jede Ritze. Emil wohnt im Haus rechts unten in Kabelitz.',
      'Emil spielt vor seinem Haus. Er sieht traurig aus.',
      'Sprich Emil vor seinem Haus an. Hör genau zu, wie Krümel fahren soll.',
    ],
  },
  q1_gully: {
    titel: 'Hol mit Krümel den Schlüssel aus dem Gully.',
    hinweise: [
      'Der Gully ist direkt neben dem grauen Kasten.',
      'Stell dich neben das Gitter im Weg, rechts vom grauen Kasten, und schau es an.',
      'Plane Krümels Weg im Gully Schritt für Schritt: vor, drehen, aufheben.',
    ],
  },
  q1_kabelbinder: {
    titel: 'Kauf Kabelbinder im Dorfladen.',
    hinweise: [
      'Der Dorfladen ist am Dorfplatz, rechts.',
      'Heute ist der Laden zu. Morgen ist er wieder offen.',
      'Geh nach Hause und leg dich schlafen. Morgen früh geht es weiter.',
    ],
  },
  q1_schlafen: {
    titel: 'Geh schlafen. Morgen hat der Laden wieder offen.',
    hinweise: [
      'Es war ein langer Tag! Dein Bett steht in deinem Zimmer.',
      'Geh nach Hause, die Treppe hoch in dein Zimmer.',
      'Stell dich vor dein Bett (links im Zimmer) und drück Leertaste.',
    ],
  },
  q1_bytes: {
    titel: 'Verdiene 2 KB für die Kabelbinder.',
    hinweise: [
      'Kabelbinder kosten 2 KB = 2.000 Byte. Im Dorf gibt es Leute, die Hilfe brauchen – und dafür zahlen.',
      'Herr Nguyen im Laden hat einen kaputten Pfandautomaten. Frau Lehmann auf dem Dorfplatz bereitet das Dorffest vor.',
      'Wie viele Bytes du hast, steht im Rucksack (Menü, M). Hilf Herrn Nguyen und Frau Lehmann bei beiden Aufgaben.',
    ],
  },
  q1_kaufen: {
    titel: 'Kauf die Kabelbinder im Dorfladen.',
    hinweise: [
      'Du hast genug Bytes! Ab in den Dorfladen.',
      'Der Dorfladen ist rechts am Dorfplatz.',
      'Sprich Herrn Nguyen an der Kasse an.',
    ],
  },
  q1_reparatur: {
    titel: 'Bring Herrn Kowalski die Kabelbinder.',
    hinweise: [
      'Herr Kowalski wartet am grauen Kasten in Kabelitz.',
      'Geh vom Dorfplatz nach Norden zurück nach Kabelitz.',
      'Sprich Herrn Kowalski an. Die Binär-Karte hilft dir beim Kabelsalat.',
    ],
  },
  q1_email: {
    titel: 'Schreib Tante Ada eine E-Mail.',
    hinweise: [
      'Das Internet ist wieder da! Tante Ada freut sich bestimmt über eine Nachricht.',
      'Dein Computer steht in deinem Zimmer.',
      'Stell dich vor den Computer (rechts neben dem Schreibtisch) und drück Leertaste.',
    ],
  },
  q1_samstag: {
    titel: 'Geh schlafen. Morgen ist dein Geburtstag!',
    hinweise: [
      'Morgen ist Samstag: dein Geburtstag und das Dorffest!',
      'Dein Bett steht in deinem Zimmer.',
      'Stell dich vor dein Bett und drück Leertaste.',
    ],
  },
  q1_fest: {
    titel: 'Feier mit Lina auf dem Dorffest.',
    hinweise: [
      'Lina ist mit dem Bus gekommen und wartet auf dem Dorfplatz.',
      'Geh nach Süden zum Dorfplatz. Lina steht vor der Bühne.',
      'Sprich Lina an – sie hat eine Idee für ein Plakat.',
    ],
  },
  q1_kapitel_ende: {
    titel: 'Kapitel 1 geschafft!',
    hinweise: [
      'Du hast Kapitel 1 geschafft! Wie es weitergeht, erfährst du im nächsten Schuljahr.',
      'Deine Lehrkraft kennt den Code für den Kalender in deinem Zimmer.',
      'Bis dahin kannst du im Dorf alles erkunden, was du noch nicht gesehen hast – zum Beispiel alle Museums-Exponate.',
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

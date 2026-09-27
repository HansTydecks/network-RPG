import type { ScanData } from '../../engine/world/MapDef';
import { lexicon, say, setFlag } from '../../engine/script/Script';

/** Ping selbst lässt sich auch scannen – die Ringnummer wird im Finale noch wichtig. */
export const PING_SCAN: ScanData = {
  name: 'ping',
  klasse: 'Brieftaube',
  attribute: [
    ['farbe', 'grau'],
    ['halsfarbe', 'lila-grün schillernd'],
    ['ringnummer', 'DV 07734-19-042'],
    ['lieblingsfutter', 'Erbsen'],
  ],
  methoden: ['gurren', 'fliegen', 'heimfinden'],
};

/** Beim ersten Scan erklärt Ping, was eine Objektkarte zeigt (induktiv: erst sehen, dann benennen). */
export const SCAN_ERKLAERUNG = [
  say('ping', 'Gurr! Die Brille zeigt eine Karte mit Eigenschaften!'),
  say('ping', 'Oben steht der Name des Dings und dahinter, zu welcher Art es gehört – das nennt man die Klasse.'),
  say('ping', 'Darunter stehen seine Attribute mit Werten, zum Beispiel farbe = grau. Und ganz unten, was es tun kann: seine Methoden.'),
  say('ping', 'Die Brille sieht alles als Objekte! Probier es an anderen Dingen aus.'),
  setFlag('scan_erklaert'),
  lexicon('objekt'),
];

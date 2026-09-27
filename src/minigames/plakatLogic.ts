/** Linas Plakat (LB 1): Pixel- und Vektorgrafik, Objekte mit Attributen, Inhalt und Design. */
import type Phaser from 'phaser';
import { PAL, hexToInt } from '../engine/gfx/palette';

import type { QuizFrage } from './quiz';

interface Plakat {
  sonne: string;
  titelGroesse: number;
  design: 'sommer' | 'nacht';
}

/** Zeichnet Linas Plakat. Inhalt (Sonne, Titel, Text) bleibt gleich, das Design wechselt nur Farben. */
function zeichnePlakat(scene: Phaser.Scene, g: Phaser.GameObjects.Graphics, x: number, y: number, p: Plakat): Phaser.GameObjects.GameObject[] {
  const w = 130;
  const h = 70;
  const bg = p.design === 'sommer' ? PAL.blau3 : PAL.nacht;
  const rahmen = p.design === 'sommer' ? PAL.blau1 : PAL.gelb;
  const text = p.design === 'sommer' ? PAL.weiss : PAL.netzKabel;
  g.fillStyle(hexToInt(bg), 1).fillRect(x, y, w, h);
  g.lineStyle(2, hexToInt(rahmen), 1).strokeRect(x + 1, y + 1, w - 2, h - 2);
  g.fillStyle(hexToInt(p.sonne), 1).fillCircle(x + w - 15, y + 20, 10);
  const titel = scene.add.bitmapText(x + 8, y + 8, 'kabelitz', 'DORFFEST').setScale(p.titelGroesse).setTint(hexToInt(text)).setScrollFactor(0);
  const zeile = scene.add.bitmapText(x + 8, y + 42, 'kabelitz', 'Samstag, 15 Uhr\nFestwiese Kabelitz').setTint(hexToInt(text)).setScrollFactor(0);
  return [titel, zeile];
}

function sonnenVergleich(scene: Phaser.Scene, g: Phaser.GameObjects.Graphics): Phaser.GameObjects.GameObject[] {
  // links: Pixelgrafik (8×8, stark vergrößert)
  const pixel = ['00111100', '01111110', '11111111', '11111111', '11111111', '11111111', '01111110', '00111100'];
  pixel.forEach((r, yy) => [...r].forEach((c, xx) => c === '1' && g.fillStyle(hexToInt(PAL.gelb), 1).fillRect(20 + xx * 6, 52 + yy * 6, 6, 6)));
  // rechts: Vektorgrafik (Kreis mit Mittelpunkt und Radius)
  g.fillStyle(hexToInt(PAL.gelb), 1).fillCircle(112, 76, 24);
  return [
    scene.add.bitmapText(33, 104, 'kabelitz', 'links').setTint(hexToInt(PAL.grau4)).setScrollFactor(0),
    scene.add.bitmapText(99, 104, 'kabelitz', 'rechts').setTint(hexToInt(PAL.grau4)).setScrollFactor(0),
  ];
}

export const PLAKAT_FRAGEN: QuizFrage[] = [
  {
    frage: 'Lina: „Unser Sonnen-Logo gibt es zweimal. Wir vergrößern beide stark. Welches bleibt scharf?"',
    optionen: [
      { text: 'links', ok: false, erklaerung: 'Links sieht man Treppchen: Das ist eine Pixelgrafik aus vielen einzelnen Punkten.' },
      { text: 'rechts', ok: true, erklaerung: 'Rechts ist eine Vektorgrafik: gespeichert als Kreis mit Mittelpunkt und Radius. Sie bleibt in jeder Größe scharf.' },
    ],
    bild: (scene, g) => sonnenVergleich(scene, g),
    antwortenX: 170,
  },
  {
    frage: 'Lina: „Die Sonne soll orange sein!" Was musst du ändern?',
    optionen: [
      { text: 'rahmen.farbe = orange', ok: false, erklaerung: 'Das ändert den Rahmen. Welches Objekt ist die Sonne?' },
      { text: 'sonne.farbe = orange', ok: true, erklaerung: 'Objekt sonne, Attribut farbe, neuer Wert orange.' },
      { text: 'sonne.groesse = orange', ok: false, erklaerung: 'Die Größe kann nicht orange sein. Welches Attribut bestimmt die Farbe?' },
    ],
    bild: (scene, g, fertig) => zeichnePlakat(scene, g, 12, 50, { sonne: fertig ? PAL.orange : PAL.gelb, titelGroesse: 1, design: 'sommer' }),
    antwortenX: 160,
  },
  {
    frage: 'Lina: „Und der Titel soll doppelt so groß sein."',
    optionen: [
      { text: 'titel.groesse = 2', ok: true, erklaerung: 'Das Objekt titel bekommt für das Attribut groesse den Wert 2.' },
      { text: 'titel.farbe = 2', ok: false, erklaerung: 'Eine Farbe kann nicht 2 sein. Welches Attribut ist die Größe?' },
      { text: 'sonne.groesse = 2', ok: false, erklaerung: 'Dann würde die Sonne größer, nicht der Titel.' },
    ],
    bild: (scene, g, fertig) => zeichnePlakat(scene, g, 12, 50, { sonne: PAL.orange, titelGroesse: fertig ? 2 : 1, design: 'sommer' }),
    antwortenX: 160,
  },
  {
    frage: 'Lina probiert das Design „Nacht" aus. Was hat sich geändert?',
    optionen: [
      { text: 'Nur das Design – der Inhalt ist gleich.', ok: true, erklaerung: 'Text, Sonne und Datum sind gleich geblieben. Inhalt und Design sind getrennt!' },
      { text: 'Der Text ist ein anderer.', ok: false, erklaerung: 'Lies genau: Steht wirklich etwas anderes da?' },
      { text: 'Alles ist neu.', ok: false, erklaerung: 'Vergleiche Text und Datum. Was ist gleich geblieben?' },
    ],
    bild: (scene, g) => zeichnePlakat(scene, g, 12, 50, { sonne: PAL.orange, titelGroesse: 2, design: 'nacht' }),
    antwortenX: 160,
  },
];

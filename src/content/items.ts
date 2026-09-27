import type { ItemId } from './registry';

export interface ItemDef {
  name: string;
  beschreibung: string;
  icon: string;
}

export const ITEMS: Record<ItemId, ItemDef> = {
  netzblick_v1: {
    name: 'NetzBlick-Brille',
    beschreibung: 'Ein Prototyp von Tante Ada. Macht Kabel, Geräte und Daten sichtbar. Taste N: aufsetzen/absetzen. Mit aufgesetzter Brille zeigt Leertaste die Objektkarte eines Dings.',
    icon: 'icon_netzblick_v1',
  },
  brief: {
    name: 'Brief an Lina',
    beschreibung: 'Deine Einladung zum Geburtstag am Samstag. Adressiert an Lina Wagner, Lindenweg 7, 09400 Knotenburg.',
    icon: 'icon_brief',
  },
  briefmarke: {
    name: 'Briefmarke',
    beschreibung: 'Eine Briefmarke mit einer Brieftaube darauf. Aus Opa Werners Sammlung.',
    icon: 'icon_briefmarke',
  },
  binaer_karte: {
    name: 'Binär-Karte',
    beschreibung: 'Von Frau Fröhlich aus dem Museum. Acht Felder mit den Stellenwerten 128, 64, 32, 16, 8, 4, 2, 1. Jede 1 zählt ihren Wert, jede 0 zählt nichts. Beispiel: 00000101 = 4 + 1 = 5.',
    icon: 'icon_binaerkarte',
  },
  block_fernbedienung: {
    name: 'Block-Fernbedienung',
    beschreibung: 'Emils Fernbedienung für den Saugroboter Krümel. Man steckt Befehlsblöcke hintereinander, Krümel führt sie der Reihe nach aus.',
    icon: 'icon_fernbedienung',
  },
  schluessel_kvz: {
    name: 'Kleiner Schlüssel',
    beschreibung: 'Herr Kowalskis Schlüssel für das Innenfach des grauen Kastens. Krümel hat ihn aus dem Gully geholt.',
    icon: 'icon_schluessel',
  },
  restauriertes_foto: {
    name: 'Altes Foto',
    beschreibung: '„Fernmeldeamt Knotenburg, 1974". Ein junger Mann mit Brieftauben vor einem Klappenschrank. Auf der Rückseite: „W. L."',
    icon: 'icon_foto',
  },
  kabelbinder: {
    name: 'Kabelbinder',
    beschreibung: 'Eine Packung Kabelbinder aus dem Dorfladen. Gekauft für 2 KB (2.000 Byte). Herr Kowalski braucht sie für die Reparatur.',
    icon: 'icon_kabelbinder',
  },
  usb_stick: {
    name: 'USB-Stick (4 GB)',
    beschreibung: 'Frau Lehmanns USB-Stick mit allem fürs Dorffest. Speicherkapazität: 4 GB, also 4.000 MB.',
    icon: 'icon_usb',
  },
  zettel_funkstille: {
    name: 'Seltsamer Zettel',
    beschreibung: 'Lag am grauen Kasten. Darauf eine durchgestrichene Antenne und: „WUHIISXQNW DOWHV IHUQPHOGHDPW". Unlesbar – noch.',
    icon: 'icon_zettel',
  },
};

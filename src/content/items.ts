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
  netzblick_v2: {
    name: 'NetzBlick v2',
    beschreibung: 'Tante Adas Update für die Brille: Jetzt siehst du auch Funkwellen (z. B. WLAN) und Datenpakete. Taste N.',
    icon: 'icon_netzblick_v2',
  },
  fremder_stick: {
    name: 'Fremder USB-Stick',
    beschreibung: 'Lag im Kabelkanal der Schule. Darauf klebt eine durchgestrichene Antenne. Niemals einfach in einen Computer stecken!',
    icon: 'icon_fremder_stick',
  },
  schluessel7: {
    name: 'Schlüssel 7',
    beschreibung: 'Ein alter Schlüssel mit Anhänger: „Fernmeldeamt Knotenburg – Schlüssel 7". Krümel hat ihn im Kabelschacht am Dorfplatz gefunden.',
    icon: 'icon_schluessel7',
  },
  echtheitslupe: {
    name: 'Echtheits-Lupe',
    beschreibung: 'Von Herrn Work. Zeigt bei E-Mails die echte Absenderadresse und wohin ein Link wirklich führt.',
    icon: 'icon_lupe',
  },
  caesar_scheibe: {
    name: 'Caesar-Scheibe',
    beschreibung: 'Zwei Buchstabenringe zum Drehen. Damit verschiebt man jeden Buchstaben um gleich viele Stellen – so hat schon Julius Caesar geheime Botschaften geschrieben.',
    icon: 'icon_caesar',
  },
  taubenfeder: {
    name: 'Taubenfeder mit Ring',
    beschreibung: 'Lag neben FUNKSTILLEs Laptop im Fernmeldeamt. Am Kiel steckt ein kleiner Ring: „DV 07734-74-…". Der Rest ist abgerieben.',
    icon: 'icon_feder',
  },
  netzblick_v3: {
    name: 'NetzBlick v3',
    beschreibung: 'Mit Paket-Lupe: Datenpakete anhalten und hineinschauen – Kopf mit Adressen und Protokoll, dazu der Inhalt. Verschlüsselte Pakete zeigen ein Schloss.',
    icon: 'icon_netzblick_v3',
  },
  schluesselpaar: {
    name: 'Schlüsselpaar',
    beschreibung: 'Ein goldener privater Schlüssel, den nur du hast, und viele offene Vorhängeschlösser (öffentliche Schlüssel), die du verteilen darfst.',
    icon: 'icon_schluesselpaar',
  },
  grubenlampe: {
    name: 'Grubenlampe',
    beschreibung: 'Von Kalle. Im Silberstollen ist es stockdunkel – ohne Lampe geht es nicht weiter.',
    icon: 'icon_grubenlampe',
  },
  postkarte: {
    name: 'Postkarte von Opa',
    beschreibung: '„Grüße aus Bad Elster! Die Kur tut gut. Euer Werner." Vorne ein Bild vom Kurpark. Der Poststempel ist verwischt.',
    icon: 'icon_postkarte',
  },
  quelltext_linse: {
    name: 'Quelltext-Linse',
    beschreibung: 'Von Kevin für die Brille. Zeigt hinter Bildschirmen und Plakaten den HTML-Quelltext.',
    icon: 'icon_quelltext',
  },
  reisepass: {
    name: 'Reisepass',
    beschreibung: 'Alex\' Reisepass. Tante Ada sagt: „Pack deinen Koffer."',
    icon: 'icon_reisepass',
  },
  netzblick_v4: {
    name: 'NetzBlick v4 „Weltsicht"',
    beschreibung: 'Zeigt die Wege der Pakete über den ganzen Globus, DNS-Anfragen, Zertifikate als Siegel und VPN-Tunnel.',
    icon: 'icon_netzblick_v4',
  },
  subnetzmaske: {
    name: 'Subnetzmaske',
    beschreibung: 'Eine echte Maske von Tante Ada. Aufgesetzt verdeckt sie den Geräte-Teil jeder IP-Adresse – übrig bleibt der Netz-Teil.',
    icon: 'icon_maske',
  },
  traceroute_kompass: {
    name: 'Traceroute-Kompass',
    beschreibung: 'Zeigt Hop für Hop, welchen Weg ein Paket genommen hat – und wie lange jeder Abschnitt dauerte.',
    icon: 'icon_kompass',
  },
};

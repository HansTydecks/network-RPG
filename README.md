# NETZBLICK – Alex und die Funkstille

Ein browserbasiertes, edukatives Netzwerk-RPG für den Informatikunterricht (Top-Down im Stil von Pokémon/Earthbound, Rätselstruktur à la Zelda).

Alex lebt im sächsischen Dorf Kabelitz und bekommt von Tante Ada eine Brille, die Netzwerke sichtbar macht: Kabel, Funkwellen, Datenpakete. Ein Unbekannter namens **FUNKSTILLE** will das Internet zum Schweigen bringen. Die Reise führt von zu Hause über die Stadt Knotenburg und ein Rechenzentrum im Erzgebirge einmal um die Welt.

- **Einsatz:** Ergänzung zum Unterricht, für Erstvermittlung (induktiv, explorativ) und Wiederholung
- **Inhalte:** Spiralcurricular nach dem Lehrplan Gymnasium Sachsen (Kl. 7, 8, 9, 10, Oberstufe), ergänzt um den Bildungsplan BW (Berufliches Gymnasium)
- **Technik:** TypeScript, Vite, Phaser 4; alle Grafiken und Sounds selbst erstellt; statisch auf GitHub Pages, offline-fähig, ohne Accounts und Tracking

## Status

**Das Spiel ist vom Prolog bis zum Abspann komplett spielbar** (5 Kapitel, 96 Minispiele, 89 Netzbuch-Einträge):

| Kapitel | Stufe | Inhalt |
|---|---|---|
| 1 Kabelitz | Kl. 7 | Brief an Lina, Briefzentrum, Netzblick-Brille, Binärzahlen im Museum, Krümel-Blöcke (Sequenz), Dorfladen mit Bytes, Dorffest, Reparatur des grauen Kastens |
| 2 Knotenburg | Kl. 8 | Gymnasium mit Herrn Work, Algorithmen, Schleifen und Verzweigungen, Client/Server, E-Mail (AN/CC/BCC), IP- und MAC-Adresse, Phishing-Welle, Passwörter, Datenschutz bei Pizza Pino, Suchmaschinen, Fake-Bilder, Metadaten, Caesar, Fernmeldeamt |
| 3 Unter Tage | Kl. 9 | Heimnetz, PAN/LAN/WAN, Pakete, Routing, DNS, HTTPS, Schlüsseltausch, Datenbanken (SQL-Denken), KI, Dungeon im Silberstollen mit Boss-Kampf |
| 4 Die Werkstatt | Kl. 10 | Textbasiertes Programmieren (Datentypen, Bedingungen, Funktionen), HTML und Barrierefreiheit, reguläre Ausdrücke, Chat-Server, Suchen und Sortieren, Maschinenentscheidungen |
| 5 Einmal um die Welt + Finale | Oberstufe | Topologien, IPv4/IPv6, Subnetze, DHCP, Routingtabellen, Seekabel, Backups und Hashes, DNS-Hierarchie, TLS und Zertifikate, Traceroute – und die Auflösung in Opas Keller |

Jedes Kapitel lässt sich über den Schulkalender in Alex' Zimmer mit dem Code der Lehrkraft direkt starten; Alex bekommt dann automatisch alles aus den früheren Kapiteln. Alte Speichercodes bleiben gültig.

Für Lehrkräfte: [`docs/MINISPIELE.md`](docs/MINISPIELE.md) listet alle Minispiele mit Klassenstufe und Lehrplanbezug, [`docs/NETZBUCH.md`](docs/NETZBUCH.md) alle Merksätze als Hefter-Vorlage. Beide Dateien werden aus den Spieldaten erzeugt.

## Spielen und entwickeln

```bash
npm install
npm run dev      # dann http://localhost:5173 öffnen
```

Steuerung: Pfeiltasten/WASD laufen · Leertaste/Enter sprechen/untersuchen · Esc/Shift zurück (halten = rennen) · H Ping nennt die aktuelle Aufgabe und gibt Tipps · N Netzblick-Brille · M Menü (dort auch Musik und Geräusche an/aus). M, H und N stehen immer oben rechts im Bild und lassen sich auch anklicken. Nur auf reinen Touch-Tablets erscheint zusätzlich ein kleines Steuerkreuz.

Mehr in [`docs/TECHNIK.md`](docs/TECHNIK.md#entwickeln).

## Dokumente

| Datei | Inhalt |
|---|---|
| [`docs/TECHNIK.md`](docs/TECHNIK.md) | Technischer Plan, Architektur, Meilensteine, Tests |
| [`docs/LEHRPLAN.md`](docs/LEHRPLAN.md) | Zuordnung Lehrplan ↔ Kapitel |
| [`docs/KALENDER-CODES.md`](docs/KALENDER-CODES.md) | Codes für den Schulkalender (Kapitel direkt starten) |
| [`docs/GEHEIMNISSE.md`](docs/GEHEIMNISSE.md) | Versteckte Extras ohne Lehrplanbezug (**Spoiler!**) |
| [`docs/MINISPIELE.md`](docs/MINISPIELE.md) | Alle Minispiele mit Klassenstufe und Lehrplanbezug |
| [`docs/NETZBUCH.md`](docs/NETZBUCH.md) | Alle Netzbuch-Einträge (Merksätze) |
| [`docs/PLOT.md`](docs/PLOT.md) | Figuren und vollständiger Plot mit allen Quests (**Spoiler!**) |
| [`docs/ITEMS_UND_HILFE.md`](docs/ITEMS_UND_HILFE.md) | Hilfesystem, Items, Backtracking-Rätsel, Minispiel-Katalog |

Die Codes für den Klassenstufen-Sprung (Schulkalender im Spiel) stehen in [`docs/KALENDER-CODES.md`](docs/KALENDER-CODES.md).

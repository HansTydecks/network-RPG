# NETZBLICK – Alex und die Funkstille

Ein browserbasiertes, edukatives Netzwerk-RPG für den Informatikunterricht (Top-Down im Stil von Pokémon/Earthbound, Rätselstruktur à la Zelda).

Alex lebt im sächsischen Dorf Kabelitz und bekommt von Tante Ada eine Brille, die Netzwerke sichtbar macht: Kabel, Funkwellen, Datenpakete. Ein Unbekannter namens **FUNKSTILLE** will das Internet zum Schweigen bringen. Die Reise führt von zu Hause über die Stadt Knotenburg und ein Rechenzentrum im Erzgebirge einmal um die Welt.

- **Einsatz:** Ergänzung zum Unterricht, für Erstvermittlung (induktiv, explorativ) und Wiederholung
- **Inhalte:** Spiralcurricular nach dem Lehrplan Gymnasium Sachsen (Kl. 7, 8, 9, 10, Oberstufe), ergänzt um den Bildungsplan BW (Berufliches Gymnasium)
- **Technik:** TypeScript, Vite, Phaser 4; alle Grafiken und Sounds selbst erstellt; statisch auf GitHub Pages, offline-fähig, ohne Accounts und Tracking

## Status

**Testversion M0:** Das technische Fundament steht und ist spielbar (Alex' Zimmer und ein Stück Kabelitz). Die echten Kapitel folgen ab M1.

## Spielen und entwickeln

```bash
npm install
npm run dev      # dann http://localhost:5173 öffnen
```

Steuerung: Pfeiltasten/WASD laufen · Leertaste/Enter sprechen/untersuchen · Esc/Shift zurück (halten = rennen) · H Hilfe von Ping · N Netzblick-Brille · M Menü. Auf Tablets erscheinen Bildschirm-Knöpfe.

Mehr in [`docs/TECHNIK.md`](docs/TECHNIK.md#entwickeln).

## Dokumente

| Datei | Inhalt |
|---|---|
| [`docs/TECHNIK.md`](docs/TECHNIK.md) | Technischer Plan, Architektur, Meilensteine, Tests |
| [`docs/LEHRPLAN.md`](docs/LEHRPLAN.md) | Zuordnung Lehrplan ↔ Kapitel |
| [`docs/PLOT.md`](docs/PLOT.md) | Figuren und vollständiger Plot mit allen Quests (**Spoiler!**) |
| [`docs/ITEMS_UND_HILFE.md`](docs/ITEMS_UND_HILFE.md) | Hilfesystem, Items, Backtracking-Rätsel, Minispiel-Katalog |

Die Codes für den Klassenstufen-Sprung (Schulkalender im Spiel) stehen bewusst **nicht** in diesem Repository. Sie gehen nur an Lehrkräfte.

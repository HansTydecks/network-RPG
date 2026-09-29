# Kalender-Codes (Klassenstufen-Sprung)

In Alex' Zimmer hängt ein Schulkalender. Mit diesen Codes blättert man ins nächste Schuljahr und startet direkt das passende Kapitel. Alex bekommt dabei automatisch alle Gegenstände und Netzbuch-Einträge der früheren Kapitel, ein alter Spielstand ist nicht nötig.

| Klassenstufe | Code | Startet |
|---|---|---|
| Klasse 8 | `3FP3-N2XZ` | Kapitel 2 – Knotenburg |
| Klasse 9 | `6QV8-DG4S` | Kapitel 3 – Unter Tage |
| Klasse 10 | `WB0Z-YYT3` | Kapitel 4 – Die Werkstatt |
| Oberstufe | `K0B7-SRBM` | Kapitel 5 – Einmal um die Welt |

## So geht's

1. Im Spiel in Alex' Zimmer den Kalender an der Wand ansprechen (Leertaste).
2. „Ins nächste Schuljahr blättern" wählen.
3. Code eintippen und mit Enter bestätigen.

Groß- und Kleinschreibung, Leerzeichen und Bindestriche sind egal. `O` und `0` sowie `I`, `L` und `1` gelten als gleich.

## Codes ändern

`node tools/kalender-code.mjs` schlägt einen neuen Code vor und gibt seinen Hashwert aus. Den Hash in `src/content/calendarCodes.ts` bei der richtigen Stufe eintragen und den Code hier in der Tabelle ändern. Ein Test (`tests/unit/kalendercodes.test.ts`) prüft, dass Tabelle und Spiel zusammenpassen.

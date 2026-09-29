# Kalender-Codes (Klassenstufen-Sprung)

In Alex' Zimmer hängt ein Schulkalender. Mit diesen Codes blättert man ins nächste Schuljahr und startet direkt das passende Kapitel. Alex bekommt dabei automatisch alle Gegenstände und Netzbuch-Einträge der früheren Kapitel, ein alter Spielstand ist nicht nötig.

| Klassenstufe | Code | Startet | Warum dieses Wort? |
|---|---|---|---|
| Klasse 8 | `PHISHING` | Kapitel 2 – Knotenburg | FUNKSTILLEs Phishing-Welle legt die Stadt lahm |
| Klasse 9 | `ROUTER` | Kapitel 3 – Unter Tage | Heimnetz, Router und das Rechenzentrum im Silberstollen |
| Klasse 10 | `QUELLTEXT` | Kapitel 4 – Die Werkstatt | Die Quelltext-Linse zeigt das HTML hinter den Bildschirmen |
| Oberstufe | `TRACEROUTE` | Kapitel 5 – Einmal um die Welt | Der Weg der Pakete führt am Ende zurück nach Kabelitz |

## So geht's

1. Im Spiel in Alex' Zimmer den Kalender an der Wand ansprechen (Leertaste).
2. „Ins nächste Schuljahr blättern" wählen.
3. Code eintippen und mit Enter bestätigen.

Groß- und Kleinschreibung ist egal. Man kann tippen oder die Buchstaben auf dem Bildschirm-Tastenfeld auswählen.

## Codes ändern

`node tools/kalender-code.mjs NEUESWORT` gibt den Hashwert eines Codes aus (bis 12 Zeichen, A–Z und 0–9). Den Hash in `src/content/calendarCodes.ts` bei der richtigen Stufe eintragen und den Code hier in der Tabelle ändern. Ein Test (`tests/unit/kalendercodes.test.ts`) prüft, dass Tabelle und Spiel zusammenpassen.

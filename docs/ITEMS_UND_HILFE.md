# NETZBLICK – Alex und die Funkstille
## Hilfesystem, Items, Backtracking, Minispiele

## 6. Hilfesystem – „Wie komme ich weiter?"
Kinder müssen immer wissen, wo sie Hilfe bekommen. Das ist ab dem Prolog klar kommuniziert und über einen immer sichtbaren Tauben-Knopf (Touch) bzw. die Taste `H` erreichbar.
1. **Ping (Taste H)** – dreistufige Hinweise zur aktuellen Aufgabe:
   - Stufe 1 *Richtung*: „Vielleicht weiß Frau Fröhlich im Museum mehr?"
   - Stufe 2 *Denkanstoß* + Link zum passenden Netzbuch-Eintrag
   - Stufe 3 *Lösungsweg* Schritt für Schritt
   Keine Strafe fürs Nachfragen.
2. **Aufgabenzeile** – das aktuelle Hauptziel steht immer oben links (eine Zeile); volles Aufgabenbuch im Menü.
3. **Netzbuch (Lexikon)** – Einträge werden erst **nach** der Entdeckung freigeschaltet (induktiv: „Du hast gerade erlebt, dass …"), mit Pixel-Illustration, Merksatz, Lehrplanbegriffen und „Wo im Spiel gesehen". Druckbar als Hefter-Material.
4. **Hinweis-Orte**: Bibliothek (Frau Weber), Dorfmuseum (Frau Fröhlich), Werkstatt (Kevin); **Videoanruf bei Tante Ada** an jedem Laptop/jeder Telefonzelle = „Was bisher geschah" + nächstes Ziel.
5. **Karte** mit Markierung des nächsten Ziels (von der Lehrkraft abschaltbar).
6. **Minispiele**: „Beispiel ansehen"-Knopf; nach zwei Fehlversuchen wird eine leichtere Variante angeboten.
7. **Außerhalb des Spiels**: Lehrerhandbuch mit Lösungen, Lehrplanbezug und Vorschlägen für Hefter-Einträge.

---

## 7. Items – jedes mit Sinn
| Item | Kapitel | Zweck / Lerninhalt | Später wieder genutzt |
|---|---|---|---|
| NetzBlick-Brille v1–v4 | 1–5 | Netzwerk-Röntgenblick (siehe `PLOT.md`, 4.2) | durchgehend |
| Schulkalender (in Alex' Zimmer, kein Inventar-Item) | Prolog | Klassenstufen-Sprung per Lehrkraft-Code (siehe `TECHNIK.md`, 2.6) | an jedem Kapitelende |
| Briefmarke (Taubenmotiv) | 1 | Brief-Quest | Finale (Opa erkennt sie wieder) |
| Binär-Karte | 1 | Binär↔Dezimal, Bit-Schlösser | Kap. 5 IP-Adressen, Finale |
| Block-Fernbedienung → KrümelScript | 1/2/4 | Algorithmen: Sequenz → Schleifen/Verzweigung → Text | Werkzeug in allen Kapiteln |
| Krümel (Saugroboter) | 1 | Zelda-artiges Werkzeug (Schächte, Schalter) | Finale |
| Bytes (Währung) | 1 | Einheiten Byte/KB/MB | durchgehend |
| USB-Stick (4 GB) | 1 | Speicherkapazität, Dateitypen | Kap. 2 (FUNKSTILLEs Stick) |
| Echtheits-Lupe | 2 | Phishing, Adressen prüfen | Kap. 3/5 Zertifikate |
| Caesar-Scheibe | 2 | Verschlüsselung (WB1) | Kap. 3 symmetrisch, Kap. 5 Kryptoanalyse |
| Schlüssel 7 (Fernmeldeamt) | 2 | Zugang Fernmeldeamt | – |
| Taubenfeder mit Ring | 2 | Beweisstück | Kap. 3 Datenbank, Finale |
| Schlüsselpaar (Schlüssel + Vorhängeschlösser) | 3 | Asymmetrische Verschlüsselung | Kap. 5 TLS/Signaturen |
| Admin-Tablet | 3 | Router/Heimnetz konfigurieren | Kap. 5 Routingtabellen |
| Quelltext-Linse | 4 | HTML sehen/bearbeiten | Finale (Raum der Wahrheit) |
| Regex-Kescher | 4 | Reguläre Ausdrücke | Kap. 5 Eingabevalidierung |
| Reisepass (mit Stempeln) | 5 | Fortschritt Weltreise | – |
| Subnetzmaske (echte Maske) | 5 | Netz-/Host-Anteil sichtbar | Backtracking Silberstollen |
| Traceroute-Kompass | 5 | Weg der Pakete verfolgen | Finale |
| Postkarten „aus Bad Elster" | 4/5 | Beweisstück (Poststempel!) | Finale |

---

## 8. Backtracking-Übersicht (Zelda-Prinzip)
| Rätsel entdeckt | Ort | Lösbar ab | Benötigt | Belohnung |
|---|---|---|---|---|
| Caesar-Zettel | Kap. 1 grauer Kasten | Kap. 2 | Caesar-Scheibe | Hinweis Fernmeldeamt |
| Blinkende Kiste im Flur | Kap. 1 Zuhause | Kap. 3 | Wissen über Router + 2FA | Fremdes Gerät „TAUBENSCHLAG-CAM" |
| Museumstunnel | Kap. 1 Museum | Kap. 2 | Schleifen | Schlüssel 7 |
| Emils Spielzeugroboter | Kap. 1 | Kap. 4 | Verknüpfte Bedingungen | Bytes + Netzbuch-Seite |
| Fernschreiber im Museum | Kap. 1 | Kap. 5/Finale | Kodierung/Kryptoanalyse | Opas Befehlskanal |
| Taubenschlag-Tastenfeld | Kap. 1 | Finale | Ringnummer + Binär | Zugang zur Zentrale |
| Serverraum-Tür (2FA) | Kap. 2 Schule | Kap. 3 | 2FA | Netzplan der Schule |
| Schaltschrank Fernmeldeamt | Kap. 2 | Kap. 3 | Router/Switch-Wissen | Hinweis auf Richtfunk |
| Gefälschte Bankseite | Kap. 3 | Kap. 5 | Zertifikatsprüfung | „Funkstille CA" entlarvt |
| Richtfunkantenne Bitberg | Kap. 3 | Kap. 5 | Traceroute | Letzter Hop Kabelitz |
| Subnetz-Türen Silberstollen | Kap. 3 | Kap. 5 | Subnetzmaske | Logbuch der Weiterleitung |

---

## 9. Minispiel-Katalog (alle auch im Trainingsraum mit Zufallsaufgaben)
| # | Minispiel | Kap. | Inhalt |
|---|---|---|---|
| 1 | Sortiermaschine (Briefzentrum) | 1 | Adressen, Sortieren nach PLZ |
| 2 | EVA-Werkbank | 1 | Hardware, EVA + Speichern |
| 3 | Betriebssystem-Chef | 1 | Aufgaben des Betriebssystems |
| 4 | Bit-Schlösser & Pixelwand | 1 | Binär: Zahl, Text, Bild |
| 5 | Fotolabor | 1 | Farbkanäle, Graustufen, Negativ |
| 6 | Krümel-Blöcke (Stufe 1–3) | 1/2 | Sequenz → Verzweigung/Schleifen |
| 7 | Zustandsdiagramm-Reparatur | 1 | Automaten |
| 8 | Datei-Chaos | 1 | Dateitypen, Dateinamen, Speicherkapazität |
| 9 | Tabellen-Zauber | 1 | Tabellenkalkulation |
| 10 | Was ist schneller? | 1 | Übertragungsrate, Einheiten |
| 11 | Algorithmus oder nicht? | 2 | Algorithmusbegriff |
| 12 | Adress-Zerleger | 2 | E-Mail-/Web-Adressen |
| 13 | Phishing-Detektiv | 2 | Phishing, Authentizität |
| 14 | Passwort-Schmiede | 2 | Passwortsicherheit, Brute Force |
| 15 | Ranking vs. Wahrheit / Bild-Detektiv | 2 | Suche, SEO, Bildmanipulation |
| 16 | Caesar/Gartenzaun/Vigenère | 2 | Klassische Verschlüsselung |
| 17 | Heimnetz-Baukasten | 3 | Komponenten, PAN/LAN/WAN, Kabel/Funk |
| 18 | Puzzle-Post / Paketverteiler | 3 | Datenpakete, TCP/IP, Routing |
| 19 | Schlossbote | 3 | Sym./asym. Verschlüsselung |
| 20 | Datenbank-Detektiv | 3 | Abfragen, JOIN, Aggregat (SQL-Stufe für Sek II/BW) |
| 21 | Filter-Trainer | 3 | Maschinelles Lernen |
| 22 | KrümelScript-Editor | 4 | Datentypen, Bedingungen, Funktionen |
| 23 | HTML-Restaurator | 4 | HTML, Barrierefreiheit, CSS |
| 24 | Regex-Kescher | 4 | Reguläre Ausdrücke |
| 25 | Netz-Architekt | 5 | Topologien, Kantenmenge, Redundanz |
| 26 | Adress-Rezeption / Subnetz-Maske | 5 | DHCP, Subnetting |
| 27 | Longest Prefix Match | 5 | Routingtabellen |
| 28 | Der Weltbaum | 5 | DNS hierarchisch |
| 29 | Zeitmaschine Backup | 5 | Datensicherung, Hash |
| 30 | TLS-Handschlag / Zertifikatskette | 5 | Hybride Verschlüsselung, Signaturen |
| 31 | Traceroute | 5 | Pfade, Latenz |
| + | Debug-Kämpfe gegen Glitchlinge | alle | Wiederholung mit Fragen der freigeschalteten Stufen |

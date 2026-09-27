# NETZBLICK – Alex und die Funkstille

## Stand der Umsetzung

**M0 „Fundament" ist fertig:** Phaser 4 + TypeScript + Vite, alle Grafiken und die Schrift aus Code, Kachelbewegung, Dialoge, Menü, Script-System, Hilfe von Ping, Netzblick-Brille, Speichercode, Schulkalender mit Lehrkraft-Codes, Touch-Steuerung.

**M1 „Vertical Slice" ist fertig** (ca. 30–45 Minuten Spielzeit):

- Prolog im Keller (FUNKSTILLE tippt, Hinweise im Bild: Klappenschrank, Taubenkäfig, Tasse, Strickjacke)
- Quest 1.1: Mama im Homeoffice, Papa nach der Nachtschicht, das Internet ist weg, Lina soll eingeladen werden
- Quest 1.2: Opa Werners Idee, Minispiel „Brief an Lina" (Information vs. Daten, Umschlag beschriften), Briefmarke von Opa, Briefkasten, Zeitsprung
- Frau Krause bringt Tante Adas Paket und nimmt Alex mit ins Briefzentrum: Minispiel „Sortiermaschine" (3 Runden nach Postleitzahl) und „Reise des Briefs" (2 Tage 3 Stunden)
- Quest 1.3: Minispiele „Brille zusammenbauen" (EVA + Speichern) und „NetzBlick OS" (Aufgaben des Betriebssystems)
- Erster Netzblick: Die Kabel sind tot, der graue Kasten ist aufgebrochen, FUNKSTILLEs Caesar-Zettel
- Objekt-Scan mit der Brille (Objektkarten mit Klasse, Attributen, Methoden) an Katze Morse, Ping, Briefkasten, Antenne, Geräten im Haus
- Tageszeit (Tag 1/2, Vormittag/Nachmittag) mit Einfärbung draußen
- 7 Netzbuch-Einträge, alle Klasse 7

Tests (Stand M1): 57 Unit-Tests (u. a. Minispiel-Logik, Caesar-Zettel, Kartenprüfung, Klassenstufen-Grenzen, Schriftabdeckung aller Texte) und 3 Browser-Tests, darunter ein kompletter Durchlauf von Kapitel 1 mit allen Minispielen.

**Korrekturen nach dem Test von M1:** Betriebssystem-Minispiel entfernt (Thema vorerst nicht in Kapitel 1), alle Texte brechen um (Tests prüfen das), Drehen im Stand bildratenunabhängig, Gegenstände haben beim Anschauen Vorrang vor Ping, lange Speichercodes werden umbrochen.

**M2a ist fertig:**
- Herr Kowalski am aufgebrochenen Kasten mit drei Aufträgen (binär beschriftete Anschlüsse, Schlüssel im Gully, Kabelbinder)
- Neuer Dorfplatz (Museum, Dorfladen, Kabelschacht) und das Dorfmuseum mit Frau Fröhlich
- 7 Exponate (Schickard, Pascal, Leibniz, Lovelace, Turing, Zuse, von Neumann) mit Fragen; Leibniz gibt die Binär-Karte
- Minispiele: Bit-Schloss (3 Stufen), Pixelwand, Geheimtext, Fotolabor (optional, Hinweis auf Werner Lösch), Krümel-Blöcke (Emils Garten, Gully), Zustandsdiagramm
- Emil und Krümel, Block-Fernbedienung; Backtracking-Keime: Kabelschacht (zu lang für 10 Befehle), Fernschreiber im Archiv
- Minispiele direkt aufrufbar: `?minispiel=bloecke:gully`, `?minispiel=bitschloss:3` usw.

**M2b ist fertig – Kapitel 1 komplett:**
- Tagesablauf Mittwoch bis Samstag (Wochentag und Tageszeit oben links, abends/nachts dunkler), Schlafen im Bett bringt die Geschichte weiter
- Dorfladen mit Herrn Nguyen: Bytes als Währung (Anzeige im Rucksack), Pfandautomat (EVA-Frage + Zustandsdiagramm), Kartenterminal mit Touchscreen-Frage, Kabelbinder für 2 KB
- Dorfplatz: Händler Hubert (KB/MB/GB gegen KiB/MiB/GiB), Frau Lehmann (Datei-Chaos mit 4-GB-Stick, Tabellen-Zauber mit `=B2*C2` und `=SUMME(D2:D5)`)
- Reparatur mit Herrn Kowalski: Kabelsalat (binär beschriftete Anschlüsse), Krümel drückt den Reset-Knopf; danach fließen im Netzblick wieder Daten
- E-Mail an Tante Ada (Zeitleiste: 0,8 s gegen 2 Tage 3 Stunden) und „Was ist schneller?" (Internet oder Ping mit Speicherkarte)
- Samstag: Dorffest mit Bühne und Kuchenstand, Lina bringt den Brief mit, Minispiel „Linas Plakat" (Pixel/Vektor, Objekt.Attribut = Wert, Inhalt und Design)
- Nachts: FUNKSTILLEs Nachricht, „Ende von Kapitel 1", Verweis auf den Kalender
- Neue Minispiele direkt aufrufbar: `?minispiel=einheiten`, `dateien`, `tabelle`, `schneller`, `kabelsalat`, `plakat`, `briefreise:email`, `zustand:pfand`, `bloecke:kasten`

Tests (Stand M2b): 102 Unit-Tests und 3 Browser-Tests; der Durchlauf spielt Kapitel 1 vom Prolog bis zum Abspann mit allen Minispielen per Tastatur (ca. 5 Minuten).

**Nach M2b:** Museumsexponate zeigen ein Bild (Script-Befehl `bild`), richtige Antworten stehen nicht mehr immer oben (Museum, Laden, alle Quiz-Minispiele).

**M3a ist fertig – Kapitel 2, Teil 1 („Erster Schultag"):**
- Kalender-Code Klasse 8 startet Kapitel 2 (`startKapitel2` in `WorldScene`, Startzustand in `src/content/kapitel.ts`); Einstieg in `src/content/dialog/kapitel2.ts`
- Tante Ada spielt per Videoanruf das Update auf Brille v2 auf: Funkquellen (`net.funk`) erscheinen als sich ausbreitende Ringe
- Neue Karten `knotenburg` (Markt, Rathaus, Pizzeria, Bibliothek, Fernmeldeamt, Bushaltestelle) und `gymnasium` (Flur, Informatikraum, Serverraum-Tür)
- Neue Figuren: Herr Work, Mia, Jonas, Passant; Bushaltestelle in Kabelitz
- Minispiele `algorithmus` (eindeutig, ausführbar, endlich) und `clientserver`
- Krümel-Blöcke mit Kontrollstrukturen: Zählschleife (⟳ n× … ⟲ Ende, auch verschachtelt), Verzweigung („wenn Wand: rechts"), kopfgesteuerte Schleife („solange frei: vor"); Level `kanal1`, `kanal2` und `schacht` (Backtracking am Dorfplatz → Schlüssel 7)
- Bedingung `{ stufeMin: 8 }` schaltet Kapitel-2-Inhalte in alten Karten frei; der Inhaltstest prüft Klassenstufen jetzt auch hinter solchen Bedingungen
- Scripts, die die Karte wechseln, lösen danach das `onEnter` der neuen Karte aus
- Browser-Test `kapitel2.spec.ts` spielt M3a komplett durch (Einstieg ohne Code über `testStartKapitel2()`)

**M3b/M3c – Kapitel 2 komplett:** Dienstag und Mittwoch in Knotenburg (`src/content/dialog/kapitel2b.ts`): Mail-Werkstatt, Adressen, IP/MAC, Pakete als Einblick, Phishing-Welle mit Hilfe für Menschen in der Stadt, Passwort-Schmiede, Pizza Pino, Bibliothek (Suche, Ranking, Bild-Detektiv, Metadaten), Caesar-Scheibe (Zettel aus Kapitel 1), Fernmeldeamt als Finale.

**Datengetriebene Minispiele:** Neue Minispiele sind reine Daten (`SpielDef` in `src/minigames/defs.ts`, Arten `quiz`, `reihenfolge`, `kampf`, `caesar`, `passwort`), je Kapitel in `src/content/spiele/kapitel2..5.ts`. `ausDef()` in `src/minigames/generisch.ts` baut daraus das Modal. Quizfragen können Bild, Tabelle oder Code zeigen; richtige Antworten werden deterministisch gemischt (`festeReihenfolge` schaltet das ab).

**Kapitel 3 (Kl. 9):** Brille v3, Heimnetz und fremdes Gerät, Netzleitstelle mit Frau Dr. Yilmaz, Datenbank-Detektiv, KI-Filter, Silberbach und der Silberstollen als Dungeon mit Gittern, Boss-Kampf „Paketsturm".

**Kapitel 4 (Kl. 10):** Werkstatt mit Kevin (`src/content/dialog/kapitel4.ts`), KrümelScript, HTML-Restaurator mit Herrn Schubert, Regex, Chat-Server, Sortieren/Suchen; Postkarten „aus Bad Elster"; Tante Ada übergibt den Reisepass.

**Kapitel 5 und Finale (Oberstufe):** Brille v4 und die Weltkarte (`weltkarte`) mit Reisezielen, die nach und nach freigeschaltet werden: Frankfurt, Landestation, Island, Tokio, Sydney. Leon verrät die Wendung; nachts in Kabelitz öffnet das Bit-Schloss mit 4 Lampen den Taubenschlag, in `opas_keller` folgen vier Räume, das Streitgespräch, der Große Stecker, der Videoanruf mit Leon, Epilog und Abspann (`spiel_ende`).

**Tests (Stand Finale):** Über 390 Unit-Tests, darunter
- `story.test.ts`: Ein Story-Simulator (`tests/unit/helfer/story.ts`) spielt jedes Kapitel mit den echten Scripts bis zum Ende durch und prüft, dass jedes datengetriebene Minispiel in einem Script vorkommt.
- `erreichbar.test.ts`: Breitensuche über alle Karten, jede Figur und jedes Objekt ist erreichbar.
- `spiele.test.ts`: jede Quizfrage hat genau eine richtige Antwort, alle Texte passen aufs Brett, jede Aufgabe hat einen Lehrplanbezug.
- `doku.test.ts`: hält `docs/MINISPIELE.md` und `docs/NETZBUCH.md` synchron (neu erzeugen mit `DOKU_SCHREIBEN=1 npx vitest run tests/unit/doku.test.ts`).
- Speichercode v2 (lauflängenkodiert, am Spielende höchstens 64 Zeichen), v1-Codes bleiben lesbar.

Browser-Tests: Kapitel 1 komplett, Kapitel 2 Teil 1, Kapitel 5 (Weltkarte, Frankfurt), Smoke-Test.

**Nach dem Finale – HUD, Ton, Grafik:**
- HUD: Die Aufgabenzeile oben ist weg. Oben rechts stehen die Tasten M, H und N (anklickbar), bei einer neuen Aufgabe blinkt kurz „Neue Aufgabe! Frag Ping mit H.". Ping nennt auf H zuerst die Aufgabe, dann die Tipps. Bildschirm-Knöpfe gibt es nur auf reinen Touch-Geräten (`isTouchDevice()` prüft `pointer: coarse` ohne feinen Zeiger).
- Ton (`src/engine/audio/`): eigener Chiptune-Synth über WebAudio, keine Audiodateien. `musikLogic.ts` enthält die zwölf Lieder als Daten (Akkorde je Takt, handgeschriebene Melodie, Muster für Bass, Begleitung und Schlagzeug) und die Zuordnung Karte → Lied; `Audio.ts` spielt sie mit Vorausplanung ab und erzeugt die Geräusche (Sprech-Blips je Figur, Gurren von Ping, Menü, Türen, Gegenstände, richtig/falsch, geschafft, Brille). Minispiele und Kämpfe legen ihr eigenes Lied darüber, nachts und im Finale wechselt die Musik. Musik und Geräusche sind im Menü getrennt abschaltbar (gespeichert im Browser). `musik.test.ts` prüft Taktlängen, Tonumfang und dass jeder Takt mit einem Akkordton beginnt.
- Grafik: `src/engine/gfx/veredeln.ts` gibt allen Objekt-Kacheln automatisch Licht oben links, Schatten unten rechts und einen weichen Schlagschatten; Figuren haben schattierte Haare, Wangen, Kleidung und einen Bodenschatten. Neu gezeichnet: Gras, Wege, Kopfsteinpflaster, Dielen, Parkett, Fels, Meer. `ueberlagerungen()` in `mapUtil.ts` berechnet je Karte Grasränder über Wegen, Küsten am Meer und Schatten unter Wänden (eigene Ebenen zwischen Boden und Objekten).

## Entwickeln

```bash
npm install
npm run dev          # Entwicklungsserver, http://localhost:5173
npm test             # Unit-Tests
npm run e2e:full     # Build + Browser-Tests (Playwright)
npm run build        # statischer Build nach dist/
```

Hilfreiche URL-Parameter: `?kontaktbogen` zeigt alle Grafiken auf einer Seite.

**Veröffentlichen:** Bei jedem Push auf `main` baut `.github/workflows/deploy.yml` das Spiel und stellt es auf GitHub Pages. Einmalig nötig: Repository → Settings → Pages → Source: „GitHub Actions".

**Kalender-Codes ändern:** `node tools/kalender-code.mjs` schlägt einen neuen Code vor und gibt den Hash aus; `node tools/kalender-code.mjs ABCD-1234` hasht einen eigenen Code. Den Hash in `src/content/calendarCodes.ts` eintragen. Klartext-Codes nie committen.

**Register nur erweitern:** In `src/content/registry.ts` (Karten, Items, Flags, Netzbuch, Aufgaben) nur hinten anfügen, nie umsortieren – sonst werden Speichercodes in den Heftern ungültig.

## 2. Technischer Plan

### 2.1 Engine & Stack (Entscheidung)
| Bereich | Wahl | Begründung |
|---|---|---|
| Engine | **Phaser 4** (aktuell 4.2.1, MIT-Lizenz, über npm) | Ausgereift für 2D/Pixel-Art, Szenen, Tweens, Input (Tastatur/Gamepad/Touch), WebGL mit Canvas-Fallback. **Kein Engine-Zugang/Konto nötig** – ist ein normales npm-Paket. |
| Sprache | TypeScript | Typsichere Inhaltsdaten (Dialoge, Quests, Lehrplan-Tags) → Fehler fallen beim Build auf. |
| Build | Vite | Schneller Dev-Server, statischer Build. |
| Tests | Vitest (Logik + Inhaltsvalidierung), Playwright (Chromium ist vorinstalliert) für Smoke-Tests | |
| Hosting | **GitHub Pages** via GitHub Action | Das Spiel ist rein statisch → GitHub reicht. VPS nur nötig, falls später ein Lehrkraft-Dashboard mit Klassenfortschritt gewünscht ist. |
| Offline | PWA (Service Worker) + ZIP-Download | Läuft nach dem ersten Laden offline; ZIP auf Schulserver/USB-Stick möglich. |
| Datenschutz | Keine Accounts, kein Tracking, keine externen Requests (Fonts, CDNs – alles selbst gehostet) | DSGVO-konform für Schulen, einbindbar per Link in LernSax. |

### 2.2 Grafik – vollständig selbst erstellt
- **Pixel-Art als Text-Raster im Code**: Jede Grafik (Kacheln, Figuren, Items, Porträts) ist ein Raster aus Zeichen + einer eigenen Farbpalette, z. B.
  ```ts
  export const PING_IDLE = px(`
    ....aaaa....
    ...abbbba...
    ..abbcbbba..`, { a: 'outline', b: 'grey', c: 'eye' });
  ```
  Beim Start werden daraus Phaser-Texturen erzeugt. Vorteile: 100 % eigene Grafik, versionierbar (Git-Diffs), von dir editierbar, keine externen Assets.
- `tools/render-sprites.ts` exportiert alle Grafiken zusätzlich als PNG-Kontaktbogen (Vorschau/Dokumentation).
- **Auflösung**: intern 320×180 (16:9), ganzzahlig skaliert (1280×720, 1920×1080 pixelgenau). Kacheln 16×16, Figuren 16×16 im Chibi-Stil (wie Pokémon auf dem Game Boy), 3 Richtungen × 3 Laufbilder (rechts = gespiegelt links).
- **Eigene Palette** (~32 Farben), **eigene Bitmap-Schrift** mit Umlauten/ß.
- **Netzblick-Overlay farbenblind-sicher**: Nicht nur Farbe, sondern Form: Kabel = Linien (gestrichelt/durchgezogen je Medium), Funk = Ringwellen, Pakete = Briefumschlag-Symbole, verschlüsselt = Schloss-Symbol.
- **Audio selbst erzeugt**: kleiner WebAudio-Chiptune-Synth (Rechteck/Dreieck/Rauschen), Songs als Notenfolgen im Code, prozedurale Soundeffekte.

### 2.3 Architektur / Ordnerstruktur
```
network-RPG/
  index.html, package.json, tsconfig.json, vite.config.ts
  src/
    main.ts                       Phaser-Config (320×180, pixelArt, Scale FIT)
    engine/
      scenes/   Boot, Title, World, UI (HUD+Dialog), Menu, MinigameHost, Battle, Travel (Weltkarte)
      world/    MapLoader, GridMover (Pokémon-artige Kachelbewegung), Collision, Interact, Warps, Camera
      netvision/ NetGraph (Geräte=Knoten, Kabel/Funk=Kanten), NetVisionLayer (Stufen v1–v4), PacketFlow
      script/   ScriptRunner – Befehle: say, choice, give, take, flag, if, walk, warp, fade,
                minigame, battle, lexicon, quest, hint, wait, camera
      state/    GameState, Flags, Inventory, SaveManager (localStorage + Speichercode + JSON-Export)
      gfx/      PixelArt (Raster→Textur), Palette, BitmapFont, Animations, Filter (Netzblick-Tönung)
      audio/    Synth, Sfx, songs/
      ui/       DialogBox (Schreibmaschinen-Effekt, Porträts), Menu, TouchControls, HintSystem (Ping),
                QuestTracker, Netzbuch-Ansicht
      curriculum/ tags.ts (Lehrplan-IDs SN/BW), gating.ts (Klassenstufen-Sperre)
    content/
      art/        tiles/, characters/, items/, portraits/   (Pixel-Raster)
      maps/       ch1/ … ch5/, finale/   (ASCII-Kachelkarten + Entities + Netzgraph)
      dialog/     ch1/ … (alle Texte deutsch, getrennt von Logik)
      quests/     ch1.ts …
      lexicon/    Netzbuch-Einträge (mit Lehrplan-Tags + Pixel-Illustration)
      minigames/  <id>/ (Scene + Aufgaben-Generator + Lehrplan-Tags + Schwierigkeitsstufen)
      battles/    Fragenpools für Debug-Kämpfe, nach Klassenstufe getaggt
  tools/  render-sprites.ts, validate-content.ts
  tests/  unit/*.test.ts, e2e/smoke.spec.ts
  docs/   TECHNIK.md, PLOT.md, LEHRPLAN.md, ITEMS_UND_HILFE.md, LEHRERHANDBUCH.md (später)
  .github/workflows/deploy.yml
```

### 2.4 Kernsysteme
- **Karten**: ASCII-Raster pro Ebene (Boden, Objekte, Kollision) + Legende + Entity-Liste (NPCs, Schilder, Türen, Trigger) + **Netzgraph** (Geräte, Kabelpfade entlang von Kacheln, Funkquellen mit Reichweite, scriptbare Paketflüsse). Du kannst Karten als Text lesen/ändern.
- **Netzblick (die Brille)** – eigene Render-Ebene, per Taste `N` umschaltbar: Welt wird abgedunkelt/blau getönt, darüber: Kabel leuchten, Geräte glühen, Funkwellen pulsieren, Pakete wandern als Umschläge entlang der Kanten. Die Detailstufe hängt vom Brillen-Upgrade ab (v1–v4, siehe Items). Zusätzliche Linsen: **Objekt-Scan** (Kap. 1), **Quelltext-Linse** (Kap. 4).
- **Script-System**: Story-Ereignisse sind typisierte Daten, z. B.
  ```ts
  event('ch1.opa.briefmarke', [
    say('opa', 'Na Alex, \'ne Briefmarke brauchste? Früher hat man sich noch Mühe gegeben mit Briefen!'),
    give('briefmarke'), flag('ch1.hatMarke'),
    quest('ch1.brief', 'Wirf den Brief in den Briefkasten am Dorfplatz.'),
  ]);
  ```
- **Minispiele** als eigenständige Szenen mit einheitlicher Schnittstelle (`id`, `lehrplan[]`, `stufe`, `schwierigkeit`, `generateTask(seed)`, `onComplete`). Jedes Minispiel ist in der Story **und** im Trainingsraum (mit Zufallsaufgaben) nutzbar.
- **Debug-Kämpfe** (Pokémon-artig, rundenbasiert): „Glitchlinge" (defekte Pakete/Spam-Bots) erscheinen im Netzblick. „Angriffe" = richtige Maßnahmen/Antworten. Fragen kommen nur aus bereits freigeschalteten Klassenstufen → eingebaute **verteilte Wiederholung**.
- **Währung „Bytes"**: Alex sammelt Bits (8 Bit = 1 Byte); Preise im Dorfladen in Byte/KB/MB → Einheiten (Kl. 7) werden nebenbei geübt.

### 2.5 Spiralcurriculum technisch abgesichert
- Jeder Inhalt (Quest, Minispiel, Netzbuch-Eintrag, Kampffrage, Item) trägt Tags: `{ land: 'SN'|'BW', stufe: 7|8|9|10|11, lb: 'LB2', thema: 'Phishing' }`.
- `validate-content` (läuft als Test in CI) prüft:
  1. **Keine Inhalte höherer Klassenstufe in früheren Kapiteln** (Kap. 1 ≤ 7, Kap. 2 ≤ 8, Kap. 3 ≤ 9, Kap. 4 ≤ 10, Kap. 5 = Sek II). Inhalte, die dein Schulcurriculum früher ansetzt als der Lehrplan (IP/MAC/Pakete als Einblick in Kl. 8), tragen zusätzlich `quelle: 'Schulcurriculum'` und sind dadurch ausdrücklich erlaubt – so bleibt die Abweichung dokumentiert.
  2. **Lösbarkeit/kein Softlock**: Abhängigkeitsgraph aller Quests/Items/Flags – jedes benötigte Item ist vorher erreichbar (Breitensuche).
  3. Alle Türen/Warps haben Ziele, alle Dialog-/Item-Referenzen existieren.
  4. **Lehrplan-Abdeckungsbericht**: welche Lehrplanpunkte wo vorkommen → `docs/LEHRPLAN.md` wird teilweise automatisch erzeugt.

### 2.6 Speichern über Schuljahre hinweg
- Autosave im Browser (localStorage) – auf Schulrechnern unzuverlässig, daher zusätzlich:
- **Speichercode** im Stil alter Nintendo-Passwörter (z. B. `KABL-7Q2X-P1NG-…`): Kapitel, Flags, Inventar, Netzbuch als Bitfelder → Bytes → Prüfsumme → Base32. Schüler:innen notieren ihn im Hefter.
- **Klassenstufen-Codes über den Kalender in Alex' Zimmer** (wie Level-Codes in alten Nintendo-Spielen):
  - An der Wand in Alex' Zimmer hängt ein **Schulkalender**. Ping erklärt ihn schon im Prolog: „Wenn ein neues Schuljahr anfängt, blätterst du hier um – aber nur mit dem Code deiner Lehrkraft."
  - Beim Umblättern erscheint eine Code-Eingabe im Retro-Stil (z. B. 8 Zeichen). Richtiger Code → Zwischensequenz „Ein Jahr später …", Alex erhält den definierten Startzustand des Kapitels (alle Items/Wissen der vorherigen Kapitel) und einen Rückblick „Was bisher geschah" (= Wiederholung). So kann eine 9. Klasse direkt mit Kap. 3 starten, auch ohne alten Spielstand.
  - Am Ende jedes Kapitels verweist die Geschichte auf den Kalender („Das Schuljahr ist vorbei. Wenn es weitergeht, weiß deine Lehrkraft, wie du umblätterst.").
  - **Die Codes kennt nur die Lehrkraft**: Im Spielcode stehen sie nur als gesalzene Hashwerte, nie im Klartext. Die Klartext-Codes stehen ausschließlich im Lehrerhandbuch, das **nicht** im öffentlichen Repo liegt, sondern separat an Lehrkräfte geht. Einschränkung, ehrlich benannt: Ein reines Browserspiel ohne Server kann Codes nicht absolut geheim halten; der Hash macht Erraten und Nachschlagen aber praktisch unmöglich. Einmal eingegebene Codes gelten dauerhaft für den Spielstand.
  - Jede Klassenstufe hat einen eigenen Code (Kl. 8, 9, 10, Oberstufe); ein Code springt direkt an den Anfang des passenden Kapitels. Frühere Kapitel bleiben zum Wiederholen begehbar.
- JSON-Export/Import als Backup.

### 2.7 Lehrkraft-Modus (`?lehrkraft` + PIN)
- Profil wählen: **Sachsen Gymnasium** oder **BW Berufliches Gymnasium** → bestimmt freigeschaltete Kapitel und Fragenpools.
- Maximale Klassenstufe festlegen (Gating), Kartenmarkierungen an/aus, Timer in Minispielen an/aus, Hinweisstufen begrenzen.
- **Stundenmodus**: Kapitel sind in ~45-Minuten-Etappen mit Speicherpunkten gegliedert; am Etappenende erscheint eine Zusammenfassung der neuen Netzbuch-Einträge (→ Hefter-Eintrag).
- Netzbuch als druckbare Seite (Hefter-Material).

### 2.8 Bedienung & Barrierefreiheit
- Tastatur (Pfeile/WASD, Leertaste/Enter = A, Esc = B, `H` = Hilfe, `N` = Brille, `M` = Menü), Gamepad, **Touch-Steuerung für Tablets**.
- Textgeschwindigkeit, große Schrift, optionale serifenlose Leseschrift, keine Zeitdruck-Pflicht, Lautstärke getrennt für Musik/Effekte.
- Läuft flüssig auf alten Schulrechnern (320×180 intern).

---

## 10. Meilensteine (Umsetzung nach Freigabe)
| Meilenstein | Inhalt | Ergebnis |
|---|---|---|
| **M0 Fundament** | Vite + TS + Phaser 4, Pixel-Pipeline, Bitmap-Schrift, Kachelbewegung, Dialogbox, Script-Runner, Speichern + Speichercode, Testkarte, Tests, GitHub-Pages-Deploy | Spielbare Testkarte im Browser |
| **M1 Vertical Slice** | Prolog + Kap. 1 bis inkl. Quest 1.3: Alex' Haus, Opa Werner, Brief-Odyssee inkl. Sortiermaschine, Paket, EVA-Werkbank, erster Netzblick, Ping-Hinweise, Netzbuch | **Im Unterricht testbar** (~30–45 Min.) |
| M2 | Kapitel 1 komplett | Kl. 7 spielbar |
| M3 | Kapitel 2 | Kl. 8 spielbar |
| M4 | Kapitel 3 | Kl. 9 spielbar |
| M5 | Kapitel 4 | Kl. 10 spielbar |
| M6 | Kapitel 5 + Finale | Sek II spielbar |
| M7 | Trainingsraum, Lehrkraft-Modus, Lehrerhandbuch, Musik, Feinschliff | Version 1.0 |

---

## 11. Verification
**Für diesen Planungsschritt (Dokumente):**
- `docs/*.md` sind im Repo, auf GitHub lesbar, Commit auf `claude/optimistic-franklin-xv2sw0` gepusht (`git log`, `git status` sauber).
- Gegenprüfung: Jede Zeile der Lehrplan-Tabelle (`docs/LEHRPLAN.md`) ist mindestens einer Quest oder einem Minispiel zugeordnet; kein Kapitel nutzt Inhalte einer höheren Stufe.

**Für die spätere Umsetzung (ab M0):**
- `npm run build` fehlerfrei; `npm test` (Vitest): Speichercode-Roundtrip, Script-Runner, Aufgaben-Generatoren, `validate-content` (Stufen-Gating, Lösbarkeit ohne Softlock, Warps/Referenzen).
- `npx playwright test`: Spiel startet, Titelbild → neues Spiel → Alex läuft, Dialog öffnet sich, Netzblick schaltet um, Screenshot-Vergleich.
- Manuell: im Browser (Desktop + Touch-Emulation) Vertical Slice durchspielen; GitHub-Pages-URL aufrufen; offline neu laden (PWA).

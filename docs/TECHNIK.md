# NETZBLICK – Alex und die Funkstille

## Stand der Umsetzung

**M0 „Fundament" ist fertig** (Testversion, noch ohne echte Kapitelinhalte):

- Phaser 4 + TypeScript + Vite, alle Grafiken und die Schrift werden beim Start aus Code erzeugt (`src/content/art`, `src/engine/gfx`)
- Kachelbewegung wie bei Pokémon (kurz tippen = drehen, halten = laufen, B halten = rennen), Kamera, Türen/Warps
- Dialogfenster mit Schreibmaschinen-Effekt, Auswahlmenüs, Menü (Rucksack, Netzbuch, Speichern)
- Script-System für Story-Ereignisse (`src/engine/script`), Aufgabenzeile, Hilfe von Ping mit drei Hinweisstufen (Taste H)
- Netzblick-Brille v1 (Taste N): Kabel, Glasfaser, Geräte, wandernde Datenpakete
- Speichercode (Hefter-tauglich, mit Prüfsumme) + Autosave, Schulkalender mit Lehrkraft-Codes (nur Hashes im Code)
- Touch-Steuerung für Tablets
- Testkarten: Alex' Zimmer und ein Stück Kabelitz mit Opa Werner, grauem Kasten, Briefkasten, Taubenschlag
- Tests: 35 Unit-Tests (u. a. Speichercode, Kalender-Codes, Script-Runner, Kartenprüfung, Schriftabdeckung), 3 Browser-Tests (komplettes Durchspielen, Speichercode, Kalender)

Nächster Schritt: **M1 Vertical Slice** (Prolog + Kapitel 1 bis zur Brille).

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

import type { QuestId } from './registry';

/** Aufgaben mit dreistufigen Hinweisen für Ping (Richtung → Denkanstoß → Lösungsweg). */
export interface QuestDef {
  titel: string;
  hinweise: [string, string, string];
}

export const QUESTS: Record<QuestId, QuestDef> = {
  // --- Testversion M0 (nicht mehr im Spielablauf) ---
  m0_zimmer: { titel: 'Schau dich in deinem Zimmer um.', hinweise: ['Schau dich um.', 'Schau dich um.', 'Schau dich um.'] },
  m0_draussen: { titel: 'Geh nach draußen.', hinweise: ['Die Tür ist unten.', 'Die Tür ist unten.', 'Die Tür ist unten.'] },
  m0_kabel: { titel: 'Folge den Kabeln.', hinweise: ['Drück N.', 'Drück N.', 'Drück N.'] },
  m0_fertig: { titel: 'Ende der Testversion.', hinweise: ['Fertig!', 'Fertig!', 'Fertig!'] },

  // --- Kapitel 1 ---
  q1_mama: {
    titel: 'Geh runter zu Mama.',
    hinweise: [
      'Mama hat nach dir gerufen. Sie ist unten im Wohnzimmer. Gurr!',
      'Die Treppe nach unten ist die rote Matte unten in deinem Zimmer.',
      'Lauf auf die rote Matte, dann zu Mama an den Tisch und sprich sie mit Leertaste an.',
    ],
  },
  q1_lina: {
    titel: 'Finde einen Weg, Lina einzuladen.',
    hinweise: [
      'Kein Internet, kein Handynetz … Vielleicht hat jemand im Dorf eine Idee? Opa Werner weiß doch immer Rat.',
      'Opa Werner steht draußen vor seinem Haus, gleich rechts neben eurem.',
      'Geh durch die Haustür nach draußen, nach rechts zu Opa Werner, und sprich ihn an.',
    ],
  },
  q1_brief: {
    titel: 'Schreib Lina einen Brief.',
    hinweise: [
      'Papier und Stift liegen an deinem Schreibtisch oben in deinem Zimmer.',
      'Stell dich vor den Schreibtisch neben dem Computer und drück Leertaste.',
      'Denk daran: Lina muss wissen, WAS, WANN und WO. Und auf den Umschlag kommt ihre Adresse in der richtigen Reihenfolge.',
    ],
  },
  q1_marke: {
    titel: 'Besorg eine Briefmarke.',
    hinweise: [
      'Ohne Briefmarke nimmt die Post den Brief nicht mit. Wer im Dorf sammelt Briefmarken?',
      'Mama hat keine. Aber Opa Werner sammelt sie seit Jahrzehnten!',
      'Geh raus und sprich Opa Werner vor seinem Haus an.',
    ],
  },
  q1_einwerfen: {
    titel: 'Wirf den Brief in den Briefkasten.',
    hinweise: [
      'Der gelbe Briefkasten steht unten am Weg, rechts vom Dorfplatz.',
      'Geh von eurem Haus den Weg nach unten und dann nach rechts, bis du den gelben Kasten siehst.',
      'Stell dich vor den gelben Briefkasten und drück Leertaste.',
    ],
  },
  q1_tuer: {
    titel: 'Jemand klingelt! Geh zur Haustür.',
    hinweise: [
      'Es hat geklingelt – vielleicht die Post?',
      'Die Haustür ist unten im Wohnzimmer.',
      'Geh runter ins Wohnzimmer und sprich die Person an der Haustür an.',
    ],
  },
  q1_sortieren: {
    titel: 'Hilf Frau Krause beim Sortieren.',
    hinweise: [
      'Frau Krause steht an der Sortiermaschine im Briefzentrum.',
      'Sprich Frau Krause an. Beim Sortieren helfen dir die Ziffern der Postleitzahl.',
      'Erste Runde: Schau nur auf die erste Ziffer. Dann auf die ersten zwei. Dann auf die ganze Postleitzahl.',
    ],
  },
  q1_paket: {
    titel: 'Öffne Tante Adas Paket in deinem Zimmer.',
    hinweise: [
      'Mama hat das Paket von Tante Ada in dein Zimmer gestellt.',
      'Geh durch die Haustür und die Treppe hoch in dein Zimmer.',
      'Das Paket steht rechts im Zimmer. Stell dich davor und drück Leertaste.',
    ],
  },
  q1_brille: {
    titel: 'Setz draußen die Brille auf (Taste N).',
    hinweise: [
      'Tante Ada schreibt: Draußen gibt es am meisten zu sehen.',
      'Geh aus dem Haus und drück N, um die Brille aufzusetzen.',
      'Mit aufgesetzter Brille kannst du Dinge anschauen (Leertaste): Dann zeigt die Brille ihre Objektkarte.',
    ],
  },
  q1_kasten: {
    titel: 'Untersuche den grauen Kasten an der Straße.',
    hinweise: [
      'Die Kabel aus allen Häusern laufen zu einem Punkt. Folge ihnen!',
      'Die Kabel enden an einem grauen Kasten unten am Weg.',
      'Der graue Kasten steht links neben der Mitte, direkt über dem Weg. Stell dich davor und drück Leertaste.',
    ],
  },
  q1_kowalski: {
    titel: 'Sprich mit dem Techniker am grauen Kasten.',
    hinweise: [
      'Am grauen Kasten steht jetzt ein Mann in Arbeitsjacke.',
      'Der graue Kasten steht unten am Weg. Der Techniker steht links daneben.',
      'Stell dich neben den Techniker und drück Leertaste.',
    ],
  },
  q1_museum: {
    titel: 'Lerne im Dorfmuseum Binärzahlen lesen.',
    hinweise: [
      'Das Dorfmuseum steht am Dorfplatz, südlich von Kabelitz. Frau Fröhlich kennt sich mit alten Zahlen aus.',
      'Geh durch die Lücke in der Buschreihe ganz unten nach Süden. Das Museum ist das große Haus links.',
      'Sprich im Museum mit Frau Fröhlich und schau dir das Leibniz-Exponat an.',
    ],
  },
  q1_archiv: {
    titel: 'Öffne die Archivtür und löse die Rätsel im Archiv.',
    hinweise: [
      'Die Archivtür rechts im Museum hat drei Bit-Schlösser. Nimm deine Binär-Karte zu Hilfe!',
      'Jede Lampe hat einen Wert: 128, 64, 32, 16, 8, 4, 2, 1. Schalte die Lampen an, deren Werte zusammen die Zahl ergeben.',
      'Im Archiv: die Pixelwand (1 = schwarz ausmalen) und das Pult mit dem Geheimtext (Zahl = Platz im Alphabet).',
    ],
  },
  q1_zurueck_kowalski: {
    titel: 'Geh zurück zu Herrn Kowalski.',
    hinweise: [
      'Du kannst jetzt Binärzahlen lesen! Herr Kowalski wartet am grauen Kasten.',
      'Geh zurück nach Kabelitz, zum grauen Kasten unten am Weg.',
      'Sprich Herrn Kowalski an.',
    ],
  },
  q1_emil: {
    titel: 'Frag Emil, ob Krümel helfen kann.',
    hinweise: [
      'Emils Saugroboter Krümel passt durch jede Ritze. Emil wohnt im Haus rechts unten in Kabelitz.',
      'Emil spielt vor seinem Haus. Er sieht traurig aus.',
      'Sprich Emil vor seinem Haus an. Hör genau zu, wie Krümel fahren soll.',
    ],
  },
  q1_gully: {
    titel: 'Hol mit Krümel den Schlüssel aus dem Gully.',
    hinweise: [
      'Der Gully ist direkt neben dem grauen Kasten.',
      'Stell dich neben das Gitter im Weg, rechts vom grauen Kasten, und schau es an.',
      'Plane Krümels Weg im Gully Schritt für Schritt: vor, drehen, aufheben.',
    ],
  },
  q1_kabelbinder: {
    titel: 'Kauf Kabelbinder im Dorfladen.',
    hinweise: [
      'Der Dorfladen ist am Dorfplatz, rechts.',
      'Heute ist der Laden zu. Morgen ist er wieder offen.',
      'Geh nach Hause und leg dich schlafen. Morgen früh geht es weiter.',
    ],
  },
  q1_schlafen: {
    titel: 'Geh schlafen. Morgen hat der Laden wieder offen.',
    hinweise: [
      'Es war ein langer Tag! Dein Bett steht in deinem Zimmer.',
      'Geh nach Hause, die Treppe hoch in dein Zimmer.',
      'Stell dich vor dein Bett (links im Zimmer) und drück Leertaste.',
    ],
  },
  q1_bytes: {
    titel: 'Verdiene 2 KB für die Kabelbinder.',
    hinweise: [
      'Kabelbinder kosten 2 KB = 2.000 Byte. Im Dorf gibt es Leute, die Hilfe brauchen – und dafür zahlen.',
      'Herr Nguyen im Laden hat einen kaputten Pfandautomaten. Frau Lehmann auf dem Dorfplatz bereitet das Dorffest vor.',
      'Wie viele Bytes du hast, steht im Rucksack (Menü, M). Hilf Herrn Nguyen und Frau Lehmann bei beiden Aufgaben.',
    ],
  },
  q1_kaufen: {
    titel: 'Kauf die Kabelbinder im Dorfladen.',
    hinweise: [
      'Du hast genug Bytes! Ab in den Dorfladen.',
      'Der Dorfladen ist rechts am Dorfplatz.',
      'Sprich Herrn Nguyen an der Kasse an.',
    ],
  },
  q1_reparatur: {
    titel: 'Bring Herrn Kowalski die Kabelbinder.',
    hinweise: [
      'Herr Kowalski wartet am grauen Kasten in Kabelitz.',
      'Geh vom Dorfplatz nach Norden zurück nach Kabelitz.',
      'Sprich Herrn Kowalski an. Die Binär-Karte hilft dir beim Kabelsalat.',
    ],
  },
  q1_email: {
    titel: 'Schreib Tante Ada eine E-Mail.',
    hinweise: [
      'Das Internet ist wieder da! Tante Ada freut sich bestimmt über eine Nachricht.',
      'Dein Computer steht in deinem Zimmer.',
      'Stell dich vor den Computer (rechts neben dem Schreibtisch) und drück Leertaste.',
    ],
  },
  q1_samstag: {
    titel: 'Geh schlafen. Morgen ist dein Geburtstag!',
    hinweise: [
      'Morgen ist Samstag: dein Geburtstag und das Dorffest!',
      'Dein Bett steht in deinem Zimmer.',
      'Stell dich vor dein Bett und drück Leertaste.',
    ],
  },
  q1_fest: {
    titel: 'Feier mit Lina auf dem Dorffest.',
    hinweise: [
      'Lina ist mit dem Bus gekommen und wartet auf dem Dorfplatz.',
      'Geh nach Süden zum Dorfplatz. Lina steht vor der Bühne.',
      'Sprich Lina an – sie hat eine Idee für ein Plakat.',
    ],
  },
  q1_kapitel_ende: {
    titel: 'Kapitel 1 geschafft!',
    hinweise: [
      'Du hast Kapitel 1 geschafft! Wie es weitergeht, erfährst du im nächsten Schuljahr.',
      'Deine Lehrkraft kennt den Code für den Kalender in deinem Zimmer.',
      'Bis dahin kannst du im Dorf alles erkunden, was du noch nicht gesehen hast – zum Beispiel alle Museums-Exponate.',
    ],
  },
  q1_fortsetzung: {
    titel: 'Fortsetzung folgt …',
    hinweise: [
      'Hier endet die Testversion von Kapitel 1. Bald geht es weiter!',
      'Du kannst mit der Brille Dinge im Dorf scannen und Objektkarten sammeln.',
      'Probier auch das Netzbuch im Menü (M) aus.',
    ],
  },
  // ---------- Kapitel 2 (Klasse 8) ----------
  k2_ada: {
    titel: 'Tante Ada ruft an! Geh an deinen Computer.',
    hinweise: [
      'Dein Computer piept. Das ist bestimmt Tante Ada!',
      'Der Computer steht in deinem Zimmer rechts neben dem Schreibtisch.',
      'Stell dich vor den Computer und drück Leertaste.',
    ],
  },
  k2_bus: {
    titel: 'Fahr mit dem Bus zum Gymnasium nach Knotenburg.',
    hinweise: [
      'Der Bus nach Knotenburg hält in Kabelitz an der Straße.',
      'Die Bushaltestelle steht rechts in Kabelitz, am Weg vor Emils Haus.',
      'Geh raus, dann nach rechts zur Haltestelle (Schild mit „H") und drück dort Leertaste.',
    ],
  },
  k2_schule: {
    titel: 'Finde den Informatikraum im Gymnasium.',
    hinweise: [
      'Das Gymnasium ist das große Gebäude im Norden von Knotenburg.',
      'Geh durch die Schultür. Der Informatikraum ist im Schulgebäude.',
      'Im Informatikraum steht Herr Work vorn an der Tafel. Sprich ihn an.',
    ],
  },
  k2_clientserver: {
    titel: 'Wie kommt der Stundenplan auf den Bildschirm?',
    hinweise: [
      'Herr Work möchte wissen, woher ein Schul-PC den Stundenplan bekommt.',
      'Schau dir einen der Computer im Informatikraum genauer an.',
      'Stell dich vor einen Schul-PC und drück Leertaste.',
    ],
  },
  k2_kanal: {
    titel: 'Schick Krümel in den Kabelkanal im Schulhof.',
    hinweise: [
      'Im Kabelkanal hat jemand etwas versteckt. Krümel passt hinein!',
      'Die Klappe zum Kabelkanal ist draußen an der Schulmauer, rechts neben dem Eingang.',
      'Die Fernbedienung hat neue Blöcke: ⟳ wiederholt Befehle, ⟲ beendet die Wiederholung. So brauchst du viel weniger Blöcke.',
    ],
  },
  k2_stick: {
    titel: 'Bring den fremden USB-Stick zu Herrn Work.',
    hinweise: [
      'Krümel hat einen fremden USB-Stick gefunden. Den sollte sich Herr Work ansehen.',
      'Herr Work ist im Informatikraum.',
      'Sprich Herrn Work an. Den Stick selbst einzustecken, wäre gefährlich!',
    ],
  },
  k2_heim: {
    titel: 'Fahr mit dem Bus nach Hause.',
    hinweise: [
      'Die Schule ist aus! Der Bus zurück nach Kabelitz fährt an der Haltestelle links in Knotenburg.',
      'Die Bushaltestelle ist ganz links in Knotenburg.',
      'Zu Hause wartet Mama im Wohnzimmer.',
    ],
  },
  k2_fortsetzung: {
    titel: 'Fortsetzung folgt …',
    hinweise: [
      'Hier endet die Testversion M3a von Kapitel 2. Bald geht es mit dem fremden USB-Stick weiter!',
      'Mit Wiederholungen schafft Krümel jetzt auch den langen Kabelschacht am Dorfplatz in Kabelitz.',
      'Im Netzbuch (Menü, M) findest du alles, was du heute gelernt hast.',
    ],
  },
  k2b_schule: {
    titel: 'Herr Work will den Stick untersuchen. Ab zur Schule!',
    hinweise: [
      'Heute wird der fremde USB-Stick untersucht.',
      'Fahr mit dem Bus nach Knotenburg ins Gymnasium.',
      'Herr Work wartet im Informatikraum.',
    ],
  },
  k2b_markt: {
    titel: 'Hilf den Leuten auf dem Markt gegen die Phishing-Mails.',
    hinweise: [
      'Auf dem Marktplatz sind Leute, die auf Phishing-Mails hereinzufallen drohen.',
      'Sprich Frau Berger, den Mann auf dem Markt und Jonas an.',
      'Achte auf Absender, Link, Zeitdruck. Die Echtheits-Lupe hilft dir!',
    ],
  },
  k2b_rathaus: {
    titel: 'Das Rathaus wird angegriffen! Sprich mit Frau Schulz.',
    hinweise: [
      'FUNKSTILLEs Bot probiert Passwörter des Rathauses aus.',
      'Frau Schulz steht vor dem Rathaus links oben am Markt.',
      'Ein sicheres Passwort ist lang und nutzt viele verschiedene Zeichen.',
    ],
  },
  k2b_pino: {
    titel: 'Pino hat Ärger mit seiner Bestell-App.',
    hinweise: [
      'Die Pizzeria „Da Pino" ist rechts oben am Markt.',
      'Sprich Pino vor seiner Pizzeria an.',
      'Frag dich: Welche Daten braucht ein Pizzadienst wirklich?',
    ],
  },
  k2b_heim: {
    titel: 'Fahr nach Hause und schlaf dich aus.',
    hinweise: [
      'Was für ein Tag! Morgen geht es weiter.',
      'Der Bus nach Kabelitz fährt an der Haltestelle ganz links in Knotenburg.',
      'Zu Hause: Treppe hoch, ins Bett (links im Zimmer).',
    ],
  },
  k2c_bibliothek: {
    titel: 'Ist das Brand-Foto echt? Frag in der Bibliothek.',
    hinweise: [
      'Frau Weber in der Stadtbibliothek kennt sich mit Recherche aus.',
      'Die Bibliothek ist unten links am Markt in Knotenburg.',
      'Geh hinein und sprich Frau Weber an.',
    ],
  },
  k2c_lange: {
    titel: 'Das Foto stammt von „W.L."? Frag Bäcker Lange.',
    hinweise: [
      'Die Metadaten verraten die Initialen „W.L.".',
      'Bäcker Wolfgang Lange hat einen Stand auf dem Markt.',
      'Sprich Bäcker Lange auf dem Marktplatz an.',
    ],
  },
  k2c_schule: {
    titel: 'In der Schule ist etwas los. Geh zu Herrn Work.',
    hinweise: [
      'Im Klassenchat passiert etwas Schlimmes.',
      'Geh ins Gymnasium, in den Informatikraum.',
      'Sprich Herrn Work an.',
    ],
  },
  k2c_zettel: {
    titel: 'Entschlüssle FUNKSTILLEs Zettel mit der Caesar-Scheibe.',
    hinweise: [
      'Den Zettel vom grauen Kasten hast du noch im Rucksack.',
      'Frau Sommer hat dir die Caesar-Scheibe gegeben. Probier es direkt bei ihr im Flur.',
      'Sprich Frau Sommer noch einmal an und dreh die Scheibe, bis Wörter entstehen.',
    ],
  },
  k2c_schluessel: {
    titel: 'Hol den alten Schlüssel aus dem Kabelschacht in Kabelitz.',
    hinweise: [
      'Für das Fernmeldeamt brauchst du „Schlüssel 7".',
      'Der lange Kabelschacht ist auf dem Dorfplatz in Kabelitz.',
      'Stell dich vor den Kabelschacht und schick Krümel hinein.',
    ],
  },
  k2c_fernmeldeamt: {
    titel: 'Treffpunkt: altes Fernmeldeamt!',
    hinweise: [
      'Das alte Fernmeldeamt steht unten rechts in Knotenburg.',
      'Öffne die Tür mit Schlüssel 7.',
      'Im Keller wartet etwas. Untersuche den Laptop.',
    ],
  },
  k2_kapitel_ende: {
    titel: 'Kapitel 2 geschafft!',
    hinweise: [
      'Du hast Kapitel 2 geschafft! Weiter geht es im nächsten Schuljahr.',
      'Deine Lehrkraft kennt den Code für den Kalender in deinem Zimmer.',
      'Bis dahin kannst du Knotenburg und Kabelitz weiter erkunden.',
    ],
  },
  k3_ada: {
    titel: 'Tante Ada ruft an! Geh an deinen Computer.',
    hinweise: [
      'Dein Computer piept.',
      'Der Computer steht in deinem Zimmer.',
      'Stell dich davor und drück Leertaste.',
    ],
  },
  k3_router: {
    titel: 'Warum ist das Internet so langsam? Schau dir den Router an.',
    hinweise: [
      'Die blinkende Kiste im Wohnzimmer ist der Router.',
      'Er steht im Wohnzimmer oben an der Wand.',
      'Stell dich davor und drück Leertaste.',
    ],
  },
  k3_opa: {
    titel: 'Wem gehört die TAUBENSCHLAG-CAM?',
    hinweise: [
      'Das fremde Gerät heißt TAUBENSCHLAG-CAM.',
      'Wer hat in Kabelitz einen Taubenschlag?',
      'Sprich Opa Werner in seinem Garten an.',
    ],
  },
  k3_leitstelle: {
    titel: 'Frau Dr. Yilmaz erwartet dich in der Netzleitstelle.',
    hinweise: [
      'KnotenNetz hat das alte Fernmeldeamt zur Netzleitstelle umgebaut.',
      'Fahr mit dem Bus nach Knotenburg. Das Gebäude ist unten rechts.',
      'Geh hinein und sprich Frau Dr. Yilmaz an.',
    ],
  },
  k3_wlan: {
    titel: 'Wer liest im offenen WLAN mit?',
    hinweise: [
      'Pinos Gäste-WLAN hat kein Passwort.',
      'Pino steht vor seiner Pizzeria oben rechts am Markt.',
      'Sprich Pino an und schau dir die Pakete mit der Paket-Lupe an.',
    ],
  },
  k3_datenbank: {
    titel: 'Hilf Frau Dr. Yilmaz bei der Datenbank.',
    hinweise: [
      'Frau Dr. Yilmaz sucht in einer Datenbank nach Spuren.',
      'Sie ist in der Netzleitstelle.',
      'Sprich sie an.',
    ],
  },
  k3_schlafen: {
    titel: 'Fahr nach Hause und schlaf. Morgen geht es ins Erzgebirge!',
    hinweise: [
      'Der Bus nach Kabelitz fährt am Markt ab.',
      'Zu Hause: ab ins Bett.',
      'Das Bett steht links in deinem Zimmer.',
    ],
  },
  k3_stollen: {
    titel: 'Fahr nach Silberbach zum Rechenzentrum im Silberstollen.',
    hinweise: [
      'Der Bus nach Silberbach fährt in Knotenburg ab.',
      'Fahr erst nach Knotenburg, dann an der Haltestelle „Silberbach" wählen.',
      'In Silberbach wartet Kalle vor dem Stollen.',
    ],
  },
  k3_tiefer: {
    titel: 'Dring tiefer in den Silberstollen vor.',
    hinweise: [
      'Jede Halle hat ein Rätsel. Löst du es, öffnet sich das Gitter.',
      'Untersuche die Geräte in jeder Halle.',
      'Ganz hinten wartet der Paketsturm.',
    ],
  },
  k3_kapitel_ende: {
    titel: 'Kapitel 3 geschafft!',
    hinweise: [
      'Du hast Kapitel 3 geschafft! Weiter geht es im nächsten Schuljahr.',
      'Deine Lehrkraft kennt den Code für den Kalender.',
      'Bis dahin kannst du alle Orte weiter erkunden.',
    ],
  },
  k4_werkstatt: {
    titel: 'Die Stadtseiten sind verschandelt! Ab in die Werkstatt.',
    hinweise: [
      'Herr Work schreibt: Treffpunkt in der Werkstatt, dem Maker-Space in der alten Fabrik.',
      'Die alte Fabrik liegt rechts hinter Knotenburg. Folge dem Gehweg nach rechts.',
      'Geh in Knotenburg ganz nach rechts, am Fernmeldeamt vorbei. Drinnen wartet Kevin.',
    ],
  },
  k4_html: {
    titel: 'Repariere die Rathaus-Webseite für Herrn Schubert.',
    hinweise: [
      'Herr Schubert findet mit seinem Screenreader nichts mehr auf der Rathaus-Seite.',
      'Er sitzt in der Werkstatt am Computer.',
      'Sprich Herrn Schubert an. Die Quelltext-Linse zeigt dir den HTML-Code.',
    ],
  },
  k4_regex: {
    titel: 'Fang die Spam-Adressen mit regulären Ausdrücken.',
    hinweise: [
      'Das Stadtforum wird mit Spam geflutet.',
      'Lina sitzt in der Werkstatt am Forum-Rechner.',
      'Sprich Lina an. Ein Suchmuster fängt viele Adressen auf einmal.',
    ],
  },
  k4_chat: {
    titel: 'Baut einen Notfall-Chat für Knotenburg.',
    hinweise: [
      'Kevin hat einen kleinen Rechner, „die Himbeere".',
      'Kevin ist in der Werkstatt.',
      'Sprich Kevin an.',
    ],
  },
  k4_stimme: {
    titel: 'Wessen Stimme ist das? Analysiere die Sprachnachricht.',
    hinweise: [
      'FUNKSTILLE hat eine verzerrte Sprachnachricht geschickt.',
      'Kevin hat sie auf dem Audio-Rechner in der Werkstatt.',
      'Sprich Kevin noch einmal an.',
    ],
  },
  k4_kapitel_ende: {
    titel: 'Kapitel 4 geschafft!',
    hinweise: [
      'Du hast Kapitel 4 geschafft! Weiter geht es im nächsten Schuljahr.',
      'Deine Lehrkraft kennt den Code für den Kalender.',
      'Pack schon mal den Koffer – es geht um die Welt.',
    ],
  },
  k5_frankfurt: {
    titel: 'Frankfurt: Tante Ada wartet am Internetknoten.',
    hinweise: [
      'Auf der Weltkarte liegt Frankfurt gleich neben dir.',
      'Stell dich vor die Markierung „Frankfurt" und drück Leertaste.',
      'Im Internetknoten sprichst du mit Tante Ada.',
    ],
  },
  k5_seekabel: {
    titel: 'Ein Seekabel ist beschädigt! Auf zur Landestation.',
    hinweise: [
      'Die Landestation liegt an der Atlantikküste.',
      'Auf der Weltkarte links unterhalb von Frankfurt.',
      'Sprich mit der Kapitänin an der Station.',
    ],
  },
  k5_island: {
    titel: 'Island: Tante Adas Forschungsdaten sind verschlüsselt!',
    hinweise: [
      'Das grüne Rechenzentrum steht auf Island.',
      'Auf der Weltkarte oben links, über das Meer.',
      'Sprich Sigrun im Rechenzentrum an.',
    ],
  },
  k5_tokio: {
    titel: 'Tokio: An der Wurzel des Internets.',
    hinweise: [
      'In Tokio steht ein Root-Server.',
      'Auf der Weltkarte ganz rechts, hinter Asien.',
      'Sprich Frau Sato an.',
    ],
  },
  k5_sydney: {
    titel: 'Sydney: Woher kommen die Pakete?',
    hinweise: [
      'Tante Adas Kollegin in Sydney hat den Verkehr zurückverfolgt.',
      'Auf der Weltkarte unten rechts, Australien.',
      'Geh ins Café und sprich den jungen Mann hinter der Theke an.',
    ],
  },
  k5_heim: {
    titel: 'Flieg nach Hause. Um Mitternacht kommt der Große Stecker!',
    hinweise: [
      'Die Spur führt nach Kabelitz.',
      'Auf der Weltkarte zurück nach Deutschland, Markierung „Kabelitz" rechts neben Frankfurt.',
      'Dort wartet der Taubenschlag.',
    ],
  },
  k5_taubenschlag: {
    titel: 'Öffne das Tastenfeld am Taubenschlag.',
    hinweise: [
      'Der Taubenschlag steht in Opa Werners Garten.',
      'Rechts oben in Kabelitz. Das Tastenfeld: „Nur für Tauben".',
      'Pings Ringnummer endet auf 042 – binär eingeben!',
    ],
  },
  k5_keller: {
    titel: 'Durchquere die vier Räume im Keller.',
    hinweise: [
      'Unter dem Taubenschlag liegt ein Keller mit vier Räumen.',
      'Jeder Raum hat ein Rätsel aus einem Schuljahr.',
      'Dahinter wartet FUNKSTILLE.',
    ],
  },
  k5_opa: {
    titel: 'Sprich mit FUNKSTILLE.',
    hinweise: [
      'Im letzten Raum sitzt jemand.',
      'Geh ganz nach oben im Keller.',
      'Sprich ihn an.',
    ],
  },
  k5_ende: {
    titel: 'Du hast NETZBLICK geschafft!',
    hinweise: [
      'Die Welt leuchtet im Netzblick – danke fürs Spielen!',
      'Alle Orte kannst du weiter besuchen.',
      'Opa Werner erzählt dir gern von früher – er ist jetzt wieder im Garten.',
    ],
  },
};

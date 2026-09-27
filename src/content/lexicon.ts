import type { LexiconId } from './registry';

/**
 * Netzbuch-Einträge. Sie werden erst NACH einer Entdeckung freigeschaltet (induktiv).
 * `stufe` und `lehrplan` dienen der Spiralcurriculum-Prüfung.
 */
export interface LexiconEntry {
  titel: string;
  text: string;
  stufe: number;
  lehrplan: string;
}

export const LEXICON: Record<LexiconId, LexiconEntry> = {
  kabel: {
    titel: 'Kabel',
    text: 'Unter Straßen und in Wänden liegen Kabel. Über sie reisen Daten von Gerät zu Gerät – man sieht sie nur nicht.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 2 (Informatiksysteme) – Einblick',
  },
  kabelverzweiger: {
    titel: 'Der graue Kasten',
    text: 'Die grauen Kästen am Straßenrand heißen Kabelverzweiger. Hier laufen die Leitungen aus vielen Häusern zusammen und gehen gemeinsam weiter in die Stadt.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 2 (Informatiksysteme) – Einblick',
  },
  information_daten: {
    titel: 'Information und Daten',
    text: 'Auf dem Papier stehen nur Zeichen: Das sind Daten. Erst wenn jemand sie liest und versteht, werden daraus Informationen. Damit Lina weiß, wann und wo gefeiert wird, müssen die Daten vollständig und eindeutig sein.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 1 – Begriffe Informationen und Daten',
  },
  uebertragung: {
    titel: 'Übertragung braucht Zeit',
    text: 'Dein Brief reiste vom Briefkasten über das Postauto und das Briefzentrum bis zu Linas Briefkasten: 2 Tage und 3 Stunden. Wie lange Daten unterwegs sind, hängt vom Weg und vom Transportmittel ab.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 1 – Übertragungsrate (Einstieg)',
  },
  eva: {
    titel: 'Eingabe – Verarbeitung – Ausgabe',
    text: 'EVA-Prinzip: Eingabegeräte (Kamera, Mikrofon, Taster) nehmen etwas auf, der Prozessor verarbeitet es, Ausgabegeräte (Display, Lautsprecher) geben etwas aus. Damit sich ein Gerät etwas dauerhaft merkt, braucht es einen Speicher.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 2 – EVA-Modell, Erweiterung um Speichern',
  },
  // derzeit ungenutzt (Minispiel entfernt), bleibt wegen der Speichercodes im Register
  betriebssystem: {
    titel: 'Betriebssystem',
    text: 'Das Betriebssystem ist das wichtigste Programm eines Computers. Es verwaltet den Speicher, steuert die Geräte an, ordnet Dateien und startet und beendet Programme. Handys, Laptops und sogar die Brille haben eins.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 2 – Aufgaben des Betriebssystems',
  },
  binaerzahlen: {
    titel: 'Binärzahlen',
    text: 'Computer kennen nur zwei Zustände: an (1) und aus (0). Jede Stelle einer Binärzahl hat einen Wert: 128, 64, 32, 16, 8, 4, 2, 1. Man addiert die Werte, bei denen eine 1 steht: 00101010 = 32 + 8 + 2 = 42. Eine Stelle heißt Bit, acht Bit sind ein Byte.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 1 – Darstellen von Daten als Binärzahlen (Dezimalzahlen)',
  },
  bilder_als_zahlen: {
    titel: 'Bilder als Zahlen',
    text: 'Ein Pixelbild besteht aus vielen kleinen Punkten. Bei einem Schwarz-Weiß-Bild steht jede 1 für einen schwarzen und jede 0 für einen weißen Punkt. So wird aus Zahlen ein Bild – und aus einem Bild werden Zahlen.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 1 – Darstellen von Daten als Binärzahlen (Bild)',
  },
  text_als_zahlen: {
    titel: 'Text als Zahlen',
    text: 'Auch Buchstaben kann man als Zahlen speichern. Man braucht nur eine Tabelle, die jedem Buchstaben eine Zahl zuordnet – im Museum war A = 1, B = 2 und so weiter. Wer die Tabelle kennt, kann den Text zurückübersetzen.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 1 – Darstellen von Daten als Binärzahlen (Text)',
  },
  pioniere: {
    titel: 'Pioniere der Rechentechnik',
    text: 'Schickard (Rechenuhr, 1623), Pascal (Rechenmaschine, 1642), Leibniz (Binärsystem, 1703), Ada Lovelace (erstes Programm, 1843), Alan Turing (Turingmaschine, 1936), Konrad Zuse (Z3, 1941), John von Neumann (Bauplan heutiger Computer, 1945).',
    stufe: 7,
    lehrplan: 'SN Kl. 7 WB 3 – Geschichte der Rechentechnik',
  },
  algorithmus: {
    titel: 'Algorithmus',
    text: 'Eine genaue Schritt-für-Schritt-Anleitung heißt Algorithmus. Krümel führt die Befehle der Reihe nach aus (Sequenz). Ist ein Schritt falsch oder fehlt einer, kommt Krümel nicht ans Ziel – Computer machen genau das, was man ihnen sagt.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 3 – Algorithmen, Umsetzung verbaler Beschreibungen in Blöcke',
  },
  zustandsdiagramm: {
    titel: 'Zustandsdiagramm',
    text: 'Viele Geräte sind immer in einem bestimmten Zustand, z. B. „saugen" oder „laden". Ein Ereignis wie „Akku leer" führt zu einem anderen Zustand. Ein Zustandsdiagramm zeigt die Zustände als Kästen und die Übergänge als Pfeile.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 2 – Zustandsdiagramm, Übergangsgraph',
  },
  farbkanaele: {
    titel: 'Farbkanäle',
    text: 'Ein Farbbild besteht aus drei Kanälen: Rot, Grün und Blau. Fehlt ein Kanal, stimmen die Farben nicht. Ein Negativ vertauscht hell und dunkel. Bei Graustufen hat jeder Punkt nur eine Helligkeit.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 WB 2 – Computergrafik (Farbkanäle, Graustufen, Negativ)',
  },
  einheiten: {
    titel: 'Einheiten: Kilo, Mega, Giga, Tera',
    text: '1 KB = 1.000 Byte, 1 MB = 1.000 KB, 1 GB = 1.000 MB, 1 TB = 1.000 GB. Computer rechnen oft mit Zweierpotenzen: 1 KiB = 1.024 Byte, 1 MiB = 1.024 KiB. Deshalb zeigt ein 64-GB-Stick nur etwa 59,6 GiB an.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 1 – Präfixe, SI- und Binärpräfixe, Speicherkapazität',
  },
  uebertragungsrate: {
    titel: 'Übertragungsrate',
    text: 'Übertragungsrate = Datenmenge ÷ Zeit. Die E-Mail an Tante Ada brauchte 0,8 Sekunden, dein Brief 2 Tage und 3 Stunden. Bei riesigen Datenmengen kann aber sogar eine Taube mit Speicherkarte schneller sein als das Internet!',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 1 – Übertragungsrate',
  },
  dateitypen: {
    titel: 'Dateitypen und Dateinamen',
    text: 'Die Endung zeigt den Dateityp und damit das passende Programm: .docx Textverarbeitung, .xlsx Tabellenkalkulation, .png Bild, .mp3 Musik, .mp4 Video. Gute Dateinamen sagen, was drin ist – „Dorffest_Ablauf.docx" statt „Neues Dokument (7)".',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 2 – Dateityp und Applikation, problemadäquate Dateinamen',
  },
  tabellenkalkulation: {
    titel: 'Tabellenkalkulation',
    text: 'In einer Tabellenkalkulation rechnen Formeln automatisch: =B2*C2 multipliziert zwei Zellen, =SUMME(D2:D5) addiert einen Bereich. Ändert sich ein Wert, rechnet die Tabelle alles neu.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 1 – Automatisierung mit Tabellenkalkulation',
  },
  pixel_vektor: {
    titel: 'Pixel- und Vektorgrafik',
    text: 'Eine Pixelgrafik besteht aus vielen Punkten – vergrößert man sie, sieht man Treppchen. Eine Vektorgrafik speichert Formen (Kreis, Linie, Text) mit ihren Eigenschaften und bleibt in jeder Größe scharf.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 1 – Pixelgrafik, Vektorgrafik, Objektorientierung',
  },
  inhalt_design: {
    titel: 'Inhalt und Design',
    text: 'Auf Linas Plakat blieben Text und Bilder gleich, nur das Aussehen wechselte. Inhalt (was drauf steht) und Design (wie es aussieht) werden getrennt – so kann man das Design ändern, ohne den Inhalt neu zu schreiben.',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 1 – Trennung von Inhalt und Design',
  },
  objekt: {
    titel: 'Objekt und Klasse',
    text: 'Morse ist ein Objekt der Klasse „Katze". Eine Klasse ist der Bauplan, ein Objekt ein konkretes Ding. Objekte haben Attribute mit Werten (Farbe = grau) und Methoden, also Dinge, die sie tun können (miauen()).',
    stufe: 7,
    lehrplan: 'SN Kl. 7 LB 1 – Objektorientierung: Klasse, Objekt, Attribut, Methode',
  },
  // ---------- Kapitel 2 (Klasse 8) ----------
  algorithmus_eigenschaften: {
    titel: 'Was ist ein Algorithmus?',
    text: 'Ein Algorithmus ist eine Anleitung, die ein Problem Schritt für Schritt löst. Sie muss eindeutig sein (jeder Schritt klar), ausführbar (jeder Schritt machbar) und endlich (sie hört irgendwann auf). „Mach was Schönes" ist deshalb kein Algorithmus.',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 1 – Begriff und Eigenschaften von Algorithmen',
  },
  client_server: {
    titel: 'Client und Server',
    text: 'Ein Client stellt Anfragen („Zeig mir den Stundenplan!"), ein Server beantwortet sie und stellt Daten bereit. Ein Server muss kein riesiges Gerät sein: Oft ist er einfach ein Programm, das auf einem Rechner läuft.',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 2 – Vernetzte Systeme (Schulcurriculum: Client-Server)',
  },
  wiederholung: {
    titel: 'Wiederholung (Schleife)',
    text: 'Statt dieselben Befehle immer wieder hinzuschreiben, sagt man: „Wiederhole 4-mal …" (Zählschleife). Eine Schleife mit Bedingung prüft vorher, ob sie weitermachen soll: „Solange vorne frei ist: fahre vor" (kopfgesteuerte Schleife).',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 1 – Zählschleife, kopfgesteuerte Schleife',
  },
  verzweigung: {
    titel: 'Verzweigung',
    text: 'Eine Verzweigung prüft eine Bedingung und entscheidet dann: „Wenn vorne eine Wand ist, dann drehe rechts." So kann ein Programm auf seine Umgebung reagieren, ohne dass man jeden Schritt vorher kennt.',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 1 – Verzweigung',
  },
  funk: {
    titel: 'Kabel oder Funk',
    text: 'Geräte tauschen Datenpakete über Kabel oder über Funk aus. Das WLAN in der Schule sendet Funkwellen in alle Richtungen – je weiter weg, desto schwächer. Handys und Laptops empfangen sie ohne Kabel.',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 2 – Vernetzte Systeme (Schulcurriculum: Kabel und Funk als Einblick)',
  },
  email: {
    titel: 'Eine E-Mail schreiben',
    text: 'Eine E-Mail hat: Empfänger (AN), Kopie (CC, alle sehen alle), Blindkopie (BCC, niemand sieht die anderen Adressen), einen Betreff, den Inhalt und manchmal einen Anhang. Ein guter Betreff ist kurz und sagt, worum es geht.',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 2 – E-Mail: Empfänger, CC, BCC, Betreff, Anhang',
  },
  adressen: {
    titel: 'Adressen im Netz',
    text: 'Adressen müssen eindeutig sein. Eine E-Mail-Adresse hat den Aufbau name@domain.de, eine Webadresse z. B. https://www.knotenburg.de/rathaus. Wie bei der Postanschrift geht es vom Großen ins Kleine: Sie sind hierarchisch aufgebaut.',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 2 – Aufbau von E-Mail- und Webadressen',
  },
  ip_mac: {
    titel: 'IP- und MAC-Adresse',
    text: 'Eine IPv4-Adresse hat vier Zahlen von 0 bis 255 (32 Bit), z. B. 192.168.0.15 – wie Straße und Haus. Die MAC-Adresse gehört fest zur Netzwerkkarte, z. B. 00:1A:2B:3C:4D:5E – wie die Person im Haus. Weil IPv4-Adressen knapp werden, gibt es IPv6.',
    stufe: 8,
    lehrplan: 'Schulcurriculum Kl. 8 – IP- und MAC-Adresse (Einblick)',
  },
  datenpakete: {
    titel: 'Datenpakete',
    text: 'Große Dateien reisen nicht am Stück, sondern in kleinen Paketen. Jedes Paket kennt Absender und Empfänger. Router prüfen die Zieladresse und schicken es weiter – manchmal auf verschiedenen Wegen. Am Ziel wird alles wieder zusammengesetzt.',
    stufe: 8,
    lehrplan: 'Schulcurriculum Kl. 8 – Datenpakete (Einblick)',
  },
  phishing: {
    titel: 'Phishing',
    text: 'Phishing heißt „Passwort-Fischen": Gefälschte Mails oder Webseiten wollen Passwörter oder Kontodaten. Warnzeichen: seltsamer Absender, Link führt woanders hin, Zeitdruck und Drohungen, Anhänge wie „Rechnung.pdf.exe". Nie Passwörter über Links eingeben!',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 2 – Phishing, Authentizität von Nachrichten',
  },
  passwort: {
    titel: 'Sichere Passwörter',
    text: 'Je länger ein Passwort und je mehr verschiedene Zeichen, desto mehr Möglichkeiten gibt es. Ein Fahrradschloss mit 4 Ziffern hat 10 · 10 · 10 · 10 = 10.000. Ein langes Passwort mit Buchstaben, Ziffern und Sonderzeichen hält Jahrmillionen. Für jeden Dienst ein eigenes!',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 2 – Passwortsicherheit',
  },
  brute_force: {
    titel: 'Brute Force',
    text: 'Ein Algorithmus, der einfach alle Möglichkeiten ausprobiert, bis eine passt, heißt Brute Force („rohe Gewalt"). Mit einer Schleife geht das automatisch: 0000, 0001, 0002 … Gegen lange Passwörter braucht er aber viel zu lange.',
    stufe: 8,
    lehrplan: 'Schulcurriculum Kl. 8 – Brute-Force-Algorithmus',
  },
  personenbezogen: {
    titel: 'Personenbezogene Daten',
    text: 'Personenbezogen sind alle Daten, die zu einer bestimmten Person führen: Name, Adresse, E-Mail, Geburtstag, sogar die IP-Adresse. Frag dich: Welche Daten werden gespeichert? Wer kann darauf zugreifen? Welche Risiken entstehen? Gib nur, was wirklich nötig ist.',
    stufe: 8,
    lehrplan: 'Schulcurriculum Kl. 8 – DSGVO, personenbezogene Daten',
  },
  suchmaschinen: {
    titel: 'Suchmaschinen',
    text: 'Gute Suchbegriffe, Anführungszeichen für genaue Wörter, ein Minus zum Ausschließen. Suchmaschinen sortieren nach Sichtbarkeit, nicht nach Wahrheit: Was oben steht, ist oft nur besser optimiert (SEO). Prüfe Impressum, Autor, Datum und Quellen.',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 2 – Suchstrategien, Ranking; Schulcurriculum SEO',
  },
  ki_bilder: {
    titel: 'Echt oder erfunden?',
    text: 'Bilder und Texte lassen sich fälschen – heute auch mit KI. Nicht nur auf Fehler im Bild achten, sondern die Quelle prüfen: Wer hat es veröffentlicht? Gibt es das Original? Berichten verlässliche Stellen darüber?',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 2 – Bildmanipulation, KI-generierte Texte und Bilder',
  },
  metadaten: {
    titel: 'Metadaten',
    text: 'In Fotos und Dateien stecken versteckte Zusatzdaten: Aufnahmegerät, Datum, manchmal Ort oder Autor. Sie können helfen, eine Fälschung zu entlarven – verraten aber auch viel über dich. Vor dem Teilen entfernen!',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 2 – Metadaten',
  },
  kollaboration: {
    titel: 'Gemeinsam arbeiten',
    text: 'Kooperation: Jeder macht einen Teil, am Ende wird zusammengefügt. Kollaboration: Alle arbeiten gleichzeitig am selben Dokument. Damit das klappt, braucht es Regeln für den Umgang im Netz – die Netiquette: freundlich bleiben, nichts Fremdes löschen, absprechen.',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 2 – Kooperation, Kollaboration, Netiquette',
  },
  cybermobbing: {
    titel: 'Cybermobbing',
    text: 'Wer im Netz beleidigt, bloßgestellt oder ausgegrenzt wird, braucht Hilfe. Nicht weiterleiten, nicht mitlachen, Beweise sichern (Screenshot), melden – und eine Vertrauensperson einschalten. Und: Der betroffenen Person zeigen, dass sie nicht allein ist.',
    stufe: 8,
    lehrplan: 'SN Kl. 8 WB 2 – Cybermobbing',
  },
  verschluesselung: {
    titel: 'Verschlüsselung',
    text: 'Aus dem Klartext wird mit einem Schlüssel ein Geheimtext. Bei Caesar verschiebt man jeden Buchstaben um gleich viele Stellen. Problem: Wie bekommt die andere Person den Schlüssel, ohne dass jemand mitliest? Das ist das Schlüsseltauschproblem.',
    stufe: 8,
    lehrplan: 'SN Kl. 8 WB 1 – Caesar; Schulcurriculum Schlüsseltauschproblem',
  },
};

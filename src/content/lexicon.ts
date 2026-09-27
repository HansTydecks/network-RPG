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
  heimnetz: {
    titel: 'Das Heimnetz',
    text: 'Das Modem verbindet mit dem Kabel in der Straße. Der Router verbindet das Heimnetz mit dem Internet. Ein Switch verteilt Kabelverbindungen im Haus, ein Accesspoint funkt das WLAN. Oft steckt alles in einer Kiste.',
    stufe: 9,
    lehrplan: 'SN Kl. 9 LB 3 – Router, Switch, Accesspoint, Modem',
  },
  pan_lan_wan: {
    titel: 'PAN, LAN, WAN',
    text: 'PAN: dein persönliches Netz, z. B. Kopfhörer und Handy. LAN: das lokale Netz im Haus oder in der Schule. WAN: das weite Netz über Städte und Länder – das Internet ist das größte WAN.',
    stufe: 9,
    lehrplan: 'SN Kl. 9 LB 3 – PAN, LAN, WAN',
  },
  zwei_faktor: {
    titel: 'Zwei-Faktor-Anmeldung',
    text: 'Bei der Zwei-Faktor-Authentifizierung braucht man zwei verschiedene Dinge: etwas, das man weiß (Passwort), und etwas, das man hat (Handy mit Code). Ein gestohlenes Passwort allein reicht dann nicht.',
    stufe: 9,
    lehrplan: 'SN Kl. 9 LB 3 – Zwei-Faktor-Authentifizierung',
  },
  tcp_ip: {
    titel: 'Pakete mit Nummern',
    text: 'Daten werden in nummerierte Pakete zerlegt. IP sorgt dafür, dass jedes Paket seinen Weg findet. TCP prüft am Ziel, ob alle da sind, sortiert sie nach Nummer und fordert fehlende Pakete neu an.',
    stufe: 9,
    lehrplan: 'SN Kl. 9 LB 3 – Datenpakete, TCP/IP',
  },
  routing: {
    titel: 'Routing',
    text: 'Router lesen die Zieladresse eines Pakets und schauen in ihrer Tabelle nach, auf welcher Leitung es weitergeht. So hüpft ein Paket von Router zu Router, bis es am Ziel ist.',
    stufe: 9,
    lehrplan: 'SN Kl. 9 LB 3 – Routing',
  },
  p2p: {
    titel: 'Peer-to-Peer',
    text: 'Beim Client-Server-Modell holen alle ihre Daten von einem Server. Bei Peer-to-Peer (P2P) sind alle gleichberechtigt: Jeder gibt weiter, was er schon hat. Fällt ein Gerät aus, geht es trotzdem weiter.',
    stufe: 9,
    lehrplan: 'SN Kl. 9 LB 3 – Peer-to-Peer vs. Client-Server',
  },
  protokolle: {
    titel: 'Protokolle',
    text: 'Protokolle sind Regeln für die Verständigung. SMTP verschickt E-Mails, IMAP holt sie ins Postfach, HTTP lädt Webseiten. HTTPS ist die verschlüsselte Variante: wie ein zugeklebter Brief statt einer Postkarte.',
    stufe: 9,
    lehrplan: 'SN Kl. 9 LB 3 – SMTP, IMAP, HTTP(S)',
  },
  asymmetrisch: {
    titel: 'Symmetrisch und asymmetrisch',
    text: 'Symmetrisch: Beide haben denselben Schlüssel (wie bei Caesar) – aber wie tauscht man ihn sicher aus? Asymmetrisch: Jeder hat ein Schlüsselpaar. Mit dem öffentlichen Schlüssel schließt man zu, nur der private öffnet.',
    stufe: 9,
    lehrplan: 'SN Kl. 9 LB 3 – symmetrische und asymmetrische Verschlüsselung, Schlüsseltausch',
  },
  datenbank: {
    titel: 'Datenbanken',
    text: 'Eine Datenbank speichert Daten geordnet in Tabellen: Jede Zeile ist ein Datensatz, jede Spalte ein Attribut. Ein Datenbanksystem hilft beim Suchen, Einfügen, Ändern und Löschen.',
    stufe: 9,
    lehrplan: 'SN Kl. 9 LB 1 – Datenbanksystem, Tabellen, Datensätze',
  },
  sql: {
    titel: 'Abfragen',
    text: 'Mit Abfragen holt man genau das, was man braucht: Spalten auswählen, Zeilen filtern („wo Ort = Kabelitz"), zählen (COUNT), gruppieren (GROUP BY) und Tabellen über gemeinsame Werte verbinden (JOIN).',
    stufe: 9,
    lehrplan: 'SN Kl. 9 LB 1 – Abfragen, Aggregatfunktionen, Verbund',
  },
  big_data: {
    titel: 'Big Data',
    text: 'Wenn riesige Datenmengen zusammengeführt werden, lässt sich viel über Menschen herausfinden – manchmal mehr, als sie wollen. Deshalb gelten Regeln: Nur mit Erlaubnis, nur für einen Zweck, Persönlichkeitsrechte achten.',
    stufe: 9,
    lehrplan: 'SN Kl. 9 LB 1 – Big Data, Persönlichkeitsrechte',
  },
  ki_lernen: {
    titel: 'Wie Maschinen lernen',
    text: 'Überwacht: aus Beispielen mit richtiger Antwort. Unüberwacht: Muster in Daten ohne Antworten finden. Bestärkend: durch Belohnung und Versuch. Wichtig: Eine KI ist nur so gut wie ihre Daten.',
    stufe: 9,
    lehrplan: 'SN Kl. 9 LB 2 – überwachtes, unüberwachtes, bestärkendes Lernen',
  },
  uebertragungsmedien: {
    titel: 'Kupfer, Glas, Funk',
    text: 'Kupferkabel leiten Strom, Glasfasern leiten Licht – schneller und über weite Strecken. Funk braucht kein Kabel, wird aber durch Wände und Entfernung schwächer.',
    stufe: 9,
    lehrplan: 'SN Kl. 9 LB 3 – Übertragungsmedien',
  },
  switch_router: {
    titel: 'Switch und Router',
    text: 'Ein Switch verbindet Geräte innerhalb eines Netzes und nutzt dafür MAC-Adressen. Ein Router verbindet verschiedene Netze miteinander und arbeitet mit IP-Adressen.',
    stufe: 9,
    lehrplan: 'SN Kl. 9 LB 3 – Switch, Router',
  },
  dns: {
    titel: 'Namensauflösung (DNS)',
    text: 'Computer finden sich über Zahlen (IP-Adressen), Menschen merken sich Namen. DNS ist wie ein Telefonbuch: Es übersetzt knotenbank.de in eine IP-Adresse. Wer das Telefonbuch fälscht, schickt alle an die falsche Adresse.',
    stufe: 9,
    lehrplan: 'SN Kl. 9 LB 3 – DNS als Namensauflösung',
  },
  nachhaltigkeit: {
    titel: 'Rechenzentren und Energie',
    text: 'Rechenzentren brauchen viel Strom und werden heiß. Im Silberstollen kühlt die Stollenluft, und die Abwärme heizt das Freibad im Tal. Jede Suche, jedes Video kostet Energie.',
    stufe: 9,
    lehrplan: 'SN Kl. 9 LB 3 – Nachhaltigkeit',
  },
  datentypen: {
    titel: 'Datentypen und Variablen',
    text: 'Eine Variable ist ein benannter Speicherplatz: abstand = 12. Der Wert hat einen Datentyp: Zahl (12), Zeichenkette ("Küche") oder Wahrheitswert (wahr/falsch). Mit dem falschen Typ rechnen führt zu Fehlern.',
    stufe: 10,
    lehrplan: 'SN Kl. 10 LB 1 – Datentypen, Variablen, Wertzuweisung',
  },
  bedingungen: {
    titel: 'Verknüpfte Bedingungen',
    text: 'Mit „und" müssen beide Teile wahr sein, mit „oder" reicht einer. „wenn ampel == \"rot\" oder fussgaenger:" bremst also bei roter Ampel UND auch, wenn jemand auf der Straße ist.',
    stufe: 10,
    lehrplan: 'SN Kl. 10 LB 1 – verknüpfte Bedingungen',
  },
  unterprogramme: {
    titel: 'Unterprogramme',
    text: 'Ein Unterprogramm (Funktion) bündelt Befehle unter einem Namen: def umfahre_hindernis(): … Einmal geschrieben, kann man es immer wieder aufrufen. Das macht Programme kürzer und übersichtlicher.',
    stufe: 10,
    lehrplan: 'SN Kl. 10 LB 1 – Unterprogramme',
  },
  fehlermeldungen: {
    titel: 'Fehlermeldungen lesen',
    text: 'Fehlermeldungen sind Hinweise, keine Strafe: Sie nennen die Zeile und oft die Ursache, z. B. einen Tippfehler im Befehl. Syntaxfehler findet der Computer, Denkfehler (die Semantik) muss man selbst finden.',
    stufe: 10,
    lehrplan: 'SN Kl. 10 LB 1 – Fehlermeldungen; LB 2 Syntax und Semantik',
  },
  robotik: {
    titel: 'Sensoren und Aktoren',
    text: 'Sensoren nehmen die Umgebung wahr (Abstandssensor, Kamera, Taster). Aktoren bewegen etwas oder geben etwas aus (Motor, Lampe, Lautsprecher). Dazwischen entscheidet das Programm.',
    stufe: 10,
    lehrplan: 'SN Kl. 10 WB 3 – Robotik: Sensoren, Aktoren',
  },
  html: {
    titel: 'HTML',
    text: 'HTML beschreibt die Struktur einer Webseite mit Tags: <h1> Überschrift, <ul>/<li> Liste, <table> Tabelle, <img> Bild, <a href="…"> Link. Der Browser macht daraus die Seite, die man sieht.',
    stufe: 10,
    lehrplan: 'SN Kl. 10 LB 2 – HTML-Grundstruktur',
  },
  barrierefreiheit: {
    titel: 'Barrierefreiheit',
    text: 'Webseiten sollen alle nutzen können. Blinde Menschen lassen sich Seiten vorlesen (Screenreader). Dafür brauchen Bilder einen Alternativtext (alt="…") und Überschriften eine sinnvolle Ordnung.',
    stufe: 10,
    lehrplan: 'SN Kl. 10 LB 2 – Barrierefreiheit',
  },
  css: {
    titel: 'CSS: Inhalt und Design',
    text: 'HTML sagt, WAS auf der Seite steht. CSS sagt, WIE es aussieht: Farben, Schriften, Abstände. So kann man das Design ändern, ohne den Inhalt anzufassen – wie bei Linas Plakat.',
    stufe: 10,
    lehrplan: 'SN Kl. 10 LB 2 – CSS, Trennung von Inhalt und Gestaltung',
  },
  regex: {
    titel: 'Reguläre Ausdrücke',
    text: 'Ein regulärer Ausdruck ist ein Suchmuster: \\d steht für eine Ziffer, {5} für genau fünfmal, . für ein beliebiges Zeichen. So findet oder prüft man z. B. Postleitzahlen: ^\\d{5}$ passt auf 09421, aber nicht auf 9421.',
    stufe: 10,
    lehrplan: 'SN Kl. 10 LB 2 – reguläre Ausdrücke: Suchen, Ersetzen, Validieren',
  },
  syntax_semantik: {
    titel: 'Syntax und Semantik',
    text: 'Syntax: Ist etwas richtig geschrieben (nach den Regeln der Sprache)? Semantik: Was bedeutet es, und tut es das Richtige? Ein Satz kann grammatisch korrekt und trotzdem Unsinn sein.',
    stufe: 10,
    lehrplan: 'SN Kl. 10 LB 2 – Syntax und Semantik',
  },
  client_server_dienst: {
    titel: 'Ein eigener Dienst',
    text: 'Beim Nachbarschafts-Chat schicken Clients Nachrichten an den Server, der Server speichert sie und verteilt sie an alle anderen. Ein Chat-Bot antwortet nach festen Wenn-dann-Regeln auf häufige Fragen.',
    stufe: 10,
    lehrplan: 'SN Kl. 10 LB 3 – Client-Server-Dienst, Chat-Bot',
  },
  suchen_sortieren: {
    titel: 'Suchen und Sortieren',
    text: 'Lineare Suche prüft eins nach dem anderen. Binäre Suche halbiert bei sortierten Daten jedes Mal den Bereich: Bei 1.000 Namen reichen etwa 10 Schritte. Deshalb lohnt sich Sortieren!',
    stufe: 10,
    lehrplan: 'SN Kl. 10 LB 3 – Suchen und Sortieren',
  },
  maschinen_entscheiden: {
    titel: 'Maschinen entscheiden',
    text: 'Programme entscheiden nach Regeln – im Stadtbus genauso wie bei der Gesichtserkennung. Sie können sich irren. Wichtig ist: Wer trägt die Verantwortung, und wie oft liegt die Maschine falsch?',
    stufe: 10,
    lehrplan: 'SN Kl. 10 LB 1 – maschinelle Entscheidungen',
  },
  zeitabhaengige_medien: {
    titel: 'Ton und Video als Daten',
    text: 'Ton wird viele tausend Mal pro Sekunde gemessen (Abtastrate), ein Video besteht aus vielen Einzelbildern (Frames). Mit diesen Zahlen kann man rechnen: Tonhöhe ändern, verzerren – oder eine Verzerrung rückgängig machen.',
    stufe: 10,
    lehrplan: 'SN Kl. 10 WB 2 – zeitabhängige Medien',
  },
};

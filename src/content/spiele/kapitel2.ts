import type { SpielDef } from '../../minigames/defs';
import { zuordnen } from '../../minigames/generischLogic';

/** Minispiele Kapitel 2 (Klasse 8), M3b und M3c. */
export const KAPITEL2_SPIELE: Record<string, SpielDef> = {
  // ---------- M3b ----------
  mailwerkstatt: {
    art: 'quiz',
    titel: 'Die Mail-Werkstatt',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 2 – E-Mail: AN, CC, BCC, Betreff, Anhang',
    intro: 'Herr Work will alle Eltern vor den Phishing-Mails warnen. Hilf beim Schreiben!',
    schluss: 'Die Warn-Mail ist unterwegs – an alle Eltern, ohne dass jemand fremde Adressen sieht. (Leertaste)',
    fragen: [
      {
        frage: 'Die Mail geht an die Schulleiterin Frau Kühn. Wohin kommt ihre Adresse?',
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: 'AN', ok: true, erklaerung: 'Frau Kühn ist die Hauptempfängerin: AN.' },
          { text: 'CC', ok: false, erklaerung: 'CC ist für Leute, die nur mitlesen sollen. Frau Kühn ist aber die Hauptempfängerin.' },
          { text: 'BCC', ok: false, erklaerung: 'BCC ist eine Blindkopie. Frau Kühn soll die Mail ganz normal bekommen.' },
        ],
      },
      {
        frage: 'Herr Work möchte offen zeigen, dass die Klassenlehrerin informiert ist.',
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: 'AN', ok: false, erklaerung: 'Sie soll nur mitlesen, nicht antworten müssen. Dafür gibt es die Kopie.' },
          { text: 'CC', ok: true, erklaerung: 'CC = Kopie. Alle sehen, dass sie die Mail auch bekommen hat.' },
          { text: 'BCC', ok: false, erklaerung: 'Bei BCC würde niemand sehen, dass sie informiert ist.' },
        ],
      },
      {
        frage: 'Und die 300 Eltern-Adressen?',
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: 'AN', ok: false, erklaerung: 'Dann sähe jede Familie alle 300 Adressen – das geht niemanden etwas an!' },
          { text: 'CC', ok: false, erklaerung: 'Auch bei CC sieht jeder alle Adressen. Datenschutz!' },
          { text: 'BCC', ok: true, erklaerung: 'Genau! Bei BCC sieht niemand die anderen Adressen. So bleiben sie geschützt.' },
        ],
      },
      {
        frage: 'Welcher Betreff passt am besten?',
        optionen: [
          { text: '„Wichtig!!!"', ok: false, erklaerung: 'Da weiß niemand, worum es geht. Und es sieht selbst nach Spam aus.' },
          { text: '„Warnung: gefälschte KnotenNetz-Mails"', ok: true, erklaerung: 'Kurz und klar: Man weiß sofort, worum es geht.' },
          { text: '„Hallo"', ok: false, erklaerung: 'Ein Betreff soll sagen, worum es in der Mail geht.' },
        ],
      },
      {
        frage: 'Herr Work hängt ein Merkblatt an. Was ist ein Anhang?',
        optionen: [
          { text: 'Eine Datei, die mit der Mail mitgeschickt wird', ok: true, erklaerung: 'Zum Beispiel ein PDF. Vorsicht bei Anhängen von Fremden!' },
          { text: 'Die Unterschrift unter der Mail', ok: false, erklaerung: 'Die Unterschrift ist Teil des Inhalts. Ein Anhang ist eine mitgeschickte Datei.' },
          { text: 'Die Adresse des Absenders', ok: false, erklaerung: 'Die steht im Feld „Von". Ein Anhang ist eine Datei.' },
        ],
      },
    ],
  },
  adressen: {
    art: 'quiz',
    titel: 'Der Adress-Zerleger',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 2 – Aufbau von E-Mail- und Webadressen',
    intro: 'Woher weiß eine E-Mail, wo sie hin muss? Zuerst schauen wir uns die Adressen genau an.',
    schluss: 'Adressen sind eindeutig und hierarchisch – genau wie deine Postanschrift aus dem Brief an Lina. (Leertaste)',
    fragen: [
      {
        frage: 'alex.b@gym-knotenburg.de – was steht hinter dem @?',
        optionen: [
          { text: 'Die Domain des Mailanbieters', ok: true, erklaerung: 'Hinter dem @ steht die Domain: Dort liegt das Postfach.' },
          { text: 'Der Name der Person', ok: false, erklaerung: 'Der Name steht vor dem @.' },
          { text: 'Das Passwort', ok: false, erklaerung: 'Passwörter stehen nie in einer Adresse!' },
        ],
      },
      {
        frage: 'https://www.knotenburg.de/rathaus/termine.html – wofür steht „knotenburg.de"?',
        optionen: [
          { text: 'Für die Domain der Webseite', ok: true, erklaerung: 'Die Domain sagt, wo die Seite liegt. Danach kommt der Pfad zur einzelnen Seite.' },
          { text: 'Für die einzelne Seite', ok: false, erklaerung: 'Die einzelne Seite ist „termine.html" im Ordner „rathaus".' },
          { text: 'Für die Verschlüsselung', ok: false, erklaerung: 'Dass die Verbindung gesichert ist, zeigt „https" am Anfang.' },
        ],
      },
      {
        frage: 'Was bedeutet „.de" am Ende?',
        optionen: [
          { text: 'Die Seite gehört zum deutschen Bereich', ok: true, erklaerung: '.de ist die Endung für Deutschland. Andere sind .at, .fr oder .com.' },
          { text: 'Die Seite ist ganz neu', ok: false, erklaerung: '.de hat nichts mit dem Alter zu tun, es steht für Deutschland.' },
          { text: 'Die Seite ist sicher', ok: false, erklaerung: 'Die Endung sagt nichts über Sicherheit.' },
        ],
      },
      {
        frage: 'Die Briefadresse lautete: Name, Straße, PLZ, Ort. Was haben Brief- und E-Mail-Adresse gemeinsam?',
        optionen: [
          { text: 'Sie sind eindeutig und vom Großen ins Kleine aufgebaut', ok: true, erklaerung: 'Genau: Jede Adresse gibt es nur einmal, und sie ist hierarchisch aufgebaut.' },
          { text: 'Beide brauchen eine Briefmarke', ok: false, erklaerung: 'Für E-Mails braucht man keine Briefmarke!' },
          { text: 'Gar nichts', ok: false, erklaerung: 'Überleg mal: Kann es dieselbe Adresse zweimal geben?' },
        ],
      },
    ],
  },
  ipmac: {
    art: 'quiz',
    titel: 'IP- und MAC-Adresse',
    stufe: 8,
    lehrplan: 'Schulcurriculum Kl. 8 – IP- und MAC-Adresse, IPv6 (Einblick)',
    intro: 'Herr Work tippt „ipconfig" ein. Auf dem Bildschirm: IPv4-Adresse 192.168.0.15, Physische Adresse 00-1A-2B-3C-4D-5E.',
    schluss: 'IP-Adresse = Straße und Haus, MAC-Adresse = die Person im Haus. Zusammen finden die Daten ans Ziel. (Leertaste)',
    fragen: [
      {
        frage: 'Eine IPv4-Adresse hat vier Zahlen. Welche Werte kann jede Zahl haben?',
        optionen: [
          { text: '0 bis 255', ok: true, erklaerung: 'Jede Zahl hat 8 Bit – wie deine Binär-Karte: 0 bis 255. Zusammen 32 Bit.' },
          { text: '0 bis 999', ok: false, erklaerung: 'Denk an deine Binär-Karte: 8 Bit reichen bis 255.' },
          { text: '1 bis 100', ok: false, erklaerung: 'Jede Zahl besteht aus 8 Bit. Wie weit kommst du mit der Binär-Karte?' },
        ],
      },
      {
        frage: 'Ist 192.168.0.300 eine gültige IPv4-Adresse?',
        optionen: [
          { text: 'Nein, 300 ist zu groß', ok: true, erklaerung: 'Genau! Mehr als 255 geht mit 8 Bit nicht.' },
          { text: 'Ja', ok: false, erklaerung: 'Schau dir die letzte Zahl an. Passt 300 in 8 Bit?' },
        ],
      },
      {
        frage: 'Wie viele IPv4-Adressen gibt es ungefähr? (32 Bit: 2 hoch 32)',
        optionen: [
          { text: 'Etwa 4,3 Milliarden', ok: true, erklaerung: 'Richtig. Klingt viel – aber es gibt mehr Geräte als Adressen. Deshalb gibt es IPv6.' },
          { text: 'Etwa 1.000', ok: false, erklaerung: 'Viel mehr! 2 hoch 32 ist eine riesige Zahl.' },
          { text: 'Unendlich viele', ok: false, erklaerung: 'Mit 32 Bit gibt es eine feste Anzahl: 2 hoch 32.' },
        ],
      },
      {
        frage: 'Adressen, die mit 192.168 beginnen, sind …',
        optionen: [
          { text: 'private Adressen im Heim- oder Schulnetz', ok: true, erklaerung: 'Sie gelten nur im eigenen Netz. Der Router hat zusätzlich eine öffentliche Adresse.' },
          { text: 'öffentliche Adressen im ganzen Internet', ok: false, erklaerung: '192.168-Adressen gibt es in fast jedem Heimnetz – sie sind privat.' },
        ],
      },
      {
        frage: '00:1A:2B:3C:4D:5E ist eine MAC-Adresse. Wer vergibt sie?',
        optionen: [
          { text: 'Der Hersteller der Netzwerkkarte', ok: true, erklaerung: 'Sie steckt fest in der Netzwerkkarte. Die ersten Stellen verraten den Hersteller.' },
          { text: 'Die Lehrkraft', ok: false, erklaerung: 'Die MAC-Adresse ist schon ab Werk in der Netzwerkkarte gespeichert.' },
          { text: 'Man denkt sie sich selbst aus', ok: false, erklaerung: 'Dann gäbe es sie doppelt. Sie kommt vom Hersteller.' },
        ],
      },
    ],
  },
  pakete: {
    art: 'reihenfolge',
    titel: 'Ein Foto reist zu Lina',
    stufe: 8,
    lehrplan: 'Schulcurriculum Kl. 8 – Datenpakete (Einblick)',
    aufgabe: {
      titel: 'Ein Foto reist zu Lina',
      intro: 'Mit der Brille v2 siehst du, wie dein Foto verschickt wird. Bring die Schritte in die richtige Reihenfolge!',
      schritte: [
        'Das Foto wird in viele kleine Pakete zerlegt.',
        'Jedes Paket bekommt Absender und Empfänger.',
        'Die Pakete reisen los, auch auf verschiedenen Wegen.',
        'Router lesen die Zieladresse und leiten weiter.',
        'Linas Handy setzt die Pakete wieder zusammen.',
      ],
      hinweise: ['Zuerst muss das große Foto kleiner werden.', 'Wohin soll jedes Paket? Das muss draufstehen, bevor es losgeht.'],
      schluss: 'Das Foto ist angekommen! Datenpakete machen das Netz flexibel: Fällt ein Weg aus, nehmen sie einen anderen. (Leertaste)',
    },
  },
  phishing: {
    art: 'quiz',
    titel: 'Phishing-Detektiv',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 2 – Phishing, Authentizität von Nachrichten',
    intro: 'Mit der Echtheits-Lupe siehst du den echten Absender und das echte Linkziel. Phishing oder echt?',
    schluss: 'Absender, Link, Zeitdruck, komische Anhänge – du erkennst Phishing! (Leertaste)',
    fragen: zuordnen('Phishing oder echt?', ['Phishing', 'Echt'], [
      { text: 'Von: service@knotennetz.de.konto-check.info – „Ihr Konto wird in 24 Stunden gesperrt!"', kategorie: 0, warum: 'Die Adresse endet nicht auf knotennetz.de, und Drohung mit Zeitdruck ist typisch für Phishing.' },
      { text: 'Von: bibliothek@knotenburg.de – „Deine Bücher sind am Freitag fällig."', kategorie: 1, warum: 'Richtige Adresse, kein Link, kein Druck, keine Passwortabfrage – ganz normal.' },
      { text: 'Anhang: Rechnung.pdf.exe – „Bitte sofort öffnen!"', kategorie: 0, warum: '.exe ist ein Programm, kein PDF. So kommt Schadsoftware auf den Rechner.' },
      { text: '„Sie haben ein Handy gewonnen! Klicken Sie hier und geben Sie Ihr Passwort ein."', kategorie: 0, warum: 'Niemand verschenkt einfach Handys – und nach dem Passwort fragt kein seriöser Dienst.' },
      { text: 'Von: work@gym-knotenburg.de – „Morgen fällt Informatik in Raum 12 aus, wir sind in Raum 8."', kategorie: 1, warum: 'Echte Schuladresse, sinnvolle Info, keine Forderung. Das ist echt.' },
      { text: 'Link-Text: www.knotenbank.de – die Lupe zeigt: www.knotenbank-login.ru', kategorie: 0, warum: 'Der Text sagt etwas anderes als das echte Ziel. Klassischer Trick!' },
    ]),
  },
  fahrradschloss: {
    art: 'quiz',
    titel: 'Das Fahrradschloss',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 2 – Passwortsicherheit (Kombinationen)',
    intro: 'Frau Schulz: „Wie sicher ist eigentlich so ein Zahlenschloss?"',
    schluss: 'Jede zusätzliche Stelle vervielfacht die Möglichkeiten. Darum sind lange Passwörter so stark. (Leertaste)',
    fragen: [
      {
        frage: 'Ein Fahrradschloss hat 4 Stellen mit je 10 Ziffern. Wie viele Kombinationen?',
        optionen: [
          { text: '40', ok: false, erklaerung: 'Nicht addieren! Für jede Stelle gibt es 10 Möglichkeiten: 10 · 10 · 10 · 10.' },
          { text: '10.000', ok: true, erklaerung: '10 · 10 · 10 · 10 = 10.000. Ein Dieb bräuchte im Schnitt 5.000 Versuche.' },
          { text: '1.000', ok: false, erklaerung: 'Das wären 3 Stellen. Bei 4 Stellen: 10 · 10 · 10 · 10.' },
        ],
      },
      {
        frage: 'Eine Stelle mehr – 5 Ziffern. Wie viele Kombinationen jetzt?',
        optionen: [
          { text: '10.001', ok: false, erklaerung: 'Eine Stelle mehr heißt: alles mal 10.' },
          { text: '100.000', ok: true, erklaerung: 'Zehnmal so viele! Jede Stelle multipliziert.' },
          { text: '50.000', ok: false, erklaerung: 'Jede neue Stelle hat 10 Möglichkeiten: 10.000 · 10.' },
        ],
      },
      {
        frage: 'Statt Ziffern 26 Buchstaben, 4 Stellen: 26 · 26 · 26 · 26. Sicherer als 4 Ziffern?',
        optionen: [
          { text: 'Ja, viel sicherer', ok: true, erklaerung: '26 hoch 4 = 456.976 – fast 46-mal so viele wie 10.000.' },
          { text: 'Nein, gleich sicher', ok: false, erklaerung: 'Mehr verschiedene Zeichen pro Stelle bedeuten mehr Möglichkeiten.' },
        ],
      },
    ],
  },
  passwort: {
    art: 'passwort',
    titel: 'Passwort-Schmiede',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 2 – Passwortsicherheit; Schulcurriculum Brute Force',
  },
  bruteforce: {
    art: 'reihenfolge',
    titel: 'So arbeitet ein Brute-Force-Bot',
    stufe: 8,
    lehrplan: 'Schulcurriculum Kl. 8 – Brute-Force-Algorithmus mit Kontrollstrukturen',
    aufgabe: {
      titel: 'So arbeitet ein Brute-Force-Bot',
      intro: 'Frau Schulz zeigt dir das Protokoll von FUNKSTILLEs Bot. Welcher Algorithmus steckt dahinter?',
      schritte: ['Setze die Zahl auf 0000.', 'Probiere die Zahl als Passwort aus.', 'Wenn das Schloss aufgeht: fertig!', 'Sonst: nimm die nächste Zahl.', 'Wiederhole ab „Probiere …".'],
      hinweise: ['Womit fängt der Bot an?', 'Erst ausprobieren, dann prüfen.'],
      schluss: 'Das ist Brute Force: alles ausprobieren – mit Verzweigung und Schleife. Gegen lange Passwörter hat er keine Chance. (Leertaste)',
    },
  },
  pizza: {
    art: 'quiz',
    titel: 'Pizza Pino und die Datenkrake',
    stufe: 8,
    lehrplan: 'Schulcurriculum Kl. 8 – personenbezogene Daten, DSGVO',
    intro: 'Pinos neue App fragt ganz schön viel. Welche Daten braucht ein Pizzadienst wirklich?',
    schluss: 'Weniger Daten, weniger Risiko: Was nicht gespeichert wird, kann auch nicht gestohlen werden. (Leertaste)',
    fragen: [
      ...zuordnen('Braucht Pino diese Angabe für die Lieferung?', ['Nötig', 'Unnötig'], [
        { text: 'Lieferadresse', kategorie: 0, warum: 'Ohne Adresse kommt die Pizza nicht an.' },
        { text: 'Krankenkasse', kategorie: 1, warum: 'Was hat die Krankenkasse mit Pizza zu tun? Gar nichts!' },
        { text: 'Alle Kontakte aus dem Handy', kategorie: 1, warum: 'Die Kontakte deiner Freunde gehen Pino nichts an.' },
        { text: 'Telefonnummer für Rückfragen', kategorie: 0, warum: 'Damit der Fahrer anrufen kann, wenn er die Klingel nicht findet – sinnvoll.' },
        { text: 'Geburtsdatum', kategorie: 1, warum: 'Für eine Pizza braucht man kein Geburtsdatum.' },
      ]),
      {
        frage: 'Welche dieser Angaben sind personenbezogene Daten?',
        optionen: [
          { text: 'Name, Adresse, E-Mail und sogar die IP-Adresse', ok: true, erklaerung: 'All das führt zu einer bestimmten Person – also personenbezogen nach DSGVO.' },
          { text: 'Nur der Name', ok: false, erklaerung: 'Auch Adresse, E-Mail und IP-Adresse führen zu einer Person.' },
          { text: 'Die Lieblingspizza „Hawaii"', ok: false, erklaerung: 'Allein verrät das nicht, wer du bist – zusammen mit deinem Namen aber schon!' },
        ],
      },
    ],
  },
  // ---------- M3c ----------
  suche: {
    art: 'quiz',
    titel: 'Ranking gegen Wahrheit',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 2 – Suchstrategien, Ranking; Schulcurriculum SEO',
    intro: 'Frau Weber: „Suchen will gelernt sein. Und was oben steht, muss nicht stimmen!"',
    schluss: 'Suchmaschinen bewerten Sichtbarkeit, nicht Wahrheit. Quellen prüfen! (Leertaste)',
    fragen: [
      {
        frage: 'Du suchst genau den Satz „Rathaus Knotenburg Brand". Was hilft?',
        optionen: [
          { text: 'Den Satz in Anführungszeichen setzen', ok: true, erklaerung: 'Mit Anführungszeichen sucht die Suchmaschine genau diese Wortfolge.' },
          { text: 'Alles großschreiben', ok: false, erklaerung: 'Groß- und Kleinschreibung ist Suchmaschinen meist egal.' },
          { text: 'Möglichst viele Ausrufezeichen', ok: false, erklaerung: 'Ausrufezeichen helfen der Suche nicht.' },
        ],
      },
      {
        frage: 'Du willst Ergebnisse ohne das Wort „Werbung". Was tippst du?',
        optionen: [
          { text: 'Rathaus Knotenburg -Werbung', ok: true, erklaerung: 'Das Minus schließt ein Wort aus.' },
          { text: 'Rathaus Knotenburg +Werbung', ok: false, erklaerung: 'Mit Plus würdest du das Wort eher erzwingen. Ausschließen geht mit Minus.' },
          { text: 'Rathaus Knotenburg Werbung?', ok: false, erklaerung: 'Das Fragezeichen schließt nichts aus.' },
        ],
      },
      {
        frage: 'Ganz oben steht der Blog „5 Gründe, warum WLAN Tauben verwirrt". Ist er deshalb glaubwürdig?',
        optionen: [
          { text: 'Nein, oben heißt nur: gut gefunden', ok: true, erklaerung: 'Das Ranking hängt von Sichtbarkeit und Optimierung ab (SEO), nicht von Wahrheit.' },
          { text: 'Ja, sonst stünde er nicht oben', ok: false, erklaerung: 'Leider nein: Wer seine Seite gut optimiert, landet oben – egal ob es stimmt.' },
        ],
      },
      {
        frage: 'Woran erkennst du eher eine verlässliche Seite?',
        optionen: [
          { text: 'Impressum, Autor, Datum und Quellen', ok: true, erklaerung: 'Wer schreibt, wann, und woher stammen die Infos? Das kannst du prüfen.' },
          { text: 'Viele bunte Bilder', ok: false, erklaerung: 'Bilder sagen nichts darüber, ob etwas stimmt.' },
          { text: 'Viele Likes', ok: false, erklaerung: 'Auch Falsches kann viele Likes bekommen.' },
        ],
      },
    ],
  },
  bilddetektiv: {
    art: 'quiz',
    titel: 'Bild-Detektiv',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 2 – Bildmanipulation, KI-generierte Texte und Bilder',
    intro: 'Das Foto „Rathaus Knotenburg in Flammen!" geht herum. Echt oder gefälscht?',
    schluss: 'Das Foto war gefälscht. Am sichersten entlarvt man Fälschungen über die Quelle. (Leertaste)',
    fragen: [
      {
        frage: 'Auf dem Foto hat eine Person sechs Finger, und die Schatten zeigen in verschiedene Richtungen. Was heißt das?',
        optionen: [
          { text: 'Das Bild ist wahrscheinlich bearbeitet oder mit KI erzeugt', ok: true, erklaerung: 'Solche Fehler passieren oft bei gefälschten Bildern. Aber Achtung: Gute Fälschungen haben keine Fehler mehr.' },
          { text: 'Das beweist, dass es echt ist', ok: false, erklaerung: 'Im Gegenteil: Solche Fehler sind Hinweise auf eine Fälschung.' },
        ],
      },
      {
        frage: 'Was ist der beste Weg, das Foto zu prüfen?',
        optionen: [
          { text: 'Nach dem Original und der Quelle suchen', ok: true, erklaerung: 'Im Stadtarchiv liegt das Originalfoto: Das Rathaus steht – ganz ohne Flammen.' },
          { text: 'Die Kommentare lesen', ok: false, erklaerung: 'Kommentare können genauso falsch sein wie das Bild.' },
          { text: 'Schauen, wie oft es geteilt wurde', ok: false, erklaerung: 'Auch Fälschungen werden oft geteilt.' },
        ],
      },
      {
        frage: 'Ein Text klingt perfekt, wurde aber von einer KI geschrieben. Was ist das Problem?',
        optionen: [
          { text: 'Er kann falsch sein, obwohl er überzeugend klingt', ok: true, erklaerung: 'KI-Texte klingen oft sicher – ob sie stimmen, muss man trotzdem prüfen.' },
          { text: 'Es gibt keins, KI irrt sich nie', ok: false, erklaerung: 'KI kann sich irren und sogar Dinge erfinden.' },
        ],
      },
    ],
  },
  metadaten: {
    art: 'quiz',
    titel: 'Versteckte Daten im Foto',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 2 – Metadaten',
    intro: 'Frau Weber öffnet die Dateiinfo des Fotos: Gerät „Scanner FotoFix 2000", Autor „W.L.", erstellt 03:12 Uhr.',
    schluss: 'Metadaten können Täter verraten – aber auch dich. Vor dem Posten entfernen! (Leertaste)',
    fragen: [
      {
        frage: 'Was sind Metadaten?',
        optionen: [
          { text: 'Zusatzdaten über eine Datei, z. B. Gerät, Datum, Autor', ok: true, erklaerung: 'Man sieht sie nicht im Bild, aber sie sind in der Datei gespeichert.' },
          { text: 'Die Farben im Bild', ok: false, erklaerung: 'Die Farben sind der Bildinhalt. Metadaten sind Daten ÜBER die Datei.' },
        ],
      },
      {
        frage: 'Lina will ein Selfie posten. Die Metadaten enthalten ihren Wohnort. Was rätst du?',
        optionen: [
          { text: 'Metadaten vorher entfernen', ok: true, erklaerung: 'Sonst weiß jeder, wo Lina wohnt.' },
          { text: 'Egal, sieht ja keiner', ok: false, erklaerung: 'Jeder, der das Bild herunterlädt, kann die Metadaten lesen.' },
        ],
      },
    ],
  },
  kollaboration: {
    art: 'quiz',
    titel: 'Gemeinsam arbeiten',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 2 – Kooperation, Kollaboration, Netiquette',
    intro: 'Die Klasse baut ein gemeinsames Dokument: Regeln gegen Hetze im Klassenchat.',
    schluss: 'Eure Netiquette hängt jetzt in KnotenLern. Gemeinsam seid ihr stärker! (Leertaste)',
    fragen: [
      ...zuordnen('Kooperation oder Kollaboration?', ['Kooperation', 'Kollaboration'], [
        { text: 'Jeder schreibt ein Kapitel, am Ende wird alles zusammengeklebt.', kategorie: 0, warum: 'Arbeitsteilung mit anschließendem Zusammenfügen ist Kooperation.' },
        { text: 'Alle schreiben gleichzeitig im selben Online-Dokument.', kategorie: 1, warum: 'Gemeinsam am selben Gegenstand, die ganze Zeit: Kollaboration.' },
      ]),
      {
        frage: 'Welche Regel gehört in eure Netiquette?',
        optionen: [
          { text: 'Keine Texte anderer löschen, ohne zu fragen', ok: true, erklaerung: 'Wer fremde Arbeit löscht, macht die Zusammenarbeit kaputt. Erst absprechen!' },
          { text: 'Wer zuerst schreibt, bestimmt alles', ok: false, erklaerung: 'Das ist unfair. Netiquette heißt: respektvoll miteinander umgehen.' },
          { text: 'Beleidigungen sind okay, wenn es lustig ist', ok: false, erklaerung: 'Nein! Auch „Spaß" kann verletzen.' },
        ],
      },
    ],
  },
  caesar_zettel: {
    art: 'caesar',
    titel: 'FUNKSTILLEs Zettel',
    stufe: 8,
    lehrplan: 'SN Kl. 8 WB 1 – Verschlüsselung (Caesar)',
    aufgabe: {
      titel: 'FUNKSTILLEs Zettel',
      geheim: 'WUHIISXQNW DOWHV IHUQPHOGHDPW',
      schluessel: 3,
      intro: 'Dreh die Caesar-Scheibe, bis aus dem Buchstabensalat echte Wörter werden.',
      schluss: 'TREFFPUNKT ALTES FERNMELDEAMT! Jeder Buchstabe war um 3 verschoben. Der Schlüssel ist 3. (Leertaste)',
    },
  },
  domains: {
    art: 'quiz',
    titel: 'FUNKSTILLEs Adressliste',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 2 – Aufbau von Webadressen, Phishing',
    intro: 'Auf FUNKSTILLEs Laptop liegt eine Liste mit Webadressen. Welche sind Fallen?',
    schluss: 'Alle Fallen gefunden! Herr Work lässt die gefälschten Seiten sperren. (Leertaste)',
    fragen: zuordnen('Echte Adresse oder Falle?', ['Falle', 'Echt'], [
      { text: 'knotennetz.de.konto-check.info', kategorie: 0, warum: 'Die echte Domain steht ganz hinten: konto-check.info. Das ist nicht KnotenNetz!' },
      { text: 'www.knotennetz.de/hilfe', kategorie: 1, warum: 'Domain knotennetz.de, dahinter nur der Pfad /hilfe. Echt.' },
      { text: 'knotenlern.de-login.com', kategorie: 0, warum: 'Die Domain ist de-login.com – mit KnotenLern hat das nichts zu tun.' },
      { text: 'knotenbnak.de', kategorie: 0, warum: 'Buchstabendreher! Solche Adressen sollen Tippfehler ausnutzen.' },
    ]),
  },
  mailfilter: {
    art: 'reihenfolge',
    titel: 'Der Mailfilter',
    stufe: 8,
    lehrplan: 'SN Kl. 8 LB 1 – Schleife und Verzweigung in einem Alltagsalgorithmus',
    aufgabe: {
      titel: 'Der Mailfilter',
      intro: 'Baue einen Filter, der FUNKSTILLEs Mails aussortiert: für jede Mail prüfen, wer sie geschickt hat.',
      schritte: [
        'Für jede Mail im Posteingang:',
        'Lies die Absenderadresse.',
        'Wenn sie auf @knotennetz.de endet:',
        'dann lass die Mail im Posteingang,',
        'sonst verschiebe sie in den Spam-Ordner.',
      ],
      hinweise: ['Der Filter soll alle Mails nacheinander prüfen. Womit beginnt die Schleife?', 'Bevor man prüfen kann, muss man den Absender lesen.', 'Jetzt kommt die Bedingung.'],
      schluss: 'Schleife plus Verzweigung – und schon landen alle Phishing-Mails im Spam. (Leertaste)',
    },
  },
};

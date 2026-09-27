import type { SpielDef } from '../../minigames/defs';
import { zuordnen } from '../../minigames/generischLogic';

const S10 = { stufe: 10 } as const;

/** Minispiele Kapitel 4 (Klasse 10). */
export const KAPITEL4_SPIELE: Record<string, SpielDef> = {
  datentypen: {
    art: 'quiz',
    ...S10,
    titel: 'KrümelScript: Datentypen',
    lehrplan: 'SN Kl. 10 LB 1 – Datentypen, Variablen',
    intro: 'Kevin: „Krümel versteht jetzt Text statt Blöcke. Seine Sensoren liefern verschiedene Arten von Werten."',
    schluss: 'Zahl, Zeichenkette, Wahrheitswert – Krümel weiß jetzt, womit er rechnet. (Leertaste)',
    fragen: zuordnen('Welcher Datentyp steckt in der Variable?', ['Zahl', 'Zeichenkette', 'Wahrheitswert'], [
      { text: 'abstand = 12', kategorie: 0, warum: 'Mit 12 kann man rechnen: eine Zahl.' },
      { text: 'raum = "Küche"', kategorie: 1, warum: 'Text in Anführungszeichen ist eine Zeichenkette.' },
      { text: 'hindernis = wahr', kategorie: 2, warum: 'wahr oder falsch: ein Wahrheitswert.' },
      { text: 'plz = "09421"', kategorie: 1, warum: 'In Anführungszeichen – eine Zeichenkette. Mit Postleitzahlen rechnet man ja auch nicht.' },
    ]),
  },
  fehlermeldung: {
    art: 'quiz',
    ...S10,
    titel: 'Fehlermeldungen lesen',
    lehrplan: 'SN Kl. 10 LB 1 – Fehlermeldungen; LB 2 Syntax und Semantik',
    intro: 'Krümel bleibt stehen. Auf dem Bildschirm steht eine Fehlermeldung.',
    schluss: 'Fehlermeldungen sind Hinweise: Zeile lesen, Ursache finden, reparieren. (Leertaste)',
    fragen: [
      {
        frage: 'Meldung: Zeile 3, „fahre_vorwärst" unbekannt. Warum?',
        code: ['1  abstand = messe_abstand()', '2  wenn abstand > 10:', '3      fahre_vorwärst()'],
        optionen: [
          { text: 'Ein Tippfehler im Befehl', ok: true, erklaerung: 'Richtig heißt er fahre_vorwaerts(). Ein Syntaxfehler – das findet der Computer.' },
          { text: 'Krümels Akku ist leer', ok: false, erklaerung: 'Die Meldung nennt Zeile 3 und einen unbekannten Namen. Lies genau!' },
          { text: 'Zeile 1 ist falsch', ok: false, erklaerung: 'Die Meldung zeigt auf Zeile 3.' },
        ],
      },
      {
        frage: 'Kein Fehler gemeldet – aber Krümel fährt gegen die Wand. Warum?',
        code: ['1  abstand = messe_abstand()', '2  wenn abstand < 10:', '3      fahre_vorwaerts()'],
        optionen: [
          { text: 'Die Bedingung ist falsch herum', ok: true, erklaerung: 'Er fährt, wenn die Wand NAH ist. Ein Denkfehler (Semantik) – den meldet kein Computer.' },
          { text: 'Der Befehl ist falsch geschrieben', ok: false, erklaerung: 'Diesmal ist alles richtig geschrieben. Was bedeutet die Bedingung?' },
        ],
      },
    ],
  },
  unterprogramm: {
    art: 'quiz',
    ...S10,
    titel: 'Unterprogramme',
    lehrplan: 'SN Kl. 10 LB 1 – Unterprogramme',
    intro: 'Krümel muss oft um Hindernisse herum. Kevin schreibt ein Unterprogramm.',
    schluss: 'Einmal schreiben, oft benutzen – so werden Programme kurz und übersichtlich. (Leertaste)',
    fragen: [
      {
        frage: 'Wie oft dreht sich Krümel insgesamt?',
        code: ['def umfahre():', '    drehe_rechts(); fahre_vorwaerts(); drehe_links()', 'umfahre()', 'umfahre()'],
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: '2', ok: false, erklaerung: 'In umfahre() dreht er sich zweimal – und umfahre() wird zweimal aufgerufen.' },
          { text: '4', ok: true, erklaerung: 'Zwei Drehungen pro Aufruf, zwei Aufrufe: 4.' },
          { text: '6', ok: false, erklaerung: 'Zähl nur die Drehbefehle: drehe_rechts und drehe_links.' },
        ],
      },
      {
        frage: 'Warum ist ein Unterprogramm hier praktisch?',
        optionen: [
          { text: 'Man schreibt die Befehle nur einmal', ok: true, erklaerung: 'Und wenn man etwas ändern will, ändert man es nur an einer Stelle.' },
          { text: 'Krümel wird dadurch schneller', ok: false, erklaerung: 'Krümel fährt gleich schnell. Aber das Programm wird kürzer und übersichtlicher.' },
        ],
      },
    ],
  },
  bedingungen: {
    art: 'quiz',
    ...S10,
    titel: 'Und, oder?',
    lehrplan: 'SN Kl. 10 LB 1 – verknüpfte Bedingungen',
    intro: 'Emils Spielzeugroboter soll nur fahren, wenn es passt. Prüfe die Bedingungen!',
    schluss: '„und": beides muss stimmen. „oder": eins reicht. (Leertaste)',
    fragen: [
      {
        frage: 'licht ist "an", abstand ist 15. Fährt der Roboter?',
        code: ['wenn licht == "an" und abstand > 10:', '    fahre()'],
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: 'Ja', ok: true, erklaerung: 'Beides stimmt: Licht an und Abstand größer als 10.' },
          { text: 'Nein', ok: false, erklaerung: 'Prüf beide Teile: Ist das Licht an? Ist 15 größer als 10?' },
        ],
      },
      {
        frage: 'licht ist "aus", knopf ist wahr. Fährt er jetzt?',
        code: ['wenn licht == "an" oder knopf:', '    fahre()'],
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: 'Ja', ok: true, erklaerung: 'Bei „oder" reicht ein Teil: Der Knopf ist gedrückt.' },
          { text: 'Nein', ok: false, erklaerung: 'Bei „oder" genügt es, wenn EIN Teil wahr ist.' },
        ],
      },
      {
        frage: 'licht ist "aus", abstand ist 15. Und jetzt?',
        code: ['wenn licht == "an" und abstand > 10:', '    fahre()'],
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: 'Ja', ok: false, erklaerung: 'Bei „und" müssen BEIDE Teile stimmen. Das Licht ist aus.' },
          { text: 'Nein', ok: true, erklaerung: 'Das Licht ist aus – bei „und" reicht das, damit alles falsch ist.' },
        ],
      },
    ],
  },
  robotik: {
    art: 'quiz',
    ...S10,
    titel: 'Sensor oder Aktor?',
    lehrplan: 'SN Kl. 10 WB 3 – Robotik: Sensoren und Aktoren',
    intro: 'Kevin schraubt Krümel auf. Was nimmt wahr, was bewegt?',
    schluss: 'Sensoren messen, Aktoren handeln, das Programm entscheidet dazwischen. (Leertaste)',
    fragen: zuordnen('Sensor oder Aktor?', ['Sensor', 'Aktor'], [
      { text: 'Abstandssensor vorne', kategorie: 0, warum: 'Er misst, wie weit die Wand weg ist.' },
      { text: 'Motor an den Rädern', kategorie: 1, warum: 'Der Motor bewegt Krümel – ein Aktor.' },
      { text: 'Stoßstange mit Taster', kategorie: 0, warum: 'Der Taster merkt, wenn Krümel anstößt.' },
      { text: 'Blinkendes Lämpchen', kategorie: 1, warum: 'Die Lampe gibt etwas aus – ein Aktor.' },
    ]),
  },
  html_struktur: {
    art: 'quiz',
    ...S10,
    titel: 'HTML-Restaurator',
    lehrplan: 'SN Kl. 10 LB 2 – HTML: Überschriften, Listen, Tabellen',
    intro: 'Mit der Quelltext-Linse siehst du den HTML-Code der verschandelten Rathaus-Seite.',
    schluss: 'Die Struktur stimmt wieder. Überschriften, Listen und Tabellen sind da, wo sie hingehören. (Leertaste)',
    fragen: [
      {
        frage: 'Die Hauptüberschrift „Bürgeramt Knotenburg" braucht welches Tag?',
        code: ['<???>Bürgeramt Knotenburg</???>'],
        nebeneinander: true,
        optionen: [
          { text: 'h1', ok: true, erklaerung: '<h1> ist die wichtigste Überschrift einer Seite.' },
          { text: 'p', ok: false, erklaerung: '<p> ist ein normaler Absatz, keine Überschrift.' },
          { text: 'li', ok: false, erklaerung: '<li> ist ein Listenpunkt.' },
        ],
      },
      {
        frage: 'Die Öffnungszeiten sollen eine Liste werden. Was fehlt?',
        code: ['<ul>', '  <??>Montag 8–12 Uhr</??>', '  <??>Dienstag 8–18 Uhr</??>', '</ul>'],
        nebeneinander: true,
        optionen: [
          { text: 'li', ok: true, erklaerung: 'In <ul> steht jeder Listenpunkt in <li>.' },
          { text: 'h2', ok: false, erklaerung: 'Das wären lauter Überschriften, keine Liste.' },
          { text: 'img', ok: false, erklaerung: '<img> ist für Bilder.' },
        ],
      },
      {
        frage: 'Was bedeutet <td> in einer Tabelle?',
        optionen: [
          { text: 'Eine Zelle in einer Zeile', ok: true, erklaerung: '<tr> ist eine Zeile, <td> eine Zelle darin.' },
          { text: 'Die ganze Tabelle', ok: false, erklaerung: 'Die ganze Tabelle ist <table>.' },
        ],
      },
    ],
  },
  html_barriere: {
    art: 'quiz',
    ...S10,
    titel: 'Für Herrn Schubert',
    lehrplan: 'SN Kl. 10 LB 2 – Barrierefreiheit, Hyperlinks',
    intro: 'Herr Schubert ist blind. Sein Screenreader liest ihm Webseiten vor – aber hier liest er nur „Bild, Bild, Bild".',
    schluss: 'Herr Schubert findet die Termine wieder. Eine Seite für alle! (Leertaste)',
    fragen: [
      {
        frage: 'Was braucht das Bild, damit der Screenreader es beschreiben kann?',
        code: ['<img src="rathaus.png">'],
        optionen: [
          { text: 'alt="Das Rathaus am Markt"', ok: true, erklaerung: 'Der Alternativtext wird vorgelesen, wenn man das Bild nicht sehen kann.' },
          { text: 'width="500"', ok: false, erklaerung: 'Die Breite hilft Herrn Schubert nicht. Er braucht eine Beschreibung.' },
          { text: 'Nichts, Bilder sind egal', ok: false, erklaerung: 'Ohne Beschreibung weiß Herr Schubert nicht, was dort ist.' },
        ],
      },
      {
        frage: 'FUNKSTILLE hat den Link zu den Terminen verbogen. Wohin muss href zeigen?',
        code: ['<a href="http://termine-knotenburg.biz">Termine</a>'],
        optionen: [
          { text: 'https://www.knotenburg.de/termine', ok: true, erklaerung: 'Das ist die echte Adresse der Stadt, dazu verschlüsselt.' },
          { text: 'http://termine-knotenburg.biz', ok: false, erklaerung: 'Das ist die gefälschte Seite. Die Stadt hat die Domain knotenburg.de.' },
        ],
      },
    ],
  },
  css: {
    art: 'quiz',
    ...S10,
    titel: 'Inhalt und Design',
    lehrplan: 'SN Kl. 10 LB 2 – CSS, Trennung von Inhalt und Gestaltung',
    intro: 'FUNKSTILLE hat alles in Knallpink eingefärbt. Die Farbe steht in einer eigenen CSS-Datei.',
    schluss: 'Design geändert, ohne ein Wort des Inhalts anzufassen – wie damals bei Linas Plakat. (Leertaste)',
    fragen: [
      {
        frage: 'Wo änderst du die Farbe aller Überschriften auf einmal?',
        code: ['h1 { color: hotpink; }'],
        optionen: [
          { text: 'In der CSS-Regel für h1', ok: true, erklaerung: 'Eine Regel gilt für alle h1-Überschriften. Inhalt bleibt, Design ändert sich.' },
          { text: 'In jedem Text einzeln', ok: false, erklaerung: 'Genau das vermeidet man mit CSS: eine Regel für alle.' },
        ],
      },
      {
        frage: 'Was beschreibt HTML, was CSS?',
        optionen: [
          { text: 'HTML den Inhalt, CSS das Aussehen', ok: true, erklaerung: 'HTML: Was steht da? CSS: Wie sieht es aus?' },
          { text: 'HTML das Aussehen, CSS den Inhalt', ok: false, erklaerung: 'Andersherum!' },
        ],
      },
    ],
  },
  regex_finden: {
    art: 'quiz',
    ...S10,
    titel: 'Der Regex-Kescher',
    lehrplan: 'SN Kl. 10 LB 2 – reguläre Ausdrücke: Suchen',
    intro: 'Hunderte Spam-Adressen fluten das Stadtforum: info1@…, info27@… Ein Suchmuster fängt sie alle.',
    schluss: 'Ein Muster, hunderte Treffer. So arbeiten Spamfilter. (Leertaste)',
    fragen: [
      {
        frage: 'Wofür steht \\d in einem regulären Ausdruck?',
        nebeneinander: true,
        optionen: [
          { text: 'Eine Ziffer', ok: true, erklaerung: '\\d passt auf 0, 1, 2 … 9.' },
          { text: 'Ein d', ok: false, erklaerung: 'Mit dem Backslash wird daraus ein Platzhalter für Ziffern.' },
          { text: 'Ein Leerzeichen', ok: false, erklaerung: 'Das wäre \\s. \\d steht für eine Ziffer.' },
        ],
      },
      {
        frage: 'Das Muster info\\d+@spam\\.biz – welche Adresse fängt es?',
        optionen: [
          { text: 'info7@spam.biz', ok: true, erklaerung: '\\d+ heißt: mindestens eine Ziffer. Bei info@spam.biz fehlt sie.' },
          { text: 'info@spam.biz', ok: false, erklaerung: '\\d+ verlangt mindestens eine Ziffer nach „info".' },
          { text: 'lina@knotenburg.de', ok: false, erklaerung: 'Lina ist echt! Das Muster verlangt „info" und „spam.biz".' },
        ],
      },
    ],
  },
  regex_validieren: {
    art: 'quiz',
    ...S10,
    titel: 'Suchen, Ersetzen, Prüfen',
    lehrplan: 'SN Kl. 10 LB 2 – reguläre Ausdrücke: Ersetzen, Validieren',
    intro: 'Im Bürgerformular stehen unsinnige Postleitzahlen – und im Stadtarchiv hat FUNKSTILLE Wörter ausgetauscht.',
    schluss: 'Validiert und ersetzt. Reguläre Ausdrücke sind ein mächtiges Werkzeug! (Leertaste)',
    fragen: [
      {
        frage: 'Welche Eingabe passt auf ^\\d{5}$ (genau fünf Ziffern)?',
        nebeneinander: true,
        optionen: [
          { text: '09421', ok: true, erklaerung: 'Genau fünf Ziffern – wie die PLZ von Kabelitz auf deinem Brief damals.' },
          { text: '9421', ok: false, erklaerung: 'Nur vier Ziffern. {5} verlangt genau fünf.' },
          { text: '0942A', ok: false, erklaerung: 'A ist keine Ziffer.' },
        ],
      },
      {
        frage: 'Im Archiv steht überall „Teufelszeug" statt „Internet". Wie repariert man das am schnellsten?',
        optionen: [
          { text: 'Suchen und Ersetzen für alle Treffer', ok: true, erklaerung: 'Ein Befehl, alle Stellen auf einmal.' },
          { text: 'Jede Stelle von Hand ändern', ok: false, erklaerung: 'Bei 3.000 Stellen? Dafür gibt es Suchen und Ersetzen.' },
        ],
      },
      {
        frage: '„Der Router isst Pakete gern." Syntax korrekt, aber …',
        optionen: [
          { text: 'die Semantik ist Unsinn', ok: true, erklaerung: 'Grammatisch richtig (Syntax), aber die Bedeutung (Semantik) stimmt nicht.' },
          { text: 'die Syntax ist falsch', ok: false, erklaerung: 'Der Satz ist grammatisch richtig. Das Problem ist die Bedeutung.' },
        ],
      },
    ],
  },
  chatserver: {
    art: 'reihenfolge',
    ...S10,
    titel: 'Der Notfall-Chat',
    lehrplan: 'SN Kl. 10 LB 3 – Client-Server-Dienst',
    aufgabe: {
      titel: 'Der Notfall-Chat',
      intro: 'Kevin, Lina und du baut auf „der Himbeere" einen Chat-Server für Knotenburg. Wie läuft eine Nachricht?',
      schritte: [
        'Mia tippt eine Nachricht in ihrer Chat-App (Client).',
        'Der Client schickt sie an den Server.',
        'Der Server speichert die Nachricht.',
        'Der Server verteilt sie an alle anderen Clients.',
        'Auf Jonas\' Handy erscheint die Nachricht.',
      ],
      schluss: 'Der Notfall-Chat läuft! Selbst wenn große Dienste ausfallen, können sich die Nachbarn verständigen. (Leertaste)',
    },
  },
  chatbot: {
    art: 'quiz',
    ...S10,
    titel: 'Der Chat-Bot',
    lehrplan: 'SN Kl. 10 LB 3 – Chat-Bot mit Regeln',
    intro: 'Viele fragen dasselbe. Ein Chat-Bot antwortet nach Regeln.',
    schluss: 'Der Bot beantwortet die häufigsten Fragen. Für alles andere gibt es Menschen. (Leertaste)',
    fragen: [
      {
        frage: 'Frage: „Wann fährt der Bus?" Welche Regel greift?',
        nebeneinander: true,
        code: ['wenn "bus" in frage:', '    antworte("Jede Stunde ab Markt.")', 'sonst wenn "pizza" in frage:', '    antworte("Da Pino, ab 11:30.")'],
        optionen: [
          { text: 'Die Bus-Regel', ok: true, erklaerung: 'Das Wort „Bus" kommt in der Frage vor.' },
          { text: 'Die Pizza-Regel', ok: false, erklaerung: 'Von Pizza ist keine Rede.' },
        ],
      },
      {
        frage: '„Was ist der Sinn des Lebens?" – was antwortet der Bot?',
        code: ['wenn "bus" in frage: …', 'sonst wenn "pizza" in frage: …', 'sonst: antworte("Frag bitte einen Menschen.")'],
        optionen: [
          { text: '„Frag bitte einen Menschen."', ok: true, erklaerung: 'Keine Regel passt, also greift „sonst". Ein Bot kann nur, was in seinen Regeln steht.' },
          { text: '„Jede Stunde ab Markt."', ok: false, erklaerung: 'Das Wort „Bus" kommt gar nicht vor.' },
        ],
      },
    ],
  },
  binaersuche: {
    art: 'quiz',
    ...S10,
    titel: 'Suchen im Telefonbuch',
    lehrplan: 'SN Kl. 10 LB 3 – Suchen und Sortieren',
    intro: 'Im Chat sind 1.000 Namen gespeichert. Wie findet man „Schubert" am schnellsten?',
    schluss: 'Sortieren lohnt sich: Dann reicht die binäre Suche mit wenigen Schritten. (Leertaste)',
    fragen: [
      {
        frage: 'Die Namen sind unsortiert. Wie viele Namen muss man im schlimmsten Fall ansehen?',
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: '10', ok: false, erklaerung: 'Unsortiert hilft kein Trick: Man muss notfalls alle ansehen.' },
          { text: '500', ok: false, erklaerung: 'Im Schnitt 500 – im schlimmsten Fall aber alle.' },
          { text: '1.000', ok: true, erklaerung: 'Lineare Suche: im schlimmsten Fall jeden einzelnen.' },
        ],
      },
      {
        frage: 'Jetzt sortiert. Man schaut in die Mitte und halbiert immer. Wie viele Schritte etwa?',
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: 'ca. 10', ok: true, erklaerung: '1.000 → 500 → 250 → … → 1: etwa 10 Halbierungen. Binäre Suche!' },
          { text: 'ca. 100', ok: false, erklaerung: 'Halbieren geht viel schneller. 2 hoch 10 ist schon 1.024.' },
          { text: 'ca. 500', ok: false, erklaerung: 'Bei jedem Schritt fällt die Hälfte weg. Wie oft kann man 1.000 halbieren?' },
        ],
      },
    ],
  },
  stadtbus: {
    art: 'quiz',
    ...S10,
    titel: 'Der autonome Stadtbus',
    lehrplan: 'SN Kl. 10 LB 1 – maschinelle Entscheidungen, verknüpfte Bedingungen',
    intro: 'Der selbstfahrende Bus hält nicht mehr an der Ampel. FUNKSTILLE hat seine Regeln verändert.',
    schluss: 'Der Bus bremst wieder. Maschinen entscheiden nur so gut wie ihre Regeln. (Leertaste)',
    fragen: [
      {
        frage: 'Welche Zeile hat FUNKSTILLE verändert?',
        code: ['wenn ampel == "rot" und fussgaenger:', '    bremse()'],
        optionen: [
          { text: '„und" muss „oder" heißen', ok: true, erklaerung: 'Mit „und" bremst der Bus nur, wenn die Ampel rot ist UND jemand auf der Straße ist. Er muss bei beidem bremsen.' },
          { text: 'bremse() muss weg', ok: false, erklaerung: 'Ohne bremse() hält der Bus nie. Das Problem steckt in der Bedingung.' },
        ],
      },
      {
        frage: 'Die Kamera am Bahnhof hält dich für FUNKSTILLE. Was lernst du daraus?',
        optionen: [
          { text: 'Maschinen können sich irren – Menschen müssen prüfen', ok: true, erklaerung: 'Jede Erkennung hat eine Fehlerquote. Wichtige Entscheidungen brauchen Menschen, die Verantwortung übernehmen.' },
          { text: 'Die Kamera hat immer recht', ok: false, erklaerung: 'Nein: Auch Gesichtserkennung macht Fehler.' },
        ],
      },
    ],
  },
  stimme: {
    art: 'quiz',
    ...S10,
    titel: 'Die Stimme',
    lehrplan: 'SN Kl. 10 WB 2 – zeitabhängige Medien',
    intro: 'Eine verzerrte Sprachnachricht von FUNKSTILLE: „Das Internet ist geschlossen. Geht nach draußen!"',
    schluss: 'Die Verzerrung ist rückgängig gemacht. Die Stimme klingt … vertraut. (Leertaste)',
    fragen: [
      {
        frage: 'Ton wird 44.100-mal pro Sekunde gemessen. Wie heißt das?',
        optionen: [
          { text: 'Abtastrate', ok: true, erklaerung: '44.100 Messwerte pro Sekunde: So wird aus Schall eine Folge von Zahlen.' },
          { text: 'Bildrate', ok: false, erklaerung: 'Die Bildrate gehört zum Video: Bilder pro Sekunde.' },
        ],
      },
      {
        frage: 'Die Stimme wurde künstlich hoch gemacht. Was tust du?',
        optionen: [
          { text: 'Die Tonhöhe wieder herunterrechnen', ok: true, erklaerung: 'Weil Ton aus Zahlen besteht, kann man die Veränderung zurückrechnen.' },
          { text: 'Lauter stellen', ok: false, erklaerung: 'Lauter macht die Stimme nicht echter.' },
        ],
      },
      {
        frage: 'Im Hintergrund gurrt es leise. Die Stimme spricht Sächsisch. Was folgt daraus?',
        optionen: [
          { text: 'Ein Hinweis – aber noch kein Beweis', ok: true, erklaerung: 'Gurren und Dialekt grenzen den Kreis ein. Beschuldigen darf man trotzdem erst mit Beweisen.' },
          { text: 'Dann ist es sicher Bäcker Lange', ok: false, erklaerung: 'Bäcker Lange war es schon beim Foto nicht. Vorsicht mit schnellen Urteilen!' },
        ],
      },
    ],
  },
};

/**
 * Kapitel 2, Dienstag (M3b) und Mittwoch (M3c): Phishing-Welle, Passwörter, Datenschutz,
 * Recherche, Cybermobbing, Caesar und das alte Fernmeldeamt.
 */
import { choice, give, interlude, lexicon, minigame, narrate, quest, say, setFlag, warp, when, type Command, type Script } from '../../engine/script/Script';

// ---------- Schlafen: Montag → Dienstag → Mittwoch ----------
export const bettKapitel2: Script = [
  when(
    { all: [{ flag: 'k2_zuhause' }, { not: { flag: 'k2_dienstag' } }] },
    [
      narrate('Du legst dich ins Bett. Im Kopf kreisen Algorithmen, Server – und ein schwarzer USB-Stick.'),
      interlude('Dienstag'),
      setFlag('k2_dienstag'),
      warp('alex_zimmer', 1, 2, 'down'),
      say('ping', 'Ping! Heute schaut ihr euch den fremden Stick an. Ab in den Bus nach Knotenburg!'),
      quest('k2b_schule'),
    ],
    [
      when(
        { all: [{ flag: 'k2b_pino' }, { not: { flag: 'k2_mittwoch' } }] },
        [
          narrate('Phishing, Passwörter, Pizza … Du schläfst sofort ein.'),
          interlude('Mittwoch'),
          setFlag('k2_mittwoch'),
          warp('alex_zimmer', 1, 2, 'down'),
          say('mama', 'Aaalex! Komm mal schnell runter!'),
          narrate('Unten hält Mama dir ihr Tablet hin: ein Foto vom Rathaus Knotenburg – in Flammen! „Tausendmal geteilt", steht darunter.'),
          say('mama', 'Ist das wirklich passiert? Ich war doch gestern noch da!'),
          say('ping', 'Das sollten wir prüfen, bevor wir es glauben. In der Stadtbibliothek kennt sich bestimmt jemand mit Recherche aus.'),
          setFlag('k2c_fakefoto'),
          quest('k2c_bibliothek'),
        ],
        [narrate('Dein Bett. Jetzt ist keine Zeit zum Schlafen – in Knotenburg ist etwas los!')],
      ),
    ],
  ),
];

// ---------- Dienstag im Gymnasium ----------
export const workDienstag: Script = [
  when(
    { not: { flag: 'k2b_stick' } },
    [
      say('work', 'Guten Morgen, Alex! Ich habe den Stick an einem Rechner ohne Netzwerk untersucht. Schau selbst.'),
      narrate('Auf dem Bildschirm: eine Liste mit 500 E-Mail-Adressen aus Knotenburg. Dazu ein Entwurf: „Ihr KnotenNetz-Konto wird in 24 Stunden gesperrt! Jetzt bestätigen!"'),
      say('work', 'Das ist ein Phishing-Baukasten. Jemand will die Leute dazu bringen, ihre Passwörter auf einer gefälschten Seite einzugeben.'),
      say('ping', 'FUNKSTILLE! Wenn niemand mehr seinem Konto traut …'),
      say('work', 'Wir warnen sofort alle Eltern. Hilfst du mir, die Mail zu schreiben?'),
      setFlag('k2b_stick'),
      minigame('mailwerkstatt'),
      lexicon('email'),
      setFlag('k2b_mail'),
      say('work', 'Abgeschickt! Aber sag mal: Woher weiß eine E-Mail eigentlich, wo sie hin muss?'),
      say('work', 'Setz dich an einen PC und gib „ipconfig" ein. Dann schauen wir uns Adressen genauer an.'),
    ],
    [
      when(
        { not: { flag: 'k2b_ipmac' } },
        [say('work', 'Setz dich an einen der PCs und gib „ipconfig" ein.')],
        [
          when(
            { not: { flag: 'k2b_pakete' } },
            [
              say('work', 'Jetzt weißt du, wie Geräte adressiert werden. Und was passiert mit großen Dateien? Schick Lina doch mal ein Foto – mit Brille!'),
              minigame('pakete'),
              lexicon('datenpakete'),
              setFlag('k2b_pakete'),
              say('work', 'Wie die Router das genau machen, lernt ihr nächstes Jahr. Heute reicht: Pakete mit Absender und Empfänger.'),
              narrate('Da stürmt Jonas herein.'),
              say('jonas', 'Herr Work! Die Mail von FUNKSTILLE ist raus! Halb Knotenburg hat sie bekommen – und alle klicken drauf!'),
              say('work', 'Oh nein. Alex, nimm die hier: meine Echtheits-Lupe. Sie zeigt den echten Absender und wohin ein Link wirklich führt.'),
              give('echtheitslupe'),
              say('work', 'Üben wir kurz, woran man Phishing erkennt. Dann hilfst du den Leuten auf dem Markt!'),
              minigame('phishing'),
              lexicon('phishing'),
              setFlag('k2b_phishing'),
              quest('k2b_markt'),
            ],
            [say('work', 'Hilf den Leuten auf dem Markt! Achte auf Absender, Linkziel und Zeitdruck.')],
          ),
        ],
      ),
    ],
  ),
];

export const pcDienstag: Script = [
  when(
    { all: [{ flag: 'k2b_mail' }, { not: { flag: 'k2b_ipmac' } }] },
    [
      narrate('Du tippst „ipconfig". Auf dem Bildschirm erscheinen Zahlen: „IPv4-Adresse: 192.168.0.15".'),
      minigame('adressen'),
      lexicon('adressen'),
      setFlag('k2b_adressen'),
      minigame('ipmac'),
      lexicon('ip_mac'),
      setFlag('k2b_ipmac'),
      say('ping', 'Mit der Brille v2 sehe ich jetzt auf jedem Paket zwei Zahlenadressen! Erzählen wir es Herrn Work.'),
    ],
    [narrate('Ein Schul-PC. Heute ist hier alles ruhig.')],
  ),
];

// ---------- Phishing-Welle auf dem Markt ----------
function hilfeCheck(): Command {
  return when({ all: [{ flag: 'k2b_hilfe_berger' }, { flag: 'k2b_hilfe_passant' }, { flag: 'k2b_hilfe_jonas' }, { not: { flag: 'k2b_rathaus' } }] }, [
    say('ping', 'Drei Leute gerettet! Aber schau – vor dem Rathaus rennt jemand aufgeregt hin und her.'),
    setFlag('k2b_rathaus'),
    quest('k2b_rathaus'),
  ]);
}

export const bergerScript: Script = [
  when(
    { flag: 'k2b_hilfe_berger' },
    [say('berger', 'Danke, Alex! Mein Enkel sagt, ich soll dich zum Kaffee einladen.')],
    [
      when(
        { flag: 'k2b_phishing' },
        [
          say('berger', 'Kind, hilf mir mal! Meine Bank schreibt, ich soll SOFORT mein Passwort bestätigen. Sonst ist das Geld weg!'),
          narrate('Mit der Echtheits-Lupe siehst du: Absender „kundendienst@knotenbank-sicher.ru".'),
          choice('Was sagst du Frau Berger?', [
            ['Schnell klicken, sonst ist das Geld weg!', [say('ping', 'Halt! Genau das will FUNKSTILLE: Zeitdruck, damit man nicht nachdenkt.')]],
            [
              'Nicht klicken! Die Adresse ist gefälscht.',
              [
                say('berger', 'Knotenbank-sicher punkt r-u? Das ist ja gar nicht meine Bank! Da hätte ich fast …'),
                say('berger', 'Ich rufe lieber direkt in der Filiale an. Danke!'),
                setFlag('k2b_hilfe_berger'),
                hilfeCheck(),
              ],
            ],
          ]),
        ],
        [say('berger', 'Schönes Wetter heute, nicht? Ich warte auf meinen Enkel.')],
      ),
    ],
  ),
];

export const passantDienstag: Script = [
  when(
    { flag: 'k2b_hilfe_passant' },
    [say('passant', 'Passwort geändert, und diesmal ein langes. Danke dir!')],
    [
      say('passant', 'Du, ich hab da gerade was angeklickt: „Paket konnte nicht zugestellt werden". Dann sollte ich mein E-Mail-Passwort eingeben … hab ich gemacht.'),
      choice('Was rätst du?', [
        ['Egal, passiert schon nichts', [say('ping', 'Doch! Jetzt kennt FUNKSTILLE das Passwort. Da muss man schnell handeln.')]],
        [
          'Sofort das Passwort ändern!',
          [
            say('passant', 'Stimmt, dann ist das alte Passwort nichts mehr wert. Mach ich sofort!'),
            say('ping', 'Und am besten überall, wo er dasselbe Passwort benutzt. Darum: für jeden Dienst ein eigenes!'),
            setFlag('k2b_hilfe_passant'),
            hilfeCheck(),
          ],
        ],
      ]),
    ],
  ),
];

export const jonasDienstag: Script = [
  when(
    { flag: 'k2b_hilfe_jonas' },
    [say('jonas', 'Ich hab die Mail gelöscht und Herrn Work Bescheid gesagt. Fühlt sich gut an!')],
    [
      say('jonas', 'Alex! Jetzt kam noch eine Mail: „Rechnung.pdf.exe" von „info@knotennetz-service.biz". Soll ich die öffnen? Vielleicht hab ich was bestellt?'),
      choice('Was sagst du Jonas?', [
        ['Öffne sie, ist doch nur ein PDF', [say('ping', 'Schau genau hin: .exe am Ende! Das ist ein Programm, kein PDF.')]],
        [
          'Nicht öffnen! .exe ist ein Programm.',
          [
            say('jonas', 'Oh! Das PDF ist nur Tarnung? Krass. Dann lösche ich die Mail.'),
            setFlag('k2b_hilfe_jonas'),
            hilfeCheck(),
          ],
        ],
      ]),
    ],
  ),
];

// ---------- Rathaus: Passwörter ----------
export const schulzScript: Script = [
  when(
    { not: { flag: 'k2b_rathaus' } },
    [say('schulz', 'Ich habe gerade keine Zeit, tut mir leid! Im Rathaus spielen die Computer verrückt.')],
    [
      when(
        { not: { flag: 'k2b_passwort' } },
        [
          say('schulz', 'Du bist Alex? Herr Work hat von dir erzählt! Wir brauchen Hilfe: Ein Bot probiert seit heute Morgen Passwörter für unsere Konten aus. Tausende pro Sekunde!'),
          say('schulz', 'Unser Admin-Passwort war … „rathaus1". Ich weiß, ich weiß.'),
          minigame('fahrradschloss'),
          minigame('bruteforce'),
          lexicon('brute_force'),
          say('schulz', 'Jetzt verstehe ich, wie der Bot arbeitet. Dann bauen wir ein Passwort, an dem er sich die Zähne ausbeißt!'),
          minigame('passwort'),
          lexicon('passwort'),
          setFlag('k2b_passwort'),
          say('schulz', 'Der Bot gibt auf! Vielen Dank. Und ab heute hat jedes Konto ein eigenes, langes Passwort.'),
          say('ping', 'Schau mal, Pino winkt dir von der Pizzeria aus zu!'),
          quest('k2b_pino'),
        ],
        [say('schulz', 'Seit dem neuen Passwort ist Ruhe. Merken kann ich es mir übrigens mit einem Satz: „Mein Hund Bello frisst 3 Kekse am Tag!" → MHBf3KaT!')],
      ),
    ],
  ),
];

// ---------- Pizza Pino ----------
export const pinoScript: Script = [
  when(
    { not: { flag: 'k2b_passwort' } },
    [say('pino', 'Ciao! Pizza gibt es ab halb zwölf. Probier meine neue App!')],
    [
      when(
        { not: { flag: 'k2b_pino' } },
        [
          say('pino', 'Mamma mia, Alex! Jemand hat meine Bestell-App geknackt und postet im Internet, wer was bestellt hat!'),
          narrate('Auf Pinos Tablet: „Ich weiß, wer jeden Freitag Pizza Hawaii bestellt! — FUNKSTILLE"'),
          say('pino', 'Dabei wollte ich doch nur Pizza verkaufen! Die App fragt alles Mögliche ab. Braucht man das alles?'),
          minigame('pizza'),
          lexicon('personenbezogen'),
          setFlag('k2b_pino'),
          say('pino', 'Ab jetzt frage ich nur noch, was ich wirklich brauche. Grazie, Alex! Hier, ein Stück Margherita für dich.'),
          narrate('Plötzlich erscheint eine neue Nachricht auf Pinos Tablet: „Neugierige Kinder sollten besser Geheimschriften lernen. Man sieht sich, Alex. — FUNKSTILLE"'),
          say('ping', 'Er kennt deinen Namen! Gurr … Lass uns nach Hause fahren. Morgen sehen wir weiter.'),
          quest('k2b_heim'),
        ],
        [say('pino', 'Weniger Daten, weniger Ärger! Und die Pizza schmeckt trotzdem.')],
      ),
    ],
  ),
];

// ---------- Mittwoch: Bibliothek ----------
export const bibTuer: Script = [
  when({ flag: 'k2_mittwoch' }, [warp('bibliothek', 5, 7, 'up')], [narrate('Die Stadtbibliothek. „Heute wegen Umbau geschlossen."')]),
];

export const weberScript: Script = [
  when(
    { not: { flag: 'k2c_bild' } },
    [
      say('weber', 'Willkommen in der Stadtbibliothek! Ah, wegen des Brand-Fotos? Da bist du nicht der erste Mensch heute.'),
      say('weber', 'Das Rathaus steht übrigens – ich sehe es von hier aus dem Fenster. Aber wie findet man so etwas selbst heraus? Fangen wir mit dem Suchen an.'),
      minigame('suche'),
      lexicon('suchmaschinen'),
      setFlag('k2c_suche'),
      minigame('bilddetektiv'),
      lexicon('ki_bilder'),
      setFlag('k2c_bild'),
      say('weber', 'Gefälscht. Aber von wem? Die Bilddatei selbst kann es verraten. Schau sie dir am Rechner dort drüben an.'),
    ],
    [
      when(
        { flag: 'k2c_metadaten' },
        [say('weber', 'W.L. … Hier in Knotenburg gibt es sicher einige mit diesen Initialen. Beschuldige niemanden vorschnell!')],
        [say('weber', 'Der Rechner steht links an der Wand. Schau dir die Dateiinfo an!')],
      ),
    ],
  ),
];

export const bibPc: Script = [
  when(
    { all: [{ flag: 'k2c_bild' }, { not: { flag: 'k2c_metadaten' } }] },
    [
      narrate('Du öffnest die Dateiinformationen des Brand-Fotos.'),
      minigame('metadaten'),
      lexicon('metadaten'),
      setFlag('k2c_metadaten'),
      say('ping', 'Autor „W.L."! Hmm … Wolfgang Lange, der Bäcker auf dem Markt, schimpft doch dauernd über das Internet!'),
      quest('k2c_lange'),
    ],
    [narrate('Ein Rechner der Bibliothek. „Bitte nach der Benutzung abmelden!"')],
  ),
];

export const langeScript: Script = [
  when(
    { flag: 'k2c_lange' },
    [say('lange', 'Na, noch ein Brötchen? Wer so gut Rätsel löst, kriegt eins umsonst. Haha!')],
    [
      when(
        { flag: 'k2c_metadaten' },
        [
          say('lange', 'Was? Ich soll ein Foto gefälscht haben? Ich hab nicht mal ein Handy! Internet ist Teufelszeug, sag ich immer.'),
          say('lange', 'Um drei Uhr nachts stand ich hier schon in der Backstube. Frag die Zeitungsfrau, die holt jeden Morgen um halb vier ihre Brötchen!'),
          say('ping', 'Stimmt: Das Foto wurde um 3:12 Uhr erstellt. Da hat Herr Lange gebacken. Dann war er es wohl nicht …'),
          say('ping', 'Aber wer hat noch die Initialen W.L.? … Gurr. Mir fällt gerade niemand ein.'),
          setFlag('k2c_lange'),
          narrate('Da vibriert dein Handy: eine Nachricht von Mia. „Alex, komm bitte in die Schule. Im Klassenchat passiert was Schlimmes."'),
          quest('k2c_schule'),
        ],
        [say('lange', 'Frische Brötchen! Mit Liebe gebacken, nicht mit Computer!')],
      ),
    ],
  ),
];

// ---------- Mittwoch im Gymnasium ----------
export const workMittwoch: Script = [
  when(
    { not: { flag: 'k2c_lange' } },
    [say('work', 'Heute ist die Bibliothek wieder offen. Frau Weber hilft dir bestimmt bei dem Foto.')],
    [
      when(
        { not: { flag: 'k2c_kollaboration' } },
        [
          say('work', 'Gut, dass du da bist. Jemand hat sich in KnotenLern eingeloggt – mit meinem Passwort! Und im Klassenchat verbreitet ein Bot gemeine Nachrichten über Mia.'),
          narrate('Auf dem Bildschirm: „Mia ist voll peinlich, leitet das weiter!!!" Darunter ein bearbeitetes Foto von Mia. Schon 14 Leute haben mit einem lachenden Smiley reagiert.'),
          choice('Was tust du?', [
            ['Weiterleiten, damit alle Bescheid wissen', [say('work', 'Dann verbreitet sich die Gemeinheit nur noch weiter. Genau das will der Bot.')]],
            ['Nichts – geht mich ja nichts an', [say('work', 'Wegschauen hilft Mia nicht. Was könnte man stattdessen tun?')]],
            [
              'Screenshot machen, melden und Mia beistehen',
              [
                say('work', 'Genau richtig: Beweise sichern, melden, und Mia zeigen, dass sie nicht allein ist.'),
                say('mia', 'Danke, Alex. Echt. Ich dachte schon, alle finden das lustig.'),
                lexicon('cybermobbing'),
                setFlag('k2c_mobbing'),
              ],
            ],
          ]),
          when({ flag: 'k2c_mobbing' }, [
            say('work', 'Ich habe den Zugang gesperrt und ein neues Passwort gesetzt. Jemand hatte mir eine gefälschte Login-Seite geschickt – „knotenlern.de-login.com". Und ich bin darauf reingefallen. Peinlich.'),
            say('work', 'Damit so etwas nicht wieder passiert, schreibt die Klasse jetzt gemeinsam Regeln für den Chat.'),
            minigame('kollaboration'),
            lexicon('kollaboration'),
            setFlag('k2c_kollaboration'),
            say('work', 'Übrigens: Frau Sommer, unsere Lateinlehrerin, sucht dich. Es geht um Geheimschriften! Sie ist im Flur.'),
            quest('k2c_zettel'),
          ]),
        ],
        [say('work', 'Frau Sommer wartet im Flur auf dich. Sie ist Expertin für alte Geheimschriften.')],
      ),
    ],
  ),
];

export const miaMittwoch: Script = [
  when(
    { flag: 'k2c_mobbing' },
    [say('mia', 'Die Klasse hat mir so viele nette Nachrichten geschrieben. Und der Bot ist weg. Danke!')],
    [say('mia', '… Ich will gerade nicht reden. Sprich mit Herrn Work.')],
  ),
];

export const sommerScript: Script = [
  when(
    { not: { flag: 'k2c_kollaboration' } },
    [say('sommer', 'Salve! Ich bin Frau Sommer. Latein und Geschichte. Herr Work sagt, du bist ein Rätselfan?')],
    [
      when(
        { not: { flag: 'k2c_caesar' } },
        [
          when({ not: { flag: 'k2c_scheibe' } }, [
            say('sommer', 'Salve, Alex! Herr Work sagte, du hast einen Zettel mit Buchstabensalat? Zeig mal … Ha! Das sieht aus wie eine Caesar-Verschlüsselung!'),
            say('sommer', 'Julius Caesar hat vor über 2000 Jahren jeden Buchstaben um ein paar Stellen im Alphabet verschoben. Wer wusste, um wie viele, konnte die Nachricht lesen.'),
            say('sommer', 'Klartext, Geheimtext und der Schlüssel – die Zahl der Stellen. Hier, nimm meine Caesar-Scheibe!'),
            give('caesar_scheibe'),
            setFlag('k2c_scheibe'),
          ]),
          minigame('caesar_zettel'),
          lexicon('verschluesselung'),
          setFlag('k2c_caesar'),
          say('sommer', '„Treffpunkt altes Fernmeldeamt". Das Fernmeldeamt am Markt steht seit Jahren leer …'),
          say('sommer', 'Nur: Wie hat FUNKSTILLE seinen Leuten den Schlüssel 3 mitgeteilt, ohne dass ihn jemand abfängt? Das ist das große Problem jeder Geheimschrift.'),
          say('ping', 'Oder er wollte, dass wir es herausfinden … Gurr.'),
          when({ item: 'schluessel7' }, [say('ping', 'Und wir haben doch den alten Schlüssel 7 aus dem Kabelschacht! Auf zum Fernmeldeamt!'), quest('k2c_fernmeldeamt')], [
            say('ping', 'Das Fernmeldeamt ist verschlossen. Aber im langen Kabelschacht am Dorfplatz in Kabelitz hat doch etwas geglänzt … Krümel kommt da jetzt durch!'),
            quest('k2c_schluessel'),
          ]),
        ],
        [say('sommer', 'Viel Glück im Fernmeldeamt! Und sei vorsichtig.')],
      ),
    ],
  ),
];

// ---------- Das alte Fernmeldeamt ----------
export const fmaTuer: Script = [
  when(
    { flag: 'k2c_fma_offen' },
    [warp('fernmeldeamt', 6, 8, 'up')],
    [
      when(
        { all: [{ flag: 'k2c_caesar' }, { item: 'schluessel7' }] },
        [
          narrate('Du steckst Schlüssel 7 ins Schloss. Er passt! Mit einem Knarzen geht die schwere Tür auf.'),
          setFlag('k2c_fma_offen'),
          warp('fernmeldeamt', 6, 8, 'up'),
          say('ping', 'Hier drin war seit Jahren niemand … oder doch? Die Fußspuren im Staub sind ganz frisch!'),
        ],
        [
          narrate('Ein altes, graues Gebäude. Die Tür ist verrammelt, die Fenster sind blind vor Staub.'),
          when({ item: 'schluessel7' }, [say('ping', 'Schlüssel 7 … „Fernmeldeamt Knotenburg". Ob der hier passt? Aber was sollen wir da drin?')]),
        ],
      ),
    ],
  ),
];

export const laptopScript: Script = [
  when(
    { flag: 'kapitel2_fertig' },
    [narrate('Der Laptop ist leer. Nur noch ein schwarzer Bildschirm.')],
    [
      when({ not: { flag: 'k2c_domains' } }, [
        narrate('Auf einem alten Tisch steht ein Laptop. Der Bildschirm leuchtet. Daneben eine Tasse – noch warm. Es riecht nach Muckefuck.'),
        say('ping', 'Das ist FUNKSTILLEs Laptop! Von hier aus verschickt er die Phishing-Mails!'),
        minigame('domains'),
        setFlag('k2c_domains'),
      ]),
      say('ping', 'Und jetzt einen Filter, damit keine seiner Mails mehr ankommt!'),
      minigame('mailfilter'),
      setFlag('k2c_filter'),
      narrate('Neben dem Laptop liegt eine graue Taubenfeder. Am Kiel steckt ein winziger Ring.'),
      give('taubenfeder'),
      say('ping', '„DV 07734-…" Gurr?! So einen Ring hab ich auch am Bein! Das ist ein Taubenring!'),
      narrate('Plötzlich flackert der Bildschirm. Eine Karte von Sachsen erscheint, eine rote Linie führt nach Süden ins Erzgebirge.'),
      say('funkstille', 'PHASE 3: DAS HERZ. Wir sehen uns unter Tage, Alex.'),
      narrate('Dann: „Selbstlöschung gestartet …" Der Bildschirm wird schwarz.'),
      say('ping', 'Das Herz? Unter Tage? … Gurr.'),
      interlude('Am Abend in Kabelitz …'),
      warp('alex_zimmer', 3, 3, 'down'),
      narrate('Du liegst im Bett und drehst die Taubenfeder zwischen den Fingern. Ping sitzt am Fenster und schaut hinüber zu Opa Werners Taubenschlag.'),
      say('ping', 'Die Phishing-Seiten sind gesperrt, die Passwörter sicher, Mia geht es gut. Aber FUNKSTILLE ist immer noch da draußen.'),
      setFlag('kapitel2_fertig'),
      quest('k2_kapitel_ende'),
      interlude('Ende von Kapitel 2'),
      say('ping', 'Das Schuljahr ist bald vorbei. Wenn es weitergeht, kennt deine Lehrkraft den Code für den Kalender. Gurr!'),
    ],
  ),
];

/** Schlüssel aus dem Kabelschacht: Wurde der Zettel schon entschlüsselt, geht es direkt zum Fernmeldeamt. */
export const nachSchluessel: Command = when({ flag: 'k2c_caesar' }, [quest('k2c_fernmeldeamt')]);


import type { SpielDef } from '../../minigames/defs';
import { zuordnen } from '../../minigames/generischLogic';

const S9 = { stufe: 9 } as const;

/** Tabelle „Kunden" für die Datenbank-Rätsel. */
const KUNDEN = {
  kopf: ['Nr', 'Name', 'Ort', 'Tarif'],
  zeilen: [
    ['1', 'Berger', 'Knotenburg', 'Basis'],
    ['2', 'Nguyen', 'Kabelitz', 'Schnell'],
    ['3', 'Lösch', 'Kabelitz', 'Basis'],
    ['4', 'Pino', 'Knotenburg', 'Schnell'],
    ['5', 'Lange', 'Knotenburg', 'Basis'],
  ],
};

/** Minispiele Kapitel 3 (Klasse 9). */
export const KAPITEL3_SPIELE: Record<string, SpielDef> = {
  heimnetz: {
    art: 'quiz',
    ...S9,
    titel: 'Heimnetz-Baukasten',
    lehrplan: 'SN Kl. 9 LB 3 – Router, Switch, Accesspoint, Modem',
    intro: 'In der blinkenden Kiste stecken eigentlich vier Geräte. Welches macht was?',
    schluss: 'Modem, Router, Switch, Accesspoint – jetzt weißt du, was in der Kiste steckt. (Leertaste)',
    fragen: zuordnen('Welches Gerät macht das?', ['Modem', 'Router', 'Switch', 'Accesspoint'], [
      { text: 'Verbindet das Haus mit dem Kabel zum grauen Kasten an der Straße.', kategorie: 0, warum: 'Das Modem übersetzt die Signale aus der Leitung – die Verbindung nach draußen.' },
      { text: 'Verbindet das Heimnetz mit dem Internet und schickt Pakete ins richtige Netz.', kategorie: 1, warum: 'Der Router verbindet Netze miteinander.' },
      { text: 'Verteilt Kabelverbindungen an Fernseher, PC und Spielkonsole im Haus.', kategorie: 2, warum: 'Der Switch verbindet Geräte innerhalb des Heimnetzes.' },
      { text: 'Funkt das WLAN, damit Handys ohne Kabel ins Netz kommen.', kategorie: 3, warum: 'Der Accesspoint ist der Funk-Zugang zum Netz.' },
    ]),
  },
  pan_lan_wan: {
    art: 'quiz',
    ...S9,
    titel: 'PAN, LAN oder WAN?',
    lehrplan: 'SN Kl. 9 LB 3 – PAN, LAN, WAN',
    intro: 'Mit der Brille siehst du Netze in verschiedenen Größen. Wie heißen sie?',
    schluss: 'Vom persönlichen Netz über das Heimnetz bis zum Internet. (Leertaste)',
    fragen: zuordnen('Welche Netzgröße?', ['PAN', 'LAN', 'WAN'], [
      { text: 'Deine Kopfhörer sind per Funk mit deinem Handy verbunden.', kategorie: 0, warum: 'Personal Area Network: ein Netz direkt um dich herum.' },
      { text: 'Alle Geräte in eurem Haus hängen am selben Router.', kategorie: 1, warum: 'Local Area Network: ein lokales Netz, z. B. zu Hause oder in der Schule.' },
      { text: 'Deine Mail reist von Kabelitz über Frankfurt bis nach Sydney.', kategorie: 2, warum: 'Wide Area Network: ein Netz über große Entfernungen – wie das Internet.' },
    ]),
  },
  zweifaktor: {
    art: 'quiz',
    ...S9,
    titel: 'Anmelden mit zwei Faktoren',
    lehrplan: 'SN Kl. 9 LB 3 – Zwei-Faktor-Authentifizierung',
    intro: 'Die Router-Oberfläche verlangt ein Passwort – und einen Code von Mamas Handy.',
    schluss: 'Passwort plus Handy: Ein gestohlenes Passwort allein reicht nicht mehr. (Leertaste)',
    fragen: [
      {
        frage: 'Warum reicht das Passwort allein nicht?',
        optionen: [
          { text: 'Wer das Passwort stiehlt, bräuchte auch noch das Handy', ok: true, erklaerung: 'Zwei verschiedene Faktoren: etwas, das man weiß, und etwas, das man hat.' },
          { text: 'Damit das Anmelden länger dauert', ok: false, erklaerung: 'Es geht um Sicherheit: Ein zweiter Faktor schützt, wenn das Passwort geklaut wurde.' },
        ],
      },
      {
        frage: 'Welche Kombination ist eine echte Zwei-Faktor-Anmeldung?',
        optionen: [
          { text: 'Passwort und Code per Handy-App', ok: true, erklaerung: 'Wissen (Passwort) und Besitz (Handy) – zwei verschiedene Faktoren.' },
          { text: 'Zwei verschiedene Passwörter', ok: false, erklaerung: 'Beides ist Wissen. Beides kann man zusammen stehlen.' },
          { text: 'Passwort und Benutzername', ok: false, erklaerung: 'Der Benutzername ist oft öffentlich – kein zweiter Faktor.' },
        ],
      },
    ],
  },
  tcp: {
    art: 'reihenfolge',
    ...S9,
    titel: 'Puzzle-Post',
    lehrplan: 'SN Kl. 9 LB 3 – Datenpakete, TCP/IP',
    aufgabe: {
      titel: 'Puzzle-Post',
      intro: 'Mit der Paket-Lupe siehst du: Die Pakete haben Nummern! Was passiert mit deinem Foto an Lina?',
      schritte: [
        'Das Foto wird in nummerierte Pakete zerlegt.',
        'Die Pakete nehmen verschiedene Wege durchs Netz.',
        'Sie kommen durcheinander bei Lina an.',
        'Linas Handy sortiert sie nach Nummer.',
        'Paket 7 fehlt – es wird neu angefordert.',
        'Alle da: Das Foto wird zusammengesetzt.',
      ],
      hinweise: ['Bevor irgendwas reist, muss das Foto zerlegt werden.'],
      schluss: 'Das ist die Idee von TCP/IP: Nummern, Ankunft prüfen, Fehlendes neu anfordern. (Leertaste)',
    },
  },
  routing: {
    art: 'quiz',
    ...S9,
    titel: 'Der Paketverteiler',
    lehrplan: 'SN Kl. 9 LB 3 – Routing',
    intro: 'Du bist der Router in der Netzleitstelle. Schau in deine Tabelle: Auf welche Leitung muss das Paket?',
    schluss: 'Du hast alle Pakete richtig weitergeschickt. So finden Daten ihren Weg. (Leertaste)',
    fragen: [
      {
        frage: 'Ein Paket an 10.2.0.7 kommt an. Welche Leitung?',
        tabelle: { kopf: ['Ziel beginnt mit', 'Leitung'], zeilen: [['10.1.', 'A – Kabelitz'], ['10.2.', 'B – Knotenburg'], ['10.3.', 'C – Silberbach']] },
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: 'A', ok: false, erklaerung: 'A führt nach 10.1. – das Ziel beginnt aber mit 10.2.' },
          { text: 'B', ok: true, erklaerung: '10.2.0.7 beginnt mit 10.2. → Leitung B.' },
          { text: 'C', ok: false, erklaerung: 'C ist für 10.3. Schau dir den Anfang der Zieladresse an.' },
        ],
      },
      {
        frage: 'Und ein Paket an 10.3.4.1?',
        tabelle: { kopf: ['Ziel beginnt mit', 'Leitung'], zeilen: [['10.1.', 'A – Kabelitz'], ['10.2.', 'B – Knotenburg'], ['10.3.', 'C – Silberbach']] },
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: 'A', ok: false, erklaerung: 'A ist für 10.1.' },
          { text: 'B', ok: false, erklaerung: 'B ist für 10.2.' },
          { text: 'C', ok: true, erklaerung: '10.3. → Leitung C nach Silberbach.' },
        ],
      },
      {
        frage: 'Leitung B ist kaputt. Was macht ein Netz mit vielen Wegen?',
        optionen: [
          { text: 'Die Pakete nehmen einen Umweg', ok: true, erklaerung: 'Genau darum sind Netze vermascht: Fällt ein Weg aus, gibt es einen anderen.' },
          { text: 'Alle Pakete gehen verloren', ok: false, erklaerung: 'Nicht, wenn es andere Wege gibt – Router können umleiten.' },
        ],
      },
    ],
  },
  p2p: {
    art: 'quiz',
    ...S9,
    titel: 'Peer-to-Peer',
    lehrplan: 'SN Kl. 9 LB 3 – Peer-to-Peer vs. Client-Server',
    intro: 'Der Server mit dem Video der Theater-AG ist überlastet. Mias Klasse hat eine Idee.',
    schluss: 'Client-Server: einer liefert allen. Peer-to-Peer: alle helfen allen. (Leertaste)',
    fragen: [
      {
        frage: 'Alle holen das Video vom Schulserver. Was passiert, wenn der ausfällt?',
        optionen: [
          { text: 'Niemand bekommt das Video mehr', ok: true, erklaerung: 'Beim Client-Server-Modell hängt alles an einem Server.' },
          { text: 'Das Video kommt trotzdem', ok: false, erklaerung: 'Ohne Server keine Antwort – die Clients können nichts abholen.' },
        ],
      },
      {
        frage: 'Wer das Video schon hat, gibt es an andere weiter. Wie heißt das?',
        optionen: [
          { text: 'Peer-to-Peer', ok: true, erklaerung: 'Gleichberechtigte Geräte (Peers) teilen direkt miteinander.' },
          { text: 'Client-Server', ok: false, erklaerung: 'Hier gibt es keinen zentralen Server mehr – alle geben weiter.' },
        ],
      },
    ],
  },
  protokolle: {
    art: 'quiz',
    ...S9,
    titel: 'Postkarte oder Brief?',
    lehrplan: 'SN Kl. 9 LB 3 – SMTP, IMAP, HTTP(S)',
    intro: 'Im offenen WLAN hältst du Pakete mit der Paket-Lupe an. Auf jedem klebt ein Protokoll-Etikett.',
    schluss: 'Protokolle sind Regeln, damit Geräte sich verstehen. Und HTTPS ist der zugeklebte Umschlag. (Leertaste)',
    fragen: zuordnen('Welches Protokoll?', ['SMTP', 'IMAP', 'HTTP', 'HTTPS'], [
      { text: 'Pino verschickt eine E-Mail an seinen Lieferanten.', kategorie: 0, warum: 'SMTP bringt Mails zum Mailserver und weiter.' },
      { text: 'Jonas holt seine Mails vom Server aufs Handy.', kategorie: 1, warum: 'IMAP holt Mails aus dem Postfach auf dem Server.' },
      { text: 'Eine Webseite, deren Inhalt jeder mitlesen kann wie eine Postkarte.', kategorie: 2, warum: 'HTTP ist unverschlüsselt – im offenen WLAN kann jeder mitlesen.' },
      { text: 'Die Seite der Bank mit Schloss-Symbol: Inhalt nicht lesbar.', kategorie: 3, warum: 'HTTPS verschlüsselt die Verbindung – wie ein zugeklebter Brief.' },
    ]),
  },
  truhe: {
    art: 'reihenfolge',
    ...S9,
    titel: 'Die Truhe mit zwei Schlössern',
    lehrplan: 'SN Kl. 9 LB 3 – Schlüsseltausch',
    aufgabe: {
      titel: 'Die Truhe mit zwei Schlössern',
      intro: 'Du willst Tante Ada eine Nachricht in einer Truhe schicken. Die Post schaut in alles hinein, was offen ist. Wie klappt es?',
      schritte: [
        'Alex legt die Nachricht in die Truhe und hängt ein eigenes Schloss dran.',
        'Die Truhe reist zu Tante Ada – verschlossen.',
        'Tante Ada hängt ihr eigenes Schloss dazu.',
        'Die Truhe reist zurück zu Alex.',
        'Alex nimmt sein Schloss ab.',
        'Die Truhe reist wieder zu Ada, die ihr Schloss öffnet.',
      ],
      hinweise: ['Die Truhe darf nie offen unterwegs sein.'],
      schluss: 'Kein Schlüssel wurde je verschickt – und trotzdem kam die Nachricht sicher an! (Leertaste)',
    },
  },
  asymmetrisch: {
    art: 'quiz',
    ...S9,
    titel: 'Das Schlüsselpaar',
    lehrplan: 'SN Kl. 9 LB 3 – symmetrische und asymmetrische Verschlüsselung',
    intro: 'Tante Ada schickt dir ein Schlüsselpaar: einen goldenen privaten Schlüssel und viele offene Vorhängeschlösser.',
    schluss: 'Öffentlich zuschließen, privat aufschließen – das ist asymmetrische Verschlüsselung. (Leertaste)',
    fragen: [
      {
        frage: 'Bei Caesar haben beide denselben Schlüssel. Wie heißt das?',
        optionen: [
          { text: 'Symmetrisch', ok: true, erklaerung: 'Ein gemeinsamer Schlüssel zum Ver- und Entschlüsseln.' },
          { text: 'Asymmetrisch', ok: false, erklaerung: 'Asymmetrisch hieße: zwei verschiedene Schlüssel.' },
        ],
      },
      {
        frage: 'Mia will dir etwas Geheimes schicken. Was benutzt sie?',
        optionen: [
          { text: 'Eins deiner offenen Vorhängeschlösser (öffentlicher Schlüssel)', ok: true, erklaerung: 'Zuschließen kann jeder. Aufschließen nur du mit dem privaten Schlüssel.' },
          { text: 'Deinen goldenen privaten Schlüssel', ok: false, erklaerung: 'Den privaten Schlüssel gibst du nie weiter!' },
        ],
      },
      {
        frage: 'Darf FUNKSTILLE deine offenen Vorhängeschlösser sehen?',
        optionen: [
          { text: 'Ja, damit kann man nur zuschließen', ok: true, erklaerung: 'Öffentliche Schlüssel dürfen alle haben. Geheim bleibt nur der private.' },
          { text: 'Nein, sonst kann er alles lesen', ok: false, erklaerung: 'Mit einem offenen Schloss kann man nichts aufschließen.' },
        ],
      },
    ],
  },
  db_abfrage: {
    art: 'quiz',
    ...S9,
    titel: 'Datenbank-Detektiv: Abfragen',
    lehrplan: 'SN Kl. 9 LB 1 – Datenbanken, Abfragen',
    intro: 'Frau Dr. Yilmaz zeigt dir die (anonymisierte) Kundentabelle von KnotenNetz.',
    schluss: 'Filtern und auswählen – so findet man in riesigen Tabellen genau das Richtige. (Leertaste)',
    fragen: [
      {
        frage: 'Wie viele Datensätze (Zeilen) hat die Tabelle?',
        tabelle: KUNDEN,
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: '4', ok: false, erklaerung: 'Zähl die Zeilen unter der Überschrift.' },
          { text: '5', ok: true, erklaerung: 'Fünf Kunden, also fünf Datensätze. Jede Spalte ist ein Attribut.' },
          { text: '20', ok: false, erklaerung: 'Das wären alle Zellen. Ein Datensatz ist eine ganze Zeile.' },
        ],
      },
      {
        frage: 'Abfrage: Name, wo Ort = Kabelitz. Ergebnis?',
        tabelle: KUNDEN,
        nebeneinander: true,
        optionen: [
          { text: 'Nguyen, Lösch', ok: true, erklaerung: 'Nur die Zeilen mit Ort = Kabelitz, und davon nur die Spalte Name.' },
          { text: 'Berger, Pino, Lange', ok: false, erklaerung: 'Die wohnen in Knotenburg. Die Bedingung war Ort = Kabelitz.' },
        ],
      },
      {
        frage: 'Wie viele haben Tarif „Schnell"? (COUNT)',
        tabelle: KUNDEN,
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: '1', ok: false, erklaerung: 'Schau genau: Nguyen und …?' },
          { text: '2', ok: true, erklaerung: 'Nguyen und Pino. COUNT zählt die passenden Zeilen.' },
          { text: '3', ok: false, erklaerung: 'Drei haben „Basis". „Schnell" haben weniger.' },
        ],
      },
    ],
  },
  db_zaehlen: {
    art: 'quiz',
    ...S9,
    titel: 'Die Bürgerbefragung',
    lehrplan: 'SN Kl. 9 LB 1 – Aggregatfunktionen, Datenmanipulation',
    intro: '„Glasfaser für Kabelitz?" – 5.000 Nein-Stimmen in einer Nacht. Stimmt da was nicht?',
    schluss: 'Eine Adresse, tausende Stimmen: ein Bot. Die Fake-Stimmen werden gelöscht. (Leertaste)',
    fragen: [
      {
        frage: 'Stimmen je IP (COUNT, GROUP BY). Auffällig?',
        nebeneinander: true,
        tabelle: { kopf: ['IP-Adresse', 'Anzahl Stimmen'], zeilen: [['84.12.7.33', '1'], ['84.12.9.101', '1'], ['91.66.6.6', '4998'], ['84.12.3.18', '1']] },
        optionen: [
          { text: 'Eine IP hat fast alle Stimmen', ok: true, erklaerung: '4.998 Stimmen von 91.66.6.6 – das ist ein Bot, keine Menschen.' },
          { text: 'Alles normal', ok: false, erklaerung: 'Schau auf die Anzahl: Eine Adresse hat fast 5.000 Stimmen abgegeben!' },
        ],
      },
      {
        frage: 'Was macht man mit den Bot-Stimmen?',
        optionen: [
          { text: 'Löschen (DELETE), wo IP = 91.66.6.6', ok: true, erklaerung: 'Mit einer Bedingung löscht man genau die falschen Datensätze.' },
          { text: 'Alle Stimmen löschen', ok: false, erklaerung: 'Dann wären auch die echten Stimmen weg.' },
          { text: 'Eine neue Stimme einfügen (INSERT)', ok: false, erklaerung: 'Einfügen hilft nicht – die falschen Stimmen müssen raus.' },
        ],
      },
    ],
  },
  db_join: {
    art: 'quiz',
    ...S9,
    titel: 'Die Spur der Feder',
    lehrplan: 'SN Kl. 9 LB 1 – Verbund von Tabellen',
    intro: 'Der Ring an der Taubenfeder: „DV 07734-74-…". Frau Dr. Yilmaz verbindet zwei Tabellen.',
    schluss: 'Über die gemeinsame Vereinsnummer verbunden: Die Feder stammt aus Kabelitz. (Leertaste)',
    fragen: [
      {
        frage: 'Welcher Verein hat die Nummer 07734?',
        nebeneinander: true,
        tabelle: { kopf: ['Vereinsnr.', 'Taubenverein', 'Ort'], zeilen: [['07721', 'Flügelschlag', 'Knotenburg'], ['07734', 'Heimkehr', 'Kabelitz'], ['07790', 'Himmelsboten', 'Silberbach']] },
        optionen: [
          { text: 'Heimkehr (Kabelitz)', ok: true, erklaerung: 'Die Vereinsnummer 07734 verbindet Ring und Verein.' },
          { text: 'Flügelschlag', ok: false, erklaerung: 'Der hat 07721. Gesucht ist 07734.' },
        ],
      },
      {
        frage: 'JOIN über die Vereinsnummer: Wer ist in 07734?',
        nebeneinander: true,
        tabelle: { kopf: ['Mitglied', 'Vereinsnr.'], zeilen: [['W. Lösch', '07734'], ['W. Lange', '07721'], ['G. Klein', '07734'], ['H. Fröhlich', '07734']] },
        optionen: [
          { text: 'W. Lösch, G. Klein, H. Fröhlich', ok: true, erklaerung: 'Alle mit 07734. Lange ist in einem anderen Verein – er ist raus.' },
          { text: 'W. Lange', ok: false, erklaerung: 'Lange hat 07721 – falscher Verein.' },
        ],
      },
    ],
  },
  ki: {
    art: 'quiz',
    ...S9,
    titel: 'Die KI im Postfach',
    lehrplan: 'SN Kl. 9 LB 2 – Arten des maschinellen Lernens, Datenbasis',
    intro: 'KnotenNetz trainiert einen Spam-Filter. Wie lernt eine Maschine?',
    schluss: 'Eine KI ist nur so gut wie die Daten, aus denen sie lernt. (Leertaste)',
    fragen: [
      ...zuordnen('Welche Lernart?', ['überwacht', 'unüberwacht', 'bestärkend'], [
        { text: 'Du markierst 100 Mails als „Spam" oder „echt", daraus lernt der Filter.', kategorie: 0, warum: 'Beispiele mit richtiger Antwort: überwachtes Lernen.' },
        { text: 'Das Programm sortiert Pakete selbst in Gruppen, die sich ähnlich verhalten.', kategorie: 1, warum: 'Muster finden ohne vorgegebene Antworten: unüberwachtes Lernen.' },
        { text: 'Krümel bekommt Punkte, wenn er schneller aus dem Labyrinth findet.', kategorie: 2, warum: 'Belohnung für gutes Verhalten: bestärkendes Lernen.' },
      ]),
      {
        frage: 'Im Training enthielten alle Spam-Mails das Wort „Gewinn". Jetzt landet das Gewinnspiel der Bibliothek im Spam. Warum?',
        optionen: [
          { text: 'Die Trainingsdaten waren zu einseitig', ok: true, erklaerung: 'Die KI hat „Gewinn = Spam" gelernt. Die Datenbasis bestimmt, was sie kann.' },
          { text: 'Die KI ist kaputt', ok: false, erklaerung: 'Sie macht genau, was sie gelernt hat – die Daten waren das Problem.' },
        ],
      },
    ],
  },
  medien: {
    art: 'quiz',
    ...S9,
    titel: 'Die Glasfaser-Halle',
    lehrplan: 'SN Kl. 9 LB 3 – Übertragungsmedien',
    intro: 'In der Halle hängen Kabelbündel. Mit der Brille siehst du in manchen Lichtblitze.',
    schluss: 'Das Gitter öffnet sich. Weiter in die nächste Halle! (Leertaste)',
    fragen: [
      {
        frage: 'In diesem Kabel flitzen Lichtblitze. Was ist es?',
        optionen: [
          { text: 'Eine Glasfaser', ok: true, erklaerung: 'Glasfasern leiten Licht – sehr schnell und über weite Strecken.' },
          { text: 'Ein Kupferkabel', ok: false, erklaerung: 'In Kupfer fließt Strom, kein Licht.' },
        ],
      },
      {
        frage: 'Welche Verbindung schafft große Datenmengen über 100 km am besten?',
        optionen: [
          { text: 'Glasfaser', ok: true, erklaerung: 'Licht im Glas verliert kaum Kraft. Darum liegen Glasfasern zwischen Städten.' },
          { text: 'WLAN', ok: false, erklaerung: 'Funk wird schon nach wenigen Metern schwächer.' },
          { text: 'Kupferkabel', ok: false, erklaerung: 'Kupfer ist auf langen Strecken langsamer als Glasfaser.' },
        ],
      },
    ],
  },
  switch_router: {
    art: 'quiz',
    ...S9,
    titel: 'Die Switch-Kammer',
    lehrplan: 'SN Kl. 9 LB 3 – Switch, Router',
    intro: 'Kalle zeigt auf zwei Geräte: „Das eine ist ein Switch, das andere ein Router. Aber welches ist welches?"',
    schluss: 'Switch im Netz, Router zwischen Netzen. Das Gitter geht auf! (Leertaste)',
    fragen: [
      {
        frage: 'Dieses Gerät verbindet die 40 Server im selben Raum. Was ist es?',
        optionen: [
          { text: 'Ein Switch', ok: true, erklaerung: 'Innerhalb eines Netzes verteilt der Switch die Daten – anhand der MAC-Adressen.' },
          { text: 'Ein Router', ok: false, erklaerung: 'Der Router verbindet verschiedene Netze. Hier geht es um ein einziges Netz.' },
        ],
      },
      {
        frage: 'Dieses Gerät verbindet das Rechenzentrum mit dem Netz in Knotenburg. Was ist es?',
        optionen: [
          { text: 'Ein Router', ok: true, erklaerung: 'Er verbindet zwei Netze und arbeitet mit IP-Adressen.' },
          { text: 'Ein Switch', ok: false, erklaerung: 'Zwischen zwei verschiedenen Netzen braucht es einen Router.' },
        ],
      },
    ],
  },
  schleife: {
    art: 'quiz',
    ...S9,
    titel: 'Das Router-Labyrinth',
    lehrplan: 'SN Kl. 9 LB 3 – Routing (Fehler finden)',
    intro: 'Pakete laufen im Kreis, bis sie verschwinden! FUNKSTILLE hat eine Routing-Tabelle verändert.',
    schluss: 'Die Schleife ist weg. Die Pakete fließen wieder – das Gitter öffnet sich. (Leertaste)',
    fragen: [
      {
        frage: 'Pakete für Server S: Welche Zeile baut einen Kreis?',
        tabelle: { kopf: ['Router', 'Pakete für S gehen an'], zeilen: [['R1', 'R2'], ['R2', 'R3'], ['R3', 'R1'], ['R4', 'Server S']] },
        nebeneinander: true,
        optionen: [
          { text: 'R3 → R1', ok: true, erklaerung: 'R1 → R2 → R3 → R1 … ein Kreis! R3 muss an R4 weiterleiten.' },
          { text: 'R4 → S', ok: false, erklaerung: 'R4 liefert richtig beim Server ab. Wohin schickt R3?' },
          { text: 'R1 → R2', ok: false, erklaerung: 'Folge den Paketen: R1, R2, R3 … und dann?' },
        ],
      },
      {
        frage: 'Wie muss die Zeile für R3 heißen?',
        nebeneinander: true,
        optionen: [
          { text: 'R3 → R4', ok: true, erklaerung: 'Dann: R1 → R2 → R3 → R4 → Server S.' },
          { text: 'R3 → R2', ok: false, erklaerung: 'Dann pendeln die Pakete zwischen R2 und R3.' },
        ],
      },
    ],
  },
  filter: {
    art: 'quiz',
    ...S9,
    titel: 'Die Paketflut',
    lehrplan: 'SN Kl. 9 LB 3 – Datenpakete (Absender erkennen, filtern)',
    intro: 'Tausende Müll-Pakete stürmen herein. Die Paket-Lupe zeigt ihre Absender.',
    schluss: 'Filter gesetzt, die Flut versiegt. Das Gitter öffnet sich! (Leertaste)',
    fragen: [
      {
        frage: 'Fast alle Müll-Pakete haben als Absender „KÜHLSCHRANK-…". Was ist passiert?',
        optionen: [
          { text: 'Gekaperte smarte Geräte schicken Pakete', ok: true, erklaerung: 'FUNKSTILLE hat unsichere smarte Kühlschränke übernommen. Viele kleine Geräte machen eine große Flut.' },
          { text: 'Die Kühlschränke haben Hunger', ok: false, erklaerung: 'Haha. Nein – jemand hat die Geräte gekapert.' },
        ],
      },
      {
        frage: 'Welche Filterregel hilft?',
        optionen: [
          { text: 'Pakete von gekaperten Geräten verwerfen', ok: true, erklaerung: 'Der Filter prüft den Absender und wirft die Müll-Pakete weg.' },
          { text: 'Alle Pakete verwerfen', ok: false, erklaerung: 'Dann kämen auch die echten Daten nicht mehr durch.' },
        ],
      },
    ],
  },
  dns: {
    art: 'quiz',
    ...S9,
    titel: 'Das Adressbuch-Gewölbe',
    lehrplan: 'SN Kl. 9 LB 3 – DNS als Namensauflösung',
    intro: 'Kalle holt ein altes Telefonbuch von 1990: „Früher hat man Namen nachgeschlagen, um die Nummer zu finden."',
    schluss: 'Der Eintrag ist repariert. knotenbank.de führt wieder zur echten Bank. (Leertaste)',
    fragen: [
      {
        frage: 'Wie ein Telefonbuch übersetzt DNS …',
        optionen: [
          { text: 'Namen wie knotenbank.de in IP-Adressen', ok: true, erklaerung: 'Menschen merken sich Namen, Computer brauchen Zahlen.' },
          { text: 'IP-Adressen in Passwörter', ok: false, erklaerung: 'DNS hat nichts mit Passwörtern zu tun.' },
        ],
      },
      {
        frage: 'Die echte Bank hat 84.12.1.10. Welcher Eintrag ist falsch?',
        nebeneinander: true,
        tabelle: { kopf: ['Name', 'IP-Adresse'], zeilen: [['gym-knotenburg.de', '84.12.5.20'], ['knotenbank.de', '91.66.6.6'], ['knotenburg.de', '84.12.2.1']] },
        optionen: [
          { text: 'knotenbank.de', ok: true, erklaerung: 'Er zeigt auf 91.66.6.6 statt 84.12.1.10 – FUNKSTILLEs Adresse aus der Bürgerbefragung!' },
          { text: 'gym-knotenburg.de', ok: false, erklaerung: 'Mit der Schule ist alles in Ordnung. Vergleiche die Bank-Adresse.' },
        ],
      },
    ],
  },
  paketsturm: {
    art: 'kampf',
    ...S9,
    titel: 'Der Paketsturm',
    lehrplan: 'SN Kl. 9 LB 3 – Sicherheit in Netzen (Wiederholung)',
    kampf: {
      gegner: 'Paketsturm',
      intro: 'Ein riesiger Glitch aus Bot-Verkehr! Kontere jeden Angriff mit der richtigen Maßnahme.',
      sieg: 'Der Paketsturm ist besiegt! Das Rechenzentrum läuft wieder. (Leertaste)',
      runden: [
        {
          angriff: 'Ich lese eure Nachrichten im offenen WLAN mit!',
          optionen: [
            { text: 'Verschlüsselung (HTTPS)', ok: true, erklaerung: 'Verschlüsselte Pakete sind für Mitlesende nur Zeichensalat.' },
            { text: 'Lauter tippen', ok: false, erklaerung: 'Die Lautstärke hilft nicht gegen Mitlesen.' },
            { text: 'Router neu starten', ok: false, erklaerung: 'Dann liest er danach einfach weiter mit.' },
          ],
        },
        {
          angriff: 'Ich habe dein Passwort erraten!',
          optionen: [
            { text: 'Zwei-Faktor-Anmeldung', ok: true, erklaerung: 'Ohne dein Handy nützt ihm das Passwort nichts.' },
            { text: 'Dasselbe Passwort überall', ok: false, erklaerung: 'Das macht es nur schlimmer!' },
            { text: 'Das Passwort aufschreiben', ok: false, erklaerung: 'Das schützt nicht gegen einen Angreifer, der es schon kennt.' },
          ],
        },
        {
          angriff: 'Ich schicke alle zur falschen Adresse!',
          optionen: [
            { text: 'DNS-Einträge prüfen', ok: true, erklaerung: 'Gefälschte Einträge im Adressbuch finden und reparieren.' },
            { text: 'Mehr Kabel verlegen', ok: false, erklaerung: 'Das Problem ist das Adressbuch, nicht das Kabel.' },
          ],
        },
        {
          angriff: 'Ich verstopfe die Leitungen mit Müll!',
          optionen: [
            { text: 'Quelle erkennen und filtern', ok: true, erklaerung: 'Die Müll-Pakete werden verworfen, echte kommen durch.' },
            { text: 'Alle Pakete löschen', ok: false, erklaerung: 'Dann kommt gar nichts mehr an.' },
          ],
        },
        {
          angriff: 'Ich schicke eure Pakete im Kreis!',
          optionen: [
            { text: 'Routing-Tabelle korrigieren', ok: true, erklaerung: 'Ohne Schleife finden die Pakete wieder ihr Ziel.' },
            { text: 'Schneller schicken', ok: false, erklaerung: 'Im Kreis bleibt im Kreis, egal wie schnell.' },
          ],
        },
      ],
    },
  },
};

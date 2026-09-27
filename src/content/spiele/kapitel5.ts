import type { SpielDef } from '../../minigames/defs';
import { zuordnen } from '../../minigames/generischLogic';

const S11 = { stufe: 11 } as const;

/** Minispiele Kapitel 5 (Oberstufe) und Finale. */
export const KAPITEL5_SPIELE: Record<string, SpielDef> = {
  // ---------- Frankfurt ----------
  topologien: {
    art: 'quiz',
    ...S11,
    titel: 'Netz-Architekt',
    lehrplan: 'SN GK LB 3 / LK LB 7 – Topologien, Kantenmenge, Redundanz',
    intro: 'Tante Ada: „Netze sind Graphen – Knoten und Kanten. Welche Form hält am meisten aus?"',
    schluss: 'Mehr Kanten, mehr Umwege – aber auch mehr Kosten. Das Internet ist vermascht. (Leertaste)',
    fragen: [
      ...zuordnen('Welche Topologie?', ['Linie', 'Ring', 'Stern', 'vermascht'], [
        { text: 'Alle Geräte hängen an einem zentralen Switch.', kategorie: 2, warum: 'Ein Mittelpunkt, alle anderen sternförmig daran: Stern.' },
        { text: 'Jeder Knoten ist mit zwei Nachbarn verbunden, der letzte wieder mit dem ersten.', kategorie: 1, warum: 'Geschlossener Kreis: Ring.' },
        { text: 'Viele Knoten, viele Querverbindungen, mehrere Wege zwischen zwei Knoten.', kategorie: 3, warum: 'Mehrere Wege: vermascht – wie das Internet.' },
      ]),
      {
        frage: 'Vollvermascht mit 5 Knoten: Jeder mit jedem verbunden. Wie viele Kanten?',
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: '5', ok: false, erklaerung: 'Jeder Knoten hat 4 Nachbarn: 5 · 4 / 2.' },
          { text: '10', ok: true, erklaerung: 'n · (n − 1) / 2 = 5 · 4 / 2 = 10.' },
          { text: '20', ok: false, erklaerung: 'Jede Kante wurde doppelt gezählt: 5 · 4 durch 2.' },
        ],
      },
      {
        frage: 'Im Stern fällt der Mittelpunkt aus. Was passiert?',
        optionen: [
          { text: 'Niemand kann mehr mit jemandem reden', ok: true, erklaerung: 'Der Mittelpunkt ist ein „Single Point of Failure". Vermaschte Netze haben das nicht.' },
          { text: 'Nichts, die Pakete nehmen einen Umweg', ok: false, erklaerung: 'Im Stern gibt es keinen Umweg – alles läuft über die Mitte.' },
        ],
      },
    ],
  },
  ipv4_binaer: {
    art: 'quiz',
    ...S11,
    titel: 'IP-Adressen, genau betrachtet',
    lehrplan: 'SN GK LB 3 – IPv4 (binär), IPv6, private und öffentliche Adressen',
    intro: 'Deine Binär-Karte aus Kapitel 1 ist wieder da! Jede Zahl einer IPv4-Adresse ist ein Byte.',
    schluss: '32 Bit, vier Bytes – und weil das nicht reicht, gibt es IPv6 mit 128 Bit. (Leertaste)',
    fragen: [
      {
        frage: 'Wie lautet 192 binär? (128, 64, 32, 16, 8, 4, 2, 1)',
        optionen: [
          { text: '11000000', ok: true, erklaerung: '128 + 64 = 192. Die Binär-Karte hilft!' },
          { text: '10100000', ok: false, erklaerung: 'Das wäre 128 + 32 = 160.' },
          { text: '11100000', ok: false, erklaerung: 'Das wäre 128 + 64 + 32 = 224.' },
        ],
      },
      {
        frage: 'Warum wurde IPv6 eingeführt?',
        optionen: [
          { text: 'Die IPv4-Adressen reichen nicht mehr', ok: true, erklaerung: '4,3 Milliarden Adressen – aber viel mehr Geräte. IPv6 hat 2 hoch 128 Adressen.' },
          { text: 'IPv4 ist zu schnell', ok: false, erklaerung: 'Es geht um die Anzahl der Adressen, nicht um Tempo.' },
        ],
      },
      {
        frage: 'Welche ist eine IPv6-Adresse?',
        optionen: [
          { text: '2001:db8::1', ok: true, erklaerung: 'Hexadezimal, mit Doppelpunkten. „::" kürzt Nullen ab.' },
          { text: '192.168.300.1', ok: false, erklaerung: 'Das sieht nach IPv4 aus – und 300 ist sogar ungültig.' },
        ],
      },
    ],
  },
  dhcp: {
    art: 'reihenfolge',
    ...S11,
    titel: 'Die Adress-Rezeption',
    lehrplan: 'SN GK LB 3 – DHCP',
    aufgabe: {
      titel: 'Die Adress-Rezeption',
      intro: 'Ein neuer Server im Knoten hat noch keine Adresse. Wie bekommt er eine – wie ein Gast an der Hotelrezeption?',
      schritte: [
        'Der Server ruft ins Netz: „Gibt es hier einen DHCP-Server?"',
        'Der DHCP-Server bietet eine freie Adresse an.',
        'Der Server fragt: „Darf ich diese Adresse nehmen?"',
        'Der DHCP-Server bestätigt – mit Leihdauer.',
      ],
      schluss: 'Suchen, anbieten, anfragen, bestätigen: So bekommt jedes Gerät automatisch eine Adresse. (Leertaste)',
    },
  },
  subnetz: {
    art: 'quiz',
    ...S11,
    titel: 'Selbes Netz?',
    lehrplan: 'SN GK LB 3 – Subnetzmaske, CIDR',
    intro: 'Tante Ada gibt dir eine Subnetzmaske – eine echte! Sie verdeckt den Geräteteil der Adressen.',
    schluss: 'Netzteil vergleichen: gleich = selbes Netz. So entscheidet ein Gerät, ob es direkt schickt oder zum Router. (Leertaste)',
    fragen: [
      {
        frage: 'Maske /24: Sind 10.20.5.7 und 10.20.5.200 im selben Netz?',
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: 'Ja', ok: true, erklaerung: '/24: Die ersten drei Zahlen (10.20.5) sind der Netzteil – bei beiden gleich.' },
          { text: 'Nein', ok: false, erklaerung: 'Vergleiche nur die ersten 24 Bit, also 10.20.5.' },
        ],
      },
      {
        frage: 'Maske /24: 10.20.5.7 und 10.20.6.7?',
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: 'Ja', ok: false, erklaerung: 'Die dritte Zahl gehört bei /24 zum Netz: 5 und 6 sind verschieden.' },
          { text: 'Nein', ok: true, erklaerung: '10.20.5 und 10.20.6 sind verschieden – verschiedene Netze, ein Router muss vermitteln.' },
        ],
      },
      {
        frage: 'Wie viele Geräte passen in ein /24-Netz? (8 Bit für Geräte)',
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: '254', ok: true, erklaerung: '2 hoch 8 = 256, minus Netzadresse und Broadcast = 254.' },
          { text: '256', ok: false, erklaerung: 'Zwei Adressen sind reserviert: Netzadresse und Broadcast.' },
          { text: '24', ok: false, erklaerung: '/24 heißt 24 Bit Netzteil – es bleiben 8 Bit für Geräte.' },
        ],
      },
    ],
  },
  lpm: {
    art: 'quiz',
    ...S11,
    titel: 'Longest Prefix Match',
    lehrplan: 'SN GK LB 3 – Routingtabellen, Longest Prefix Match, statisch/dynamisch',
    intro: 'FUNKSTILLE hat eine falsche Route eingeschleust. Welcher Eintrag gewinnt?',
    schluss: 'Der längste passende Eintrag gewinnt. Die falsche Route ist gelöscht. (Leertaste)',
    fragen: [
      {
        frage: 'Paket an 10.20.5.9. Welche Zeile passt am längsten?',
        tabelle: { kopf: ['Zielnetz', 'Nächster Hop'], zeilen: [['0.0.0.0/0', 'Standard-Gateway'], ['10.0.0.0/8', 'Router A'], ['10.20.0.0/16', 'Router B'], ['10.20.5.0/24', 'Router C']] },
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: 'A', ok: false, erklaerung: '/8 passt, aber es gibt längere passende Einträge.' },
          { text: 'B', ok: false, erklaerung: '/16 passt – /24 passt auch und ist länger.' },
          { text: 'C', ok: true, erklaerung: '10.20.5.0/24 passt mit 24 Bit am genauesten.' },
        ],
      },
      {
        frage: 'Router tauschen sich selbst über Wege aus. Wie heißt das?',
        nebeneinander: true,
        optionen: [
          { text: 'dynamisches Routing', ok: true, erklaerung: 'Router „tratschen" miteinander und reagieren auf Ausfälle.' },
          { text: 'statisches Routing', ok: false, erklaerung: 'Statisch trägt ein Mensch die Wege fest ein.' },
        ],
      },
    ],
  },
  // ---------- Seekabel ----------
  lichtwellenleiter: {
    art: 'quiz',
    ...S11,
    titel: 'Licht im Glas',
    lehrplan: 'SN GK LB 3 – Lichtwellenleiter',
    intro: 'Das Seekabel besteht aus Glasfasern. Warum bleibt das Licht darin, statt seitlich rauszugehen?',
    schluss: 'Totalreflexion: Das Licht prallt immer wieder zurück ins Glas – über tausende Kilometer. (Leertaste)',
    fragen: [
      {
        frage: 'Licht trifft sehr flach auf den Rand der Faser. Was passiert?',
        optionen: [
          { text: 'Es wird vollständig zurückgespiegelt', ok: true, erklaerung: 'Totalreflexion: Bei flachem Winkel bleibt das Licht komplett in der Faser.' },
          { text: 'Es geht durch den Rand nach draußen', ok: false, erklaerung: 'Nur bei steilem Winkel. Flach bleibt es drin.' },
        ],
      },
      {
        frage: 'Ein Anker hat das Kabel beschädigt. Warum ist das Internet trotzdem nicht weg?',
        optionen: [
          { text: 'Es gibt viele andere Kabel (Redundanz)', ok: true, erklaerung: 'Das Netz ist vermascht: Die Pakete nehmen andere Seekabel.' },
          { text: 'Das Internet funktioniert über Satelliten allein', ok: false, erklaerung: 'Der allergrößte Teil läuft durch Seekabel – aber es gibt viele davon.' },
        ],
      },
    ],
  },
  vermittlung: {
    art: 'quiz',
    ...S11,
    titel: 'Klappenschrank oder Pakete?',
    lehrplan: 'SN GK LB 3 – Leitungs- und Paketvermittlung, Datagramm',
    intro: 'Erinnerst du dich an den Klappenschrank im Fernmeldeamt? Heute läuft es anders.',
    schluss: 'Früher eine Leitung pro Gespräch, heute Pakete, die einzeln reisen. (Leertaste)',
    fragen: [
      {
        frage: 'Beim Klappenschrank wurde für ein Telefonat eine feste Leitung gesteckt. Wie heißt das?',
        optionen: [
          { text: 'Leitungsvermittlung', ok: true, erklaerung: 'Die Leitung gehört während des Gesprächs nur diesen beiden.' },
          { text: 'Paketvermittlung', ok: false, erklaerung: 'Bei Paketvermittlung gibt es keine feste Leitung.' },
        ],
      },
      {
        frage: 'Jedes Paket reist einzeln und kann einen anderen Weg nehmen. Vorteil?',
        optionen: [
          { text: 'Leitungen werden geteilt, Ausfälle umgangen', ok: true, erklaerung: 'Das Datagramm-Prinzip nutzt das Netz besser und ist robust.' },
          { text: 'Die Pakete kommen immer in der richtigen Reihenfolge', ok: false, erklaerung: 'Eben nicht – dafür sortiert TCP am Ziel.' },
        ],
      },
    ],
  },
  vpn: {
    art: 'quiz',
    ...S11,
    titel: 'Der Tunnel',
    lehrplan: 'SN GK LB 3 – VPN',
    intro: 'Im Gasthaus an der Küste gibt es nur offenes WLAN. Tante Ada muss trotzdem Daten nach Frankfurt schicken.',
    schluss: 'Im VPN-Tunnel sieht niemand, was hindurchfließt. (Leertaste)',
    fragen: [
      {
        frage: 'Was sieht jemand, der im offenen WLAN den VPN-Verkehr mitschneidet?',
        optionen: [
          { text: 'Nur, dass verschlüsselte Daten fließen', ok: true, erklaerung: 'Der Inhalt steckt im verschlüsselten Tunnel.' },
          { text: 'Alle Nachrichten im Klartext', ok: false, erklaerung: 'Genau das verhindert das VPN.' },
        ],
      },
    ],
  },
  // ---------- Island ----------
  schutzziele: {
    art: 'quiz',
    ...S11,
    titel: 'Die fünf Schutzziele',
    lehrplan: 'SN GK LB 4 – Schutzziele der Informationssicherheit',
    intro: 'Sigrun: „Was genau hat FUNKSTILLE eigentlich angegriffen? Ordne zu!"',
    schluss: 'Vertraulichkeit, Integrität, Authentizität, Verfügbarkeit – und Verbindlichkeit. (Leertaste)',
    fragen: zuordnen('Welches Schutzziel ist verletzt?', ['Vertraulichkeit', 'Integrität', 'Verfügbarkeit', 'Authentizität'], [
      { text: 'Jemand hat Tante Adas Forschungsdaten mitgelesen.', kategorie: 0, warum: 'Nur Berechtigte dürfen lesen: Vertraulichkeit.' },
      { text: 'In einer Sicherung wurden Zahlen heimlich verändert.', kategorie: 1, warum: 'Daten wurden verfälscht: Integrität.' },
      { text: 'Die Daten sind verschlüsselt – niemand kommt mehr heran.', kategorie: 2, warum: 'Die Daten sind nicht nutzbar, wenn man sie braucht: Verfügbarkeit.' },
      { text: 'Eine Mail sieht aus, als käme sie von Ada, stammt aber von FUNKSTILLE.', kategorie: 3, warum: 'Der Absender ist nicht echt: Authentizität.' },
    ]),
  },
  backup: {
    art: 'quiz',
    ...S11,
    titel: 'Zeitmaschine Backup',
    lehrplan: 'SN GK LB 4 – Backup: voll, differentiell, inkrementell; LK RAID',
    intro: 'Stand von Dienstag wiederherstellen! Sonntag gab es eine Vollsicherung, danach jeden Tag eine weitere.',
    schluss: 'Dienstag ist zurück! Tante Adas Daten sind gerettet. (Leertaste)',
    fragen: [
      {
        frage: 'Inkrementell (jeder Tag nur das Neue seit gestern). Was brauchst du für Dienstag?',
        optionen: [
          { text: 'Voll (So) + Mo + Di', ok: true, erklaerung: 'Inkrementell: alle Sicherungen seit der Vollsicherung, der Reihe nach.' },
          { text: 'Nur Di', ok: false, erklaerung: 'Die Di-Sicherung enthält nur die Änderungen von Dienstag.' },
          { text: 'Voll (So) + Di', ok: false, erklaerung: 'Dann fehlen die Änderungen vom Montag.' },
        ],
      },
      {
        frage: 'Differentiell (immer alles seit Sonntag). Was brauchst du für Dienstag?',
        optionen: [
          { text: 'Voll (So) + Di', ok: true, erklaerung: 'Die differentielle Di-Sicherung enthält alles seit Sonntag.' },
          { text: 'Voll (So) + Mo + Di', ok: false, erklaerung: 'Bei differentiell reicht die letzte. Mo steckt in Di schon drin.' },
        ],
      },
      {
        frage: 'Im RAID fällt eine von vier Festplatten aus. Die Daten sind noch da. Warum?',
        optionen: [
          { text: 'Die Daten sind verteilt und doppelt abgesichert', ok: true, erklaerung: 'RAID speichert redundant – eine Platte darf ausfallen.' },
          { text: 'Glück gehabt', ok: false, erklaerung: 'Das ist Absicht: RAID ist für genau diesen Fall gebaut.' },
        ],
      },
    ],
  },
  hash: {
    art: 'quiz',
    ...S11,
    titel: 'Digitale Fingerabdrücke',
    lehrplan: 'SN GK LB 4 – Hashfunktionen, Integrität',
    intro: 'Zu jeder Sicherung gibt es einen Hashwert – einen Fingerabdruck. Eine Sicherung wurde manipuliert.',
    schluss: 'Der Hash verrät jede noch so kleine Änderung. (Leertaste)',
    fragen: [
      {
        frage: 'Welche Sicherung wurde verändert?',
        tabelle: { kopf: ['Sicherung', 'Hash gespeichert', 'Hash jetzt'], zeilen: [['Sonntag', '9f3a…c1', '9f3a…c1'], ['Montag', '4b7e…20', '4b7e…20'], ['Dienstag', 'a0d2…7f', 'e51c…09']] },
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: 'So', ok: false, erklaerung: 'Gespeichert und jetzt sind gleich.' },
          { text: 'Mo', ok: false, erklaerung: 'Beide Hashes stimmen überein.' },
          { text: 'Di', ok: true, erklaerung: 'Der Hash hat sich geändert – also der Inhalt auch.' },
        ],
      },
    ],
  },
  blockchain: {
    art: 'quiz',
    ...S11,
    titel: 'Die Kette der Blöcke',
    lehrplan: 'SN LK LB 8 – Blockchain; Informatik und Ökologie',
    intro: 'Das Zugangsprotokoll des Rechenzentrums ist eine Blockchain: Jeder Eintrag enthält den Hash des vorherigen.',
    schluss: 'Die Kette ist unverändert – und zeigt einen Login „irgendwo aus Sachsen". (Leertaste)',
    fragen: [
      {
        frage: 'FUNKSTILLE ändert einen alten Eintrag. Was passiert?',
        optionen: [
          { text: 'Alle folgenden Hashes passen nicht mehr', ok: true, erklaerung: 'Jeder Block hängt am vorherigen. Eine Änderung zerbricht die Kette sichtbar.' },
          { text: 'Nichts, das merkt niemand', ok: false, erklaerung: 'Genau dafür ist die Verkettung da.' },
        ],
      },
      {
        frage: 'Manche Blockchains brauchen so viel Strom wie ganze Länder. Warum?',
        optionen: [
          { text: 'Proof-of-Work: Rechner lösen um die Wette Rechenrätsel', ok: true, erklaerung: 'Das sichert die Kette, kostet aber enorm viel Energie.' },
          { text: 'Weil die Bildschirme so hell sind', ok: false, erklaerung: 'Es sind die Rechenrätsel – Millionen Rechner rechnen um die Wette.' },
        ],
      },
    ],
  },
  steganografie: {
    art: 'quiz',
    ...S11,
    titel: 'Die versteckte Botschaft',
    lehrplan: 'SN GK LB 4 – Steganografie; BW BPE 4.2',
    intro: 'FUNKSTILLE postet harmlose Taubenfotos. Sigrun liest die letzten Bits jedes Pixels aus.',
    schluss: 'Die Botschaft: „00:00 – DER GROSSE STECKER". Heute um Mitternacht! (Leertaste)',
    fragen: [
      {
        frage: 'Ein Pixel hat den Rotwert 11001010. Das letzte Bit wird auf 1 gesetzt. Sieht man das?',
        optionen: [
          { text: 'Nein, 202 statt 203 ist kaum zu sehen', ok: true, erklaerung: 'Das niederwertigste Bit ändert die Farbe minimal – perfekt zum Verstecken.' },
          { text: 'Ja, das Bild wird ganz rot', ok: false, erklaerung: 'Das letzte Bit ist nur 1 von 255 – der Unterschied ist winzig.' },
        ],
      },
      {
        frage: 'Was ist der Unterschied zur Verschlüsselung?',
        optionen: [
          { text: 'Man versteckt, DASS es eine Nachricht gibt', ok: true, erklaerung: 'Verschlüsselte Texte sieht man, versteckte nicht.' },
          { text: 'Es gibt keinen', ok: false, erklaerung: 'Verschlüsselung macht unlesbar, Steganografie macht unsichtbar.' },
        ],
      },
    ],
  },
  // ---------- Tokio ----------
  dns_baum: {
    art: 'reihenfolge',
    ...S11,
    titel: 'Der Weltbaum',
    lehrplan: 'SN GK LB 3 – DNS hierarchisch (5 Schritte der Namensauflösung)',
    aufgabe: {
      titel: 'Der Weltbaum',
      intro: 'Dein Laptop will www.gym-knotenburg.de erreichen. In welcher Reihenfolge wird gefragt?',
      schritte: [
        'Der Resolver schaut im eigenen Zwischenspeicher (Cache).',
        'Er fragt einen Root-Server nach .de.',
        'Der TLD-Server für .de nennt den Server von gym-knotenburg.de.',
        'Dieser Server nennt die IP-Adresse von www.',
        'Die Antwort geht an den Laptop – und in den Cache.',
      ],
      hinweise: ['Am schnellsten ist es, wenn man die Antwort schon kennt.', 'Ganz oben im Baum steht die Wurzel.'],
      schluss: 'Von der Wurzel bis zum Blatt: So findet jedes Gerät jeden Namen. (Leertaste)',
    },
  },
  cache_vergiftung: {
    art: 'quiz',
    ...S11,
    titel: 'Vergiftete Antworten',
    lehrplan: 'SN GK LB 3 – DNS-Angriffe, DNS over HTTPS',
    intro: 'Frau Sato: „Jemand hat unserem Resolver falsche Antworten untergeschoben."',
    schluss: 'Cache gereinigt, Anfragen verschlüsselt. Die Wurzel hält! (Leertaste)',
    fragen: [
      {
        frage: 'Im Cache steht: knotenbank.de → 91.66.6.6. Was tun?',
        optionen: [
          { text: 'Eintrag löschen und neu beim echten Server fragen', ok: true, erklaerung: 'Vergiftete Einträge raus, dann holt der Resolver die echte Antwort.' },
          { text: 'Die Bank umziehen lassen', ok: false, erklaerung: 'Die Bank ist gar nicht umgezogen – der Eintrag ist gefälscht.' },
        ],
      },
      {
        frage: 'FUNKSTILLE konnte sehen, welche Namen die Leute nachschlagen. Was hilft?',
        optionen: [
          { text: 'DNS over HTTPS', ok: true, erklaerung: 'Die Anfragen reisen verschlüsselt – niemand sieht, was nachgeschlagen wird.' },
          { text: 'Kürzere Domainnamen', ok: false, erklaerung: 'Die Länge ändert nichts. Die Anfragen müssen verschlüsselt werden.' },
        ],
      },
      {
        frage: 'Die meisten Root-Server-Standorte liegen in Nordamerika und Europa. Ein Problem?',
        optionen: [
          { text: 'Ja: Andere Weltregionen sind schlechter angebunden', ok: true, erklaerung: 'Darum gibt es heute viele Kopien (Anycast) auch in anderen Ländern.' },
          { text: 'Nein, Entfernung spielt nie eine Rolle', ok: false, erklaerung: 'Lange Wege kosten Zeit – und machen abhängig.' },
        ],
      },
    ],
  },
  kodierung: {
    art: 'quiz',
    ...S11,
    titel: 'Zeichensalat',
    lehrplan: 'SN GK LB 1 – Zeichenkodierung',
    intro: 'FUNKSTILLEs neueste Nachricht kommt an als: „SchÃ¤fchen zÃ¤hlen – bald ist Ruhe."',
    schluss: 'Richtig dekodiert: „Schäfchen zählen – bald ist Ruhe." Unheimlich. (Leertaste)',
    fragen: [
      {
        frage: 'Warum wird aus „ä" ein „Ã¤"?',
        optionen: [
          { text: 'UTF-8-Text wurde mit falscher Kodierung gelesen', ok: true, erklaerung: 'UTF-8 speichert ä mit zwei Bytes. Liest man sie einzeln, entsteht Zeichensalat.' },
          { text: 'Der Bildschirm ist kaputt', ok: false, erklaerung: 'Der Bildschirm zeigt nur an, was das Programm dekodiert.' },
        ],
      },
      {
        frage: 'Wie viele Zeichen kennt ASCII?',
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: '128', ok: true, erklaerung: '7 Bit: 128 Zeichen – ohne Umlaute. UTF-8 kann alle Schriften.' },
          { text: '1.000', ok: false, erklaerung: 'ASCII nutzt 7 Bit: 2 hoch 7.' },
          { text: 'alle', ok: false, erklaerung: 'Das kann erst UTF-8.' },
        ],
      },
    ],
  },
  tls: {
    art: 'reihenfolge',
    ...S11,
    titel: 'Der TLS-Handschlag',
    lehrplan: 'SN GK LB 4 – hybride Verschlüsselung',
    aufgabe: {
      titel: 'Der TLS-Handschlag',
      intro: 'Tante Adas Laptop verbindet sich sicher mit dem Root-Server. Wie läuft der Handschlag?',
      schritte: [
        'Der Laptop grüßt den Server.',
        'Der Server schickt sein Zertifikat mit öffentlichem Schlüssel.',
        'Der Laptop prüft das Zertifikat.',
        'Mit dem öffentlichen Schlüssel wird ein Sitzungsschlüssel vereinbart.',
        'Alles Weitere wird schnell symmetrisch verschlüsselt.',
      ],
      schluss: 'Asymmetrisch für den Schlüsseltausch, symmetrisch für die Daten: hybride Verschlüsselung. (Leertaste)',
    },
  },
  zertifikat: {
    art: 'quiz',
    ...S11,
    titel: 'Siegel und Unterschriften',
    lehrplan: 'SN GK LB 4 – digitale Signatur, Zertifikate',
    intro: 'Die gefälschte Bankseite aus dem Silberstollen hatte ein Zertifikat. Mit Brille v4 siehst du Siegel.',
    schluss: 'Die „Funkstille CA" ist entlarvt. Keine echte Stelle hat für sie gebürgt. (Leertaste)',
    fragen: [
      {
        frage: 'Das Zertifikat wurde von „Funkstille CA" ausgestellt. Vertrauenswürdig?',
        optionen: [
          { text: 'Nein, niemand Vertrauenswürdiges bürgt dafür', ok: true, erklaerung: 'Die Kette endet nicht bei einer anerkannten Stelle. Der Browser warnt zu Recht.' },
          { text: 'Ja, es hat ja ein Zertifikat', ok: false, erklaerung: 'Ein Zertifikat ist nur so gut wie die Stelle, die es ausstellt.' },
        ],
      },
      {
        frage: 'Tante Ada signiert eine Nachricht digital. Was beweist das?',
        optionen: [
          { text: 'Sie ist von Ada und wurde nicht verändert', ok: true, erklaerung: 'Authentizität und Integrität – und Ada kann es nicht abstreiten (Verbindlichkeit).' },
          { text: 'Niemand kann sie lesen', ok: false, erklaerung: 'Eine Signatur verschlüsselt nicht. Sie beweist Herkunft und Unversehrtheit.' },
        ],
      },
    ],
  },
  // ---------- Sydney ----------
  social_engineering: {
    art: 'quiz',
    ...S11,
    titel: 'Der falsche Techniker',
    lehrplan: 'SN GK LB 4 – Social Engineering, OSINT, Datensparsamkeit',
    intro: 'Dein Handy klingelt: „Hier ist der Technik-Support von KnotenNetz. Ich brauche kurz Ihr Passwort."',
    schluss: 'Kein Passwort am Telefon – und weniger über sich posten. (Leertaste)',
    fragen: [
      {
        frage: 'Was tust du?',
        optionen: [
          { text: 'Auflegen und selbst bei der offiziellen Nummer anrufen', ok: true, erklaerung: 'Echte Firmen fragen nie nach Passwörtern. Selbst zurückrufen entlarvt den Trick.' },
          { text: 'Das Passwort sagen, er klingt nett', ok: false, erklaerung: 'Genau darauf setzt Social Engineering: Freundlichkeit und Druck.' },
        ],
      },
      {
        frage: 'FUNKSTILLE wusste, wann du Geburtstag hast und wo du wohnst. Woher?',
        optionen: [
          { text: 'Aus öffentlichen Posts und Profilen (OSINT)', ok: true, erklaerung: 'Offen zugängliche Infos lassen sich zusammensuchen. Datensparsamkeit schützt.' },
          { text: 'Durch Hellsehen', ok: false, erklaerung: 'Viel einfacher: Er hat öffentliche Informationen gesammelt.' },
        ],
      },
    ],
  },
  haeufigkeit: {
    art: 'quiz',
    ...S11,
    titel: 'Häufigkeitsanalyse',
    lehrplan: 'SN GK LB 4 – Kryptoanalyse',
    intro: 'Leon hat einen alten Brief von FUNKSTILLE bekommen, Caesar-verschlüsselt. Ohne Schlüssel!',
    schluss: 'Ohne Schlüssel geknackt – klassische Verschlüsselung ist unsicher. (Leertaste)',
    fragen: [
      {
        frage: 'Im Geheimtext ist H der häufigste Buchstabe. Im Deutschen ist es E. Verschiebung?',
        nebeneinander: true,
        festeReihenfolge: true,
        optionen: [
          { text: '2', ok: false, erklaerung: 'Zähl von E bis H: F, G, H.' },
          { text: '3', ok: true, erklaerung: 'E → H sind 3 Stellen. Wie bei deinem Zettel aus Kapitel 1!' },
          { text: '4', ok: false, erklaerung: 'E, F, G, H – das sind 3 Schritte.' },
        ],
      },
    ],
  },
  webtech: {
    art: 'quiz',
    ...S11,
    titel: 'Anfrage und Antwort',
    lehrplan: 'SN LK 12D – HTTP, dynamische Webseiten, Eingabevalidierung',
    intro: 'Wie konnte FUNKSTILLE damals die Rathaus-Seite verschandeln? Leon zeigt dir das Server-Protokoll.',
    schluss: 'Eingaben prüfen – sonst wird aus einem Kommentar ein Befehl. (Leertaste)',
    fragen: [
      {
        frage: 'Im Kommentarfeld der Rathaus-Seite stand Code statt Text. Was fehlte?',
        code: ['Kommentar: <script>zeigeBanner("GESCHLOSSEN")</script>'],
        optionen: [
          { text: 'Eine Prüfung der Eingaben', ok: true, erklaerung: 'Die Seite hat den Kommentar ungeprüft angezeigt – und damit ausgeführt.' },
          { text: 'Ein schnellerer Server', ok: false, erklaerung: 'Tempo hilft nicht. Eingaben müssen geprüft werden.' },
        ],
      },
      {
        frage: 'Der Browser fragt „GET /termine", der Server schickt die Seite. Wie heißen die beiden Nachrichten?',
        nebeneinander: true,
        optionen: [
          { text: 'Request und Response', ok: true, erklaerung: 'Anfrage und Antwort: So funktioniert HTTP.' },
          { text: 'Upload und Download', ok: false, erklaerung: 'Bei HTTP heißen sie Request (Anfrage) und Response (Antwort).' },
        ],
      },
    ],
  },
  traceroute: {
    art: 'quiz',
    ...S11,
    titel: 'Traceroute',
    lehrplan: 'SN GK LB 3 – Pfade im Netz',
    intro: 'Mit dem Traceroute-Kompass verfolgst du FUNKSTILLEs Pakete zurück – Hop für Hop.',
    schluss: 'Der letzte Hop: taubenschlag.kabelitz. … Kabelitz? (Leertaste)',
    fragen: [
      {
        frage: 'Wo startet der Weg der Pakete?',
        tabelle: {
          kopf: ['Hop', 'Station', 'Zeit'],
          zeilen: [
            ['1', 'sydney.knoten', '2 ms'],
            ['2', 'seekabel.pazifik', '80 ms'],
            ['3', 'frankfurt.knoten', '150 ms'],
            ['4', 'bitberg.richtfunk', '158 ms'],
            ['5', 'taubenschlag.kabelitz', '159 ms'],
          ],
        },
        nebeneinander: true,
        optionen: [
          { text: 'Kabelitz', ok: true, erklaerung: 'Rückwärts gelesen: Die Pakete kommen aus einem Taubenschlag in Kabelitz – über den Richtfunk am Bitberg.' },
          { text: 'Frankfurt', ok: false, erklaerung: 'Frankfurt ist nur eine Station unterwegs. Wo ist der letzte Hop?' },
        ],
      },
    ],
  },
  // ---------- Finale ----------
  raum_adressen: {
    art: 'reihenfolge',
    ...S11,
    titel: 'Raum der Adressen',
    lehrplan: 'SN Wiederholung Kl. 7 bis Sek II – Adressen vom Brief bis zum DNS',
    aufgabe: {
      titel: 'Raum der Adressen',
      intro: 'An der Wand: Briefumschlag, E-Mail, IP-Adresse, DNS. Bring die Stationen deiner Reise in die richtige Reihenfolge.',
      schritte: [
        'Klasse 7: Ein Brief mit Name, Straße, PLZ und Ort.',
        'Klasse 8: Eine E-Mail-Adresse wie alex@gym-knotenburg.de.',
        'Klasse 9: Eine IP-Adresse – und DNS übersetzt Namen.',
        'Oberstufe: Die DNS-Hierarchie bis zur Wurzel.',
      ],
      schluss: 'Die Tür geht auf. Von der Briefmarke bis zum Root-Server – was für ein Weg! (Leertaste)',
    },
  },
  raum_schluessel: {
    art: 'caesar',
    ...S11,
    titel: 'Raum der Schlüssel',
    lehrplan: 'SN Wiederholung – Caesar (Kl. 8 WB 1), Kryptoanalyse (GK LB 4)',
    aufgabe: {
      titel: 'Raum der Schlüssel',
      geheim: 'FDAINU DV VRCCNAWJLQC',
      schluessel: 9,
      intro: 'Auf dem Tisch liegt Opas Masterplan – verschlüsselt. Die Verschiebung ist diesmal eine andere.',
      schluss: '„WURZEL UM MITTERNACHT". Die Verschiebung war 9. Opa wollte die Root-Server angreifen! (Leertaste)',
    },
  },
  raum_maschinen: {
    art: 'quiz',
    ...S11,
    titel: 'Raum der Maschinen',
    lehrplan: 'SN Wiederholung – verknüpfte Bedingungen (Kl. 10 LB 1)',
    intro: 'Krümel soll den Vergiftungs-Server abstecken – aber auf keinen Fall Opas alten Telegrafen daneben!',
    schluss: 'Krümel zieht den richtigen Stecker. Der Telegraf bleibt heil. (Leertaste)',
    fragen: [
      {
        frage: 'Welche Bedingung zieht nur den Stecker des Servers?',
        code: ['fuer jedes geraet im raum:', '    wenn ???:', '        ziehe_stecker(geraet)'],
        optionen: [
          { text: 'geraet.typ == "Server" und geraet.vergiftet', ok: true, erklaerung: 'Beides muss stimmen: Server UND vergiftet. Der Telegraf ist keins von beiden.' },
          { text: 'geraet.typ == "Server" oder geraet.alt', ok: false, erklaerung: 'Mit „oder" würde auch der alte Telegraf abgesteckt!' },
        ],
      },
    ],
  },
  raum_wahrheit: {
    art: 'quiz',
    ...S11,
    titel: 'Raum der Wahrheit',
    lehrplan: 'SN Wiederholung – Quellen prüfen (Kl. 8 LB 2), HTML (Kl. 10 LB 2)',
    intro: 'FUNKSTILLEs letzte Botschaft an die Welt: „Das Internet macht alle einsam. Beweis: 99 % aller Menschen sagen das!"',
    schluss: 'Richtigstellung veröffentlicht – mit Quelle. (Leertaste)',
    fragen: [
      {
        frage: '„99 % aller Menschen sagen das" – ohne Quelle. Was tust du?',
        optionen: [
          { text: 'Nach der Quelle fragen und prüfen', ok: true, erklaerung: 'Eine Zahl ohne Quelle ist keine Tatsache.' },
          { text: 'Glauben, klingt ja überzeugend', ok: false, erklaerung: 'Überzeugend klingen und stimmen ist nicht dasselbe.' },
        ],
      },
      {
        frage: 'Deine Richtigstellung bekommt eine Überschrift. Welches Tag?',
        code: ['<??>Richtigstellung: Netze verbinden Menschen</??>'],
        nebeneinander: true,
        optionen: [
          { text: 'h1', ok: true, erklaerung: 'Die Hauptüberschrift. Veröffentlicht!' },
          { text: 'li', ok: false, erklaerung: 'Das ist ein Listenpunkt.' },
        ],
      },
    ],
  },
  streitgespraech: {
    art: 'kampf',
    ...S11,
    titel: 'Das Streitgespräch',
    lehrplan: 'SN Wiederholung aller Klassenstufen – Chancen und Risiken vernetzter Systeme',
    kampf: {
      gegner: 'FUNKSTILLE',
      bild: 'char_opa',
      intro: 'Opa Werner stellt Behauptungen auf. Kontere mit dem, was du auf deiner Reise gelernt hast!',
      sieg: 'Opa Werner wird still. Zum ersten Mal hört er wirklich zu. (Leertaste)',
      runden: [
        {
          angriff: 'Briefe sind persönlicher! Früher war alles besser.',
          optionen: [
            { text: 'Mein Brief brauchte 2 Tage – ein Notruf braucht Sekunden', ok: true, erklaerung: 'Übertragungsrate zählt: Krankenhaus, Züge, Notrufe brauchen schnelle Netze.' },
            { text: 'Briefe sind doof', ok: false, erklaerung: 'Das stimmt ja nicht – du hast selbst gern einen geschrieben.' },
          ],
        },
        {
          angriff: 'Im Internet lügen doch alle!',
          optionen: [
            { text: 'Man kann Lügen entlarven – wie dein Brand-Foto', ok: true, erklaerung: 'Quellen prüfen, Metadaten lesen, Originale suchen: Deine eigene Fälschung flog auf.' },
            { text: 'Stimmt, alle lügen', ok: false, erklaerung: 'Nicht alle! Man kann prüfen, wem man vertraut.' },
          ],
        },
        {
          angriff: 'Die Datenkraken wissen alles über uns!',
          optionen: [
            { text: 'Du hast selbst Passwörter gestohlen – DU warst die Datenkrake', ok: true, erklaerung: 'Verschlüsselung und Datensparsamkeit schützen – und du hast Phishing betrieben.' },
            { text: 'Mir doch egal', ok: false, erklaerung: 'Datenschutz ist nicht egal. Aber wer hat hier eigentlich Daten gestohlen?' },
          ],
        },
        {
          angriff: 'Mein Enkel hat mich vergessen. Das Internet hat ihn mir weggenommen!',
          optionen: [
            { text: 'Leon denkt jeden Tag an dich – hier ist seine Nachricht', ok: true, erklaerung: 'Leon wartet auf einen Anruf. Das Netz ist das Einzige, was euch verbindet.' },
            { text: 'Dann schreib ihm halt einen Brief', ok: false, erklaerung: 'Leon ist 16.000 km entfernt. Und er vermisst dich – das Netz könnte euch verbinden.' },
          ],
        },
      ],
    },
  },
  grosser_stecker: {
    art: 'reihenfolge',
    ...S11,
    titel: 'Der Große Stecker',
    lehrplan: 'SN Wiederholung Sek II – VPN, Signaturen, Routing',
    aufgabe: {
      titel: 'Der Große Stecker',
      intro: 'Noch 3 Minuten bis Mitternacht! Opa weiß das Passwort selbst nicht mehr. Was tut ihr zuerst?',
      schritte: [
        'Per VPN mit Tante Ada in Tokio verbinden.',
        'Echte und gefälschte Root-Zone an der Signatur unterscheiden.',
        'Die falschen Routen in Opas Router löschen.',
        'Krümel zieht das Richtfunkkabel.',
      ],
      hinweise: ['Ohne sichere Verbindung zu Tante Ada geht gar nichts.', 'Erst muss klar sein, welche Root-Zone echt ist.'],
      schluss: '23:59:58. Das Internet bleibt an. (Leertaste)',
    },
  },
};

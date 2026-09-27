/**
 * Kapitel 3 (Klasse 9): „Unter Tage". Heimnetz, Pakete, Protokolle und Verschlüsselung,
 * Datenbanken und KI, dann der Silberstollen mit dem Paketsturm.
 */
import { choice, give, interlude, lexicon, minigame, narrate, quest, say, setFlag, warp, when, type Script } from '../../engine/script/Script';
import type { FlagId, LexiconId } from '../registry';

export const KAPITEL3_START: Script = [
  interlude('Sommerferien …'),
  interlude('Ein Jahr später: Alex ist in Klasse 9.'),
  warp('alex_zimmer', 3, 3, 'down'),
  say('ping', 'Ping! Neues Schuljahr, Alex! Und rate mal, wer schon wieder anruft?'),
  narrate('Unten flucht Mama: „Das Internet ist sooo langsam! Und das WLAN bricht dauernd ab!"'),
  say('ping', 'Erst Tante Ada, dann kümmern wir uns um das Internet. Dein Computer piept!'),
  quest('k3_ada'),
];

export const adaV3: Script = [
  narrate('„Videoanruf von Tante Ada".'),
  say('ada', 'Hallo Alex! Klasse 9 – dann wird es Zeit für das nächste Update. Die Brille bekommt eine Paket-Lupe!'),
  give('netzblick_v3'),
  say('ada', 'Damit kannst du Datenpakete anhalten und hineinschauen: Wer schickt sie, wohin, mit welchem Protokoll? Und ob sie verschlüsselt sind.'),
  say('ada', 'Übrigens: Eine Kollegin, Frau Dr. Yilmaz von KnotenNetz, macht sich Sorgen. Seltsame Pakete im Netz. Vielleicht meldet sie sich bei dir.'),
  setFlag('k3_ada'),
  say('ping', 'Erst mal das langsame Internet! Die blinkende Kiste im Wohnzimmer – das ist doch der Router, oder?'),
  quest('k3_router'),
];

export const routerK3: Script = [
  when(
    { not: { flag: 'k3_ada' } },
    [narrate('Die blinkende Kiste. Erst mal zum Computer – Tante Ada ruft an!')],
    [
      when(
        { flag: 'k3_heimnetz' },
        [narrate('Der Router blinkt ruhig vor sich hin. Das fremde Gerät ist gesperrt, das WLAN hat ein neues Passwort.')],
        [
          narrate('Früher war das „die blinkende Kiste". Mit der Brille v3 siehst du: Hier gehen Pakete ein und aus, per Kabel und per Funk.'),
          minigame('heimnetz'),
          lexicon('heimnetz'),
          minigame('pan_lan_wan'),
          lexicon('pan_lan_wan'),
          narrate('Du öffnest die Router-Oberfläche auf Mamas Laptop. Passwort … und dann ein Code auf Mamas Handy.'),
          minigame('zweifaktor'),
          lexicon('zwei_faktor'),
          narrate('Geräteliste: „Mamas Laptop", „Papas Handy", „Alex PC", „Fernseher" … und „TAUBENSCHLAG-CAM".'),
          say('ping', 'TAUBENSCHLAG-CAM?! Das ist nicht von uns! Jemand benutzt unser WLAN – deshalb ist es so langsam!'),
          narrate('Das WLAN-Passwort war „kabelitz123". Auweia.'),
          choice('Was tust du?', [
            ['Gerät sperren, langes WLAN-Passwort setzen', [say('ping', 'Genau! Und das neue Passwort bekommt nur, wer hier wohnt.')]],
            ['Nichts – vielleicht ist es ja wichtig', [say('ping', 'Ein fremdes Gerät in unserem Netz? Das sperren wir lieber. Jetzt!'), narrate('Du sperrst das Gerät und setzt ein langes Passwort.')]],
          ]),
          setFlag('k3_heimnetz'),
          setFlag('k3_cam'),
          say('mama', 'Wow, das Internet ist wieder schnell! Was hast du gemacht?'),
          say('ping', 'Taubenschlag … Wer hat denn hier einen Taubenschlag? Gurr …'),
          quest('k3_opa'),
        ],
      ),
    ],
  ),
];

export const opaK3: Script = [
  when(
    { flag: 'k3_opa' },
    [say('opa', 'Na, Alex? Wieder unterwegs in die Stadt? Pass auf dich auf.')],
    [
      when(
        { flag: 'k3_cam' },
        [
          narrate('Du erzählst Opa Werner von der „TAUBENSCHLAG-CAM" in eurem WLAN.'),
          say('opa', 'WLAN? Was soll ich denn mit so\'nem Kram, Kind! Ich hab nicht mal einen Computer.'),
          say('opa', 'Das war bestimmt so ein Scherzkeks aus dem Dorf. Tauben gibt\'s ja viele.'),
          narrate('Hinter Opa blinkt oben am Taubenschlag ein winziges rotes Lämpchen. Dann geht es aus.'),
          say('ping', '… Gurr.'),
          setFlag('k3_opa'),
          narrate('Da piept dein Handy: „Hier Dr. Yilmaz, KnotenNetz. Tante Ada hat mir von dir erzählt. Kannst du in die Netzleitstelle kommen? Im alten Fernmeldeamt."'),
          quest('k3_leitstelle'),
        ],
        [
          say('opa', 'Klasse 9 schon! Mensch, wie die Zeit vergeht.'),
          say('opa', 'Früher hatten wir ein Telefon für das ganze Haus. Und es hat gereicht!'),
        ],
      ),
    ],
  ),
];

export const mamaK3: Script = [
  when(
    { flag: 'k3_heimnetz' },
    [say('mama', 'Seit du das WLAN-Passwort geändert hast, läuft alles. Sogar Papas Serien ruckeln nicht mehr!')],
    [say('mama', 'Das Internet ist so langsam! Kannst du dir mal den Router ansehen? Die blinkende Kiste da oben.')],
  ),
];

// ---------- Netzleitstelle ----------
export const fmaTuerK3: Script = [warp('netzleitstelle', 6, 7, 'up')];

export const yilmazScript: Script = [
  when(
    { not: { flag: 'k3_opa' } },
    [say('yilmaz', 'Guten Tag! Die Netzleitstelle von KnotenNetz. Hier überwachen wir das Netz der ganzen Region.')],
    [
      when(
        { not: { flag: 'k3_pakete' } },
        [
          say('yilmaz', 'Alex! Schön, dass du da bist. Ich bin Frau Dr. Yilmaz. Tante Ada sagt, du hast eine besondere Brille?'),
          say('yilmaz', 'Wir sehen seit Tagen seltsame Pakete in unserem Netz. Schick doch mal ein Foto an Lina und schau dir mit der Paket-Lupe an, was passiert.'),
          minigame('tcp'),
          lexicon('tcp_ip'),
          say('yilmaz', 'Genau so. Und wer entscheidet, welchen Weg ein Paket nimmt? Die Router. Setz dich an den Platz – du bist jetzt ein Router!'),
          minigame('routing'),
          lexicon('routing'),
          minigame('p2p'),
          lexicon('p2p'),
          setFlag('k3_pakete'),
          say('yilmaz', 'Und jetzt das Seltsame: Im offenen WLAN bei der Pizzeria am Markt liest jemand fremde Pakete mit. Kannst du dir das mit der Lupe ansehen?'),
          quest('k3_wlan'),
        ],
        [
          when(
            { not: { flag: 'k3_wlan' } },
            [say('yilmaz', 'Schau dir das offene WLAN bei der Pizzeria an. Pino weiß Bescheid.')],
            [
              when(
                { not: { flag: 'k3_daten' } },
                [
                  say('yilmaz', 'Gut gemacht! Jetzt suchen wir die Person dahinter. Wir haben eine Datenbank – anonymisiert, und die Datenschutzbeauftragte hat zugestimmt.'),
                  minigame('db_abfrage'),
                  lexicon('datenbank'),
                  minigame('db_zaehlen'),
                  lexicon('sql'),
                  say('yilmaz', 'Und dann ist da noch deine Taubenfeder. Der Ring hat eine Vereinsnummer …'),
                  minigame('db_join'),
                  lexicon('big_data'),
                  say('yilmaz', 'Der Taubenverein Kabelitz. Drei Mitglieder. Aber das beweist noch gar nichts – Daten muss man vorsichtig deuten.'),
                  narrate('Nebenbei scrollt eine lange Besucherliste des Rechenzentrums über den Bildschirm: „… 13:40 Techniker Meier, 14:02 W. Lösch – Stollenlieferung, 14:15 Reinigung …"'),
                  say('ping', 'Opa Werner bringt ja überall seinen Stollen hin. Hehe. Gurr.'),
                  say('yilmaz', 'Letzte Frage: Unser neuer Spam-Filter ist eine KI. Weißt du, wie so etwas lernt?'),
                  minigame('ki'),
                  lexicon('ki_lernen'),
                  setFlag('k3_ki'),
                  setFlag('k3_daten'),
                  narrate('Plötzlich färbt sich die große Bildschirmwand rot. Alarm!'),
                  say('yilmaz', 'Das Rechenzentrum im Silberstollen! Dort laufen Züge, Ampeln und der Kalender des Krankenhauses. Es wird angegriffen!'),
                  say('yilmaz', 'Heute kommen wir nicht mehr hin. Morgen früh fährt der Bus nach Silberbach. Kalle wird dich am Stollen abholen.'),
                  quest('k3_schlafen'),
                ],
                [say('yilmaz', 'Morgen früh fährt der Bus nach Silberbach. Kalle wartet am Stollen auf dich.')],
              ),
            ],
          ),
        ],
      ),
    ],
  ),
];

export const pinoK3: Script = [
  when(
    { flag: 'k3_wlan' },
    [say('pino', 'Mein WLAN hat jetzt ein Passwort – steht auf der Speisekarte, nur für Gäste. Und alles läuft über HTTPS!')],
    [
      when(
        { flag: 'k3_pakete' },
        [
          say('pino', 'Ciao Alex! Frau Dr. Yilmaz hat angerufen. In meinem Gäste-WLAN liest jemand mit? Mamma mia!'),
          narrate('Mit der Paket-Lupe hältst du Pakete an. Manche kann man lesen wie eine Postkarte, andere sind verschlossen.'),
          minigame('protokolle'),
          lexicon('protokolle'),
          say('ping', 'Postkarten kann jeder lesen. Aber wie schickt man einen Schlüssel, wenn alle mitlesen?'),
          minigame('truhe'),
          narrate('Da meldet sich Tante Ada per Nachricht: „Dafür gibt es Schlüsselpaare. Ich schicke dir eins."'),
          give('schluesselpaar'),
          minigame('asymmetrisch'),
          lexicon('asymmetrisch'),
          setFlag('k3_wlan'),
          say('pino', 'Ab heute kommt ein Passwort ins WLAN, und meine Seite läuft nur noch mit HTTPS. Grazie!'),
          say('ping', 'Zurück zu Frau Dr. Yilmaz! Vielleicht findet sie heraus, wer mitliest.'),
          quest('k3_datenbank'),
        ],
        [say('pino', 'Ciao Alex! Schon ein Jahr her mit der App-Geschichte. Heute frag ich nur noch, was ich brauche!')],
      ),
    ],
  ),
];

// ---------- Schlafen und Busfahrt ----------
export const bettK3: Script = [
  when(
    { all: [{ flag: 'k3_daten' }, { not: { flag: 'k3_tag2' } }] },
    [
      narrate('Morgen geht es unter Tage. Du schläfst unruhig.'),
      interlude('Am nächsten Morgen'),
      setFlag('k3_tag2'),
      warp('alex_zimmer', 1, 2, 'down'),
      say('ping', 'Ping! Heute geht es ins Erzgebirge. Erst mit dem Bus nach Knotenburg, dann weiter nach Silberbach!'),
      quest('k3_stollen'),
    ],
    [narrate('Dein Bett. Jetzt ist keine Zeit zum Schlafen!')],
  ),
];

const nachKabelitz: Script = [interlude('Mit dem Bus zurück nach Kabelitz …'), warp('kabelitz', 27, 15, 'down')];
const nachSilberbach: Script = [interlude('Mit dem Bus hinauf ins Erzgebirge …'), warp('silberbach', 3, 9, 'right')];

export const busKnotenburgK3: Script = [
  when(
    { flag: 'k3_tag2' },
    [choice('Wohin?', [['Nach Silberbach', nachSilberbach], ['Nach Kabelitz', nachKabelitz], ['Noch bleiben', []]])],
    [choice('Mit dem Bus nach Kabelitz fahren?', [['Ja, nach Hause', nachKabelitz], ['Nein, noch bleiben', []]])],
  ),
];

export const busSilberbach: Script = [
  choice('Mit dem Bus zurück nach Knotenburg?', [
    ['Ja', [interlude('Mit dem Bus zurück nach Knotenburg …'), warp('knotenburg', 3, 16, 'right')]],
    ['Nein', []],
  ]),
];

// ---------- Silberbach und Silberstollen ----------
export const kalleScript: Script = [
  when(
    { flag: 'k3_kalle' },
    [say('kalle', 'Glück auf! Geh nur rein, ich halte hier draußen die Stellung. Die Lampe hast du ja.')],
    [
      say('kalle', 'Glück auf! Du musst Alex sein. Ich bin Kalle. Früher Bergmann, heute Admin im Rechenzentrum. Nu gloar – die Kumpel von damals würden lachen.'),
      say('kalle', 'Da drin stehen die Server für die ganze Region. Die Stollenluft hält sie schön kühl.'),
      say('kalle', 'Aber seit heute früh spielt alles verrückt: Die Gitter zwischen den Hallen sind zu, und nur wer die Rätsel an den Geräten löst, kommt weiter.'),
      say('kalle', 'Hier, nimm meine Grubenlampe. Da unten ist es duster wie im Bergwerk. Na ja – es IST ein Bergwerk. Hehe.'),
      give('grubenlampe'),
      setFlag('k3_kalle'),
      quest('k3_tiefer'),
    ],
  ),
];

export const stollenEingang: Script = [
  when({ item: 'grubenlampe' }, [warp('silberstollen', 1, 6, 'right')], [narrate('Der Eingang zum Silberstollen. Drinnen ist es stockdunkel. Ohne Lampe kommst du nicht weit.')]),
];

/** Eine Halle im Stollen: Rätsel lösen → Gitter öffnet sich. */
export function halle(flag: FlagId, text: string, spiel: string, lex?: LexiconId): Script {
  return [
    when({ flag }, [narrate('Hier ist alles wieder in Ordnung.')], [
      narrate(text),
      minigame(spiel),
      ...(lex ? [lexicon(lex)] : []),
      setFlag(flag),
      { op: 'refresh' },
      narrate('Mit einem Rattern schiebt sich das Gitter zur Seite.'),
    ]),
  ];
}

export const kernScript: Script = [
  when(
    { flag: 'kapitel3_fertig' },
    [narrate('Der Kernserver summt ruhig. Alles läuft.')],
    [
      narrate('In der letzten Halle wirbelt ein riesiger Strudel aus Datenmüll: der Paketsturm!'),
      minigame('paketsturm'),
      setFlag('k3_boss'),
      narrate('Der Sturm legt sich. Die Server surren wieder gleichmäßig.'),
      narrate('Da flackert jeder Bildschirm im Stollen gleichzeitig. Eine verzerrte Stimme:'),
      say('funkstille', 'Ihr habt mein Paketgewitter überstanden. Aber das Netz ist größer als euer Stollen. Ich packe es an der Wurzel.'),
      narrate('Dann ist es still. Nur das Summen der Server bleibt.'),
      say('kalle', 'Alex! Alles in Ordnung? Die Züge fahren wieder, und die Ampeln in Knotenburg sind grün!'),
      say('kalle', 'Übrigens: Die warme Luft aus dem Stollen heizt das Freibad unten im Tal. Wenigstens die Abwärme ist zu was gut.'),
      lexicon('nachhaltigkeit'),
      say('ping', '„An der Wurzel" … Was meint er damit? Gurr.'),
      interlude('Am Abend in Kabelitz …'),
      warp('alex_zimmer', 3, 3, 'down'),
      narrate('Tante Ada ruft an. Sie klingt ernst.'),
      say('ada', 'Alex, ich habe gehört, was im Silberstollen passiert ist. „An der Wurzel" … Das klingt nach den Root-Servern – der Wurzel des Internets.'),
      say('ada', 'Wenn du so weit bist, brauche ich dich. Aber erst mal: Schlaf dich aus. Du warst großartig.'),
      setFlag('kapitel3_fertig'),
      quest('k3_kapitel_ende'),
      interlude('Ende von Kapitel 3'),
      say('ping', 'Das Schuljahr ist bald vorbei. Wie es weitergeht, weiß deine Lehrkraft – mit dem Code für den Kalender. Gurr!'),
    ],
  ),
];

export const workK3: Script = [say('work', 'Alex! Klasse 9 – dieses Jahr geht es um Netzwerke und Datenbanken. Frau Dr. Yilmaz von KnotenNetz hat übrigens nach dir gefragt.')];


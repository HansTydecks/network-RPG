import type { MapDef } from '../../engine/world/MapDef';
import { opaK3 } from '../dialog/kapitel3';
import { emilK4 } from '../dialog/kapitel4';
import { busKabelitzK5, opaEpilog, taubenschlagFinale } from '../dialog/kapitel5';
import { choice, give, interlude, lexicon, minigame, narrate, quest, say, setFlag, take, toast, warp, when, type Command } from '../../engine/script/Script';

export const kabelitz: MapDef = {
  id: 'kabelitz',
  name: 'Kabelitz',
  outdoor: true,
  legend: {
    '.': 'gras', ',': 'gras2', '=': 'weg', '*': 'blumen', '#': 'strasse', '~': 'strasse_mitte', g: 'gully', l: 'ladestation',
    T: 'baum_ol', Y: 'baum_or', U: 'baum_ul', I: 'baum_ur', b: 'busch', z: 'zaun',
    '<': 'dach_l', '^': 'dach_m', '>': 'dach_r', '[': 'traufe_l', _: 'traufe_m', ']': 'traufe_r',
    '(': 'wand_l', w: 'wand_m', ')': 'wand_r', F: 'fenster', D: 'tuer',
    S: 'schild', P: 'briefkasten', K: 'verteilerkasten', A: 'antenne', O: 'taubenschlag_o', Q: 'taubenschlag_u',
  },
  ground: [
    '....,.........................',
    '.................,,...........',
    '......,.......,.....,.........',
    '.....,,.....**.,,...,.........',
    '..,.....,......,..............',
    '...........,...,....,......,.,',
    '..............,,....**..,.....',
    '.............,......*........,',
    '.....,=.........=.............',
    '......=.......,,=.............',
    '..*...=.........=....,........',
    ',.**..=.........=........,..,.',
    '......=.........=.........,.,.',
    '......=.........=.......=,....',
    '============g=================',
    '==============================',
    '##############################',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '##############################',
    '...,.........,.=.............,',
  ],
  deco: [
    'TYTYTYTYTYTYTYTYTYTYTYTYTYTYTY',
    'UIUIUIUIUIUIUIUIUIUIUIUIUIUIUI',
    'TY                          TY',
    'UI                       z  UI',
    'TY  <^^^>     <^^^>  A O z  TY',
    'UI  <^^^>     <^^^>    Q z  UI',
    'TY  [___]     [___]      z  TY',
    'UI  (FDF)     (FDF)      z  UI',
    'TY                 zzz zzz  TY',
    'UI       TY           <^^^> UI',
    'TY       UI  b     b  <^^^> TY',
    'UI                 b  [___] UI',
    'TY                    (FDF) TY',
    'UI S       K       P     l  UI',
    'b                             ',
    'b                             ',
    'b                             ',
    'b                             ',
    'b                             ',
    'bbbbbbbbbbbbbbb bbbbbbbbbbbbbb',
  ],
  extraSolid: [
    [16, 7],
    [24, 12],
  ],
  entities: [
    { kind: 'warp', x: 6, y: 7, to: { map: 'wohnzimmer', x: 5, y: 7, dir: 'up' } },
    { kind: 'warp', x: 15, y: 19, to: { map: 'dorfplatz', x: 15, y: 1, dir: 'down' } },
    {
      kind: 'npc',
      id: 'kowalski',
      sprite: 'kowalski',
      x: 10,
      y: 14,
      dir: 'right',
      visibleIf: { all: [{ flag: 'zettel_gefunden' }, { not: { flag: 'kvz_repariert' } }] },
      script: kowalskiScript(),
    },
    {
      kind: 'interact',
      id: 'transporter_l',
      x: 12,
      y: 16,
      tile: 'transporter_l',
      visibleIf: { all: [{ flag: 'zettel_gefunden' }, { not: { flag: 'kvz_repariert' } }] },
      script: [narrate('Der Transporter von KnotenNetz. Hinten liegen Kabelrollen und Werkzeug.')],
      scan: { name: 'transporter', klasse: 'Auto', attribute: [['farbe', 'weiß-orange'], ['firma', 'KnotenNetz']], methoden: ['fahren', 'beladen'] },
    },
    {
      kind: 'interact',
      id: 'transporter_r',
      x: 13,
      y: 16,
      tile: 'transporter_r',
      visibleIf: { all: [{ flag: 'zettel_gefunden' }, { not: { flag: 'kvz_repariert' } }] },
      script: [narrate('Der Transporter von KnotenNetz. Hinten liegen Kabelrollen und Werkzeug.')],
    },
    {
      kind: 'interact',
      id: 'gully',
      x: 12,
      y: 14,
      script: [
        when(
          { flag: 'schluessel_gefunden' },
          [narrate('Der Gully. Hier unten hat Krümel den Schlüssel gefunden.')],
          [
            when(
              { not: { flag: 'kowalski_auftrag' } },
              [narrate('Ein Gully. Unten plätschert Wasser.')],
              [
                when(
                  { item: 'block_fernbedienung' },
                  [
                    narrate('Du setzt Krümel vorsichtig durch die Klappe am Rand des Gullys.'),
                    minigame('bloecke:gully'),
                    narrate('Krümel kommt mit dem Schlüssel zurück!'),
                    give('schluessel_kvz'),
                    setFlag('schluessel_gefunden'),
                    say('ping', 'Krümel ist ein Held! Gurr!'),
                    quest('q1_zurueck_kowalski'),
                  ],
                  [narrate('Da unten glänzt etwas – Herrn Kowalskis Schlüssel! Aber deine Hand passt nicht durch das Gitter.')],
                ),
              ],
            ),
          ],
        ),
      ],
    },
    {
      kind: 'npc',
      id: 'emil',
      sprite: 'emil',
      x: 23,
      y: 13,
      dir: 'down',
      script: [when({ stufeMin: 10 }, emilK4, emilScript())],
    },
    {
      kind: 'npc',
      id: 'kruemel',
      sprite: 'kruemel',
      anim: 'kruemel_idle',
      x: 26,
      y: 13,
      dir: 'down',
      visibleIf: { not: { item: 'block_fernbedienung' } },
      script: [say('kruemel', 'Piep!'), narrate('Krümel, Emils Saugroboter. Ein kleines Lämpchen blinkt.')],
      scan: {
        name: 'kruemel',
        klasse: 'Saugroboter',
        attribute: [['akku', '80 %'], ['zustand', 'Laden'], ['besitzer', 'Emil']],
        methoden: ['vor', 'drehen', 'aufnehmen', 'zurStation'],
      },
    },
    { kind: 'interact', id: 'ladestation', x: 25, y: 13, script: [narrate('Krümels Ladestation. Ein grünes Licht leuchtet.')] },
    {
      kind: 'npc',
      id: 'opa',
      sprite: 'opa',
      x: 17,
      y: 9,
      dir: 'down',
      // Am Samstag steht Opa auf dem Dorffest.
      // Am Samstag in Kapitel 1 steht Opa auf dem Dorffest, ab Klasse 10 ist er „zur Kur".
      visibleIf: { all: [{ not: { all: [{ flag: 'tag4' }, { not: { flag: 'nacht' } }] } }, { not: { all: [{ stufeMin: 10 }, { not: { flag: 'spiel_ende' } }] } }] },
      script: opaScript(),
    },
    {
      kind: 'npc',
      id: 'morse',
      sprite: 'morse',
      anim: 'morse_idle',
      x: 20,
      y: 6,
      dir: 'down',
      script: [say('morse', 'Miau.'), narrate('Morse, Opa Werners Katze, streicht dir um die Beine und schnurrt.')],
      scan: {
        name: 'morse',
        klasse: 'Katze',
        attribute: [['farbe', 'grau getigert'], ['alter', '9 Jahre'], ['besitzer', 'Opa Werner']],
        methoden: ['miauen', 'schnurren', 'schlafen', 'maeusejagen'],
      },
    },
    {
      kind: 'interact',
      id: 'postauto_l',
      x: 8,
      y: 9,
      tile: 'postauto_l',
      visibleIf: { all: [{ flag: 'tag2' }, { not: { flag: 'krause_getroffen' } }] },
      script: [narrate('Das gelbe Postauto von Frau Krause. Es ist voller Pakete.')],
      scan: { name: 'postauto', klasse: 'Auto', attribute: [['farbe', 'gelb'], ['ladung', '38 Pakete']], methoden: ['fahren', 'hupen', 'beladen'] },
    },
    {
      kind: 'interact',
      id: 'postauto_r',
      x: 9,
      y: 9,
      tile: 'postauto_r',
      visibleIf: { all: [{ flag: 'tag2' }, { not: { flag: 'krause_getroffen' } }] },
      script: [narrate('Das gelbe Postauto von Frau Krause. Es ist voller Pakete.')],
    },
    { kind: 'interact', id: 'opa_tuer', x: 16, y: 7, script: [narrate('Opa Werners Haustür. Abgeschlossen – Opa ist ja draußen.')] },
    { kind: 'interact', id: 'emil_tuer', x: 24, y: 12, script: [narrate('Hier wohnt Emil mit seinen Eltern.')] },
    {
      kind: 'interact',
      id: 'schild',
      x: 3,
      y: 13,
      script: [narrate('„Kabelitz – Bitte fahren Sie vorsichtig."')],
      scan: { name: 'ortsschild', klasse: 'Schild', attribute: [['text', 'Kabelitz'], ['einwohner', '214']], methoden: [] },
    },
    {
      kind: 'interact',
      id: 'briefkasten',
      x: 19,
      y: 13,
      scan: {
        name: 'briefkasten',
        klasse: 'Briefkasten',
        attribute: [['farbe', 'gelb'], ['leerung', '17:00 Uhr'], ['inhalt', '3 Briefe']],
        methoden: ['einwerfen', 'leeren'],
      },
      script: [
        when(
          { all: [{ flag: 'marke_erhalten' }, { not: { flag: 'brief_eingeworfen' } }] },
          [
            narrate('Du klebst die Taubenbriefmarke auf den Umschlag und wirfst den Brief ein. Plopp!'),
            take('brief'),
            take('briefmarke'),
            setFlag('brief_eingeworfen'),
            say('ping', 'Und jetzt? Jetzt muss der Brief erst mal zu Lina reisen. Mal sehen, wie lange das dauert …'),
            interlude('Um 17 Uhr holt die Postbotin die Briefe aus dem Kasten …'),
            interlude('Am nächsten Morgen'),
            setFlag('tag2'),
            warp('alex_zimmer', 3, 3, 'down'),
            say('ping', 'Ping! Guten Morgen! Hörst du das? Es hat an der Haustür geklingelt!'),
            quest('q1_tuer'),
          ],
          [
            when(
              { all: [{ flag: 'brief_geschrieben' }, { not: { flag: 'marke_erhalten' } }] },
              [narrate('Ohne Briefmarke nimmt die Post den Brief nicht mit.')],
              [narrate('Ein gelber Briefkasten. „Leerung: 17:00 Uhr".')],
            ),
          ],
        ),
      ],
    },
    {
      kind: 'interact',
      id: 'antenne',
      x: 21,
      y: 4,
      script: [narrate('Eine große Antenne in Opa Werners Garten. „Für den Wetterbericht", sagt Opa immer.')],
      scan: {
        name: 'antenne',
        klasse: 'Antenne',
        attribute: [['hoehe', '6 m'], ['besitzer', 'Opa Werner'], ['zweck', 'Wetterbericht (sagt Opa)']],
        methoden: ['empfangen', 'senden'],
      },
    },
    {
      kind: 'interact',
      id: 'taubenschlag',
      x: 23,
      y: 5,
      script: [
        when({ all: [{ stufeMin: 11 }, { flag: 'k5_nacht' }] }, taubenschlagFinale, [narrate('Opa Werners Taubenschlag. An der Tür ist ein Tastenfeld: „Nur für Tauben". Seltsam …')]),
      ],
      scan: {
        name: 'taubenschlag',
        klasse: 'Taubenschlag',
        attribute: [['bewohner', '12 Tauben'], ['schloss', 'Tastenfeld']],
        methoden: ['oeffnen (gesperrt)'],
      },
    },
    {
      kind: 'interact',
      id: 'verteilerkasten',
      x: 11,
      y: 13,
      script: [
        when(
          { item: 'netzblick_v1' },
          [
            when(
              { flag: 'zettel_gefunden' },
              [narrate('Der aufgebrochene graue Kasten. Hier laufen alle Kabel von Kabelitz zusammen – und hier ist etwas kaputtgemacht worden.')],
              [
                narrate('Der graue Kasten ist aufgebrochen! Die Tür hängt schief, drinnen sind Kabel herausgerissen und vertauscht.'),
                say('ping', 'Gurr! Das war kein Unfall. Das hat jemand mit Absicht gemacht!'),
                narrate('Hier laufen die Kabel aus allen Häusern zusammen. Ist der Kasten kaputt, ist das ganze Dorf offline.'),
                lexicon('kabelverzweiger'),
                narrate('An der Innenseite der Tür klebt ein Zettel. Darauf eine durchgestrichene Antenne – und Buchstabensalat.'),
                give('zettel_funkstille'),
                setFlag('zettel_gefunden'),
                say('ping', '„WUHIISXQNW DOWHV IHUQPHOGHDPW"? Das ist doch kein Deutsch! Vielleicht eine Geheimschrift …'),
                say('ping', 'Wer macht so was? Und warum? Gurr …'),
                narrate('Ein weißer Transporter hält an der Straße. Ein Mann in oranger Arbeitsjacke steigt aus.'),
                quest('q1_kowalski'),
              ],
            ),
          ],
          [narrate('Ein grauer Kasten. Die stehen überall herum – aber was ist da eigentlich drin? Die Tür steht einen Spalt offen. Komisch.')],
        ),
      ],
    },
    {
      kind: 'interact',
      id: 'bushalt',
      x: 27,
      y: 14,
      tile: 'bushalt',
      script: [
        when({ stufeMin: 11 }, busKabelitzK5, [
        when(
          { stufeMin: 8 },
          [
            when(
              { flag: 'k2_ada_update' },
              [
                choice('Mit dem Bus nach Knotenburg fahren?', [
                  ['Ja, los!', [interlude('Mit dem Bus nach Knotenburg …'), warp('knotenburg', 3, 16, 'right')]],
                  ['Nein, noch nicht', []],
                ]),
              ],
              [say('ping', 'Warte! Erst geht es an deinen Computer – Tante Ada ruft an!')],
            ),
          ],
          [narrate('Bushaltestelle „Kabelitz Dorfstraße". Hier fährt der Bus nach Knotenburg ab. Heute brauchst du ihn nicht.')],
        ),
        ]),
      ],
      scan: { name: 'bushaltestelle', klasse: 'Haltestelle', attribute: [['linie', '42 nach Knotenburg'], ['takt', 'jede Stunde']], methoden: ['warten'] },
    },
    {
      kind: 'trigger',
      id: 'ortsausgang',
      x: 29,
      y: 15,
      activeIf: { not: { stufeMin: 8 } },
      script: [say('ping', 'Da geht es nach Knotenburg. Aber heute bleiben wir in Kabelitz. Gurr!'), { op: 'turn', dir: 'left' }],
    },
  ],
  net: {
    devices: [
      { id: 'alex', x: 5, y: 7, label: 'Heimnetz Familie' },
      { id: 'opa', x: 15, y: 7, label: 'Haus Lösch' },
      { id: 'emil', x: 23, y: 12, label: 'Haus Emil' },
      { id: 'kvz', x: 11, y: 13, label: 'Kabelverzweiger' },
      { id: 'stadt', x: 29, y: 15, label: 'Richtung Knotenburg' },
    ],
    cables: [
      { from: 'alex', to: 'kvz', medium: 'kupfer', brokenUnless: 'kvz_repariert', path: [[5, 7], [5, 14], [11, 14], [11, 13]] },
      { from: 'opa', to: 'kvz', medium: 'kupfer', brokenUnless: 'kvz_repariert', path: [[15, 7], [15, 14], [11, 14], [11, 13]] },
      { from: 'emil', to: 'kvz', medium: 'kupfer', brokenUnless: 'kvz_repariert', path: [[23, 12], [23, 14], [11, 14], [11, 13]] },
      { from: 'kvz', to: 'stadt', medium: 'glasfaser', brokenUnless: 'kvz_repariert', path: [[11, 13], [11, 15], [29, 15]] },
    ],
  },
};

function opaScript() {
  return [
    when({ flag: 'spiel_ende' }, opaEpilog, [
    when({ stufeMin: 9 }, opaK3, [
    when({ stufeMin: 8 }, opaKapitel2(), [
    when(
      { flag: 'nacht' },
      [say('opa', 'Nanu, so spät noch unterwegs? Ab ins Bett mit dir. Ich geh auch gleich schlafen … ganz bestimmt.')],
      [when({ flag: 'kvz_repariert' }, opaNachReparatur(), opaVorher())],
    ),
    ]),
    ]),
    ]),
  ];
}

function opaKapitel2(): Command[] {
  return [
    when(
      { flag: 'k2_stick_abgegeben' },
      [
        say('opa', 'Na, wie war\'s in der großen Stadt? Viel gelernt?'),
        narrate('Du erzählst von Herrn Work – und vom USB-Stick mit der durchgestrichenen Antenne.'),
        say('opa', 'So, so. Eine Antenne mit Strich … Na, das wird wohl ein Dummejungenstreich gewesen sein. Nu mach dir mal keinen Kopf.'),
        narrate('(Opa Werner schaut schnell zu seinem Taubenschlag.)'),
      ],
      [
        say('opa', 'Na, Alex! Heute geht\'s aufs Gymnasium in die Stadt, was? Mensch, wie die Zeit vergeht.'),
        say('opa', 'In Knotenburg haben sie ja an jeder Ecke Computer. Pass mir bloß auf dich auf!'),
      ],
    ),
  ];
}

function opaNachReparatur(): Command[] {
  return [
    say('opa', 'Das Internet ist wieder da? Na, toll. Dann starren alle wieder auf ihre Bildschirme.'),
    say('opa', 'War schön ruhig die letzten Tage, findest du nicht? Die Leute haben sich wieder unterhalten. Sogar Briefe geschrieben!'),
    narrate('(Opa Werner klingt fast ein bisschen enttäuscht.)'),
  ];
}

function opaVorher(): Command[] {
  return [
    when(
      { not: { flag: 'mama_gesprochen' } },
      [
        say('opa', 'Na, Alex! Schon wach? Ping hat mich heute früh schon besucht, die olle Taube.'),
        say('opa', 'Die fliegt immer noch zu meinem Taubenschlag. Kann eben nicht vergessen, wo sie herkommt.'),
        say('ping', 'Gurr …'),
        setFlag('opa_begruesst'),
      ],
      [
        when(
          { not: { flag: 'idee_brief' } },
          [
            say('opa', 'Na, das Internet ist wohl weg, was?'),
            narrate('(Woher weiß Opa Werner das eigentlich?)'),
            narrate('Du erzählst ihm von deinem Geburtstag und dass du Lina einladen willst.'),
            say('opa', 'Dann schreib Lina doch einen Brief! Wie früher. Mit Papier, Umschlag und Briefmarke.'),
            say('opa', 'So ein Brief kommt immer an. Ganz ohne Internet. Hehe.'),
            say('ping', 'Einen Brief? Gute Idee! An deinem Schreibtisch oben liegt Papier.'),
            setFlag('idee_brief'),
            quest('q1_brief'),
          ],
          [
            when(
              { not: { flag: 'brief_geschrieben' } },
              [say('opa', 'Na los, schreib deinen Brief! Und vergiss die Adresse nicht.')],
              [
                when(
                  { not: { flag: 'marke_erhalten' } },
                  [
                    say('opa', 'Eine Briefmarke? Aber sicher doch!'),
                    narrate('Opa Werner holt ein dickes Album aus dem Haus. Hunderte Briefmarken, sauber einsortiert.'),
                    say('opa', 'Hier, die mit der Brieftaube. Die passt zu dir.'),
                    give('briefmarke'),
                    setFlag('marke_erhalten'),
                    say('opa', 'Endlich schreibt mal wieder einer richtige Briefe! Früher, da hat man sich Mühe gegeben. Heute tippen alle nur noch auf ihren Handys rum.'),
                    say('opa', 'Der Briefkasten ist unten am Weg. Um fünf wird geleert.'),
                    quest('q1_einwerfen'),
                  ],
                  [
                    when(
                      { not: { flag: 'brief_eingeworfen' } },
                      [say('opa', 'Um fünf wird der Briefkasten geleert. Nicht trödeln!')],
                      [
                        when(
                          { item: 'netzblick_v1' },
                          [
                            when(
                              { flag: 'zettel_gefunden' },
                              [
                                say('opa', 'Der graue Kasten? Aufgebrochen, sagst du? Na so was.'),
                                say('opa', 'Tja … vielleicht ist das ja ein Zeichen. Ein bisschen Ruhe tut uns allen gut.'),
                              ],
                              [
                                say('opa', 'Was hast du denn da für \'ne Brille, Kind? Sieht aus wie aus\'m Fernsehen.'),
                                say('opa', 'Na ja … Hauptsache, du setzt sie auch mal ab und guckst dir die echte Welt an.'),
                              ],
                            ),
                          ],
                          [say('opa', 'Na, hat die Post deinen Brief abgeholt? Wirst sehen, Lina freut sich mehr darüber als über jede Nachricht auf dem Handy.')],
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ],
    ),
  ];
}

/** Welche Aufgabe für Herrn Kowalski ist als Nächstes dran? */
function naechsteAufgabe(): Command {
  return when({ flag: 'kvz_repariert' }, [], [
    when(
    { not: { flag: 'binaer_gelernt' } },
    [quest('q1_museum')],
    [
      when(
        { not: { flag: 'schluessel_gefunden' } },
        [when({ item: 'block_fernbedienung' }, [quest('q1_gully')], [quest('q1_emil')])],
        [
          when(
            { flag: 'tag3' },
            [when({ flag: 'kabelbinder_gekauft' }, [quest('q1_reparatur')], [when({ bytesMin: 2000 }, [quest('q1_kaufen')], [quest('q1_bytes')])])],
            [when({ flag: 'laden_zu_gesehen' }, [quest('q1_schlafen')], [quest('q1_kabelbinder')])],
          ),
        ],
      ),
    ],
    ),
  ]);
}

function kowalskiScript() {
  return [
    when(
      { not: { flag: 'kowalski_auftrag' } },
      [
        say('kowalski', 'Kowalski, von KnotenNetz. Ich soll hier die Störung beheben – ganz Kabelitz ist ja offline.'),
        say('kowalski', 'Oh je. Aufgebrochen! Und die Kabel rausgerissen. Wer macht denn so was?'),
        say('kowalski', 'Reparieren kann ich das. Aber mir fehlen drei Sachen.'),
        narrate('Er zeigt in den Kasten. Neben jedem Anschluss klebt ein Schild: 00000101, 00001100, 00010011 …'),
        say('kowalski', 'Erstens: Die alten Anschlüsse sind nur mit Nullen und Einsen beschriftet. Welches Kabel wohin gehört, steht auf meinem Tablet – und das braucht Internet. Haha.'),
        say('kowalski', 'Zweitens: Der Schlüssel fürs Innenfach ist mir in den Gully gefallen. Da kommt keine Hand durch.'),
        say('kowalski', 'Und drittens: Meine Kabelbinder sind alle.'),
        say('ping', 'Nullen und Einsen … Frau Fröhlich im Dorfmuseum weiß bestimmt, was das bedeutet! Das Museum ist am Dorfplatz, südlich von hier.'),
        setFlag('kowalski_auftrag'),
        naechsteAufgabe(),
      ],
      [
        when(
          { not: { flag: 'binaer_gelernt' } },
          [say('kowalski', 'Kannst du die Nullen und Einsen schon lesen? Frag im Dorfmuseum nach!')],
          [
            when(
              { not: { flag: 'schluessel_gefunden' } },
              [
                say('kowalski', 'Du kannst jetzt Binärzahlen lesen? Klasse! Dann finden wir gleich heraus, welches Kabel wohin gehört.'),
                when(
                  { item: 'block_fernbedienung' },
                  [say('kowalski', 'Und du hast einen Saugroboter dabei? Perfekt – der passt bestimmt in den Gully! Das Gitter ist gleich rechts von mir.')],
                  [say('kowalski', 'Bleibt der Schlüssel im Gully. Da müsste was Kleines rein … So ein Staubsaugerroboter vielleicht, haha.'), say('ping', 'Emils Krümel! Emil spielt doch immer vor seinem Haus.')],
                ),
              ],
              [
                when({ item: 'kabelbinder' }, reparatur(), [
                  when(
                    { flag: 'laden_zu_gesehen' },
                    [say('kowalski', 'Der Laden hatte zu? So ein Pech. Ich schlafe heute im Gasthof. Morgen früh bin ich wieder hier!')],
                    [
                      say('kowalski', 'Mein Schlüssel! Danke dir – und dem kleinen Roboter.'),
                      say('kowalski', 'Jetzt fehlen nur noch Kabelbinder. Gibt\'s hier im Dorf einen Laden?'),
                      say('ping', 'Der Dorfladen am Dorfplatz!'),
                    ],
                  ),
                ]),
              ],
            ),
          ],
        ),
        naechsteAufgabe(),
      ],
    ),
  ];
}

/** Kabelsalat, Reset-Knopf – und Kabelitz ist wieder online. */
function reparatur(): Command[] {
  return [
    say('kowalski', 'Kabelbinder! Klasse, dann kann es losgehen.'),
    take('kabelbinder'),
    narrate('Herr Kowalski öffnet das Innenfach. Lose Kabel hängen heraus, jedes mit einer Nummer. An den Anschlüssen kleben die Schilder mit Nullen und Einsen.'),
    say('kowalski', 'Die Kabel haben normale Nummern, die Anschlüsse aber Binärzahlen. Hilfst du mir? Du hast doch die Binär-Karte!'),
    minigame('kabelsalat'),
    setFlag('kabelsalat_fertig'),
    say('kowalski', 'Alle Kabel stecken und sind festgezurrt. Jetzt muss nur noch jemand den Reset-Knopf drücken.'),
    say('kowalski', 'Der sitzt ganz hinten im Kasten. Da komme ich mit meinen Wurstfingern nicht hin.'),
    say('ping', 'Das ist ein Job für Krümel!'),
    minigame('bloecke:kasten'),
    narrate('Klick! Im Kasten leuchtet ein Lämpchen nach dem anderen grün auf.'),
    say('kowalski', 'Wir haben wieder Verbindung! Kabelitz ist online. Danke, Alex – und danke, Krümel!'),
    setFlag('kvz_repariert'),
    { op: 'refresh' },
    toast('Kabelitz ist wieder online!'),
    say('ping', 'Setz mal die Brille auf! Aus dem Kasten fließen Daten in jedes Haus. Gurr!'),
    say('ping', 'Und Tante Ada wartet bestimmt auf ein Dankeschön für die Brille. Dein Computer hat jetzt wieder Internet!'),
    quest('q1_email'),
  ];
}

function emilScript() {
  const ausleihen: Command = when(
    { all: [{ flag: 'kowalski_auftrag' }, { flag: 'kruemel_repariert' }, { not: { item: 'block_fernbedienung' } }, { not: { flag: 'schluessel_gefunden' } }] },
    [
      narrate('Du erzählst Emil vom Schlüssel im Gully.'),
      say('emil', 'Krümel soll in den Gully? Klar, leih ihn dir aus! Und die Fernbedienung auch. Aber bring ihn heil zurück!'),
      give('block_fernbedienung'),
      quest('q1_gully'),
    ],
  );
  return [
    when(
      { not: { flag: 'kruemel_repariert' } },
      [
        say('emil', 'Alex! Krümel ist kaputt! Er saugt immer weiter, bis der Akku leer ist, und dann bleibt er einfach liegen.'),
        say('emil', 'Und jetzt hat Papa auch noch sein Programm gelöscht. Mit dieser Fernbedienung da.'),
        narrate('Emil zeigt dir die Block-Fernbedienung. Darauf steckt man Befehle hintereinander – wie Bausteine.'),
        say('emil', 'Kannst du Krümel zum Sandkasten schicken? Ich weiß genau, wie er fahren muss!'),
        setFlag('emil_gesprochen'),
        minigame('bloecke:garten'),
        lexicon('algorithmus'),
        setFlag('kruemel_programmiert'),
        say('emil', 'Juhu, er fährt! Aber warum bleibt er nachher immer liegen?'),
        say('ping', 'In der Anleitung ist ein Zustandsdiagramm. Vielleicht fehlt da ein Pfeil …'),
        minigame('zustand:kruemel'),
        lexicon('zustandsdiagramm'),
        setFlag('kruemel_repariert'),
        say('emil', 'Er fährt zur Ladestation! Krümel ist wieder gesund!'),
        ausleihen,
      ],
      [
        when(
          { flag: 'schluessel_gefunden' },
          [
            when(
              { flag: 'kvz_repariert' },
              [say('emil', 'Krümel hat das Internet repariert? Er ist der schlaueste Roboter der Welt! Du darfst ihn behalten, solange du ihn brauchst.')],
              [say('emil', 'Krümel hat den Schlüssel gefunden? Er ist der schlaueste Roboter der Welt!')],
            ),
          ],
          [say('emil', 'Krümel fährt jetzt immer brav zur Ladestation. Danke!'), ausleihen],
        ),
      ],
    ),
  ];
}

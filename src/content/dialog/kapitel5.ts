/**
 * Kapitel 5 (Oberstufe): „Einmal um die Welt" – und das Finale in Kabelitz.
 */
import { give, interlude, lexicon, minigame, narrate, quest, say, setFlag, warp, when, type Script } from '../../engine/script/Script';
import type { FlagId, MapId } from '../registry';

export const KAPITEL5_START: Script = [
  interlude('Sommerferien …'),
  interlude('Ein Jahr später: Alex ist in der Oberstufe.'),
  warp('alex_zimmer', 3, 3, 'down'),
  say('ping', 'Ping! Der Koffer ist gepackt. Heute geht es los – einmal um die Welt!'),
  narrate('Tante Ada steht schon unten im Wohnzimmer.'),
  say('ada', 'Bereit, Alex? Vorher noch ein letztes Update für die Brille: Weltsicht!'),
  give('netzblick_v4'),
  say('ada', 'Jetzt siehst du, welche Wege die Pakete rund um den Globus nehmen. Wir fangen in Frankfurt an – am größten Internetknoten Europas.'),
  say('ada', 'Und Alex: Irgendwer bereitet einen Angriff auf die Namensauflösung vor. Auf die Wurzel des Internets. Wir müssen herausfinden, wer.'),
  warp('weltkarte', 14, 4, 'down'),
  say('ping', 'Die ganze Welt! Frankfurt ist gleich links neben uns. Setz die Brille auf (N), dann siehst du die Namen der Knoten und die großen Leitungen. Gurr!'),
  quest('k5_frankfurt'),
];

// ---------- Weltkarte ----------
function reise(ziel: MapId, x: number, y: number, text: string, noetig?: FlagId): Script {
  const los: Script = [interlude(text), warp(ziel, x, y, 'up')];
  return noetig ? [when({ flag: noetig }, los, [say('ping', 'Dahin geht es später. Eins nach dem anderen!')])] : los;
}

export const zielFrankfurt = reise('frankfurt', 6, 7, 'Frankfurt am Main');
export const zielLandestation = reise('landestation', 7, 7, 'Die Küste am Atlantik', 'k5_frankfurt');
export const zielIsland = reise('island', 6, 7, 'Island', 'k5_seekabel');
export const zielTokio = reise('tokio', 6, 7, 'Tokio', 'k5_island');
export const zielSydney = reise('sydney', 6, 7, 'Sydney', 'k5_tokio');

export const zielKabelitz: Script = [
  when(
    { all: [{ flag: 'k5_sydney' }, { not: { flag: 'spiel_ende' } }] },
    [
      interlude('24 Stunden Flug. Ein Paket schafft die Strecke in 150 Millisekunden.'),
      interlude('Kabelitz, 23 Uhr'),
      setFlag('k5_nacht'),
      warp('kabelitz', 23, 6, 'up'),
      narrate('Kabelitz liegt still im Dunkeln. Nur oben am Taubenschlag blinkt ein kleines rotes Licht.'),
      say('ping', 'Das ist der Schlag, in dem ich aufgewachsen bin … Das Tastenfeld: „Nur für Tauben". Ich kenne meine Ringnummer! Sie endet auf 042.'),
      quest('k5_taubenschlag'),
    ],
    [interlude('Zurück nach Hause'), warp('kabelitz', 27, 15, 'down')],
  ),
];

export const busKabelitzK5: Script = [
  when({ not: { flag: 'k5_nacht' } }, [interlude('Zum Flughafen …'), warp('weltkarte', 15, 6, 'down')], [narrate('Um diese Uhrzeit fährt kein Bus mehr.')]),
];

// ---------- Frankfurt ----------
export const adaFrankfurt: Script = [
  when(
    { flag: 'k5_frankfurt' },
    [say('ada', 'Die Landestation am Atlantik meldet einen Kabelbruch. Wir sehen uns dort!')],
    [
      say('ada', 'Willkommen im Internetknoten! Hier tauschen hunderte Netze ihre Daten aus – jede Sekunde mehr, als in alle Bücher der Welt passt.'),
      say('ada', 'Bevor wir FUNKSTILLE jagen, schauen wir uns das große Bild an: Netze sind Graphen.'),
      minigame('topologien'),
      lexicon('topologien'),
      minigame('ipv4_binaer'),
      lexicon('ipv4_ipv6'),
      minigame('dhcp'),
      lexicon('dhcp'),
      say('ada', 'Hier, setz die mal auf: eine Subnetzmaske. Eine echte! Sie verdeckt den Geräteteil jeder Adresse.'),
      give('subnetzmaske'),
      minigame('subnetz'),
      lexicon('subnetting'),
      narrate('Alarm! Auf dem Bildschirm leitet eine neue Route tausende Pakete in eine Sackgasse.'),
      minigame('lpm'),
      lexicon('routingtabellen'),
      setFlag('k5_frankfurt'),
      say('ada', 'Das war FUNKSTILLE. Und jetzt die nächste Meldung: Ein Schiff hat mit dem Anker ein Seekabel beschädigt – nach einem gefälschten Funkspruch!'),
      quest('k5_seekabel'),
    ],
  ),
];

// ---------- Landestation ----------
export const kapitaeninScript: Script = [
  when(
    { flag: 'k5_seekabel' },
    [say('kapitaenin', 'Das Kabel ist geflickt. Bon voyage, Alex!')],
    [
      say('kapitaenin', 'Bonjour! Kapitänin Moreau. Mein Schiff sollte ausweichen – ein Funkspruch sagte, hier liege nichts. Und dann hing unser Anker am Seekabel.'),
      say('kapitaenin', 'Der Reparaturroboter ist bereit. Aber schau mal durch die Brille in die Faser.'),
      minigame('lichtwellenleiter'),
      lexicon('lichtwellenleiter'),
      minigame('vermittlung'),
      lexicon('paketvermittlung'),
      narrate('Der Roboter schweißt die Fasern zusammen. Im Netzblick fließt das Licht wieder durch den Atlantik.'),
      say('ada', 'Ich muss Daten nach Frankfurt schicken – aber hier gibt es nur das offene WLAN vom Gasthaus.'),
      minigame('vpn'),
      lexicon('vpn'),
      setFlag('k5_seekabel'),
      say('ada', 'Oh nein … Meine Forschungsdaten im Rechenzentrum auf Island sind verschlüsselt worden. Und die neueste Sicherung ist weg!'),
      quest('k5_island'),
    ],
  ),
];

// ---------- Island ----------
export const sigrunScript: Script = [
  when(
    { flag: 'k5_island' },
    [say('sigrun', 'Die Daten sind gerettet. Gute Reise nach Tokio!')],
    [
      say('sigrun', 'Hallo, ich bin Sigrun. Unser Rechenzentrum wird mit Erdwärme gekühlt und mit Wasserkraft betrieben. Grüner geht es kaum.'),
      say('sigrun', 'Aber FUNKSTILLE hat zugeschlagen. Lass uns erst verstehen, was genau passiert ist.'),
      minigame('schutzziele'),
      lexicon('schutzziele'),
      minigame('backup'),
      lexicon('backup'),
      minigame('hash'),
      lexicon('hash'),
      minigame('blockchain'),
      lexicon('blockchain'),
      say('sigrun', 'Und noch etwas: FUNKSTILLE postet seit Tagen Taubenfotos. Harmlos? Ich habe mir die Pixel angesehen …'),
      minigame('steganografie'),
      lexicon('steganografie'),
      setFlag('k5_island'),
      say('ada', 'Mitternacht. Heute. „Der Große Stecker" – er will die Wurzel vergiften. Die Root-Server! Wir müssen nach Tokio.'),
      quest('k5_tokio'),
    ],
  ),
];

// ---------- Tokio ----------
export const satoScript: Script = [
  when(
    { flag: 'k5_tokio' },
    [say('sato', 'Die Wurzel hält. Aber die Pakete kamen von weit her. Frag in Sydney nach!')],
    [
      say('sato', 'Konnichiwa, Alex. Ich bin Frau Sato. Hier steht eine Kopie eines Root-Servers – die Wurzel des Namensbaums.'),
      minigame('dns_baum'),
      lexicon('dns_hierarchie'),
      minigame('cache_vergiftung'),
      narrate('Eine neue Nachricht von FUNKSTILLE trifft ein – als Zeichensalat.'),
      minigame('kodierung'),
      lexicon('zeichenkodierung'),
      say('sato', 'Wir sichern die Verbindung zu den anderen Root-Servern ab.'),
      minigame('tls'),
      lexicon('tls'),
      minigame('zertifikat'),
      lexicon('zertifikate'),
      setFlag('k5_tokio'),
      say('sato', 'Unsere Kollegin in Sydney hat die Pakete zurückverfolgt. Sie wartet im Café am Hafen.'),
      quest('k5_sydney'),
    ],
  ),
];

// ---------- Sydney: die Wendung ----------
export const leonScript: Script = [
  when(
    { flag: 'k5_sydney' },
    [say('leon', 'Bitte, Alex … sprich mit meinem Opa. Sag ihm, dass ich ihn vermisse.')],
    [
      say('leon', 'G\'day! Zwei Kaffee? Ihr seid doch die Leute aus Deutschland, oder? Die Kollegin kommt gleich.'),
      narrate('Da klingelt dein Handy. Eine unbekannte Nummer.'),
      minigame('social_engineering'),
      lexicon('social_engineering'),
      say('leon', 'Ich hab einen komischen Brief bekommen. Verschlüsselt. Ohne Absender. Könnt ihr damit was anfangen?'),
      minigame('haeufigkeit'),
      lexicon('kryptoanalyse'),
      say('leon', '„Das Netz schweigt bald." Gruselig. Wer schreibt denn so was?'),
      minigame('webtech'),
      lexicon('webtechnologien'),
      say('ada', 'Unsere Kollegin hat den Kompass hiergelassen. Damit verfolgen wir die Pakete zurück.'),
      give('traceroute_kompass'),
      minigame('traceroute'),
      lexicon('traceroute'),
      say('leon', 'Kabelitz? Da wohnt mein Opa! Der geht nie an Videoanrufe. Er sagt, das Internet sei schuld, dass wir uns verloren haben.'),
      say('leon', 'Dabei ist es das Einzige, was uns noch verbindet. Hier, das ist er.'),
      narrate('Leon zeigt dir ein Foto. Ein älterer Mann in Strickjacke, eine Taube auf der Schulter. Opa Werner.'),
      say('leon', 'Werner Lösch. Mein Opa.'),
      narrate('Du ziehst die Postkarte „aus Bad Elster" hervor. Der verwischte Poststempel: „…itz". Wie auf deinem Brief an Lina damals. Kabelitz.'),
      say('ping', 'Opa Werner … ist FUNKSTILLE. G-gurr …'),
      narrate('Ping lässt den Kopf hängen.'),
      say('ada', 'Es ist 20 Uhr in Kabelitz, wenn wir landen. Um Mitternacht will er den Großen Stecker ziehen. Wir müssen sofort los!'),
      setFlag('k5_sydney'),
      setFlag('k5_leon'),
      quest('k5_heim'),
    ],
  ),
];

// ---------- Finale in Kabelitz ----------
export const taubenschlagFinale: Script = [
  when(
    { flag: 'k5_keller' },
    [warp('opas_keller', 7, 12, 'up')],
    [
      narrate('Das Tastenfeld leuchtet: „Nur für Tauben". Acht kleine Tasten, jede mit einer Lampe.'),
      minigame('bitschloss:4'),
      narrate('Klick! Unter dem Taubenschlag öffnet sich eine Luke. Eine Treppe führt nach unten.'),
      setFlag('k5_keller'),
      warp('opas_keller', 7, 12, 'up'),
      say('ping', 'Ich war hier schon mal … als ganz junge Taube. Hier unten hat Opa immer gesessen.'),
      quest('k5_keller'),
    ],
  ),
];

/** Ein Raum im Keller: Rätsel → Tür öffnet sich. */
export function kellerRaum(flag: FlagId, text: string, spiel: string): Script {
  return [
    when({ flag }, [narrate('Hier ist das Rätsel schon gelöst.')], [narrate(text), minigame(spiel), setFlag(flag), { op: 'refresh' }, narrate('Die Tür zum nächsten Raum springt auf.')]),
  ];
}

export const opaFinale: Script = [
  when(
    { flag: 'spiel_ende' },
    [say('opa', 'Na, Alex. Danke, dass du gekommen bist. Wirklich.')],
    [
      narrate('Im letzten Raum: ein alter Klappenschrank, ein Fernschreiber, blinkende Server. Und in einem Sessel, Morse auf dem Schoß, ein Teller Stollen auf dem Tisch …'),
      say('opa', 'Na, Alex. Ich hab schon gedacht, du kommst gar nicht mehr zum Kaffee.'),
      say('ping', 'Opa Werner …'),
      say('opa', 'Ja. Ich bin FUNKSTILLE. Um Mitternacht beantwortet jeder Root-Server jede Anfrage mit „funkstille". Dann findet niemand mehr etwas.'),
      say('opa', 'Dann gucken die Leute wieder hoch. Reden miteinander. Schreiben Briefe. So wie du damals, weißt du noch?'),
      minigame('streitgespraech'),
      setFlag('k5_streit'),
      narrate('Du zeigst Opa Werner Leons Foto. Und die Nachricht: „Ich vermisse dich, Opa."'),
      say('opa', '… Leon.'),
      narrate('Lange sagt niemand etwas. Nur die Server summen.'),
      say('opa', 'Ich … ich halte es auf. Aber …'),
      narrate('Auf dem Bildschirm läuft ein Countdown: 00:03:00.'),
      say('opa', 'Ich hab das Passwort so lang gemacht, dass ich es selber nicht mehr weiß. Das habt ihr ja alle gelernt: lang ist sicher. Verflixt.'),
      say('ada', 'Alex, ich bin per VPN zugeschaltet – aus Tokio, bei Frau Sato. Wir schaffen das zusammen!'),
      minigame('grosser_stecker'),
      setFlag('k5_stecker'),
      narrate('00:00:02. Stille. Dann: Das Internet bleibt an.'),
      narrate('Im Netzblick fährt dein Blick zurück: vom Kabel unter Kabelitz über den grauen Kasten, Knotenburg, den Silberstollen, Frankfurt, das Seekabel bis nach Tokio und Sydney. Die ganze Welt leuchtet.'),
      say('ping', 'Gurr … GURR! Wir haben es geschafft!'),
      narrate('Du baust auf Opas Laptop einen Videoanruf auf. Die Pakete reisen durch das Seekabel, das ihr repariert habt – bis nach Sydney.'),
      say('leon', 'Opa? … Opa! Du bist es wirklich!'),
      say('opa', 'Nu guck mal an. Da isser ja. … Leon, mein Junge.'),
      narrate('Opa Werner weint. Leon auch. Und Ping sitzt auf der Sessellehne und gurrt leise.'),
      setFlag('spiel_ende'),
      interlude('Einige Wochen später …'),
      warp('kabelitz', 17, 10, 'up'),
      narrate('Phishing ist eine Straftat. Opa Werner hat sich der Polizei gestellt, alle Zugangsdaten zurückgegeben und sich öffentlich beim Dorffest entschuldigt.'),
      narrate('Seine Sozialstunden leistet er im Dorfmuseum: Mit Frau Fröhlich gibt er den Kurs „Briefe schreiben & sicher surfen". Er ist ausgebucht.'),
      say('opa', 'Weißt du, Alex: Briefe und das Internet – beides hat seinen Wert. Hauptsache, man redet miteinander.'),
      say('opa', 'Und jeden Sonntag um zehn ruft Leon an. Per Video. Ich hab sogar gelernt, wie man die Kamera anmacht. Hehe.'),
      quest('k5_ende'),
      interlude('NETZBLICK – Alex und die Funkstille'),
      interlude('Eine Geschichte über Netze, die Menschen verbinden.'),
      interlude('Danke fürs Spielen!'),
      say('ping', 'Ping! Du hast alles geschafft, Alex. Von der Briefmarke bis zum Root-Server. Ich bin stolz auf dich. Gurr!'),
    ],
  ),
];

export const opaEpilog: Script = [
  say('opa', 'Na, Alex? Soll ich dir mal erzählen, wie wir früher im Fernmeldeamt Gespräche gestöpselt haben? Mit Kabeln, von Hand!'),
  say('opa', 'Das Internet macht das heute mit Paketen. Millionen pro Sekunde. Nu, gloar – auch nicht schlecht.'),
];

export const mamaK5: Script = [
  when(
    { flag: 'spiel_ende' },
    [say('mama', 'Opa Werner hat heute Stollen vorbeigebracht. Und er hat gefragt, wie man Videoanrufe macht. Ich glaube, es geht ihm besser.')],
    [say('mama', 'Pass gut auf dich auf auf deiner Reise, Alex! Und schreib mal – von mir aus auch eine E-Mail.')],
  ),
];

export const workK5: Script = [say('work', 'Oberstufe! Und du reist mit Tante Ada um die Welt? Wenn du zurück bist, erzählst du uns alles – im Informatik-Kurs.')];


import { lexicon, quest, say, setFlag, when } from '../../engine/script/Script';

/** Beim ersten Aufsetzen der Brille draußen: Die Kabel leuchten – aber nichts fließt. */
export const NETZBLICK_ERSTMALS = [
  say('ping', 'Gurr!! Alles ist blau – und da leuchten Linien unter der Erde!'),
  say('ping', 'Das sind Kabel. Die liegen hier schon immer. Man sieht sie nur normalerweise nicht.'),
  say('ping', 'Aber schau: Sie sind rot und gestrichelt. Und nichts bewegt sich darauf. Da stimmt was nicht!'),
  say('ping', 'Die Kabel aus allen Häusern laufen zu einem Punkt unten am Weg. Da müssen wir hin!'),
  setFlag('netzblick_erklaert'),
  setFlag('netz_defekt_gesehen'),
  lexicon('kabel'),
  when({ not: { flag: 'zettel_gefunden' } }, [quest('q1_kasten')]),
];

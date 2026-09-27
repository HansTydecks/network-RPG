import { lexicon, say, setFlag } from '../../engine/script/Script';

/** Wird beim ersten Aufsetzen der Brille auf einer Karte mit Kabeln abgespielt. */
export const NETZBLICK_ERSTMALS = [
  say('ping', 'Gurr!! Alles ist blau – und da leuchten Linien unter der Erde!'),
  say('ping', 'Das sind Kabel. Die liegen hier schon immer. Man sieht sie nur normalerweise nicht.'),
  say('ping', 'Und die kleinen gelben Umschläge, die da entlangflitzen? Keine Ahnung … Vielleicht finden wir es heraus!'),
  setFlag('netzblick_erklaert'),
  lexicon('kabel'),
];

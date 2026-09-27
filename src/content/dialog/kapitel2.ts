import { interlude, narrate, quest, say, warp, type Script } from '../../engine/script/Script';

/** Läuft, nachdem der Kalender auf Klasse 8 umgeblättert wurde. */
export const KAPITEL2_START: Script = [
  interlude('Sommerferien …'),
  interlude('Ein Jahr später: Alex kommt in Klasse 8 – aufs Gymnasium in Knotenburg!'),
  warp('alex_zimmer', 3, 3, 'down'),
  say('ping', 'Ping! Aufwachen, Alex! Heute ist dein erster Schultag am Gymnasium in Knotenburg!'),
  narrate('Auf dem Schreibtisch liegt noch der Zettel mit der durchgestrichenen Antenne. Von FUNKSTILLE hat man seit dem Dorffest nichts mehr gehört.'),
  say('ping', 'Hörst du das? Dein Computer piept. Das ist bestimmt Tante Ada!'),
  quest('k2_ada'),
];

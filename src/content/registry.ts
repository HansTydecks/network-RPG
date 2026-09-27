/**
 * Register für den Speichercode.
 * WICHTIG: Nur hinten anfügen, nie umsortieren oder löschen – sonst werden alte
 * Speichercodes aus den Heftern ungültig. Nicht mehr genutzte Einträge bleiben stehen.
 */
export const MAP_IDS = ['alex_zimmer', 'kabelitz', 'wohnzimmer', 'briefzentrum', 'dorfplatz', 'museum'] as const;

export const ITEM_IDS = [
  'netzblick_v1',
  'brief',
  'briefmarke',
  'zettel_funkstille',
  'binaer_karte',
  'block_fernbedienung',
  'schluessel_kvz',
  'restauriertes_foto',
] as const;

export const FLAG_IDS = [
  // M0 (Testversion)
  'intro_gesehen',
  'ping_dabei',
  'paket_geoeffnet',
  'netzblick_erklaert',
  'opa_begruesst',
  'kvz_gesehen',
  // Kapitel 1
  'prolog_gesehen',
  'mama_gesprochen',
  'idee_brief',
  'brief_geschrieben',
  'marke_erhalten',
  'brief_eingeworfen',
  'tag2',
  'krause_getroffen',
  'paket_erhalten',
  'briefzentrum_fertig',
  'zurueck_zuhause',
  'brille_gebaut',
  'netz_defekt_gesehen',
  'scan_erklaert',
  'zettel_gefunden',
  'kvz_repariert',
  'papa_gesprochen',
  'router_gesehen',
  // Kapitel 1, M2a
  'kowalski_auftrag',
  'froehlich_gesprochen',
  'schloss1',
  'schloss2',
  'schloss3',
  'pixelwand_geloest',
  'geheimtext_geloest',
  'binaer_gelernt',
  'foto_restauriert',
  'exp_schickard',
  'exp_pascal',
  'exp_leibniz',
  'exp_lovelace',
  'exp_zuse',
  'exp_turing',
  'exp_neumann',
  'pioniere_belohnt',
  'emil_gesprochen',
  'kruemel_programmiert',
  'kruemel_repariert',
  'schluessel_gefunden',
  'schacht_gesehen',
  'fernschreiber_gesehen',
  'foto_auftrag',
] as const;

export const LEXICON_IDS = [
  'kabel',
  'kabelverzweiger',
  'information_daten',
  'uebertragung',
  'eva',
  'betriebssystem',
  'objekt',
  'binaerzahlen',
  'bilder_als_zahlen',
  'text_als_zahlen',
  'pioniere',
  'algorithmus',
  'zustandsdiagramm',
  'farbkanaele',
] as const;

export const QUEST_IDS = [
  'm0_zimmer',
  'm0_draussen',
  'm0_kabel',
  'm0_fertig',
  'q1_mama',
  'q1_lina',
  'q1_brief',
  'q1_marke',
  'q1_einwerfen',
  'q1_tuer',
  'q1_sortieren',
  'q1_paket',
  'q1_brille',
  'q1_kasten',
  'q1_fortsetzung',
  'q1_kowalski',
  'q1_museum',
  'q1_archiv',
  'q1_zurueck_kowalski',
  'q1_emil',
  'q1_gully',
  'q1_kabelbinder',
] as const;

export type MapId = (typeof MAP_IDS)[number];
export type ItemId = (typeof ITEM_IDS)[number];
export type FlagId = (typeof FLAG_IDS)[number];
export type LexiconId = (typeof LEXICON_IDS)[number];
export type QuestId = (typeof QUEST_IDS)[number];

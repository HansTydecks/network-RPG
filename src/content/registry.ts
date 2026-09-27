/**
 * Register für den Speichercode.
 * WICHTIG: Nur hinten anfügen, nie umsortieren oder löschen – sonst werden alte
 * Speichercodes aus den Heftern ungültig. Nicht mehr genutzte Einträge bleiben stehen.
 */
export const MAP_IDS = ['alex_zimmer', 'kabelitz'] as const;

export const ITEM_IDS = ['netzblick_v1'] as const;

export const FLAG_IDS = [
  'intro_gesehen',
  'ping_dabei',
  'paket_geoeffnet',
  'netzblick_erklaert',
  'opa_begruesst',
  'kvz_gesehen',
] as const;

export const LEXICON_IDS = ['kabel', 'kabelverzweiger'] as const;

export const QUEST_IDS = ['m0_zimmer', 'm0_draussen', 'm0_kabel', 'm0_fertig'] as const;

export type MapId = (typeof MAP_IDS)[number];
export type ItemId = (typeof ITEM_IDS)[number];
export type FlagId = (typeof FLAG_IDS)[number];
export type LexiconId = (typeof LEXICON_IDS)[number];
export type QuestId = (typeof QUEST_IDS)[number];

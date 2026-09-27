import type { FlagId, ItemId, LexiconId } from './registry';
import type { Script } from '../engine/script/Script';
import { LEXICON } from './lexicon';
import { KAPITEL2_START } from './dialog/kapitel2';
import { KAPITEL3_START } from './dialog/kapitel3';
import { FLAG_IDS } from './registry';

/**
 * Startzustand eines Kapitels. Wer mit dem Kalender-Code direkt in ein Kapitel springt
 * (z. B. eine neue 8. Klasse ohne alten Spielstand), bekommt alles aus den früheren Kapiteln.
 */
export interface KapitelStart {
  /** Flag, das anzeigt, dass dieses Kapitel begonnen hat. */
  startFlag: FlagId;
  items: ItemId[];
  /** Gegenstände, die am Kapitelanfang nicht mehr im Rucksack sind. */
  wegnehmen?: ItemId[];
  flags: FlagId[];
  lexicon: LexiconId[];
  intro: Script;
}

const lexiconBis = (stufe: number) => (Object.keys(LEXICON) as LexiconId[]).filter((id) => LEXICON[id].stufe <= stufe && id !== 'betriebssystem');

const KAPITEL1_FLAGS: FlagId[] = [
  'intro_gesehen', 'ping_dabei', 'netzblick_erklaert', 'opa_begruesst', 'prolog_gesehen', 'mama_gesprochen', 'idee_brief',
  'brief_geschrieben', 'marke_erhalten', 'brief_eingeworfen', 'tag2', 'krause_getroffen', 'paket_erhalten', 'briefzentrum_fertig',
  'zurueck_zuhause', 'brille_gebaut', 'scan_erklaert', 'zettel_gefunden', 'kvz_repariert', 'kowalski_auftrag', 'froehlich_gesprochen',
  'schloss1', 'schloss2', 'schloss3', 'pixelwand_geloest', 'geheimtext_geloest', 'binaer_gelernt', 'emil_gesprochen',
  'kruemel_programmiert', 'kruemel_repariert', 'schluessel_gefunden', 'laden_zu_gesehen', 'tag3', 'nguyen_gesprochen',
  'pfand_repariert', 'kabelbinder_gekauft', 'kabelsalat_fertig', 'email_gesendet', 'tag4', 'lina_da', 'plakat_fertig',
  'geburtstag_gefeiert', 'nacht', 'kapitel1_fertig',
];

export const KAPITEL_START: Record<number, KapitelStart> = {
  8: {
    startFlag: 'k2_start',
    items: ['netzblick_v1', 'binaer_karte', 'block_fernbedienung', 'zettel_funkstille', 'usb_stick'],
    flags: [...KAPITEL1_FLAGS, 'k2_start'],
    lexicon: lexiconBis(7),
    intro: KAPITEL2_START,
  },
  9: {
    startFlag: 'k3_start',
    items: ['netzblick_v1', 'netzblick_v2', 'binaer_karte', 'block_fernbedienung', 'zettel_funkstille', 'usb_stick', 'echtheitslupe', 'caesar_scheibe', 'taubenfeder', 'schluessel7'],
    wegnehmen: ['fremder_stick'],
    flags: [...KAPITEL1_FLAGS, ...flagsVon('k2'), 'kapitel2_fertig', 'k3_start'],
    lexicon: lexiconBis(8),
    intro: KAPITEL3_START,
  },
};

/** Alle Flags eines Kapitels (z. B. „k2" für k2_… und k2b_…/k2c_…). */
function flagsVon(praefix: string): FlagId[] {
  return FLAG_IDS.filter((f) => f.startsWith(praefix));
}

/** Höchste Klassenstufe, deren Kapitel es schon gibt (höchstens die gewünschte). */
export function verfuegbareStufe(stufe: number): number {
  let s = stufe;
  while (s > 8 && !KAPITEL_START[s]) s--;
  return s;
}

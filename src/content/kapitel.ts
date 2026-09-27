import type { FlagId, ItemId, LexiconId } from './registry';
import { LEXICON } from './lexicon';

/**
 * Startzustand eines Kapitels. Wer mit dem Kalender-Code direkt in ein Kapitel springt
 * (z. B. eine neue 8. Klasse ohne alten Spielstand), bekommt alles aus den früheren Kapiteln.
 */
export interface KapitelStart {
  items: ItemId[];
  flags: FlagId[];
  lexicon: LexiconId[];
}

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
    items: ['netzblick_v1', 'binaer_karte', 'block_fernbedienung', 'zettel_funkstille', 'usb_stick'],
    flags: [...KAPITEL1_FLAGS, 'k2_start'],
    lexicon: (Object.keys(LEXICON) as LexiconId[]).filter((id) => LEXICON[id].stufe === 7 && id !== 'betriebssystem'),
  },
};

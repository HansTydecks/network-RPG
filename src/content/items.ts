import type { ItemId } from './registry';

export interface ItemDef {
  name: string;
  beschreibung: string;
  icon: string;
}

export const ITEMS: Record<ItemId, ItemDef> = {
  netzblick_v1: {
    name: 'NetzBlick-Brille',
    beschreibung: 'Ein Prototyp von Tante Ada. Macht Kabel, Geräte und Daten sichtbar. Taste N: aufsetzen/absetzen. Mit aufgesetzter Brille zeigt Leertaste die Objektkarte eines Dings.',
    icon: 'icon_netzblick_v1',
  },
  brief: {
    name: 'Brief an Lina',
    beschreibung: 'Deine Einladung zum Geburtstag am Samstag. Adressiert an Lina Wagner, Lindenweg 7, 09400 Knotenburg.',
    icon: 'icon_brief',
  },
  briefmarke: {
    name: 'Briefmarke',
    beschreibung: 'Eine Briefmarke mit einer Brieftaube darauf. Aus Opa Werners Sammlung.',
    icon: 'icon_briefmarke',
  },
  zettel_funkstille: {
    name: 'Seltsamer Zettel',
    beschreibung: 'Lag am grauen Kasten. Darauf eine durchgestrichene Antenne und: „WUHIISXQNW DOWHV IHUQPHOGHDPW". Unlesbar – noch.',
    icon: 'icon_zettel',
  },
};

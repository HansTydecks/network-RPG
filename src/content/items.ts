import type { ItemId } from './registry';

export interface ItemDef {
  name: string;
  beschreibung: string;
  icon: string;
}

export const ITEMS: Record<ItemId, ItemDef> = {
  netzblick_v1: {
    name: 'NetzBlick-Brille',
    beschreibung: 'Ein Prototyp von Tante Ada. Macht Kabel, Geräte und Daten sichtbar. Taste N: aufsetzen/absetzen.',
    icon: 'icon_netzblick_v1',
  },
};

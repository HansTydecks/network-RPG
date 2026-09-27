import type { Dir } from '../state/GameState';
import type { MapId } from '../../content/registry';
import type { Cond, Script } from '../script/Script';

/**
 * Kartenformat: ASCII-Raster je Ebene + Legende + Entities + Netzgraph.
 * So lassen sich Karten als Text lesen und ändern.
 */
export interface MapDef {
  id: MapId;
  name: string;
  /** Zeichen → Kachel-ID (siehe content/art/tiles.ts). Leerzeichen = keine Kachel (nur deco). */
  legend: Record<string, string>;
  ground: string[];
  deco?: string[];
  entities: EntityDef[];
  net?: NetDef;
  /** Script beim Betreten der Karte (z. B. Einführung). */
  onEnter?: Script;
  /** Zusätzlich blockierte Kacheln (z. B. verschlossene Türen). */
  extraSolid?: [number, number][];
  /** Draußen: Tageszeit färbt die Karte ein. */
  outdoor?: boolean;
  /** Hintergrundfarbe außerhalb kleiner Karten. */
  outside?: string;
}

export type EntityDef = NpcDef | InteractDef | WarpDef | TriggerDef;

/** Objektkarte, die die Brille beim Anschauen zeigt (Klasse – Objekt – Attribut – Methode). */
export interface ScanData {
  name: string;
  klasse: string;
  attribute: [string, string][];
  methoden: string[];
}

export interface NpcDef {
  kind: 'npc';
  id: string;
  /** Figur (char_…) oder Tier-Sprite mit eigener Animation. */
  sprite: string;
  /** Für Tiere: Animationsname statt Laufanimation. */
  anim?: string;
  x: number;
  y: number;
  dir: Dir;
  script: Script;
  /** Nur sichtbar, wenn diese Bedingung erfüllt ist. */
  visibleIf?: Cond;
  scan?: ScanData;
}

/** Etwas zum Untersuchen (A-Taste davor), z. B. Schild, Kalender, Computer. */
export interface InteractDef {
  kind: 'interact';
  id: string;
  x: number;
  y: number;
  script: Script;
  /** Optional als Gegenstand gezeichnet (Kachel-ID); blockiert dann den Weg. */
  tile?: string;
  visibleIf?: Cond;
  scan?: ScanData;
}

export interface WarpDef {
  kind: 'warp';
  x: number;
  y: number;
  to: { map: MapId; x: number; y: number; dir: Dir };
}

/** Wird beim Betreten der Kachel ausgelöst. */
export interface TriggerDef {
  kind: 'trigger';
  id: string;
  x: number;
  y: number;
  script: Script;
  /** Nur aktiv, wenn diese Bedingung erfüllt ist. */
  activeIf?: Cond;
}

export interface NetDevice {
  id: string;
  x: number;
  y: number;
  label: string;
}

export interface NetCable {
  from: string;
  to: string;
  /** Kachelkoordinaten, durch die das Kabel läuft (inkl. Start und Ziel). */
  path: [number, number][];
  medium: 'kupfer' | 'glasfaser';
  /** Solange dieses Flag gesetzt ist, ist das Kabel unterbrochen. */
  brokenFlag?: string;
  /** Das Kabel ist unterbrochen, bis dieses Flag gesetzt ist. */
  brokenUnless?: string;
}

/** Funkquelle (z. B. WLAN), sichtbar ab Brille v2. Reichweite in Kacheln. */
export interface NetFunk {
  x: number;
  y: number;
  reichweite: number;
  label: string;
}

export interface NetDef {
  devices: NetDevice[];
  cables: NetCable[];
  funk?: NetFunk[];
}

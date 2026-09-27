import type { Dir } from '../state/GameState';
import type { MapId } from '../../content/registry';
import type { Script } from '../script/Script';

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
  /** Hintergrundfarbe außerhalb kleiner Karten. */
  outside?: string;
}

export type EntityDef = NpcDef | InteractDef | WarpDef | TriggerDef;

export interface NpcDef {
  kind: 'npc';
  id: string;
  sprite: string;
  x: number;
  y: number;
  dir: Dir;
  script: Script;
  /** Nur sichtbar, wenn diese Bedingung erfüllt ist. */
  visibleIf?: (flags: ReadonlySet<string>) => boolean;
}

/** Etwas zum Untersuchen (A-Taste davor), z. B. Schild, Kalender, Computer. */
export interface InteractDef {
  kind: 'interact';
  id: string;
  x: number;
  y: number;
  script: Script;
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
}

export interface NetDef {
  devices: NetDevice[];
  cables: NetCable[];
}

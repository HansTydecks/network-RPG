import type { MapDef } from '../../engine/world/MapDef';
import type { MapId } from '../registry';
import { alexZimmer } from './alex_zimmer';
import { kabelitz } from './kabelitz';

export const MAPS: Record<MapId, MapDef> = {
  alex_zimmer: alexZimmer,
  kabelitz,
};

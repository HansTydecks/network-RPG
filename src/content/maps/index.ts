import type { MapDef } from '../../engine/world/MapDef';
import type { MapId } from '../registry';
import { alexZimmer } from './alex_zimmer';
import { kabelitz } from './kabelitz';
import { wohnzimmer } from './wohnzimmer';
import { briefzentrum } from './briefzentrum';
import { dorfplatz } from './dorfplatz';
import { museum } from './museum';
import { dorfladen } from './dorfladen';
import { knotenburg } from './knotenburg';
import { gymnasium } from './gymnasium';

export const MAPS: Record<MapId, MapDef> = {
  alex_zimmer: alexZimmer,
  kabelitz,
  wohnzimmer,
  briefzentrum,
  dorfplatz,
  museum,
  dorfladen,
  knotenburg,
  gymnasium,
};

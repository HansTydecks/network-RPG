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
import { bibliothek } from './bibliothek';
import { fernmeldeamt } from './fernmeldeamt';
import { netzleitstelle } from './netzleitstelle';
import { silberbach } from './silberbach';
import { silberstollen } from './silberstollen';
import { werkstatt } from './werkstatt';
import { weltkarte } from './weltkarte';
import { frankfurt } from './frankfurt';
import { landestation } from './landestation';
import { island } from './island';
import { tokio } from './tokio';
import { sydney } from './sydney';
import { opas_keller } from './opas_keller';

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
  bibliothek,
  fernmeldeamt,
  netzleitstelle,
  silberbach,
  silberstollen,
  werkstatt,
  weltkarte,
  frankfurt,
  landestation,
  island,
  tokio,
  sydney,
  opas_keller,
};

import { describe, expect, it } from 'vitest';
import { MAPS } from '../../src/content/maps';
import { parseMap, ueberlagerungen } from '../../src/engine/world/mapUtil';
import { TILES } from '../../src/content/art/tiles';
import { PixBuf } from '../../src/engine/gfx/pixbuf';
import { plastisch, schlagschatten } from '../../src/engine/gfx/veredeln';
import { mix, mitAlpha } from '../../src/engine/gfx/farbe';

const zaehle = (m: number[][], praefix: string) => m.flat().filter((i) => i >= 0 && TILES[i].id.startsWith(praefix)).length;

describe('Grafik-Feinschliff', () => {
  it('Farben mischen und Transparenz', () => {
    expect(mix('#000000', '#ffffff', 0.5)).toBe('#808080');
    expect(mitAlpha('#1a1c2c', 0.5)).toBe('#1a1c2c80');
  });

  it('Licht oben, Schatten unten, Schlagschatten nach rechts unten', () => {
    const b = new PixBuf(6, 6);
    b.rect(1, 1, 3, 3, '#808080');
    const p = plastisch(b);
    expect(p.get(2, 1)).not.toBe('#808080');
    expect(p.get(2, 2)).toBe('#808080');
    const s = schlagschatten(p);
    expect(s.get(4, 4)?.length).toBe(9);
    expect(s.get(0, 0)).toBeNull();
  });

  it('Wege bekommen Grasränder, Wände Schatten, Meere Küsten', () => {
    expect(zaehle(ueberlagerungen(parseMap(MAPS.kabelitz)).kanten, 'kante_')).toBeGreaterThan(10);
    expect(zaehle(ueberlagerungen(parseMap(MAPS.wohnzimmer)).schatten, 'ao_')).toBeGreaterThan(5);
    expect(zaehle(ueberlagerungen(parseMap(MAPS.weltkarte)).kanten, 'kueste_')).toBeGreaterThan(10);
  });

  it('Überlagerungen kommen in keiner Karte direkt vor', () => {
    for (const m of Object.values(MAPS)) for (const id of Object.values(m.legend)) expect(id).not.toMatch(/^(kante|kueste|ao)_/);
  });
});

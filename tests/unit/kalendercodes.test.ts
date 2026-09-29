import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { checkCalendarCode } from '../../src/engine/state/CalendarCodes';
import { CALENDAR_CODES } from '../../src/content/calendarCodes';

const STUFE: Record<string, number> = { 'Klasse 8': 8, 'Klasse 9': 9, 'Klasse 10': 10, Oberstufe: 11 };

describe('Kalender-Codes in docs/KALENDER-CODES.md', () => {
  const zeilen = [...readFileSync('docs/KALENDER-CODES.md', 'utf8').matchAll(/^\| (Klasse \d+|Oberstufe) \| `([^`]+)` \|/gm)];

  it('alle vier Stufen stehen in der Tabelle', () => {
    expect(zeilen.map((z) => STUFE[z[1]]).sort((a, b) => a - b)).toEqual([8, 9, 10, 11]);
  });

  for (const [, name, code] of zeilen)
    it(`${name}: ${code} schaltet genau diese Stufe frei`, () => {
      expect(checkCalendarCode(code, CALENDAR_CODES)).toBe(STUFE[name]);
      expect(checkCalendarCode(code.toLowerCase(), CALENDAR_CODES)).toBe(STUFE[name]);
      expect(code).toMatch(/^[A-Z0-9]{4,12}$/);
    });
});

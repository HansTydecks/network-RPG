import { describe, expect, it } from 'vitest';
import { checkCalendarCode, hashCalendarCode } from '../../src/engine/state/CalendarCodes';
import { CALENDAR_CODES } from '../../src/content/calendarCodes';

describe('Kalender-Codes', () => {
  const entries = [{ stufe: 8 as const, hash: hashCalendarCode('TEST-CODE') }];

  it('akzeptiert den richtigen Code, auch klein und ohne Bindestrich', () => {
    expect(checkCalendarCode('TEST-CODE', entries)).toBe(8);
    expect(checkCalendarCode('testc0de', entries)).toBe(8);
  });

  it('lehnt falsche Codes ab', () => {
    expect(checkCalendarCode('TEST-CODF', entries)).toBeNull();
  });

  it('im Spiel sind nur Hashwerte hinterlegt, je Stufe genau einer', () => {
    expect(CALENDAR_CODES.map((c) => c.stufe)).toEqual([8, 9, 10, 11]);
    for (const c of CALENDAR_CODES) expect(c.hash).toMatch(/^[0-9a-f]{64}$/);
  });
});

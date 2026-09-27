import { describe, expect, it } from 'vitest';
import { Story } from './helfer/story';

describe('Story-Simulation Kapitel 2', () => {
  it('M3a: vom Kalender bis nach Hause', async () => {
    const s = new Story();
    await s.kapitel(8);
    expect(s.state.questId).toBe('k2_ada');
    await s.an('alex_zimmer', 'computer');
    expect(s.state.items.has('netzblick_v2')).toBe(true);
    await s.an('kabelitz', 'bushalt');
    expect(s.state.mapId).toBe('knotenburg');
    expect(s.state.questId).toBe('k2_schule');
    await s.an('gymnasium', 'work');
    await s.an('gymnasium', 'pc0');
    await s.an('gymnasium', 'work');
    expect(s.state.questId).toBe('k2_kanal');
    await s.an('knotenburg', 'kanal');
    expect(s.log.minispiele).toEqual(expect.arrayContaining(['algorithmus', 'clientserver', 'bloecke:kanal1', 'bloecke:kanal2']));
    await s.an('gymnasium', 'work');
    expect(s.hat('k2_stick_abgegeben')).toBe(true);
    await s.an('knotenburg', 'bushalt');
    expect(s.state.mapId).toBe('kabelitz');
    await s.an('wohnzimmer', 'mama');
    expect(s.state.questId).toBe('k2_fortsetzung');
    await s.an('dorfplatz', 'kabelschacht');
    expect(s.state.items.has('schluessel7')).toBe(true);
  });
  it('M3b und M3c: Dienstag, Mittwoch und das Fernmeldeamt bis zum Kapitelende', async () => {
    const s = new Story();
    await s.kapitel(8);
    for (const [m, id] of [
      ['alex_zimmer', 'computer'],
      ['gymnasium', 'work'],
      ['gymnasium', 'pc0'],
      ['gymnasium', 'work'],
      ['knotenburg', 'kanal'],
      ['gymnasium', 'work'],
      ['wohnzimmer', 'mama'],
    ] as const)
      await s.an(m, id);
    // Dienstag
    await s.an('alex_zimmer', 'bett');
    expect(s.hat('k2_dienstag')).toBe(true);
    expect(s.state.questId).toBe('k2b_schule');
    await s.an('gymnasium', 'work');
    expect(s.hat('k2b_mail')).toBe(true);
    await s.an('gymnasium', 'pc3');
    expect(s.hat('k2b_ipmac')).toBe(true);
    await s.an('gymnasium', 'work');
    expect(s.state.questId).toBe('k2b_markt');
    expect(s.state.items.has('echtheitslupe')).toBe(true);
    await s.an('knotenburg', 'berger', [1]);
    await s.an('knotenburg', 'passant', [1]);
    await s.an('knotenburg', 'jonas_markt', [1]);
    expect(s.state.questId).toBe('k2b_rathaus');
    await s.an('knotenburg', 'schulz');
    expect(s.state.questId).toBe('k2b_pino');
    await s.an('knotenburg', 'pino');
    expect(s.state.questId).toBe('k2b_heim');
    // Mittwoch
    await s.an('alex_zimmer', 'bett');
    expect(s.hat('k2_mittwoch')).toBe(true);
    expect(s.state.questId).toBe('k2c_bibliothek');
    await s.an('knotenburg', 'bibliothek');
    expect(s.state.mapId).toBe('bibliothek');
    await s.an('bibliothek', 'weber');
    await s.an('bibliothek', 'bib_pc');
    expect(s.state.questId).toBe('k2c_lange');
    await s.an('knotenburg', 'lange');
    expect(s.state.questId).toBe('k2c_schule');
    await s.an('gymnasium', 'work', [2]);
    expect(s.hat('k2c_kollaboration')).toBe(true);
    await s.an('gymnasium', 'sommer');
    expect(s.hat('k2c_caesar')).toBe(true);
    // Schlüssel 7 wurde in M3a nicht geholt → erst in den Kabelschacht
    expect(s.state.questId).toBe('k2c_schluessel');
    await s.an('dorfplatz', 'kabelschacht');
    expect(s.state.questId).toBe('k2c_fernmeldeamt');
    await s.an('knotenburg', 'fernmeldeamt');
    expect(s.state.mapId).toBe('fernmeldeamt');
    await s.an('fernmeldeamt', 'laptop');
    expect(s.hat('kapitel2_fertig')).toBe(true);
    expect(s.state.questId).toBe('k2_kapitel_ende');
    expect(s.state.items.has('taubenfeder')).toBe(true);
    for (const id of ['mailwerkstatt', 'adressen', 'ipmac', 'pakete', 'phishing', 'fahrradschloss', 'bruteforce', 'passwort', 'pizza', 'suche', 'bilddetektiv', 'metadaten', 'kollaboration', 'caesar_zettel', 'domains', 'mailfilter'])
      expect(s.log.minispiele, id).toContain(id);
  });
});

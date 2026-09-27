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

describe('Story-Simulation Kapitel 3', () => {
  it('vom Kalender Klasse 9 bis zum Paketsturm', async () => {
    const s = new Story();
    await s.kapitel(9);
    expect(s.state.questId).toBe('k3_ada');
    expect(s.state.items.has('fremder_stick')).toBe(false);
    await s.an('alex_zimmer', 'computer');
    expect(s.state.questId).toBe('k3_router');
    await s.an('wohnzimmer', 'router');
    expect(s.state.questId).toBe('k3_opa');
    await s.an('kabelitz', 'opa');
    expect(s.state.questId).toBe('k3_leitstelle');
    await s.an('kabelitz', 'bushalt');
    expect(s.state.mapId).toBe('knotenburg');
    await s.an('knotenburg', 'fernmeldeamt');
    expect(s.state.mapId).toBe('netzleitstelle');
    await s.an('netzleitstelle', 'yilmaz');
    expect(s.state.questId).toBe('k3_wlan');
    await s.an('knotenburg', 'pino');
    expect(s.state.questId).toBe('k3_datenbank');
    await s.an('netzleitstelle', 'yilmaz');
    expect(s.state.questId).toBe('k3_schlafen');
    await s.an('alex_zimmer', 'bett');
    expect(s.state.questId).toBe('k3_stollen');
    await s.an('knotenburg', 'bushalt');
    expect(s.state.mapId).toBe('silberbach');
    await s.an('silberbach', 'kalle');
    await s.an('silberbach', 'eingang');
    expect(s.state.mapId).toBe('silberstollen');
    for (const h of ['halle1', 'halle2', 'halle3', 'halle4', 'halle5']) await s.an('silberstollen', h);
    await s.an('silberstollen', 'kern');
    expect(s.hat('kapitel3_fertig')).toBe(true);
    expect(s.state.questId).toBe('k3_kapitel_ende');
    for (const id of ['heimnetz', 'pan_lan_wan', 'zweifaktor', 'tcp', 'routing', 'p2p', 'protokolle', 'truhe', 'asymmetrisch', 'db_abfrage', 'db_zaehlen', 'db_join', 'ki', 'medien', 'switch_router', 'schleife', 'filter', 'dns', 'paketsturm'])
      expect(s.log.minispiele, id).toContain(id);
  });
});

describe('Story-Simulation Kapitel 4', () => {
  it('vom Kalender Klasse 10 bis zum Reisepass', async () => {
    const s = new Story();
    await s.kapitel(10);
    expect(s.state.questId).toBe('k4_werkstatt');
    expect(s.state.items.has('postkarte')).toBe(true);
    await s.an('kabelitz', 'bushalt');
    expect(s.state.mapId).toBe('knotenburg');
    await s.an('knotenburg', 'fabrikweg');
    expect(s.state.mapId).toBe('werkstatt');
    await s.an('werkstatt', 'kevin');
    expect(s.state.questId).toBe('k4_html');
    await s.an('werkstatt', 'schubert');
    expect(s.state.questId).toBe('k4_regex');
    await s.an('werkstatt', 'lina_k4');
    expect(s.state.questId).toBe('k4_chat');
    await s.an('werkstatt', 'kevin');
    expect(s.state.questId).toBe('k4_stimme');
    await s.an('werkstatt', 'kevin');
    expect(s.hat('kapitel4_fertig')).toBe(true);
    expect(s.state.items.has('reisepass')).toBe(true);
    await s.an('kabelitz', 'emil');
    expect(s.hat('k4_emil')).toBe(true);
    for (const id of ['datentypen', 'fehlermeldung', 'unterprogramm', 'robotik', 'html_struktur', 'html_barriere', 'css', 'regex_finden', 'regex_validieren', 'chatserver', 'chatbot', 'binaersuche', 'bedingungen', 'stadtbus', 'stimme'])
      expect(s.log.minispiele, id).toContain(id);
  });
  it('Opa ist ab Klasse 10 „zur Kur" und nicht in Kabelitz', async () => {
    const s = new Story();
    await s.kapitel(10);
    await expect(s.an('kabelitz', 'opa')).rejects.toThrow(/nicht sichtbar/);
  });
});

describe('Story-Simulation Kapitel 5 und Finale', () => {
  it('Weltreise, Taubenschlag, Keller, Streitgespräch und Abspann', async () => {
    const s = new Story();
    await s.kapitel(11);
    expect(s.state.mapId).toBe('weltkarte');
    expect(s.state.items.has('netzblick_v4')).toBe(true);
    // Reihenfolge ist erzwungen: Sydney geht noch nicht
    await s.an('weltkarte', 'ziel_sydney');
    expect(s.state.mapId).toBe('weltkarte');
    for (const [ziel, karte, npc] of [
      ['ziel_frankfurt', 'frankfurt', 'ada_ffm'],
      ['ziel_landestation', 'landestation', 'kapitaenin'],
      ['ziel_island', 'island', 'sigrun'],
      ['ziel_tokio', 'tokio', 'sato'],
      ['ziel_sydney', 'sydney', 'leon'],
    ] as const) {
      await s.an('weltkarte', ziel);
      expect(s.state.mapId).toBe(karte);
      await s.an(karte, npc);
    }
    expect(s.state.questId).toBe('k5_heim');
    await s.an('weltkarte', 'ziel_kabelitz');
    expect(s.state.mapId).toBe('kabelitz');
    expect(s.hat('k5_nacht')).toBe(true);
    await s.an('kabelitz', 'taubenschlag');
    expect(s.state.mapId).toBe('opas_keller');
    for (const r of ['raum1', 'raum2', 'raum3', 'raum4']) await s.an('opas_keller', r);
    await s.an('opas_keller', 'opa_keller');
    expect(s.hat('spiel_ende')).toBe(true);
    expect(s.state.questId).toBe('k5_ende');
    // Nach dem Finale ist Opa wieder im Garten
    await s.an('kabelitz', 'opa');
    // Auch am Spielende passt der Speichercode in die Code-Eingabe
    const { encodeSaveCode } = await import('../../src/engine/state/SaveCode');
    const code = encodeSaveCode(s.state).replace(/-/g, '');
    expect(code.length).toBeLessThanOrEqual(64);
    for (const id of ['topologien', 'ipv4_binaer', 'dhcp', 'subnetz', 'lpm', 'lichtwellenleiter', 'vermittlung', 'vpn', 'schutzziele', 'backup', 'hash', 'blockchain', 'steganografie', 'dns_baum', 'cache_vergiftung', 'kodierung', 'tls', 'zertifikat', 'social_engineering', 'haeufigkeit', 'webtech', 'traceroute', 'bitschloss:4', 'raum_adressen', 'raum_schluessel', 'raum_maschinen', 'raum_wahrheit', 'streitgespraech', 'grosser_stecker'])
      expect(s.log.minispiele, id).toContain(id);
  });
});

describe('Alle Minispiele kommen in der Geschichte vor', () => {
  it('jedes datenbasierte Minispiel wird von mindestens einem Script gestartet', async () => {
    const { SPIEL_DEFS } = await import('../../src/content/spiele');
    const { MAPS } = await import('../../src/content/maps');
    const { KAPITEL_START } = await import('../../src/content/kapitel');
    const benutzt = new Set<string>();
    const walk = (sc: import('../../src/engine/script/Script').Script) => {
      for (const c of sc) {
        if (c.op === 'minigame') benutzt.add(c.id.split(':')[0]);
        if (c.op === 'if') {
          walk(c.then);
          walk(c.else ?? []);
        }
        if (c.op === 'choice') for (const o of c.options) walk(o.then);
      }
    };
    for (const m of Object.values(MAPS)) {
      walk(m.onEnter ?? []);
      for (const e of m.entities) if ('script' in e) walk(e.script);
    }
    for (const k of Object.values(KAPITEL_START)) walk(k.intro);
    for (const id of Object.keys(SPIEL_DEFS)) expect(benutzt.has(id), id).toBe(true);
  });
});

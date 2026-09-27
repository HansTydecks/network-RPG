import { describe, expect, it } from 'vitest';
import { decodeSaveCode, encodeSaveCode } from '../../src/engine/state/SaveCode';
import { newGameState } from '../../src/engine/state/GameState';
import { decodeBase32, encodeBase32, normalizeCode } from '../../src/engine/state/base32';

describe('Base32', () => {
  it('Roundtrip beliebiger Bytes', () => {
    const bytes = new Uint8Array([0, 1, 2, 250, 255, 128, 7]);
    expect(decodeBase32(encodeBase32(bytes))?.slice(0, bytes.length)).toEqual(bytes);
  });
  it('normalisiert verwechselbare Zeichen', () => {
    expect(normalizeCode('ab-o1 il')).toBe('AB0111');
  });
});

describe('Speichercode', () => {
  it('Roundtrip eines Spielstands', () => {
    const s = newGameState();
    s.mapId = 'kabelitz';
    s.x = 17;
    s.y = 9;
    s.dir = 'left';
    s.stufe = 9;
    s.bytes = 1234;
    s.questId = 'm0_kabel';
    s.flags.add('ping_dabei').add('kvz_gesehen');
    s.items.add('netzblick_v1');
    s.lexicon.add('kabelverzweiger');
    const code = encodeSaveCode(s);
    expect(code).toMatch(/^[0-9A-Z]{1,4}(-[0-9A-Z]{1,4})*$/);
    const back = decodeSaveCode(code.toLowerCase());
    expect(back).not.toBeNull();
    expect(back!.mapId).toBe('kabelitz');
    expect([back!.x, back!.y, back!.dir, back!.stufe, back!.bytes, back!.questId]).toEqual([17, 9, 'left', 9, 1234, 'm0_kabel']);
    expect([...back!.flags].sort()).toEqual(['kvz_gesehen', 'ping_dabei']);
    expect([...back!.items]).toEqual(['netzblick_v1']);
    expect([...back!.lexicon]).toEqual(['kabelverzweiger']);
  });

  it('erkennt Tippfehler über die Prüfsumme', () => {
    const code = encodeSaveCode(newGameState());
    const chars = code.split('');
    const i = chars.findIndex((c) => c !== '-');
    chars[i] = chars[i] === 'A' ? 'B' : 'A';
    expect(decodeSaveCode(chars.join(''))).toBeNull();
  });

  it('lehnt Unsinn ab', () => {
    expect(decodeSaveCode('')).toBeNull();
    expect(decodeSaveCode('HALLO-WELT')).toBeNull();
    expect(decodeSaveCode('ÄÄÄÄ')).toBeNull();
  });
});

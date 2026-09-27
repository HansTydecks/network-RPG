import { FLAG_IDS, ITEM_IDS, LEXICON_IDS, MAP_IDS, QUEST_IDS } from '../../content/registry';
import { crc8, decodeBase32, encodeBase32, groupCode, normalizeCode } from './base32';
import { DIRS, newGameState, type GameState, type Stufe } from './GameState';

/**
 * Speichercode im Stil alter Nintendo-Passwörter.
 * Aufbau (Bits): Version 4 | Stufe 3 | Karte 6 | x 7 | y 7 | Richtung 2 | Bytes 16 | Quest 8 |
 *                Anzahl+Bits Flags | Anzahl+Bits Items | Anzahl+Bits Netzbuch, danach CRC-8.
 * Die Anzahlen stehen mit im Code, damit alte Codes gültig bleiben, wenn die Register wachsen.
 * Version 2 speichert die Mengen lauflängenkodiert (Elias-Gamma): Weil Flags meist in der
 * Reihenfolge der Geschichte gesetzt werden, bleibt der Code auch im letzten Kapitel kurz.
 * Version-1-Codes aus älteren Heftern werden weiter gelesen.
 */
const VERSION = 2;

class BitWriter {
  bits: number[] = [];
  write(value: number, width: number) {
    for (let i = width - 1; i >= 0; i--) this.bits.push((value >>> i) & 1);
  }
  bytes(): Uint8Array {
    const out = new Uint8Array(Math.ceil(this.bits.length / 8));
    this.bits.forEach((b, i) => {
      if (b) out[i >> 3] |= 0x80 >> (i & 7);
    });
    return out;
  }
}

class BitReader {
  pos = 0;
  constructor(private readonly data: Uint8Array) {}
  read(width: number): number {
    let v = 0;
    for (let i = 0; i < width; i++) {
      const byte = this.data[this.pos >> 3];
      if (byte === undefined) throw new Error('Code zu kurz');
      v = (v << 1) | ((byte >> (7 - (this.pos & 7))) & 1);
      this.pos++;
    }
    return v >>> 0;
  }
}

function writeSet<T extends string>(w: BitWriter, ids: readonly T[], set: Set<T>) {
  w.write(ids.length, 10);
  for (const id of ids) w.write(set.has(id) ? 1 : 0, 1);
}

/** Elias-Gamma-Code für Zahlen ≥ 1. */
function writeGamma(w: BitWriter, n: number) {
  const len = Math.floor(Math.log2(n));
  w.write(0, len);
  w.write(n, len + 1);
}

function readGamma(r: BitReader): number {
  let len = 0;
  while (r.read(1) === 0) {
    len++;
    if (len > 20) throw new Error('Ungültige Lauflänge');
  }
  return len ? (1 << len) | r.read(len) : 1;
}

function writeSetRle<T extends string>(w: BitWriter, ids: readonly T[], set: Set<T>) {
  w.write(ids.length, 10);
  if (!ids.length) return;
  let cur = set.has(ids[0]) ? 1 : 0;
  w.write(cur, 1);
  let run = 0;
  for (const id of ids) {
    const b = set.has(id) ? 1 : 0;
    if (b === cur) run++;
    else {
      writeGamma(w, run);
      cur = b;
      run = 1;
    }
  }
  writeGamma(w, run);
}

function readSetRle<T extends string>(r: BitReader, ids: readonly T[]): Set<T> {
  const count = r.read(10);
  const out = new Set<T>();
  if (!count) return out;
  let cur = r.read(1);
  let i = 0;
  while (i < count) {
    const run = readGamma(r);
    for (let k = 0; k < run && i < count; k++, i++) if (cur && i < ids.length) out.add(ids[i]);
    cur = 1 - cur;
  }
  return out;
}

function readSet<T extends string>(r: BitReader, ids: readonly T[]): Set<T> {
  const count = r.read(10);
  const out = new Set<T>();
  for (let i = 0; i < count; i++) {
    const bit = r.read(1);
    if (bit && i < ids.length) out.add(ids[i]);
  }
  return out;
}

/** Nur für Tests: Code im alten Format (Version 1) erzeugen. */
export function encodeSaveCodeV1(s: GameState): string {
  const w = new BitWriter();
  w.write(1, 4);
  kopf(w, s);
  writeSet(w, FLAG_IDS, s.flags);
  writeSet(w, ITEM_IDS, s.items);
  writeSet(w, LEXICON_IDS, s.lexicon);
  return abschluss(w);
}

function kopf(w: BitWriter, s: GameState) {
  w.write(s.stufe - 7, 3);
  w.write(MAP_IDS.indexOf(s.mapId), 6);
  w.write(s.x, 7);
  w.write(s.y, 7);
  w.write(DIRS.indexOf(s.dir), 2);
  w.write(Math.max(0, Math.min(65535, s.bytes)), 16);
  w.write(s.questId === null ? 255 : QUEST_IDS.indexOf(s.questId), 8);
}

function abschluss(w: BitWriter): string {
  const payload = w.bytes();
  const full = new Uint8Array(payload.length + 1);
  full.set(payload);
  full[payload.length] = crc8(payload);
  return groupCode(encodeBase32(full));
}

export function encodeSaveCode(s: GameState): string {
  const w = new BitWriter();
  w.write(VERSION, 4);
  kopf(w, s);
  writeSetRle(w, FLAG_IDS, s.flags);
  writeSetRle(w, ITEM_IDS, s.items);
  writeSetRle(w, LEXICON_IDS, s.lexicon);
  return abschluss(w);
}

export function decodeSaveCode(input: string): GameState | null {
  const bytes = decodeBase32(normalizeCode(input));
  if (!bytes || bytes.length < 2) return null;
  const payload = bytes.slice(0, -1);
  if (crc8(payload) !== bytes[bytes.length - 1]) return null;
  try {
    const r = new BitReader(payload);
    const version = r.read(4);
    if (version !== 1 && version !== 2) return null;
    const lies = version === 1 ? readSet : readSetRle;
    const s = newGameState();
    const stufe = r.read(3) + 7;
    if (stufe > 11) return null;
    s.stufe = stufe as Stufe;
    const map = MAP_IDS[r.read(6)];
    if (!map) return null;
    s.mapId = map;
    s.x = r.read(7);
    s.y = r.read(7);
    s.dir = DIRS[r.read(2)];
    s.bytes = r.read(16);
    const q = r.read(8);
    s.questId = q === 255 ? null : (QUEST_IDS[q] ?? null);
    s.flags = lies(r, FLAG_IDS);
    s.items = lies(r, ITEM_IDS);
    s.lexicon = lies(r, LEXICON_IDS);
    return s;
  } catch {
    return null;
  }
}

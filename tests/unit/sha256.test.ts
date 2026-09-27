import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { sha256Hex } from '../../src/engine/state/sha256';

describe('sha256Hex', () => {
  it.each(['', 'abc', 'Kabelitz', 'ä ö ü ß', 'x'.repeat(1000)])('stimmt mit node:crypto überein (%#)', (msg) => {
    expect(sha256Hex(msg)).toBe(createHash('sha256').update(msg, 'utf8').digest('hex'));
  });
});

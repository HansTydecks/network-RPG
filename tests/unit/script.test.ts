import { describe, expect, it } from 'vitest';
import { runScript, type ScriptHost } from '../../src/engine/script/ScriptRunner';
import { choice, give, lexicon, quest, say, setFlag, when } from '../../src/engine/script/Script';
import { newGameState } from '../../src/engine/state/GameState';

function mockHost(choices: number[] = []) {
  const log: string[] = [];
  const host: ScriptHost = {
    state: newGameState(),
    say: async (who, text) => void log.push(`${who ?? '-'}: ${text}`),
    choose: async () => choices.shift() ?? 0,
    toast: async (t) => void log.push(`toast ${t}`),
    itemReceived: async (i) => void log.push(`item ${i}`),
    questChanged: (q) => void log.push(`quest ${q}`),
    lexiconUnlocked: async (l) => void log.push(`lexikon ${l}`),
    wait: async () => {},
    warp: async (m) => void log.push(`warp ${m}`),
    turnPlayer: () => {},
    calendar: async () => void log.push('kalender'),
    save: async () => void log.push('speichern'),
    interlude: async (t) => void log.push(`zwischen ${t}`),
    minigame: async (id) => void log.push(`minispiel ${id}`),
    faceNpc: () => {},
    refresh: () => {},
  };
  return { host, log };
}

describe('ScriptRunner', () => {
  it('führt Befehle der Reihe nach aus und setzt den Zustand', async () => {
    const { host, log } = mockHost();
    await runScript([say('opa', 'Moin!'), give('netzblick_v1'), setFlag('opa_begruesst'), quest('m0_kabel'), lexicon('kabel')], host);
    expect(log).toEqual(['opa: Moin!', 'item netzblick_v1', 'quest m0_kabel', 'lexikon kabel']);
    expect(host.state.items.has('netzblick_v1')).toBe(true);
    expect(host.state.flags.has('opa_begruesst')).toBe(true);
    expect(host.state.questId).toBe('m0_kabel');
  });

  it('gibt Items nur einmal', async () => {
    const { host, log } = mockHost();
    await runScript([give('netzblick_v1'), give('netzblick_v1')], host);
    expect(log.filter((l) => l.startsWith('item'))).toHaveLength(1);
  });

  it('verzweigt über Bedingungen und Auswahl', async () => {
    const { host, log } = mockHost([1]);
    await runScript(
      [
        when({ flag: 'kvz_gesehen' }, [say(undefined, 'ja')], [say(undefined, 'nein')]),
        choice('Und?', [['A', [say(undefined, 'a')]], ['B', [say(undefined, 'b')]]]),
        when({ not: { item: 'netzblick_v1' } }, [say(undefined, 'ohne Brille')]),
      ],
      host,
    );
    expect(log).toEqual(['-: nein', '-: b', '-: ohne Brille']);
  });
});

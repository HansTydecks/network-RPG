import { expect, test } from '@playwright/test';
import { advanceDialogs, advanceUntilMinigame, face, flags, playMinigame, player, walk } from './helpers';

test.setTimeout(600_000);

test('Kapitel 2 (M3a): erster Schultag in Knotenburg', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(1200);
  await page.keyboard.press('Space');
  await page.waitForTimeout(1500);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => (window as any).__netzblick?.scene, undefined, { timeout: 8000 });
  await page.waitForTimeout(500);
  await advanceDialogs(page);

  const talk = async (dir: 'up' | 'down' | 'left' | 'right') => {
    await face(page, dir);
    await page.keyboard.press('Space');
    await page.waitForTimeout(250);
  };
  const state = () =>
    page.evaluate(() => {
      const s = (window as any).__netzblick.state;
      return { quest: s.questId as string, items: [...s.items] as string[], stufe: s.stufe as number };
    });

  // Einstieg wie nach dem Kalender-Code (Kapitel 1 übersprungen)
  await page.evaluate(() => (window as any).__netzblick.scene.testStartKapitel(8));
  await page.waitForTimeout(300);
  await advanceDialogs(page, 60);
  expect((await state()).stufe).toBe(8);
  expect((await state()).items).toEqual(expect.arrayContaining(['netzblick_v1', 'binaer_karte', 'block_fernbedienung']));
  expect((await state()).quest).toBe('k2_ada');

  // Tante Ada: Brille v2
  await walk(page, 'up', 1);
  await walk(page, 'right', 4);
  await talk('up');
  await advanceDialogs(page, 60);
  expect((await state()).items).toContain('netzblick_v2');
  expect((await state()).quest).toBe('k2_bus');

  // Mit dem Bus nach Knotenburg
  await walk(page, 'left', 3);
  await walk(page, 'down', 5);
  await walk(page, 'down', 5);
  await walk(page, 'right', 4);
  await walk(page, 'down', 2);
  expect((await player(page)).map).toBe('kabelitz');
  await walk(page, 'down', 7);
  await walk(page, 'right', 21);
  await talk('up');
  await advanceDialogs(page, 60);
  expect((await player(page)).map).toBe('knotenburg');
  expect((await state()).quest).toBe('k2_schule');
  await page.keyboard.press('KeyN');
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'test-results/k2-01-knotenburg-netzblick.png' });
  await page.keyboard.press('KeyN');
  await page.waitForTimeout(200);

  // Ins Gymnasium zu Herrn Work
  await walk(page, 'right', 11);
  await walk(page, 'up', 11);
  expect((await player(page)).map).toBe('gymnasium');
  const zuWork = async () => {
    await walk(page, 'up', 1);
    await walk(page, 'right', 4);
    await walk(page, 'up', 5);
    await walk(page, 'right', 6);
    await talk('up');
  };
  const rausAusDerSchule = async () => {
    await walk(page, 'left', 6);
    await walk(page, 'down', 5);
    await walk(page, 'left', 4);
    await walk(page, 'down', 2);
    expect((await player(page)).map).toBe('knotenburg');
  };
  await zuWork();
  await advanceUntilMinigame(page);
  await page.screenshot({ path: 'test-results/k2-02-algorithmus.png' });
  await playMinigame(page);
  await advanceDialogs(page);
  expect((await state()).quest).toBe('k2_clientserver');
  await page.screenshot({ path: 'test-results/k2-03-informatikraum.png' });

  // Client und Server am Schul-PC (direkt vor Alex)
  await talk('down');
  await advanceUntilMinigame(page);
  await playMinigame(page);
  await advanceDialogs(page);
  expect(await flags(page)).toContain('k2_clientserver');
  await talk('up');
  await advanceDialogs(page);
  expect((await state()).quest).toBe('k2_kanal');

  // Kabelkanal: Wiederholung und Verzweigung
  await rausAusDerSchule();
  await walk(page, 'down', 1);
  await walk(page, 'right', 4);
  await talk('up');
  await advanceUntilMinigame(page);
  await page.screenshot({ path: 'test-results/k2-04-kanal1.png' });
  await playMinigame(page);
  await advanceUntilMinigame(page);
  await page.screenshot({ path: 'test-results/k2-05-kanal2.png' });
  await playMinigame(page);
  await advanceDialogs(page);
  expect((await state()).items).toContain('fremder_stick');

  // Stick zu Herrn Work
  await walk(page, 'left', 4);
  await walk(page, 'up', 2);
  expect((await player(page)).map).toBe('gymnasium');
  await zuWork();
  await advanceDialogs(page);
  expect(await flags(page)).toContain('k2_stick_abgegeben');
  expect((await state()).items).not.toContain('fremder_stick');

  // Nach Hause
  await rausAusDerSchule();
  await walk(page, 'down', 10);
  await walk(page, 'left', 11);
  await talk('left');
  await advanceDialogs(page, 60);
  expect((await player(page)).map).toBe('kabelitz');
  await walk(page, 'left', 21);
  await walk(page, 'up', 8);
  expect((await player(page)).map).toBe('wohnzimmer');
  await walk(page, 'up', 1);
  await walk(page, 'right', 2);
  await talk('up');
  await advanceDialogs(page);
  expect((await state()).quest).toBe('k2_fortsetzung');

  // Backtracking: der lange Kabelschacht am Dorfplatz
  await walk(page, 'left', 2);
  await walk(page, 'down', 2);
  expect((await player(page)).map).toBe('kabelitz');
  await walk(page, 'down', 7);
  await walk(page, 'right', 9);
  await walk(page, 'down', 4);
  expect((await player(page)).map).toBe('dorfplatz');
  await walk(page, 'down', 5);
  await walk(page, 'left', 5);
  await talk('up');
  await advanceUntilMinigame(page);
  await page.screenshot({ path: 'test-results/k2-06-schacht.png' });
  await playMinigame(page);
  await advanceDialogs(page);
  expect((await state()).items).toContain('schluessel7');
  const lex = await page.evaluate(() => [...(window as any).__netzblick.state.lexicon]);
  expect(lex).toEqual(expect.arrayContaining(['algorithmus_eigenschaften', 'client_server', 'wiederholung', 'verzweigung', 'funk']));
  expect(errors).toEqual([]);
});

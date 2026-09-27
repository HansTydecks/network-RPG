import { expect, test } from '@playwright/test';
import { advanceDialogs, advanceUntilMinigame, face, flags, playMinigame, player, walk } from './helpers';

test.setTimeout(240_000);

test('Kapitel 1 (M1): vom Prolog bis zum Zettel am grauen Kasten', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(1200);

  // Titel → Neues Spiel → Prolog (überspringen)
  await page.keyboard.press('Space');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'test-results/m1-01-prolog.png' });
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => (window as any).__netzblick?.scene, undefined, { timeout: 8000 });
  await page.waitForTimeout(500);
  await advanceDialogs(page);
  expect((await page.evaluate(() => (window as any).__netzblick.state.questId))).toBe('q1_mama');

  // Runter zu Mama
  await walk(page, 'right', 1);
  await walk(page, 'down', 4);
  expect((await player(page)).map).toBe('wohnzimmer');
  await walk(page, 'down', 5);
  await walk(page, 'right', 6);
  await face(page, 'up');
  await page.keyboard.press('Space');
  await page.waitForTimeout(250);
  await advanceDialogs(page);
  expect(await flags(page)).toContain('mama_gesprochen');
  await page.screenshot({ path: 'test-results/m1-02-wohnzimmer.png' });

  // Raus zu Opa Werner
  await walk(page, 'left', 2);
  await walk(page, 'down', 2);
  expect((await player(page)).map).toBe('kabelitz');
  const zuOpa = async () => {
    await walk(page, 'down', 6);
    await walk(page, 'right', 10);
    await walk(page, 'up', 4);
    await walk(page, 'right', 1);
    await face(page, 'up');
    await page.keyboard.press('Space');
    await page.waitForTimeout(250);
    await advanceDialogs(page);
  };
  await zuOpa();
  expect(await flags(page)).toContain('idee_brief');

  // Zurück ins Zimmer, Brief schreiben
  await walk(page, 'left', 1);
  await walk(page, 'down', 4);
  await walk(page, 'left', 10);
  await walk(page, 'up', 7);
  expect((await player(page)).map).toBe('wohnzimmer');
  await walk(page, 'up', 5);
  await walk(page, 'left', 5);
  await walk(page, 'up', 1);
  expect((await player(page)).map).toBe('alex_zimmer');
  await walk(page, 'up', 4);
  await walk(page, 'right', 2);
  await face(page, 'up');
  await page.keyboard.press('Space');
  await advanceUntilMinigame(page);
  await page.screenshot({ path: 'test-results/m1-03-brief.png' });
  await playMinigame(page);
  await advanceDialogs(page);
  expect(await flags(page)).toContain('brief_geschrieben');

  // Briefmarke bei Opa
  await walk(page, 'left', 2);
  await walk(page, 'down', 5);
  await walk(page, 'down', 5);
  await walk(page, 'right', 4);
  await walk(page, 'down', 2);
  expect((await player(page)).map).toBe('kabelitz');
  await zuOpa();
  expect(await flags(page)).toContain('marke_erhalten');

  // Einwerfen → nächster Morgen
  await walk(page, 'left', 1);
  await walk(page, 'down', 4);
  await walk(page, 'right', 3);
  await face(page, 'up');
  await page.keyboard.press('Space');
  await page.waitForTimeout(250);
  await advanceDialogs(page, 80);
  expect(await flags(page)).toContain('tag2');
  expect((await player(page)).map).toBe('alex_zimmer');

  // Frau Krause an der Haustür → Briefzentrum
  await walk(page, 'right', 1);
  await walk(page, 'down', 4);
  await walk(page, 'down', 5);
  await walk(page, 'right', 4);
  await face(page, 'down');
  await page.keyboard.press('Space');
  await page.waitForTimeout(250);
  await advanceDialogs(page, 80);
  expect((await player(page)).map).toBe('briefzentrum');
  await walk(page, 'left', 2);
  await face(page, 'up');
  await page.keyboard.press('Space');
  await advanceUntilMinigame(page);
  await page.screenshot({ path: 'test-results/m1-04-sortieren.png' });
  await playMinigame(page);
  await advanceUntilMinigame(page);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'test-results/m1-05-reise.png' });
  await playMinigame(page);
  await advanceDialogs(page, 80);
  expect((await player(page)).map).toBe('kabelitz');
  await page.screenshot({ path: 'test-results/m1-06-nachmittag.png' });

  // Paket öffnen: Brille bauen
  await walk(page, 'up', 1);
  await walk(page, 'up', 5);
  await walk(page, 'left', 5);
  await walk(page, 'up', 1);
  await walk(page, 'up', 2);
  await walk(page, 'right', 3);
  await face(page, 'right');
  await page.keyboard.press('Space');
  await advanceUntilMinigame(page);
  await page.screenshot({ path: 'test-results/m1-07-eva.png' });
  await playMinigame(page);
  await advanceUntilMinigame(page);
  await playMinigame(page);
  await advanceDialogs(page);
  expect(await page.evaluate(() => (window as any).__netzblick.state.items.has('netzblick_v1'))).toBe(true);

  // Raus, Brille auf, zum grauen Kasten
  await walk(page, 'left', 3);
  await walk(page, 'down', 3);
  await walk(page, 'down', 5);
  await walk(page, 'right', 4);
  await walk(page, 'down', 2);
  await page.keyboard.press('KeyN');
  await page.waitForTimeout(300);
  await advanceDialogs(page);
  await walk(page, 'down', 6);
  await walk(page, 'right', 5);
  await page.screenshot({ path: 'test-results/m1-08-netzblick.png' });
  await face(page, 'up');
  await page.keyboard.press('Space');
  await page.waitForTimeout(250);
  await advanceDialogs(page);
  expect(await page.evaluate(() => (window as any).__netzblick.state.items.has('zettel_funkstille'))).toBe(true);

  // Objekt-Scan am Briefkasten
  await walk(page, 'right', 8);
  await face(page, 'up');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'test-results/m1-09-objektkarte.png' });
  await advanceDialogs(page);
  expect(await flags(page)).toContain('scan_erklaert');
  const lex = await page.evaluate(() => [...(window as any).__netzblick.state.lexicon]);
  expect(lex).toEqual(expect.arrayContaining(['information_daten', 'uebertragung', 'eva', 'betriebssystem', 'kabel', 'kabelverzweiger', 'objekt']));
  expect(errors).toEqual([]);
});

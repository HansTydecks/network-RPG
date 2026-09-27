import { expect, test } from '@playwright/test';
import { advanceDialogs, advanceUntilMinigame, face, playMinigame, player, walk } from './helpers';

test.setTimeout(300_000);

test('Kapitel 5: Weltkarte und Frankfurt mit allen Minispielen', async ({ page }) => {
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

  await page.evaluate(() => (window as any).__netzblick.scene.testStartKapitel(11));
  await page.waitForTimeout(300);
  await advanceDialogs(page, 80);
  expect((await player(page)).map).toBe('weltkarte');
  await page.keyboard.press('KeyN');
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'test-results/k5-01-weltkarte.png' });
  await page.keyboard.press('KeyN');
  await page.waitForTimeout(200);

  await walk(page, 'left', 1);
  await face(page, 'left');
  await page.keyboard.press('Space');
  await page.waitForTimeout(300);
  await advanceDialogs(page, 40);
  expect((await player(page)).map).toBe('frankfurt');
  await walk(page, 'right', 1);
  await walk(page, 'up', 4);
  await face(page, 'up');
  await page.keyboard.press('Space');
  await page.waitForTimeout(250);
  for (let i = 0; i < 5; i++) {
    await advanceUntilMinigame(page);
    await page.screenshot({ path: `test-results/k5-0${i + 2}-frankfurt.png` });
    await playMinigame(page);
  }
  await advanceDialogs(page, 60);
  const s = await page.evaluate(() => {
    const st = (window as any).__netzblick.state;
    return { quest: st.questId, flags: [...st.flags], items: [...st.items] };
  });
  expect(s.flags).toContain('k5_frankfurt');
  expect(s.items).toContain('subnetzmaske');
  expect(s.quest).toBe('k5_seekabel');
  // Speichern und laden: Der Code ist kurz genug für die Eingabe
  const code = await page.evaluate(() => (window as any).__netzblick.scene.saveCodeForTest?.() ?? '');
  expect(code.replace(/-/g, '').length).toBeLessThanOrEqual(64);
  expect(errors).toEqual([]);
});

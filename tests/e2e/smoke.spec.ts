import { expect, test } from '@playwright/test';
import { advanceDialogs, face, player, walk } from './helpers';

async function newGame(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(1200);
  await page.keyboard.press('Space');
  await page.waitForTimeout(800);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => (window as any).__netzblick?.scene, undefined, { timeout: 8000 });
  await page.waitForTimeout(600);
  await advanceDialogs(page);
}

test('Speichercode aus dem Menü bringt Alex an dieselbe Stelle zurück', async ({ page }) => {
  await newGame(page);
  await walk(page, 'right', 2);
  await walk(page, 'down', 1);
  // Menü → Speichern
  await page.keyboard.press('KeyM');
  await page.waitForTimeout(150);
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(80);
  }
  await page.keyboard.press('Space');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'test-results/04-speichercode.png' });
  await advanceDialogs(page);
  const code = await page.evaluate(() => localStorage.getItem('netzblick.spielstand'));
  expect(code).toMatch(/^[0-9A-Z-]+$/);

  // Frischer Rechner: kein Autosave, Code im Titel eingeben
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(1200);
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(80);
  await page.keyboard.press('Space');
  await page.waitForTimeout(200);
  await page.keyboard.type(code!.toLowerCase());
  await page.screenshot({ path: 'test-results/05-code-eingabe.png' });
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => (window as any).__netzblick?.scene, undefined, { timeout: 5000 });
  await page.waitForTimeout(600);
  const p = await player(page);
  expect([p.map, p.x, p.y]).toEqual(['alex_zimmer', 5, 4]);
});

test('Kalender: falscher Code schaltet keine Klassenstufe frei', async ({ page }) => {
  await newGame(page);
  await walk(page, 'right', 1);
  await walk(page, 'up', 2);
  await face(page, 'up');
  await page.keyboard.press('Space');
  await page.waitForTimeout(1800); // Frage vollständig getippt
  await page.keyboard.press('Space'); // weiter → Auswahl erscheint
  await page.waitForTimeout(150);
  await page.keyboard.press('Space'); // „Ins nächste Schuljahr blättern"
  await page.waitForTimeout(200);
  await page.keyboard.type('AAAA-AAAA');
  await page.screenshot({ path: 'test-results/06-kalender.png' });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  await advanceDialogs(page);
  expect(await page.evaluate(() => (window as any).__netzblick.state.stufe)).toBe(7);
});

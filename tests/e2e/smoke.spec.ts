import { expect, test } from '@playwright/test';
import { advanceDialogs, face, player, walk } from './helpers';

test('Testversion M0 lässt sich komplett durchspielen', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.waitForTimeout(1200);

  // Titel → Neues Spiel
  await page.keyboard.press('Space');
  await page.waitForFunction(() => (window as any).__netzblick?.scene, undefined, { timeout: 5000 });
  await page.waitForTimeout(600);
  await advanceDialogs(page);
  let p = await player(page);
  expect([p.map, p.x, p.y]).toEqual(['alex_zimmer', 3, 3]);
  await page.screenshot({ path: 'test-results/01-zimmer.png' });

  // Zum Paket und öffnen
  await walk(page, 'right', 4);
  await walk(page, 'down', 1);
  await face(page, 'right');
  await page.keyboard.press('Space');
  await page.waitForTimeout(200);
  await advanceDialogs(page);
  const hasBrille = await page.evaluate(() => (window as any).__netzblick.state.items.has('netzblick_v1'));
  expect(hasBrille).toBe(true);

  // Nach draußen
  await walk(page, 'left', 3);
  await walk(page, 'down', 3);
  await page.waitForTimeout(600);
  p = await player(page);
  expect([p.map, p.x, p.y]).toEqual(['kabelitz', 6, 8]);

  // Brille auf
  await page.keyboard.press('KeyN');
  await page.waitForTimeout(300);
  await advanceDialogs(page);
  expect(await page.evaluate(() => (window as any).__netzblick.scene.netOn())).toBe(true);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'test-results/02-netzblick.png' });

  // Zum grauen Kasten
  await walk(page, 'down', 6);
  await walk(page, 'right', 5);
  await face(page, 'up');
  await page.keyboard.press('Space');
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'test-results/03-kasten.png' });
  await advanceDialogs(page);
  const done = await page.evaluate(() => {
    const s = (window as any).__netzblick.state;
    return { kvz: s.flags.has('kvz_gesehen'), quest: s.questId, lex: [...s.lexicon] };
  });
  expect(done.kvz).toBe(true);
  expect(done.quest).toBe('m0_fertig');
  expect(done.lex).toEqual(expect.arrayContaining(['kabel', 'kabelverzweiger']));
  expect(errors).toEqual([]);
});

async function newGame(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(1200);
  await page.keyboard.press('Space');
  await page.waitForFunction(() => (window as any).__netzblick?.scene, undefined, { timeout: 5000 });
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

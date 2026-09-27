import type { Page } from '@playwright/test';

type Dir = 'up' | 'down' | 'left' | 'right';
const KEY: Record<Dir, string> = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };

export async function player(page: Page) {
  return page.evaluate(() => {
    const w = (window as any).__netzblick;
    return { ...w.scene.getPlayerTile(), busy: w.scene.isBusy(), map: w.state.mapId as string };
  });
}

/** Drückt A so lange, bis kein Dialog/Script mehr läuft. */
export async function advanceDialogs(page: Page, max = 40) {
  for (let i = 0; i < max; i++) {
    const p = await player(page);
    if (!p.busy) return;
    await page.keyboard.press('Space');
    await page.waitForTimeout(90);
  }
  throw new Error('Dialog endet nicht');
}

/** Geht n Kacheln in eine Richtung (echte Tastatureingaben, Kachel für Kachel). */
export async function walk(page: Page, dir: Dir, n = 1) {
  for (let i = 0; i < n; i++) {
    const before = await player(page);
    await page.keyboard.down(KEY[dir]);
    await page.waitForFunction(
      ([x, y, m]) => {
        const s = (window as any).__netzblick.scene.getPlayerTile();
        return s.moving || s.x !== x || s.y !== y || (window as any).__netzblick.state.mapId !== m;
      },
      [before.x, before.y, before.map] as const,
      { timeout: 3000 },
    );
    await page.keyboard.up(KEY[dir]);
    await page.waitForFunction(
      () => {
        const sc = (window as any).__netzblick.scene;
        return !sc.getPlayerTile().moving && !sc.isBusy();
      },
      undefined,
      { timeout: 5000 },
    );
    await page.waitForTimeout(30);
  }
}

/** Dreht sich in eine Richtung, ohne zu laufen (kurzer Tastendruck). */
export async function face(page: Page, dir: Dir) {
  await page.keyboard.down(KEY[dir]);
  await page.waitForTimeout(40);
  await page.keyboard.up(KEY[dir]);
  await page.waitForTimeout(80);
}

/** Spielt ein laufendes Minispiel mit den Tasten, die es selbst als richtig meldet. */
export async function playMinigame(page: Page, maxSteps = 200) {
  await page.waitForFunction(() => (window as any).__minigame, undefined, { timeout: 5000 });
  for (let i = 0; i < maxSteps; i++) {
    const keys: string[] | null = await page.evaluate(() => {
      const m = (window as any).__minigame;
      return m ? m.solutionKeys() : null;
    });
    if (keys === null) return;
    if (keys.length === 0) await page.waitForTimeout(150);
    for (const k of keys) {
      await page.keyboard.press(k);
      await page.waitForTimeout(70);
    }
  }
  throw new Error('Minispiel endet nicht');
}

/** Wartet, bis ein Script ein Minispiel startet, drückt dabei Dialoge weiter. */
export async function advanceUntilMinigame(page: Page, max = 60) {
  for (let i = 0; i < max; i++) {
    if (await page.evaluate(() => Boolean((window as any).__minigame))) return;
    await page.keyboard.press('Space');
    await page.waitForTimeout(120);
  }
  throw new Error('Kein Minispiel gestartet');
}

export async function flags(page: Page): Promise<string[]> {
  return page.evaluate(() => [...(window as any).__netzblick.state.flags]);
}

import type { Dir } from '../state/GameState';

const RICHTUNGEN: [Dir, number, number][] = [
  ['up', 0, -1],
  ['down', 0, 1],
  ['left', -1, 0],
  ['right', 1, 0],
];

/**
 * Nächster Schritt einer herumlaufenden Figur: zufällige Richtung, die frei ist
 * und nicht weiter als `radius` vom Startpunkt wegführt. null = stehen bleiben.
 */
export function wanderSchritt(
  heim: { x: number; y: number },
  pos: { x: number; y: number },
  radius: number,
  frei: (x: number, y: number) => boolean,
  zufall: () => number = Math.random,
): Dir | null {
  if (zufall() < 0.3) return null;
  const moeglich = RICHTUNGEN.filter(([, dx, dy]) => {
    const x = pos.x + dx;
    const y = pos.y + dy;
    return Math.abs(x - heim.x) <= radius && Math.abs(y - heim.y) <= radius && frei(x, y);
  });
  if (!moeglich.length) return null;
  return moeglich[Math.floor(zufall() * moeglich.length)][0];
}

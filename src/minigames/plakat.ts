import { QuizModal } from './quiz';
import type { Minigame } from './base';
import { PLAKAT_FRAGEN } from './plakatLogic';

export const plakatMinigame: Minigame = (ctx) =>
  new Promise((resolve) =>
    ctx.push(new QuizModal(ctx.scene, 'Linas Plakat', PLAKAT_FRAGEN, 'Lina: „Das Plakat ist super geworden! Das hängen wir gleich an die Bühne." (Leertaste)', resolve, 'Lina hat ein Plakat für das nächste Dorffest entworfen. Hilf ihr beim Bearbeiten!')),
  );


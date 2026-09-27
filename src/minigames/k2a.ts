import type { Minigame } from './base';
import { QuizModal, type QuizFrage } from './quiz';
import { ALGORITHMUS_FRAGEN, CLIENT_SERVER_FRAGEN } from './k2aLogic';

const quiz =
  (titel: string, fragen: QuizFrage[], schluss: string, intro?: string): Minigame =>
  (ctx) =>
    new Promise((resolve) => ctx.push(new QuizModal(ctx.scene, titel, fragen, schluss, resolve, intro)));

export const algorithmusMinigame = quiz(
  'Algorithmus oder nicht?',
  ALGORITHMUS_FRAGEN,
  'Ein Algorithmus ist eindeutig, ausführbar und endlich. (Leertaste)',
  'Herr Work liest Anleitungen vor. Welche sind Algorithmen – und wenn nicht, warum?',
);

export const clientServerMinigame = quiz(
  'Client oder Server?',
  CLIENT_SERVER_FRAGEN,
  'Der Client fragt, der Server antwortet. (Leertaste)',
  'Mit der Brille siehst du Anfragen und Antworten durch die Kabel flitzen. Wer ist wer?',
);

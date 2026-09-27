/** Datentypen der wiederverwendbaren Minispiele (ohne Phaser). */
export interface KampfRunde {
  angriff: string;
  optionen: { text: string; ok: boolean; erklaerung: string }[];
}

export interface Kampf {
  gegner: string;
  /** Textur des Gegners (optional, sonst ein Glitchling aus Pixeln). */
  bild?: string;
  intro: string;
  runden: KampfRunde[];
  sieg: string;
}

export interface CaesarAufgabe {
  titel: string;
  geheim: string;
  /** Verschiebung, um die der Geheimtext zurückgedreht werden muss. */
  schluessel: number;
  intro: string;
  schluss: string;
}

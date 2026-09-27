import Phaser from 'phaser';
import { TILES } from '../../content/art/tiles';
import { CHARACTERS } from '../../content/art/characters';
import { PAL, hexToInt } from '../gfx/palette';
import { FONT_KEY, TILESET_KEY } from '../gfx/textures';

/** Kontaktbogen aller Grafiken (Aufruf mit ?kontaktbogen) – zum Prüfen und Dokumentieren. */
export class ContactSheetScene extends Phaser.Scene {
  constructor() {
    super('ContactSheet');
  }

  create() {
    this.cameras.main.setBackgroundColor(PAL.grau1);
    this.add.bitmapText(4, 2, FONT_KEY, 'Kontaktbogen NETZBLICK').setTint(hexToInt(PAL.gelb));
    const tex = this.textures.get(TILESET_KEY);
    TILES.forEach((_t, i) => {
      tex.add(`t${i}`, 0, i * 16, 0, 16, 16);
      const x = 4 + (i % 16) * 19;
      const y = 14 + Math.floor(i / 16) * 19;
      this.add.image(x, y, TILESET_KEY, `t${i}`).setOrigin(0);
    });
    const baseY = 14 + Math.ceil(TILES.length / 16) * 19 + 4;
    CHARACTERS.forEach((c, row) => {
      for (let f = 0; f < 9; f++) this.add.image(4 + f * 18, baseY + row * 18, `char_${c.id}`, f).setOrigin(0);
    });
    for (let f = 0; f < 4; f++) this.add.image(180 + f * 18, baseY, 'ping', f).setOrigin(0);
    this.add.image(180, baseY + 22, 'paket_netz').setOrigin(0);
    this.add.image(200, baseY + 18, 'icon_netzblick_v1').setOrigin(0);
    this.add.bitmapText(180, baseY + 40, FONT_KEY, 'ÄÖÜ äöüß 0123456789\nDas Internet ist weg!\n„Früher…“ – Opa Werner').setTint(0xffffff);
  }
}

import Phaser from 'phaser';
import { PixBuf } from './pixbuf';
import { CELL_H, LETTER_SPACING, allFontChars, glyphBitmap } from './fontGlyphs';
import { TILES } from '../../content/art/tiles';
import { CHARACTERS, kabelbinderIcon, usbIcon, binaerKarteIcon, fernbedienungIcon, fotoIcon, kruemelFrames, schluesselIcon, briefIcon, funkstilleSymbol, characterFrames, markeIcon, morseFrames, netzblickIcon, packetSprite, pingFrames, zettelIcon } from '../../content/art/characters';
import { prologBackground, prologHand } from '../../content/art/prolog';

export const FONT_KEY = 'kabelitz';
export const TILESET_KEY = 'tileset';

export function bufToCanvas(buf: PixBuf, scale = 1): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = buf.w * scale;
  c.height = buf.h * scale;
  const ctx = c.getContext('2d')!;
  for (let y = 0; y < buf.h; y++)
    for (let x = 0; x < buf.w; x++) {
      const col = buf.get(x, y);
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  return c;
}

/** Legt Frames nebeneinander und registriert sie als Spritesheet. */
function addSheet(scene: Phaser.Scene, key: string, frames: PixBuf[]) {
  const w = frames[0].w;
  const h = frames[0].h;
  const strip = new PixBuf(w * frames.length, h);
  frames.forEach((f, i) => strip.blit(f, i * w, 0));
  const canvas = bufToCanvas(strip);
  const tex = scene.textures.addCanvas(key, canvas)!;
  frames.forEach((_, i) => tex.add(i, 0, i * w, 0, w, h));
}

function addImage(scene: Phaser.Scene, key: string, buf: PixBuf) {
  scene.textures.addCanvas(key, bufToCanvas(buf));
}

/** Eigene Pixelschrift als Bitmap-Font mit proportionaler Breite registrieren. */
function addFont(scene: Phaser.Scene) {
  const chars = allFontChars();
  const glyphs = chars.map((c) => glyphBitmap(c));
  const perRow = 16;
  const cellW = 8;
  const sheet = new PixBuf(perRow * cellW, Math.ceil(glyphs.length / perRow) * CELL_H);
  const charData: Record<number, Phaser.Types.GameObjects.BitmapText.BitmapFontCharacterData> = {};
  glyphs.forEach((g, i) => {
    const x = (i % perRow) * cellW;
    const y = Math.floor(i / perRow) * CELL_H;
    sheet.blit(g.buf, x, y);
    charData[g.char.charCodeAt(0)] = {
      x,
      y,
      width: g.width,
      height: CELL_H,
      centerX: Math.floor(g.width / 2),
      centerY: Math.floor(CELL_H / 2),
      xOffset: 0,
      yOffset: 0,
      xAdvance: g.width + LETTER_SPACING,
      data: {},
      kerning: {},
      u0: x / sheet.w,
      v0: 1 - y / sheet.h,
      u1: (x + g.width) / sheet.w,
      v1: 1 - (y + CELL_H) / sheet.h,
    } as Phaser.Types.GameObjects.BitmapText.BitmapFontCharacterData; // xAdvance fehlt im Typ, wird aber genutzt
  });
  scene.textures.addCanvas(FONT_KEY, bufToCanvas(sheet));
  scene.cache.bitmapFont.add(FONT_KEY, {
    data: { retroFont: true, font: FONT_KEY, size: CELL_H, lineHeight: CELL_H + 1, chars: charData },
    texture: FONT_KEY,
    frame: null,
  });
}

function addTileset(scene: Phaser.Scene) {
  const sheet = new PixBuf(16 * TILES.length, 16);
  TILES.forEach((t, i) => {
    const b = new PixBuf(16, 16);
    t.draw(b);
    sheet.blit(b, i * 16, 0);
  });
  addImage(scene, TILESET_KEY, sheet);
}

export function buildAllTextures(scene: Phaser.Scene) {
  addFont(scene);
  addTileset(scene);
  for (const c of CHARACTERS) addSheet(scene, `char_${c.id}`, characterFrames(c));
  addSheet(scene, 'ping', pingFrames());
  addImage(scene, 'paket_netz', packetSprite());
  addImage(scene, 'icon_netzblick_v1', netzblickIcon());
  addImage(scene, 'icon_brief', briefIcon());
  addImage(scene, 'icon_briefmarke', markeIcon());
  addImage(scene, 'icon_zettel', zettelIcon());
  addImage(scene, 'funkstille', funkstilleSymbol());
  addImage(scene, 'icon_binaerkarte', binaerKarteIcon());
  addImage(scene, 'icon_fernbedienung', fernbedienungIcon());
  addImage(scene, 'icon_schluessel', schluesselIcon());
  addImage(scene, 'icon_foto', fotoIcon());
  addImage(scene, 'icon_kabelbinder', kabelbinderIcon());
  addImage(scene, 'icon_usb', usbIcon());
  addSheet(scene, 'kruemel', kruemelFrames());
  addSheet(scene, 'morse', morseFrames());
  addImage(scene, 'prolog_bg', prologBackground());
  addSheet(scene, 'prolog_hand', [prologHand(0), prologHand(1)]);
  // Einzelne Kacheln auch als eigene Bilder (für Gegenstände, die erst später auftauchen)
  TILES.forEach((t) => {
    const b = new PixBuf(16, 16);
    t.draw(b);
    addImage(scene, `tile_${t.id}`, b);
  });
  const px = new PixBuf(1, 1, '#ffffff');
  addImage(scene, 'pixel', px);
}

export function buildAnimations(scene: Phaser.Scene) {
  for (const c of CHARACTERS) {
    const key = `char_${c.id}`;
    const dirs = [['down', 0], ['up', 3], ['left', 6]] as const;
    for (const [dir, base] of dirs) {
      scene.anims.create({
        key: `${key}_walk_${dir}`,
        frames: [1, 0, 2, 0].map((f) => ({ key, frame: base + f })),
        frameRate: 8,
        repeat: -1,
      });
    }
  }
  scene.anims.create({ key: 'ping_idle', frames: [0, 0, 0, 1].map((f) => ({ key: 'ping', frame: f })), frameRate: 3, repeat: -1 });
  scene.anims.create({ key: 'morse_idle', frames: [0, 1, 0, 0].map((f) => ({ key: 'morse', frame: f })), frameRate: 2, repeat: -1 });
  scene.anims.create({ key: 'kruemel_idle', frames: [0, 1].map((f) => ({ key: 'kruemel', frame: f })), frameRate: 2, repeat: -1 });
  scene.anims.create({ key: 'ping_flap', frames: [2, 3].map((f) => ({ key: 'ping', frame: f })), frameRate: 10, repeat: -1 });
}

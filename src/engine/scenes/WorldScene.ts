import Phaser from 'phaser';
import { MAPS } from '../../content/maps';
import { ITEMS } from '../../content/items';
import { LEXICON } from '../../content/lexicon';
import { QUESTS } from '../../content/quests';
import { SPEAKERS } from '../../content/speakers';
import { CALENDAR_CODES } from '../../content/calendarCodes';
import { NETZBLICK_ERSTMALS } from '../../content/dialog/netzblick';
import { PING_SCAN, SCAN_ERKLAERUNG } from '../../content/dialog/scan';
import { tageszeitTint, zeitLabel } from '../../content/zeit';
import { KAPITEL_START } from '../../content/kapitel';
import { KAPITEL2_START } from '../../content/dialog/kapitel2';
import { formatBytes } from '../../content/bytes';
import { MINIGAMES } from '../../minigames';
import type { FlagId, ItemId, LexiconId, MapId, QuestId } from '../../content/registry';
import { TILESET_KEY } from '../gfx/textures';
import { PAL } from '../gfx/palette';
import type { Input } from '../input/Input';
import { NetVision } from '../netvision/NetVision';
import { runScript, type ScriptHost } from '../script/ScriptRunner';
import { evalCond, type Script } from '../script/Script';
import { checkCalendarCode } from '../state/CalendarCodes';
import type { Dir, GameState } from '../state/GameState';
import { autosave } from '../state/storage';
import { CodeInput } from '../ui/CodeInput';
import { DialogBox } from '../ui/DialogBox';
import { Hud, Toast } from '../ui/Hud';
import { InfoPanel } from '../ui/InfoPanel';
import { Interlude } from '../ui/Interlude';
import { ObjectCard } from '../ui/ObjectCard';
import { ListMenu } from '../ui/ListMenu';
import { UI_DEPTH, UiStack } from '../ui/widgets';
import { addTouchControls, isTouchDevice, type TouchControls } from '../ui/TouchControls';
import type { InteractDef, MapDef, NpcDef, ScanData } from '../world/MapDef';
import { parseMap, type ParsedMap } from '../world/mapUtil';

const TILE = 16;
const WALK_MS = 210;
const RUN_MS = 120;
const TURN_DELAY_MS = 90;
const VEC: Record<Dir, [number, number]> = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };
const FRAME_BASE: Record<Dir, number> = { down: 0, up: 3, left: 6, right: 6 };

interface Actor {
  sprite: Phaser.GameObjects.Sprite;
  key: string;
  x: number;
  y: number;
  dir: Dir;
  moving: boolean;
  fromX: number;
  fromY: number;
  t: number;
  dur: number;
}

function stufeLabel(s: number): string {
  return s >= 11 ? 'die Oberstufe' : `Klasse ${s}`;
}

export class WorldScene extends Phaser.Scene {
  private state!: GameState;
  private inp!: Input;
  private ui = new UiStack();
  private hud!: Hud;
  private def!: MapDef;
  private parsed!: ParsedMap;
  private mapObjects: Phaser.GameObjects.GameObject[] = [];
  private tilemap?: Phaser.Tilemaps.Tilemap;
  private player!: Actor;
  private ping?: Actor;
  private npcs: { def: NpcDef; actor: Actor }[] = [];
  private props: { def: InteractDef; sprite: Phaser.GameObjects.Image }[] = [];
  private entityObjects: Phaser.GameObjects.GameObject[] = [];
  private tintRect?: Phaser.GameObjects.Rectangle;
  private net?: NetVision;
  private scriptRunning = false;
  private hintLevel = new Map<string, number>();
  private touch?: TouchControls;
  private turnedAt = -1000;
  private lastStepEnd = -1000;

  constructor() {
    super('World');
  }

  create() {
    this.state = this.registry.get('state');
    this.inp = this.registry.get('input');
    this.ui = new UiStack();
    this.hud = new Hud(this);
    this.touch = isTouchDevice() ? addTouchControls(this, this.inp) : undefined;
    this.loadMap(this.state.mapId, this.state.x, this.state.y, this.state.dir);
    this.hud.setQuest(this.state.questId ? QUESTS[this.state.questId].titel : null);
    this.cameras.main.fadeIn(300);
    this.runEnterScript();
    (window as unknown as { __netzblick: unknown }).__netzblick = { scene: this, state: this.state };
  }

  // ---------- Karte ----------

  private loadMap(id: MapId, x: number, y: number, dir: Dir) {
    for (const o of this.mapObjects) o.destroy();
    for (const o of this.entityObjects) o.destroy();
    this.mapObjects = [];
    this.entityObjects = [];
    this.props = [];
    this.tilemap?.destroy();
    this.net?.destroy();
    this.npcs = [];

    this.def = MAPS[id];
    this.parsed = parseMap(this.def);
    Object.assign(this.state, { mapId: id, x, y, dir });

    const map = this.make.tilemap({ tileWidth: TILE, tileHeight: TILE, width: this.parsed.width, height: this.parsed.height });
    const ts = map.addTilesetImage('tiles', TILESET_KEY, TILE, TILE, 0, 0)!;
    const ground = map.createBlankLayer('ground', ts)!.setDepth(0);
    ground.putTilesAt(this.parsed.ground, 0, 0);
    const deco = map.createBlankLayer('deco', ts)!.setDepth(10);
    deco.putTilesAt(this.parsed.deco, 0, 0);
    this.tilemap = map;
    this.cameras.main.setBackgroundColor(this.def.outside ?? PAL.gruen1);

    this.player = this.makeActor('char_alex', x, y, dir);
    this.refreshEntities();
    this.placePing();
    this.tintRect = this.add.rectangle(-200, -200, this.parsed.width * TILE + 400, this.parsed.height * TILE + 400, 0, 0).setOrigin(0).setDepth(55);
    this.mapObjects.push(this.tintRect);
    this.applyTint();

    this.net = new NetVision(this, this.def.net, this.parsed.width, this.parsed.height, (f) => this.state.flags.has(f as FlagId), () => (this.state.items.has('netzblick_v2') ? 2 : 1));
    this.hud.setNet(false);
    this.hud.setTime(zeitLabel(this.state));
    this.updateCamera();
  }

  private makeActor(key: string, x: number, y: number, dir: Dir, anim?: string, list = this.mapObjects): Actor {
    const isChar = key.startsWith('char_');
    const sprite = this.add.sprite(x * TILE, y * TILE, key, isChar ? FRAME_BASE[dir] : 0).setOrigin(0, 0);
    if (isChar) sprite.setFlipX(dir === 'right');
    if (anim) sprite.play(anim);
    list.push(sprite);
    const a: Actor = { sprite, key, x, y, dir, moving: false, fromX: x, fromY: y, t: 0, dur: WALK_MS };
    this.syncActor(a);
    return a;
  }

  private pingVisible(): boolean {
    return this.state.flags.has('ping_dabei') || !this.state.flags.has('intro_gesehen');
  }

  private placePing() {
    if (!this.pingVisible()) {
      this.ping = undefined;
      return;
    }
    const [dx, dy] = VEC[this.player.dir];
    let px = this.player.x - dx;
    let py = this.player.y - dy;
    if (this.blocked(px, py, true)) {
      px = this.player.x;
      py = this.player.y;
    }
    const sprite = this.add.sprite(px * TILE, py * TILE, 'ping', 0).setOrigin(0, 0).play('ping_idle');
    this.mapObjects.push(sprite);
    this.ping = { sprite, key: 'ping', x: px, y: py, dir: 'down', moving: false, fromX: px, fromY: py, t: 0, dur: WALK_MS };
    this.syncActor(this.ping);
  }

  /** Figuren und Gegenstände nach aktuellem Spielstand (neu) aufbauen. */
  private refreshEntities() {
    for (const o of this.entityObjects) o.destroy();
    this.entityObjects = [];
    this.npcs = [];
    this.props = [];
    for (const e of this.def.entities) {
      if (e.kind === 'npc') {
        if (e.visibleIf && !evalCond(e.visibleIf, this.state)) continue;
        const key = e.anim ? e.sprite : `char_${e.sprite}`;
        this.npcs.push({ def: e, actor: this.makeActor(key, e.x, e.y, e.dir, e.anim, this.entityObjects) });
      } else if (e.kind === 'interact' && e.tile) {
        if (e.visibleIf && !evalCond(e.visibleIf, this.state)) continue;
        const sprite = this.add.image(e.x * TILE, e.y * TILE, `tile_${e.tile}`).setOrigin(0).setDepth(100 + e.y - 0.5);
        this.entityObjects.push(sprite);
        this.props.push({ def: e, sprite });
      }
    }
  }

  private visible(e: { visibleIf?: import('../script/Script').Cond }) {
    return !e.visibleIf || evalCond(e.visibleIf, this.state);
  }

  private applyTint() {
    const t = tageszeitTint(this.state, !!this.def.outdoor);
    if (!this.tintRect) return;
    if (t) this.tintRect.setFillStyle(t[0], t[1]).setVisible(true);
    else this.tintRect.setVisible(false);
  }

  private blocked(x: number, y: number, ignoreNpcs = false): boolean {
    if (x < 0 || y < 0 || x >= this.parsed.width || y >= this.parsed.height) return true;
    if (this.parsed.solid[y][x]) return true;
    if (!ignoreNpcs && this.npcs.some((n) => n.actor.x === x && n.actor.y === y)) return true;
    if (this.props.some((p) => p.def.x === x && p.def.y === y)) return true;
    return false;
  }

  // ---------- Figuren ----------

  private syncActor(a: Actor) {
    const k = a.moving ? Math.min(1, a.t / a.dur) : 1;
    const px = Phaser.Math.Linear(a.fromX, a.x, k) * TILE;
    const py = Phaser.Math.Linear(a.fromY, a.y, k) * TILE;
    const hop = a.key === 'ping' && a.moving ? -Math.sin(k * Math.PI) * 3 : 0;
    a.sprite.setPosition(Math.round(px), Math.round(py + hop - (a.key === 'ping' ? 2 : 0)));
    a.sprite.setDepth(100 + py / TILE + (a.key === 'ping' ? -0.1 : 0));
  }

  private face(a: Actor, dir: Dir) {
    a.dir = dir;
    if (!a.key.startsWith('char_')) return;
    a.sprite.stop();
    a.sprite.setFrame(FRAME_BASE[dir]);
    a.sprite.setFlipX(dir === 'right');
  }

  private startMove(a: Actor, dir: Dir, dur: number) {
    const [dx, dy] = VEC[dir];
    a.fromX = a.x;
    a.fromY = a.y;
    a.x += dx;
    a.y += dy;
    a.t = 0;
    a.dur = dur;
    a.moving = true;
    a.dir = dir;
    if (a.key === 'ping') {
      a.sprite.setFlipX(dir === 'right');
      return;
    }
    const anim = `${a.key}_walk_${dir === 'right' ? 'left' : dir}`;
    a.sprite.setFlipX(dir === 'right');
    if (a.sprite.anims.currentAnim?.key !== anim || !a.sprite.anims.isPlaying) a.sprite.play(anim);
    a.sprite.anims.timeScale = WALK_MS / dur;
  }

  // ---------- Spielschleife ----------

  update(_time: number, dt: number) {
    this.touch?.setDpadVisible(!this.ui.active);
    if (this.ui.active) {
      this.ui.update(this.inp, dt);
    } else if (!this.scriptRunning) {
      this.handleInput();
    }
    this.stepActor(this.player, dt, true);
    if (this.ping) this.stepActor(this.ping, dt, false);
    this.net?.update(dt, this.player.x, this.player.y);
    const tint = this.net?.on ? 0x9aa8ff : 0xffffff;
    this.player.sprite.setTint(tint);
    for (const n of this.npcs) n.actor.sprite.setTint(tint);
    this.updateCamera();
  }

  private stepActor(a: Actor, dt: number, isPlayer: boolean) {
    if (!a.moving) return;
    a.t += dt;
    if (a.t >= a.dur) {
      a.moving = false;
      this.syncActor(a);
      if (isPlayer) {
        this.lastStepEnd = this.time.now;
        this.onPlayerArrived();
      }
      return;
    }
    this.syncActor(a);
  }

  private handleInput() {
    const inp = this.inp;
    if (this.player.moving) return;
    if (inp.consume('menu')) return void this.openMenu();
    if (inp.consume('help')) return void this.run(this.hintScript());
    if (inp.consume('net')) return this.toggleNet();
    if (inp.consume('a')) return this.interact();

    const dir = inp.direction();
    if (!dir) {
      if (this.player.sprite.anims.isPlaying) this.face(this.player, this.player.dir);
      return;
    }
    // Aus dem Stand: erst umdrehen, laufen erst, wenn die Taste gehalten wird.
    // (Bildraten-unabhängig: Zeitpunkt des Umdrehens merken statt Tastendauer zu messen.)
    const now = this.time.now;
    const walking = now - this.lastStepEnd < 60;
    if (dir !== this.player.dir && !walking) {
      this.face(this.player, dir);
      this.turnedAt = now;
      return;
    }
    if (!walking && now - this.turnedAt < TURN_DELAY_MS) return;
    const [dx, dy] = VEC[dir];
    if (this.blocked(this.player.x + dx, this.player.y + dy)) {
      this.face(this.player, dir);
      return;
    }
    const dur = inp.isDown('b') ? RUN_MS : WALK_MS;
    const prevX = this.player.x;
    const prevY = this.player.y;
    this.startMove(this.player, dir, dur);
    if (this.ping && !(this.ping.x === prevX && this.ping.y === prevY)) {
      const pdx = prevX - this.ping.x;
      const pdy = prevY - this.ping.y;
      if (Math.abs(pdx) + Math.abs(pdy) === 1) {
        this.startMove(this.ping, pdx > 0 ? 'right' : pdx < 0 ? 'left' : pdy > 0 ? 'down' : 'up', dur);
      } else {
        this.ping.x = prevX;
        this.ping.y = prevY;
        this.syncActor(this.ping);
      }
    }
  }

  private onPlayerArrived() {
    const { x, y } = this.player;
    this.state.x = x;
    this.state.y = y;
    this.state.dir = this.player.dir;
    for (const e of this.def.entities) {
      if (e.x !== x || e.y !== y) continue;
      if (e.kind === 'warp') return void this.doWarp(e.to.map, e.to.x, e.to.y, e.to.dir, true);
      if (e.kind === 'trigger' && this.visible({ visibleIf: e.activeIf })) return void this.run(e.script);
    }
  }

  private interact() {
    const [dx, dy] = VEC[this.player.dir];
    const tx = this.player.x + dx;
    const ty = this.player.y + dy;
    const npc = this.npcs.find((n) => n.actor.x === tx && n.actor.y === ty);
    const isPing = this.ping && this.ping.x === tx && this.ping.y === ty;
    const ent = this.def.entities.find((e) => e.kind === 'interact' && e.x === tx && e.y === ty && this.visible(e)) as InteractDef | undefined;

    // Mit aufgesetzter Brille: Objektkarte zeigen
    if (this.net?.on) {
      const scan: ScanData | undefined = npc?.def.scan ?? ent?.scan ?? (isPing && !ent ? PING_SCAN : undefined);
      if (scan) return void this.showScan(scan);
    }
    if (npc) {
      const opposite: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };
      this.face(npc.actor, opposite[this.player.dir]);
      return void this.run(npc.def.script);
    }
    // Gegenstände haben Vorrang vor Ping, falls Ping gerade auf demselben Feld steht
    if (ent) return void this.run(ent.script);
    if (isPing) return void this.run(this.hintScript());
  }

  private async showScan(scan: ScanData) {
    if (this.scriptRunning) return;
    this.scriptRunning = true;
    await this.modal<void>((r) => new ObjectCard(this, scan, r));
    this.scriptRunning = false;
    if (!this.state.flags.has('scan_erklaert')) void this.run(SCAN_ERKLAERUNG);
  }

  private toggleNet() {
    if (!this.state.items.has('netzblick_v1')) {
      void this.run([{ op: 'say', who: 'ping', text: 'Du hast doch noch gar keine Brille, Alex. Gurr?' }]);
      return;
    }
    const on = !this.net!.on;
    this.net!.setOn(on);
    this.hud.setNet(on);
    if (on && this.net!.hasNetwork && !this.state.flags.has('netzblick_erklaert')) void this.run(NETZBLICK_ERSTMALS);
    else if (on && !this.net!.hasNetwork) void this.run([{ op: 'say', who: 'ping', text: 'Hier drin sieht man keine Kabel. Probier es mal draußen!' }]);
  }

  private updateCamera() {
    const cam = this.cameras.main;
    const a = this.player;
    const k = a.moving ? Math.min(1, a.t / a.dur) : 1;
    const px = Phaser.Math.Linear(a.fromX, a.x, k) * TILE + 8;
    const py = Phaser.Math.Linear(a.fromY, a.y, k) * TILE + 8;
    const mw = this.parsed.width * TILE;
    const mh = this.parsed.height * TILE;
    const sx = mw <= cam.width ? -(cam.width - mw) / 2 : Phaser.Math.Clamp(px - cam.width / 2, 0, mw - cam.width);
    const sy = mh <= cam.height ? -(cam.height - mh) / 2 : Phaser.Math.Clamp(py - cam.height / 2, 0, mh - cam.height);
    cam.setScroll(Math.round(sx), Math.round(sy));
  }

  // ---------- Scripts ----------

  private bildImage?: Phaser.GameObjects.Image;
  private enterNachScript = false;

  private nachScript() {
    this.refreshAfterScript();
    if (this.enterNachScript) {
      this.enterNachScript = false;
      this.runEnterScript();
    }
  }

  /** Bild neben dem Dialog, z. B. zu einem Museumsexponat. */
  private showBild(key: string | null) {
    this.bildImage?.destroy();
    this.bildImage = undefined;
    if (key) this.bildImage = this.add.image(12, 58, key).setOrigin(0).setScrollFactor(0).setDepth(UI_DEPTH - 1);
  }

  private async run(script: Script) {
    if (this.scriptRunning) return;
    this.scriptRunning = true;
    this.player.sprite.stop();
    this.face(this.player, this.player.dir);
    try {
      await runScript(script, this.host());
    } finally {
      this.scriptRunning = false;
      this.showBild(null);
      this.nachScript();
    }
  }

  private refreshAfterScript() {
    this.refreshEntities();
    if (this.pingVisible() && !this.ping) this.placePing();
    this.hud.setTime(zeitLabel(this.state));
    this.applyTint();
  }

  private runEnterScript() {
    if (this.def.onEnter?.length) void this.run(this.def.onEnter);
  }

  private async doWarp(map: MapId, x: number, y: number, dir: Dir, fromStep: boolean) {
    const imScript = this.scriptRunning;
    this.scriptRunning = true;
    await new Promise<void>((r) => {
      this.cameras.main.fadeOut(180);
      this.cameras.main.once('camerafadeoutcomplete', () => r());
    });
    const netWasOn = this.net?.on ?? false;
    this.loadMap(map, x, y, dir);
    if (netWasOn) {
      this.net!.setOn(true);
      this.hud.setNet(true);
    }
    autosave(this.state);
    this.cameras.main.fadeIn(180);
    this.scriptRunning = imScript;
    if (fromStep) this.runEnterScript();
    // Warp mitten in einem Script: Begrüßung der neuen Karte läuft, wenn das Script fertig ist.
    else this.enterNachScript = true;
  }

  private modal<T>(make: (resolve: (v: T) => void) => import('../ui/widgets').Modal): Promise<T> {
    return new Promise<T>((resolve) => this.ui.push(make(resolve)));
  }

  private host(): ScriptHost {
    return {
      state: this.state,
      say: (who, text) => this.modal<void>((r) => new DialogBox(this, who ? (SPEAKERS[who] ?? who) : undefined, text, r)),
      choose: async (who, text, labels) => {
        let dialog: DialogBox | undefined;
        if (text) {
          // Frage vollständig zeigen und stehen lassen, während die Auswahl darüber liegt
          await this.modal<void>((r) => (dialog = new DialogBox(this, who ? SPEAKERS[who] : undefined, text, r, true)));
        }
        const i = await this.modal<number>((r) => new ListMenu(this, labels, r, { anchor: 'right-bottom' }));
        dialog?.close();
        return i;
      },
      toast: (text) => this.modal<void>((r) => new Toast(this, text, r)),
      itemReceived: (item: ItemId) => this.modal<void>((r) => new Toast(this, `Erhalten: ${ITEMS[item].name}`, r, ITEMS[item].icon)),
      questChanged: (id: QuestId | null) => this.hud.setQuest(id ? QUESTS[id].titel : null),
      lexiconUnlocked: (id: LexiconId) => this.modal<void>((r) => new Toast(this, `Neu im Netzbuch: ${LEXICON[id].titel}`, r)),
      wait: (ms) => new Promise((r) => this.time.delayedCall(ms, r)),
      warp: (map, x, y, dir) => this.doWarp(map, x, y, dir, false),
      turnPlayer: (dir) => this.face(this.player, dir),
      calendar: () => this.calendar(),
      save: () => this.saveDialog(),
      interlude: (text) => this.modal<void>((r) => new Interlude(this, text, r)),
      minigame: async (id) => {
        const [name, param] = id.split(':');
        const mg = MINIGAMES[name];
        if (!mg) throw new Error(`Minispiel ${id} fehlt`);
        await mg({ scene: this, input: this.inp, state: this.state, push: (m) => this.ui.push(m), param });
      },
      faceNpc: (id, dir) => {
        const n = this.npcs.find((x) => x.def.id === id);
        if (n) this.face(n.actor, dir);
      },
      refresh: () => this.refreshAfterScript(),
      showBild: (key) => this.showBild(key),
      bytesChanged: (d) => this.modal<void>((r) => new Toast(this, `${d > 0 ? '+' : '–'}${formatBytes(Math.abs(d))} · Jetzt: ${formatBytes(this.state.bytes)}`, r)),
    };
  }

  private hintScript(): Script {
    const q = this.state.questId;
    if (!q) return [{ op: 'say', who: 'ping', text: 'Schau dich einfach um und sprich mit allen. Gurr!' }];
    const level = this.hintLevel.get(q) ?? 0;
    const hints = QUESTS[q].hinweise;
    this.hintLevel.set(q, Math.min(level + 1, hints.length - 1));
    const script: Script = [{ op: 'say', who: 'ping', text: hints[level] }];
    if (level < hints.length - 1) {
      script.push({
        op: 'choice',
        options: [
          { label: 'Noch ein Tipp, bitte!', then: [{ op: 'say', who: 'ping', text: hints[level + 1] }] },
          { label: 'Danke, Ping!', then: [] },
        ],
      });
      this.hintLevel.set(q, Math.min(level + 2, hints.length - 1));
    }
    return script;
  }

  private async calendar() {
    const h = this.host();
    const c = await h.choose(undefined, `Dein Schulkalender. Gerade ist ${stufeLabel(this.state.stufe)}. Umblättern?`, [
      'Ins nächste Schuljahr blättern',
      'Lieber nicht',
    ]);
    if (c !== 0) return;
    const code = await this.modal<string | null>((r) => new CodeInput(this, 'Code deiner Lehrkraft:', 8, r, this.inp));
    if (!code) return;
    const stufe = checkCalendarCode(code, CALENDAR_CODES);
    if (stufe === null) return h.say('ping', 'Hmm, der Code stimmt nicht. Frag deine Lehrkraft nach dem richtigen Code. Gurr!');
    if (stufe <= this.state.stufe) return h.say('ping', `${stufeLabel(stufe)} hast du schon erreicht. Das Kalenderblatt ist längst umgeblättert!`);
    this.state.stufe = stufe;
    await h.say(undefined, 'Du blätterst die Seiten um … ein neues Schuljahr beginnt.');
    if (stufe > 8) await h.say('ping', `Für ${stufeLabel(stufe)} wird gerade noch gebaut. Bis dahin geht es mit Klasse 8 weiter! Gurr!`);
    if (!this.state.flags.has('k2_start')) await this.startKapitel2();
    autosave(this.state);
  }

  /** Für Browser-Tests: Kapitel 2 starten, ohne einen echten Kalender-Code zu kennen. */
  testStartKapitel2() {
    if (this.scriptRunning) return;
    this.scriptRunning = true;
    void this.startKapitel2().finally(() => {
      this.scriptRunning = false;
      this.nachScript();
    });
  }

  /** Kapitel 2 beginnt: Startzustand herstellen (falls Kapitel 1 übersprungen wurde) und Einstieg abspielen. */
  async startKapitel2() {
    const start = KAPITEL_START[8];
    for (const i of start.items) this.state.items.add(i);
    for (const f of start.flags) this.state.flags.add(f);
    for (const l of start.lexicon) this.state.lexicon.add(l);
    if (this.state.stufe < 8) this.state.stufe = 8;
    await runScript(KAPITEL2_START, this.host());
  }

  private async saveDialog() {
    const code = autosave(this.state);
    await this.host().say(undefined, `Gespeichert! Dein Speichercode lautet:\n${code.replace(/-/g, ' ')}`);
    await this.host().say('ping', 'Schreib den Code in deinen Hefter. Damit kannst du auf jedem Computer weiterspielen!');
  }

  private async openMenu() {
    const labels = ['Weiter', 'Rucksack', 'Netzbuch', 'Speichern', 'Zum Titel'];
    const i = await this.modal<number>((r) => new ListMenu(this, labels, r, { anchor: 'right-top', cancellable: true, title: 'Menü' }));
    if (i === 1) {
      const entries = [...this.state.items].map((id) => ({ titel: ITEMS[id].name, text: ITEMS[id].beschreibung, icon: ITEMS[id].icon }));
      await this.modal<void>((r) => new InfoPanel(this, `Rucksack · ${formatBytes(this.state.bytes)}`, entries, 'Dein Rucksack ist noch leer.', r));
    } else if (i === 2) {
      const entries = [...this.state.lexicon].map((id) => ({ titel: LEXICON[id].titel, text: LEXICON[id].text }));
      await this.modal<void>((r) => new InfoPanel(this, 'Netzbuch', entries, 'Noch keine Einträge. Entdecke die Welt!', r));
    } else if (i === 3) {
      await this.run([{ op: 'save' }]);
    } else if (i === 4) {
      autosave(this.state);
      this.cameras.main.fadeOut(200);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Title'));
    }
  }

  getPlayerTile() {
    return { x: this.player.x, y: this.player.y, dir: this.player.dir, moving: this.player.moving };
  }

  isBusy() {
    return this.scriptRunning || this.ui.active;
  }

  netOn() {
    return this.net?.on ?? false;
  }
}


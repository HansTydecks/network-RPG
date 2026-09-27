import { LIEDER, frequenz, liedLaenge, melodieToene, musterToene, type LiedId, type Ton, type Welle } from './musikLogic';

/**
 * Selbst erzeugter Chiptune-Klang über WebAudio: keine Audiodateien.
 * Musik läuft über einen Sequenzer mit Vorausplanung, Geräusche sind kurze Synth-Figuren.
 * Browser erlauben Ton erst nach einer Nutzeraktion: `entsperren()` hängt an Taste/Klick.
 */

export type Geraeusch =
  | 'blip' | 'weiter' | 'cursor' | 'ok' | 'zurueck' | 'tuer' | 'stoss' | 'item' | 'quest' | 'netzbuch'
  | 'muenze' | 'bezahlen' | 'richtig' | 'falsch' | 'geschafft' | 'netz_an' | 'netz_aus' | 'gurr' | 'toast' | 'tippen';

interface Einstellungen {
  musik: boolean;
  geraeusche: boolean;
}

const SPEICHER = 'netzblick_ton';
const VORAUS = 0.15;
const TAKT_MS = 30;

interface Spur {
  toene: Ton[];
  welle: Welle;
  laut: number;
  art: 'lead' | 'bass' | 'begleitung';
}

interface Laufend {
  id: LiedId;
  spuren: Spur[];
  drums: string[];
  laenge: number;
  achtel: number;
  start: number;
  naechster: number;
  gain: GainNode;
}

class AudioEngine {
  private ctx?: AudioContext;
  private master?: GainNode;
  private musikBus?: GainNode;
  private sfxBus?: GainNode;
  private wellen = new Map<Welle, PeriodicWave | OscillatorType>();
  private rauschen?: AudioBuffer;
  private laufend?: Laufend;
  private gewuenscht: LiedId | null = null;
  private ueberlagert: LiedId[] = [];
  private letzte = new Map<Geraeusch, number>();
  einstellungen: Einstellungen = { musik: true, geraeusche: true };

  constructor() {
    try {
      const s = JSON.parse(localStorage.getItem(SPEICHER) ?? 'null');
      if (s) this.einstellungen = { ...this.einstellungen, ...s };
    } catch {
      /* ohne Speicher: Standard */
    }
  }

  /** Einmal an die erste Taste/den ersten Klick hängen. */
  entsperren() {
    if (typeof window === 'undefined' || !('AudioContext' in window)) return;
    if (!this.ctx) this.aufbauen();
    if (this.ctx?.state === 'suspended') void this.ctx.resume();
  }

  private aufbauen() {
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0.75;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    this.master.connect(comp).connect(ctx.destination);

    this.musikBus = ctx.createGain();
    this.musikBus.gain.value = this.einstellungen.musik ? 0.55 : 0;
    // Leichtes Echo für mehr Raum
    const echo = ctx.createDelay(1);
    echo.delayTime.value = 0.27;
    const rueck = ctx.createGain();
    rueck.gain.value = 0.22;
    const nass = ctx.createGain();
    nass.gain.value = 0.25;
    const tief = ctx.createBiquadFilter();
    tief.type = 'lowpass';
    tief.frequency.value = 2600;
    this.musikBus.connect(this.master);
    this.musikBus.connect(echo);
    echo.connect(tief).connect(rueck).connect(echo);
    tief.connect(nass).connect(this.master);

    this.sfxBus = ctx.createGain();
    this.sfxBus.gain.value = this.einstellungen.geraeusche ? 0.7 : 0;
    this.sfxBus.connect(this.master);

    for (const [name, duty] of [['puls12', 0.125], ['puls25', 0.25], ['puls50', 0.5]] as const) this.wellen.set(name, this.pulsWelle(duty));
    this.wellen.set('dreieck', 'triangle');
    this.wellen.set('sinus', 'sine');

    const len = ctx.sampleRate;
    this.rauschen = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.rauschen.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

    window.setInterval(() => this.planen(), TAKT_MS);
    if (this.gewuenscht) this.starteLied(this.aktuellesZiel());
  }

  private pulsWelle(duty: number): PeriodicWave {
    const n = 32;
    const re = new Float32Array(n);
    const im = new Float32Array(n);
    for (let k = 1; k < n; k++) re[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * duty);
    return this.ctx!.createPeriodicWave(re, im);
  }

  private osc(welle: Welle | OscillatorType): OscillatorNode {
    const o = this.ctx!.createOscillator();
    const w = this.wellen.get(welle as Welle) ?? welle;
    if (typeof w === 'string') o.type = w as OscillatorType;
    else o.setPeriodicWave(w);
    return o;
  }

  // ---------- Einstellungen ----------

  setzen(e: Partial<Einstellungen>) {
    this.einstellungen = { ...this.einstellungen, ...e };
    try {
      localStorage.setItem(SPEICHER, JSON.stringify(this.einstellungen));
    } catch {
      /* egal */
    }
    const t = this.ctx?.currentTime ?? 0;
    this.musikBus?.gain.setTargetAtTime(this.einstellungen.musik ? 0.55 : 0, t, 0.05);
    this.sfxBus?.gain.setTargetAtTime(this.einstellungen.geraeusche ? 0.7 : 0, t, 0.05);
  }

  // ---------- Musik ----------

  /** Hintergrundlied setzen (gleiches Lied läuft einfach weiter). */
  musik(id: LiedId | null) {
    this.gewuenscht = id;
    this.wechsel();
  }

  /** Vorübergehend ein anderes Lied (Minispiel, Kampf), `zurueck()` stellt das alte wieder her. */
  ueberlagern(id: LiedId) {
    this.ueberlagert.push(id);
    this.wechsel();
  }

  zurueck() {
    this.ueberlagert.pop();
    this.wechsel();
  }

  get aktuellesLied(): LiedId | null {
    return this.laufend?.id ?? null;
  }

  private aktuellesZiel(): LiedId | null {
    return this.ueberlagert[this.ueberlagert.length - 1] ?? this.gewuenscht;
  }

  private wechsel() {
    if (!this.ctx) return;
    const ziel = this.aktuellesZiel();
    if (ziel === (this.laufend?.id ?? null)) return;
    this.starteLied(ziel);
  }

  private starteLied(id: LiedId | null) {
    const ctx = this.ctx!;
    if (this.laufend) {
      const g = this.laufend.gain;
      g.gain.setTargetAtTime(0, ctx.currentTime, 0.12);
      setTimeout(() => g.disconnect(), 800);
      this.laufend = undefined;
    }
    if (!id) return;
    const l = LIEDER[id];
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.gain.setTargetAtTime(1, ctx.currentTime + 0.05, 0.15);
    gain.connect(this.musikBus!);
    this.laufend = {
      id,
      spuren: [
        { toene: melodieToene(l.melodie), welle: l.lead, laut: 0.22 * (l.laut ?? 1), art: 'lead' },
        { toene: musterToene(l.bass, l.akkorde, 0, false), welle: 'dreieck', laut: 0.34, art: 'bass' },
        ...(l.begleitung ? [{ toene: musterToene(l.begleitung, l.akkorde, 1, true), welle: 'puls12' as Welle, laut: 0.07, art: 'begleitung' as const }] : []),
      ],
      drums: l.drums ? l.drums.trim().split(/\s+/) : [],
      laenge: liedLaenge(l),
      achtel: 30 / l.bpm,
      start: ctx.currentTime + 0.1,
      naechster: 0,
      gain,
    };
  }

  private planen() {
    const ctx = this.ctx;
    const l = this.laufend;
    if (!ctx || !l || ctx.state !== 'running') return;
    if (l.start + l.naechster * l.achtel < ctx.currentTime - 0.5) {
      // Tab war im Hintergrund: nicht nachholen, sondern neu ansetzen
      l.start = ctx.currentTime - l.naechster * l.achtel + 0.05;
    }
    while (l.start + l.naechster * l.achtel < ctx.currentTime + VORAUS) {
      const schritt = l.naechster % l.laenge;
      const t = l.start + l.naechster * l.achtel;
      for (const s of l.spuren) for (const ton of s.toene) if (ton.start === schritt) this.note(s, ton, t, l);
      const d = l.drums[schritt % 8];
      if (d && d !== '.') this.trommel(d, t, l.gain);
      l.naechster++;
    }
  }

  private note(s: Spur, ton: Ton, t: number, l: Laufend) {
    const ctx = this.ctx!;
    const dauer = ton.laenge * l.achtel;
    const o = this.osc(s.welle);
    o.frequency.value = frequenz(ton.midi);
    const g = ctx.createGain();
    const ende = t + dauer * (s.art === 'bass' ? 0.9 : 0.95);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(s.laut, t + 0.008);
    g.gain.exponentialRampToValueAtTime(s.laut * (s.art === 'begleitung' ? 0.3 : 0.6), t + Math.min(0.15, dauer * 0.6));
    g.gain.setValueAtTime(s.laut * (s.art === 'begleitung' ? 0.3 : 0.6), ende - 0.03);
    g.gain.linearRampToValueAtTime(0, ende);
    if (s.art === 'lead' && dauer > 0.3) {
      // Sanftes Vibrato auf langen Tönen
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 5.5;
      const tiefe = ctx.createGain();
      tiefe.gain.setValueAtTime(0, t);
      tiefe.gain.linearRampToValueAtTime(frequenz(ton.midi) * 0.006, t + 0.25);
      lfo.connect(tiefe).connect(o.frequency);
      lfo.start(t);
      lfo.stop(ende + 0.05);
    }
    let kette: AudioNode = g;
    if (s.welle.startsWith('puls')) {
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = s.art === 'lead' ? 3800 : 2400;
      g.connect(f);
      kette = f;
    }
    o.connect(g);
    kette.connect(l.gain);
    o.start(t);
    o.stop(ende + 0.05);
  }

  private trommel(art: string, t: number, ziel: AudioNode) {
    const ctx = this.ctx!;
    if (art === 'k') {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(140, t);
      o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.5, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      o.connect(g).connect(ziel);
      o.start(t);
      o.stop(t + 0.18);
      return;
    }
    const n = ctx.createBufferSource();
    n.buffer = this.rauschen!;
    const f = ctx.createBiquadFilter();
    const g = ctx.createGain();
    const lang = art === 's' ? 0.12 : art === 'o' ? 0.18 : 0.035;
    f.type = art === 's' ? 'bandpass' : 'highpass';
    f.frequency.value = art === 's' ? 1800 : 7000;
    g.gain.setValueAtTime(art === 's' ? 0.22 : 0.07, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + lang);
    n.connect(f).connect(g).connect(ziel);
    n.start(t, Math.random() * 0.5);
    n.stop(t + lang + 0.02);
  }

  // ---------- Geräusche ----------

  /** Kurzer Ton mit optionalem Tonhöhenverlauf. */
  private ton(welle: Welle | OscillatorType, f0: number, f1: number, t: number, dauer: number, laut: number) {
    const ctx = this.ctx!;
    const o = this.osc(welle);
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dauer);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(laut, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.001, t + dauer);
    o.connect(g).connect(this.sfxBus!);
    o.start(t);
    o.stop(t + dauer + 0.02);
  }

  /** Tonfolge (MIDI-Nummern) als kleiner Jingle. */
  private folge(noten: number[], schritt: number, welle: Welle, laut: number, letzteLang = 2) {
    const t0 = this.ctx!.currentTime + 0.01;
    noten.forEach((n, i) => {
      const f = frequenz(n);
      const lang = i === noten.length - 1 ? schritt * letzteLang : schritt * 1.1;
      this.ton(welle, f, f, t0 + i * schritt, lang, laut);
    });
  }

  private rauschStoss(t: number, dauer: number, f0: number, f1: number, laut: number) {
    const ctx = this.ctx!;
    const n = ctx.createBufferSource();
    n.buffer = this.rauschen!;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.Q.value = 1.5;
    f.frequency.setValueAtTime(f0, t);
    f.frequency.exponentialRampToValueAtTime(f1, t + dauer);
    const g = ctx.createGain();
    g.gain.setValueAtTime(laut, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dauer);
    n.connect(f).connect(g).connect(this.sfxBus!);
    n.start(t, Math.random() * 0.5);
    n.stop(t + dauer + 0.02);
  }

  /** `hoehe` verschiebt Stimmen-Blips (z. B. je Sprecher). */
  sfx(name: Geraeusch, hoehe = 0) {
    if (!this.ctx || this.ctx.state !== 'running' || !this.einstellungen.geraeusche) return;
    const jetzt = performance.now();
    const minAbstand = name === 'stoss' ? 280 : name === 'blip' ? 45 : 25;
    if (jetzt - (this.letzte.get(name) ?? -1e9) < minAbstand) return;
    this.letzte.set(name, jetzt);
    const t = this.ctx.currentTime + 0.005;
    const b = frequenz(72 + hoehe);
    switch (name) {
      case 'blip':
        return this.ton('puls50', b * (1 + (Math.random() - 0.5) * 0.06), b, t, 0.035, 0.05);
      case 'tippen':
        return this.ton('puls25', 1400, 1400, t, 0.02, 0.05);
      case 'weiter':
        return this.ton('puls25', 1200, 1600, t, 0.04, 0.06);
      case 'cursor':
        return this.ton('puls25', 990, 990, t, 0.04, 0.07);
      case 'ok':
        this.ton('puls25', 880, 880, t, 0.05, 0.08);
        return this.ton('puls25', 1320, 1320, t + 0.05, 0.08, 0.08);
      case 'zurueck':
        this.ton('puls25', 660, 660, t, 0.05, 0.07);
        return this.ton('puls25', 440, 440, t + 0.05, 0.08, 0.07);
      case 'tuer':
        this.rauschStoss(t, 0.22, 600, 2400, 0.12);
        return this.ton('dreieck', 220, 330, t, 0.15, 0.12);
      case 'stoss':
        return this.ton('dreieck', 110, 70, t, 0.08, 0.25);
      case 'item':
        return this.folge([72, 76, 79, 84, 79, 84], 0.075, 'puls25', 0.1, 4);
      case 'quest':
        return this.folge([67, 72, 76], 0.09, 'puls12', 0.1, 3);
      case 'netzbuch':
        return this.folge([76, 79, 83, 88], 0.07, 'dreieck', 0.18, 4);
      case 'muenze':
        this.ton('puls25', 988, 988, t, 0.06, 0.08);
        return this.ton('puls25', 1319, 1319, t + 0.06, 0.25, 0.08);
      case 'bezahlen':
        return this.folge([79, 76, 72], 0.06, 'puls25', 0.08);
      case 'richtig':
        return this.folge([76, 83], 0.07, 'puls25', 0.09, 2.5);
      case 'falsch':
        this.ton('puls50', 196, 185, t, 0.14, 0.07);
        return this.ton('puls50', 185, 155, t + 0.14, 0.22, 0.07);
      case 'geschafft':
        return this.folge([72, 76, 79, 72, 76, 79, 84, 84], 0.085, 'puls25', 0.1, 5);
      case 'netz_an':
        this.ton('sinus', 300, 1800, t, 0.3, 0.12);
        return this.ton('puls12', 600, 3600, t + 0.03, 0.3, 0.03);
      case 'netz_aus':
        return this.ton('sinus', 1500, 250, t, 0.25, 0.12);
      case 'gurr':
        // „Gurr": zwei weiche, fallende Laute
        this.ton('sinus', 520, 380, t, 0.12, 0.16);
        return this.ton('sinus', 470, 330, t + 0.13, 0.16, 0.14);
      case 'toast':
        return this.ton('dreieck', 880, 1320, t, 0.12, 0.14);
    }
  }
}

export const audio = new AudioEngine();

/** Für Browser-Tests. */
(globalThis as unknown as { __audio?: AudioEngine }).__audio = audio;

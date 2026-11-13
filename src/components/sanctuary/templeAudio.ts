import type { AmbientModeId } from './templeData';

/**
 * Procedural Web Audio synthesis engine for Chánh Điện 3D.
 * Zero external MP3/WAV dependencies: synthesizes Đại Hồng Chung bells,
 * wooden fish (mõ gỗ), bodhi mala beads, 108-bead completion harmonics,
 * rejoice chimes, and continuous ambient meditation soundscapes.
 */
class TempleAudioEngine {
  private ctx: AudioContext | null = null;
  private ambientTimer: ReturnType<typeof setInterval> | null = null;
  private rainNode: AudioNode | null = null;
  private droneNodes: OscillatorNode[] = [];
  private masterGain: GainNode | null = null;
  private enabled = true;
  private currentMode: AmbientModeId = 'singing_bowl';

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.72;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setEnabled(next: boolean, mode: AmbientModeId = this.currentMode) {
    this.enabled = next;
    this.currentMode = mode;
    if (!next || mode === 'silent') {
      this.stopAmbient();
    } else {
      this.startAmbient(mode);
    }
  }

  public setAmbientMode(mode: AmbientModeId) {
    this.currentMode = mode;
    if (!this.enabled || mode === 'silent') {
      this.stopAmbient();
    } else {
      this.startAmbient(mode);
    }
  }

  /** Resonant bronze Đại Hồng Chung bell strike */
  public playGreatBell(volume = 0.34) {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const partials: Array<[number, number, number]> = [
      [130.81, 0.55, 5.2], // Deep bronze fundamental
      [261.63, 0.35, 4.4],
      [392.0, 0.22, 3.8],
      [528.0, 0.16, 3.2],
      [784.0, 0.08, 2.4],
    ];

    for (const [freq, amp, decay] of partials) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(amp * volume, now + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + decay + 0.05);
    }
  }

  /** Crisp hollow camphor-wood fish knock (Mõ gỗ) */
  public playMoktak(volume = 0.42) {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(340, now + 0.085);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(760, now);
    filter.Q.value = 3.2;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  /** Dual-oscillator sandalwood mala bead click */
  public playMalaBead(volume = 0.35) {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const o1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    o1.type = 'sine';
    o1.frequency.setValueAtTime(1260, now);
    o1.frequency.exponentialRampToValueAtTime(340, now + 0.035);
    g1.gain.setValueAtTime(volume * 0.65, now);
    g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
    o1.connect(g1);
    g1.connect(this.masterGain);
    o1.start(now);
    o1.stop(now + 0.055);

    const o2 = ctx.createOscillator();
    const bp = ctx.createBiquadFilter();
    const g2 = ctx.createGain();
    o2.type = 'triangle';
    o2.frequency.setValueAtTime(760, now);
    o2.frequency.exponentialRampToValueAtTime(210, now + 0.07);
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(640, now);
    bp.Q.value = 2.6;
    g2.gain.setValueAtTime(volume * 0.55, now);
    g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);
    o2.connect(bp);
    bp.connect(g2);
    g2.connect(this.masterGain);
    o2.start(now);
    o2.stop(now + 0.095);
  }

  /** 4-harmonic Tibetan bowl completion chord at 108 beads */
  public playMalaComplete108(volume = 0.25) {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const freqs = [587.33, 880, 1174.66, 1760];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      const amp = volume / (1 + idx * 0.65);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(amp, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
      osc.connect(g);
      g.connect(this.masterGain!);
      osc.start(now);
      osc.stop(now + 2.85);
    });
  }

  /** Two-tone rejoice chime (Tùy hỷ công đức) */
  public playRejoiceChime(volume = 0.22) {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    [
      [1567.98, 0],
      [2093.0, 0.09],
    ].forEach(([freq, offset]) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + offset);
      g.gain.setValueAtTime(0.0001, now + offset);
      g.gain.linearRampToValueAtTime(volume, now + offset + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, now + offset + 1.6);
      osc.connect(g);
      g.connect(this.masterGain!);
      osc.start(now + offset);
      osc.stop(now + offset + 1.65);
    });
  }

  private playSoftSingingBowl() {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const root = [396, 432, 528][Math.floor(Math.random() * 3)];
    [1, 2.01].forEach((mult, i) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(root * mult, now);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(i === 0 ? 0.065 : 0.022, now + 0.3);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 6.0);
      osc.connect(g);
      g.connect(this.masterGain!);
      osc.start(now);
      osc.stop(now + 6.1);
    });
  }

  public startAmbient(mode: AmbientModeId) {
    this.stopAmbient();
    if (!this.enabled || mode === 'silent') return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    if (mode === 'bell_moktak') {
      this.ambientTimer = setInterval(() => {
        if (Math.random() < 0.7) {
          this.playMoktak(0.11);
        } else {
          this.playGreatBell(0.12);
        }
      }, 2800);
    } else if (mode === 'singing_bowl') {
      const now = ctx.currentTime;
      const drone = ctx.createOscillator();
      const droneGain = ctx.createGain();
      drone.type = 'sine';
      drone.frequency.setValueAtTime(108, now);
      droneGain.gain.setValueAtTime(0.025, now);
      drone.connect(droneGain);
      droneGain.connect(this.masterGain);
      drone.start(now);
      this.droneNodes.push(drone);
      this.playSoftSingingBowl();
      this.ambientTimer = setInterval(() => this.playSoftSingingBowl(), 7500);
    } else if (mode === 'rain_chimes') {
      // Filtered subtle noise rain texture
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.04 * white) / 1.04;
        lastOut = data[i];
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1100;
      filter.Q.value = 0.65;
      const rainGain = ctx.createGain();
      rainGain.gain.value = 0.09;
      src.connect(filter);
      filter.connect(rainGain);
      rainGain.connect(this.masterGain);
      src.start();
      this.rainNode = src;

      this.ambientTimer = setInterval(() => {
        if (Math.random() < 0.55) {
          this.playRejoiceChime(0.06);
        }
      }, 4200);
    }
  }

  public stopAmbient() {
    if (this.ambientTimer) {
      clearInterval(this.ambientTimer);
      this.ambientTimer = null;
    }
    this.droneNodes.forEach((n) => {
      try {
        n.stop();
        n.disconnect();
      } catch {
        // ignore stopped oscillator
      }
    });
    this.droneNodes = [];
    if (this.rainNode) {
      try {
        (this.rainNode as AudioBufferSourceNode).stop();
        this.rainNode.disconnect();
      } catch {
        // ignore
      }
      this.rainNode = null;
    }
  }
}

export const templeAudio = new TempleAudioEngine();


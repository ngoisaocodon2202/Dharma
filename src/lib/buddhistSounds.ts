// Buddhist Sound Synthesizer using Web Audio API
// High fidelity, instant, zero latency, works offline 100%

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx || audioCtx.state === 'closed') {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a resonant Tibetan Singing Bowl / Temple Bell sound
 */
export function playBellSound(volume = 0.4) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(volume, now);
    master.connect(ctx.destination);

    // Multi-harmonic frequencies of authentic bronze singing bowl
    const partials = [
      { freq: 216, gain: 0.7, decay: 6.5 },   // Fundamental warm drone
      { freq: 432, gain: 0.35, decay: 5.0 },  // 1st harmonic
      { freq: 648, gain: 0.18, decay: 3.5 },  // 2nd harmonic
      { freq: 1080, gain: 0.08, decay: 2.0 }, // Shimmer overtone
    ];

    partials.forEach(({ freq, gain, decay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Bell strike attack and gentle exponential decay
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(gain, now + 0.008);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gainNode);
      gainNode.connect(master);

      osc.start(now);
      osc.stop(now + decay);
    });
  } catch (err) {
    console.error('Bell sound error:', err);
  }
}

/**
 * Play an authentic Wooden Fish (Mõ Gỗ) click sound for chanting / counting beads
 */
export function playWoodenFishSound(volume = 0.5) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(volume, now);
    master.connect(ctx.destination);

    // Main wooden resonant body (hollow teak / camphor wood)
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    // Pitch drops slightly upon strike to simulate wooden hollow resonance
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(1, now + 0.003);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    // Filter to give that warm, mellow hollow wood block tone (700Hz - 900Hz)
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(780, now);
    filter.Q.setValueAtTime(2.8, now);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(master);

    osc.start(now);
    osc.stop(now + 0.15);

    // Short wooden thud click (mallet impact)
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'sine';
    clickOsc.frequency.setValueAtTime(1200, now);
    clickGain.gain.setValueAtTime(0.3, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

    clickOsc.connect(clickGain);
    clickGain.connect(master);
    clickOsc.start(now);
    clickOsc.stop(now + 0.02);

    // Vibration haptic feedback on mobile if supported (25ms)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {}
    }
  } catch (err) {
    console.error('Wooden fish sound error:', err);
  }
}

/**
 * Play a resonant Đại Hồng Chung (Grand Temple Bell) with deep warm bronze drone
 */
export function playGrandTempleBellSound(volume = 0.45) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(volume, now);
    master.connect(ctx.destination);

    // Sacred harmonic partials of a large bronze temple bell (Đại Hồng Chung)
    const bellPartials = [
      { freq: 108, gain: 0.85, decay: 8.5 }, // Deep fundamental hum (108 sacred number)
      { freq: 216, gain: 0.65, decay: 7.0 }, // Octave harmonic
      { freq: 324, gain: 0.35, decay: 5.5 }, // Quint
      { freq: 432, gain: 0.22, decay: 4.0 }, // Universal 432Hz healing pitch
      { freq: 648, gain: 0.12, decay: 2.8 }, // Overtone shimmer
      { freq: 972, gain: 0.06, decay: 1.8 }, // Bronze edge strike
    ];

    bellPartials.forEach(({ freq, gain, decay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(gain, now + 0.012);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gainNode);
      gainNode.connect(master);

      osc.start(now);
      osc.stop(now + decay);
    });

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 60, 40]);
      } catch {}
    }
  } catch (err) {
    console.error('Grand temple bell sound error:', err);
  }
}

/**
 * Play a realistic paper page-flip / page-turn rustle sound
 */
export function playPageTurnSound(volume = 0.25) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.26;
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate soft pink/brown-ish noise with an S-curve paper rustle envelope
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const t = i / bufferSize;
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.08 * white) / 1.08;
      // Double-peak envelope simulating lifting & laying down a paper leaf
      const env = Math.sin(Math.PI * t) * (0.75 + 0.25 * Math.sin(Math.PI * 3 * t));
      data[i] = lastOut * env * 2.2;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Bandpass filter sweeping up slightly like a turning page
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(950, now);
    bandpass.frequency.exponentialRampToValueAtTime(1950, now + duration * 0.65);
    bandpass.frequency.exponentialRampToValueAtTime(1100, now + duration);
    bandpass.Q.setValueAtTime(1.1, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + duration);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {}
    }
  } catch (err) {
    // Ignore audio context restrictions quietly
  }
}

let activeDroneController: { stop: () => void } | null = null;

/**
 * Start a soothing meditative Sanskrit OM frequency (136.1 Hz) continuous drone
 * with harmonic Tibetan singing bowl partials for deep relaxation
 */
export function startMeditativeDrone(volume = 0.22) {
  try {
    // Stop any existing drone first
    stopMeditativeDrone();

    const ctx = getAudioContext();
    if (!ctx) return null;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.linearRampToValueAtTime(volume, now + 1.2);
    master.connect(ctx.destination);

    // Sacred OM frequency 136.1Hz & meditative harmonic overtones
    const dronePartials = [
      { freq: 136.1, gain: 0.5, detune: 0 },
      { freq: 272.2, gain: 0.3, detune: 4 },
      { freq: 408.3, gain: 0.15, detune: -3 },
      { freq: 544.4, gain: 0.08, detune: 6 },
    ];

    const oscs: OscillatorNode[] = [];

    dronePartials.forEach(({ freq, gain, detune }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(detune, now);

      g.gain.setValueAtTime(gain, now);

      osc.connect(g);
      g.connect(master);
      osc.start(now);
      oscs.push(osc);
    });

    const controller = {
      stop: () => {
        try {
          const stopNow = ctx.currentTime;
          master.gain.setValueAtTime(master.gain.value, stopNow);
          master.gain.exponentialRampToValueAtTime(0.0001, stopNow + 1.0);
          setTimeout(() => {
            oscs.forEach((osc) => {
              try {
                osc.stop();
                osc.disconnect();
              } catch {}
            });
          }, 1100);
        } catch {}
      },
    };

    activeDroneController = controller;
    return controller;
  } catch (err) {
    console.error('Meditative drone error:', err);
    return null;
  }
}

/**
 * Stop the active meditative drone gracefully
 */
export function stopMeditativeDrone() {
  if (activeDroneController) {
    try {
      activeDroneController.stop();
    } catch {}
    activeDroneController = null;
  }
}

/**
 * Play Channel 1: Đại Hồng Chung (Temple Bell — 136.1Hz Om fundamental + metallic harmonics + 6s decay)
 */
export function playOmTempleBellSound(volume = 0.45) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(volume, now);
    master.connect(ctx.destination);

    const omPartials = [
      { freq: 136.1, gain: 0.9, decay: 6.0, type: 'sine' as OscillatorType },
      { freq: 272.2, gain: 0.42, decay: 5.2, type: 'sine' as OscillatorType },
      { freq: 408.3, gain: 0.24, decay: 4.1, type: 'triangle' as OscillatorType },
      { freq: 585.2, gain: 0.14, decay: 3.0, type: 'sine' as OscillatorType }, // metallic shimmer
      { freq: 952.7, gain: 0.07, decay: 1.9, type: 'sine' as OscillatorType },
    ];

    omPartials.forEach(({ freq, gain, decay, type }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(gain, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gainNode);
      gainNode.connect(master);
      osc.start(now);
      osc.stop(now + decay);
    });

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([35, 50, 35]);
      } catch {}
    }
  } catch (err) {
    console.error('Om temple bell sound error:', err);
  }
}

let activeHealingController: { stop: () => void; setVolume: (v: number) => void } | null = null;

/**
 * Channel 3: Start 432Hz, 528Hz or 136.1Hz Healing Drone with sine + triangle pad and live volume control
 */
export function startHealingDrone(
  baseFreqOrMode: 432 | 528 | 136.1 | '432' | '528' | 'om' = 432,
  volume = 0.22
) {
  try {
    const baseFreq =
      baseFreqOrMode === 'om'
        ? 136.1
        : baseFreqOrMode === '528'
        ? 528
        : baseFreqOrMode === '432'
        ? 432
        : baseFreqOrMode;
    stopHealingDrone();
    const ctx = getAudioContext();
    if (!ctx) return null;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.linearRampToValueAtTime(Math.max(0.0001, volume), now + 1.0);
    master.connect(ctx.destination);

    const layers: Array<{ freq: number; gain: number; type: OscillatorType }> = [
      { freq: baseFreq / 2, gain: 0.45, type: 'sine' },
      { freq: baseFreq, gain: 0.35, type: 'triangle' },
      { freq: baseFreq * 1.5, gain: 0.12, type: 'sine' },
    ];

    const oscs: OscillatorNode[] = [];
    layers.forEach(({ freq, gain, type }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(gain, now);
      osc.connect(g);
      g.connect(master);
      osc.start(now);
      oscs.push(osc);
    });

    const controller = {
      setVolume: (v: number) => {
        try {
          master.gain.setTargetAtTime(Math.max(0.0001, v), ctx.currentTime, 0.08);
        } catch {}
      },
      stop: () => {
        try {
          const stopNow = ctx.currentTime;
          master.gain.setValueAtTime(master.gain.value, stopNow);
          master.gain.exponentialRampToValueAtTime(0.0001, stopNow + 0.8);
          setTimeout(() => {
            oscs.forEach((osc) => {
              try {
                osc.stop();
                osc.disconnect();
              } catch {}
            });
          }, 850);
        } catch {}
      },
    };
    activeHealingController = controller;
    return controller;
  } catch (err) {
    console.error('Healing drone error:', err);
    return null;
  }
}

export function stopHealingDrone() {
  if (activeHealingController) {
    try {
      activeHealingController.stop();
    } catch {}
    activeHealingController = null;
  }
}

const CHANT_MOTIFS: Record<string, number[]> = {
  'a-di-da': [261.63, 293.66, 329.63, 392.0, 329.63, 293.66], // Nam Mô A Di Đà Phật (6 syllables)
  'a-di-da-6': [261.63, 293.66, 329.63, 392.0, 329.63, 293.66],
  'a-di-da-4': [293.66, 329.63, 392.0, 293.66], // A Di Đà Phật (4 syllables)
  'thich-ca': [220.0, 261.63, 293.66, 329.63, 392.0, 329.63, 293.66, 261.63, 220.0], // Nam Mô Bổn Sư Thích Ca Mâu Ni Phật
  'quan-am': [293.66, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66], // Nam Mô Quán Thế Âm Bồ Tát
  'duoc-su': [261.63, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66, 261.63, 220.0], // Nam Mô Dược Sư Lưu Ly Quang Vương Phật
  'dia-tang': [196.0, 220.0, 261.63, 293.66, 329.63, 293.66, 261.63, 220.0], // Nam Mô Địa Tạng Vương Bồ Tát
  'luc-tu': [220.0, 261.63, 293.66, 329.63, 293.66, 220.0], // Om Mani Padme Hum
  'dai-bi': [246.94, 293.66, 329.63, 369.99, 329.63, 293.66, 246.94, 220.0], // Chú Đại Bi cadence
  'chu-dai-bi': [246.94, 293.66, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66],
};

/**
 * Channel 4: Máy Niệm Phật harmonic cadence pulse (works 100% offline with soft warm tone + temple resonance)
 */
export function playChantingPulse(trackId: string, stepIdx: number, volume = 0.25) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const motif = CHANT_MOTIFS[trackId] || CHANT_MOTIFS['a-di-da'];
    const freq = motif[stepIdx % motif.length];
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const harm = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    harm.type = 'triangle';
    harm.frequency.setValueAtTime(freq * 2, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

    const harmGain = ctx.createGain();
    harmGain.gain.setValueAtTime(0.18, now);

    osc.connect(filter);
    harm.connect(harmGain);
    harmGain.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    harm.start(now);
    osc.stop(now + 0.9);
    harm.stop(now + 0.9);
  } catch {}
}

/**
 * Play a crisp sandalwood mala bead click / tactile UI tick
 */
export function playBeadTickSound(volume = 0.35) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1180, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.032);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(980, now);
    filter.Q.setValueAtTime(2.2, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.048);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.055);
  } catch {}
}

export type BellTimbre = 'hue' | 'co-tu' | 'xoay';
export type WoodfishTimbre = 'go-mit' | 'bac-tong' | 'thien-duong';

/**
 * Play Temple Bell with selectable timbre for Chuông Mõ Studio
 */
export function playBellWithTimbre(timbre: BellTimbre = 'hue', volume = 0.48) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(volume, now);
    master.connect(ctx.destination);

    const configs: Record<BellTimbre, Array<{ freq: number; gain: number; decay: number }>> = {
      hue: [
        { freq: 324, gain: 0.85, decay: 4.5 },
        { freq: 648, gain: 0.45, decay: 3.4 },
        { freq: 972, gain: 0.24, decay: 2.2 },
        { freq: 1620, gain: 0.1, decay: 1.4 },
      ],
      'co-tu': [
        { freq: 108, gain: 0.9, decay: 7.5 },
        { freq: 216, gain: 0.65, decay: 6.2 },
        { freq: 324, gain: 0.34, decay: 4.8 },
        { freq: 432, gain: 0.22, decay: 3.6 },
        { freq: 864, gain: 0.08, decay: 2.0 },
      ],
      xoay: [
        { freq: 216, gain: 0.72, decay: 6.8 },
        { freq: 218.5, gain: 0.55, decay: 6.8 },
        { freq: 432, gain: 0.35, decay: 5.2 },
        { freq: 648, gain: 0.16, decay: 3.8 },
      ],
    };

    configs[timbre].forEach(({ freq, gain, decay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(gain, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);
      osc.connect(gainNode);
      gainNode.connect(master);
      osc.start(now);
      osc.stop(now + decay);
    });
  } catch {}
}

/**
 * Play Carved Wooden Fish with selectable timbre
 */
export function playWoodfishWithTimbre(timbre: WoodfishTimbre = 'go-mit', volume = 0.52) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(volume, now);
    master.connect(ctx.destination);

    const presets: Record<WoodfishTimbre, { start: number; end: number; band: number; q: number }> = {
      'go-mit': { start: 520, end: 230, band: 600, q: 2.4 },
      'bac-tong': { start: 720, end: 330, band: 800, q: 2.8 },
      'thien-duong': { start: 960, end: 480, band: 1050, q: 3.2 },
    };
    const cfg = presets[timbre];

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(cfg.start, now);
    osc.frequency.exponentialRampToValueAtTime(cfg.end, now + 0.065);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(1, now + 0.003);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(cfg.band, now);
    filter.Q.setValueAtTime(cfg.q, now);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(master);
    osc.start(now);
    osc.stop(now + 0.16);
  } catch {}
}

/**
 * Play bamboo fortune-cylinder rattle for Ống Xăm Pháp Cú
 */
export function playBambooShakeSound(volume = 0.3) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const offsets = [0, 0.09, 0.19, 0.28];
    offsets.forEach((delay, idx) => {
      const t = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(980 + idx * 140, t);
      osc.frequency.exponentialRampToValueAtTime(420, t + 0.04);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(volume, t + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    });
  } catch {}
}

export function cleanupAllBuddhistAudio() {
  stopMeditativeDrone();
  stopHealingDrone();
}



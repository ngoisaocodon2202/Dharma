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

    // Filter to give that warm, mellow wooden tone
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(540, now);
    filter.Q.setValueAtTime(3.2, now);

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

    // Vibration haptic feedback on mobile if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(20);
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


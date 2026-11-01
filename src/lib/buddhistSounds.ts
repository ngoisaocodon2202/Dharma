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

'use client';

import { useRef, useCallback, useEffect } from 'react';

export type SoundType = 'BELL' | 'RAIN' | 'FOREST' | 'SILENCE';

export function useMeditationAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<Set<AudioNode>>(new Set());
  const masterGainRef = useRef<GainNode | null>(null);
  const intervalIdsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const timeoutIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const clearTimers = useCallback(() => {
    intervalIdsRef.current.forEach(id => clearInterval(id));
    intervalIdsRef.current = [];
    timeoutIdsRef.current.forEach(id => clearTimeout(id));
    timeoutIdsRef.current = [];
  }, []);

  const stopAll = useCallback(() => {
    clearTimers();
    activeNodesRef.current.forEach(n => {
      try { (n as AudioBufferSourceNode).stop?.(); } catch {}
      try { (n as OscillatorNode).stop?.(); } catch {}
      try { n.disconnect(); } catch {}
    });
    activeNodesRef.current.clear();
    masterGainRef.current = null;
  }, [clearTimers]);

  // ── Create a pink-noise buffer (warmer than white) ─────────────────────────
  const makePinkNoiseBuffer = useCallback((ctx: AudioContext, seconds: number): AudioBuffer => {
    const bufSize = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, bufSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    }
    return buf;
  }, []);

  // ── Single bell strike — soft Tibetan bowl ─────────────────────────────────
  const strikeSingleBell = useCallback((ctx: AudioContext, dest: AudioNode, volume = 0.25) => {
    // Two partials: fundamental + gentle overtone
    const partials = [
      { freq: 196, gain: volume, decay: 12 },      // G3 — warm low tone
      { freq: 392, gain: volume * 0.35, decay: 8 }, // G4 — soft overtone
    ];
    partials.forEach(({ freq, gain, decay }) => {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      // Very gentle attack, long natural decay
      env.gain.setValueAtTime(0, ctx.currentTime);
      env.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.005);
      env.gain.setTargetAtTime(0.001, ctx.currentTime + 0.1, decay / 4);
      osc.connect(env);
      env.connect(dest);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + decay + 2);
      activeNodesRef.current.add(osc);
      activeNodesRef.current.add(env);
    });
  }, []);

  // ── BELL: gentle bell every 20s ────────────────────────────────────────────
  const startBell = useCallback((ctx: AudioContext, master: GainNode) => {
    strikeSingleBell(ctx, master, 0.22);
    const id = setInterval(() => {
      if (ctxRef.current?.state === 'running') {
        strikeSingleBell(ctx, master, 0.22);
      }
    }, 20000);
    intervalIdsRef.current.push(id);
  }, [strikeSingleBell]);

  // ── RAIN: soft pink noise, low-pass filtered, no thunder ──────────────────
  const startRain = useCallback((ctx: AudioContext, master: GainNode) => {
    const buf = makePinkNoiseBuffer(ctx, 6);

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    // Shape: band-pass to mimic gentle rain patter
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1800;
    bp.Q.value = 0.3;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 3500;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, ctx.currentTime);
    env.gain.linearRampToValueAtTime(0.38, ctx.currentTime + 3); // slow fade in

    src.connect(bp);
    bp.connect(lp);
    lp.connect(env);
    env.connect(master);
    src.start();

    activeNodesRef.current.add(src);
    activeNodesRef.current.add(bp);
    activeNodesRef.current.add(lp);
    activeNodesRef.current.add(env);
  }, [makePinkNoiseBuffer]);

  // ── FOREST: gentle wind only, no birds/crickets ───────────────────────────
  const startForest = useCallback((ctx: AudioContext, master: GainNode) => {
    const buf = makePinkNoiseBuffer(ctx, 8);

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    // Very low-pass = soft wind whoosh
    const lp1 = ctx.createBiquadFilter();
    lp1.type = 'lowpass';
    lp1.frequency.value = 400;
    lp1.Q.value = 0.5;

    const lp2 = ctx.createBiquadFilter();
    lp2.type = 'lowpass';
    lp2.frequency.value = 700;

    // Gentle volume swell — wind comes and goes
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, ctx.currentTime);
    env.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 4);

    src.connect(lp1);
    lp1.connect(lp2);
    lp2.connect(env);
    env.connect(master);
    src.start();

    activeNodesRef.current.add(src);
    activeNodesRef.current.add(lp1);
    activeNodesRef.current.add(lp2);
    activeNodesRef.current.add(env);

    // Slow wind swell cycle (every 12s, volume dips and rises slightly)
    let swelling = false;
    const swellId = setInterval(() => {
      if (!ctxRef.current || ctxRef.current.state !== 'running') return;
      const t = ctxRef.current.currentTime;
      if (!swelling) {
        env.gain.linearRampToValueAtTime(0.28, t + 6);
        swelling = true;
      } else {
        env.gain.linearRampToValueAtTime(0.45, t + 6);
        swelling = false;
      }
    }, 12000);
    intervalIdsRef.current.push(swellId);
  }, [makePinkNoiseBuffer]);

  // ── Public API ─────────────────────────────────────────────────────────────
  const startSound = useCallback((type: SoundType) => {
    stopAll();
    if (type === 'SILENCE') return;

    const ctx = getCtx();
    const master = ctx.createGain();
    master.gain.value = 0.75;
    master.connect(ctx.destination);
    masterGainRef.current = master;
    activeNodesRef.current.add(master);

    if (type === 'BELL') startBell(ctx, master);
    else if (type === 'RAIN') startRain(ctx, master);
    else if (type === 'FOREST') startForest(ctx, master);
  }, [getCtx, stopAll, startBell, startRain, startForest]);

  const stopSound = useCallback(() => {
    clearTimers();
    if (masterGainRef.current && ctxRef.current?.state === 'running') {
      const g = masterGainRef.current;
      const t = ctxRef.current.currentTime;
      g.gain.setValueAtTime(g.gain.value, t);
      g.gain.linearRampToValueAtTime(0, t + 2);
      const tid = setTimeout(stopAll, 2200);
      timeoutIdsRef.current.push(tid);
    } else {
      stopAll();
    }
  }, [clearTimers, stopAll]);

  // Bell strike for session start/end signals
  const strikeBell = useCallback(() => {
    const ctx = getCtx();
    const sig = ctx.createGain();
    sig.gain.value = 0.6;
    sig.connect(ctx.destination);
    strikeSingleBell(ctx, sig, 0.3);
    const tid = setTimeout(() => { try { sig.disconnect(); } catch {} }, 16000);
    timeoutIdsRef.current.push(tid);
  }, [getCtx, strikeSingleBell]);

  useEffect(() => {
    return () => {
      stopAll();
      ctxRef.current?.close().catch(() => {});
    };
  }, [stopAll]);

  return { startSound, stopSound, strikeBell };
}

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls, Stars } from '@react-three/drei';
import { HUNDRED_MATS, ROBE_OPTIONS } from './templeData';
import { useTempleStore } from './useTempleStore';
import { templeAudio } from './templeAudio';

type EffectiveTimeMode = 'morning' | 'noon' | 'afternoon' | 'night' | 'rain';

interface SkyThemeConfig {
  bg: string;
  fog: string;
  fogNear: number;
  fogFar: number;
  ambientColor: string;
  ambientIntensity: number;
  keyColor: string;
  keyIntensity: number;
  keyPos: [number, number, number];
  altarLightColor: string;
  altarLightIntensity: number;
  lanternEmissiveIntensity: number;
  showStars: boolean;
  showMoon: boolean;
  isRain: boolean;
}

const SKY_THEMES: Record<EffectiveTimeMode, SkyThemeConfig> = {
  morning: {
    bg: '#38221A',
    fog: '#331E16',
    fogNear: 20,
    fogFar: 62,
    ambientColor: '#FFE5C4',
    ambientIntensity: 0.98,
    keyColor: '#FFCE8A',
    keyIntensity: 1.85,
    keyPos: [18, 16, 14],
    altarLightColor: '#FFD57A',
    altarLightIntensity: 2.8,
    lanternEmissiveIntensity: 1.35,
    showStars: false,
    showMoon: false,
    isRain: false,
  },
  noon: {
    bg: '#364A5E',
    fog: '#3B4854',
    fogNear: 22,
    fogFar: 66,
    ambientColor: '#FFF7E8',
    ambientIntensity: 1.15,
    keyColor: '#FFF1CF',
    keyIntensity: 2.15,
    keyPos: [6, 26, 12],
    altarLightColor: '#FFE090',
    altarLightIntensity: 2.5,
    lanternEmissiveIntensity: 1.05,
    showStars: false,
    showMoon: false,
    isRain: false,
  },
  afternoon: {
    bg: '#4A2418',
    fog: '#3A1C13',
    fogNear: 19,
    fogFar: 60,
    ambientColor: '#FFC996',
    ambientIntensity: 0.88,
    keyColor: '#FF9A4D',
    keyIntensity: 1.95,
    keyPos: [-20, 10, 14],
    altarLightColor: '#FFD074',
    altarLightIntensity: 3.1,
    lanternEmissiveIntensity: 1.75,
    showStars: false,
    showMoon: false,
    isRain: false,
  },
  night: {
    bg: '#0E0810',
    fog: '#120A0E',
    fogNear: 18,
    fogFar: 58,
    ambientColor: '#B5A1D6',
    ambientIntensity: 0.56,
    keyColor: '#A1BAFF',
    keyIntensity: 0.95,
    keyPos: [-14, 22, -16],
    altarLightColor: '#FFC959',
    altarLightIntensity: 3.6,
    lanternEmissiveIntensity: 2.35,
    showStars: true,
    showMoon: true,
    isRain: false,
  },
  rain: {
    bg: '#19222B',
    fog: '#1D252E',
    fogNear: 17,
    fogFar: 52,
    ambientColor: '#A7BCCB',
    ambientIntensity: 0.78,
    keyColor: '#B8D0E4',
    keyIntensity: 1.15,
    keyPos: [8, 22, 12],
    altarLightColor: '#FFCC62',
    altarLightIntensity: 3.3,
    lanternEmissiveIntensity: 2.1,
    showStars: false,
    showMoon: false,
    isRain: true,
  },
};

function useEffectiveTheme(): SkyThemeConfig {
  const weatherMode = useTempleStore((s) => s.weatherMode);
  const realIsRaining = useTempleStore((s) => s.realIsRaining);
  const realTimeSlot = useTempleStore((s) => s.realTimeSlot);

  const effectiveKey: EffectiveTimeMode =
    weatherMode === 'realtime'
      ? realIsRaining
        ? 'rain'
        : realTimeSlot
      : weatherMode;

  return SKY_THEMES[effectiveKey];
}

/**
 * Edge-connected flood-fill luminance keying on an offscreen HTML5 canvas so only the
 * surrounding pure black (#000000) studio backdrop becomes transparent while keeping dark
 * hair curls, eyes, and bronze shadow recesses inside the Buddha silhouette intact.
 */
function useKeyedBuddhaTexture(src: string): THREE.CanvasTexture | null {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let active = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!active) return;
      const maxDim = 768;
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      const total = w * h;
      const isBg = new Uint8Array(total);
      const queue = new Int32Array(total);
      let head = 0;
      let tail = 0;

      const isBlackBgPixel = (idx: number): boolean => {
        const o = idx * 4;
        return Math.max(data[o], data[o + 1], data[o + 2]) < 36;
      };

      const enqueue = (idx: number) => {
        if (idx < 0 || idx >= total || isBg[idx]) return;
        if (!isBlackBgPixel(idx)) return;
        isBg[idx] = 1;
        queue[tail++] = idx;
      };

      for (let x = 0; x < w; x++) {
        enqueue(x);
        enqueue((h - 1) * w + x);
      }
      for (let y = 1; y < h - 1; y++) {
        enqueue(y * w);
        enqueue(y * w + (w - 1));
      }

      while (head < tail) {
        const curr = queue[head++];
        const cx = curr % w;
        const cy = (curr - cx) / w;
        if (cx > 0) enqueue(curr - 1);
        if (cx < w - 1) enqueue(curr + 1);
        if (cy > 0) enqueue(curr - w);
        if (cy < h - 1) enqueue(curr + w);
      }

      for (let i = 0; i < total; i++) {
        if (isBg[i]) {
          data[i * 4 + 3] = 0;
          continue;
        }
        const cx = i % w;
        const cy = (i - cx) / w;
        const touchesBg =
          (cx > 0 && isBg[i - 1]) ||
          (cx < w - 1 && isBg[i + 1]) ||
          (cy > 0 && isBg[i - w]) ||
          (cy < h - 1 && isBg[i + w]);

        if (touchesBg) {
          const o = i * 4;
          const lum = Math.max(data[o], data[o + 1], data[o + 2]);
          if (lum < 64) {
            const alpha = Math.max(0, Math.min(255, Math.round(((lum - 20) / 44) * 255)));
            data[o + 3] = alpha;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      setTexture(tex);
    };
    img.src = src;

    return () => {
      active = false;
    };
  }, [src]);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  return texture;
}

function makeCalligraphyPlaqueTexture(
  lines: string[],
  opts: {
    width: number;
    height: number;
    bgColor: string;
    borderColor: string;
    textColor: string;
    fontSize: number;
    vertical?: boolean;
  }
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = opts.width;
  canvas.height = opts.height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = opts.bgColor;
  ctx.fillRect(0, 0, opts.width, opts.height);

  ctx.strokeStyle = opts.borderColor;
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, opts.width - 20, opts.height - 20);
  ctx.lineWidth = 3;
  ctx.strokeRect(22, 22, opts.width - 44, opts.height - 44);

  ctx.fillStyle = opts.textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${opts.fontSize}px Georgia, "Times New Roman", serif`;

  if (opts.vertical) {
    const stepY = (opts.height - 80) / Math.max(1, lines.length);
    lines.forEach((word, idx) => {
      ctx.fillText(word, opts.width / 2, 40 + stepY * (idx + 0.5));
    });
  } else {
    const stepY = (opts.height - 40) / Math.max(1, lines.length);
    lines.forEach((line, idx) => {
      ctx.fillText(line, opts.width / 2, 20 + stepY * (idx + 0.5));
    });
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function makeMandalaHaloTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const c = size / 2;

  const grad = ctx.createRadialGradient(c, c, 12, c, c, c - 10);
  grad.addColorStop(0, 'rgba(255, 240, 175, 0.95)');
  grad.addColorStop(0.32, 'rgba(246, 203, 98, 0.65)');
  grad.addColorStop(0.65, 'rgba(217, 164, 65, 0.25)');
  grad.addColorStop(1, 'rgba(217, 164, 65, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  ctx.save();
  ctx.translate(c, c);
  for (let i = 0; i < 24; i++) {
    ctx.rotate((Math.PI * 2) / 24);
    ctx.beginPath();
    ctx.moveTo(0, 48);
    ctx.lineTo(-4, 215);
    ctx.lineTo(4, 215);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 232, 148, 0.35)' : 'rgba(246, 200, 90, 0.18)';
    ctx.fill();
  }
  ctx.strokeStyle = 'rgba(255, 232, 152, 0.65)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 155, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 198, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function makeCarpetRunnerTexture(): THREE.CanvasTexture {
  const w = 256;
  const h = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#751515';
  ctx.fillRect(0, 0, w, h);

  // Outer gold trimming bands
  ctx.fillStyle = '#D9A441';
  ctx.fillRect(8, 0, 10, h);
  ctx.fillRect(w - 18, 0, 10, h);
  ctx.fillStyle = '#F6D58A';
  ctx.fillRect(24, 0, 3, h);
  ctx.fillRect(w - 27, 0, 3, h);

  // Repeating embossed gold lotus medallions down the center
  ctx.strokeStyle = 'rgba(246, 213, 138, 0.42)';
  ctx.lineWidth = 2.5;
  for (let y = 64; y < h; y += 128) {
    ctx.beginPath();
    ctx.arc(w / 2, y, 28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w / 2, y, 16, 0, Math.PI * 2);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function AtmosphereAndSky({ theme }: { theme: SkyThemeConfig }) {
  const { scene } = useThree();
  const bgTarget = useMemo(() => new THREE.Color(), []);
  const fogTarget = useMemo(() => new THREE.Color(), []);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const keyRef = useRef<THREE.DirectionalLight>(null);

  useEffect(() => {
    if (!scene.background || !(scene.background instanceof THREE.Color)) {
      scene.background = new THREE.Color(theme.bg);
    }
    if (!scene.fog || !(scene.fog instanceof THREE.Fog)) {
      scene.fog = new THREE.Fog(theme.fog, theme.fogNear, theme.fogFar);
    }
  }, [scene, theme.bg, theme.fog, theme.fogFar, theme.fogNear]);

  useFrame((_, delta) => {
    const dt = Math.min(1, delta * 3.2);
    bgTarget.set(theme.bg);
    fogTarget.set(theme.fog);

    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(bgTarget, dt);
    }
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.lerp(fogTarget, dt);
      scene.fog.near = THREE.MathUtils.lerp(scene.fog.near, theme.fogNear, dt);
      scene.fog.far = THREE.MathUtils.lerp(scene.fog.far, theme.fogFar, dt);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} color={theme.ambientColor} intensity={theme.ambientIntensity} />
      <directionalLight
        ref={keyRef}
        color={theme.keyColor}
        intensity={theme.keyIntensity}
        position={theme.keyPos}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-bias={-0.0005}
      />
      <pointLight
        position={[0, 5.2, -8.5]}
        color={theme.altarLightColor}
        intensity={theme.altarLightIntensity}
        distance={22}
        decay={1.4}
      />
      <pointLight position={[-6.5, 4.4, 2]} color="#FFBA66" intensity={0.9} distance={15} decay={1.6} />
      <pointLight position={[6.5, 4.4, 2]} color="#FFBA66" intensity={0.9} distance={15} decay={1.6} />

      {theme.showStars && <Stars radius={42} depth={20} count={900} factor={2.6} fade speed={0.4} />}
      {theme.showMoon && (
        <mesh position={[-18, 22, -28]}>
          <sphereGeometry args={[1.65, 24, 24]} />
          <meshBasicMaterial color="#FFF4D2" />
        </mesh>
      )}
    </>
  );
}

function RainAndPetals({ isRain, quality }: { isRain: boolean; quality: 'high' | 'medium' | 'low' }) {
  const rainCount = quality === 'high' ? 750 : quality === 'medium' ? 450 : 220;
  const petalCount = quality === 'high' ? 68 : quality === 'medium' ? 40 : 18;

  const rainRef = useRef<THREE.InstancedMesh>(null);
  const petalRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const rainSeeds = useMemo(() => {
    const arr: Array<{ x: number; y: number; z: number; speed: number }> = [];
    for (let i = 0; i < 800; i++) {
      // Keep heavy rain outside hall edges & courtyard
      let x = (Math.random() - 0.5) * 44;
      const z = (Math.random() - 0.5) * 38;
      if (Math.abs(x) < 11.4 && z < 8 && z > -10) {
        x = x < 0 ? x - 12 : x + 12;
      }
      arr.push({
        x,
        y: Math.random() * 18,
        z,
        speed: 13 + Math.random() * 7,
      });
    }
    return arr;
  }, []);

  const petalSeeds = useMemo(() => {
    const arr: Array<{ x: number; y: number; z: number; speed: number; phase: number; radius: number }> = [];
    for (let i = 0; i < 80; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 28,
        y: 0.6 + Math.random() * 8.5,
        z: -8 + Math.random() * 20,
        speed: 0.35 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        radius: 0.4 + Math.random() * 0.9,
      });
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(0.05, delta);

    if (isRain && rainRef.current) {
      for (let i = 0; i < rainCount; i++) {
        const drop = rainSeeds[i];
        drop.y -= drop.speed * dt;
        if (drop.y < 0) drop.y = 17 + Math.random() * 3;
        dummy.position.set(drop.x, drop.y, drop.z);
        dummy.rotation.set(0, 0, 0.08);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        rainRef.current.setMatrixAt(i, dummy.matrix);
      }
      rainRef.current.instanceMatrix.needsUpdate = true;
    }

    if (petalRef.current) {
      for (let i = 0; i < petalCount; i++) {
        const p = petalSeeds[i];
        p.y -= p.speed * dt;
        if (p.y < 0.1) p.y = 8.8;
        const px = p.x + Math.sin(t * 0.8 + p.phase) * p.radius;
        const pz = p.z + Math.cos(t * 0.6 + p.phase) * p.radius * 0.6;
        dummy.position.set(px, p.y, pz);
        dummy.rotation.set(t + p.phase, t * 0.7 + p.phase, p.phase);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        petalRef.current.setMatrixAt(i, dummy.matrix);
      }
      petalRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      {isRain && (
        <instancedMesh ref={rainRef} args={[undefined, undefined, rainCount]}>
          <cylinderGeometry args={[0.012, 0.012, 0.55, 4]} />
          <meshBasicMaterial color="#B9D9EE" transparent opacity={0.48} />
        </instancedMesh>
      )}
      <instancedMesh ref={petalRef} args={[undefined, undefined, petalCount]}>
        <circleGeometry args={[0.075, 6]} />
        <meshBasicMaterial color="#F7B2C4" side={THREE.DoubleSide} transparent opacity={0.78} />
      </instancedMesh>
    </>
  );
}

function IncenseSmoke({ burstNonce }: { burstNonce: number }) {
  const count = 26;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const burstBoostRef = useRef(0);

  useEffect(() => {
    if (burstNonce > 0) {
      burstBoostRef.current = 1.6;
    }
  }, [burstNonce]);

  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        phase: (i / count) * Math.PI * 2,
        yOffset: (i / count) * 2.8,
        driftX: (Math.random() - 0.5) * 0.25,
        driftZ: (Math.random() - 0.5) * 0.2,
      })),
    []
  );

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    burstBoostRef.current = Math.max(0, burstBoostRef.current - delta * 0.45);
    const speedMult = 1 + burstBoostRef.current * 0.85;

    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      const y = ((s.yOffset + t * 0.36 * speedMult) % 1.95) + 1.98;
      const progress = (y - 1.98) / 1.95;
      const scale = (0.025 + progress * 0.085) * (1 + burstBoostRef.current * 0.35);
      dummy.position.set(
        s.driftX * progress * 1.45 + Math.sin(t * 1.3 + s.phase) * 0.22 * progress + 0.08 * progress,
        y,
        -8.2 + s.driftZ * progress + Math.cos(t * 1.0 + s.phase) * 0.12 * progress
      );
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#F5E4CB" transparent opacity={0.11} depthWrite={false} />
    </instancedMesh>
  );
}

function TempleHallArchitecture({ lanternIntensity }: { lanternIntensity: number }) {
  const buddhaTex = useKeyedBuddhaTexture('/textures/buddha_statue_pure.jpg');
  const mandalaTex = useMemo(() => makeMandalaHaloTexture(), []);
  const carpetTex = useMemo(() => makeCarpetRunnerTexture(), []);

  const topPlaqueTex = useMemo(
    () =>
      makeCalligraphyPlaqueTexture(['ĐẠI HÙNG BẢO ĐIỆN'], {
        width: 1024,
        height: 220,
        bgColor: '#3A0F0E',
        borderColor: '#D9A441',
        textColor: '#F6D58A',
        fontSize: 64,
      }),
    []
  );
  const leftBannerTex = useMemo(
    () =>
      makeCalligraphyPlaqueTexture(['TỪ', 'BI'], {
        width: 240,
        height: 640,
        bgColor: '#5B1111',
        borderColor: '#D9A441',
        textColor: '#F6D58A',
        fontSize: 82,
        vertical: true,
      }),
    []
  );
  const rightBannerTex = useMemo(
    () =>
      makeCalligraphyPlaqueTexture(['HỶ', 'XẢ'], {
        width: 240,
        height: 640,
        bgColor: '#5B1111',
        borderColor: '#D9A441',
        textColor: '#F6D58A',
        fontSize: 82,
        vertical: true,
      }),
    []
  );
  const coupletLeftTex = useMemo(
    () =>
      makeCalligraphyPlaqueTexture(['PHẬT', 'NHẬT', 'TĂNG', 'HUY'], {
        width: 220,
        height: 820,
        bgColor: '#2B100D',
        borderColor: '#D9A441',
        textColor: '#F6D58A',
        fontSize: 52,
        vertical: true,
      }),
    []
  );
  const coupletRightTex = useMemo(
    () =>
      makeCalligraphyPlaqueTexture(['PHÁP', 'LUÂN', 'THƯỜNG', 'CHUYỂN'], {
        width: 220,
        height: 820,
        bgColor: '#2B100D',
        borderColor: '#D9A441',
        textColor: '#F6D58A',
        fontSize: 48,
        vertical: true,
      }),
    []
  );

  useEffect(() => {
    return () => {
      mandalaTex.dispose();
      carpetTex.dispose();
      topPlaqueTex.dispose();
      leftBannerTex.dispose();
      rightBannerTex.dispose();
      coupletLeftTex.dispose();
      coupletRightTex.dispose();
    };
  }, [
    carpetTex,
    coupletLeftTex,
    coupletRightTex,
    leftBannerTex,
    mandalaTex,
    rightBannerTex,
    topPlaqueTex,
  ]);

  const haloRef = useRef<THREE.Mesh>(null);
  const incenseBurstNonce = useTempleStore((s) => s.incenseBurstNonce);

  useFrame((_, delta) => {
    if (haloRef.current) {
      haloRef.current.rotation.z += delta * 0.085;
    }
  });

  const pillarCoords = useMemo(() => {
    const xs = [-11.0, -5.25, 5.25, 11.0];
    const zs = [-8.6, -2.8, 3.0, 8.8];
    const list: Array<[number, number]> = [];
    for (const x of xs) {
      for (const z of zs) {
        list.push([x, z]);
      }
    }
    return list;
  }, []);

  return (
    <group>
      {/* Stone Courtyard Foundation */}
      <mesh position={[0, -0.09, 0.5]} receiveShadow>
        <boxGeometry args={[48, 0.12, 42]} />
        <meshStandardMaterial color="#27201C" roughness={0.92} metalness={0.04} />
      </mesh>

      {/* Stepped Granite Chánh Điện Platform */}
      <mesh position={[0, -0.02, 0.5]} receiveShadow>
        <boxGeometry args={[26.8, 0.08, 24.4]} />
        <meshStandardMaterial color="#423934" roughness={0.8} />
      </mesh>

      {/* Main Lacquered Rosewood Hall Floor */}
      <mesh position={[0, 0.025, 0.5]} receiveShadow>
        <boxGeometry args={[25.4, 0.05, 22.8]} />
        <meshStandardMaterial color="#3B2014" roughness={0.48} metalness={0.08} />
      </mesh>

      {/* Central Royal Crimson & Gold Lotus Carpet Runner */}
      <mesh position={[0, 0.056, 1.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.18, 19.6]} />
        <meshStandardMaterial map={carpetTex} roughness={0.78} metalness={0.12} />
      </mesh>

      {/* Open Sanctum Timber Pillars & Plinths */}
      {pillarCoords.map(([px, pz], idx) => (
        <group key={`pillar-${idx}`} position={[px, 0, pz]}>
          {/* Carved Stone & Gold Plinth */}
          <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.36, 0.44, 0.32, 16]} />
            <meshStandardMaterial color="#4E4239" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.34, 0]}>
            <torusGeometry args={[0.32, 0.04, 8, 24]} />
            <meshStandardMaterial color="#D9A441" roughness={0.35} metalness={0.75} />
          </mesh>
          {/* Crimson Lacquer Column */}
          <mesh position={[0, 4.35, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.25, 0.28, 8.0, 18]} />
            <meshStandardMaterial color="#671814" roughness={0.42} metalness={0.12} />
          </mesh>
          {/* Gold Capital Collar */}
          <mesh position={[0, 8.2, 0]}>
            <cylinderGeometry args={[0.31, 0.26, 0.22, 16]} />
            <meshStandardMaterial color="#D9A441" roughness={0.32} metalness={0.78} />
          </mesh>
        </group>
      ))}

      {/* Overhead Timber Cross-beams elevated so ĐẠI HÙNG BẢO ĐIỆN & Buddha stay completely unobstructed */}
      {[-2.8, 3.0, 8.8].map((zPos, i) => (
        <mesh key={`beam-x-${i}`} position={[0, 8.45, zPos]} castShadow>
          <boxGeometry args={[22.8, 0.34, 0.38]} />
          <meshStandardMaterial color="#2C140C" roughness={0.62} />
        </mesh>
      ))}
      <mesh position={[0, 8.45, -10.95]} castShadow>
        <boxGeometry args={[22.8, 0.34, 0.38]} />
        <meshStandardMaterial color="#2C140C" roughness={0.62} />
      </mesh>
      {[-11.0, -5.25, 5.25, 11.0].map((xPos, i) => (
        <mesh key={`beam-z-${i}`} position={[xPos, 8.45, -1.0]} castShadow>
          <boxGeometry args={[0.36, 0.34, 20.2]} />
          <meshStandardMaterial color="#2C140C" roughness={0.62} />
        </mesh>
      ))}

      {/* Hanging Glowing Temple Lanterns on Inner Pillars */}
      {[
        [-5.25, 5.45, -2.4],
        [5.25, 5.45, -2.4],
        [-5.25, 5.45, 3.4],
        [5.25, 5.45, 3.4],
      ].map(([lx, ly, lz], i) => (
        <group key={`hall-lantern-${i}`} position={[lx, ly, lz]}>
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.65, 6]} />
            <meshStandardMaterial color="#D9A441" metalness={0.6} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.28, 16, 14]} />
            <meshStandardMaterial
              color="#E87D2E"
              emissive="#FF9E3B"
              emissiveIntensity={lanternIntensity}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0, -0.34, 0]}>
            <cylinderGeometry args={[0.04, 0.08, 0.25, 8]} />
            <meshStandardMaterial color="#B51E1E" />
          </mesh>
        </group>
      ))}

      {/* === BUDDHA SANCTUM & 3-TIER DAIS === */}
      <group position={[0, 0, -9.8]}>
        {/* Sanctuary Rear Backdrop Screen (Hậu Chẩm) */}
        <mesh position={[0, 3.7, -1.25]} receiveShadow>
          <boxGeometry args={[10.8, 7.2, 0.32]} />
          <meshStandardMaterial color="#260F0B" roughness={0.7} />
        </mesh>
        {/* Gold Frame around Backdrop */}
        <mesh position={[0, 3.7, -1.07]}>
          <boxGeometry args={[10.2, 6.6, 0.04]} />
          <meshStandardMaterial color="#3A1710" roughness={0.55} />
        </mesh>

        {/* Tiered Altar Dais (Tam Bảo) */}
        <mesh position={[0, 0.26, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[9.8, 0.45, 2.7]} />
          <meshStandardMaterial color="#421A11" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.72, 0.15]} castShadow receiveShadow>
          <boxGeometry args={[7.4, 0.48, 2.15]} />
          <meshStandardMaterial color="#4F2014" roughness={0.45} />
        </mesh>
        <mesh position={[0, 1.22, 0.08]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 0.54, 1.65]} />
          <meshStandardMaterial color="#5E2717" roughness={0.42} />
        </mesh>

        {/* Gold Trim Band on Main Dais */}
        <mesh position={[0, 0.49, 1.56]}>
          <boxGeometry args={[9.86, 0.08, 0.06]} />
          <meshStandardMaterial color="#D9A441" roughness={0.3} metalness={0.75} />
        </mesh>
        <mesh position={[0, 0.96, 1.24]}>
          <boxGeometry args={[7.46, 0.08, 0.06]} />
          <meshStandardMaterial color="#D9A441" roughness={0.3} metalness={0.75} />
        </mesh>

        {/* Top Plaque: ĐẠI HÙNG BẢO ĐIỆN */}
        <mesh position={[0, 5.95, -0.58]}>
          <planeGeometry args={[4.4, 0.9]} />
          <meshBasicMaterial map={topPlaqueTex} toneMapped={false} />
        </mesh>

        {/* Flanking Vertical Silk Banners: TỪ BI / HỶ XẢ */}
        <mesh position={[-3.75, 4.05, -0.78]}>
          <planeGeometry args={[0.88, 2.35]} />
          <meshBasicMaterial map={leftBannerTex} toneMapped={false} />
        </mesh>
        <mesh position={[3.75, 4.05, -0.78]}>
          <planeGeometry args={[0.88, 2.35]} />
          <meshBasicMaterial map={rightBannerTex} toneMapped={false} />
        </mesh>

        {/* Rotating Mandala Halo Behind Buddha */}
        <mesh ref={haloRef} position={[0, 3.65, -0.62]}>
          <planeGeometry args={[4.75, 4.75]} />
          <meshBasicMaterial
            map={mandalaTex}
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Keyed Transparent Golden Buddha Statue Plane */}
        {buddhaTex ? (
          <mesh position={[0, 3.05, -0.06]}>
            <planeGeometry args={[3.65, 3.65]} />
            <meshBasicMaterial
              map={buddhaTex}
              transparent
              alphaTest={0.08}
              toneMapped={false}
              color="#FFF6E5"
            />
          </mesh>
        ) : (
          /* Clean golden silhouette fallback while texture loads */
          <mesh position={[0, 2.7, 0]}>
            <capsuleGeometry args={[0.62, 1.35, 8, 16]} />
            <meshStandardMaterial color="#D9A441" metalness={0.72} roughness={0.28} />
          </mesh>
        )}

        {/* Front Altar Table (Hương Án) */}
        <mesh position={[0, 0.62, 1.98]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 1.15, 0.92]} />
          <meshStandardMaterial color="#4A1D12" roughness={0.44} />
        </mesh>
        <mesh position={[0, 1.2, 2.45]}>
          <boxGeometry args={[4.26, 0.06, 0.06]} />
          <meshStandardMaterial color="#D9A441" metalness={0.75} roughness={0.3} />
        </mesh>

        {/* Brass Tripod Incense Censer (Lư Hương Đồng) */}
        <group position={[0, 1.48, 1.98]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.3, 0.22, 0.42, 18]} />
            <meshStandardMaterial color="#B58435" metalness={0.76} roughness={0.28} />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.04, 18]} />
            <meshStandardMaterial color="#4A2D16" roughness={0.9} />
          </mesh>
          {/* Three Glowing Incense Sticks */}
          {[-0.06, 0, 0.06].map((ix, idx) => (
            <group key={`stick-${idx}`} position={[ix, 0.45, 0]}>
              <mesh>
                <cylinderGeometry args={[0.009, 0.009, 0.46, 6]} />
                <meshStandardMaterial color="#8F5528" />
              </mesh>
              <mesh position={[0, 0.24, 0]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshBasicMaterial color="#FF6A2B" />
              </mesh>
            </group>
          ))}
        </group>

        {/* Flanking Crimson Candles & Lotus Vases */}
        {[-1.25, 1.25].map((cx, i) => (
          <group key={`candle-${i}`} position={[cx, 1.44, 1.96]}>
            <mesh>
              <cylinderGeometry args={[0.07, 0.1, 0.36, 12]} />
              <meshStandardMaterial color="#B8251E" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.24, 0]}>
              <coneGeometry args={[0.04, 0.14, 8]} />
              <meshBasicMaterial color="#FFB938" />
            </mesh>
          </group>
        ))}

        {[-1.75, 1.75].map((vx, i) => (
          <group key={`vase-${i}`} position={[vx, 1.44, 1.95]}>
            <mesh>
              <cylinderGeometry args={[0.11, 0.08, 0.42, 12]} />
              <meshStandardMaterial color="#E6D5B8" roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <sphereGeometry args={[0.14, 10, 10]} />
              <meshStandardMaterial color="#E879A0" roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Pillar Couplets (Câu Đối) on Inner Front Pillars */}
      <mesh position={[-5.25, 3.6, -8.3]}>
        <planeGeometry args={[0.42, 2.3]} />
        <meshStandardMaterial map={coupletLeftTex} roughness={0.45} />
      </mesh>
      <mesh position={[5.25, 3.6, -8.3]}>
        <planeGeometry args={[0.42, 2.3]} />
        <meshStandardMaterial map={coupletRightTex} roughness={0.45} />
      </mesh>

      {/* Rising Incense Smoke from Censer */}
      <IncenseSmoke burstNonce={incenseBurstNonce} />
    </group>
  );
}

/**
 * 100 Symmetrical Bồ Đoàn Cushion Mats + Low Walnut Sutra Desks + Open Sutra Books
 * rendered via InstancedMesh for rock-solid 60 FPS across Desktop & Mobile.
 */
function HundredMatsInstanced() {
  const matCount = HUNDRED_MATS.length;
  const cushionRef = useRef<THREE.InstancedMesh>(null);
  const padRef = useRef<THREE.InstancedMesh>(null);
  const deskTopRef = useRef<THREE.InstancedMesh>(null);
  const bookRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const dummy = new THREE.Object3D();
    const cushionColor = new THREE.Color();

    HUNDRED_MATS.forEach((slot, idx) => {
      // Base Cushion
      dummy.position.set(slot.x, 0.075, slot.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      cushionRef.current?.setMatrixAt(idx, dummy.matrix);

      // Highlight player's default mat (#16) with deep saffron-gold rim tone
      cushionColor.set(slot.id === 16 ? '#A64622' : '#7E2B1E');
      cushionRef.current?.setColorAt(idx, cushionColor);

      // Round Meditation Pad
      dummy.position.set(slot.x, 0.115, slot.z);
      dummy.updateMatrix();
      padRef.current?.setMatrixAt(idx, dummy.matrix);

      // Low Walnut Sutra Desk sitting forward toward Buddha (-Z)
      dummy.position.set(slot.x, 0.19, slot.z - 0.56);
      dummy.updateMatrix();
      deskTopRef.current?.setMatrixAt(idx, dummy.matrix);

      // Angled Open Sutra Book
      dummy.position.set(slot.x, 0.31, slot.z - 0.56);
      dummy.rotation.set(0.24, 0, 0);
      dummy.updateMatrix();
      bookRef.current?.setMatrixAt(idx, dummy.matrix);
    });

    if (cushionRef.current) {
      cushionRef.current.instanceMatrix.needsUpdate = true;
      if (cushionRef.current.instanceColor) cushionRef.current.instanceColor.needsUpdate = true;
    }
    if (padRef.current) padRef.current.instanceMatrix.needsUpdate = true;
    if (deskTopRef.current) deskTopRef.current.instanceMatrix.needsUpdate = true;
    if (bookRef.current) bookRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group>
      <instancedMesh ref={cushionRef} args={[undefined, undefined, matCount]} receiveShadow castShadow>
        <boxGeometry args={[0.74, 0.07, 0.74]} />
        <meshStandardMaterial roughness={0.82} />
      </instancedMesh>
      <instancedMesh ref={padRef} args={[undefined, undefined, matCount]} receiveShadow>
        <cylinderGeometry args={[0.3, 0.32, 0.045, 16]} />
        <meshStandardMaterial color="#C88B38" roughness={0.65} />
      </instancedMesh>
      <instancedMesh ref={deskTopRef} args={[undefined, undefined, matCount]} castShadow receiveShadow>
        <boxGeometry args={[0.68, 0.22, 0.34]} />
        <meshStandardMaterial color="#3F1E12" roughness={0.52} />
      </instancedMesh>
      <instancedMesh ref={bookRef} args={[undefined, undefined, matCount]}>
        <boxGeometry args={[0.38, 0.025, 0.24]} />
        <meshStandardMaterial color="#F2E2BA" roughness={0.75} />
      </instancedMesh>
    </group>
  );
}

interface ChibiMeshProps {
  robeHex: string;
  trimHex: string;
  gender: 'male' | 'female';
  posture: 'kneel' | 'bow' | 'walk' | 'pond';
  walkSpeed: number;
  jumpOffset: number;
  showBadge?: boolean;
  badgeText?: string;
}

function ChibiPractitionerMesh({
  robeHex,
  trimHex,
  gender,
  posture,
  walkSpeed,
  jumpOffset,
  showBadge,
  badgeText,
}: ChibiMeshProps) {
  const torsoRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (torsoRef.current) {
      if (posture === 'bow') {
        torsoRef.current.rotation.x = THREE.MathUtils.lerp(torsoRef.current.rotation.x, -0.78, 0.14);
      } else if (walkSpeed > 0.05) {
        torsoRef.current.rotation.x = THREE.MathUtils.lerp(
          torsoRef.current.rotation.x,
          -0.06 + Math.sin(t * 10) * 0.04,
          0.2
        );
      } else {
        torsoRef.current.rotation.x = THREE.MathUtils.lerp(
          torsoRef.current.rotation.x,
          Math.sin(t * 1.8) * 0.03,
          0.12
        );
      }
    }
    if (leftArmRef.current && rightArmRef.current) {
      if (walkSpeed > 0.05) {
        leftArmRef.current.rotation.x = Math.sin(t * 10) * 0.45;
        rightArmRef.current.rotation.x = -Math.sin(t * 10) * 0.45;
      } else {
        // Clasped hands in Gassho (chắp tay trước ngực)
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.65, 0.15);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.65, 0.15);
      }
    }
  });

  const baseHeight = posture === 'kneel' || posture === 'bow' ? 0.14 : 0.28;

  return (
    <group position={[0, baseHeight + jumpOffset, 0]}>
      {/* Robe Skirt / Seated Base */}
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.36, 0.48, 16]} />
        <meshStandardMaterial color={robeHex} roughness={0.78} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.37, 0.38, 0.06, 16]} />
        <meshStandardMaterial color={trimHex} roughness={0.72} />
      </mesh>

      {/* Articulated Torso + Head */}
      <group ref={torsoRef} position={[0, 0.36, 0]}>
        {/* Upper Tunic */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.26, 0.42, 16]} />
          <meshStandardMaterial color={robeHex} roughness={0.75} />
        </mesh>

        {/* Arms */}
        <mesh ref={leftArmRef} position={[-0.22, 0.26, 0.08]} rotation={[0, 0, 0.22]} castShadow>
          <capsuleGeometry args={[0.065, 0.22, 6, 10]} />
          <meshStandardMaterial color={robeHex} roughness={0.75} />
        </mesh>
        <mesh ref={rightArmRef} position={[0.22, 0.26, 0.08]} rotation={[0, 0, -0.22]} castShadow>
          <capsuleGeometry args={[0.065, 0.22, 6, 10]} />
          <meshStandardMaterial color={robeHex} roughness={0.75} />
        </mesh>

        {/* Chibi Head */}
        <group position={[0, 0.65, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.28, 22, 20]} />
            <meshStandardMaterial color="#F8D2B5" roughness={0.62} />
          </mesh>
          {/* Eyes & Rosy Cheeks */}
          <mesh position={[-0.1, 0.02, 0.245]}>
            <sphereGeometry args={[0.032, 8, 8]} />
            <meshBasicMaterial color="#1F120D" />
          </mesh>
          <mesh position={[0.1, 0.02, 0.245]}>
            <sphereGeometry args={[0.032, 8, 8]} />
            <meshBasicMaterial color="#1F120D" />
          </mesh>
          <mesh position={[-0.16, -0.04, 0.22]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#F09489" transparent opacity={0.48} />
          </mesh>
          <mesh position={[0.16, -0.04, 0.22]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#F09489" transparent opacity={0.48} />
          </mesh>

          {/* Hair Cap */}
          <mesh position={[0, 0.06, -0.02]} castShadow>
            <sphereGeometry args={[0.292, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
            <meshStandardMaterial color="#1E1411" roughness={0.72} />
          </mesh>

          {/* Female Top Bun + Lotus Pin */}
          {gender === 'female' && (
            <group position={[0, 0.31, -0.04]}>
              <mesh castShadow>
                <sphereGeometry args={[0.115, 14, 14]} />
                <meshStandardMaterial color="#1E1411" roughness={0.72} />
              </mesh>
              <mesh position={[0.11, 0.02, 0.04]}>
                <sphereGeometry args={[0.055, 10, 10]} />
                <meshStandardMaterial color="#E879A0" roughness={0.45} />
              </mesh>
            </group>
          )}
        </group>

        {/* Floating Nameplate */}
        {showBadge && badgeText && (
          <Html position={[0, 1.24, 0]} center distanceFactor={13} zIndexRange={[10, 0]}>
            <div className="pointer-events-none select-none whitespace-nowrap rounded-full border border-[#D9A441]/55 bg-[#1B0D09]/85 px-2.5 py-0.5 text-[11px] font-medium text-[#FFF4D2] shadow-[0_4px_12px_rgba(0,0,0,0.45)] backdrop-blur-sm">
              {badgeText}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

function PeerPractitioners({ hideHtmlBadges }: { hideHtmlBadges: boolean }) {
  const peers = useMemo(
    () => [
      { id: 'peer-1', name: 'Minh An', matId: 12, robe: '#7A8B9E', trim: '#5A6B7D', gender: 'male' as const },
      { id: 'peer-2', name: 'Tịnh Liên', matId: 24, robe: '#D98A2B', trim: '#B36915', gender: 'female' as const },
      { id: 'peer-3', name: 'Diệu Đức', matId: 38, robe: '#7C4D2B', trim: '#5A351B', gender: 'male' as const },
    ],
    []
  );

  return (
    <group>
      {peers.map((p) => {
        const slot = HUNDRED_MATS.find((m) => m.id === p.matId);
        if (!slot) return null;
        return (
          <group key={p.id} position={[slot.x, 0, slot.z]} rotation={[0, Math.PI, 0]}>
            <ChibiPractitionerMesh
              robeHex={p.robe}
              trimHex={p.trim}
              gender={p.gender}
              posture="kneel"
              walkSpeed={0}
              jumpOffset={0}
              showBadge={!hideHtmlBadges}
              badgeText={p.name}
            />
          </group>
        );
      })}
    </group>
  );
}

function PlayerAvatarController({ hideHtmlBadges }: { hideHtmlBadges: boolean }) {
  const name = useTempleStore((s) => s.name);
  const gender = useTempleStore((s) => s.gender);
  const robe = useTempleStore((s) => s.robe);
  const avatarPos = useTempleStore((s) => s.avatarPos);
  const avatarPosture = useTempleStore((s) => s.avatarPosture);
  const avatarJumpNonce = useTempleStore((s) => s.avatarJumpNonce);
  const joystickVector = useTempleStore((s) => s.joystickVector);
  const bowCount = useTempleStore((s) => s.bowCount);
  const isOnboardingOpen = useTempleStore((s) => s.isOnboardingOpen);
  const activeModal = useTempleStore((s) => s.activeModal);
  const setAvatarPos = useTempleStore((s) => s.setAvatarPos);
  const setWorldPrompt = useTempleStore((s) => s.setWorldPrompt);
  const setActiveModal = useTempleStore((s) => s.setActiveModal);
  const triggerBell = useTempleStore((s) => s.triggerBell);
  const triggerJump = useTempleStore((s) => s.triggerJump);

  const robeOption = useMemo(
    () => ROBE_OPTIONS.find((r) => r.id === robe) ?? ROBE_OPTIONS[0],
    [robe]
  );

  const groupRef = useRef<THREE.Group>(null);
  const posRef = useRef(new THREE.Vector3(avatarPos[0], avatarPos[1], avatarPos[2]));
  const keysRef = useRef<Record<string, boolean>>({});
  const walkSpeedRef = useRef(0);
  const [walkSpeedUi, setWalkSpeedUi] = useState(0);
  const [jumpY, setJumpY] = useState(0);
  const jumpVelocityRef = useRef(0);
  const jumpHeightRef = useRef(0);
  const bowTimerRef = useRef(0);
  const prevPromptRef = useRef<string>('');
  const syncStoreTimerRef = useRef(0);

  // Sync external teleport (e.g., prepareLanternWalk)
  useEffect(() => {
    const dx = Math.abs(avatarPos[0] - posRef.current.x);
    const dz = Math.abs(avatarPos[2] - posRef.current.z);
    if (dx > 0.35 || dz > 0.35) {
      posRef.current.set(avatarPos[0], avatarPos[1], avatarPos[2]);
    }
  }, [avatarPos]);

  // Bow posture timer: bow forward smoothly for 1.5s then return to kneel
  useEffect(() => {
    if (bowCount > 0) {
      bowTimerRef.current = 1.5;
    }
  }, [bowCount]);

  // Jump impulse
  useEffect(() => {
    if (avatarJumpNonce > 0 && jumpHeightRef.current <= 0.02) {
      jumpVelocityRef.current = 4.6;
    }
  }, [avatarJumpNonce]);

  // Keyboard listener (WASD + Arrow keys + Space + E)
  useEffect(() => {
    const isTypingInInput = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' || target.isContentEditable;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isOnboardingOpen || activeModal !== null || isTypingInInput(e.target)) {
        return;
      }
      const code = e.code;
      keysRef.current[code] = true;

      if (code === 'Space') {
        e.preventDefault();
        triggerJump();
      } else if (code === 'KeyE') {
        e.preventDefault();
        const promptAction = useTempleStore.getState().worldPromptAction;
        if (promptAction === 'bell') {
          templeAudio.playGreatBell();
          triggerBell();
        } else if (promptAction === 'sutra') {
          setActiveModal('sutra');
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    const onBlur = () => {
      keysRef.current = {};
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [activeModal, isOnboardingOpen, setActiveModal, triggerBell, triggerJump]);

  useFrame((_, delta) => {
    const dt = Math.min(0.05, delta);

    // Input direction
    let moveX = joystickVector.x;
    let moveZ = joystickVector.y;

    const k = keysRef.current;
    if (!isOnboardingOpen && activeModal === null) {
      if (k['KeyA'] || k['ArrowLeft']) moveX -= 1;
      if (k['KeyD'] || k['ArrowRight']) moveX += 1;
      if (k['KeyW'] || k['ArrowUp']) moveZ -= 1;
      if (k['KeyS'] || k['ArrowDown']) moveZ += 1;
    }

    const len = Math.hypot(moveX, moveZ);
    if (len > 1) {
      moveX /= len;
      moveZ /= len;
    }

    const speed = 4.2;
    const moving = len > 0.08;
    if (moving) {
      posRef.current.x = THREE.MathUtils.clamp(posRef.current.x + moveX * speed * dt, -11.6, 12.1);
      posRef.current.z = THREE.MathUtils.clamp(posRef.current.z + moveZ * speed * dt, -7.4, 10.6);
      walkSpeedRef.current = len;
    } else {
      walkSpeedRef.current = 0;
    }

    if ((walkSpeedUi > 0.05) !== (walkSpeedRef.current > 0.05)) {
      setWalkSpeedUi(walkSpeedRef.current);
    }

    // Jump physics
    if (jumpHeightRef.current > 0 || jumpVelocityRef.current > 0) {
      jumpHeightRef.current += jumpVelocityRef.current * dt;
      jumpVelocityRef.current -= 14.5 * dt;
      if (jumpHeightRef.current <= 0) {
        jumpHeightRef.current = 0;
        jumpVelocityRef.current = 0;
      }
      setJumpY(jumpHeightRef.current);
    }

    // Bow timer countdown
    if (bowTimerRef.current > 0) {
      bowTimerRef.current -= dt;
      if (bowTimerRef.current <= 0 && useTempleStore.getState().avatarPosture === 'bow') {
        setAvatarPos([posRef.current.x, 0, posRef.current.z], 'kneel');
      }
    }

    // Update Three.js transform smoothly
    if (groupRef.current) {
      groupRef.current.position.lerp(posRef.current, 0.35);
      if (moving) {
        const targetYaw = Math.atan2(moveX, moveZ);
        let diff = targetYaw - groupRef.current.rotation.y;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        groupRef.current.rotation.y += diff * Math.min(1, dt * 10);
      } else if (avatarPosture === 'pond') {
        // Face East toward right lotus pond
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, Math.PI * 0.5, dt * 6);
      } else {
        // Face North (-Z) toward Buddha statue
        let diff = Math.PI - groupRef.current.rotation.y;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        groupRef.current.rotation.y += diff * Math.min(1, dt * 6);
      }
    }

    // Periodically sync posture/position when moving or settling
    syncStoreTimerRef.current += dt;
    if (moving && syncStoreTimerRef.current > 0.12) {
      syncStoreTimerRef.current = 0;
      setAvatarPos([posRef.current.x, 0, posRef.current.z], 'walk');
    } else if (!moving && useTempleStore.getState().avatarPosture === 'walk') {
      setAvatarPos([posRef.current.x, 0, posRef.current.z], 'kneel');
    }

    // Proximity world prompt check (Bell vs Sutra Desk)
    const distBell = Math.hypot(posRef.current.x - 11.4, posRef.current.z - -6.4);
    const nextPromptKey = distBell < 3.8 ? 'bell' : 'sutra';
    if (nextPromptKey !== prevPromptRef.current) {
      prevPromptRef.current = nextPromptKey;
      if (nextPromptKey === 'bell') {
        setWorldPrompt('Thỉnh Đại Hồng Chung', 'bell');
      } else {
        setWorldPrompt('Mở Sách Đọc Kinh', 'sutra');
      }
    }
  });

  const displayName = `${name.trim() || 'Diệu Tâm'} (Bạn)`;

  return (
    <group ref={groupRef} position={[avatarPos[0], avatarPos[1], avatarPos[2]]} rotation={[0, Math.PI, 0]}>
      <ChibiPractitionerMesh
        robeHex={robeOption.hex}
        trimHex={robeOption.trimHex}
        gender={gender}
        posture={walkSpeedUi > 0.05 ? 'walk' : avatarPosture}
        walkSpeed={walkSpeedUi}
        jumpOffset={jumpY}
        showBadge={!hideHtmlBadges}
        badgeText={displayName}
      />
    </group>
  );
}

function GreatBellPavilion({ onRingBell }: { onRingBell: () => void }) {
  const bellSwingNonce = useTempleStore((s) => s.bellSwingNonce);
  const bellGroupRef = useRef<THREE.Group>(null);
  const ringWaveRef = useRef<THREE.Mesh>(null);
  const swingEnergyRef = useRef(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (bellSwingNonce > 0) {
      swingEnergyRef.current = 1.0;
    }
  }, [bellSwingNonce]);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (swingEnergyRef.current > 0.002) {
      swingEnergyRef.current = Math.max(0, swingEnergyRef.current - delta * 0.28);
    }
    if (bellGroupRef.current) {
      bellGroupRef.current.rotation.z =
        Math.sin(t * 7.2) * 0.16 * swingEnergyRef.current;
    }
    if (ringWaveRef.current) {
      const active = swingEnergyRef.current > 0.05;
      ringWaveRef.current.visible = active;
      if (active) {
        const s = 1 + (1 - swingEnergyRef.current) * 3.8;
        ringWaveRef.current.scale.set(s, s, 1);
        const mat = ringWaveRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = swingEnergyRef.current * 0.55;
      }
    }
  });

  return (
    <group
      position={[11.4, 0, -6.4]}
      onClick={(e) => {
        e.stopPropagation();
        onRingBell();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Stone Bell Base */}
      <mesh position={[0, 0.14, 0]} receiveShadow>
        <boxGeometry args={[2.1, 0.28, 2.1]} />
        <meshStandardMaterial color="#423934" roughness={0.78} />
      </mesh>
      {/* 4 Ironwood Bell Frame Columns */}
      {[
        [-0.78, -0.78],
        [0.78, -0.78],
        [-0.78, 0.78],
        [0.78, 0.78],
      ].map(([x, z], idx) => (
        <mesh key={`bc-${idx}`} position={[x, 1.75, z]} castShadow>
          <cylinderGeometry args={[0.09, 0.11, 3.0, 10]} />
          <meshStandardMaterial color="#3A1A10" roughness={0.6} />
        </mesh>
      ))}
      {/* Bell Pavilion Top Crown Beam */}
      <mesh position={[0, 3.28, 0]} castShadow>
        <boxGeometry args={[2.25, 0.22, 2.25]} />
        <meshStandardMaterial color="#2D130C" roughness={0.62} />
      </mesh>
      <mesh position={[0, 3.65, 0]} castShadow>
        <coneGeometry args={[1.65, 0.72, 4]} />
        <meshStandardMaterial color="#671814" roughness={0.55} />
      </mesh>

      {/* Suspended Swinging Brass Great Bell */}
      <group ref={bellGroupRef} position={[0, 3.12, 0]}>
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
          <meshStandardMaterial color="#D9A441" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, -1.05, 0]} castShadow>
          <cylinderGeometry args={[0.36, 0.56, 1.18, 22]} />
          <meshStandardMaterial
            color={hovered ? '#E2AF4A' : '#B58332'}
            metalness={0.78}
            roughness={0.28}
            emissive={hovered ? '#7A5214' : '#2E1E08'}
            emissiveIntensity={0.45}
          />
        </mesh>
        <mesh position={[0, -1.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.56, 0.055, 10, 24]} />
          <meshStandardMaterial color="#D9A441" metalness={0.8} roughness={0.25} />
        </mesh>
      </group>

      {/* Expanding Gold Resonance Halo on Strike */}
      <mesh ref={ringWaveRef} position={[0, 1.45, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.7, 0.9, 32]} />
        <meshBasicMaterial color="#F6D58A" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function FloatingLanternMesh({
  x,
  z,
  color,
  seedPhase,
  lanternIntensity,
}: {
  x: number;
  z: number;
  color: string;
  seedPhase: number;
  lanternIntensity: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime + seedPhase;
    if (ref.current) {
      ref.current.position.y = 0.05 + Math.sin(t * 1.9) * 0.035;
      ref.current.position.x = x + Math.sin(t * 0.45) * 0.25;
      ref.current.position.z = z + Math.cos(t * 0.38) * 0.3;
      ref.current.rotation.y = t * 0.35;
    }
  });

  return (
    <group ref={ref} position={[x, 0.05, z]}>
      {/* Green Lily Pad Base */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.32, 14]} />
        <meshStandardMaterial color="#1E5233" roughness={0.8} />
      </mesh>
      {/* Lotus Petals Ring */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.25, 0.14, 0.16, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={lanternIntensity * 0.55}
          roughness={0.4}
        />
      </mesh>
      {/* Glowing Candle Core */}
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.075, 10, 10]} />
        <meshBasicMaterial color="#FFEBA8" />
      </mesh>
      <pointLight color={color} intensity={0.85} distance={3.5} decay={2} position={[0, 0.32, 0]} />
    </group>
  );
}

function LotusPondsAndCourtyardTrees({ lanternIntensity }: { lanternIntensity: number }) {
  const floatingLanterns = useTempleStore((s) => s.floatingLanterns);

  const naturalLotuses = useMemo(
    () => [
      [-15.6, -5.2],
      [-14.3, -2.6],
      [-16.2, -0.4],
      [-14.8, 2.8],
      [-15.9, 5.5],
      [15.4, -5.0],
      [16.3, -2.2],
      [14.4, 0.8],
      [15.8, 3.8],
      [14.7, 6.0],
    ],
    []
  );

  const treePositions: Array<[number, number, number]> = [
    [-14.2, 0, -10.5],
    [-14.2, 0, 10.6],
    [14.4, 0, -10.6],
    [14.4, 0, 10.6],
  ];

  return (
    <group>
      {/* Left & Right Lotus Ponds (Hồ Sen Hai Bên) */}
      {[-15.4, 15.4].map((px, i) => (
        <group key={`pond-${i}`} position={[px, 0, 0.5]}>
          {/* Carved Stone Pool Border */}
          <mesh position={[0, 0.02, 0]} receiveShadow>
            <boxGeometry args={[5.8, 0.24, 16.4]} />
            <meshStandardMaterial color="#463E38" roughness={0.85} />
          </mesh>
          {/* Shimmering Dark Jade Water */}
          <mesh position={[0, 0.145, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[5.1, 15.6]} />
            <meshStandardMaterial color="#123840" roughness={0.18} metalness={0.48} />
          </mesh>
        </group>
      ))}

      {/* Lily Pads & Pink Lotus Blooms */}
      {naturalLotuses.map(([lx, lz], idx) => (
        <group key={`lotus-${idx}`} position={[lx, 0.16, lz]}>
          <mesh rotation={[-Math.PI / 2, 0, idx]}>
            <circleGeometry args={[0.36, 14]} />
            <meshStandardMaterial color="#1B5631" roughness={0.78} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <coneGeometry args={[0.16, 0.18, 7]} />
            <meshStandardMaterial color={idx % 3 === 0 ? '#FFF1F5' : '#E879A0'} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Dynamic Released Floating Hoa Đăng Lanterns */}
      {floatingLanterns.map((lantern, idx) => (
        <FloatingLanternMesh
          key={lantern.id}
          x={lantern.x}
          z={lantern.z}
          color={lantern.color}
          seedPhase={idx * 1.37}
          lanternIntensity={lanternIntensity}
        />
      ))}

      {/* Corner Bodhi Trees with Hanging Warm Temple Lanterns */}
      {treePositions.map(([tx, ty, tz], idx) => (
        <group key={`bodhi-${idx}`} position={[tx, ty, tz]}>
          <mesh position={[0, 1.85, 0]} castShadow>
            <cylinderGeometry args={[0.24, 0.42, 3.7, 10]} />
            <meshStandardMaterial color="#3A2417" roughness={0.9} />
          </mesh>
          <mesh position={[0, 4.2, 0]} castShadow>
            <sphereGeometry args={[2.15, 14, 12]} />
            <meshStandardMaterial color="#1E4B29" roughness={0.84} />
          </mesh>
          <mesh position={[-1.1, 3.55, 0.7]} castShadow>
            <sphereGeometry args={[1.45, 12, 10]} />
            <meshStandardMaterial color="#275D33" roughness={0.84} />
          </mesh>
          <mesh position={[1.1, 3.65, -0.6]} castShadow>
            <sphereGeometry args={[1.38, 12, 10]} />
            <meshStandardMaterial color="#22522C" roughness={0.84} />
          </mesh>
          {/* Hanging Warm Lantern under Canopy */}
          <mesh position={[tx < 0 ? 1.1 : -1.1, 2.75, 0.4]}>
            <sphereGeometry args={[0.2, 10, 10]} />
            <meshStandardMaterial
              color="#E88B2E"
              emissive="#FFAD3B"
              emissiveIntensity={lanternIntensity * 0.9}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const DEFAULT_CAM_POS = new THREE.Vector3(0, 7.2, 14.5);
const DEFAULT_CAM_TARGET = new THREE.Vector3(0, 2.2, -3.5);
const OVERVIEW_CAM_POS = new THREE.Vector3(0, 20.5, 22.5);
const OVERVIEW_CAM_TARGET = new THREE.Vector3(0, 1.0, -1.2);

function CameraRig() {
  const { camera } = useThree();
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls> | null>(null);
  const cameraCommand = useTempleStore((s) => s.cameraCommand);
  const overviewActive = useTempleStore((s) => s.overviewActive);

  const desiredPosRef = useRef<THREE.Vector3 | null>(null);
  const desiredTargetRef = useRef<THREE.Vector3 | null>(null);
  const lastNonceRef = useRef<number>(0);

  useEffect(() => {
    if (!cameraCommand || cameraCommand.nonce === lastNonceRef.current) return;
    lastNonceRef.current = cameraCommand.nonce;

    const ctrl = controlsRef.current;
    const currentTarget = ctrl ? ctrl.target.clone() : DEFAULT_CAM_TARGET.clone();
    const offset = camera.position.clone().sub(currentTarget);

    if (cameraCommand.type === 'zoom_in') {
      const len = Math.max(5.5, offset.length() * 0.78);
      offset.setLength(len);
      desiredTargetRef.current = currentTarget;
      desiredPosRef.current = currentTarget.clone().add(offset);
    } else if (cameraCommand.type === 'zoom_out') {
      const len = Math.min(34, offset.length() * 1.28);
      offset.setLength(len);
      desiredTargetRef.current = currentTarget;
      desiredPosRef.current = currentTarget.clone().add(offset);
    } else if (cameraCommand.type === 'toggle_overview') {
      if (overviewActive) {
        desiredPosRef.current = OVERVIEW_CAM_POS.clone();
        desiredTargetRef.current = OVERVIEW_CAM_TARGET.clone();
      } else {
        desiredPosRef.current = DEFAULT_CAM_POS.clone();
        desiredTargetRef.current = DEFAULT_CAM_TARGET.clone();
      }
    } else if (cameraCommand.type === 'reset') {
      desiredPosRef.current = DEFAULT_CAM_POS.clone();
      desiredTargetRef.current = DEFAULT_CAM_TARGET.clone();
    }
  }, [camera, cameraCommand, overviewActive]);

  useFrame((_, delta) => {
    const dt = Math.min(1, delta * 5.2);
    if (desiredPosRef.current && desiredTargetRef.current && controlsRef.current) {
      camera.position.lerp(desiredPosRef.current, dt);
      controlsRef.current.target.lerp(desiredTargetRef.current, dt);
      controlsRef.current.update();

      if (camera.position.distanceTo(desiredPosRef.current) < 0.08) {
        desiredPosRef.current = null;
        desiredTargetRef.current = null;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      target={[DEFAULT_CAM_TARGET.x, DEFAULT_CAM_TARGET.y, DEFAULT_CAM_TARGET.z]}
      enableDamping
      dampingFactor={0.07}
      minDistance={5.5}
      maxDistance={35}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI * 0.465}
      enablePan={false}
    />
  );
}

function SanctuarySceneContents() {
  const theme = useEffectiveTheme();
  const graphicsQuality = useTempleStore((s) => s.graphicsQuality);
  const isOnboardingOpen = useTempleStore((s) => s.isOnboardingOpen);
  const activeModal = useTempleStore((s) => s.activeModal);
  const triggerBell = useTempleStore((s) => s.triggerBell);
  const hideHtmlBadges = isOnboardingOpen || activeModal !== null;

  const handleRingBell = () => {
    templeAudio.playGreatBell();
    triggerBell();
  };

  return (
    <>
      <AtmosphereAndSky theme={theme} />
      <CameraRig />
      <TempleHallArchitecture lanternIntensity={theme.lanternEmissiveIntensity} />
      <HundredMatsInstanced />
      <PeerPractitioners hideHtmlBadges={hideHtmlBadges} />
      <PlayerAvatarController hideHtmlBadges={hideHtmlBadges} />
      <GreatBellPavilion onRingBell={handleRingBell} />
      <LotusPondsAndCourtyardTrees lanternIntensity={theme.lanternEmissiveIntensity} />
      <RainAndPetals isRain={theme.isRain} quality={graphicsQuality} />
    </>
  );
}

class WebGLSafeBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_#4A2418_0%,_#1B0D09_68%,_#0E0810_100%)] text-center text-[#F6D58A]">
          <div className="max-w-sm rounded-2xl border border-[#D9A441]/35 bg-[#1B0D09]/85 p-6">
            <p className="text-base font-semibold">Không Gian Chánh Điện 3D</p>
            <p className="mt-2 text-xs text-[#F7EBD5]/75">
              Trình duyệt hiện tại tạm giới hạn tăng tốc đồ họa WebGL. Quý Phật tử vẫn có thể sử dụng đầy đủ Tụng Kinh, Lần Chuỗi 108 Hạt và Thả Hoa Đăng qua thanh điều khiển bên dưới.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function TempleScene3D() {
  const graphicsQuality = useTempleStore((s) => s.graphicsQuality);
  const dpr: [number, number] =
    graphicsQuality === 'low' ? [1, 1] : graphicsQuality === 'medium' ? [1, 1.35] : [1, 1.75];

  return (
    <WebGLSafeBoundary>
      <div className="h-full w-full bg-[#1B0D09]">
        <Canvas
          shadows={graphicsQuality === 'high'}
          dpr={dpr}
          camera={{ position: [0, 7.2, 14.5], fov: 46, near: 0.2, far: 120 }}
          gl={{ antialias: graphicsQuality !== 'low', powerPreference: 'high-performance' }}
        >
          <SanctuarySceneContents />
        </Canvas>
      </div>
    </WebGLSafeBoundary>
  );
}


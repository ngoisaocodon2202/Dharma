'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { TempleHUD } from './TempleHUD';
import { TempleModals } from './TempleModals';
import { useTempleStore } from './useTempleStore';
import { templeAudio } from './templeAudio';
import { useDharmaStore } from '@/store/useDharmaStore';

const TempleScene3D = dynamic(() => import('./TempleScene3D'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#1B0D09] text-[#F6D58A]">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D9A441]/30 border-t-[#F6D58A]" />
        <p className="font-serif text-sm tracking-wide text-[#F6D58A]/90">
          Đang khai mở Chánh Điện 3D...
        </p>
      </div>
    </div>
  ),
});

export function TempleSanctuary() {
  const isOnboardingOpen = useTempleStore((s) => s.isOnboardingOpen);
  const soundEnabled = useTempleStore((s) => s.soundEnabled);
  const ambientMode = useTempleStore((s) => s.ambientMode);
  const tickMeditationSecond = useTempleStore((s) => s.tickMeditationSecond);
  const setRealWeatherData = useTempleStore((s) => s.setRealWeatherData);
  const refreshRealTimeSlot = useTempleStore((s) => s.refreshRealTimeSlot);

  // Sync user's DHARMA dharmaName into temple store profile once on mount if customized
  useEffect(() => {
    const dharmaProfile = useDharmaStore.getState().profile;
    const preferredName = dharmaProfile?.dharmaName?.trim();
    if (preferredName) {
      useTempleStore.getState().setProfile({ name: preferredName });
    }
  }, []);

  // Meditation second counter while inside the hall
  useEffect(() => {
    if (isOnboardingOpen) return;
    const id = window.setInterval(() => {
      tickMeditationSecond();
    }, 1000);
    return () => window.clearInterval(id);
  }, [isOnboardingOpen, tickMeditationSecond]);

  // Ambient Web Audio engine synchronization
  useEffect(() => {
    templeAudio.setEnabled(soundEnabled);
    templeAudio.setAmbientMode(ambientMode);
  }, [soundEnabled, ambientMode]);

  useEffect(() => {
    return () => {
      templeAudio.stopAmbient();
    };
  }, []);

  // Open-Meteo real-time Ho Chi Minh City weather + local clock slot sync
  useEffect(() => {
    let active = true;
    const syncWeather = async () => {
      refreshRealTimeSlot();
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=10.8231&longitude=106.6297&current=temperature_2m,weather_code',
          { cache: 'no-store' }
        );
        if (!res.ok || !active) return;
        const json = (await res.json()) as {
          current?: { temperature_2m?: number; weather_code?: number };
        };
        if (!active || !json.current) return;
        const temp = Math.round(json.current.temperature_2m ?? 31);
        const code = Number(json.current.weather_code ?? 0);
        const isRain = code >= 51;
        setRealWeatherData(temp, isRain);
      } catch {
        // Fallback silently to default serene weather when offline
      }
    };

    void syncWeather();
    const intervalId = window.setInterval(() => {
      void syncWeather();
    }, 10 * 60 * 1000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [refreshRealTimeSlot, setRealWeatherData]);

  // Sync 3D temple practice actions into DHARMA's persistent merit ledger
  const prevSnapshotRef = useRef({
    bowCount: useTempleStore.getState().bowCount,
    totalMalaBeads: useTempleStore.getState().totalMalaBeads,
    lanternIncenseCount: useTempleStore.getState().lanternIncenseCount,
    bellSwingNonce: useTempleStore.getState().bellSwingNonce,
  });

  useEffect(() => {
    const unsubscribe = useTempleStore.subscribe((state) => {
      const prev = prevSnapshotRef.current;
      const dharma = useDharmaStore.getState();

      if (state.bowCount > prev.bowCount) {
        dharma.recordTempleProstrationCycle(state.bowCount - prev.bowCount);
      }
      if (state.totalMalaBeads > prev.totalMalaBeads) {
        dharma.incrementMalaBead(state.totalMalaBeads - prev.totalMalaBeads, 'Chánh Điện 3D', 108);
      }
      if (state.lanternIncenseCount > prev.lanternIncenseCount) {
        dharma.recordTempleIncense();
      }
      if (state.bellSwingNonce > prev.bellSwingNonce) {
        dharma.incrementBellStrikes(1, 'Đại Hồng Chung Chánh Điện 3D');
      }

      prevSnapshotRef.current = {
        bowCount: state.bowCount,
        totalMalaBeads: state.totalMalaBeads,
        lanternIncenseCount: state.lanternIncenseCount,
        bellSwingNonce: state.bellSwingNonce,
      };
    });
    return () => unsubscribe();
  }, []);

  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-[#1B0D09] text-[#F7EBD5] select-none">
      <div className="absolute inset-0 z-0">
        <TempleScene3D />
      </div>
      <TempleHUD />
      <TempleModals />
    </main>
  );
}

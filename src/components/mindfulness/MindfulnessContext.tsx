'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { playBellSound, playGrandTempleBellSound } from '@/lib/buddhistSounds';
import { CenterToast } from '@/components/ui/CenterToast';

interface MindfulnessContextType {
  seniorMode: boolean;
  toggleSeniorMode: () => void;
  bellIntervalMinutes: number; // 0 = off, 15, 30, 45, 60
  setBellIntervalMinutes: (mins: number) => void;
  triggerManualBell: () => void;
  isMindfulnessModalOpen: boolean;
  setIsMindfulnessModalOpen: (open: boolean) => void;
}

const MindfulnessContext = createContext<MindfulnessContextType | undefined>(undefined);

const MINDFUL_QUOTES = [
  'Thở vào tâm tĩnh lặng, thở ra miệng mỉm cười.',
  'Lắng lòng nghe tiếng chuông, phiền não tan mây khói.',
  'Hiện tại là giây phút tuyệt vời nhất. Hãy trở về với tự thân.',
  'Thân ở đây và tâm cũng ở đây. An trú trong hiện tại nhiệm màu.',
  'Tâm bình thế giới bình. Nhìn cuộc đời bằng ánh mắt từ bi.',
  'Buông bỏ muộn phiền, bước từng bước thong dong trên mặt đất.',
];

export function MindfulnessProvider({ children }: { children: React.ReactNode }) {
  const [seniorMode, setSeniorMode] = useState<boolean>(false);
  const [bellIntervalMinutes, setBellIntervalState] = useState<number>(0);
  const [isMindfulnessModalOpen, setIsMindfulnessModalOpen] = useState(false);
  const [mindfulNotification, setMindfulNotification] = useState<string | null>(null);

  const bellTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const savedSenior = localStorage.getItem('phatphap_senior_mode');
      if (savedSenior === 'true') {
        setSeniorMode(true);
        document.documentElement.classList.add('senior-mode');
      }

      const savedBell = localStorage.getItem('phatphap_bell_interval');
      if (savedBell) {
        setBellIntervalState(parseInt(savedBell, 10));
      }
    } catch {}
  }, []);

  const toggleSeniorMode = () => {
    setSeniorMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('phatphap_senior_mode', String(next));
      } catch {}
      if (next) {
        document.documentElement.classList.add('senior-mode');
      } else {
        document.documentElement.classList.remove('senior-mode');
      }
      return next;
    });
  };

  const setBellIntervalMinutes = (mins: number) => {
    setBellIntervalState(mins);
    try {
      localStorage.setItem('phatphap_bell_interval', String(mins));
    } catch {}
  };

  const triggerMindfulNotification = () => {
    const randomQuote = MINDFUL_QUOTES[Math.floor(Math.random() * MINDFUL_QUOTES.length)];
    setMindfulNotification(randomQuote);
    playGrandTempleBellSound(0.45);

    setTimeout(() => {
      setMindfulNotification(null);
    }, 7000);
  };

  const triggerManualBell = () => {
    triggerMindfulNotification();
  };

  // Background interval timer
  useEffect(() => {
    if (bellTimerRef.current) clearInterval(bellTimerRef.current);

    if (bellIntervalMinutes > 0) {
      const ms = bellIntervalMinutes * 60 * 1000;
      bellTimerRef.current = setInterval(() => {
        triggerMindfulNotification();
      }, ms);
    }

    return () => {
      if (bellTimerRef.current) clearInterval(bellTimerRef.current);
    };
  }, [bellIntervalMinutes]);

  return (
    <MindfulnessContext.Provider
      value={{
        seniorMode,
        toggleSeniorMode,
        bellIntervalMinutes,
        setBellIntervalMinutes,
        triggerManualBell,
        isMindfulnessModalOpen,
        setIsMindfulnessModalOpen,
      }}
    >
      {children}

      {/* Mindful Bell Toast Notification */}
      <CenterToast
        message={mindfulNotification}
        variant="mindful"
        icon="bell"
        title="Tiếng Chuông Tỉnh Thức"
        subtitle="Hãy dừng lại, hít vào một hơi thật sâu và thở ra mỉm cười..."
      />
    </MindfulnessContext.Provider>
  );
}

export function useMindfulness() {
  const context = useContext(MindfulnessContext);
  if (!context) {
    throw new Error('useMindfulness must be used within a MindfulnessProvider');
  }
  return context;
}


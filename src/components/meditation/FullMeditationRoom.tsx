'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Bell, Wind, Trees, CloudRain, Timer, History, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { formatDate } from '@/lib/utils';
import { useMeditationAudio } from '@/hooks/useMeditationAudio';

type SoundType = 'BELL' | 'RAIN' | 'FOREST' | 'SILENCE';

interface Session {
  duration_seconds: number;
  sound_type: string;
  completed_at: string;
}

const SOUNDS: { value: SoundType; label: string; icon: React.ElementType }[] = [
  { value: 'BELL', label: 'Chuông', icon: Bell },
  { value: 'RAIN', label: 'Mưa', icon: CloudRain },
  { value: 'FOREST', label: 'Rừng', icon: Trees },
  { value: 'SILENCE', label: 'Tĩnh lặng', icon: Wind },
];

const DURATIONS = [5, 10, 20, 30, 45, 60];

export function FullMeditationRoom() {
  const { user } = useAuth();
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [secondsLeft, setSecondsLeft] = useState(10 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundChoice, setSoundChoice] = useState<SoundType>('BELL');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState({ totalSessions: 0, totalMinutes: 0 });
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { startSound, stopSound, strikeBell } = useMeditationAudio();

  // Load session history
  useEffect(() => {
    if (!user) return;
    fetch('/api/meditation/sessions')
      .then(r => r.json())
      .then(d => {
        setSessions(d.recentSessions || []);
        setStats({ totalSessions: d.totalSessions || 0, totalMinutes: d.totalMinutes || 0 });
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    setSecondsLeft(durationMinutes * 60);
    setIsActive(false);
    setIsCompleted(false);
  }, [durationMinutes]);

  const saveSession = useCallback(async (durationSecs: number) => {
    if (!user || durationSecs < 60) return;
    try {
      await fetch('/api/meditation/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration_seconds: durationSecs, sound_type: soundChoice }),
      });
      // Refresh stats
      const res = await fetch('/api/meditation/sessions');
      const d = await res.json();
      setSessions(d.recentSessions || []);
      setStats({ totalSessions: d.totalSessions || 0, totalMinutes: d.totalMinutes || 0 });
    } catch {}
  }, [user, soundChoice]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsActive(false);
            setIsCompleted(true);
            // Stop ambient, strike bell for completion
            stopSound();
            setTimeout(() => strikeBell(), 300);
            const elapsed = sessionStartTime ? Math.round((Date.now() - sessionStartTime) / 1000) : durationMinutes * 60;
            saveSession(elapsed);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, durationMinutes, saveSession, sessionStartTime, stopSound, strikeBell]);

  const toggleTimer = () => {
    if (!isActive) {
      setSessionStartTime(Date.now());
      // Strike bell to signal start, then start ambient sound
      strikeBell();
      if (!isMuted) {
        setTimeout(() => startSound(soundChoice), 2000);
      }
    } else {
      stopSound();
    }
    setIsActive(v => !v);
    setIsCompleted(false);
  };

  const resetTimer = () => {
    stopSound();
    setIsActive(false);
    setIsCompleted(false);
    setSecondsLeft(durationMinutes * 60);
    setSessionStartTime(null);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (isActive) startSound(soundChoice);
    } else {
      setIsMuted(true);
      stopSound();
    }
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progressPct = durationMinutes > 0
    ? ((durationMinutes * 60 - secondsLeft) / (durationMinutes * 60)) * 100
    : 0;
  const circumference = 2 * Math.PI * 90; // radius=90

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Stats row (logged in users) */}
      {user && stats.totalSessions > 0 && (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
          <div className="bg-jade-50 dark:bg-jade-950/30 rounded-xl border border-jade-200 dark:border-jade-800 p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold font-heading text-jade-700 dark:text-jade-300">{stats.totalSessions}</p>
            <p className="text-[11px] sm:text-xs text-charcoal-500 mt-0.5">Phiên thiền hoàn thành</p>
          </div>
          <div className="bg-saffron-50 dark:bg-saffron-950/30 rounded-xl border border-saffron-200 dark:border-saffron-800 p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold font-heading text-saffron-700 dark:text-saffron-300">{stats.totalMinutes}</p>
            <p className="text-[11px] sm:text-xs text-charcoal-500 mt-0.5">Phút chánh niệm tích lũy</p>
          </div>
        </div>
      )}

      {/* Main timer panel */}
      <div className="bg-white dark:bg-charcoal-800 rounded-2xl border border-ivory-200 dark:border-charcoal-700 p-4 sm:p-6 md:p-10 shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">

          {/* Circular Timer (Hero focus on mobile) */}
          <div className="order-1 lg:order-2 flex flex-col items-center gap-4 sm:gap-6 w-full lg:w-auto py-1 sm:py-2">
            <div className="relative flex items-center justify-center">
              {/* Breathing aura rings when active */}
              {isActive && (
                <>
                  <div className="absolute -inset-4 sm:-inset-6 rounded-full border-2 border-saffron-400/20 dark:border-saffron-500/20 animate-breathe-ring pointer-events-none" />
                  <div className="absolute -inset-8 sm:-inset-10 rounded-full border border-saffron-400/10 dark:border-saffron-500/10 animate-breathe-ring pointer-events-none" style={{ animationDelay: '0.3s' }} />
                </>
              )}

              {/* SVG progress ring with responsive viewBox */}
              <svg viewBox="0 0 220 220" className="-rotate-90 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px]">
                <circle cx="110" cy="110" r="90" fill="none"
                  strokeWidth="6"
                  className="stroke-ivory-200 dark:stroke-charcoal-700"
                />
                <circle cx="110" cy="110" r="90" fill="none"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (progressPct / 100) * circumference}
                  className="stroke-saffron-500 transition-all duration-1000"
                />
              </svg>

              {/* Center display */}
              <div className={`absolute flex flex-col items-center justify-center w-32 h-32 sm:w-40 sm:h-40 rounded-full transition-all duration-700 ${
                isActive ? 'animate-breathe' : ''
              }`}>
                {isCompleted ? (
                  <div className="text-center space-y-1">
                    <p className="text-2xl">🙏</p>
                    <p className="text-xs text-jade-600 dark:text-jade-400 font-medium">Hoàn thành</p>
                  </div>
                ) : (
                  <>
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-charcoal-900 dark:text-charcoal-100">
                      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-charcoal-500 dark:text-charcoal-400 mt-1 uppercase tracking-wider text-center">
                      {isActive ? 'Thở vào... Thở ra...' : 'Sẵn sàng'}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTimer}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                {isActive ? <><Pause className="w-4 h-4" /> Tạm dừng</> : <><Play className="w-4 h-4 ml-0.5" /> Bắt đầu</>}
              </button>
              <button
                onClick={resetTimer}
                className="p-2.5 sm:p-3 rounded-xl border border-ivory-300 dark:border-charcoal-600 text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-700 transition-all hover:-rotate-45"
                title="Đặt lại"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={toggleMute}
                title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                className={`p-2.5 sm:p-3 rounded-xl border transition-all ${
                  isMuted
                    ? 'border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/30 text-rose-500'
                    : 'border-ivory-300 dark:border-charcoal-600 text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-700'
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {isCompleted && (
              <p className="text-xs text-jade-600 dark:text-jade-400 text-center max-w-[220px]">
                ✦ Tùy hỷ công đức thiền định của quý đạo hữu!{user ? ' Phiên thiền đã được ghi lại.' : ''}
              </p>
            )}
          </div>

          {/* Settings & Guidance */}
          <div className="order-2 lg:order-1 space-y-4 sm:space-y-6 w-full lg:flex-1">
            {/* Duration */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5" /> Thời gian tọa thiền
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {DURATIONS.map(d => (
                  <button
                    key={d}
                    onClick={() => setDurationMinutes(d)}
                    disabled={isActive}
                    className={`py-2 text-xs font-medium rounded-lg transition-colors disabled:opacity-40 text-center ${
                      durationMinutes === d
                        ? 'bg-saffron-500 text-white shadow-sm font-semibold'
                        : 'bg-ivory-100 dark:bg-charcoal-700 text-charcoal-700 dark:text-charcoal-300 hover:bg-ivory-200'
                    }`}
                  >
                    {d} phút
                  </button>
                ))}
              </div>
            </div>

            {/* Sound */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Âm thanh nền</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SOUNDS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setSoundChoice(value)}
                    disabled={isActive}
                    className={`px-3 py-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 border transition-colors disabled:opacity-40 whitespace-nowrap ${
                      soundChoice === value
                        ? 'border-saffron-500 bg-saffron-50 dark:bg-saffron-950/40 text-saffron-700 dark:text-saffron-300 font-semibold shadow-2xs'
                        : 'border-ivory-200 dark:border-charcoal-600 text-charcoal-600 dark:text-charcoal-400 hover:border-saffron-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="whitespace-nowrap">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Guidance */}
            <div className="p-3.5 sm:p-4 bg-ivory-50 dark:bg-charcoal-700/50 rounded-xl text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed space-y-1">
              <p className="font-semibold text-charcoal-800 dark:text-charcoal-200">Hướng dẫn ngắn</p>
              <p>Ngồi thẳng lưng, hai vai buông lỏng. Mắt khép nhẹ hoặc nhìn xuống 45°. Để hơi thở diễn ra tự nhiên và chỉ đơn giản theo dõi nó.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent sessions */}
      {user && sessions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-heading text-base font-bold text-charcoal-900 dark:text-charcoal-100 flex items-center gap-2">
            <History className="w-4 h-4 text-saffron-500" /> Lịch sử thiền định
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sessions.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-charcoal-800 rounded-xl border border-ivory-200 dark:border-charcoal-700">
                <div className="w-8 h-8 rounded-lg bg-saffron-100 dark:bg-saffron-900/40 flex items-center justify-center text-saffron-600 text-xs font-bold flex-shrink-0">
                  {Math.round(s.duration_seconds / 60)}m
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-charcoal-800 dark:text-charcoal-200">
                    {SOUNDS.find(s2 => s2.value === s.sound_type)?.label || s.sound_type}
                  </p>
                  <p className="text-[11px] text-charcoal-400">{formatDate(s.completed_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

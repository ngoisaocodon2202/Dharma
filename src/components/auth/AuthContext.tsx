'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DEFAULT_DHARMA_NAME,
  readDeviceAuthCookie,
  writeDeviceAuthCookie,
  type DeviceAuthState,
} from '@/lib/deviceAuthCookie';

export interface User {
  id: string;
  email: string;
  role_id: string;
  full_name: string;
  dharma_name?: string;
  gender?: 'Nam' | 'Nữ' | 'male' | 'female';
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  setDharmaProfile: (dharmaName: string, gender: 'Nam' | 'Nữ' | 'male' | 'female') => void;
  updateUser: (partial: Partial<User>) => void;
  logout: () => Promise<void>;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'phatphap_dharma_profile';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const hydrateFromDevice = () => {
      try {
        const cookieState = readDeviceAuthCookie();
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.dharma_name || parsed.full_name)) {
            setUser(
              cookieState
                ? {
                    ...parsed,
                    full_name: cookieState.dharmaName,
                    dharma_name: cookieState.dharmaName,
                    avatar_url: cookieState.avatarUrl,
                  }
                : parsed
            );
            return;
          }
        }
        if (cookieState) {
          setUser({
            id: `phattu-${cookieState.dharmaName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'dharma'}`,
            email: '',
            role_id: 'PHAT_TU',
            full_name: cookieState.dharmaName,
            dharma_name: cookieState.dharmaName,
            avatar_url: cookieState.avatarUrl,
          });
        }
      } catch (err) {
        console.warn('Không thể đọc hồ sơ Pháp danh:', err);
      } finally {
        setIsLoading(false);
      }
    };

    hydrateFromDevice();

    const handleCookieEvent = (evt: Event) => {
      const detail = (evt as CustomEvent<DeviceAuthState>).detail;
      if (!detail) return;
      setUser((prev) => ({
        id: prev?.id || `phattu-${detail.dharmaName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'dharma'}`,
        email: prev?.email || '',
        role_id: prev?.role_id || 'PHAT_TU',
        gender: prev?.gender,
        full_name: detail.dharmaName,
        dharma_name: detail.dharmaName,
        avatar_url: detail.avatarUrl,
      }));
    };

    window.addEventListener('dharma-device-auth-changed', handleCookieEvent);
    return () => window.removeEventListener('dharma-device-auth-changed', handleCookieEvent);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      writeDeviceAuthCookie({
        dharmaName: userData.dharma_name || userData.full_name || DEFAULT_DHARMA_NAME,
        avatarUrl: userData.avatar_url,
        onboarded: true,
      });
    } catch {}
    setIsAuthModalOpen(false);
  };

  const setDharmaProfile = (dharmaName: string, gender: 'Nam' | 'Nữ' | 'male' | 'female') => {
    const normalizedGender: 'Nam' | 'Nữ' =
      gender === 'female' || gender === 'Nữ' ? 'Nữ' : 'Nam';
    const finalName = dharmaName.trim() || DEFAULT_DHARMA_NAME;
    const userId = `phattu-${finalName.toLowerCase().replace(/\s+/g, '-')}`;
    login({
      id: userId,
      email: '',
      role_id: 'PHAT_TU',
      full_name: finalName,
      dharma_name: finalName,
      gender: normalizedGender,
      avatar_url: user?.avatar_url,
    });
  };

  const updateUser = (partial: Partial<User>) => {
    setUser((prev) => {
      const next = prev ? { ...prev, ...partial } : null;
      if (next) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          writeDeviceAuthCookie({
            dharmaName: next.dharma_name || next.full_name || DEFAULT_DHARMA_NAME,
            avatarUrl: next.avatar_url,
            onboarded: true,
          });
        } catch {}
      }
      return next;
    });
  };

  const logout = async () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    } catch {}
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        setDharmaProfile,
        updateUser,
        logout,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        authModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

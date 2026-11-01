'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Keep warm Buddhist light theme as default
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-charcoal-600 hover:bg-ivory-100 transition-colors"
      title={isDark ? 'Chuyển sang giao diện sáng (Warm Ivory)' : 'Chuyển sang giao diện tối (Warm Charcoal)'}
      aria-label="Đổi giao diện sáng/tối"
    >
      {isDark ? <Sun className="w-4 h-4 text-saffron-400" /> : <Moon className="w-4 h-4 text-charcoal-600" />}
    </button>
  );
}

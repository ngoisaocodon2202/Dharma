'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Lock, Mail, User as UserIcon, Eye, EyeOff, X } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { Button } from '@/components/ui/Button';
import { useAuth } from './AuthContext';

// Floating petal animation element
function Petal({ left, delay, duration }: { left: string; delay: string; duration: string }) {
  return (
    <div
      className="absolute pointer-events-none select-none text-saffron-400/60 dark:text-saffron-500/40 text-sm"
      style={{
        left,
        top: '-5%',
        '--petal-delay': delay,
        '--petal-duration': duration,
        animation: `petalFall ${duration} ${delay} ease-in infinite`,
      } as React.CSSProperties}
    >
      ❁
    </div>
  );
}

const PETALS = [
  { left: '8%',  delay: '0s',   duration: '3s' },
  { left: '22%', delay: '0.7s', duration: '3.8s' },
  { left: '42%', delay: '1.4s', duration: '3.3s' },
  { left: '65%', delay: '0.3s', duration: '4s' },
  { left: '85%', delay: '1.9s', duration: '3.5s' },
  { left: '55%', delay: '2.5s', duration: '3.1s' },
];

function DharmaNameField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || value.length > 0;

  return (
    <div className="relative">
      <label className={`absolute left-10 pointer-events-none font-medium transition-all duration-200 z-10
        ${isFloated
          ? 'top-1 text-[10px] text-saffron-600 dark:text-saffron-400'
          : 'top-1/2 -translate-y-1/2 text-sm text-charcoal-400 dark:text-charcoal-500'
        }`}
      >
        Tâm Nguyện, Vạn Hạnh...
      </label>
      <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none transition-colors duration-200
        ${focused ? 'text-saffron-500' : 'text-charcoal-400'}`}>
        ☸
      </span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={isFloated ? 'Ví dụ: Tâm Nguyện, Vạn Hạnh...' : ''}
        className={`w-full pl-10 pr-4 text-sm bg-ivory-50 dark:bg-charcoal-700/60
          border rounded-xl transition-all duration-200
          text-charcoal-900 dark:text-charcoal-100 placeholder:text-charcoal-300 dark:placeholder:text-charcoal-600
          focus:outline-none
          ${isFloated ? 'pt-5 pb-1.5' : 'py-3'}
          ${focused
            ? 'border-saffron-400 dark:border-saffron-500 ring-2 ring-saffron-400/20 dark:ring-saffron-500/20'
            : 'border-ivory-300 dark:border-charcoal-600 hover:border-ivory-400 dark:hover:border-charcoal-500'
          }`}
      />
    </div>
  );
}

interface InputFieldProps {
  label: string;
  required?: boolean;
  icon: React.ElementType;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minLength?: number;
  showToggle?: boolean;
}

function InputField({
  label, required, icon: Icon, type = 'text',
  value, onChange, placeholder, minLength, showToggle,
}: InputFieldProps) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputType = showToggle ? (visible ? 'text' : 'password') : type;
  const isFloated = focused || value.length > 0;

  return (
    <div className="relative">
      {/* Floating label */}
      <label
        className={`absolute left-10 pointer-events-none font-medium transition-all duration-200 z-10
          ${isFloated
            ? 'top-1 text-[10px] text-saffron-600 dark:text-saffron-400'
            : 'top-1/2 -translate-y-1/2 text-sm text-charcoal-400 dark:text-charcoal-500'
          }`}
      >
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>

      {/* Icon */}
      <Icon className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-200
        ${focused ? 'text-saffron-500' : 'text-charcoal-400'}`}
      />

      {/* Input */}
      <input
        type={inputType}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={isFloated ? placeholder : ''}
        minLength={minLength}
        className={`w-full pl-10 pr-10 text-sm bg-ivory-50 dark:bg-charcoal-700/60
          border rounded-xl transition-all duration-200
          text-charcoal-900 dark:text-charcoal-100 placeholder:text-charcoal-300 dark:placeholder:text-charcoal-600
          focus:outline-none
          ${isFloated ? 'pt-5 pb-1.5' : 'py-3'}
          ${focused
            ? 'border-saffron-400 dark:border-saffron-500 ring-2 ring-saffron-400/20 dark:ring-saffron-500/20'
            : 'border-ivory-300 dark:border-charcoal-600 hover:border-ivory-400 dark:hover:border-charcoal-500'
          }`}
      />

      {/* Password toggle */}
      {showToggle && (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-charcoal-400 hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors"
          aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, openAuthModal, login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dharmaName, setDharmaName] = useState('');

  const dialogRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    if (isAuthModalOpen) {
      setMounted(false);
      const t = setTimeout(() => setMounted(true), 10);
      return () => clearTimeout(t);
    }
  }, [isAuthModalOpen]);

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAuthModal(); };
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isAuthModalOpen, closeAuthModal]);

  const switchMode = (mode: 'login' | 'register') => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setEmail(''); setPassword(''); setFullName(''); setDharmaName('');
    openAuthModal(mode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    try {
      const endpoint = authModalMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = authModalMode === 'login'
        ? { email, password }
        : { email, password, full_name: fullName, dharma_name: dharmaName };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
        return;
      }

      if (authModalMode === 'register') {
        setSuccessMessage('Đã tạo tài khoản thành công! Chào mừng đạo hữu đến với Phật Pháp ☸');
        setTimeout(() => { login(data.user); }, 1200);
      } else {
        login(data.user);
      }

      setEmail(''); setPassword(''); setFullName(''); setDharmaName('');
    } catch {
      setErrorMessage('Không thể kết nối máy chủ. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthModalOpen) return null;

  const isLogin = authModalMode === 'login';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-charcoal-950/70 backdrop-blur-sm transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className={`relative w-full max-w-md max-h-[92vh] flex flex-col bg-white dark:bg-charcoal-900 rounded-3xl shadow-2xl z-30 overflow-hidden
          transition-all duration-300 ease-out
          ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}
      >
        {/* Decorative top band */}
        <div className="relative h-2 flex-shrink-0 bg-gradient-to-r from-saffron-400 via-saffron-500 to-amber-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>

        {/* Petals inside dialog — use CSS animation starting from top of dialog */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{ overflow: 'clip' }}>
          {PETALS.map((p, i) => (
            <Petal key={i} left={p.left} delay={p.delay} duration={p.duration} />
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-xl text-charcoal-400 hover:text-charcoal-700 dark:hover:text-charcoal-100 hover:bg-ivory-100 dark:hover:bg-charcoal-700 transition-all"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-6 pt-6 pb-7 sm:px-8 sm:pt-7 sm:pb-8 space-y-5 overflow-y-auto flex-1">

          {/* Header */}
          <div className="space-y-2 pr-8">
            {/* Mode tabs */}
            <div className="inline-flex rounded-xl bg-ivory-100 dark:bg-charcoal-800 p-1 gap-1">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isLogin
                    ? 'bg-white dark:bg-charcoal-700 text-saffron-700 dark:text-saffron-400 shadow-sm'
                    : 'text-charcoal-500 hover:text-charcoal-700 dark:hover:text-charcoal-300'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  !isLogin
                    ? 'bg-white dark:bg-charcoal-700 text-saffron-700 dark:text-saffron-400 shadow-sm'
                    : 'text-charcoal-500 hover:text-charcoal-700 dark:hover:text-charcoal-300'
                }`}
              >
                Đăng ký
              </button>
            </div>

            <h2 className="font-heading text-2xl font-bold text-charcoal-900 dark:text-charcoal-50">
              {isLogin ? 'Hoan nghênh trở lại' : 'Gia nhập Phật Pháp'}
            </h2>
            <p className="text-sm text-charcoal-500 dark:text-charcoal-400 leading-relaxed">
              {isLogin
                ? 'Chào mừng quý đạo hữu quay về không gian tu học an lành ☸'
                : 'Cùng học Phật pháp, thực hành chánh niệm và kết nối cộng đồng.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Error */}
            {errorMessage && (
              <div className="flex items-start gap-2.5 p-3.5 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800/60 animate-in fade-in slide-in-from-top-1 duration-200">
                <span className="mt-0.5 flex-shrink-0">⚠</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success */}
            {successMessage && (
              <div className="flex items-start gap-2.5 p-3.5 text-xs text-jade-700 dark:text-jade-300 bg-jade-50 dark:bg-jade-950/40 rounded-xl border border-jade-200 dark:border-jade-800/60 animate-in fade-in slide-in-from-top-1 duration-200">
                <BuddhaBodhiIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-jade-600 dark:text-jade-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Register fields */}
            {!isLogin && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <InputField
                  label="Họ và Tên"
                  required
                  icon={UserIcon}
                  value={fullName}
                  onChange={setFullName}
                  placeholder="Nguyễn Văn An"
                />
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-charcoal-700 dark:text-charcoal-300 tracking-wide">
                    Pháp danh
                    <span className="ml-1.5 text-[10px] font-normal text-charcoal-400 normal-case">(nếu đã quy y Tam Bảo)</span>
                  </label>
                  <DharmaNameField value={dharmaName} onChange={setDharmaName} />
                </div>
              </div>
            )}

            <InputField
              label="Địa chỉ Email"
              required
              icon={Mail}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="daohu@example.com"
            />

            <InputField
              label="Mật khẩu"
              required
              icon={Lock}
              showToggle
              value={password}
              onChange={setPassword}
              placeholder="Tối thiểu 6 ký tự"
              minLength={6}
            />

            {/* Submit */}
            <div className="pt-1">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full text-sm font-semibold tracking-wide"
                isLoading={isSubmitting}
              >
                {isLogin ? '☸ Đăng nhập Tu học' : '✦ Hoàn tất Đăng ký'}
              </Button>
            </div>
          </form>

          {/* Divider quote */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ivory-200 dark:border-charcoal-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white dark:bg-charcoal-900 text-[11px] text-charcoal-400 dark:text-charcoal-500 italic">
                Nhất tâm quy y Phật, Pháp, Tăng
              </span>
            </div>
          </div>

          {/* Switch mode */}
          <p className="text-center text-xs text-charcoal-500 dark:text-charcoal-400">
            {isLogin ? (
              <>Chưa có tài khoản Phật tử?{' '}
                <button type="button" onClick={() => switchMode('register')}
                  className="text-saffron-600 dark:text-saffron-400 font-semibold hover:underline underline-offset-2">
                  Đăng ký ngay
                </button>
              </>
            ) : (
              <>Đã có tài khoản?{' '}
                <button type="button" onClick={() => switchMode('login')}
                  className="text-saffron-600 dark:text-saffron-400 font-semibold hover:underline underline-offset-2">
                  Đăng nhập
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

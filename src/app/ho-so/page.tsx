'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import {
  Camera, Save, User, Mail, MapPin, BookOpen,
  Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CustomSelect } from '@/components/ui/CustomSelect';

interface Profile {
  full_name: string;
  dharma_name?: string;
  avatar_url?: string;
  cover_url?: string;
  bio?: string;
  province?: string;
  is_public: boolean;
  email: string;
  created_at: string;
}

const PROVINCES = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Huế', 'Hải Phòng',
  'Cần Thơ', 'Bình Dương', 'Đồng Nai', 'An Giang', 'Bà Rịa - Vũng Tàu',
  'Bắc Giang', 'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Phước',
  'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
  'Điện Biên', 'Đồng Tháp', 'Gia Lai', 'Hà Giang', 'Hà Nam',
  'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình', 'Hưng Yên',
  'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lạng Sơn',
  'Lào Cai', 'Lâm Đồng', 'Long An', 'Nam Định', 'Nghệ An',
  'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình',
  'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng',
  'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa',
  'Tiền Giang', 'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc',
  'Yên Bái',
];

const ROLE_LABELS: Record<string, string> = {
  USER: 'Phật tử',
  MEMBER: 'Thành viên',
  CONTRIBUTOR: 'Cộng tác viên',
  EDITOR: 'Biên tập viên',
  SENIOR_EDITOR: 'Biên tập cao cấp',
  MODERATOR: 'Điều phối viên',
  ADMIN: 'Quản trị viên',
  SUPER_ADMIN: 'Quản trị tối cao',
};

export default function ProfilePage() {
  const { user, openAuthModal, updateUser } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'privacy'>('info');

  // Form state
  const [fullName, setFullName] = useState('');
  const [dharmaName, setDharmaName] = useState('');
  const [bio, setBio] = useState('');
  const [province, setProvince] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    fetch('/api/profile')
      .then(r => r.json())
      .then(d => {
        const p = d.profile;
        if (p) {
          setProfile(p);
          setFullName(p.full_name || '');
          setDharmaName(p.dharma_name || '');
          setBio(p.bio || '');
          setProvince(p.province || '');
          setIsPublic(p.is_public ?? true);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user, openAuthModal]);

  const handleImageUpload = useCallback(async (
    file: File,
    type: 'avatar' | 'cover'
  ) => {
    if (!file.type.startsWith('image/')) {
      setSaveStatus('error');
      setSaveMessage('Chỉ chấp nhận file ảnh');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setSaveStatus('error');
      setSaveMessage('Ảnh quá lớn, tối đa 10MB');
      return;
    }

    if (type === 'avatar') setIsUploadingAvatar(true);
    else setIsUploadingCover(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;

      // Resize image client-side for fast and optimal web display
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const maxSize = type === 'avatar' ? 400 : 1200;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const resized = canvas.toDataURL('image/jpeg', 0.88);

        try {
          const res = await fetch('/api/profile/avatar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data_url: resized, type }),
          });
          if (res.ok) {
            const data = await res.json();
            const savedUrl = data.url || resized;
            setProfile(prev => prev ? { ...prev, [type === 'avatar' ? 'avatar_url' : 'cover_url']: savedUrl } : prev);
            // Update auth context user avatar
            if (type === 'avatar') {
              updateUser({ avatar_url: savedUrl });
            }
            setSaveStatus('success');
            setSaveMessage(type === 'avatar' ? 'Ảnh đại diện đã được lưu thành công!' : 'Ảnh bìa đã được lưu thành công!');
            setTimeout(() => setSaveStatus('idle'), 3000);
          } else {
            const d = await res.json();
            setSaveStatus('error');
            setSaveMessage(d.error || 'Không thể lưu ảnh');
          }
        } catch {
          setSaveStatus('error');
          setSaveMessage('Không thể tải ảnh lên. Vui lòng thử lại.');
        } finally {
          if (type === 'avatar') setIsUploadingAvatar(false);
          else setIsUploadingCover(false);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, [user, updateUser]);

  const handleSave = async () => {
    if (!fullName.trim() || fullName.trim().length < 2) {
      setSaveStatus('error');
      setSaveMessage('Họ tên phải có ít nhất 2 ký tự');
      return;
    }
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          dharma_name: dharmaName.trim() || null,
          bio: bio.trim() || null,
          province: province || null,
          is_public: isPublic,
          avatar_url: profile?.avatar_url,
          cover_url: profile?.cover_url,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(prev => prev ? { ...prev, ...data.profile } : prev);
        updateUser({ full_name: fullName.trim(), dharma_name: dharmaName.trim() || undefined });
        setSaveStatus('success');
        setSaveMessage('Đã lưu thông tin thành công!');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        setSaveMessage(data.error || 'Có lỗi xảy ra');
      }
    } catch {
      setSaveStatus('error');
      setSaveMessage('Không thể kết nối máy chủ');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-saffron-500" />
      </div>
    );
  }

  const avatarUrl = profile?.avatar_url;
  const coverUrl = profile?.cover_url;
  const initials = (profile?.full_name || user.full_name || '?').charAt(0).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-12 sm:pb-16 space-y-6">

      {/* Cover + Avatar */}
      <div className="relative mb-12 sm:mb-14">
        {/* Cover image container */}
        <div className="relative rounded-2xl overflow-hidden shadow-sm">
          <div
            className="h-36 sm:h-48 bg-gradient-to-br from-saffron-200 via-saffron-300 to-amber-300 dark:from-saffron-900/40 dark:via-saffron-800/30 dark:to-amber-900/20 relative group cursor-pointer"
            onClick={() => coverInputRef.current?.click()}
          >
            {coverUrl && (
              <img src={coverUrl} alt="Ảnh bìa" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-charcoal-900/0 group-hover:bg-charcoal-900/30 transition-all duration-200">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-white text-sm font-medium bg-charcoal-900/50 px-3 py-1.5 rounded-lg">
                {isUploadingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                {isUploadingCover ? 'Đang tải...' : 'Đổi ảnh bìa'}
              </div>
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'cover')}
            />
          </div>

          {/* Role badge */}
          <div className="absolute right-3 sm:right-4 bottom-3 flex items-center gap-1.5">
            <span className="text-[11px] font-semibold px-2.5 py-1 bg-white/90 dark:bg-charcoal-800/90 text-saffron-700 dark:text-saffron-400 rounded-full border border-saffron-200 dark:border-saffron-800 shadow-sm">
              {ROLE_LABELS[user.role_id] || user.role_id}
            </span>
          </div>
        </div>

        {/* Avatar - placed outside cover's overflow-hidden */}
        <div className="absolute left-4 sm:left-8 -bottom-10 sm:-bottom-12 z-10">
          <div
            className="relative group cursor-pointer"
            onClick={() => avatarInputRef.current?.click()}
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white dark:border-charcoal-900 bg-saffron-200 dark:bg-saffron-800 flex items-center justify-center text-2xl sm:text-3xl font-bold text-saffron-800 dark:text-saffron-200 overflow-hidden shadow-lg">
              {avatarUrl ? (
                <img src={avatarUrl} alt={profile?.full_name} className="w-full h-full object-cover" />
              ) : initials}
            </div>
            <div className="absolute inset-0 rounded-full flex items-center justify-center bg-charcoal-900/0 group-hover:bg-charcoal-900/50 transition-all duration-200 border-4 border-transparent">
              {isUploadingAvatar
                ? <Loader2 className="w-5 h-5 text-white animate-spin opacity-0 group-hover:opacity-100" />
                : <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              }
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'avatar')}
            />
          </div>
        </div>
      </div>

      {/* Name row */}
      <div className="pt-1 px-1 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="font-heading text-2xl font-bold text-charcoal-900 dark:text-charcoal-50">
            {profile?.full_name || user.full_name}
          </h1>
          {profile?.dharma_name && (
            <p className="text-sm text-saffron-600 dark:text-saffron-400 mt-0.5 flex items-center gap-1">
              <span>☸</span> PD: {profile.dharma_name}
            </p>
          )}
          <p className="text-xs text-charcoal-400 mt-1 flex items-center gap-1">
            <Mail className="w-3 h-3" /> {user.email}
          </p>
        </div>
        {profile?.is_public ? (
          <span className="flex items-center gap-1 text-[11px] text-jade-600 dark:text-jade-400 font-medium">
            <Eye className="w-3.5 h-3.5" /> Hồ sơ công khai
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] text-charcoal-400 font-medium">
            <EyeOff className="w-3.5 h-3.5" /> Hồ sơ riêng tư
          </span>
        )}
      </div>

      {/* Save status toast */}
      {saveStatus !== 'idle' && (
        <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium border animate-in fade-in slide-in-from-top-2 duration-200 ${
          saveStatus === 'success'
            ? 'bg-jade-50 dark:bg-jade-950/40 text-jade-700 dark:text-jade-300 border-jade-200 dark:border-jade-800'
            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
        }`}>
          {saveStatus === 'success'
            ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0" />
          }
          {saveMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-charcoal-800 rounded-2xl border border-ivory-200 dark:border-charcoal-700 overflow-hidden shadow-sm">
        <div className="flex border-b border-ivory-200 dark:border-charcoal-700">
          {[
            { key: 'info', label: 'Thông tin cá nhân', icon: User },
            { key: 'privacy', label: 'Quyền riêng tư', icon: Shield },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? 'border-saffron-500 text-saffron-700 dark:text-saffron-400'
                  : 'border-transparent text-charcoal-500 hover:text-charcoal-700 dark:hover:text-charcoal-300'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-5">
          {activeTab === 'info' && (
            <>
              {/* Full name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-charcoal-700 dark:text-charcoal-300">
                  Họ và Tên <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Họ và tên của bạn"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-ivory-50 dark:bg-charcoal-700/60 border border-ivory-300 dark:border-charcoal-600 rounded-xl focus:outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/20 text-charcoal-900 dark:text-charcoal-100 transition-all"
                  />
                </div>
              </div>

              {/* Dharma name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-charcoal-700 dark:text-charcoal-300">
                  Pháp danh
                  <span className="ml-1.5 text-[10px] font-normal text-charcoal-400">(nếu đã quy y Tam Bảo)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none">☸</span>
                  <input
                    type="text"
                    value={dharmaName}
                    onChange={e => setDharmaName(e.target.value)}
                    placeholder="Ví dụ: Tâm Nguyện, Vạn Hạnh..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-ivory-50 dark:bg-charcoal-700/60 border border-ivory-300 dark:border-charcoal-600 rounded-xl focus:outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/20 text-charcoal-900 dark:text-charcoal-100 transition-all"
                  />
                </div>
              </div>

              {/* Province */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-charcoal-700 dark:text-charcoal-300">
                  Tỉnh / Thành phố
                </label>
                <CustomSelect
                  value={province}
                  onChange={setProvince}
                  options={PROVINCES}
                  placeholder="-- Chọn tỉnh/thành --"
                  icon={<MapPin className="w-4 h-4" />}
                  searchable
                  searchPlaceholder="Tìm tỉnh, thành phố..."
                />
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-charcoal-700 dark:text-charcoal-300">
                  Giới thiệu bản thân
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-3 w-4 h-4 text-charcoal-400 pointer-events-none" />
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={4}
                    maxLength={500}
                    placeholder="Chia sẻ đôi điều về hành trình tu học của bạn..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-ivory-50 dark:bg-charcoal-700/60 border border-ivory-300 dark:border-charcoal-600 rounded-xl focus:outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/20 text-charcoal-900 dark:text-charcoal-100 transition-all resize-none"
                  />
                  <span className="absolute bottom-2.5 right-3 text-[10px] text-charcoal-400">
                    {bio.length}/500
                  </span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-ivory-50 dark:bg-charcoal-700/50 rounded-xl border border-ivory-200 dark:border-charcoal-700">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-charcoal-900 dark:text-charcoal-100">Hồ sơ công khai</p>
                  <p className="text-xs text-charcoal-500 leading-relaxed">
                    Khi bật, mọi người có thể xem hồ sơ, bài viết và hoạt động của bạn trên cộng đồng Phật Pháp.
                  </p>
                </div>
                <button
                  onClick={() => setIsPublic(v => !v)}
                  className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                    isPublic ? 'bg-saffron-500' : 'bg-charcoal-300 dark:bg-charcoal-600'
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                    isPublic ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="p-4 bg-ivory-50 dark:bg-charcoal-700/50 rounded-xl border border-ivory-200 dark:border-charcoal-700 space-y-2">
                <p className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-300">Email đăng nhập</p>
                <p className="text-sm text-charcoal-600 dark:text-charcoal-400 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-charcoal-400" />
                  {user.email}
                  <span className="text-[10px] text-charcoal-400">(không thể thay đổi)</span>
                </p>
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              isLoading={isSaving}
              className="gap-2 min-w-[140px]"
            >
              <Save className="w-4 h-4" />
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

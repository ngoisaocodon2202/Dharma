'use client';

import React, { useState, useEffect } from 'react';
import { Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';

interface Group {
  id: string;
  name: string;
  description: string;
  privacy: string;
  member_count: number;
  is_member: number;
}

const GROUP_AVATARS: Record<string, string> = {
  g1: '/group-g1.png',
};

const PRIVACY_LABELS: Record<string, string> = {
  public: 'Công khai',
  moderated: 'Kiểm duyệt thành viên',
  private: 'Riêng tư',
};

export function CommunityGroups() {
  const { user, openAuthModal } = useAuth();
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/community/groups')
      .then(r => r.json())
      .then(d => setGroups(d.groups || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user]);

  const handleJoin = async (groupId: string) => {
    if (!user) { openAuthModal('login'); return; }
    setLoading(groupId);
    try {
      const res = await fetch(`/api/community/groups/${groupId}/join`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setGroups(prev => prev.map(g =>
          g.id === groupId
            ? { ...g, is_member: data.joined ? 1 : 0, member_count: g.member_count + (data.joined ? 1 : -1) }
            : g
        ));
      }
    } catch {}
    finally { setLoading(null); }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-charcoal-800 rounded-2xl border border-ivory-200 dark:border-charcoal-700 p-6 h-52 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {groups.map((group) => {
        const isMember = group.is_member === 1;
        return (
          <div
            key={group.id}
            className="bg-white dark:bg-charcoal-800 rounded-2xl border border-ivory-200 dark:border-charcoal-700 p-4 sm:p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              {/* Group avatar */}
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-saffron-100 dark:bg-saffron-900/40 shadow-sm">
                {GROUP_AVATARS[group.id]
                  ? <img src={GROUP_AVATARS[group.id]} alt={group.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-2xl">🪷</div>
                }
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-saffron-50 dark:bg-saffron-950/40 text-saffron-700 dark:text-saffron-300 rounded font-semibold">
                {PRIVACY_LABELS[group.privacy] || group.privacy}
              </span>
              <h3 className="font-heading text-lg font-bold text-charcoal-900 dark:text-charcoal-100">
                {group.name}
              </h3>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed">
                {group.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-ivory-100 dark:border-charcoal-700 flex items-center justify-between gap-2">
              <span className="text-xs text-charcoal-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {group.member_count} thành viên
              </span>

              {isMember ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleJoin(group.id)}
                    disabled={loading === group.id}
                    className="text-[11px] text-charcoal-400 hover:text-rose-500 transition-colors"
                  >
                    Rời nhóm
                  </button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => router.push(`/cong-dong/${group.id}`)}
                    className="gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Mở nhóm
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleJoin(group.id)}
                  isLoading={loading === group.id}
                >
                  Tham gia nhóm
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

import React from 'react';
import { Users } from 'lucide-react';
import { CommunityGroups } from '@/components/community/CommunityGroups';

export default function CommunityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="space-y-3 border-b border-ivory-200 dark:border-charcoal-800 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs text-saffron-700 dark:text-saffron-400 font-semibold uppercase tracking-wider">
          <Users className="w-4 h-4" />
          <span>Lữ Khách Đồng Tu</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-charcoal-50">
          Cộng Đồng Tu Học
        </h1>
        <p className="text-sm text-charcoal-600 dark:text-charcoal-400 max-w-2xl leading-relaxed">
          Nơi gặp gỡ, trao đổi và đồng hành của những người con Phật trên con đường hướng thiện và tinh tấn.
        </p>
      </div>

      <CommunityGroups />
    </div>
  );
}

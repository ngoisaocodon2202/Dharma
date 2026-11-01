import React from 'react';
import { query } from '@/lib/db';
import { Building, CheckCircle, Globe, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default async function OrganizationsPage() {
  const res = await query('SELECT * FROM organizations ORDER BY is_verified DESC, created_at ASC');
  const orgs = res.rows;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="space-y-3 border-b border-ivory-200 dark:border-charcoal-800 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs text-jade-700 dark:text-jade-400 font-semibold uppercase tracking-wider">
          <Building className="w-4 h-4" />
          <span>Tự Viện & Tổ Chức Chính Thống</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-charcoal-50">
          Trang Chính Thức Của Tự Viện & Tổ Chức
        </h1>
        <p className="text-sm text-charcoal-600 dark:text-charcoal-400 max-w-2xl leading-relaxed">
          Tất cả các tổ chức, tự viện trên trang này đều phải trải qua quy trình thẩm định danh tính và cấp phép xác minh minh bạch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orgs.map((org: any) => (
          <div
            key={org.id}
            className="p-6 bg-white dark:bg-charcoal-800 rounded-2xl border border-ivory-200 dark:border-charcoal-700 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-saffron-50 dark:bg-saffron-950/40 border border-saffron-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {org.logo_url ? (
                    <img src={org.logo_url} alt={org.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building className="w-7 h-7 text-saffron-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading text-lg font-bold text-charcoal-900 dark:text-charcoal-100">
                      {org.name}
                    </h3>
                    <CheckCircle className="w-4 h-4 text-jade-600 flex-shrink-0" />
                  </div>
                  <span className="text-[11px] text-jade-700 dark:text-jade-400 font-medium">
                    Tổ chức đã được Ban Quản trị xác thực
                  </span>
                </div>
              </div>

              <p className="text-xs text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
                {org.description}
              </p>

              <div className="space-y-1.5 text-xs text-charcoal-500 pt-2 border-t border-ivory-100 dark:border-charcoal-700">
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-lotus-500" /> {org.address}
                </p>
                {org.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-jade-500" /> {org.phone}
                  </p>
                )}
                {org.website && (
                  <p className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-saffron-500" />
                    <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-saffron-600 hover:underline">
                      {org.website}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

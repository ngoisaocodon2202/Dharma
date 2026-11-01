import React from 'react';
import { query } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { RSVPButton } from '@/components/events/RSVPButton';

export const revalidate = 60;

export default async function EventsPage() {
  const res = await query(`
    SELECT e.id, e.title, e.slug, e.description, e.cover_image,
           e.start_date, e.end_date, e.location, e.is_online, e.max_attendees,
           t.name as temple_name,
           (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id) as attendee_count
    FROM events e
    LEFT JOIN temples t ON e.temple_id = t.id
    ORDER BY e.start_date ASC
  `);
  const events = res.rows;

  const now = new Date();
  const upcoming = events.filter((e: any) => new Date(e.start_date) >= now);
  const past = events.filter((e: any) => new Date(e.start_date) < now);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* Header */}
      <div className="space-y-3 border-b border-ivory-200 dark:border-charcoal-800 pb-6 animate-fade-in-up">
        <div className="inline-flex items-center gap-1.5 text-xs text-lotus-700 dark:text-lotus-400 font-semibold uppercase tracking-wider">
          <Calendar className="w-4 h-4 animate-pulse-glow" />
          <span>Thời Khóa Tu Học</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-charcoal-50">
          Sự Kiện & Khóa Tu
        </h1>
        <p className="text-sm text-charcoal-600 dark:text-charcoal-400 max-w-2xl leading-relaxed">
          Lịch trình các khóa tu mùa hè, khóa tu một ngày an lạc, ngày vía Phật và các ngày lễ trọng đại trong năm.
        </p>
      </div>

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <section className="space-y-5">
          <h2 className="font-heading text-lg font-bold text-charcoal-900 dark:text-charcoal-100">
            Sắp diễn ra
          </h2>
          <ScrollReveal delayMs={80}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcoming.map((ev: any) => (
                <EventCard key={ev.id} ev={ev} isPast={false} />
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* Past Events */}
      {past.length > 0 && (
        <section className="space-y-5">
          <h2 className="font-heading text-lg font-semibold text-charcoal-500 dark:text-charcoal-400">
            Đã diễn ra
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {past.map((ev: any) => (
              <EventCard key={ev.id} ev={ev} isPast={true} />
            ))}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <div className="text-center py-20 text-charcoal-400 space-y-2">
          <Calendar className="w-10 h-10 mx-auto opacity-30" />
          <p className="text-sm">Chưa có sự kiện nào được lên lịch.</p>
        </div>
      )}
    </div>
  );
}

function EventCard({ ev, isPast }: { ev: any; isPast: boolean }) {
  const attendeeCount = parseInt(ev.attendee_count || '0', 10);

  return (
    <div className={`bg-white dark:bg-charcoal-800 rounded-2xl border border-ivory-200 dark:border-charcoal-700 overflow-hidden shadow-sm transition-all ${isPast ? 'opacity-70' : 'hover-lift'}`}>
      {ev.cover_image && (
        <div className="aspect-[16/7] overflow-hidden bg-ivory-100">
          <img
            src={ev.cover_image}
            alt={ev.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={ev.is_online ? 'jade' : 'lotus'} size="sm">
            {ev.is_online ? 'Trực tuyến' : 'Trực tiếp'}
          </Badge>
          {isPast && <Badge variant="neutral" size="sm">Đã kết thúc</Badge>}
        </div>

        <h3 className="font-heading text-lg font-bold text-charcoal-900 dark:text-charcoal-100 leading-snug">
          {ev.title}
        </h3>

        <p className="text-xs text-charcoal-600 dark:text-charcoal-400 line-clamp-2 leading-relaxed">
          {ev.description}
        </p>

        <div className="space-y-1.5 text-xs text-charcoal-500 dark:text-charcoal-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-lotus-500 flex-shrink-0" />
            <span>{formatDate(ev.start_date)}{ev.end_date && ` – ${formatDate(ev.end_date)}`}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-charcoal-400 flex-shrink-0" />
            <span>{ev.location}</span>
          </div>
          {ev.temple_name && (
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 text-center text-saffron-500 text-[10px] flex-shrink-0">☸</span>
              <span>{ev.temple_name}</span>
            </div>
          )}
          {ev.max_attendees && (
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-jade-500 flex-shrink-0" />
              <span>{attendeeCount}/{ev.max_attendees} đã đăng ký</span>
            </div>
          )}
        </div>

        {!isPast && (
          <div className="pt-2 border-t border-ivory-100 dark:border-charcoal-700">
            <RSVPButton
              eventSlug={ev.slug}
              maxAttendees={ev.max_attendees}
              currentCount={attendeeCount}
              className="w-full justify-center"
            />
          </div>
        )}
      </div>
    </div>
  );
}

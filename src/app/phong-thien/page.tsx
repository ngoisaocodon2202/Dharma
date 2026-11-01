import React from 'react';
import { Wind, BookOpen } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { FullMeditationRoom } from '@/components/meditation/FullMeditationRoom';

export const metadata = {
  title: 'Phòng Thiền Trực Tuyến — Phật Pháp',
  description: 'Không gian tĩnh lặng tọa thiền chánh niệm, buông xả căng thẳng cùng âm thanh thiên nhiên an lành.',
};

export default function MeditationRoomPage() {
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-32 sm:pb-16 space-y-5 sm:space-y-8">

      {/* Header */}
      <div className="text-center space-y-2 sm:space-y-3 animate-fade-in-up">
        <div className="inline-flex items-center gap-1.5 text-xs text-jade-700 dark:text-jade-400 font-semibold uppercase tracking-wider">
          <Wind className="w-4 h-4 animate-pulse-glow" />
          <span>Thiền Môn Tĩnh Lặng</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-charcoal-900 dark:text-charcoal-50 leading-tight">
          Phòng Thiền Trực Tuyến
        </h1>
        <p className="text-xs sm:text-base text-charcoal-600 dark:text-charcoal-300 max-w-xl mx-auto leading-relaxed">
          &ldquo;Thở vào tâm tĩnh lặng, thở ra miệng mỉm cười. An trú trong hiện tại, giờ phút đẹp tuyệt vời.&rdquo;
        </p>
      </div>

      {/* Full meditation room component */}
      <div className="animate-fade-in delay-100">
        <FullMeditationRoom />
      </div>

      {/* Preparation tips */}
      <div className="p-4 sm:p-6 bg-white dark:bg-charcoal-800 rounded-2xl border border-ivory-200 dark:border-charcoal-700 space-y-4 hover-lift">
        <h3 className="font-heading text-base sm:text-lg font-bold text-charcoal-900 dark:text-charcoal-100 flex items-center gap-2">
          <BuddhaBodhiIcon className="w-5 h-5 sm:w-6 sm:h-6 text-saffron-500 animate-pulse-glow flex-shrink-0" /> Ba bước chuẩn bị thời thiền
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-xs text-charcoal-700 dark:text-charcoal-300">
          {[
            { title: '1. Tư thế vững chãi', body: 'Ngồi trên bồ đoàn hoặc ghế thẳng lưng, hai vai thả lỏng tự nhiên, cằm hơi thu nhẹ.' },
            { title: '2. Theo dõi hơi thở', body: 'Không cố gắng điều khiển hơi thở, chỉ nhận biết hơi thở vào là vào, hơi thở ra là ra.' },
            { title: '3. Buông bỏ suy nghĩ', body: 'Khi có ý niệm khởi lên, mỉm cười nhận diện rồi nhẹ nhàng quay về với hơi thở.' },
          ].map(step => (
            <div key={step.title} className="p-3.5 sm:p-4 bg-ivory-50 dark:bg-charcoal-700/50 rounded-xl space-y-1">
              <h4 className="font-bold text-charcoal-900 dark:text-charcoal-100">{step.title}</h4>
              <p className="leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Teaching quote */}
      <div className="p-4 sm:p-6 bg-gradient-to-br from-jade-50 to-saffron-50/40 dark:from-charcoal-800 dark:to-charcoal-800 rounded-2xl border border-jade-200/60 dark:border-charcoal-700">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-jade-600 dark:text-jade-400 flex-shrink-0 mt-0.5" />
          <div>
            <blockquote className="font-heading text-sm sm:text-base italic text-charcoal-800 dark:text-charcoal-200 leading-relaxed">
              &ldquo;Thiền không phải là trốn thoát thực tại, mà là gặp gỡ thực tại một cách sâu sắc hơn, bình thản hơn và từ bi hơn.&rdquo;
            </blockquote>
            <p className="text-xs text-jade-600 dark:text-jade-400 font-medium mt-2">— Thiền học Phật giáo</p>
          </div>
        </div>
      </div>
    </div>
  );
}

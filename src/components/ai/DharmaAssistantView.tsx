'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Trash2,
  BookOpen,
  Wind,
  Heart,
  Compass,
  HelpCircle,
  Calendar,
} from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { useAuth } from '@/components/auth/AuthContext';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

const SUGGESTED_QUESTIONS = [
  {
    category: 'Giáo Lý Cốt Lõi',
    text: 'Tứ Diệu Đế và Bát Chánh Đạo ứng dụng vào đời sống hằng ngày như thế nào?',
  },
  {
    category: 'Thiền & Tâm Lý',
    text: 'Làm sao để giữ tâm bình an, bớt lo âu và thực hành thiền hơi thở mỗi ngày?',
  },
  {
    category: 'Nghi Lễ & Báo Hiếu',
    text: 'Cúng giỗ gia tiên và hồi hướng công đức như thế nào cho đúng Chánh pháp?',
  },
  {
    category: 'Ăn Chay & Giới Luật',
    text: 'Ý nghĩa của việc ăn chay ngày Mùng 1, ngày Rằm và giữ Năm giới của người Phật tử?',
  },
  {
    category: 'Lịch Sử Phật Giáo',
    text: 'Đạo Phật xuất xứ từ đâu và lịch sử truyền vào Việt Nam như thế nào?',
  },
  {
    category: 'Nhân Quả & Vận Mệnh',
    text: 'Hiểu đúng về luật Nhân Quả, màu bản mệnh và ngày tốt theo tinh thần Phật giáo?',
  },
];

const CHAT_STORAGE_KEY = 'phatphap_ai_chat_history';

export function DharmaAssistantView() {
  const { user, openAuthModal } = useAuth();
  const { lang } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch {}

    // Initial welcome message
    setMessages([
      {
        id: 'welcome-msg',
        role: 'assistant',
        content:
          'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật 🙏\n\nMến chào quý đạo hữu! Tôi là **Trợ lý Phật Pháp AI (@phatphap.ai)** — luôn sẵn sàng lắng nghe và giải đáp mọi câu hỏi về **Giáo lý Phật đà, Lịch sử Phật giáo, Kinh kệ, Thiền định, Nghi thức cúng giỗ, Ăn chay** hay những trăn trở trong cuộc sống.\n\nĐạo hữu có thể chọn nhanh một câu hỏi gợi ý bên dưới hoặc nhập câu hỏi của mình nhé!',
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const saveHistory = (next: ChatMessage[]) => {
    setMessages(next);
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(next.slice(-30)));
    } catch {}
  };

  const handleSend = async (customQuestion?: string) => {
    const questionText = (customQuestion ?? input).trim();
    if (!questionText || isLoading) return;

    if (!customQuestion) setInput('');

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: questionText,
      createdAt: new Date().toISOString(),
    };

    const updated = [...messages, userMsg];
    saveHistory(updated);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: questionText,
          dharmaName: user?.dharma_name || user?.full_name || '',
          lang,
        }),
      });

      const data = await res.json();
      const replyContent =
        data?.assistantMessage?.content ||
        data?.answer ||
        'Nam Mô A Di Đà Phật 🙏 Xin đạo hữu hoan hỷ thử lại trong giây lát.';

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        createdAt: new Date().toISOString(),
      };

      saveHistory([...updated, botMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content:
          'Nam Mô A Di Đà Phật 🙏 Đường truyền đang tạm gián đoạn, xin đạo hữu gửi lại câu hỏi nhé.',
        createdAt: new Date().toISOString(),
      };
      saveHistory([...updated, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    const initial: ChatMessage[] = [
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content:
          'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật 🙏 Đã làm mới cuộc trò chuyện. Xin mời đạo hữu đặt câu hỏi mới!',
        createdAt: new Date().toISOString(),
      },
    ];
    saveHistory(initial);
  };

  return (
    <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* 1. Header Card */}
      <div className="bg-gradient-to-br from-charcoal-950 via-stone-900 to-amber-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-saffron-600 p-0.5 shadow-lg shrink-0 flex items-center justify-center">
            <div className="w-full h-full rounded-[14px] bg-charcoal-950 flex items-center justify-center">
              <BuddhaBodhiIcon className="w-7 h-7 text-amber-400 animate-pulse-glow" />
            </div>
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold uppercase whitespace-nowrap">
                ● Trực Tuyến 24/7
              </span>
              <span className="text-[11px] text-amber-300 font-semibold whitespace-nowrap">
                @phatphap.ai
              </span>
            </div>
            <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-amber-50 leading-tight">
              AI Hỗ Trợ Hỏi Đáp Phật Pháp
            </h1>
            <p className="text-xs text-stone-300 leading-relaxed">
              Giải đáp giáo lý, kinh kệ, lịch sử Phật giáo, nghi thức cúng giỗ và lắng nghe chia sẻ tâm tư bằng tuệ giác Từ Bi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => openAuthModal()}
              className="border-amber-400/40 text-amber-200 hover:bg-white/10 text-xs whitespace-nowrap"
            >
              ☸ Nhập Pháp Danh
            </Button>
          )}
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer"
            title="Xóa lịch sử trò chuyện"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Suggested Questions Grid */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400 block px-1 whitespace-nowrap">
          ✦ Chủ Đề Hỏi Nhanh Dành Cho Đạo Hữu:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q.text)}
              disabled={isLoading}
              className="p-3 rounded-2xl bg-white dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 hover:border-saffron-400 dark:hover:border-saffron-600 text-left transition-all shadow-2xs group cursor-pointer flex flex-col justify-between h-full"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400 block mb-1 whitespace-nowrap">
                {q.category}
              </span>
              <p className="text-xs font-medium text-charcoal-800 dark:text-charcoal-200 group-hover:text-saffron-700 dark:group-hover:text-saffron-300 line-clamp-2 leading-snug">
                {q.text}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Chat Conversation Window */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl border border-ivory-200 dark:border-charcoal-700 shadow-md overflow-hidden flex flex-col h-[480px] sm:h-[540px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={cn('flex items-start gap-3', isBot ? 'justify-start' : 'justify-end')}
              >
                {isBot && (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-br from-amber-500 to-saffron-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <BuddhaBodhiIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                )}

                <div
                  className={cn(
                    'max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line',
                    isBot
                      ? 'bg-ivory-50 dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-700 text-charcoal-800 dark:text-charcoal-100'
                      : 'bg-gradient-to-r from-saffron-600 to-amber-600 text-white font-medium shadow-xs'
                  )}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-amber-500 to-saffron-600 text-white flex items-center justify-center shrink-0">
                <BuddhaBodhiIcon className="w-4 h-4 animate-spin" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-ivory-50 dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-700 text-xs text-charcoal-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-saffron-500 animate-bounce" />
                <span>Trợ lý Phật Pháp đang quán chiếu câu trả lời...</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Form Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-ivory-50/90 dark:bg-charcoal-900 border-t border-ivory-200 dark:border-charcoal-700 flex items-center gap-2.5"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi về Phật Pháp, kinh kệ, thiền định, ngày giỗ..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-600 text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-400/20"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 rounded-2xl shrink-0 whitespace-nowrap"
          >
            <Send className="w-4 h-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Gửi câu hỏi</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

export default DharmaAssistantView;



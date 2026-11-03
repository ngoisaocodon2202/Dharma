"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Maximize2,
  MessageCircleQuestion,
} from "lucide-react";

interface QuickMsg {
  id: string;
  sender: "ai" | "user";
  text: string;
}

const QUICK_QUESTIONS = [
  "Làm sao để tâm bình an khi lo âu?",
  "Tứ Diệu Đế và Bát Chánh Đạo là gì?",
  "Cách hành thiền hơi thở 10 phút?",
  "Ý nghĩa ăn chay ngày Rằm & Mùng 1?",
];

export default function FloatingDharmaAI() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<QuickMsg[]>([
    {
      id: "init",
      sender: "ai",
      text: "Nam Mô Bổn Sư Thích Ca Mâu Ni Phật 🙏\nQuý Phật tử cần giải đáp thắc mắc gì về Giáo lý, Kinh điển, Thiền tập hay Lịch Phật giáo hôm nay?",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  // Hide floating widget on the dedicated AI page to avoid duplicate UI
  if (pathname === "/hoi-dap-ai" || pathname?.startsWith("/cong-dong")) {
    return null;
  }

  const sendQuestion = async (qText?: string) => {
    const query = (qText ?? input).trim();
    if (!query || loading) return;

    const userMsg: QuickMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!qText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-4).map((m) => ({
            sender: m.sender === "ai" ? "Trợ Lý Phật Pháp AI" : "Phật tử",
            text: m.text,
          })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: "ai",
          text:
            data.reply ||
            "A Di Đà Phật, xin quý đạo hữu thử hỏi lại trong giây lát.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "ai",
          text: "A Di Đà Phật, kết nối đang gián đoạn nhẹ. Quý vị vui lòng thử lại nhé.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Mở AI Hỏi Đáp Phật Pháp"
          className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#800000] via-[#6b140b] to-[#4a0e0e] text-[#ffd966] border border-[#d4af37]/60 shadow-[0_8px_28px_rgba(128,0,0,0.4)] hover:scale-105 transition-all group"
        >
          <span className="w-7 h-7 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center text-sm shrink-0">
            🪷
          </span>
          <span className="text-xs font-bold tracking-wide whitespace-nowrap pr-0.5">
            AI Phật Pháp
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#ffd966] shrink-0 animate-pulse" />
        </button>
      )}

      {/* Chat Popup Window */}
      {open && (
        <div className="fixed bottom-20 lg:bottom-6 right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[380px] max-h-[75vh] bg-white rounded-2xl border-2 border-[#d4af37]/60 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3d1f0d] via-[#5c1616] to-[#3d1f0d] px-4 py-3 text-white flex items-center justify-between border-b border-[#d4af37]/40 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-base shrink-0">
                🪷
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-[#ffd966] truncate">
                  Trợ Lý AI Phật Pháp
                </h4>
                <p className="text-[10px] text-[#e6c875]/80 truncate">
                  Giải đáp Giáo lý • Kinh điển • Thiền tập
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Link
                href="/hoi-dap-ai"
                onClick={() => setOpen(false)}
                title="Mở toàn màn hình"
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setOpen(false)}
                title="Đóng"
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#fdfbf7] max-h-[340px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line ${
                    m.sender === "user"
                      ? "bg-[#800000] text-white rounded-tr-xs"
                      : "bg-white text-stone-800 border border-[#e6dfd3] rounded-tl-xs shadow-xs"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-stone-500 bg-white border border-[#e6dfd3] rounded-xl px-3 py-2 w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#b5892e]" />
                <span>Đang tra cứu kinh điển...</span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick suggestions */}
          <div className="px-3 py-2 bg-[#f8f3e9] border-t border-[#e8dcc8] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendQuestion(q)}
                disabled={loading}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-[#fff9ec] border border-[#d4af37]/40 text-[11px] font-medium text-[#5c3a21] whitespace-nowrap shrink-0 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendQuestion();
            }}
            className="p-2.5 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Đặt câu hỏi về Phật Pháp..."
              className="flex-1 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#b5892e]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-[#800000] hover:bg-[#600000] disabled:opacity-40 text-[#ffd966] transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}


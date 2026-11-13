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

  // Hide floating widget on dedicated AI page or sanctuary to avoid overlapping controls
  if (
    pathname === "/hoi-dap-ai" ||
    pathname?.startsWith("/cong-dong") ||
    pathname === "/cau-nguyen" ||
    pathname === "/di-chua" ||
    pathname === "/di-chua-online"
  ) {
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
      {/* Floating Button: Compact Circle by default, expands horizontally on hover */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Mở AI Hỏi Đáp Phật Pháp"
          title="AI Phật Pháp — Hỏi đáp 24/7"
          className="fixed bottom-20 lg:bottom-6 right-3.5 lg:right-6 z-40 h-11 max-w-[44px] hover:max-w-[185px] rounded-full bg-gradient-to-r from-[#FFFDF8] via-[#FFF6DF] to-[#FCECC2] text-[#8C5500] border-2 border-[#C68B19] shadow-lg flex items-center p-1.5 transition-all duration-300 ease-out overflow-hidden group cursor-pointer"
        >
          <span className="w-7 h-7 rounded-full bg-[#FFFFFF] border border-[#DFC27D] flex items-center justify-center text-sm shrink-0 shadow-2xs">
            🪷
          </span>
          <span className="text-xs font-bold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 pl-2 pr-2.5 transition-opacity duration-200">
            AI Phật Pháp
          </span>
        </button>
      )}

      {/* Chat Popup Window */}
      {open && (
        <div className="fixed bottom-20 lg:bottom-6 right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[380px] max-h-[75dvh] sm:max-h-[75vh] dharma-input-panel-lock bg-white rounded-2xl border-2 border-[#C68B19] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FFFDF8] via-[#FFF9EB] to-[#FCECC2] px-4 py-3 text-[#2C1E10] flex items-center justify-between border-b border-[#EAD7A7] shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#DFC27D] flex items-center justify-center text-base shrink-0">
                🪷
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-[#2C1E10] truncate">
                  Trợ Lý AI Phật Pháp
                </h4>
                <p className="text-[10px] text-[#6B533B] truncate">
                  Giải đáp Giáo lý • Kinh điển • Thiền tập
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Link
                href="/hoi-dap-ai"
                onClick={() => setOpen(false)}
                title="Mở toàn màn hình"
                className="p-1.5 rounded-lg text-[#6B533B] hover:text-[#2C1E10] hover:bg-[#FFF6DF] transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setOpen(false)}
                title="Đóng"
                className="p-1.5 rounded-lg text-[#6B533B] hover:text-[#2C1E10] hover:bg-[#FFF6DF] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#FAF7F0] max-h-[340px]">
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
                      ? "bg-[#8C5500] text-white rounded-tr-xs"
                      : "bg-[#FFFFFF] text-[#2C1E10] border border-[#EAD7A7] rounded-tl-xs shadow-2xs"
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
              className="flex-1 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-base sm:text-sm text-stone-800 focus:outline-none focus:border-[#b5892e]"
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


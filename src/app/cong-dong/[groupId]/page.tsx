'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { Send, ArrowLeft, Users, Loader2, MessageCircle, X, Sparkles } from 'lucide-react';
import { BuddhaBodhiIcon } from '@/components/icons/BuddhaBodhiIcon';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  full_name: string;
  dharma_name?: string;
  avatar_url?: string;
  is_ai?: boolean;
}

const GROUP_NAMES: Record<string, string> = {
  g1: 'Nhóm Thiền Tập & Chánh Niệm Mỗi Ngày',
  g2: 'Phật Tử Tại Gia — Học Giáo Lý Căn Bản',
  g3: 'Thiện Nguyện Ánh Từ Bi',
};

const GROUP_AVATARS: Record<string, string> = {
  g1: '/group-g1.png',
};

// Detect @phatphap.ai mention
const AI_TRIGGER = /^@phatphap\.ai\s+/i;

export default function GroupChatPage() {
  const { user, isLoading: authLoading, openAuthModal } = useAuth();
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/community/groups/${groupId}/messages`);
      if (res.status === 401) { openAuthModal('login'); return; }
      if (res.status === 403) { router.push('/cong-dong'); return; }
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch {}
  }, [groupId, router, openAuthModal]);

  useEffect(() => {
    if (authLoading) return; // chờ AuthContext restore session từ cookie
    if (!user) { openAuthModal('login'); return; }
    fetchMessages().finally(() => setIsLoading(false));
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [authLoading, user, fetchMessages, openAuthModal]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiThinking]);

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus();
  }, [isLoading]);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || isSending) return;

    // Check if it's an AI question
    if (AI_TRIGGER.test(content)) {
      const question = content.replace(AI_TRIGGER, '').trim();
      if (!question) {
        setError('Vui lòng nhập câu hỏi sau @phatphap.ai');
        return;
      }
      await sendAiMessage(content, question);
      return;
    }

    setIsSending(true);
    setError('');
    try {
      const res = await fetch(`/api/community/groups/${groupId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data.message]);
        setInput('');
        resetTextarea();
      } else {
        const d = await res.json();
        setError(d.error || 'Không thể gửi tin nhắn');
      }
    } catch {
      setError('Lỗi kết nối');
    } finally {
      setIsSending(false);
    }
  };

  const sendAiMessage = async (originalInput: string, question: string) => {
    setIsSending(true);
    setIsAiThinking(true);
    setError('');
    setInput('');
    resetTextarea();

    // Add user's message optimistically
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      content: originalInput,
      created_at: new Date().toISOString(),
      user_id: user!.id,
      full_name: user!.full_name,
      dharma_name: user!.dharma_name,
      avatar_url: user!.avatar_url,
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const res = await fetch('/api/community/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, groupId }),
      });
      if (res.ok) {
        const data = await res.json();
        // Refresh all messages to get real IDs
        await fetchMessages();
      } else {
        const d = await res.json();
        setError(d.error || 'AI không thể trả lời lúc này');
        setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id));
      }
    } catch {
      setError('Lỗi kết nối AI');
      setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id));
    } finally {
      setIsSending(false);
      setIsAiThinking(false);
    }
  };

  const resetTextarea = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleAtKey = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let val = e.target.value;
    // Gõ @ ở đầu dòng trống → auto replace thành "@phatphap.ai "
    if (val === '@') {
      val = '@phatphap.ai ';
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(val.length, val.length);
        }
      }, 0);
    }
    setInput(val);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const handleInsertAiMention = () => {
    if (!input.includes('@phatphap.ai')) {
      const val = '@phatphap.ai ' + input.trim();
      setInput(val);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(val.length, val.length);
        }
      }, 0);
    }
  };

  const handleCancelAiMention = () => {
    setInput(input.replace(AI_TRIGGER, '').trim());
  };

  const isAiInput = AI_TRIGGER.test(input.trim()) || input.startsWith('@phatphap');

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  // Check if message is AI response
  const isAiMessage = (msg: Message) =>
    msg.content.startsWith('🤖 **@phatphap.ai**');

  // Group by date
  const grouped: { date: string; msgs: Message[] }[] = [];
  for (const msg of messages) {
    const date = formatDate(msg.created_at);
    const last = grouped[grouped.length - 1];
    if (last && last.date === date) last.msgs.push(msg);
    else grouped.push({ date, msgs: [msg] });
  }

  if (!user) return null;

  return (
    <div className="flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden bg-ivory-50 dark:bg-charcoal-900">

      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 h-14 bg-white dark:bg-charcoal-800 border-b border-ivory-200 dark:border-charcoal-700 shadow-sm flex-shrink-0 z-10">
        <button
          onClick={() => router.push('/cong-dong')}
          className="p-2 -ml-1 rounded-xl hover:bg-ivory-100 dark:hover:bg-charcoal-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-charcoal-500" />
        </button>
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 shadow-sm bg-saffron-100">
          {GROUP_AVATARS[groupId]
            ? <img src={GROUP_AVATARS[groupId]} alt="Nhóm" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-saffron-200 to-saffron-300 dark:from-saffron-800 dark:to-saffron-900 flex items-center justify-center"><Users className="w-4 h-4 text-saffron-700 dark:text-saffron-300" /></div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-charcoal-900 dark:text-charcoal-100 truncate leading-tight">
            {GROUP_NAMES[groupId] || 'Nhóm chat'}
          </p>
          <p className="text-[11px] text-jade-500 dark:text-jade-400 font-medium">● Đang hoạt động</p>
        </div>
        {/* AI hint */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-saffron-50 dark:bg-saffron-950/40 rounded-lg border border-saffron-200 dark:border-saffron-800">
          <BuddhaBodhiIcon className="w-3.5 h-3.5 text-saffron-500" />
          <span className="text-[11px] text-saffron-700 dark:text-saffron-400 font-medium">@phatphap.ai</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-saffron-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-12">
            <div className="w-16 h-16 rounded-full bg-saffron-100 dark:bg-saffron-900/40 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-saffron-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-charcoal-700 dark:text-charcoal-300">Chưa có tin nhắn nào</p>
              <p className="text-xs text-charcoal-400 mt-1">Hãy là người đầu tiên chia sẻ!</p>
            </div>
            <div className="mt-2 px-4 py-3 bg-saffron-50 dark:bg-saffron-950/30 rounded-xl border border-saffron-200 dark:border-saffron-800 text-xs text-saffron-700 dark:text-saffron-400 max-w-xs">
              <BuddhaBodhiIcon className="w-4 h-4 inline mr-1 text-saffron-600 dark:text-saffron-400" />
              Gõ <strong>@phatphap.ai [câu hỏi]</strong> để hỏi AI về Phật Pháp
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-1">
            {grouped.map(({ date, msgs }) => (
              <div key={date}>
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-ivory-300 dark:bg-charcoal-700" />
                  <span className="text-[11px] text-charcoal-400 font-medium">{date}</span>
                  <div className="flex-1 h-px bg-ivory-300 dark:bg-charcoal-700" />
                </div>

                {msgs.map((msg, i) => {
                  const isAI = isAiMessage(msg);
                  const isMe = !isAI && msg.user_id === user.id;
                  const prevMsg = i > 0 ? msgs[i - 1] : null;
                  const nextMsg = i < msgs.length - 1 ? msgs[i + 1] : null;
                  const showAvatar = !isMe && (!nextMsg || nextMsg.user_id !== msg.user_id);
                  const showName = !isMe && (!prevMsg || prevMsg.user_id !== msg.user_id);
                  const isFirst = !prevMsg || prevMsg.user_id !== msg.user_id;
                  const isLast = !nextMsg || nextMsg.user_id !== msg.user_id;
                  const displayName = isAI ? '🤖 phatphap.ai' : (msg.dharma_name || msg.full_name);
                  const initials = (msg.full_name || '?').charAt(0).toUpperCase();

                  const bubbleRadius = isMe
                    ? `rounded-2xl ${isFirst ? 'rounded-tr-sm' : ''} ${isLast ? 'rounded-br-sm' : ''}`
                    : `rounded-2xl ${isFirst ? 'rounded-tl-sm' : ''} ${isLast ? 'rounded-bl-sm' : ''}`;

                  // Parse AI message content for display
                  const displayContent = isAI
                    ? msg.content.replace(/^🤖 \*\*@phatphap\.ai\*\* trả lời câu hỏi của [^\n]+:\n\n\*"[^"]+"\*\n\n---\n\n/, '')
                    : msg.content;

                  const aiQuestion = isAI
                    ? msg.content.match(/\*"([^"]+)"\*/)?.[1]
                    : null;

                  return (
                    <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''} ${isLast ? 'mb-3' : 'mb-0.5'}`}>
                      {!isMe && (
                        <div className="w-8 h-8 flex-shrink-0">
                          {showAvatar && (
                            isAI ? (
                              <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm flex-shrink-0">
                                <img src="/ai-logo.png" alt="AI Phật Pháp" className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-saffron-200 dark:bg-saffron-800 flex items-center justify-center text-xs font-bold text-saffron-800 dark:text-saffron-200 overflow-hidden shadow-sm">
                                {msg.avatar_url
                                  ? <img src={msg.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                                  : initials}
                              </div>
                            )
                          )}
                        </div>
                      )}

                      <div className={`max-w-[70%] sm:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        {showName && (
                          <span className={`text-[11px] mb-1 ml-1 ${isAI ? 'text-saffron-600 dark:text-saffron-400 font-semibold' : 'text-charcoal-400'}`}>
                            {displayName}
                          </span>
                        )}

                        {/* AI bubble — special styling */}
                        {isAI ? (
                          <div className="bg-gradient-to-br from-saffron-50 to-amber-50 dark:from-saffron-950/40 dark:to-amber-950/30 border border-saffron-200 dark:border-saffron-800 rounded-2xl rounded-tl-sm shadow-sm px-4 py-3 space-y-2 max-w-full">
                            {aiQuestion && (
                              <p className="text-[11px] text-saffron-600 dark:text-saffron-400 italic border-l-2 border-saffron-300 pl-2">
                                "{aiQuestion}"
                              </p>
                            )}
                            <p className="text-sm text-charcoal-800 dark:text-charcoal-200 leading-relaxed whitespace-pre-wrap">
                              {displayContent}
                            </p>
                          </div>
                        ) : (
                          <div className={`px-3.5 py-2 text-sm leading-relaxed break-words ${bubbleRadius} ${
                            isMe
                              ? 'bg-saffron-500 text-white'
                              : 'bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-charcoal-100 border border-ivory-200 dark:border-charcoal-700 shadow-sm'
                          }`}>
                            {msg.content}
                          </div>
                        )}

                        {isLast && (
                          <span className="text-[10px] text-charcoal-400 mt-1 px-1">{formatTime(msg.created_at)}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* AI thinking indicator */}
            {isAiThinking && (
              <div className="flex items-end gap-2 mb-3">
                <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm flex-shrink-0">
                  <img src="/ai-logo.png" alt="AI Phật Pháp" className="w-full h-full object-cover" />
                </div>
                <div className="bg-saffron-50 dark:bg-saffron-950/40 border border-saffron-200 dark:border-saffron-800 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-saffron-600 dark:text-saffron-400">phatphap.ai đang suy nghĩ</span>
                    <span className="flex gap-0.5">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 bg-saffron-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 bg-white/95 dark:bg-charcoal-800/95 backdrop-blur-md border-t border-ivory-200 dark:border-charcoal-700 px-3 sm:px-4 py-2 sm:py-3 pb-[max(0.6rem,env(safe-area-inset-bottom,0.6rem))] shadow-[0_-2px_12px_rgba(0,0,0,0.03)] z-20">
        <div className="max-w-2xl mx-auto space-y-1.5">
          {/* AI hint bar */}
          {isAiInput && (
            <div className="flex items-center justify-between gap-1.5 text-xs text-saffron-800 dark:text-saffron-300 bg-saffron-50 dark:bg-saffron-950/60 px-3 py-1.5 rounded-xl border border-saffron-300/80 dark:border-saffron-700/80 animate-fade-in">
              <div className="flex items-center gap-1.5 truncate">
                <BuddhaBodhiIcon className="w-3.5 h-3.5 flex-shrink-0 text-saffron-600 dark:text-saffron-400" />
                <span className="font-medium truncate text-[11px] sm:text-xs">Đang ở chế độ hỏi AI Phật Pháp</span>
              </div>
              <button
                type="button"
                onClick={handleCancelAiMention}
                className="text-[11px] font-semibold text-charcoal-500 hover:text-charcoal-800 dark:text-charcoal-400 dark:hover:text-charcoal-100 px-1.5 py-0.5 rounded hover:bg-black/5 transition-colors shrink-0 flex items-center gap-0.5"
              >
                <X className="w-3 h-3" />
                <span>Hủy</span>
              </button>
            </div>
          )}

          {error && <p className="text-xs text-rose-500 px-1">{error}</p>}

          <div className="flex items-end gap-1.5 sm:gap-2">
            {/* Quick @AI button if not already in AI mode */}
            {!isAiInput && (
              <button
                type="button"
                onClick={handleInsertAiMention}
                className="h-10 px-2 sm:px-2.5 rounded-2xl border border-saffron-200 dark:border-saffron-800/80 bg-saffron-50/80 hover:bg-saffron-100 dark:bg-saffron-950/40 text-saffron-700 dark:text-saffron-300 flex items-center gap-1 text-xs font-semibold shrink-0 transition-all active:scale-95 shadow-2xs"
                title="Gõ nhanh @phatphap.ai để hỏi AI"
              >
                <BuddhaBodhiIcon className="w-3.5 h-3.5 text-saffron-600" />
                <span className="text-[11px] sm:text-xs font-medium">Hỏi AI</span>
              </button>
            )}

            {/* Textarea */}
            <div className="flex-1 relative flex items-center min-w-0">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleAtKey}
                onKeyDown={handleKeyDown}
                placeholder={isAiInput ? "Nhập câu hỏi giáo lý..." : "Nhập tin nhắn..."}
                rows={1}
                maxLength={1000}
                className={cn(
                  "w-full resize-none px-3.5 py-2.5 text-xs sm:text-sm border rounded-2xl focus:outline-none focus:ring-2 transition-all leading-normal text-charcoal-900 dark:text-charcoal-100 no-scrollbar placeholder:text-charcoal-400 dark:placeholder:text-charcoal-500",
                  isAiInput
                    ? "bg-saffron-50/50 dark:bg-saffron-950/20 border-saffron-300 dark:border-saffron-700 focus:border-saffron-500 focus:ring-saffron-400/20"
                    : "bg-ivory-50 dark:bg-charcoal-700/60 border-ivory-300 dark:border-charcoal-600 focus:border-saffron-400 focus:ring-saffron-400/20"
                )}
                style={{ minHeight: '40px', maxHeight: '110px' }}
              />
            </div>

            {/* Send button */}
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isSending || isAiThinking}
              className={cn(
                "w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center transition-all active:scale-95 shadow-xs",
                !input.trim() || isSending || isAiThinking
                  ? "bg-black/10 dark:bg-white/10 text-charcoal-400 dark:text-charcoal-500 cursor-not-allowed"
                  : isAiInput
                    ? "bg-gradient-to-br from-saffron-500 to-amber-600 hover:from-saffron-600 hover:to-amber-700 text-white shadow-saffron-500/20"
                    : "bg-saffron-600 hover:bg-saffron-700 text-white shadow-saffron-600/20"
              )}
              aria-label="Gửi tin nhắn"
            >
              {isSending || isAiThinking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isAiInput ? (
                <BuddhaBodhiIcon className="w-4 h-4 text-white" />
              ) : (
                <Send className="w-4 h-4 ml-0.5" />
              )}
            </button>
          </div>

          {/* Show counter only when typing long text */}
          {input.length > 500 && (
            <p className="text-[10px] text-charcoal-400 text-right pr-1">
              {input.length}/1000
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

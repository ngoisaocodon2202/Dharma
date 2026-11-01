'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { Send, X, Users, Loader2, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  full_name: string;
  dharma_name?: string;
  avatar_url?: string;
}

interface Group {
  id: string;
  name: string;
}

interface GroupChatPanelProps {
  group: Group;
  onClose: () => void;
}

export function GroupChatPanel({ group, onClose }: GroupChatPanelProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/community/groups/${group.id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch {}
  }, [group.id]);

  useEffect(() => {
    fetchMessages().finally(() => setIsLoading(false));
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || isSending) return;
    setIsSending(true);
    setError('');
    try {
      const res = await fetch(`/api/community/groups/${group.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data.message]);
        setInput('');
        inputRef.current?.focus();
      } else {
        const d = await res.json();
        setError(d.error || 'Không thể gửi');
      }
    } catch {
      setError('Lỗi kết nối');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  // Group by date
  const grouped: { date: string; msgs: Message[] }[] = [];
  for (const msg of messages) {
    const date = formatDate(msg.created_at);
    const last = grouped[grouped.length - 1];
    if (last && last.date === date) last.msgs.push(msg);
    else grouped.push({ date, msgs: [msg] });
  }

  return (
    <>
      {/* Backdrop (mobile) */}
      <div
        className="fixed inset-0 bg-charcoal-900/40 z-40 sm:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:right-4 sm:bottom-4 sm:w-[380px] h-[85vh] sm:h-[560px] z-50 flex flex-col bg-white dark:bg-charcoal-800 sm:rounded-2xl rounded-t-2xl shadow-2xl border border-ivory-200 dark:border-charcoal-700 animate-in slide-in-from-bottom duration-300">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-ivory-200 dark:border-charcoal-700 flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-saffron-100 dark:bg-saffron-900/40 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-saffron-600 dark:text-saffron-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-charcoal-900 dark:text-charcoal-100 truncate leading-tight">
              {group.name}
            </p>
            <p className="text-[11px] text-charcoal-400">Nhóm cộng đồng</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-ivory-100 dark:hover:bg-charcoal-700 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-charcoal-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-ivory-50/60 dark:bg-charcoal-900/40">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-5 h-5 animate-spin text-saffron-500" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2 py-8">
              <MessageCircle className="w-10 h-10 text-ivory-300 dark:text-charcoal-600" />
              <p className="text-sm font-medium text-charcoal-500">Chưa có tin nhắn nào</p>
              <p className="text-xs text-charcoal-400">Hãy là người đầu tiên chia sẻ!</p>
            </div>
          ) : (
            grouped.map(({ date, msgs }) => (
              <div key={date}>
                {/* Date divider */}
                <div className="flex items-center gap-2 my-3">
                  <div className="flex-1 h-px bg-ivory-300 dark:bg-charcoal-700" />
                  <span className="text-[10px] text-charcoal-400 font-medium">{date}</span>
                  <div className="flex-1 h-px bg-ivory-300 dark:bg-charcoal-700" />
                </div>

                <div className="space-y-2">
                  {msgs.map((msg, i) => {
                    const isMe = msg.user_id === user?.id;
                    const prevMsg = i > 0 ? msgs[i - 1] : null;
                    const showMeta = !prevMsg || prevMsg.user_id !== msg.user_id;
                    const displayName = msg.dharma_name || msg.full_name;
                    const initials = (msg.full_name || '?').charAt(0).toUpperCase();

                    return (
                      <div key={msg.id} className={`flex items-end gap-1.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        {!isMe && (
                          <div className="w-6 h-6 flex-shrink-0 self-end mb-4">
                            {showMeta && (
                              <div className="w-6 h-6 rounded-full bg-saffron-200 dark:bg-saffron-800 flex items-center justify-center text-[10px] font-bold text-saffron-800 dark:text-saffron-200 overflow-hidden">
                                {msg.avatar_url
                                  ? <img src={msg.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                                  : initials}
                              </div>
                            )}
                          </div>
                        )}

                        <div className={`max-w-[75%] flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
                          {showMeta && !isMe && (
                            <span className="text-[10px] text-charcoal-400 ml-1">{displayName}</span>
                          )}
                          <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                            isMe
                              ? 'bg-saffron-500 text-white rounded-br-sm'
                              : 'bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-charcoal-100 border border-ivory-200 dark:border-charcoal-700 rounded-bl-sm shadow-sm'
                          }`}>
                            {msg.content}
                          </div>
                          <span className="text-[10px] text-charcoal-400 px-1">{formatTime(msg.created_at)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-3 border-t border-ivory-200 dark:border-charcoal-700 flex-shrink-0">
          {error && <p className="text-xs text-rose-500 mb-1.5">{error}</p>}
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn... (Enter gửi)"
              rows={1}
              maxLength={1000}
              className="flex-1 resize-none px-3 py-2 text-sm bg-ivory-50 dark:bg-charcoal-700/60 border border-ivory-300 dark:border-charcoal-600 rounded-xl focus:outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/20 text-charcoal-900 dark:text-charcoal-100 transition-all overflow-hidden"
              style={{ maxHeight: '100px' }}
              onInput={e => {
                const t = e.currentTarget;
                t.style.height = 'auto';
                t.style.height = Math.min(t.scrollHeight, 100) + 'px';
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isSending}
              className="flex-shrink-0 w-9 h-9 rounded-full bg-saffron-500 hover:bg-saffron-600 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all active:scale-95"
            >
              {isSending
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Send className="w-3.5 h-3.5 ml-0.5" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

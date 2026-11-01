'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Reply, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';
import { formatDate } from '@/lib/utils';

interface Comment {
  id: string;
  content: string;
  parent_id: string | null;
  likes_count: number;
  created_at: string;
  full_name: string;
  dharma_name?: string;
  avatar_url?: string;
  replies: Comment[];
}

interface Props {
  articleSlug: string;
  initialComments?: Comment[];
}

function Avatar({ name, url }: { name: string; url?: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-saffron-100 dark:bg-saffron-900 flex items-center justify-center text-xs font-semibold text-saffron-700 flex-shrink-0 overflow-hidden">
      {url ? (
        <img src={url} alt={name} className="w-full h-full object-cover" />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </div>
  );
}

function CommentItem({
  comment,
  articleSlug,
  onReplyAdded,
  depth = 0,
}: {
  comment: Comment;
  articleSlug: string;
  onReplyAdded: (parentId: string, reply: Comment) => void;
  depth?: number;
}) {
  const { user, openAuthModal } = useAuth();
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [likes, setLikes] = useState(comment.likes_count);
  const [showReplies, setShowReplies] = useState(true);

  const displayName = comment.dharma_name
    ? `Thầy ${comment.dharma_name}`
    : comment.full_name;

  const handleLike = async () => {
    if (!user) { openAuthModal(); return; }
    try {
      const res = await fetch(
        `/api/articles/${articleSlug}/comments/${comment.id}/like`,
        { method: 'POST' }
      );
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes_count);
      }
    } catch {}
  };

  const handleReply = async () => {
    if (!user) { openAuthModal(); return; }
    const text = replyText.trim();
    if (!text) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/articles/${articleSlug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, parent_id: comment.id }),
      });
      if (res.ok) {
        const data = await res.json();
        onReplyAdded(comment.id, data.comment);
        setReplyText('');
        setShowReplyBox(false);
        setShowReplies(true);
      }
    } catch {}
    setIsSending(false);
  };

  return (
    <div className={depth > 0 ? 'ml-8 mt-3' : ''}>
      <div className="flex gap-3">
        <Avatar name={comment.full_name} url={comment.avatar_url} />
        <div className="flex-1 space-y-1.5">
          <div className="bg-ivory-50 dark:bg-charcoal-700/50 rounded-xl px-4 py-3 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-charcoal-900 dark:text-charcoal-100">
                {displayName}
              </span>
              <span className="text-[10px] text-charcoal-400">
                {formatDate(comment.created_at)}
              </span>
            </div>
            <p className="text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>

          <div className="flex items-center gap-3 px-1">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-[11px] text-charcoal-400 hover:text-lotus-500 transition-colors"
            >
              <Heart className="w-3.5 h-3.5" /> {likes > 0 && likes}
            </button>
            {depth === 0 && (
              <button
                onClick={() => {
                  if (!user) { openAuthModal(); return; }
                  setShowReplyBox(v => !v);
                }}
                className="flex items-center gap-1 text-[11px] text-charcoal-400 hover:text-saffron-600 transition-colors"
              >
                <Reply className="w-3.5 h-3.5" /> Trả lời
              </button>
            )}
            {comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies(v => !v)}
                className="flex items-center gap-1 text-[11px] text-charcoal-400 hover:text-saffron-600 transition-colors ml-auto"
              >
                {showReplies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {comment.replies.length} trả lời
              </button>
            )}
          </div>

          {/* Reply input */}
          {showReplyBox && (
            <div className="flex gap-2 mt-2">
              <textarea
                rows={2}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder={`Trả lời ${displayName}...`}
                className="flex-1 p-2.5 text-sm bg-white dark:bg-charcoal-700 border border-ivory-200 dark:border-charcoal-600 rounded-lg focus:outline-none focus:border-saffron-500 text-charcoal-900 dark:text-charcoal-100 resize-none"
              />
              <button
                onClick={handleReply}
                disabled={isSending || !replyText.trim()}
                className="self-end p-2 rounded-lg bg-saffron-500 text-white disabled:opacity-50 hover:bg-saffron-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {showReplies && comment.replies.map(reply => (
        <CommentItem
          key={reply.id}
          comment={reply}
          articleSlug={articleSlug}
          onReplyAdded={onReplyAdded}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

export function CommentSection({ articleSlug, initialComments = [] }: Props) {
  const { user, openAuthModal } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(initialComments.length === 0);

  useEffect(() => {
    if (initialComments.length > 0) return;
    fetch(`/api/articles/${articleSlug}/comments`)
      .then(r => r.json())
      .then(d => setComments(d.comments || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [articleSlug, initialComments.length]);

  const handleSubmit = async () => {
    if (!user) { openAuthModal(); return; }
    const content = text.trim();
    if (!content) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/articles/${articleSlug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments(prev => [data.comment, ...prev]);
        setText('');
      }
    } catch {}
    setIsSending(false);
  };

  const handleReplyAdded = (parentId: string, reply: Comment) => {
    setComments(prev =>
      prev.map(c =>
        c.id === parentId ? { ...c, replies: [...c.replies, reply] } : c
      )
    );
  };

  const total = comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);

  return (
    <div className="space-y-6 pt-10 border-t border-ivory-200 dark:border-charcoal-800">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-xl font-bold text-charcoal-900 dark:text-charcoal-100 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-saffron-500" />
          Thảo luận & Chia sẻ
          {total > 0 && (
            <span className="text-sm font-normal text-charcoal-500">({total})</span>
          )}
        </h3>
        <span className="text-xs text-charcoal-400 hidden sm:block">
          Pháp đàm hòa hợp, tôn trọng
        </span>
      </div>

      {/* New comment box */}
      <div className="flex gap-3">
        <Avatar
          name={user?.full_name || '?'}
          url={user?.avatar_url}
        />
        <div className="flex-1 space-y-2">
          <textarea
            rows={3}
            value={text}
            onChange={e => setText(e.target.value)}
            onClick={() => { if (!user) openAuthModal(); }}
            placeholder={
              user
                ? 'Chia sẻ cảm nghĩ hoặc thắc mắc của quý đạo hữu...'
                : 'Đăng nhập để tham gia thảo luận...'
            }
            className="w-full p-3 text-sm bg-white dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 rounded-xl focus:outline-none focus:border-saffron-500 text-charcoal-900 dark:text-charcoal-100 resize-none"
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="primary"
              isLoading={isSending}
              disabled={!text.trim()}
              onClick={handleSubmit}
            >
              <Send className="w-3.5 h-3.5" /> Gửi bình luận
            </Button>
          </div>
        </div>
      </div>

      {/* Comment list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-ivory-200 dark:bg-charcoal-700 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 rounded bg-ivory-200 dark:bg-charcoal-700" />
                <div className="h-12 rounded-xl bg-ivory-100 dark:bg-charcoal-700/50" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-charcoal-500 text-center py-6">
          Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nghĩ.
        </p>
      ) : (
        <div className="space-y-5">
          {comments.map(c => (
            <CommentItem
              key={c.id}
              comment={c}
              articleSlug={articleSlug}
              onReplyAdded={handleReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

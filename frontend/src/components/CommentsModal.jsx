import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2 } from 'lucide-react';
import { fetchComments, addComment } from '../services/backendStubs';
import defaultPng from '../avatars/default.png';
import { getAvatarUrl } from '../data/avatars';

export function CommentsModal({ post, isOpen, onClose, currentUser }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!isOpen || !post) return;
    setComments([]);
    setIsLoading(true);
    fetchComments(post.id)
      .then((data) => setComments(data))
      .catch(() => setComments([]))
      .finally(() => setIsLoading(false));
  }, [isOpen, post?.id]);

  if (!isOpen || !post) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSending) return;
    setIsSending(true);
    try {
      const saved = await addComment(post.id, newComment.trim());
      // Append optimistically using the response from backend
      setComments((prev) => [...prev, saved]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment', err);
    } finally {
      setIsSending(false);
    }
  };

  const formatCommentAuthor = (c) => {
    if (c.isAnonymous) return 'Anonymous';
    return c.author?.fullName || c.author?.username || c.user || 'Unknown';
  };

  const formatCommentTime = (c) => {
    if (!c.createdAt) return c.time || '';
    const diff = Math.floor((Date.now() - new Date(c.createdAt).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-[#2b1d16] border border-[#3d2a20] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3d2a20] pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#f47b31]" />
            <h3 className="text-sm font-extrabold text-white">
              Comments {comments.length > 0 ? `(${comments.length})` : ''}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Snippet Summary */}
        <div className="bg-[#231711] p-3 rounded-2xl border border-[#3d2a20] text-xs text-stone-300 shrink-0">
          <span className="font-extrabold text-[#f47b31]">{post.author?.name}</span>: "{post.title || post.question || post.content}"
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-[#f47b31] animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <div className="py-8 text-center text-stone-400 text-xs">No comments yet. Be the first!</div>
          ) : (
            comments.map((c, idx) => (
              <div key={c._id || c.id || idx} className="flex items-start gap-3 bg-[#231711] p-3 rounded-2xl border border-[#3d2a20]">
                <img
                  src={getAvatarUrl(c.author?.avatar || c.avatar)}
                  alt={formatCommentAuthor(c)}
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#f47b31]/30 mt-0.5 cursor-pointer"
                  onClick={() => !c.isAnonymous && onNavigateProfile && onNavigateProfile(c.author?._id || c.author?.id)}
                />
                <div className="flex-1 min-w-0 space-y-0.5 text-left">
                  <div 
                    className="flex items-center justify-between gap-2 mb-0.5 cursor-pointer"
                    onClick={() => !c.isAnonymous && onNavigateProfile && onNavigateProfile(c.author?._id || c.author?.id)}
                  >
                    <span className="text-xs font-extrabold text-white truncate">{formatCommentAuthor(c)}</span>
                    <span className="text-[10px] text-stone-400 font-medium whitespace-nowrap">
                      {formatCommentTime(c)}{c.isEdited ? ' • Edited' : ''}
                    </span>
                  </div>
                  <p className="text-xs text-stone-200 leading-relaxed">{c.content || c.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input at Bottom */}
        <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-[#3d2a20] shrink-0">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            required
            className="flex-1 bg-[#1c120c] border border-[#3d2a20] rounded-full px-4 py-2.5 text-xs text-white placeholder-stone-400 focus:border-[#f47b31] focus:outline-hidden transition"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || isSending}
            className="w-9 h-9 bg-[#f47b31] hover:bg-[#e0661c] disabled:opacity-40 text-white rounded-full flex items-center justify-center shadow-md transition shrink-0 cursor-pointer"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}

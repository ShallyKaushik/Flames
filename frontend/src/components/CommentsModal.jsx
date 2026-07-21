import React, { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { openComments } from '../services/backendStubs';
import defaultPng from '../avatars/default.png';
import avatar4 from '../avatars/avatar4.png';
import avatar6 from '../avatars/avatar6.png';
import avatar7 from '../avatars/avatar7.png';

export function CommentsModal({ post, isOpen, onClose }) {
  const [comments, setComments] = useState([
    {
      id: 'c1',
      user: 'Jordan Miller',
      avatar: avatar4,
      text: 'Thanks for sharing! Super helpful for finals week.',
      time: '15m ago',
    },
    {
      id: 'c2',
      user: 'Priya Sharma',
      avatar: avatar6,
      text: 'Is this open to students from all departments?',
      time: '32m ago',
    },
    {
      id: 'c3',
      user: 'Devon Vance',
      avatar: avatar7,
      text: 'Great initiative. See you there!',
      time: '1h ago',
    },
  ]);
  const [newComment, setNewComment] = useState('');

  if (!isOpen || !post) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // TODO: connect to backend
    openComments(post.id);

    setComments([
      ...comments,
      {
        id: `c_${Date.now()}`,
        user: 'Alex Rivers',
        avatar: defaultPng,
        text: newComment.trim(),
        time: 'Just now',
      },
    ]);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-[#2b1d16] border border-[#3d2a20] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3d2a20] pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#f47b31]" />
            <h3 className="text-sm font-extrabold text-white">
              Comments ({post.commentsCount + comments.length - 3})
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
          <span className="font-extrabold text-[#f47b31]">{post.author.name}</span>: "{post.title || post.question || post.content}"
        </div>

        {/* Left-aligned Comments List */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-3 bg-[#231711] p-3 rounded-2xl border border-[#3d2a20]">
              <img
                src={c.avatar || defaultPng}
                alt={c.user}
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#f47b31]/30 mt-0.5"
              />
              <div className="flex-1 min-w-0 space-y-0.5 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white truncate">{c.user}</span>
                  <span className="text-[10px] text-stone-400 font-medium">{c.time}</span>
                </div>
                <p className="text-xs text-stone-200 leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
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
            disabled={!newComment.trim()}
            className="w-9 h-9 bg-[#f47b31] hover:bg-[#e0661c] disabled:opacity-40 text-white rounded-full flex items-center justify-center shadow-md transition shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

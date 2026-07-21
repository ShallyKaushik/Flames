import React from 'react';
import { Heart, MessageSquare, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { toggleLike } from '../../services/backendStubs';
import defaultPng from '../../avatars/default.png';

export function ImagePostCard({ post, onUpdatePost, onOpenComments }) {
  const handleLike = () => {
    // TODO: connect to backend
    toggleLike(post.id);
    onUpdatePost({
      ...post,
      isLiked: !post.isLiked,
      likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
    });
  };

  return (
    <article className="bg-[#fdf6ee] text-[#2c1a11] rounded-3xl p-4 sm:p-5 shadow-lg border border-[#f47b31]/10 space-y-3">
      {/* Top Tag & Time */}
      <div className="flex items-center justify-between">
        <span className="bg-[#ffeadb] text-[#d65f18] text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
          {post.categoryLabel || 'CAMPUS PHOTO'}
        </span>
        <div className="flex items-center gap-2 text-stone-500 text-xs">
          <span>{post.timeAgo}</span>
          <button className="p-1 hover:bg-stone-200 rounded-full transition" aria-label="Post options">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Author Header */}
      <div className="flex items-center gap-3">
        <img
          src={post.author.avatar || defaultPng}
          alt={post.author.name}
          className="w-10 h-10 rounded-full object-cover border border-[#f47b31]/30"
        />
        <div>
          <h4 className="text-sm font-extrabold flex items-center gap-1">
            {post.author.name}
            {post.author.verified && (
              <CheckCircle2 className="w-4 h-4 text-sky-500 fill-sky-500/20 inline" />
            )}
          </h4>
          <p className="text-xs text-stone-500 font-medium">{post.author.sub}</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {post.title && <h3 className="text-base font-extrabold leading-snug">{post.title}</h3>}
        {post.content && <p className="text-xs text-stone-600 leading-relaxed">{post.content}</p>}
        {post.image && (
          <div className="rounded-2xl overflow-hidden border border-[#e8d7c8] max-h-80 shadow-xs">
            <img src={post.image} alt={post.title || 'Campus post'} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center gap-6 pt-2 border-t border-[#f2e4d5]">
        {/* Like Action */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-xs font-bold transition cursor-pointer ${
            post.isLiked ? 'text-[#f47b31]' : 'text-stone-600 hover:text-[#f47b31]'
          }`}
        >
          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-[#f47b31]' : ''}`} />
          <span>{post.likesCount}</span>
        </button>

        {/* Comment Action */}
        <button
          onClick={() => onOpenComments(post)}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#f47b31] transition cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{post.commentsCount}</span>
        </button>
      </div>
    </article>
  );
}

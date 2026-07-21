import React from 'react';
import { Heart, MessageSquare, Bookmark, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { toggleLike, toggleBookmark } from '../../services/backendStubs';
import { getAvatarUrl } from '../../data/avatars';

export function LostFoundCard({ post, onUpdatePost, onOpenComments, onNavigateProfile }) {
  const handleLike = () => {
    // TODO: connect to backend
    toggleLike(post.id);
    onUpdatePost({
      ...post,
      isLiked: !post.isLiked,
      likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
    });
  };

  const handleBookmark = () => {
    // TODO: connect to backend
    toggleBookmark(post.id);
    onUpdatePost({
      ...post,
      isBookmarked: !post.isBookmarked,
    });
  };

  return (
    <article className="bg-[#fdf6ee] text-[#2c1a11] rounded-3xl p-4 sm:p-5 shadow-lg border border-[#f47b31]/10 space-y-3">
      {/* Top Tag & Time */}
      <div className="flex items-center justify-between">
        <span className="bg-[#ffeadb] text-[#d65f18] text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
          {post.categoryLabel || 'LOST & FOUND'}
        </span>
        <div className="flex items-center gap-2 text-stone-500 text-xs">
          <span>{post.timeAgo}{post.isEdited ? ' • Edited' : ''}</span>
          <button className="p-1 hover:bg-stone-200 rounded-full transition" aria-label="Post options">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Author Header */}
      <div className="flex items-center gap-3">
        <img
          src={getAvatarUrl(post.author.avatar)}
          alt={post.author.name}
          className="w-10 h-10 rounded-full object-cover border border-[#f47b31]/30 cursor-pointer"
          onClick={() => onNavigateProfile && onNavigateProfile(post.author._id || post.author.id)}
        />
        <div 
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => onNavigateProfile && onNavigateProfile(post.author._id || post.author.id)}
        >
          <h4 className="text-sm font-extrabold flex items-center gap-1">
            {post.author.name}
            {post.author.verified && (
              <CheckCircle2 className="w-4 h-4 text-sky-500 fill-sky-500/20 inline" />
            )}
          </h4>
          <p className="text-xs text-stone-500 font-medium">{post.author.sub}</p>
        </div>
      </div>

      {/* Content & Thumbnail side-by-side */}
      <div className="grid grid-cols-3 gap-3 items-start">
        <div className="col-span-2 space-y-1">
          <h3 className="text-base font-extrabold leading-snug">{post.title}</h3>
          <p className="text-xs text-stone-600 leading-relaxed">{post.description || post.content}</p>
        </div>

        {post.image && (
          <div className="col-span-1 rounded-2xl overflow-hidden border border-[#e8d7c8] aspect-square shadow-sm">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-[#f2e4d5]">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs font-bold transition ${
              post.isLiked ? 'text-[#f47b31]' : 'text-stone-600 hover:text-[#f47b31]'
            }`}
          >
            <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-[#f47b31]' : ''}`} />
            <span>{post.likesCount}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => onOpenComments(post)}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#f47b31] transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.commentsCount}</span>
          </button>
        </div>

        {/* Bookmark Toggle */}
        <button
          onClick={handleBookmark}
          className={`p-1.5 rounded-full transition ${
            post.isBookmarked ? 'text-[#f47b31]' : 'text-stone-500 hover:text-[#f47b31]'
          }`}
          aria-label="Bookmark post"
        >
          <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-[#f47b31]' : ''}`} />
        </button>
      </div>
    </article>
  );
}

import React from 'react';
import { Heart, MessageSquare, MoreHorizontal, CheckCircle2, UserPlus, Check } from 'lucide-react';
import { toggleLike, joinTeam, openComments } from '../../services/backendStubs';
import { getAvatarUrl } from '../../data/avatars';

export function TeamRequestCard({ post, onUpdatePost, onOpenComments, onNavigateProfile }) {
  const handleLike = () => {
    // TODO: connect to backend
    toggleLike(post.id);
    onUpdatePost({
      ...post,
      isLiked: !post.isLiked,
      likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
    });
  };

  const handleJoin = () => {
    // TODO: connect to backend
    joinTeam(post.id);
    onUpdatePost({
      ...post,
      isJoined: !post.isJoined,
    });
  };

  return (
    <article className="bg-[#fdf6ee] text-[#2c1a11] rounded-3xl p-4 sm:p-5 shadow-lg border border-[#f47b31]/10 space-y-3">
      {/* Top Tag & Time */}
      <div className="flex items-center justify-between">
        <span className="bg-[#ffeadb] text-[#d65f18] text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
          {post.categoryLabel || 'TEAM REQUEST'}
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
          className="w-10 h-10 rounded-full object-cover border-2 border-[#f47b31] cursor-pointer"
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

      {/* Content */}
      <div className="space-y-1">
        <h3 className="text-base font-extrabold leading-snug">{post.title}</h3>
        <p className="text-xs text-stone-600 leading-relaxed">{post.description}</p>
      </div>

      {/* Requirement Chips */}
      {post.requirements && post.requirements.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {post.requirements.map((req, idx) => (
            <span
              key={idx}
              className="bg-[#f7ebe0] text-[#4a3427] text-xs font-semibold px-3 py-1 rounded-xl border border-[#e8d6c7]"
            >
              <strong className="font-extrabold">{req.label}:</strong> {req.value}
            </span>
          ))}
        </div>
      )}

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

        {/* Join Button */}
        <button
          onClick={handleJoin}
          className={`py-2 px-6 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-md transition ${
            post.isJoined
              ? 'bg-emerald-600 text-white shadow-emerald-600/20'
              : 'bg-[#f47b31] hover:bg-[#e0661c] text-white shadow-[#f47b31]/30 hover:scale-105'
          }`}
        >
          {post.isJoined ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" /> Applied
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Join
            </>
          )}
        </button>
      </div>
    </article>
  );
}

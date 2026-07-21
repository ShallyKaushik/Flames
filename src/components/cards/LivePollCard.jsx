import React from 'react';
import { EyeOff, Heart, MessageSquare, MoreHorizontal } from 'lucide-react';
import { castVote, toggleLike } from '../../services/backendStubs';
import defaultPng from '../../avatars/default.png';

export function LivePollCard({ post, onUpdatePost, onOpenComments }) {
  const handleVote = (optionId) => {
    // TODO: connect to backend
    castVote(post.id, optionId);

    const total = post.totalVotes + 1;
    const updatedOptions = post.options.map((opt) => {
      const isSelected = opt.id === optionId;
      const count = isSelected ? opt.count + 1 : opt.count;
      return {
        ...opt,
        count,
        percentage: Math.round((count / total) * 100),
      };
    });

    onUpdatePost({
      ...post,
      options: updatedOptions,
      totalVotes: total,
      userVotedOptionId: optionId,
    });
  };

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
        <span className="bg-[#dcfce7] text-[#15803d] text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-ping" />
          {post.categoryLabel || 'LIVE POLL'}
        </span>
        <div className="flex items-center gap-2 text-stone-500 text-xs">
          <span>{post.timeAgo}</span>
          <button className="p-1 hover:bg-stone-200 rounded-full transition" aria-label="Post options">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Author Header (Anonymous or Public) */}
      <div className="flex items-center gap-3">
        {post.author.isAnonymous ? (
          <div className="w-10 h-10 rounded-full bg-purple-900 text-white flex items-center justify-center shadow-inner">
            <EyeOff className="w-5 h-5" />
          </div>
        ) : (
          <img
            src={post.author.avatar || defaultPng}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover border border-[#f47b31]/30"
          />
        )}
        <div>
          <h4 className="text-sm font-extrabold text-[#2c1a11]">
            {post.author.name}
          </h4>
          <p className="text-xs text-stone-500 font-medium">{post.author.sub}</p>
        </div>
      </div>

      {/* Question */}
      <h3 className="text-base font-extrabold leading-snug">{post.question || post.title}</h3>

      {/* Poll Options */}
      <div className="space-y-2 py-1">
        {post.options.map((option) => {
          const isVoted = post.userVotedOptionId === option.id;
          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              className={`w-full relative overflow-hidden rounded-2xl border p-3 flex items-center justify-between text-xs font-bold transition text-left cursor-pointer ${
                isVoted
                  ? 'border-[#f47b31] text-[#2c1a11] bg-[#ffeadb]/40'
                  : 'border-[#ebdccf] bg-[#f8efe6] hover:border-[#f47b31] text-stone-700'
              }`}
            >
              {/* Animated Progress Bar fill */}
              <div
                className={`absolute top-0 left-0 bottom-0 transition-all duration-500 ${
                  isVoted ? 'bg-[#f47b31]/30' : 'bg-[#eadace]'
                }`}
                style={{ width: `${option.percentage}%` }}
              />

              <span className="relative z-10 font-bold flex items-center gap-2">
                {option.text}
                {isVoted && <span className="text-[10px] text-[#f47b31] font-extrabold">✓ Voted</span>}
              </span>
              <span className="relative z-10 font-extrabold text-stone-900">
                {option.percentage}%
              </span>
            </button>
          );
        })}
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

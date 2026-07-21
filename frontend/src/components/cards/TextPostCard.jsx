import React from 'react';
import { Heart, MessageSquare, CheckCircle2 } from 'lucide-react';
import { toggleLike, deletePost } from '../../services/backendStubs';
import defaultPng from '../../avatars/default.png';
import { getAvatarUrl } from '../../data/avatars';
import { PostOptionsDropdown } from './PostOptionsDropdown';

export function TextPostCard({ post, onUpdatePost, onDeletePost, onEditPost, onOpenComments, onNavigateProfile }) {
  const currentUserId = (() => {
    try {
      const saved = localStorage.getItem('flames_user');
      if (saved) return JSON.parse(saved)._id || JSON.parse(saved).id;
    } catch (_) {}
    return null;
  })();
  const isAuthor = currentUserId === (post.author?._id || post.author?.id);

  const handleLike = async () => {
    // Optimistic update
    onUpdatePost({
      ...post,
      isLiked: !post.isLiked,
      likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
    });
    try {
      await toggleLike(post.id, post.isLiked);
    } catch (err) {
      // Revert on failure
      onUpdatePost({
        ...post,
        isLiked: post.isLiked,
        likesCount: post.likesCount,
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(post.id);
      if (onDeletePost) onDeletePost(post.id);
    } catch (err) {
      alert('Failed to delete post.');
    }
  };

  return (
    <article className="bg-[#fdf6ee] text-[#2c1a11] rounded-3xl p-4 sm:p-5 shadow-lg border border-[#f47b31]/10 space-y-3">
      {/* Top Tag & Time */}
      <div className="flex items-center justify-between">
        <span className="bg-[#ffeadb] text-[#d65f18] text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
          {post.categoryLabel || 'ACADEMICS'}
        </span>
        <div className="flex items-center gap-2 text-stone-500 text-xs">
          <span>{post.timeAgo}{post.isEdited ? ' • Edited' : ''}</span>
          <PostOptionsDropdown 
            isAuthor={isAuthor} 
            onEdit={() => onEditPost(post)} 
            onDelete={handleDelete} 
          />
        </div>
      </div>

      {/* Author Header */}
      <div className="flex items-center gap-3">
        <img
          src={getAvatarUrl(post.author.avatar) || defaultPng}
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

      {/* Content */}
      <div className="space-y-1">
        {post.title && <h3 className="text-base font-extrabold leading-snug">{post.title}</h3>}
        <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">{post.content || post.description}</p>
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

import React from 'react';
import { PostCard } from './cards/PostCard';
import { FoxMascot } from './FoxMascot';
import { RefreshCw } from 'lucide-react';

export function Feed({ posts, isLoading, onUpdatePost, onDeletePost, onEditPost, onOpenComments, onOpenAnonMsg, onResetFilters, onNavigateProfile }) {
  if (isLoading) {
    return (
      <div className="px-4 py-3 space-y-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-[#2b1d16] border border-[#3d2a20] rounded-3xl p-5 space-y-3 animate-pulse"
          >
            <div className="flex justify-between items-center">
              <div className="w-24 h-4 bg-stone-700/50 rounded-full" />
              <div className="w-12 h-3 bg-stone-700/50 rounded-full" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-700/50 rounded-full" />
              <div className="space-y-1 flex-1">
                <div className="w-32 h-3.5 bg-stone-700/50 rounded-md" />
                <div className="w-20 h-2.5 bg-stone-700/50 rounded-md" />
              </div>
            </div>
            <div className="w-3/4 h-5 bg-stone-700/50 rounded-md" />
            <div className="w-full h-12 bg-stone-700/50 rounded-2xl" />
          </div>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="px-4 py-12 text-center space-y-4">
        {/* Mascot 9 for empty feed / no data added */}
        <FoxMascot variant="9" className="w-20 h-20 mx-auto" />
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-white">No posts found in this feed</h3>
          <p className="text-xs text-stone-400 max-w-xs mx-auto">
            Try adjusting your search query or selecting a different category pill.
          </p>
        </div>
        <button
          onClick={onResetFilters}
          className="py-2.5 px-5 rounded-full bg-[#f47b31] hover:bg-[#e0661c] text-white text-xs font-bold shadow-md inline-flex items-center gap-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onUpdatePost={onUpdatePost}
          onDeletePost={onDeletePost}
          onEditPost={onEditPost}
          onOpenComments={onOpenComments}
          onOpenAnonMsg={onOpenAnonMsg}
          onNavigateProfile={onNavigateProfile}
        />
      ))}
    </div>
  );
}

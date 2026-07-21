import React from 'react';
import { Image as ImageIcon, BarChart3, Plus } from 'lucide-react';
import { FoxMascot } from './FoxMascot';

export function PostComposer({ onOpenCreateModal }) {
  return (
    <div className="px-4 py-2 bg-[#1c120c]">
      <div
        onClick={() => onOpenCreateModal('text')}
        className="bg-[#fdf6ee] text-[#2c1a11] rounded-3xl p-3.5 flex items-center justify-between shadow-lg border border-[#f47b31]/20 hover:border-[#f47b31]/50 transition cursor-pointer group"
      >
        {/* Left: Fox Avatar (Mascot 8) + Input Prompt */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <FoxMascot variant="8" className="w-10 h-10 shrink-0 group-hover:scale-105 transition" />
          <span className="text-sm font-semibold text-stone-500 truncate group-hover:text-stone-700 transition">
            What's happening on campus?
          </span>
        </div>

        {/* Right: Quick Action Icons & Orange Floating Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCreateModal('image');
            }}
            className="p-2 text-stone-600 hover:text-[#f47b31] hover:bg-[#f47b31]/10 rounded-full transition"
            aria-label="Create image post"
            title="Attach image"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCreateModal('poll');
            }}
            className="p-2 text-stone-600 hover:text-[#f47b31] hover:bg-[#f47b31]/10 rounded-full transition"
            aria-label="Create live poll"
            title="Create live poll"
          >
            <BarChart3 className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCreateModal('text');
            }}
            className="w-9 h-9 rounded-full bg-[#f47b31] hover:bg-[#e0661c] text-white flex items-center justify-center shadow-md shadow-[#f47b31]/30 hover:scale-105 transition"
            aria-label="Create new post"
            title="Create post"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}

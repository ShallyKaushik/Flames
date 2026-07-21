import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export function SearchAndFilter({ searchQuery, onSearchChange, onOpenFilter, hasActiveFilters }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handled via live search state in parent
  };

  return (
    <div className="px-4 py-2 bg-[#1c120c]">
      <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
        {/* Rounded Search Input Container */}
        <div className="relative flex-1 flex items-center bg-[#2b1d16] border border-[#3d2a20] focus-within:border-[#f47b31] rounded-full px-3.5 py-2 transition shadow-inner">
          <Search className="w-4 h-4 text-stone-400 shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search people, tags, posts, clubs..."
            className="w-full bg-transparent text-sm text-white placeholder-stone-400 focus:outline-hidden"
            aria-label="Search posts, people, tags, clubs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="p-0.5 text-stone-400 hover:text-white rounded-full transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter / Sort Button */}
        <button
          type="button"
          onClick={onOpenFilter}
          className={`relative p-2.5 rounded-full border transition shrink-0 focus:outline-hidden focus:ring-2 focus:ring-[#f47b31] ${
            hasActiveFilters
              ? 'bg-[#f47b31] text-white border-[#f47b31] shadow-md'
              : 'bg-[#2b1d16] text-stone-300 border-[#3d2a20] hover:border-stone-500 hover:text-white'
          }`}
          aria-label="Filter and sort feed"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {hasActiveFilters && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-300 border-2 border-[#1c120c] rounded-full" />
          )}
        </button>
      </form>
    </div>
  );
}

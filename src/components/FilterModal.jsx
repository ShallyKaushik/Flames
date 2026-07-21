import React, { useState } from 'react';
import { X, Filter, Check } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

export function FilterModal({ isOpen, onClose, activeFilters, onApplyFilters }) {
  const [sortBy, setSortBy] = useState(activeFilters.sortBy || 'newest');
  const [category, setCategory] = useState(activeFilters.category || 'all');

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters({ sortBy, category });
    onClose();
  };

  const handleReset = () => {
    setSortBy('newest');
    setCategory('all');
    onApplyFilters({ sortBy: 'newest', category: 'all' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-sm bg-[#2b1d16] border border-[#3d2a20] rounded-3xl p-5 shadow-2xl space-y-4 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3d2a20] pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#f47b31]" />
            <h3 className="text-sm font-extrabold text-white">Filter & Sort Feed</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sort By Section */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Sort Order
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-[#1c120c] p-1 rounded-2xl border border-[#3d2a20]">
            {[
              { id: 'newest', label: 'Newest' },
              { id: 'most_liked', label: 'Most Liked' },
              { id: 'most_commented', label: 'Active' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition ${
                  sortBy === option.id
                    ? 'bg-[#f47b31] text-white shadow-sm'
                    : 'text-stone-400 hover:text-white hover:bg-[#2b1d16]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter by Category Section (Exact 9 Categories) */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Filter by Category
          </label>
          <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto no-scrollbar">
            <button
              onClick={() => setCategory('all')}
              className={`py-2 px-3 rounded-xl text-xs font-bold text-left transition ${
                category === 'all'
                  ? 'bg-[#f47b31] text-white'
                  : 'bg-[#1c120c] text-stone-300 border border-[#3d2a20] hover:border-stone-500'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold text-left transition ${
                  category === c.id
                    ? 'bg-[#f47b31] text-white'
                    : 'bg-[#1c120c] text-stone-300 border border-[#3d2a20] hover:border-stone-500'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#3d2a20]">
          <button
            onClick={handleReset}
            className="text-xs font-bold text-stone-400 hover:text-stone-200"
          >
            Reset All
          </button>
          <button
            onClick={handleApply}
            className="py-2 px-5 rounded-xl bg-[#f47b31] hover:bg-[#e0661c] text-white text-xs font-bold shadow-md flex items-center gap-1 transition"
          >
            <Check className="w-4 h-4" /> Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

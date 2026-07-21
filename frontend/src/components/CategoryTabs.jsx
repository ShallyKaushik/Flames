import React from 'react';
import { CATEGORIES } from '../data/categories';

export function CategoryTabs({ activeCategory, onSelectCategory }) {
  const tabs = [{ id: 'all', label: 'All' }, ...CATEGORIES];

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5 px-4 scroll-smooth">
      {tabs.map((tab) => {
        const isActive = activeCategory === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectCategory(tab.id)}
            className={`py-1.5 px-3.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
              isActive
                ? 'bg-[#f47b31] text-white shadow-md shadow-[#f47b31]/30'
                : 'bg-[#2b1d16] text-stone-300 hover:text-white hover:bg-[#34241c] border border-[#3d2a20]'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

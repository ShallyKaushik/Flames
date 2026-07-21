import React from 'react';
import { Home, Compass, Plus, MessageCircle, User } from 'lucide-react';

export function BottomNav({ activeRoute, onNavigate, onOpenCreateModal }) {
  const navItems = [
    { id: 'home', route: '/home', label: 'Home', icon: Home },
    { id: 'discover', route: '/discover', label: 'Discover', icon: Compass },
    { id: 'create', isFloating: true },
    { id: 'inbox', route: '/open-chat', label: 'Open Chat', icon: MessageCircle },
    { id: 'profile', route: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#1c120c]/95 backdrop-blur-md border-t border-[#2d201a] px-4 py-2 flex items-center justify-around max-w-lg mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        if (item.isFloating) {
          return (
            <button
              key="create-btn"
              onClick={() => onOpenCreateModal('text')}
              className="w-12 h-12 rounded-full bg-[#f47b31] hover:bg-[#e0661c] text-white flex items-center justify-center shadow-lg shadow-[#f47b31]/40 border-2 border-[#1c120c] -mt-5 hover:scale-110 transition active:scale-95 cursor-pointer"
              aria-label="Open create post"
              title="Create Post"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>
          );
        }

        const IconComponent = item.icon;
        const isActive = activeRoute === item.id || (item.id === 'inbox' && activeRoute === 'open_chat');

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition cursor-pointer ${
              isActive
                ? 'text-[#f47b31]'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            aria-label={item.label}
          >
            <IconComponent className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className={`text-[10px] ${isActive ? 'font-extrabold text-[#f47b31]' : 'font-semibold'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </footer>
  );
}

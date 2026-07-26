import React from 'react';
import { User, ShieldCheck, Bookmark, Settings, LogOut, X, Sparkles } from 'lucide-react';
import defaultPng from '../avatars/default.png';
import { getAvatarUrl } from '../data/avatars';

export function ProfileDrawer({ isOpen, onClose, onNavigate, currentUser, onLogout }) {
  if (!isOpen) return null;

  const user = currentUser || {
    fullName: '',
    username: '',
    email: '',
    avatar: 0,
  };

  const userAvatar = getAvatarUrl(user.avatar);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xs bg-[#2b1d16] h-full p-5 flex flex-col justify-between border-l border-[#3d2a20] shadow-2xl animate-slide-up sm:animate-none">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#3d2a20] pb-4 mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-[#f47b31]" /> Campus Profile
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
              aria-label="Close profile menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Card */}
          <div className="bg-[#231711] p-4 rounded-2xl border border-[#3d2a20] flex items-center gap-3 mb-6">
            <img
              src={userAvatar}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#f47b31]/40"
            />
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1">
                {user.fullName || user.username || '—'} <ShieldCheck className="w-4 h-4 text-sky-400 fill-sky-400/20" />
              </h3>
              <p className="text-[11px] text-stone-400 truncate max-w-[160px]">{user.email || '—'}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-emerald-400 font-extrabold hover:bg-emerald-900/20 transition-colors"
              >
                <ShieldCheck className="w-5 h-5" /> Admin Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Footer / Sign Out */}
        <div className="pt-4 border-t border-[#3d2a20]">
          <button
            onClick={() => {
              onLogout?.();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-semibold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

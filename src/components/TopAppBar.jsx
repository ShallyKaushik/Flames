import React from 'react';
import { Bell, Flag } from 'lucide-react';
import { FoxMascot } from './FoxMascot';

export function TopAppBar({ unreadCount, onToggleNotifications, onOpenReportModal, onOpenProfile }) {
  return (
    <header className="sticky top-0 z-40 bg-[#1c120c]/95 backdrop-blur-md border-b border-[#2d201a] px-4 py-3 flex items-center justify-between">
      {/* Logo Area */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <img
          src="/assets/logo.png"
          alt="Flames Logo"
          className="w-8 h-8 object-contain drop-shadow-[0_2px_8px_rgba(244,123,49,0.4)]"
        />
        <span className="font-heading font-extrabold text-2xl tracking-tight text-white font-serif italic drop-shadow-sm">
          Flames
        </span>
      </div>

      {/* Action Items (Notification, Report Issue & Profile) */}
      <div className="flex items-center gap-2.5">
        {/* Notification Bell */}
        <button
          onClick={onToggleNotifications}
          className="relative p-2 rounded-full text-stone-300 hover:text-white hover:bg-[#2b1d16] transition focus:outline-hidden focus:ring-2 focus:ring-[#f47b31] cursor-pointer"
          aria-label={`Notifications ${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 bg-[#f47b31] text-white text-[10px] font-extrabold rounded-full border border-[#1c120c]">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Report an Issue Flag Icon (Positioned between Notifications and Profile Avatar) */}
        <button
          onClick={onOpenReportModal}
          className="p-2 rounded-full text-stone-300 hover:text-[#f47b31] hover:bg-[#2b1d16] transition focus:outline-hidden focus:ring-2 focus:ring-[#f47b31] cursor-pointer"
          aria-label="Report an issue"
          title="Report an Issue"
        >
          <Flag className="w-5 h-5" />
        </button>

        {/* Profile Avatar */}
        <button
          onClick={onOpenProfile}
          className="relative rounded-full p-0.5 border border-[#f47b31]/40 hover:border-[#f47b31] transition focus:outline-hidden focus:ring-2 focus:ring-[#f47b31] cursor-pointer"
          aria-label="Open profile menu"
        >
          <FoxMascot variant="default" className="w-8 h-8 rounded-full bg-[#2b1d16]" />
        </button>
      </div>
    </header>
  );
}

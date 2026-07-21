import React from 'react';
import { Bell, X } from 'lucide-react';
import { FoxMascot } from './FoxMascot';
import { getAvatarUrl } from '../data/avatars';

export function NotificationsModal({ notifications, isOpen, onClose, onClearAll, onMarkRead }) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-14 right-2 sm:right-4 w-[92vw] max-w-sm bg-[#2b1d16] border border-[#3d2a20] rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between px-4 py-3 bg-[#231711] border-b border-[#3d2a20]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#f47b31]" />
          <h3 className="text-sm font-bold text-white">Notifications</h3>
          <span className="bg-[#f47b31] text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
            {notifications.filter(n => n.unread).length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onClearAll}
            className="text-xs text-[#f47b31] hover:underline px-2 py-1 rounded"
            title="Mark all as read"
          >
            Mark all read
          </button>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition"
            aria-label="Close notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto no-scrollbar divide-y divide-[#3d2a20]">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-stone-400">
            {/* Mascot 9 for empty notifications */}
            <FoxMascot variant="9" className="w-12 h-12 mx-auto mb-2" />
            <p className="text-xs">No unread notifications right now!</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => n.unread && onMarkRead && onMarkRead(n.id)}
              className={`p-3.5 flex items-start gap-3 hover:bg-[#34241c] transition cursor-pointer ${
                n.unread ? 'bg-[#312119]' : ''
              }`}
            >
              {n.avatar === 'fox-mascot' ? (
                /* Mascot 11 for notifications / DM alert */
                <FoxMascot variant="11" className="w-9 h-9 shrink-0" />
              ) : (
                <img
                  src={getAvatarUrl(n.avatar)}
                  alt={n.user}
                  className="w-9 h-9 rounded-full object-cover shrink-0 border border-[#f47b31]/30"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-stone-200 leading-tight">
                  <span className="font-bold text-white">{n.user}</span> {n.message}
                </p>

                <span className="text-[10px] text-stone-400 mt-1 block font-medium">
                  {n.time}
                </span>
              </div>
              {n.unread && (
                <span className="w-2 h-2 rounded-full bg-[#f47b31] shrink-0 mt-1" />
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-2.5 bg-[#231711] text-center border-t border-[#3d2a20]">
        <button
          onClick={onClose}
          className="text-xs text-stone-400 hover:text-white font-medium"
        >
          Close panel
        </button>
      </div>
    </div>
  );
}

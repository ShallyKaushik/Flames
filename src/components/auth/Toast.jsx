import React, { useEffect } from 'react';

export default function Toast({ type = 'info', message, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const bgColors = {
    success: 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40',
    error: 'bg-rose-950/90 text-rose-200 border-rose-500/40',
    info: 'bg-amber-950/90 text-amber-200 border-amber-500/40',
  };

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-2xl shadow-2xl border backdrop-blur-md animate-fade-in flex items-center justify-between gap-3 text-sm font-semibold transition-all">
      <div className={`flex items-center gap-2.5 ${bgColors[type] || bgColors.info} p-3 rounded-xl w-full border`}>
        <span className="material-symbols-outlined text-xl">{icons[type] || 'info'}</span>
        <p className="flex-1 text-xs leading-tight">{message}</p>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white p-1 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  );
}

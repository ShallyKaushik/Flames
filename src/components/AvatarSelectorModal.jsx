import React, { useState } from 'react';
import { X, Check, ChevronLeft } from 'lucide-react';
import { AVATARS } from '../data/avatars';

export function AvatarSelectorModal({ isOpen, onClose, currentAvatar, onSelectAvatar }) {
  const [selectedId, setSelectedId] = useState(
    currentAvatar?.id || AVATARS[0].id
  );

  if (!isOpen) return null;

  const handleSave = () => {
    const chosen = AVATARS.find((a) => a.id === selectedId) || AVATARS[0];
    onSelectAvatar(chosen);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="w-full max-w-sm bg-[#1c120c] border border-[#3d2a20] rounded-3xl p-5 shadow-2xl space-y-5 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3d2a20] pb-3">
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg transition"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-sm font-extrabold text-white">Choose Avatar</h3>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 15 Avatars Grid (avatar4.png - avatar18.png) */}
        <div className="grid grid-cols-5 gap-3 max-h-72 overflow-y-auto no-scrollbar p-1">
          {AVATARS.map((avatar) => {
            const isSelected = selectedId === avatar.id;
            return (
              <button
                key={avatar.id}
                onClick={() => setSelectedId(avatar.id)}
                className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition cursor-pointer flex items-center justify-center bg-[#2b1d16] ${
                  isSelected
                    ? 'border-[#f47b31] scale-105 ring-2 ring-[#f47b31]/40'
                    : 'border-[#3d2a20] hover:border-stone-500 opacity-80 hover:opacity-100'
                }`}
              >
                <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover rounded-full" />

                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#f47b31] rounded-full flex items-center justify-center text-white shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-center text-stone-400 font-medium">
          15 avatars available
        </p>

        {/* Footer Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 rounded-xl border border-[#3d2a20] bg-[#2b1d16] text-stone-300 font-bold text-xs hover:bg-[#34241c] transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="py-2.5 rounded-xl bg-[#f47b31] hover:bg-[#e0661c] text-white font-extrabold text-xs shadow-md transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

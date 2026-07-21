import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Edit2, Trash2 } from 'lucide-react';

export function PostOptionsDropdown({ isAuthor, onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-stone-200 rounded-full transition cursor-pointer" 
        aria-label="Post options"
      >
        <MoreHorizontal className="w-4 h-4 text-stone-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-10 animate-fade-in">
          {isAuthor ? (
            <>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onEdit();
                }}
                className="w-full text-left px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-100 flex items-center gap-2 cursor-pointer transition"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onDelete();
                }}
                className="w-full text-left px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                alert('Report functionality coming soon!');
              }}
              className="w-full text-left px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-100 flex items-center gap-2 cursor-pointer transition"
            >
              Report Post
            </button>
          )}
        </div>
      )}
    </div>
  );
}

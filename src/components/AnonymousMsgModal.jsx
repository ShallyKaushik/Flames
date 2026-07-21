import React, { useState } from 'react';
import { EyeOff, Send, X, Shield } from 'lucide-react';
import { openAnonymousMessage } from '../services/backendStubs';

export function AnonymousMsgModal({ post, isOpen, onClose }) {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen || !post) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // TODO: connect to backend
    await openAnonymousMessage(post.id);

    setSent(true);
    setTimeout(() => {
      setSent(false);
      setMessage('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-[#2b1d16] border border-[#3d2a20] rounded-3xl p-5 shadow-2xl space-y-4 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3d2a20] pb-3">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
            <EyeOff className="w-5 h-5 text-purple-400" />
            <h3>Send Anonymous Message</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">Message Delivered Anonymously!</h4>
            <p className="text-xs text-stone-400">Your identity is 100% protected on Flames.</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <div className="bg-[#231711] p-3 rounded-2xl border border-[#3d2a20] text-xs text-stone-300">
              <span className="font-bold text-purple-300">Target Poll</span>: "{post.question || post.title}"
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                Your Secret Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your thoughts anonymously... No one will know who sent this."
                rows={4}
                required
                className="w-full bg-[#1c120c] border border-[#3d2a20] rounded-2xl p-3 text-xs text-white placeholder-stone-400 focus:border-purple-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#3d2a20]">
              <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                <Shield className="w-3.5 h-3.5 text-purple-400" /> End-to-End Anonymous
              </div>
              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" /> Send Privately
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

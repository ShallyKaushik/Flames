import React, { useState, useEffect, useRef } from 'react';
import { Send, EyeOff } from 'lucide-react';
import { FoxMascot } from '../components/FoxMascot';
import { fetchOnlineUserCount } from '../services/backendStubs';
import { initializeSocket, disconnectSocket, getSocket } from '../services/socket';
import api from '../services/api';
import defaultPng from '../avatars/default.png';
import { getAvatarUrl } from '../data/avatars';

export function InboxView({ currentUser }) {
  const userName = currentUser?.username || currentUser?.fullName || currentUser?.name || 'User';
  const userSub = `${currentUser?.major ? currentUser.major.substring(0, 2) : 'CS'} '25`;

  const [onlineCount, setOnlineCount] = useState(null);
  const [messages, setMessages] = useState([]);

  const [inputMessage, setInputMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchOnlineUserCount().then((count) => {
      setOnlineCount(count);
    }).catch(() => {
      setOnlineCount(null);
    });

    const fetchMessages = async () => {
      try {
        const response = await api.get('/discussion/messages');
        const msgs = response.data.message || response.data.data || [];
        setMessages(msgs.map(formatBackendMessage));
      } catch (err) {
        console.error('Failed to load old messages:', err);
      }
    };
    fetchMessages();

    const socket = initializeSocket();
    if (socket) {
      socket.emit('joinDiscussion');
      socket.on('messageReceived', (msg) => {
        setMessages((prev) => [...prev, formatBackendMessage(msg)]);
      });
      socket.on('messageDeleted', ({ messageId }) => {
        setMessages((prev) => prev.filter(m => m.id !== messageId));
      });
    }

    return () => {
      if (socket) {
        socket.off('messageReceived');
        socket.off('messageDeleted');
      }
    };
  }, [currentUser]);

  const formatBackendMessage = (msg) => {
    return {
      id: msg._id,
      author: msg.sender?.fullName || msg.sender?.username || 'Unknown',
      verified: !msg.isAnonymous,
      sub: msg.isAnonymous ? 'Campus Voice' : 'User',
      isAnonymous: msg.isAnonymous,
      isMe: msg.sender?._id === currentUser?._id || msg.sender?._id === currentUser?.id || msg.sender?.username === currentUser?.username,
      text: msg.message,
      time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: msg.isAnonymous ? null : getAvatarUrl(msg.sender?.avatar),
      isEdited: !!msg.edited,
    };
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setIsPosting(true);
    
    const socket = getSocket();
    if (socket) {
      socket.emit('sendMessage', {
        message: inputMessage.trim(),
        isAnonymous: isAnonymous
      });
    }

    setInputMessage('');
    setIsPosting(false);
  };

  return (
    <div className="bg-[#1c120c] text-white min-h-screen flex flex-col font-sans relative pb-32">
      {/* Sticky Compact Group Chat Header */}
      <div className="sticky top-12 z-30 bg-[#1c120c]/95 backdrop-blur-md px-4 py-2.5 border-b border-[#2d201a] flex items-center justify-between shadow-xs">
        <div>
          <h1 className="text-base font-extrabold tracking-tight text-white leading-tight">
            Campus Open Chat
          </h1>
          {/* Dynamic Online Presence Status Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>
              Live{onlineCount !== null ? ` • ${onlineCount} students online` : ''}
            </span>
          </div>
        </div>

        <FoxMascot variant="generaluse" className="w-8 h-8 shrink-0" />
      </div>

      {/* Messages Thread Container (Left/Right Chat Bubbles) */}
      <div className="flex-1 px-3 py-3 space-y-2.5 overflow-y-auto">
        {messages.map((msg) => {
          const isSentByMe = msg.isMe;

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 w-full ${
                isSentByMe ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Avatar for received messages */}
              {!isSentByMe && (
                <div className="shrink-0 mb-1">
                  {msg.isAnonymous ? (
                    <div className="w-7 h-7 rounded-full bg-purple-950 text-purple-300 border border-purple-700/50 flex items-center justify-center font-bold text-xs">
                      <EyeOff className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <img
                      src={msg.avatar || defaultPng}
                      alt={msg.author}
                      className="w-7 h-7 rounded-full object-cover border border-[#f47b31]/40"
                    />
                  )}
                </div>
              )}

              {/* Chat Bubble Container (Max width 75%) */}
              <div
                className={`max-w-[75%] p-2.5 px-3.5 transition text-xs leading-relaxed space-y-1 shadow-sm ${
                  isSentByMe
                    ? msg.isAnonymous
                      ? 'bg-[#311c38] border border-purple-700/50 rounded-2xl rounded-tr-xs text-purple-100'
                      : 'bg-[#3e2518] border border-[#f47b31]/40 rounded-2xl rounded-tr-xs text-stone-100'
                    : msg.isAnonymous
                    ? 'bg-[#251a28] border border-purple-900/40 rounded-2xl rounded-tl-xs text-stone-200'
                    : 'bg-[#2b1d16] border border-[#3d2a20]/80 rounded-2xl rounded-tl-xs text-stone-200'
                }`}
              >
                {/* Sender Header: Username ONLY */}
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1 text-[11px]">
                  <span className="font-extrabold truncate text-white">
                    {msg.author}
                  </span>
                  {msg.isAnonymous && (
                    <span className="bg-purple-950/80 text-purple-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-purple-800/40 shrink-0">
                      Anon
                    </span>
                  )}
                </div>

                {/* Message Content */}
                <p className="text-xs text-stone-100 font-normal leading-normal select-text break-words">
                  {msg.text}
                </p>

                {/* Subtle Timestamp in bottom right */}
                <div className="text-[10px] text-stone-400 font-medium text-right pt-0.5 leading-none">
                  {msg.time}{msg.isEdited ? ' • Edited' : ''}
                </div>
              </div>

              {/* Avatar for sent messages */}
              {isSentByMe && (
                <div className="shrink-0 mb-1">
                  {msg.isAnonymous ? (
                    <div className="w-7 h-7 rounded-full bg-purple-900 text-purple-200 border border-purple-500/50 flex items-center justify-center font-bold text-xs shadow-xs">
                      <EyeOff className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <img
                      src={msg.avatar || defaultPng}
                      alt={msg.author}
                      className="w-7 h-7 rounded-full object-cover border border-[#f47b31]/60 shadow-xs"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Persistent Fixed Bottom Composer Bar */}
      <div className="fixed bottom-14 left-0 right-0 z-40 max-w-lg mx-auto bg-[#1c120c]/98 backdrop-blur-md px-3 py-2 border-t border-[#2d201a]">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          {/* Anonymous Toggle Pill */}
          <button
            type="button"
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`py-1.5 px-2.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 border transition shrink-0 cursor-pointer ${
              isAnonymous
                ? 'bg-purple-900/90 text-purple-200 border-purple-500 shadow-sm'
                : 'bg-[#2b1d16] text-stone-300 border-[#3d2a20] hover:border-stone-500'
            }`}
            title={isAnonymous ? 'Posting Anonymously' : 'Posting with identity'}
          >
            <EyeOff className="w-3.5 h-3.5 text-purple-400" />
            <span>{isAnonymous ? 'Anon ON' : 'Anon OFF'}</span>
          </button>

          {/* Rounded Input */}
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Message campus..."
            required
            className="flex-1 bg-[#2b1d16] border border-[#3d2a20] rounded-full px-3.5 py-2 text-xs text-white placeholder-stone-400 focus:border-[#f47b31] focus:outline-hidden transition"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={isPosting || !inputMessage.trim()}
            className="w-9 h-9 rounded-full bg-[#f47b31] hover:bg-[#e0661c] disabled:opacity-40 text-white flex items-center justify-center shadow-md shrink-0 transition active:scale-95 cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

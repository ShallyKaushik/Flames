import React, { useState, useEffect, useRef } from 'react';
import { Send, EyeOff } from 'lucide-react';
import { FoxMascot } from '../components/FoxMascot';
import { sendOpenChatMessage, fetchOnlineUserCount } from '../services/backendStubs';
import defaultPng from '../avatars/default.png';
import avatar4 from '../avatars/avatar4.png';
import avatar6 from '../avatars/avatar6.png';
import avatar7 from '../avatars/avatar7.png';

export function InboxView({ currentUser }) {
  const userName = currentUser?.name || 'Alex Rivers';
  const userSub = `${currentUser?.major ? currentUser.major.substring(0, 2) : 'CS'} '25`;

  const [onlineCount, setOnlineCount] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 'msg_1',
      author: 'Priya Sharma',
      verified: true,
      sub: 'Robotics Lead',
      isAnonymous: false,
      isMe: false,
      text: 'Free pizza workshop tomorrow at 5 PM in Lab 304! Everyone is welcome.',
      time: '5:18 PM',
      avatar: avatar6,
    },
    {
      id: 'msg_2',
      author: 'Anonymous',
      verified: false,
      sub: 'Campus Voice',
      isAnonymous: true,
      isMe: false,
      text: 'Finals schedule for CS 301 is officially posted on the student portal!',
      time: '5:20 PM',
      avatar: null,
    },
    {
      id: 'msg_3',
      author: 'Devon Vance',
      verified: true,
      sub: 'Physics TA',
      isAnonymous: false,
      isMe: false,
      text: 'Physics 301 review notes uploaded to the shared folder.',
      time: '5:22 PM',
      avatar: avatar4,
    },
    {
      id: 'msg_4',
      author: userName,
      verified: true,
      sub: userSub,
      isAnonymous: false,
      isMe: true,
      text: 'Anyone down for a late night study session at the main cafeteria?',
      time: '5:24 PM',
      avatar: currentUser?.avatar || defaultPng,
    },
    {
      id: 'msg_5',
      author: 'Maya Lin',
      verified: true,
      sub: "Data Science '26",
      isAnonymous: false,
      isMe: false,
      text: 'Count me in! Finishing up lab report now.',
      time: '5:25 PM',
      avatar: avatar7,
    },
    {
      id: 'msg_6',
      author: 'Anonymous',
      verified: false,
      sub: 'Campus Voice',
      isAnonymous: true,
      isMe: true,
      text: 'Is the 24/7 library extension approved for finals week yet?',
      time: '5:26 PM',
      avatar: null,
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // TODO: connect to backend - Fetch real-time active user count & subscribe to presence
    fetchOnlineUserCount().then((count) => {
      setOnlineCount(count);
    }).catch(() => {
      setOnlineCount(null);
    });
  }, []);

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

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessage = {
      id: `msg_${Date.now()}`,
      author: isAnonymous ? 'Anonymous' : userName,
      verified: !isAnonymous,
      sub: isAnonymous ? 'Campus Voice' : userSub,
      isAnonymous,
      isMe: true,
      text: inputMessage.trim(),
      time: timeString,
      avatar: isAnonymous
        ? null
        : (currentUser?.avatar || defaultPng),
    };

    // TODO: connect to backend
    await sendOpenChatMessage(newMessage);

    setMessages((prev) => [...prev, newMessage]);
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
                  {msg.time}
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

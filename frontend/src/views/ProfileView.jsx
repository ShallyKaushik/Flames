import React, { useState } from 'react';
import { ShieldCheck, Mail, Calendar, Pencil, FileText, MessageSquare, Heart, BarChart3, ChevronRight, LogOut } from 'lucide-react';
import { AVATARS, DEFAULT_AVATAR } from '../data/avatars';
import { AvatarSelectorModal } from '../components/AvatarSelectorModal';

export function ProfileView({ userPosts = [], currentUser, onLogout, onOpenEditProfile }) {
  const [activeTab, setActiveTab] = useState('my_posts');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const user = currentUser || {
    name: 'Alex Rivers',
    username: 'alexrivers',
    major: 'Computer Science',
    graduationYear: '2025',
    email: 'alex.rivers@jiit.ac.in',
    joinedDate: 'July 2026',
    bio: 'UI/UX Designer\nHackathon Enthusiast\nBuilding Flames 🔥',
    avatarObj: AVATARS[0],
    postsCount: 14,
    commentsCount: 58,
    likesReceivedCount: 246,
    pollsCreatedCount: 5,
  };

  const myPostsList = userPosts.filter(p => !p.author.isAnonymous);
  const myPollsList = userPosts.filter(p => p.type === 'poll' && !p.author.isAnonymous);

  const activeAvatarUrl = user.avatarObj?.url || user.avatar || DEFAULT_AVATAR;

  return (
    <div className="bg-[#1c120c] text-white min-h-screen pb-32 animate-fade-in px-4 py-4 space-y-4 font-sans">
      {/* Header Profile Card */}
      <div className="bg-[#2b1d16] border border-[#3d2a20] rounded-3xl p-5 shadow-xl space-y-4 relative">
        <div className="flex items-start gap-4">
          {/* Avatar Circle with Pencil Icon */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsAvatarModalOpen(true)}
              className="w-20 h-20 rounded-full bg-[#1c120c] border-2 border-[#f47b31] p-1 flex items-center justify-center overflow-hidden shadow-md transition cursor-pointer"
              title="Change avatar"
            >
              <img src={activeAvatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#f47b31] hover:bg-[#e0661c] text-white rounded-full flex items-center justify-center border border-[#2b1d16] shadow-md transition">
                <Pencil className="w-3 h-3" />
              </div>
            </button>
          </div>

          {/* User Meta */}
          <div className="space-y-1 flex-1 min-w-0">
            <h1 className="text-lg font-extrabold text-white flex items-center gap-1.5 truncate">
              {user.name}
              <ShieldCheck className="w-4 h-4 text-sky-400 fill-sky-400/20 shrink-0" />
            </h1>
            <p className="text-xs text-stone-400 font-medium">@{user.username || 'alexrivers'}</p>
            <p className="text-xs text-[#f47b31] font-extrabold pt-0.5">
              {user.major || 'Computer Science'} • Class of {user.graduationYear || '2025'}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-[11px] text-stone-400 pt-1">
              <span className="flex items-center gap-1 truncate">
                <Mail className="w-3.5 h-3.5 text-[#f47b31]" /> {user.email || 'alex.rivers@jiit.ac.in'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#f47b31]" /> Joined {user.joinedDate || 'July 2026'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-[#2b1d16] border border-[#3d2a20] p-4 rounded-3xl space-y-1 text-left shadow-xs">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#f47b31]" />
            <span className="text-xl font-extrabold text-white">{user.postsCount || 14}</span>
          </div>
          <p className="text-xs text-stone-400 font-medium">Posts</p>
        </div>

        <div className="bg-[#2b1d16] border border-[#3d2a20] p-4 rounded-3xl space-y-1 text-left shadow-xs">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#f47b31]" />
            <span className="text-xl font-extrabold text-white">{user.commentsCount || 58}</span>
          </div>
          <p className="text-xs text-stone-400 font-medium">Comments</p>
        </div>

        <div className="bg-[#2b1d16] border border-[#3d2a20] p-4 rounded-3xl space-y-1 text-left shadow-xs">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#f47b31]" />
            <span className="text-xl font-extrabold text-white">{user.likesReceivedCount || 246}</span>
          </div>
          <p className="text-xs text-stone-400 font-medium">Likes Received</p>
        </div>

        <div className="bg-[#2b1d16] border border-[#3d2a20] p-4 rounded-3xl space-y-1 text-left shadow-xs">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#f47b31]" />
            <span className="text-xl font-extrabold text-white">{user.pollsCreatedCount || 5}</span>
          </div>
          <p className="text-xs text-stone-400 font-medium">Polls Created</p>
        </div>
      </div>

      {/* Bio Card */}
      <div className="bg-[#2b1d16] border border-[#3d2a20] rounded-3xl p-4 space-y-2 relative shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Bio</h3>
          <button
            onClick={onOpenEditProfile}
            className="p-1 text-stone-400 hover:text-[#f47b31] transition cursor-pointer"
            title="Edit bio"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs text-stone-200 leading-relaxed whitespace-pre-line font-medium">
          {user.bio || 'UI/UX Designer\nHackathon Enthusiast\nBuilding Flames 🔥'}
        </p>
      </div>

      {/* My Activity Section */}
      <div className="bg-[#2b1d16] border border-[#3d2a20] rounded-3xl p-4 space-y-4 shadow-xs">
        <div className="flex items-center border-b border-[#3d2a20]">
          <button
            onClick={() => setActiveTab('my_posts')}
            className={`flex-1 py-2.5 text-xs font-extrabold text-center transition cursor-pointer border-b-2 ${
              activeTab === 'my_posts'
                ? 'border-[#f47b31] text-[#f47b31]'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            My Posts
          </button>
          <button
            onClick={() => setActiveTab('my_polls')}
            className={`flex-1 py-2.5 text-xs font-extrabold text-center transition cursor-pointer border-b-2 ${
              activeTab === 'my_polls'
                ? 'border-[#f47b31] text-[#f47b31]'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            My Polls
          </button>
        </div>

        <div className="space-y-2.5">
          {activeTab === 'my_posts' ? (
            myPostsList.length > 0 ? (
              myPostsList.map((p) => (
                <div key={p.id} className="bg-[#231711] p-3 rounded-2xl border border-[#3d2a20] flex items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{p.title || p.content || p.question}</h4>
                    <span className="bg-[#3d2a20] text-[#f47b31] text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                      {p.categoryLabel || 'GENERAL'}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 shrink-0 font-medium">{p.timeAgo}</span>
                </div>
              ))
            ) : (
              <div className="bg-[#231711] p-3 rounded-2xl border border-[#3d2a20] space-y-1">
                <h4 className="text-xs font-bold text-white">Idea for Smart Campus Navigator</h4>
                <div className="flex items-center justify-between">
                  <span className="bg-[#3d2a20] text-[#f47b31] text-[10px] font-bold px-2 py-0.5 rounded-full">GENERAL</span>
                  <span className="text-[10px] text-stone-400">2d ago</span>
                </div>
              </div>
            )
          ) : (
            myPollsList.length > 0 ? (
              myPollsList.map((p) => (
                <div key={p.id} className="bg-[#231711] p-3 rounded-2xl border border-[#3d2a20] flex items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{p.question || p.title}</h4>
                    <span className="bg-[#3d2a20] text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                      POLL
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 shrink-0 font-medium">{p.timeAgo}</span>
                </div>
              ))
            ) : (
              <div className="bg-[#231711] p-3 rounded-2xl border border-[#3d2a20] space-y-1">
                <h4 className="text-xs font-bold text-white">Should the library stay open 24/7 during finals?</h4>
                <div className="flex items-center justify-between">
                  <span className="bg-[#3d2a20] text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">ACADEMICS</span>
                  <span className="text-[10px] text-stone-400">1w ago</span>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Edit Profile Button Card */}
      <button
        onClick={onOpenEditProfile}
        className="w-full bg-[#2b1d16] hover:bg-[#34241c] border border-[#3d2a20] p-4 rounded-3xl flex items-center justify-between text-xs font-extrabold text-white transition cursor-pointer shadow-xs"
      >
        <span className="flex items-center gap-2">
          <Pencil className="w-4 h-4 text-[#f47b31]" /> Edit Profile
        </span>
        <ChevronRight className="w-4 h-4 text-stone-400" />
      </button>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 p-3.5 rounded-3xl flex items-center justify-center gap-2 text-xs font-extrabold text-red-300 transition cursor-pointer shadow-xs"
      >
        <LogOut className="w-4 h-4" /> Log Out
      </button>

      {/* Avatar Selector Modal */}
      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={user.avatarObj || AVATARS[0]}
        onSelectAvatar={(avatar) => {
          if (currentUser) {
            onOpenEditProfile && onOpenEditProfile();
          }
        }}
      />
    </div>
  );
}

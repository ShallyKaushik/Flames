import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Calendar, Pencil, FileText, MessageSquare, Heart, BarChart3, ChevronRight, LogOut, Loader2 } from 'lucide-react';
import { getAvatarUrl } from '../data/avatars';
import { AvatarSelectorModal } from '../components/AvatarSelectorModal';
import { getProfile, getMyPosts, getMyPolls, getPublicProfile, getPublicPosts, getPublicPolls } from '../services/backendStubs';

export function ProfileView({ currentUser, targetUserId, onLogout, onOpenEditProfile }) {
  const [activeTab, setActiveTab] = useState('my_posts');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [myPolls, setMyPolls] = useState([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const isPublicView = Boolean(targetUserId && targetUserId !== currentUser?._id && targetUserId !== currentUser?.id);

  useEffect(() => {
    setIsLoadingProfile(true);
    
    const profilePromise = isPublicView ? getPublicProfile(targetUserId) : getProfile();
    const postsPromise = isPublicView ? getPublicPosts(targetUserId) : getMyPosts();
    const pollsPromise = isPublicView ? getPublicPolls(targetUserId) : getMyPolls();

    Promise.all([
      profilePromise,
      postsPromise,
      pollsPromise,
    ])
      .then(([profileData, postsData, pollsData]) => {
        setProfile(profileData);
        setMyPosts(postsData);
        setMyPolls(pollsData);
      })
      .catch((err) => console.error('Failed to load profile', err))
      .finally(() => setIsLoadingProfile(false));
  }, [targetUserId, isPublicView]);

  // Use profile from backend, fallback to currentUser while loading
  const user = profile?.user || currentUser || {};
  const stats = profile?.stats || {};
  const activeAvatarUrl = getAvatarUrl(user.avatar);

  if (isLoadingProfile) {
    return (
      <div className="bg-[#1c120c] text-white min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#f47b31] animate-spin" />
      </div>
    );
  }

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
              {!isPublicView && (
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#f47b31] hover:bg-[#e0661c] text-white rounded-full flex items-center justify-center border border-[#2b1d16] shadow-md transition">
                  <Pencil className="w-3 h-3" />
                </div>
              )}
            </button>
          </div>

          {/* User Meta */}
          <div className="space-y-1 flex-1 min-w-0">
            <h1 className="text-lg font-extrabold text-white flex items-center gap-1.5 truncate">
              {user.fullName || user.username || '—'}
              <ShieldCheck className="w-4 h-4 text-sky-400 fill-sky-400/20 shrink-0" />
            </h1>
            <p className="text-xs text-stone-400 font-medium">@{user.username || '—'}</p>
            {(user.major || user.graduationYear) && (
              <p className="text-xs text-[#f47b31] font-extrabold pt-0.5">
                {user.major || 'Student'}{user.graduationYear ? ` • Class of ${user.graduationYear}` : ''}
              </p>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-[11px] text-stone-400 pt-1">
              {!isPublicView && (
                <span className="flex items-center gap-1 truncate">
                  <Mail className="w-3.5 h-3.5 text-[#f47b31]" /> {user.collegeEmail || user.email || '—'}
                </span>
              )}
              {user.createdAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#f47b31]" /> Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-[#2b1d16] border border-[#3d2a20] p-4 rounded-3xl space-y-1 text-left shadow-xs">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#f47b31]" />
            <span className="text-xl font-extrabold text-white">{myPosts.length}</span>
          </div>
          <p className="text-xs text-stone-400 font-medium">Posts</p>
        </div>

        <div className="bg-[#2b1d16] border border-[#3d2a20] p-4 rounded-3xl space-y-1 text-left shadow-xs">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#f47b31]" />
            <span className="text-xl font-extrabold text-white">{stats.comments ?? '—'}</span>
          </div>
          <p className="text-xs text-stone-400 font-medium">Comments</p>
        </div>

        <div className="bg-[#2b1d16] border border-[#3d2a20] p-4 rounded-3xl space-y-1 text-left shadow-xs">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#f47b31]" />
            <span className="text-xl font-extrabold text-white">{stats.likesReceived ?? '—'}</span>
          </div>
          <p className="text-xs text-stone-400 font-medium">Likes Received</p>
        </div>

        <div className="bg-[#2b1d16] border border-[#3d2a20] p-4 rounded-3xl space-y-1 text-left shadow-xs">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#f47b31]" />
            <span className="text-xl font-extrabold text-white">{myPolls.length}</span>
          </div>
          <p className="text-xs text-stone-400 font-medium">Polls Created</p>
        </div>
      </div>

      {/* Bio Card */}
      <div className="bg-[#2b1d16] border border-[#3d2a20] rounded-3xl p-4 space-y-2 relative shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Bio</h3>
          {!isPublicView && (
            <button
              onClick={onOpenEditProfile}
              className="p-1 text-stone-400 hover:text-[#f47b31] transition cursor-pointer"
              title="Edit bio"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <p className="text-xs text-stone-200 leading-relaxed whitespace-pre-line font-medium">
          {user.bio || 'No bio yet.'}
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
            myPosts.length > 0 ? (
              myPosts.map((p) => (
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
              <p className="text-xs text-stone-400 text-center py-4">No posts yet.</p>
            )
          ) : (
            myPolls.length > 0 ? (
              myPolls.map((p) => (
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
              <p className="text-xs text-stone-400 text-center py-4">No polls yet.</p>
            )
          )}
        </div>
      </div>

      {/* Edit Profile Button Card */}
      {!isPublicView && (
        <button
          onClick={onOpenEditProfile}
          className="w-full bg-[#2b1d16] hover:bg-[#34241c] border border-[#3d2a20] p-4 rounded-3xl flex items-center justify-between text-xs font-extrabold text-white transition cursor-pointer shadow-xs"
        >
          <span className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-[#f47b31]" /> Edit Profile
          </span>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>
      )}

      {/* Logout Button */}
      {!isPublicView && (
        <button
          onClick={onLogout}
          className="w-full bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 p-3.5 rounded-3xl flex items-center justify-center gap-2 text-xs font-extrabold text-red-300 transition cursor-pointer shadow-xs"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      )}

      {/* Avatar Selector Modal */}
      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={null}
        onSelectAvatar={(avatar) => {
          if (currentUser && !isPublicView) {
            onOpenEditProfile && onOpenEditProfile();
          }
        }}
      />
    </div>
  );
}

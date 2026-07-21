import React, { useState, useMemo } from 'react';
import { TopAppBar } from './components/TopAppBar';
import { NotificationsModal } from './components/NotificationsModal';
import { ProfileDrawer } from './components/ProfileDrawer';
import { FilterModal } from './components/FilterModal';
import { CreatePostModal } from './components/CreatePostModal';
import { CommentsModal } from './components/CommentsModal';
import { AnonymousMsgModal } from './components/AnonymousMsgModal';
import { ReportIssueModal } from './components/ReportIssueModal';
import { BottomNav } from './components/BottomNav';

import { HomeView } from './views/HomeView';
import { DiscoverView } from './views/DiscoverView';
import { InboxView } from './views/InboxView';
import { ProfileView } from './views/ProfileView';
import { EditProfileView } from './views/EditProfileView';
import { ProfileSetupView } from './views/ProfileSetupView';
import { AuthView } from './views/AuthView';

import { INITIAL_POSTS } from './data/initialPosts';
import { INITIAL_NOTIFICATIONS } from './data/notifications';
import { searchContent, applyFilters, fetchNotifications } from './services/backendStubs';
import { DEMO_CREDENTIALS } from './services/authApi';
import { AVATARS, DEFAULT_AVATAR } from './data/avatars';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Authentication State with localStorage persistence
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('flames_user');
      if (saved) return JSON.parse(saved);

      return {
        ...DEMO_CREDENTIALS.user,
        username: 'alexrivers',
        joinedDate: 'July 2026',
        bio: 'UI/UX Designer\nHackathon Enthusiast\nBuilding Flames 🔥',
        gender: 'Male',
        avatarObj: AVATARS[0],
        avatar: AVATARS[0].url || DEFAULT_AVATAR,
        hasCompletedSetup: true,
        postsCount: 14,
        commentsCount: 58,
        likesReceivedCount: 246,
        pollsCreatedCount: 5,
      };
    } catch (e) {
      return DEMO_CREDENTIALS.user;
    }
  });

  // Navigation State
  const [activeRoute, setActiveRoute] = useState('home');

  // Posts & Notifications State
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [isLoading, setIsLoading] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilters, setActiveFilters] = useState({ sortBy: 'newest', category: 'all' });

  // Modal Control States
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };
  
  const [createModalState, setCreateModalState] = useState({ isOpen: false, type: 'text' });
  const [commentsModalState, setCommentsModalState] = useState({ isOpen: false, post: null });
  const [anonMsgModalState, setAnonMsgModalState] = useState({ isOpen: false, post: null });

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    const updatedUser = {
      ...user,
      username: user.username || 'alexrivers',
      joinedDate: user.joinedDate || 'July 2026',
      bio: user.bio || 'UI/UX Designer\nHackathon Enthusiast\nBuilding Flames 🔥',
      gender: user.gender || 'Male',
      avatarObj: user.avatarObj || AVATARS[0],
      avatar: user.avatar || AVATARS[0].url || DEFAULT_AVATAR,
      hasCompletedSetup: user.hasCompletedSetup || false,
      postsCount: user.postsCount || 14,
      commentsCount: user.commentsCount || 58,
      likesReceivedCount: user.likesReceivedCount || 246,
      pollsCreatedCount: user.pollsCreatedCount || 5,
    };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('flames_user', JSON.stringify(updatedUser));
    } catch (e) {}
  };

  const handleCompleteSetup = (updatedUser) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('flames_user', JSON.stringify(updatedUser));
    } catch (e) {}
  };

  const handleSaveProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('flames_user', JSON.stringify(updatedUser));
    } catch (e) {}
    setActiveRoute('profile');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('flames_user');
    } catch (e) {}
  };

  // Filtered & Sorted Posts memoization
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter by Category Pill or Modal Category
    const currentCategory = activeCategory !== 'all' ? activeCategory : activeFilters.category;
    if (currentCategory && currentCategory !== 'all') {
      result = result.filter((p) => p.category === currentCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.content && p.content.toLowerCase().includes(q)) ||
          (p.author && p.author.name.toLowerCase().includes(q)) ||
          (p.categoryLabel && p.categoryLabel.toLowerCase().includes(q))
      );
    }

    // Apply Sorting
    if (activeFilters.sortBy === 'most_liked') {
      result.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
    } else if (activeFilters.sortBy === 'most_commented') {
      result.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0));
    }

    return result;
  }, [posts, activeCategory, activeFilters, searchQuery]);

  // Handlers
  const handleToggleNotifications = async () => {
    if (!isNotificationsOpen) {
      // TODO: connect to backend
      await fetchNotifications();
    }
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    // TODO: connect to backend
    searchContent(query);
  };

  const handleSelectCategory = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    if (filters.category !== 'all') {
      setActiveCategory(filters.category);
    }
    // TODO: connect to backend
    applyFilters(filters);
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  const handleCreatePost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setActiveRoute('home');
  };

  const handleClearNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // 1. If user is not logged in, render full Auth Screen
  if (!currentUser) {
    return <AuthView onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. First-time login profile setup check
  if (!currentUser.hasCompletedSetup) {
    return (
      <ProfileSetupView
        user={currentUser}
        onCompleteSetup={handleCompleteSetup}
      />
    );
  }

  const unreadCount = notifications.filter((n) => n.unread).length;
  const hasActiveFilters = activeFilters.sortBy !== 'newest' || activeFilters.category !== 'all';

  return (
    <div className="min-h-screen bg-[#1c120c] text-stone-100 max-w-lg mx-auto relative shadow-2xl overflow-hidden font-sans border-x border-[#2d201a]/50">
      {/* Top Application Header */}
      <TopAppBar
        unreadCount={unreadCount}
        onToggleNotifications={handleToggleNotifications}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenProfile={() => setActiveRoute('profile')}
      />

      {/* Success Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-950 border border-emerald-500/50 text-emerald-200 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-extrabold animate-slide-down">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Notifications Popover Dropdown */}
      <NotificationsModal
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onClearAll={handleClearNotifications}
      />

      {/* Profile Side Drawer */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        currentUser={currentUser}
        onClose={() => setIsProfileOpen(false)}
        onLogout={handleLogout}
        onNavigate={(route) => {
          setActiveRoute(route);
          setIsProfileOpen(false);
        }}
      />

      {/* Main View Router */}
      <main className="min-h-screen">
        {activeRoute === 'home' && (
          <HomeView
            posts={filteredPosts}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            onOpenFilter={() => setIsFilterOpen(true)}
            hasActiveFilters={hasActiveFilters}
            onOpenCreateModal={(type = 'text') => setCreateModalState({ isOpen: true, type })}
            onUpdatePost={handleUpdatePost}
            onOpenComments={(post) => setCommentsModalState({ isOpen: true, post })}
            onOpenAnonMsg={(post) => setAnonMsgModalState({ isOpen: true, post })}
            onResetFilters={() => {
              setActiveCategory('all');
              setSearchQuery('');
              setActiveFilters({ sortBy: 'newest', category: 'all' });
            }}
          />
        )}

        {activeRoute === 'discover' && (
          <DiscoverView
            onSelectCategory={(catId) => {
              setActiveCategory(catId);
              setActiveRoute('home');
            }}
          />
        )}

        {(activeRoute === 'inbox' || activeRoute === 'open_chat') && (
          <InboxView currentUser={currentUser} />
        )}

        {activeRoute === 'profile' && (
          <ProfileView
            userPosts={posts}
            currentUser={currentUser}
            onLogout={handleLogout}
            onOpenEditProfile={() => setActiveRoute('edit_profile')}
          />
        )}

        {activeRoute === 'edit_profile' && (
          <EditProfileView
            currentUser={currentUser}
            onSaveProfile={handleSaveProfile}
            onBack={() => setActiveRoute('profile')}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        activeRoute={activeRoute}
        onNavigate={(route) => setActiveRoute(route)}
        onOpenCreateModal={(type = 'text') => setCreateModalState({ isOpen: true, type })}
      />

      {/* Modals */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSuccessToast={showToast}
      />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        activeFilters={activeFilters}
        onApplyFilters={handleApplyFilters}
      />

      <CreatePostModal
        isOpen={createModalState.isOpen}
        initialType={createModalState.type}
        onClose={() => setCreateModalState({ isOpen: false, type: 'text' })}
        onSubmitPost={handleCreatePost}
      />

      <CommentsModal
        isOpen={commentsModalState.isOpen}
        post={commentsModalState.post}
        onClose={() => setCommentsModalState({ isOpen: false, post: null })}
      />

      <AnonymousMsgModal
        isOpen={anonMsgModalState.isOpen}
        post={anonMsgModalState.post}
        onClose={() => setAnonMsgModalState({ isOpen: false, post: null })}
      />
    </div>
  );
}

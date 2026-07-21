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

import { searchContent, applyFilters, fetchNotifications, fetchAllPosts, filterByCategory, createPost } from './services/backendStubs';
import { AVATARS, DEFAULT_AVATAR } from './data/avatars';
import { disconnectSocket } from './services/socket';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Authentication State with localStorage persistence
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('flames_user');
      const token = localStorage.getItem('flames_accessToken');
      // If user data exists but no token, clear the stale session
      if (saved && !token) {
        localStorage.removeItem('flames_user');
        localStorage.removeItem('flames_refreshToken');
        return null;
      }
      if (saved && token) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  // Navigation State
  const [activeRoute, setActiveRoute] = useState('home');
  const [targetProfileId, setTargetProfileId] = useState(null);

  // Posts & Notifications State
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      fetchAllPosts().then(data => {
        setPosts(data);
        setIsLoading(false);
      }).catch(err => {
        console.error("Failed to fetch posts", err);
        setIsLoading(false);
      });

      fetchNotifications().then(setNotifications).catch(console.error);

      import('./services/socket').then(({ initializeSocket }) => {
        const socket = initializeSocket();
        if (socket) {
          socket.on('notificationReceived', (rawNotif) => {
            import('./services/backendStubs').then(({ normalizeNotification }) => {
               setNotifications(prev => [normalizeNotification(rawNotif), ...prev]);
            });
          });
        }
      });
    }
  }, [currentUser]);

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
  const handleLoginSuccess = (loginResponse) => {
    const { user, accessToken, refreshToken } = loginResponse;
    const updatedUser = {
      ...user,
      hasCompletedSetup: true, // Assuming setup is done or not needed, adjust if you want ProfileSetupView
    };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('flames_user', JSON.stringify(updatedUser));
      if (accessToken) {
        localStorage.setItem('flames_accessToken', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('flames_refreshToken', refreshToken);
      }
    } catch (e) {}
    setActiveRoute('home');
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
    setTargetProfileId(null);
  };

  const handleNavigateProfile = (userId) => {
    if (userId === currentUser._id || userId === currentUser.id) {
      setActiveRoute('profile');
      setTargetProfileId(null);
    } else {
      setTargetProfileId(userId);
      setActiveRoute('profile');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    disconnectSocket();
    try {
      localStorage.removeItem('flames_user');
      localStorage.removeItem('flames_accessToken');
      localStorage.removeItem('flames_refreshToken');
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
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleSearchChange = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      fetchAllPosts().then(setPosts);
    } else {
      searchContent(query).then(setPosts);
    }
  };

  const handleSelectCategory = async (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      fetchAllPosts().then(setPosts);
    } else {
      filterByCategory(categoryId).then(setPosts);
    }
  };

  const handleApplyFilters = async (filters) => {
    setActiveFilters(filters);
    if (filters.category !== 'all') {
      setActiveCategory(filters.category);
    }
    applyFilters(filters).then(setPosts);
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleCreatePost = async (newPost) => {
    // newPost is already normalized from createPost() in CreatePostModal
    if (newPost) {
      setPosts((prev) => [newPost, ...prev]);
    }
    // Also refresh the whole feed to ensure consistency
    fetchAllPosts().then(setPosts).catch(() => {});
    setActiveRoute('home');
  };

  const handleClearNotifications = async () => {
    import('./services/backendStubs').then(({ markAllNotificationsRead }) => {
      markAllNotificationsRead().then(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
      });
    });
  };

  const handleMarkNotificationRead = async (id) => {
    import('./services/backendStubs').then(({ markNotificationRead }) => {
      markNotificationRead(id).then(() => {
        setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n));
      });
    });
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
        onOpenProfile={() => {
          setActiveRoute('profile');
          setTargetProfileId(null);
        }}
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
        onMarkRead={handleMarkNotificationRead}
      />

      {/* Profile Side Drawer */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        currentUser={currentUser}
        onClose={() => setIsProfileOpen(false)}
        onLogout={handleLogout}
        onNavigate={(route) => {
          setActiveRoute(route);
          if (route === 'profile') setTargetProfileId(null);
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
            onOpenCreateModal={(type = 'text', editData = null) => setCreateModalState({ isOpen: true, type, editData })}
            onUpdatePost={handleUpdatePost}
            onDeletePost={handleDeletePost}
            onEditPost={(post) => setCreateModalState({ isOpen: true, type: post.type, editData: post })}
            onOpenComments={(post) => setCommentsModalState({ isOpen: true, post })}
            onOpenAnonMsg={(post) => setAnonMsgModalState({ isOpen: true, post })}
            onNavigateProfile={handleNavigateProfile}
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
            currentUser={currentUser}
            targetUserId={targetProfileId}
            onLogout={handleLogout}
            onDeletePost={handleDeletePost}
            onUpdatePost={handleUpdatePost}
            onEditPost={(post) => setCreateModalState({ isOpen: true, type: post.type, editData: post })}
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
        onNavigate={(route) => {
          setActiveRoute(route);
          if (route === 'profile') setTargetProfileId(null);
        }}
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
        editData={createModalState.editData}
        onClose={() => setCreateModalState({ isOpen: false, type: 'text', editData: null })}
        onSubmitPost={handleCreatePost}
      />

      <CommentsModal
        isOpen={commentsModalState.isOpen}
        post={commentsModalState.post}
        onClose={() => setCommentsModalState({ isOpen: false, post: null })}
        onNavigateProfile={handleNavigateProfile}
      />

      <AnonymousMsgModal
        isOpen={anonMsgModalState.isOpen}
        post={anonMsgModalState.post}
        onClose={() => setAnonMsgModalState({ isOpen: false, post: null })}
      />
    </div>
  );
}

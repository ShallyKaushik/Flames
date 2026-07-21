import api from './api';
import { normalizePost, normalizePosts } from './normalizePost';

// ── helper: read current user _id from localStorage ──────────────────────────
function getCurrentUserId() {
  try {
    const saved = localStorage.getItem('flames_user');
    if (saved) {
      const u = JSON.parse(saved);
      return u._id || u.id || null;
    }
  } catch (_) {}
  return null;
}

// ── Posts ─────────────────────────────────────────────────────────────────────

export async function fetchAllPosts(params = {}) {
  const response = await api.get('/posts', { params });
  const raw = response.data.message || response.data.data;
  const posts = raw.posts || raw || [];
  return normalizePosts(posts, getCurrentUserId());
}

export async function searchContent(query) {
  if (!query || !query.trim()) return fetchAllPosts();
  const response = await api.get('/posts/search', { params: { query } });
  const raw = response.data.message || response.data.data;
  const posts = raw.posts || raw || [];
  return normalizePosts(posts, getCurrentUserId());
}

export async function filterByCategory(categoryId) {
  return fetchAllPosts({ category: categoryId });
}

export async function applyFilters(filters) {
  const params = {};
  if (filters.category && filters.category !== 'all') params.category = filters.category;
  if (filters.sortBy && filters.sortBy !== 'newest') params.sort = filters.sortBy;
  return fetchAllPosts(params);
}

export async function createPost(postData) {
  const postType = postData.type || 'text';

  // For image posts, we MUST use multipart/form-data
  if (postType === 'image') {
    const formData = new FormData();
    if (postData.title) formData.append('title', postData.title);
    if (postData.content || postData.description) {
      formData.append('content', postData.content || postData.description);
    }
    if (postData.category) formData.append('category', postData.category);
    formData.append('isAnonymous', postData.isAnonymous ? 'true' : 'false');
    formData.append('type', postType);

    if (postData.image instanceof File) {
      formData.append('image', postData.image);
    }

    const response = await api.post('/posts', formData);
    const raw = response.data.message || response.data.data;
    return normalizePost(raw, getCurrentUserId());
  }

  // For text and poll posts, send as standard JSON so Express parses nested objects (like poll options) correctly.
  const payload = {
    title: postData.title,
    content: postData.content || postData.description,
    category: postData.category,
    isAnonymous: !!postData.isAnonymous,
    type: postType,
  };

  if (postType === 'poll' && Array.isArray(postData.options)) {
    payload.poll = {
      question: postData.title || postData.question,
      options: postData.options.map(o => ({ text: typeof o === 'string' ? o : o.text })),
    };
  }

  const response = await api.post('/posts', payload);
  const raw = response.data.message || response.data.data;
  return normalizePost(raw, getCurrentUserId());
}

export async function updatePost(postId, postData) {
  const payload = {
    title: postData.title,
    content: postData.content || postData.description,
    category: postData.category,
    isAnonymous: !!postData.isAnonymous,
  };
  const response = await api.patch(`/posts/${postId}`, payload);
  const raw = response.data.message || response.data.data;
  return normalizePost(raw, getCurrentUserId());
}

export async function deletePost(postId) {
  await api.delete(`/posts/${postId}`);
}

// ── Likes ─────────────────────────────────────────────────────────────────────

export async function toggleLike(postId, isCurrentlyLiked) {
  if (isCurrentlyLiked) {
    await api.delete(`/likes/${postId}`);
  } else {
    await api.post(`/likes/${postId}`);
  }
}

// ── Comments ──────────────────────────────────────────────────────────────────

export async function fetchComments(postId) {
  const response = await api.get(`/comments/${postId}`);
  const raw = response.data.message || response.data.data;
  return raw.comments || raw || [];
}

export async function addComment(postId, content) {
  const response = await api.post(`/comments/${postId}`, { content });
  return response.data.message || response.data.data;
}

// ── Polls ─────────────────────────────────────────────────────────────────────

export async function castVote(postId, optionIndex) {
  const response = await api.post(`/posts/${postId}/vote`, { optionIndex });
  return response.data.message || response.data.data;
}

// ── Profile ───────────────────────────────────────────────────────────────────

export async function getProfile() {
  const response = await api.get('/profile');
  return response.data.message || response.data.data;
}

export async function updateProfile(data) {
  const response = await api.patch('/profile', data);
  return response.data.message || response.data.data;
}

export async function getMyPosts() {
  const response = await api.get('/profile/posts');
  const raw = response.data.message || response.data.data;
  const posts = raw.posts || raw || [];
  return normalizePosts(posts, getCurrentUserId());
}

export async function getMyPolls() {
  const response = await api.get('/profile/polls');
  const raw = response.data.message || response.data.data;
  const posts = raw.polls || raw.posts || raw || [];
  return normalizePosts(posts, getCurrentUserId());
}

export async function getPublicProfile(userId) {
  const response = await api.get(`/profile/${userId}`);
  return response.data.message || response.data.data;
}

export async function getPublicPosts(userId) {
  const response = await api.get(`/profile/${userId}/posts`);
  const raw = response.data.message || response.data.data;
  const posts = raw.posts || raw || [];
  return normalizePosts(posts, getCurrentUserId());
}

export async function getPublicPolls(userId) {
  const response = await api.get(`/profile/${userId}/polls`);
  const raw = response.data.message || response.data.data;
  const posts = raw.polls || raw.posts || raw || [];
  return normalizePosts(posts, getCurrentUserId());
}

// ── Announcements ─────────────────────────────────────────────────────────────

export async function fetchAnnouncements() {
  const response = await api.get('/announcements');
  const raw = response.data.message || response.data.data;
  return raw.announcements || raw || [];
}

// ── Discussion ────────────────────────────────────────────────────────────────

export async function fetchDiscussionMessages(page = 1, limit = 50) {
  const response = await api.get('/discussion/messages', { params: { page, limit } });
  const raw = response.data.message || response.data.data;
  return raw.messages || raw || [];
}

// ── Misc (stubs kept for components that aren't wired yet) ────────────────────

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export function normalizeNotification(n) {
  return {
    id: n._id,
    avatar: n.sender ? n.sender.avatar : 'fox-mascot',
    user: n.sender ? n.sender.fullName : 'Flames Admin',
    message: n.message,
    time: timeAgo(n.createdAt),
    unread: !n.isRead
  };
}

export async function fetchNotifications() {
  const response = await api.get('/notifications');
  const raw = response.data.message || response.data.data;
  return (raw || []).map(normalizeNotification);
}

export async function markNotificationRead(notificationId) {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data.message || response.data.data;
}

export async function markAllNotificationsRead() {
  const response = await api.patch('/notifications/read-all');
  return response.data.message || response.data.data;
}

export async function fetchOnlineUserCount() {
  // Not implemented in backend yet
  return null;
}

export async function openAnonymousMessage() {
  return null;
}

export async function joinTeam() {
  return null;
}

export async function reportIssue(reportData) {
  console.log('[Report] Issue reported:', reportData);
  return null;
}

// kept for backward-compat (no longer used)
export async function openComments(postId) {
  return fetchComments(postId);
}

export async function sendOpenChatMessage() {
  return null;
}

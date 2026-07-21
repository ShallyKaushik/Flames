/**
 * Flames Campus App - Backend Service Stubs
 * All functions include // TODO: connect to backend markers.
 */

// TODO: connect to backend - Submit user issue report
export async function reportIssue(reportData) {
  console.log('[API Stub] Submitting issue report:', reportData);
  // TODO: connect to backend - POST /api/v1/reports { topic, category, description }
  return new Promise((resolve) => setTimeout(resolve, 350));
}

// TODO: connect to backend - Fetch real-time active online user count
export async function fetchOnlineUserCount() {
  console.log('[API Stub] Fetching active online user count...');
  // TODO: connect to backend - GET /api/v1/open-chat/presence or WebSocket presence
  return new Promise((resolve) => setTimeout(() => resolve(142), 200));
}

// TODO: connect to backend - Fetch user notifications list
export async function fetchNotifications() {
  console.log('[API Stub] Fetching notifications...');
  // TODO: connect to backend - GET /api/v1/notifications
  return new Promise((resolve) => setTimeout(resolve, 300));
}

// TODO: connect to backend - Search posts, people, tags, and clubs
export async function searchContent(query) {
  console.log('[API Stub] Searching content for query:', query);
  // TODO: connect to backend - GET /api/v1/search?q={query}
  return new Promise((resolve) => setTimeout(resolve, 200));
}

// TODO: connect to backend - Apply feed filter and sorting criteria
export async function applyFilters(filters) {
  console.log('[API Stub] Applying feed filters:', filters);
  // TODO: connect to backend - POST /api/v1/feed/filter
  return new Promise((resolve) => setTimeout(resolve, 200));
}

// TODO: connect to backend - Filter feed by specific category ID
export async function filterByCategory(categoryId) {
  console.log('[API Stub] Filtering feed by category:', categoryId);
  // TODO: connect to backend - GET /api/v1/posts?category={categoryId}
  return new Promise((resolve) => setTimeout(resolve, 150));
}

// TODO: connect to backend - Create a new post (Text, Image, Poll, Team, Lost & Found)
export async function createPost(postData) {
  console.log('[API Stub] Creating post with payload:', postData);
  // TODO: connect to backend - POST /api/v1/posts
  return new Promise((resolve) => setTimeout(resolve, 400));
}

// TODO: connect to backend - Send message to Campus Open Chat shoutbox
export async function sendOpenChatMessage(messageData) {
  console.log('[API Stub] Sending message to Campus Open Chat:', messageData);
  // TODO: connect to backend - POST /api/v1/open-chat/messages
  return new Promise((resolve) => setTimeout(resolve, 200));
}

// TODO: connect to backend - Toggle like state for a post
export async function toggleLike(postId) {
  console.log('[API Stub] Toggling like for post ID:', postId);
  // TODO: connect to backend - POST /api/v1/posts/{postId}/like
  return new Promise((resolve) => setTimeout(resolve, 100));
}

// TODO: connect to backend - Open and fetch post comments
export async function openComments(postId) {
  console.log('[API Stub] Opening comments for post ID:', postId);
  // TODO: connect to backend - GET /api/v1/posts/{postId}/comments
  return new Promise((resolve) => setTimeout(resolve, 200));
}

// TODO: connect to backend - Send join request for a team request post
export async function joinTeam(postId) {
  console.log('[API Stub] Joining team for post ID:', postId);
  // TODO: connect to backend - POST /api/v1/teams/{postId}/join
  return new Promise((resolve) => setTimeout(resolve, 250));
}

// TODO: connect to backend - Cast vote on a live poll post
export async function castVote(postId, optionId) {
  console.log('[API Stub] Casting vote on poll ID:', postId, 'for option:', optionId);
  // TODO: connect to backend - POST /api/v1/polls/{postId}/vote
  return new Promise((resolve) => setTimeout(resolve, 200));
}

// TODO: connect to backend - Send anonymous DM/message to post author
export async function openAnonymousMessage(postId) {
  console.log('[API Stub] Opening anonymous message composer for post ID:', postId);
  // TODO: connect to backend - POST /api/v1/messages/anonymous
  return new Promise((resolve) => setTimeout(resolve, 150));
}

// TODO: connect to backend - Toggle bookmark/save state for a post
export async function toggleBookmark(postId) {
  console.log('[API Stub] Toggling bookmark for post ID:', postId);
  // TODO: connect to backend - POST /api/v1/users/me/bookmarks
  return new Promise((resolve) => setTimeout(resolve, 100));
}

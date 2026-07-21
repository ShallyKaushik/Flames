/**
 * Normalize a backend post object to the shape expected by the frontend card components.
 *
 * Backend shape (key fields):
 *   _id, type, category, isAnonymous, author { fullName, username, avatar },
 *   title, content, images[], poll { question, options[{ text, votes }], votedUsers[] },
 *   likes[], commentsCount, createdAt
 *
 * Frontend card shape:
 *   id, type, category, categoryLabel, timeAgo,
 *   author { name, sub, avatar, isAnonymous, verified },
 *   title, content, image,
 *   question, options[{ id, text, count, percentage }], totalVotes, userVotedOptionId,
 *   likesCount, commentsCount, isLiked
 */

const CATEGORY_LABELS = {
  general: 'GENERAL',
  academics: 'ACADEMICS',
  societies: 'SOCIETIES',
  teamup: 'TEAM UP',
  events: 'EVENTS',
  travel: 'TRAVEL',
  sports: 'SPORTS',
  'lost-found': 'LOST & FOUND',
  'buy-sell': 'BUY & SELL',
};

function timeAgo(dateStr) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * @param {Object} backendPost  - raw post from backend
 * @param {string} currentUserId - logged-in user's _id (for isLiked / userVotedOptionId)
 */
export function normalizePost(backendPost, currentUserId) {
  if (!backendPost) return null;

  const p = backendPost;
  const id = p._id?.toString() || p.id;

  // ---------- Author ----------
  const isAnonymous = !!p.isAnonymous;
  const author = {
    id: p.author?._id?.toString() || p.author?.id || null,
    _id: p.author?._id?.toString() || p.author?.id || null,
    name: isAnonymous ? 'Anonymous' : (p.author?.fullName || p.author?.username || 'Unknown'),
    sub: isAnonymous ? 'Campus Voice' : (p.author?.username ? `@${p.author.username}` : 'Student'),
    avatar: isAnonymous ? null : (p.author?.avatar || null),
    isAnonymous,
    verified: !isAnonymous,
  };

  // ---------- Likes ----------
  const likesArray = Array.isArray(p.likes) ? p.likes : [];
  const likesCount = p.likesCount ?? likesArray.length;
  const isLiked = currentUserId
    ? likesArray.some(l => (l?.toString?.() ?? l) === currentUserId)
    : false;

  // ---------- Poll ----------
  let question, options, totalVotes, userVotedOptionId;
  if (p.poll && p.poll.question) {
    question = p.poll.question;
    const rawOptions = p.poll.options || [];
    totalVotes = rawOptions.reduce((sum, o) => sum + (o.votes || 0), 0);
    options = rawOptions.map((o, idx) => ({
      id: o._id?.toString() || String(idx),
      text: o.text || '',
      count: o.votes || 0,
      percentage: totalVotes > 0 ? Math.round(((o.votes || 0) / totalVotes) * 100) : 0,
    }));

    // figure out which option the current user voted for
    const voteRecord = currentUserId && Array.isArray(p.poll.votedUsers)
      ? p.poll.votedUsers.find(v => (v.user?.toString?.() ?? v.user) === currentUserId)
      : null;
    userVotedOptionId = voteRecord != null ? options[voteRecord.optionIndex]?.id ?? null : null;
  }

  // ---------- Type ----------
  let type = p.type;
  if (!type) {
    if (question) {
      type = 'poll';
    } else if (p.images?.length > 0) {
      type = 'image';
    } else {
      type = 'text';
    }
  }

  // ---------- Image ----------
  const image = p.images?.[0] || null;

  return {
    id,
    type,
    category: p.category || 'general',
    categoryLabel: CATEGORY_LABELS[p.category] || (p.category?.toUpperCase() ?? 'GENERAL'),
    timeAgo: p.createdAt ? timeAgo(p.createdAt) : 'Recently',
    author,
    title: p.title || null,
    content: p.content || null,
    description: p.content || null,
    image,
    // Poll fields
    question: question || null,
    options: options || [],
    totalVotes: totalVotes ?? 0,
    userVotedOptionId: userVotedOptionId ?? null,
    // Stats
    likesCount,
    commentsCount: p.commentsCount ?? 0,
    isLiked,
    isBookmarked: false,
    isEdited: !!p.isEdited,
  };
}

export function normalizePosts(backendPosts, currentUserId) {
  return (backendPosts || []).map(p => normalizePost(p, currentUserId));
}

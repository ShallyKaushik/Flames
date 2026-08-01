import { getLikesForUserAndPosts } from "../repositories/like.repository.js";

export const populateUserLikesForPosts = async (posts, userId) => {
    if (!userId || !posts || posts.length === 0) return posts;
    
    // Ensure posts is an array
    const isSingle = !Array.isArray(posts);
    const postArray = isSingle ? [posts] : posts;

    // Get all post IDs
    const postIds = postArray.map(p => p._id);

    // Fetch user's likes for these posts
    const userLikes = await getLikesForUserAndPosts(userId, postIds);
    const likedPostIds = new Set(userLikes.map(l => l.post.toString()));

    // Attach likes array
    const populated = postArray.map(post => {
        // We modify the object in place. If it's a mongoose doc, it should be converted to plain object first,
        // but we assume the caller passes plain objects (e.g., after post.toObject())
        if (likedPostIds.has(post._id.toString())) {
            post.likes = [userId];
        } else {
            post.likes = [];
        }
        return post;
    });

    return isSingle ? populated[0] : populated;
};

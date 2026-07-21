import ApiError from "../utils/ApiError.js";

import {
    createLike,
    findLike,
    deleteLike,
    getLikesCount,
} from "../repositories/like.repository.js";

import {
    getPostById,
    incrementLikesCount,
    decrementLikesCount,
} from "../repositories/post.repository.js";

const likePostService = async (postId, userId) => {

    const post = await getPostById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const existingLike = await findLike(userId, postId);

    if (existingLike) {
        throw new ApiError(400, "You have already liked this post");
    }

    await createLike({
        user: userId,
        post: postId,
    });

    await incrementLikesCount(postId);

    return;
};

const unlikePostService = async (postId, userId) => {

    const post = await getPostById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const existingLike = await findLike(userId, postId);

    if (!existingLike) {
        throw new ApiError(400, "You have not liked this post");
    }

    await deleteLike(userId, postId);

    await decrementLikesCount(postId);

    return;
};

const getLikesService = async (postId, userId) => {

    const post = await getPostById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const likesCount = await getLikesCount(postId);

    const liked = await findLike(userId, postId);

    return {
        likesCount,
        likedByCurrentUser: !!liked,
    };
};

export {
    likePostService,
    unlikePostService,
    getLikesService,
};
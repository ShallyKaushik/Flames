import ApiError from "../utils/ApiError.js";
import {
    createPost,
    getAllPosts,
    getPostsCount,
    getPostById,
    updatePost,
    deletePost,
    searchPosts,
    searchPostsCount,
    getLastPostByUser,
    votePoll,
} from "../repositories/post.repository.js";
const expiryDays = {
    general: 3,
    academics: 5,
    societies: 5,
    teamup: 3,
    events: 5,
    travel: 2,
    sports: 7,
    "lost-found": 15,
    "buy-sell": 10,
};

import uploadOnCloudinary from "../utils/cloudinary.js";
import { createNotificationService } from "./notification.service.js";
import { broadcastNewPost } from "../socket/socketManager.js";
import { populateUserLikesForPosts } from "../utils/populateLikes.js";

const calculateExpiry = (category) => {
    const days = expiryDays[category];

    if (!days) return null;

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + days);

    return expiry;
};

// const createPostService = async (data, userId) => {
//     const post = await createPost({
//         ...data,
//         author: userId,
//         expiresAt: calculateExpiry(data.category),
//     });

//     return post;
// };

const getAllPostsService = async (query, userId) => {

    const {
        category,
        anonymous,
        page = 1,
        limit = 100,
        sort = "latest",
    } = query;

    const filter = {};

    if (category) {
        filter.category = category;
    }

    if (anonymous === "true") {
        filter.isAnonymous = true;
    }

    const sortOption =
        sort === "oldest"
            ? { createdAt: 1 }
            : { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const posts = await getAllPosts(
        filter,
        skip,
        Number(limit),
        sortOption
    );

    const totalPosts = await getPostsCount(filter);

    const formattedPosts = posts.map((post) => {

        const postObj = post.toObject();

        if (userId && postObj.author?._id) {
            postObj.isMe = postObj.author._id.toString() === userId.toString();
        }

        if (postObj.isAnonymous) {
            postObj.author = {
                fullName: "Anonymous",
                username: null,
                avatar: null,
            };
        }

        return postObj;

    });

    const populatedPosts = await populateUserLikesForPosts(formattedPosts, userId);

    return {
    posts: populatedPosts,

    pagination: {
        currentPage: Number(page),
        limit: Number(limit),
        totalPosts,
        totalPages: Math.ceil(totalPosts / Number(limit)),
        hasNextPage:
            Number(page) < Math.ceil(totalPosts / Number(limit)),
        hasPreviousPage:
            Number(page) > 1,
    },
};

};

//Search Posts :

const searchPostsService = async (queryParams, userId) => {

    const {
        query,
        category,
        page = 1,
        limit = 10,
    } = queryParams;

    const filter = {
        $or: [
            {
                title: {
                    $regex: query,
                    $options: "i",
                },
            },
            {
                content: {
                    $regex: query,
                    $options: "i",
                },
            },
        ],
    };

    if (category) {
        filter.category = category;
    }

    const skip =
        (Number(page) - 1) * Number(limit);

    const posts = await searchPosts(
        filter,
        skip,
        Number(limit)
    );

    const totalPosts =
        await searchPostsCount(filter);

    const formattedPosts = posts.map((post) => {

        const postObj = post.toObject();

        if (userId && postObj.author?._id) {
            postObj.isMe = postObj.author._id.toString() === userId.toString();
        }

        if (postObj.isAnonymous) {
            postObj.author = {
                fullName: "Anonymous",
                username: null,
                avatar: null,
            };
        }

        return postObj;

    });
    
    const populatedPosts = await populateUserLikesForPosts(formattedPosts, userId);

    return {

        posts: populatedPosts,

        pagination: {

            currentPage: Number(page),

            limit: Number(limit),

            totalPosts,

            totalPages: Math.ceil(
                totalPosts / Number(limit)
            ),

            hasNextPage:
                Number(page) <
                Math.ceil(totalPosts / Number(limit)),

            hasPreviousPage:
                Number(page) > 1,
        },

    };

};

const getPostByIdService = async (postId, userId) => {

    const post = await getPostById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const postObj = post.toObject();

    if (userId && postObj.author?._id) {
        postObj.isMe = postObj.author._id.toString() === userId.toString();
    }

    if (postObj.isAnonymous) {
        postObj.author = {
            fullName: "Anonymous",
            username: null,
            avatar: null,
        };
    }

    const populatedPost = await populateUserLikesForPosts(postObj, userId);

    return populatedPost;
};

const updatePostService = async (postId, user, data) => {

    const post = await getPostById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (post.author._id.toString() !== user._id.toString() && user.role !== "admin") {
        throw new ApiError(403, "You are not allowed to update this post");
    }

    data.isEdited = true;

    if (data.category) {
        data.expiresAt = calculateExpiry(data.category);
    }

    return await updatePost(postId, data);
};

const deletePostService = async (postId, user) => {

    const post = await getPostById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (post.author._id.toString() !== user._id.toString() && user.role !== "admin") {
        throw new ApiError(403, "You are not allowed to delete this post");
    }

    await deletePost(postId);

    if (post.author._id.toString() !== user._id.toString() && user.role === "admin") {
        await createNotificationService({
            recipient: post.author._id,
            sender: user._id,
            type: "admin_deletion",
            title: "Post Removed",
            message: `Your post '${post.title}' was removed by an admin.`,
            relatedPost: null
        });
    }

    return;
};

const createPostService = async (data, user, file) => {

    if (user.role !== "admin") {
        const lastPost = await getLastPostByUser(user._id);
        if (lastPost) {
            const cooldownInMs = 2 * 60 * 1000; // 2 minutes
            const timeSinceLastPost = Date.now() - new Date(lastPost.createdAt).getTime();
            if (timeSinceLastPost < cooldownInMs) {
                const remainingTimeMs = cooldownInMs - timeSinceLastPost;
                const remainingMinutes = Math.floor(remainingTimeMs / (1000 * 60));
                const remainingSeconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);
                throw new ApiError(403, `You can only post once every 2 minutes. Please wait ${remainingMinutes}m ${remainingSeconds}s.`);
            }
        }
    }

    let imageUrl = null;

    if (file) {
        imageUrl = await uploadOnCloudinary(file.path);
    }

    const post = await createPost({

        ...data,

        author: user._id,

        expiresAt: calculateExpiry(data.category),

        images: imageUrl ? [imageUrl] : [],

    });

    const populatedPost = await getPostByIdService(post._id, user._id);
    
    // Broadcast without the specific user's isMe flag
    const broadcastData = { ...populatedPost, isMe: false };
    broadcastNewPost(broadcastData);

    return populatedPost;

};

const votePollService = async (
    postId,
    userId,
    optionIndex
) => {

    const post = await getPostById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (!post.poll || !post.poll.question) {
        throw new ApiError(400, "This post has no poll");
    }

    if (
        post.poll.expiresAt &&
        new Date() > new Date(post.poll.expiresAt)
    ) {
        throw new ApiError(400, "Poll has expired");
    }

    if (
        optionIndex < 0 ||
        optionIndex >= post.poll.options.length
    ) {
        throw new ApiError(400, "Invalid poll option");
    }

    const alreadyVotedIndex = post.poll.votedUsers.findIndex(
        (vote) => vote.user.toString() === userId.toString()
    );

    if (alreadyVotedIndex !== -1) {
        const previousVote = post.poll.votedUsers[alreadyVotedIndex];
        
        // If clicking the same option, undo the vote
        if (previousVote.optionIndex === optionIndex) {
            post.poll.options[optionIndex].votes -= 1;
            post.poll.votedUsers.splice(alreadyVotedIndex, 1);
        } else {
            // Change vote to new option
            post.poll.options[previousVote.optionIndex].votes -= 1;
            post.poll.options[optionIndex].votes += 1;
            post.poll.votedUsers[alreadyVotedIndex].optionIndex = optionIndex;
        }
    } else {
        // New vote
        post.poll.options[optionIndex].votes += 1;
        post.poll.votedUsers.push({
            user: userId,
            optionIndex,
        });
    }

    await votePoll(post);

    return post.poll;

};

export {
    createPostService,
    getAllPostsService,
    getPostByIdService,
    updatePostService,
    deletePostService,
    searchPostsService,
    votePollService
};
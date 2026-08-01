import {
    getProfile,
    updateProfile,
    getMyPosts,
    getMyPolls,
    countPosts,
    countComments,
    countPolls,
    countLikesReceived,
    getPublicProfile,
} from "../repositories/profile.repository.js";

import ApiError from "../utils/ApiError.js";
import { populateUserLikesForPosts } from "../utils/populateLikes.js";

const getProfileService = async (userId) => {

    const user = await getProfile(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const [
        posts,
        comments,
        polls,
        likesReceived,
    ] = await Promise.all([
        countPosts(userId),
        countComments(userId),
        countPolls(userId),
        countLikesReceived(userId),
    ]);

    return {

        user,

        stats: {

            posts,
            comments,
            polls,
            likesReceived,

        },

    };

};

const getPublicProfileService = async (userId) => {
    const user = await getPublicProfile(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const [
        posts,
        comments,
        polls,
        likesReceived,
    ] = await Promise.all([
        countPosts(userId),
        countComments(userId),
        countPolls(userId),
        countLikesReceived(userId),
    ]);

    return {
        user,
        stats: {
            posts,
            comments,
            polls,
            likesReceived,
        },
    };
};

const updateProfileService = async (
    userId,
    data
) => {

    return await updateProfile(
        userId,
        data
    );

};

const getMyPostsService = async (
    userId,
    page = 1,
    limit = 10,
    requestingUserId = userId
) => {

    const skip =
        (page - 1) * limit;

    const posts = await getMyPosts(
        userId,
        skip,
        Number(limit)
    );

    const formatted = posts.map(p => p.toObject());
    return await populateUserLikesForPosts(formatted, requestingUserId);

};

const getMyPollsService = async (
    userId,
    page = 1,
    limit = 10,
    requestingUserId = userId
) => {

    const skip =
        (page - 1) * limit;

    const polls = await getMyPolls(
        userId,
        skip,
        Number(limit)
    );

    const formatted = polls.map(p => p.toObject());
    return await populateUserLikesForPosts(formatted, requestingUserId);

};

export {
    getProfileService,
    getPublicProfileService,
    updateProfileService,
    getMyPostsService,
    getMyPollsService,
};
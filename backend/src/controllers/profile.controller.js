import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
    getProfileService,
    getPublicProfileService,
    updateProfileService,
    getMyPostsService,
    getMyPollsService,
} from "../services/profile.service.js";

const getProfile = asyncHandler(async (req, res) => {

    const profile =
        await getProfileService(req.user._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            profile,
            "Profile fetched successfully"
        )
    );

});

const getPublicProfile = asyncHandler(async (req, res) => {

    const profile =
        await getPublicProfileService(req.params.userId);

    return res.status(200).json(
        new ApiResponse(
            200,
            profile,
            "Public profile fetched successfully"
        )
    );

});

const updateProfile = asyncHandler(async (req, res) => {

    const profile =
        await updateProfileService(
            req.user._id,
            req.body
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            profile,
            "Profile updated successfully"
        )
    );

});

const getMyPosts = asyncHandler(async (req, res) => {

    const posts =
        await getMyPostsService(
            req.user._id,
            req.query.page,
            req.query.limit
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            posts,
            "Posts fetched successfully"
        )
    );

});

const getMyPolls = asyncHandler(async (req, res) => {

    const polls =
        await getMyPollsService(
            req.user._id,
            req.query.page,
            req.query.limit
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            polls,
            "Polls fetched successfully"
        )
    );

});

const getPublicPosts = asyncHandler(async (req, res) => {
    const posts = await getMyPostsService(
        req.params.userId,
        req.query.page,
        req.query.limit
    );
    return res.status(200).json(
        new ApiResponse(200, posts, "Public posts fetched")
    );
});

const getPublicPolls = asyncHandler(async (req, res) => {
    const polls = await getMyPollsService(
        req.params.userId,
        req.query.page,
        req.query.limit
    );
    return res.status(200).json(
        new ApiResponse(200, polls, "Public polls fetched")
    );
});

export {
    getProfile,
    getPublicProfile,
    updateProfile,
    getMyPosts,
    getMyPolls,
    getPublicPosts,
    getPublicPolls,
};
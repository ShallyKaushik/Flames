import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
    likePostService,
    unlikePostService,
    getLikesService,
} from "../services/like.service.js";

const likePost = asyncHandler(async (req, res) => {

    await likePostService(
        req.params.postId,
        req.user._id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Post liked successfully"
        )
    );

});

const unlikePost = asyncHandler(async (req, res) => {

    await unlikePostService(
        req.params.postId,
        req.user._id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Post unliked successfully"
        )
    );

});

const getLikes = asyncHandler(async (req, res) => {

    const result = await getLikesService(
        req.params.postId,
        req.user._id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Likes fetched successfully"
        )
    );

});

export {
    likePost,
    unlikePost,
    getLikes,
};
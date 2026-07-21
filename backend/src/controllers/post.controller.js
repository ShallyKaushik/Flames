import {
    createPostService,
    getAllPostsService,
    getPostByIdService,
    updatePostService,
    deletePostService,
    searchPostsService,
    votePollService
} from "../services/post.service.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

const createPost = asyncHandler(async (req, res) => {

    const post = await createPostService(
        req.body,
        req.user._id,
        req.file
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            post,
            "Post created successfully"
        )
    );

});

const getAllPosts = asyncHandler(async (req, res) => {

   const posts = await getAllPostsService(req.query);

    return res.status(200).json(
        new ApiResponse(
            200,
            posts,
            "Posts fetched successfully"
        )
    );

});

const searchPosts = asyncHandler(async (req, res) => {

    const result =
        await searchPostsService(req.query);

    return res.status(200).json(

        new ApiResponse(

            200,

            result,

            "Search results fetched successfully"

        )

    );

});

const getPostById = asyncHandler(async (req, res) => {

    const post = await getPostByIdService(req.params.postId);

    return res.status(200).json(
        new ApiResponse(
            200,
            post,
            "Post fetched successfully"
        )
    );

});

const updatePost = asyncHandler(async (req, res) => {

    const post = await updatePostService(
        req.params.postId,
        req.user,
        req.body
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            post,
            "Post updated successfully"
        )
    );

});

const deletePost = asyncHandler(async (req, res) => {

    await deletePostService(
        req.params.postId,
        req.user
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Post deleted successfully"
        )
    );

});

const votePoll = asyncHandler(async (req, res) => {

    const poll = await votePollService(
        req.params.postId,
        req.user._id,
        req.body.optionIndex
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            poll,
            "Vote recorded successfully"
        )
    );

});

export {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    searchPosts,
    votePoll
};
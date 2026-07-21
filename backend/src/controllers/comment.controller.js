import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
    createCommentService,
    getCommentsService,
    updateCommentService,
    deleteCommentService,
} from "../services/comment.service.js";

const createComment = asyncHandler(async (req, res) => {

    const comment =
        await createCommentService(
            req.params.postId,
            req.user._id,
            req.body.content
        );

    return res.status(201).json(
        new ApiResponse(
            201,
            comment,
            "Comment added successfully"
        )
    );

});

const getComments = asyncHandler(async (req, res) => {

    const comments =
        await getCommentsService(
            req.params.postId,
            req.query.page,
            req.query.limit
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            comments,
            "Comments fetched successfully"
        )
    );

});

const updateComment = asyncHandler(async (req, res) => {

    const comment =
        await updateCommentService(
            req.params.commentId,
            req.user._id,
            req.body
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            comment,
            "Comment updated successfully"
        )
    );

});

const deleteComment = asyncHandler(async (req, res) => {

    await deleteCommentService(
        req.params.commentId,
        req.user._id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Comment deleted successfully"
        )
    );

});

export {
    createComment,
    getComments,
    updateComment,
    deleteComment,
};
import ApiError from "../utils/ApiError.js";

import {
    createComment,
    getComments,
    getCommentsCount,
    getCommentById,
    updateComment,
    deleteComment,
} from "../repositories/comment.repository.js";

import {
    getPostById,
    incrementCommentsCount,
    decrementCommentsCount,
} from "../repositories/post.repository.js";

const createCommentService = async (
    postId,
    userId,
    content
) => {

    const post = await getPostById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const comment = await createComment({
        post: postId,
        author: userId,
        content,
    });

    await incrementCommentsCount(postId);

    return comment;

};

const getCommentsService = async (
    postId,
    page = 1,
    limit = 10
) => {

    const post = await getPostById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const skip =
        (Number(page) - 1) * Number(limit);

    const comments = await getComments(
        postId,
        skip,
        Number(limit)
    );

    const totalComments =
        await getCommentsCount(postId);

    return {

        comments,

        pagination: {

            currentPage: Number(page),

            limit: Number(limit),

            totalComments,

            totalPages: Math.ceil(
                totalComments / Number(limit)
            ),

        },

    };

};

const updateCommentService = async (
    commentId,
    userId,
    data
) => {

    const comment =
        await getCommentById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (
        comment.author._id.toString() !==
        userId.toString()
    ) {
        throw new ApiError(
            403,
            "You are not allowed to update this comment"
        );
    }

    data.isEdited = true;

    return await updateComment(
        commentId,
        data
    );

};

const deleteCommentService = async (
    commentId,
    userId
) => {

    const comment =
        await getCommentById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (
        comment.author._id.toString() !==
        userId.toString()
    ) {
        throw new ApiError(
            403,
            "You are not allowed to delete this comment"
        );
    }

    await deleteComment(commentId);

    await decrementCommentsCount(
        comment.post
    );

};

export {
    createCommentService,
    getCommentsService,
    updateCommentService,
    deleteCommentService,
};
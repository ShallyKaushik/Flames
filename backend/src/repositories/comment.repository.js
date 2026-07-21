import Comment from "../models/comment.model.js";

const createComment = (data) => {
    return Comment.create(data);
};

const getComments = (
    postId,
    skip,
    limit
) => {

    return Comment.find({
        post: postId,
    })
        .populate("author", "fullName username avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

};

const getCommentsCount = (postId) => {

    return Comment.countDocuments({
        post: postId,
    });

};

const getCommentById = (commentId) => {

    return Comment.findById(commentId)
        .populate("author", "fullName username avatar");

};

const updateComment = (
    commentId,
    data
) => {

    return Comment.findByIdAndUpdate(
        commentId,
        data,
        {
            new: true,
            runValidators: true,
        }
    ).populate("author", "fullName username avatar");

};

const deleteComment = (commentId) => {

    return Comment.findByIdAndDelete(commentId);

};

export {
    createComment,
    getComments,
    getCommentsCount,
    getCommentById,
    updateComment,
    deleteComment,
};
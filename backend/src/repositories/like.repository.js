import Like from "../models/like.model.js";

const createLike = (data) => {
    return Like.create(data);
};

const findLike = (userId, postId) => {
    return Like.findOne({
        user: userId,
        post: postId,
    });
};

const deleteLike = (userId, postId) => {
    return Like.findOneAndDelete({
        user: userId,
        post: postId,
    });
};

const getLikesCount = (postId) => {
    return Like.countDocuments({
        post: postId,
    });
};

export {
    createLike,
    findLike,
    deleteLike,
    getLikesCount,
};
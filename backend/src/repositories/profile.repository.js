import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

const getProfile = (userId) => {
    return User.findById(userId).select("-password -refreshToken");
};

const updateProfile = (userId, data) => {

    return User.findByIdAndUpdate(
        userId,
        data,
        {
            new: true,
            runValidators: true,
        }
    ).select("-password -refreshToken");

};

const getMyPosts = async (
    userId,
    skip,
    limit
) => {

    return await Post.find({
        author: userId,
        $or: [
            { expiresAt: null },
            { expiresAt: { $gt: new Date() } },
        ],
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

};

const getMyPolls = async (
    userId,
    skip,
    limit
) => {

    return await Post.find({
        author: userId,
        "poll.question": { $exists: true },
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

};

const countPosts = (userId) => {

    return Post.countDocuments({
        author: userId,
    });

};

const countComments = (userId) => {

    return Comment.countDocuments({
        author: userId,
    });

};

const countPolls = (userId) => {

    return Post.countDocuments({
        author: userId,
        "poll.question": { $exists: true },
    });

};

const countLikesReceived = async (userId) => {

    const result = await Post.aggregate([
        {
            $match: {
                author: userId,
            },
        },
        {
            $group: {
                _id: null,
                totalLikes: {
                    $sum: "$likesCount",
                },
            },
        },
    ]);

    return result.length
        ? result[0].totalLikes
        : 0;

};

export {
    getProfile,
    updateProfile,
    getMyPosts,
    getMyPolls,
    countPosts,
    countComments,
    countPolls,
    countLikesReceived,
};
import Post from "../models/post.model.js";

const createPost = (data) => {

    return Post.create(data);

};

const getAllPosts = async (
    filter,
    skip,
    limit,
    sort
) => {

    return await Post.find(filter)
        .populate("author", "fullName username avatar")
        .sort(sort)
        .skip(skip)
        .limit(limit);

};

const searchPosts = async (
    filter,
    skip,
    limit
) => {

    return await Post.find(filter)
        .populate("author", "fullName username avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

};

const searchPostsCount = async (filter) => {
    return await Post.countDocuments(filter);
};

const getPostsCount = async (filter) => {
    return await Post.countDocuments(filter);
};

const getPostById = (postId) => {
    return Post.findById(postId)
        .populate("author", "fullName username avatar");
};

const updatePost = (postId, data) => {
    return Post.findByIdAndUpdate(
        postId,
        data,
        {
            new: true,
            runValidators: true,
        }
    ).populate("author", "fullName username avatar");
};

const deletePost = (postId) => {
    return Post.findByIdAndDelete(postId);
};

const votePoll = async (post) => {
    return await post.save();
};

const incrementLikesCount = async (postId) => {
    return await Post.findByIdAndUpdate(
        postId,
        { $inc: { likesCount: 1 } },
        { new: true }
    );
};

const decrementLikesCount = async (postId) => {
    return await Post.findByIdAndUpdate(
        postId,
        { $inc: { likesCount: -1 } },
        { new: true }
    );
};

const getLikesCount = async (postId) => {
    return await Post.findById(postId).select("likesCount");
};

const incrementCommentsCount = async (postId) => {

    return await Post.findByIdAndUpdate(
        postId,
        {
            $inc: {
                commentsCount: 1,
            },
        },
        {
            new: true,
        }
    );

};

const decrementCommentsCount = async (postId) => {

    return await Post.findByIdAndUpdate(
        postId,
        {
            $inc: {
                commentsCount: -1,
            },
        },
        {
            new: true,
        }
    );

};

export {

    createPost,
    getAllPosts,
    getPostsCount,
    getPostById,
    updatePost,
    deletePost,
    searchPosts,
    searchPostsCount,
    votePoll,
    incrementLikesCount,
    decrementLikesCount,
    getLikesCount,
    incrementCommentsCount,
    decrementCommentsCount
};
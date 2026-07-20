import Post from "../models/post.model.js";

const createPost = (data) => {

    return Post.create(data);

};

const getAllPosts = (page, limit) => {
    return Post.find()
        .populate("author", "fullName username avatar")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
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

export {

    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
};
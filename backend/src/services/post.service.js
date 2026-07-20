import ApiError from "../utils/ApiError.js";
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
} from "../repositories/post.repository.js";
const expiryDays = {
    general: 3,
    academics: 5,
    societies: 5,
    teamup: 3,
    events: 5,
    travel: 2,
    sports: 7,
    "lost-found": 15,
    "buy-sell": 10,
};

import uploadOnCloudinary from "../utils/cloudinary.js";

const calculateExpiry = (category) => {
    const days = expiryDays[category];

    if (!days) return null;

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + days);

    return expiry;
};

// const createPostService = async (data, userId) => {
//     const post = await createPost({
//         ...data,
//         author: userId,
//         expiresAt: calculateExpiry(data.category),
//     });

//     return post;
// };

const getAllPostsService = async () => {

    const posts = await getAllPosts();

    const formattedPosts = posts.map((post) => {

        const postObj = post.toObject();

        if (postObj.isAnonymous) {

            postObj.author = {
                fullName: "Anonymous",
                username: null,
                avatar: null,
            };

        }

        return postObj;

    });

    return formattedPosts;

};

const getPostByIdService = async (postId) => {

    const post = await getPostById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const postObj = post.toObject();

    if (postObj.isAnonymous) {
        postObj.author = {
            fullName: "Anonymous",
            username: null,
            avatar: null,
        };
    }

    return postObj;
};

const updatePostService = async (postId, userId, data) => {

    const post = await getPostById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (post.author._id.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to update this post");
    }

    data.isEdited = true;

    if (data.category) {
        data.expiresAt = calculateExpiry(data.category);
    }

    return await updatePost(postId, data);
};

const deletePostService = async (postId, userId) => {

    const post = await getPostById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (post.author._id.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to delete this post");
    }

    await deletePost(postId);

    return;
};

const createPostService = async (data, userId, file) => {

    let imageUrl = null;

    if (file) {
        imageUrl = await uploadOnCloudinary(file.path);
    }

    const post = await createPost({

        ...data,

        author: userId,

        expiresAt: calculateExpiry(data.category),

        images: imageUrl ? [imageUrl] : [],

    });

    return post;

};

export {
    createPostService,
    getAllPostsService,
    getPostByIdService,
    updatePostService,
    deletePostService,
};
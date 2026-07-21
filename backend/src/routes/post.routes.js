import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createPostValidator, postIdValidator, updatePostValidator,votePollValidator,} from "../validators/post.validator.js";
import { createPost , getAllPosts, getPostById, updatePost, deletePost,searchPosts,votePoll} from "../controllers/post.controller.js";

import upload from "../middlewares/multer.middleware.js";
import { getPostsValidator } from "../validators/feed.validator.js";
import { searchPostsValidator } from "../validators/search.validator.js";

const router = Router();

router.post(
    "/",
    verifyJWT,
    upload.single("image"),
    createPostValidator,
    validate,
    createPost
);

router.get(
    "/",
    verifyJWT,
    getAllPosts,
    getPostsValidator,
    validate
);

router.get(
    "/search",
    searchPostsValidator,
    validate,
    searchPosts
);

router.get(
    "/:postId",
    verifyJWT,
    getPostById
);

router.patch(
    "/:postId",
    verifyJWT,
    postIdValidator,
    updatePostValidator,
    validate,
    updatePost
);

router.delete(
    "/:postId",
    verifyJWT,
    postIdValidator,
    validate,
    deletePost
);

router.post(
    "/:postId/vote",
    verifyJWT,
    votePollValidator,
    validate,
    votePoll
);

export default router;

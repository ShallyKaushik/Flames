import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createPostValidator, postIdValidator, updatePostValidator,} from "../validators/post.validator.js";
import { createPost , getAllPosts, getPostById, updatePost, deletePost} from "../controllers/post.controller.js";

const router = Router();

router.post(
    "/",
    verifyJWT,
    createPostValidator,
    validate,
    createPost
);

router.get(
    "/",
    verifyJWT,
    getAllPosts
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

export default router;

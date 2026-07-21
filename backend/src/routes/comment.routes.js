import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
    createComment,
    getComments,
    updateComment,
    deleteComment,
} from "../controllers/comment.controller.js";

import {
    createCommentValidator,
    updateCommentValidator,
    commentIdValidator,
    postIdValidator,
} from "../validators/comment.validator.js";

const router = Router();

router.post(
    "/:postId",
    verifyJWT,
    createCommentValidator,
    validate,
    createComment
);

router.get(
    "/:postId",
    verifyJWT,
    postIdValidator,
    validate,
    getComments
);

router.patch(
    "/:commentId",
    verifyJWT,
    updateCommentValidator,
    validate,
    updateComment
);

router.delete(
    "/:commentId",
    verifyJWT,
    commentIdValidator,
    validate,
    deleteComment
);

export default router;
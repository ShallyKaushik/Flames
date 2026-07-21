import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import { likeValidator } from "../validators/like.validator.js";

import {
    likePost,
    unlikePost,
    getLikes,
} from "../controllers/like.controller.js";

const router = Router();

router.post(
    "/:postId",
    verifyJWT,
    likeValidator,
    validate,
    likePost
);

router.delete(
    "/:postId",
    verifyJWT,
    likeValidator,
    validate,
    unlikePost
);

router.get(
    "/:postId",
    verifyJWT,
    likeValidator,
    validate,
    getLikes
);

export default router;
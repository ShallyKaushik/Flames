import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
    getProfile,
    getPublicProfile,
    updateProfile,
    getMyPosts,
    getMyPolls,
    getPublicPosts,
    getPublicPolls,
} from "../controllers/profile.controller.js";

import {
    updateProfileValidator,
} from "../validators/profile.validator.js";

const router = Router();

router.get(
    "/",
    verifyJWT,
    getProfile
);

router.patch(
    "/",
    verifyJWT,
    updateProfileValidator,
    validate,
    updateProfile
);

router.get(
    "/posts",
    verifyJWT,
    getMyPosts
);

router.get(
    "/polls",
    verifyJWT,
    getMyPolls
);

router.get(
    "/:userId",
    verifyJWT,
    getPublicProfile
);

router.get(
    "/:userId/posts",
    verifyJWT,
    getPublicPosts
);

router.get(
    "/:userId/polls",
    verifyJWT,
    getPublicPolls
);

export default router;
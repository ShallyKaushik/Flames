import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
    getProfile,
    updateProfile,
    getMyPosts,
    getMyPolls,
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

export default router;
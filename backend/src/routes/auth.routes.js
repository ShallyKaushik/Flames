import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
    googleLogin,
    getCurrentUser,
    logout,
    refreshToken,
    completeProfile,
    checkUsername
} from "../controllers/auth.controller.js";
import { googleLoginValidator, completeProfileValidator } from "../validators/auth.validator.js";
import validate from "../middlewares/validate.middleware.js";
import postRoutes from "./post.routes.js";

const router = express.Router();

router.post(
    "/google",
    googleLoginValidator,
    validate,
    googleLogin
);

router.get(
    "/me",
    verifyJWT,
    getCurrentUser
);

router.post(
    "/logout",
    verifyJWT,
    logout
);

router.post(
    "/refresh-token",
    refreshToken
);

router.post(
    "/complete-profile",
    completeProfileValidator,
    validate,
    completeProfile
);

router.get(
    "/check-username",
    checkUsername
);

router.use("/posts", postRoutes);

export default router;
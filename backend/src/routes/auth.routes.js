import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
    register,
    verifyOTP,
    login,
    getCurrentUser,
    logout,
    refreshToken
} from "../controllers/auth.controller.js";

import {
    registerValidator,
    verifyOTPValidator,
    loginValidator
} from "../validators/auth.validator.js";

import validate from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post(
    "/register",
    registerValidator,
    validate,
    register
);

router.post(
    "/verify-otp",
    verifyOTPValidator,
    validate,
    verifyOTP
);

router.post(

    "/login",

    loginValidator,

    validate,

    login

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

import postRoutes from "./post.routes.js";

router.use("/posts", postRoutes);

export default router;
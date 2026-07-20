import express from "express";

import {
    register,
    verifyOTP,
    login
} from "../controllers/auth.controller.js";

import {
    registerValidator,
    verifyOTPValidator
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

router.post("/login", login);

export default router;
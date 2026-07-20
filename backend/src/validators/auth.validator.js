import { body } from "express-validator";

export const registerValidator = [

    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full Name is required"),

    body("username")
        .trim()
        .isLength({ min: 4 })
        .withMessage("Username must be at least 4 characters"),

    body("collegeEmail")
        .isEmail()
        .withMessage("Invalid College Email"),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must contain at least 8 characters")

];

export const updatePendingUser = (email, data) =>
    PendingUser.findOneAndUpdate(
        { collegeEmail: email },
        data,
        { new: true, upsert: true }
    );

export const createUser = (data) =>
    User.create(data);

export const verifyOTPValidator = [

    body("collegeEmail")
        .isEmail()
        .withMessage("Valid email required"),

    body("otp")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits")

];

export const loginValidator = [

    body("collegeEmail")
        .isEmail()
        .withMessage("Valid email is required"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")

];
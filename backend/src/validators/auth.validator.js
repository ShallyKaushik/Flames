import { body } from "express-validator";

export const googleLoginValidator = [
    body("idToken")
        .notEmpty()
        .withMessage("ID Token is required")
];

export const completeProfileValidator = [
    body("idToken").notEmpty().withMessage("ID Token is required"),
    body("username").notEmpty().withMessage("Username is required")
        .matches(/^[a-z0-9_]{3,20}$/).withMessage("Username must be 3-20 characters, lowercase alphanumeric or underscore"),
    body("phoneNumber").optional({ checkFalsy: true }),
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("avatar").optional().isString(),
    body("personalEmail").optional({ checkFalsy: true }).isEmail(),
    body("bio").optional({ checkFalsy: true }).isString().isLength({ max: 500 }),
    body("gender").optional().isIn(["male", "female", "other", "prefer_not_to_say"])
];
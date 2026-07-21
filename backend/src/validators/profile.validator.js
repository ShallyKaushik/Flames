import { body } from "express-validator";

export const updateProfileValidator = [

    body("fullName")
        .optional()
        .trim()
        .isLength({
            min: 2,
            max: 50,
        }),

    body("username")
        .optional()
        .trim()
        .isLength({
            min: 3,
            max: 20,
        }),

    body("gender")
        .optional()
        .isIn([
            "male",
            "female",
            "prefer-not-to-say",
        ])
        .withMessage("Invalid gender"),

    body("bio")
        .optional()
        .trim()
        .isLength({
            max: 150,
        })
        .withMessage("Bio cannot exceed 150 characters"),

    body("avatar")
        .optional()
        .isString()
        .withMessage("Invalid avatar"),

];
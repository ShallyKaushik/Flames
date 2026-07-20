import { body } from "express-validator";

export const createPostValidator = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required"),

    body("content")
        .trim()
        .notEmpty()
        .withMessage("Content is required"),

    body("category")
        .notEmpty()
        .withMessage("Category is required")
        .isIn([
            "general",
            "societies",
            "academics",
            "commute",
            "events",
            "teamup",
            "sports",
            "lost-found",
            "buy-sell",
        ])
        .withMessage("Invalid category"),

];

import { param } from "express-validator";

export const postIdValidator = [
    param("postId")
        .isMongoId()
        .withMessage("Invalid post id"),
];

export const updatePostValidator = [

    body("title")
        .optional()
        .trim(),

    body("content")
        .optional()
        .trim(),

    body("category")
        .optional()
        .isIn([
            "general",
            "societies",
            "academics",
            "commute",
            "events",
            "teamup",
            "sports",
            "lost-found",
            "buy-sell",
        ])
        .withMessage("Invalid category"),

    body("isAnonymous")
        .optional()
        .isBoolean(),

];
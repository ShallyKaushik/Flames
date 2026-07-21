import { query } from "express-validator";

export const getPostsValidator = [

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be greater than 0"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage("Limit must be between 1 and 50"),

    query("sort")
        .optional()
        .isIn(["latest", "oldest"])
        .withMessage("Invalid sort option"),

    query("anonymous")
        .optional()
        .isBoolean()
        .withMessage("Anonymous must be true or false"),

    query("category")
        .optional()
        .isIn([
            "general",
            "academics",
            "societies",
            "teamup",
            "events",
            "commute",
            "sports",
            "lost-found",
            "buy-sell",
        ])
        .withMessage("Invalid category"),
];
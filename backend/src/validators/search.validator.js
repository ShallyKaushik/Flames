import { query } from "express-validator";

export const searchPostsValidator = [

    query("query")
        .notEmpty()
        .withMessage("Search query is required"),

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be greater than 0"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage("Limit must be between 1 and 50"),

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
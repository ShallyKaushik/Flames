import { body } from "express-validator";

export const createAnnouncementValidator = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 100 }),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 1000 }),

    body("priority")
        .optional()
        .isInt({
            min: 1,
            max: 3,
        })
        .withMessage("Priority must be between 1 and 3"),

];

export const updateAnnouncementValidator = [

    body("title")
        .optional()
        .trim()
        .isLength({ max: 100 }),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 }),

    body("priority")
        .optional()
        .isInt({
            min: 1,
            max: 3,
        }),

];
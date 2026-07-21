import { body } from "express-validator";

const createMessageValidator = [

    body("message")
        .trim()
        .notEmpty()
        .withMessage("Message is required")
        .isLength({
            max: 500,
        })
        .withMessage("Message cannot exceed 500 characters"),

    body("isAnonymous")
        .optional()
        .isBoolean()
        .withMessage("isAnonymous must be a boolean"),

];

const updateMessageValidator = [

    body("message")
        .trim()
        .notEmpty()
        .withMessage("Message is required")
        .isLength({
            max: 500,
        })
        .withMessage("Message cannot exceed 500 characters"),

];

export {
    createMessageValidator,
    updateMessageValidator,
};
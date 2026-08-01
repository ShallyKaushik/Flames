import { body } from "express-validator";

const organizationValidationRules = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string")
        .trim()
        .isLength({ max: 100 })
        .withMessage("Name cannot exceed 100 characters"),

    body("description")
        .notEmpty()
        .withMessage("Description is required")
        .isString()
        .withMessage("Description must be a string")
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters"),

    body("link")
        .optional({ checkFalsy: true })
        .isURL()
        .withMessage("Link must be a valid URL")
        .trim(),
];

export { organizationValidationRules };

import { body, param } from "express-validator";

export const createCommentValidator = [

    param("postId")
        .isMongoId()
        .withMessage("Invalid post id"),

    body("content")
        .trim()
        .notEmpty()
        .withMessage("Content is required")
        .isLength({ max: 500 })
        .withMessage("Comment cannot exceed 500 characters"),

];

export const updateCommentValidator = [

    param("commentId")
        .isMongoId()
        .withMessage("Invalid comment id"),

    body("content")
        .trim()
        .notEmpty()
        .withMessage("Content is required")
        .isLength({ max: 500 })
        .withMessage("Comment cannot exceed 500 characters"),

];

export const commentIdValidator = [

    param("commentId")
        .isMongoId()
        .withMessage("Invalid comment id"),

];

export const postIdValidator = [

    param("postId")
        .isMongoId()
        .withMessage("Invalid post id"),

];
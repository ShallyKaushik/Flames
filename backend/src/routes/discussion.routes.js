import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
    createMessage,
    getMessages,
    updateMessage,
    deleteMessage,
} from "../controllers/discussion.controller.js";

import {
    createMessageValidator,
    updateMessageValidator,
} from "../validators/discussion.validator.js";

const router = Router();

router.get(
    "/messages",
    verifyJWT,
    getMessages
);

router.post(
    "/messages",
    verifyJWT,
    createMessageValidator,
    validate,
    createMessage
);

router.patch(
    "/messages/:messageId",
    verifyJWT,
    updateMessageValidator,
    validate,
    updateMessage
);

router.delete(
    "/messages/:messageId",
    verifyJWT,
    deleteMessage
);

export default router;
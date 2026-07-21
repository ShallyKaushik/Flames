import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
    createMessageService,
    getMessagesService,
    updateMessageService,
    deleteMessageService,
} from "../services/discussion.service.js";

const createMessage = asyncHandler(
    async (req, res) => {

        const message = await createMessageService(
            req.user,
            req.body.message,
            req.body.isAnonymous
        );

        return res.status(201).json(
            new ApiResponse(
                201,
                message,
                "Message sent"
            )
        );

    }
);

const getMessages = asyncHandler(
    async (req, res) => {

        const page =
            Number(req.query.page) || 1;

        const limit =
            Number(req.query.limit) || 50;

        const messages =
            await getMessagesService(
                req.user,
                page,
                limit
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                messages,
                "Messages fetched"
            )
        );

    }
);

const updateMessage = asyncHandler(
    async (req, res) => {

        const message =
            await updateMessageService(
                req.user,
                req.params.messageId,
                req.body.message
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                message,
                "Message updated"
            )
        );

    }
);

const deleteMessage = asyncHandler(
    async (req, res) => {

        await deleteMessageService(
            req.user,
            req.params.messageId
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Message deleted"
            )
        );

    }
);

export {
    createMessage,
    getMessages,
    updateMessage,
    deleteMessage,
};
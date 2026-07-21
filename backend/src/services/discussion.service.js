import ApiError from "../utils/ApiError.js";

import {
    createMessage,
    getMessages,
    getMessageById,
    updateMessage,
    deleteMessage,
    countUserMessages,
    getLatestUserMessage,
    getLastMessages,
} from "../repositories/discussion.repository.js";
import { createNotificationService } from "./notification.service.js";

const MESSAGE_LIMIT = 120;
const COOLDOWN = 3000;
const CONSECUTIVE_LIMIT = 5;
const EDIT_TIME_LIMIT = 5 * 60 * 1000;

const formatDiscussionMessage = (
    message,
    currentUser
) => {

    const messageObj = message.toObject
        ? message.toObject()
        : message;

    if (
        messageObj.isAnonymous &&
        currentUser.role !== "admin"
    ) {

        messageObj.sender = {
            fullName: "Anonymous",
            username: "anonymous",
            avatar: 0,
        };

    }

    return messageObj;

};

const createMessageService = async (
    user,
    message,
    isAnonymous
) => {

    const totalMessages =
        await countUserMessages(user._id);

    if (totalMessages >= MESSAGE_LIMIT) {

        throw new ApiError(
            400,
            "Maximum discussion limit reached."
        );

    }

    const latest =
        await getLatestUserMessage(user._id);

    if (
        latest &&
        Date.now() - latest.createdAt.getTime() < COOLDOWN
    ) {

        throw new ApiError(
            400,
            "Please wait before sending another message."
        );

    }

    const lastFive =
        await getLastMessages();

    if (
        lastFive.length === CONSECUTIVE_LIMIT &&
        lastFive.every(
            msg =>
                msg.sender.toString() ===
                user._id.toString()
        )
    ) {

        throw new ApiError(
            400,
            "Wait for someone else to reply."
        );

    }

    const savedMessage =
        await createMessage({

            sender: user._id,

            message,

            isAnonymous,

        });

    await savedMessage.populate(
        "sender",
        "fullName username avatar"
    );

    return formatDiscussionMessage(
        savedMessage,
        user
    );

};

const getMessagesService = async (
    user,
    page,
    limit
) => {

    const skip =
        (page - 1) * limit;

    const messages =
        await getMessages(
            skip,
            limit
        );

    return messages.map(message =>
        formatDiscussionMessage(
            message,
            user
        )
    );

};

const updateMessageService = async (
    user,
    messageId,
    message
) => {

    const existingMessage =
        await getMessageById(
            messageId
        );

    if (!existingMessage) {

        throw new ApiError(
            404,
            "Message not found"
        );

    }

    if (
        existingMessage.sender.toString() !==
        user._id.toString()
    ) {

        throw new ApiError(
            403,
            "Unauthorized"
        );

    }

    const difference =
        Date.now() -
        existingMessage.createdAt.getTime();

    if (
        difference >
        EDIT_TIME_LIMIT
    ) {

        throw new ApiError(
            400,
            "Editing time expired."
        );

    }

    const updatedMessage =
        await updateMessage(
            messageId,
            message
        );

    return formatDiscussionMessage(
        updatedMessage,
        user
    );

};

const deleteMessageService = async (
    user,
    messageId
) => {

    const message =
        await getMessageById(
            messageId
        );

    if (!message) {

        throw new ApiError(
            404,
            "Message not found"
        );

    }

    if (
        message.sender.toString() !==
            user._id.toString() &&
        user.role !== "admin"
    ) {

        throw new ApiError(
            403,
            "Unauthorized"
        );

    }

    if (message.sender.toString() !== user._id.toString() && user.role === "admin") {
        await createNotificationService({
            recipient: message.sender,
            sender: user._id,
            type: "admin_deletion",
            title: "Message Removed",
            message: `Your chat message was removed by an admin.`,
        });
    }

    return await deleteMessage(
        messageId
    );

};

export {
    createMessageService,
    getMessagesService,
    updateMessageService,
    deleteMessageService,
    formatDiscussionMessage,
};
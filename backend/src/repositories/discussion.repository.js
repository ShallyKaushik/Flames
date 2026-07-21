import DiscussionMessage from "../models/discussionMessage.model.js";

const createMessage = (data) => {

    return DiscussionMessage.create(data);

};

const getMessages = (skip, limit) => {

    return DiscussionMessage.find({
        deleted: false,
    })
        .populate(
            "sender",
            "fullName username avatar"
        )
        .sort({
            createdAt: 1,
        })
        .skip(skip)
        .limit(limit);

};

const getMessageById = (messageId) => {

    return DiscussionMessage.findById(messageId);

};

const updateMessage = (messageId, message) => {

    return DiscussionMessage.findByIdAndUpdate(
        messageId,
        {
            message,
            edited: true,
        },
        {
            new: true,
        }
    ).populate(
        "sender",
        "fullName username avatar"
    );

};

const deleteMessage = (
    messageId
) => {

    return DiscussionMessage.findByIdAndUpdate(
        messageId,
        {
            deleted: true,
            deletedAt: new Date(),
        },
        {
            new: true,
        }
    );

};

const countUserMessages = (
    userId
) => {

    return DiscussionMessage.countDocuments({
        sender: userId,
        deleted: false,
    });

};

const getLatestUserMessage = (
    userId
) => {

    return DiscussionMessage.findOne({
        sender: userId,
        deleted: false,
    }).sort({
        createdAt: -1,
    });

};

const getLastMessages = (
    limit = 5
) => {

    return DiscussionMessage.find({
        deleted: false,
    })
        .sort({
            createdAt: -1,
        })
        .limit(limit);

};

export {
    createMessage,
    getMessages,
    getMessageById,
    updateMessage,
    deleteMessage,
    countUserMessages,
    getLatestUserMessage,
    getLastMessages,
};
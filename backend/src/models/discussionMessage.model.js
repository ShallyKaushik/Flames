import mongoose from "mongoose";

const discussionMessageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },

        isAnonymous: {
            type: Boolean,
            default: false,
        },

        edited: {
            type: Boolean,
            default: false,
        },

        deleted: {
            type: Boolean,
            default: false,
        },

        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Automatically delete messages after 24 hours
discussionMessageSchema.index(
    { createdAt: 1 },
    {
        expireAfterSeconds: 86400,
    }
);

const DiscussionMessage = mongoose.model(
    "DiscussionMessage",
    discussionMessageSchema
);

export default DiscussionMessage;
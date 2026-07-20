import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },

        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 3000,
        },

        category: {
            type: String,
            enum: [
                "general",
                "societies",
                "academics",
                "commute",
                "events",
                "teamup",
                "sports",
                "lost-found",
                "buy-sell",
            ],
            required: true,
        },

        isAnonymous: {
            type: Boolean,
            default: false,
        },

        images: [
            {
                type: String,
            },
        ],
        poll: {
    question: {
        type: String,
        trim: true,
    },

    options: [
        {
            text: {
                type: String,
                required: true,
                trim: true,
            },

            votes: {
                type: Number,
                default: 0,
            },
        },
    ],

    expiresAt: {
        type: Date,
        default: null,
    },
},
        likesCount: {
            type: Number,
            default: 0,
        },

        commentsCount: {
            type: Number,
            default: 0,
        },

        views: {
            type: Number,
            default: 0,
        },

        isEdited: {
            type: Boolean,
            default: false,
        },

        expiresAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
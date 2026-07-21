import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null, // null for global announcements
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null, // null for system/admin messages without specific sender
        },
        type: {
            type: String,
            enum: ["announcement", "like", "comment", "poll_vote", "admin_deletion"],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        relatedPost: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: null,
        },
        relatedComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
        },
        relatedAnnouncement: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Announcement",
            default: null,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;

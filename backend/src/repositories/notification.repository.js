import Notification from "../models/notification.model.js";

const createNotification = (data) =>
    Notification.create(data);

const getNotificationsForUser = (userId) =>
    Notification.find({
        $or: [{ recipient: userId }, { recipient: null }],
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("sender", "fullName username avatar");

const getNotificationById = (notificationId) =>
    Notification.findById(notificationId);

const updateNotificationReadStatus = (notificationId, isRead) =>
    Notification.findByIdAndUpdate(
        notificationId,
        { isRead },
        { new: true }
    );

const markAllReadForUser = (userId) =>
    Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true }
    );

export {
    createNotification,
    getNotificationsForUser,
    getNotificationById,
    updateNotificationReadStatus,
    markAllReadForUser,
};

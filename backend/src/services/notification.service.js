import ApiError from "../utils/ApiError.js";
import {
    createNotification,
    getNotificationsForUser,
    getNotificationById,
    updateNotificationReadStatus,
    markAllReadForUser,
} from "../repositories/notification.repository.js";
import { emitNotification, broadcastNotification } from "../socket/socketManager.js";

const createNotificationService = async (data) => {
    // Don't notify self (unless it's an announcement or deletion)
    if (data.recipient && data.sender && data.recipient.toString() === data.sender.toString()) {
        return null;
    }

    const notification = await createNotification(data);
    
    if (!data.recipient) {
        broadcastNotification(notification);
    } else {
        emitNotification(data.recipient.toString(), notification);
    }

    return notification;
};

const getNotificationsService = async (userId) => {
    return await getNotificationsForUser(userId);
};

const markNotificationReadService = async (notificationId, userId) => {
    const notification = await getNotificationById(notificationId);

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    if (notification.recipient && notification.recipient.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only mark your own notifications as read");
    }

    return await updateNotificationReadStatus(notificationId, true);
};

const markAllReadService = async (userId) => {
    await markAllReadForUser(userId);
    return true;
};

export {
    createNotificationService,
    getNotificationsService,
    markNotificationReadService,
    markAllReadService,
};

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
    getNotificationsService,
    markNotificationReadService,
    markAllReadService,
} from "../services/notification.service.js";

const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await getNotificationsService(req.user._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            notifications,
            "Notifications fetched successfully"
        )
    );
});

const markNotificationRead = asyncHandler(async (req, res) => {
    const notification = await markNotificationReadService(
        req.params.notificationId,
        req.user._id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            notification,
            "Notification marked as read"
        )
    );
});

const markAllRead = asyncHandler(async (req, res) => {
    await markAllReadService(req.user._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "All notifications marked as read"
        )
    );
});

export {
    getNotifications,
    markNotificationRead,
    markAllRead,
};

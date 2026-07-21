import {
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
} from "../repositories/announcement.repository.js";

import ApiError from "../utils/ApiError.js";

import { createNotificationService } from "./notification.service.js";

const createAnnouncementService = async (data) => {

    const announcement = await createAnnouncement(data);

    await createNotificationService({
        recipient: null,
        sender: data.createdBy,
        type: "announcement",
        title: "New Announcement",
        message: data.title,
        relatedAnnouncement: announcement._id
    });

    return announcement;

};

const getAnnouncementsService = async () => {

    return await getAnnouncements();

};

const updateAnnouncementService = async (
    announcementId,
    data
) => {

    const announcement =
        await getAnnouncementById(announcementId);

    if (!announcement) {
        throw new ApiError(
            404,
            "Announcement not found"
        );
    }

    return await updateAnnouncement(
        announcementId,
        data
    );

};

const deleteAnnouncementService = async (
    announcementId
) => {

    const announcement =
        await getAnnouncementById(announcementId);

    if (!announcement) {
        throw new ApiError(
            404,
            "Announcement not found"
        );
    }

    await deleteAnnouncement(announcementId);

};

export {
    createAnnouncementService,
    getAnnouncementsService,
    updateAnnouncementService,
    deleteAnnouncementService,
};
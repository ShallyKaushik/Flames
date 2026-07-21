import {
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
} from "../repositories/announcement.repository.js";

import ApiError from "../utils/ApiError.js";

const createAnnouncementService = async (data) => {

    return await createAnnouncement(data);

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
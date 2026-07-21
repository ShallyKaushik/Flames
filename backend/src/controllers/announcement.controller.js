import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
    createAnnouncementService,
    getAnnouncementsService,
    updateAnnouncementService,
    deleteAnnouncementService,
} from "../services/announcement.service.js";

const createAnnouncement = asyncHandler(async (req, res) => {

    const announcement =
        await createAnnouncementService({
            ...req.body,
            createdBy: req.user._id,
        });

    return res.status(201).json(
        new ApiResponse(
            201,
            announcement,
            "Announcement created successfully"
        )
    );

});

const getAnnouncements = asyncHandler(async (req, res) => {

    const announcements =
        await getAnnouncementsService();

    return res.status(200).json(
        new ApiResponse(
            200,
            announcements,
            "Announcements fetched successfully"
        )
    );

});

const updateAnnouncement = asyncHandler(async (req, res) => {

    const announcement =
        await updateAnnouncementService(
            req.params.announcementId,
            req.body
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            announcement,
            "Announcement updated successfully"
        )
    );

});

const deleteAnnouncement = asyncHandler(async (req, res) => {

    await deleteAnnouncementService(
        req.params.announcementId
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Announcement deleted successfully"
        )
    );

});

export {
    createAnnouncement,
    getAnnouncements,
    updateAnnouncement,
    deleteAnnouncement,
};
import Announcement from "../models/announcement.model.js";

const createAnnouncement = (data) => {
    return Announcement.create(data);
};

const getAnnouncements = () => {
    return Announcement.find({
        $or: [
            { expiresAt: null },
            { expiresAt: { $gt: new Date() } },
        ],
    })
        .populate("createdBy", "fullName")
        .sort({
            priority: -1,
            createdAt: -1,
        });
};

const getAnnouncementById = (announcementId) => {
    return Announcement.findById(announcementId);
};

const updateAnnouncement = (
    announcementId,
    data
) => {

    return Announcement.findByIdAndUpdate(
        announcementId,
        data,
        {
            new: true,
            runValidators: true,
        }
    );

};

const deleteAnnouncement = (announcementId) => {
    return Announcement.findByIdAndDelete(
        announcementId
    );
};

export {
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
};
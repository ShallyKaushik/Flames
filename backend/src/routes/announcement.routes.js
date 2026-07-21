import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware.js";
import verifyAdmin from "../middlewares/admin.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
    createAnnouncement,
    getAnnouncements,
    updateAnnouncement,
    deleteAnnouncement,
} from "../controllers/announcement.controller.js";

import {
    createAnnouncementValidator,
    updateAnnouncementValidator,
} from "../validators/announcement.validator.js";

const router = Router();

router.get(
    "/",
    verifyJWT,
    getAnnouncements
);

router.post(
    "/",
    verifyJWT,
    verifyAdmin,
    createAnnouncementValidator,
    validate,
    createAnnouncement
);

router.patch(
    "/:announcementId",
    verifyJWT,
    verifyAdmin,
    updateAnnouncementValidator,
    validate,
    updateAnnouncement
);

router.delete(
    "/:announcementId",
    verifyJWT,
    verifyAdmin,
    deleteAnnouncement
);

export default router;
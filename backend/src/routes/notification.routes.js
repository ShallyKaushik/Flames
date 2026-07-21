import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
    getNotifications,
    markNotificationRead,
    markAllRead,
} from "../controllers/notification.controller.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

router.get("/", getNotifications);
router.patch("/read-all", markAllRead);
router.patch("/:notificationId/read", markNotificationRead);

export default router;

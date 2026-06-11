import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getNotifications,
  markNotificationsAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/notifications", authMiddleware, getNotifications);
router.put("/notifications/read", authMiddleware, markNotificationsAsRead);

export default router;

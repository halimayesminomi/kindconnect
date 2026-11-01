import express from "express";
import Notification from "../models/Notification.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/notifications
 * Get user's notifications + unreadCount
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      read: false,
    });

    return res.status(200).json({
      success: true,
      data: {
        unreadCount,
        notifications,
      },
    });
  } catch (error) {
    console.error("Get notifications error:", error.message);
    return res.status(500).json({ success: false, message: "Error fetching notifications." });
  }
});

/**
 * PATCH /api/notifications/:id/read
 * Mark notification as read
 */
router.patch("/:id/read", verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    console.error("Mark notification read error:", error.message);
    return res.status(500).json({ success: false, message: "Error updating notification." });
  }
});

/**
 * POST /api/notifications/mark-all-read
 * Mark all user notifications as read
 */
router.post("/mark-all-read", verifyToken, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
    return res.status(200).json({ success: true, message: "All notifications marked as read." });
  } catch (error) {
    console.error("Mark all notifications read error:", error.message);
    return res.status(500).json({ success: false, message: "Error updating notifications." });
  }
});

export default router;

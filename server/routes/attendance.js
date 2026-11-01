import express from "express";
import QRCode from "qrcode";
import Attendance from "../models/Attendance.js";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import Notification from "../models/Notification.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/attendance/code/:eventId
 * Get the QR code and check-in token for an event (organizer/creator only).
 */
router.get("/code/:eventId", verifyToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    if (event.creatorEmail !== req.user.email && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only event organizer can view check-in code." });
    }

    const checkInCode = `KC-${eventId.slice(-6).toUpperCase()}`;
    const payload = JSON.stringify({
      app: "kindconnect",
      action: "checkin",
      eventId: event._id,
      code: checkInCode,
      title: event.title,
    });

    const qrDataUrl = await QRCode.toDataURL(payload, {
      width: 320,
      margin: 2,
      color: { dark: "#0f1911", light: "#ffffff" },
    });

    return res.status(200).json({
      success: true,
      data: {
        eventId: event._id,
        eventTitle: event.title,
        checkInCode,
        qrDataUrl,
      },
    });
  } catch (error) {
    console.error("Get check-in code error:", error.message);
    return res.status(500).json({ success: false, message: "Error generating attendance QR code." });
  }
});

/**
 * POST /api/attendance/check-in
 * Check in to an event via QR code / check-in code.
 */
router.post("/check-in", verifyToken, async (req, res) => {
  try {
    const { eventId, code } = req.body;

    if (!eventId) {
      return res.status(400).json({ success: false, message: "Event ID is required." });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    const expectedCode = `KC-${eventId.slice(-6).toUpperCase()}`;
    if (code && code.trim().toUpperCase() !== expectedCode) {
      return res.status(400).json({ success: false, message: "Invalid check-in code." });
    }

    // 1. Verify user is registered for the event
    const registration = await Registration.findOne({ eventId, userId: req.user.id });
    if (!registration) {
      return res.status(400).json({
        success: false,
        message: "You must join this event before recording attendance.",
      });
    }

    // 2. Check if already checked in
    const existing = await Attendance.findOne({ eventId, userId: req.user.id });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You have already checked in for this event.",
      });
    }

    // 3. Create Attendance record
    const attendance = await Attendance.create({
      eventId,
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
      pointsAwarded: 50,
    });

    // 4. Send notification
    await Notification.create({
      userId: req.user.id,
      title: "Attendance Verified! 🎉",
      message: `You earned 50 impact points for attending "${event.title}".`,
      type: "success",
    });

    return res.status(201).json({
      success: true,
      message: "Attendance recorded successfully! You earned 50 impact points.",
      data: attendance,
    });
  } catch (error) {
    console.error("Check-in error:", error.message);
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Already checked in." });
    }
    return res.status(500).json({ success: false, message: "Server error during check-in." });
  }
});

/**
 * GET /api/attendance/my-attendance
 * Get all attended events and total impact points for the logged-in user.
 */
router.get("/my-attendance", verifyToken, async (req, res) => {
  try {
    const list = await Attendance.find({ userId: req.user.id })
      .populate("eventId")
      .sort({ checkInTime: -1 });

    const totalPoints = list.reduce((sum, item) => sum + (item.pointsAwarded || 50), 0);

    return res.status(200).json({
      success: true,
      data: {
        totalPoints,
        attendedCount: list.length,
        records: list,
      },
    });
  } catch (error) {
    console.error("Get my attendance error:", error.message);
    return res.status(500).json({ success: false, message: "Error fetching attendance." });
  }
});

/**
 * GET /api/attendance/event/:eventId
 * Get attendees list for an event (organizer only).
 */
router.get("/event/:eventId", verifyToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    if (event.creatorEmail !== req.user.email && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    const attendees = await Attendance.find({ eventId }).sort({ checkInTime: -1 });

    return res.status(200).json({
      success: true,
      data: attendees,
    });
  } catch (error) {
    console.error("Get event attendees error:", error.message);
    return res.status(500).json({ success: false, message: "Error fetching event attendees." });
  }
});

export default router;

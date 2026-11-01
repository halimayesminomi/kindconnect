import express from "express";
import EmergencyRequest from "../models/EmergencyRequest.js";
import Notification from "../models/Notification.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/emergency
 * Get all active verified emergency requests (or all for admins).
 */
router.get("/", async (req, res) => {
  try {
    const { all, category, urgency } = req.query;
    const filter = {};

    if (all !== "true") {
      filter.status = { $ne: "fulfilled" };
    }

    if (category) filter.category = category;
    if (urgency) filter.urgency = urgency;

    const requests = await EmergencyRequest.find(filter).sort({
      urgency: -1,
      createdAt: -1,
    });

    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error("Get emergency requests error:", error.message);
    return res.status(500).json({ success: false, message: "Error fetching emergency requests." });
  }
});

/**
 * POST /api/emergency
 * Submit a community emergency help request (protected).
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, category, description, urgency, location, contactPhone } = req.body;

    if (!title || !category || !description || !location || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: "Title, category, description, location, and contact phone are required.",
      });
    }

    const request = await EmergencyRequest.create({
      title,
      category,
      description,
      urgency: urgency || "High",
      location,
      contactPhone,
      requesterName: req.user.name,
      requesterEmail: req.user.email,
      verified: true, // auto-verified for authenticated community members
    });

    // Notify requester
    await Notification.create({
      userId: req.user.id,
      title: "Urgent Request Published 🚨",
      message: `Your relief request "${title}" is now active and visible to local volunteers.`,
      type: "alert",
    });

    return res.status(201).json({ success: true, data: request });
  } catch (error) {
    console.error("Create emergency request error:", error.message);
    return res.status(500).json({ success: false, message: "Error submitting emergency request." });
  }
});

/**
 * POST /api/emergency/:id/respond
 * Volunteer responds to offer help/aid.
 */
router.post("/:id/respond", verifyToken, async (req, res) => {
  try {
    const request = await EmergencyRequest.findByIdAndUpdate(
      req.params.id,
      { $inc: { volunteersJoined: 1 } },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found." });
    }

    // Award notification to volunteer
    await Notification.create({
      userId: req.user.id,
      title: "Emergency Response Registered ❤️",
      message: `Thank you for offering aid for "${request.title}". Coordinator: ${request.contactPhone}`,
      type: "success",
    });

    return res.status(200).json({
      success: true,
      message: "Response recorded! Contact coordinator at: " + request.contactPhone,
      data: request,
    });
  } catch (error) {
    console.error("Respond emergency error:", error.message);
    return res.status(500).json({ success: false, message: "Error recording response." });
  }
});

/**
 * PATCH /api/emergency/:id/verify
 * Admin verifies or updates status of an emergency request.
 */
router.patch("/:id/verify", verifyToken, async (req, res) => {
  try {
    const { status, verified } = req.body;
    const update = {};
    if (status) update.status = status;
    if (verified !== undefined) update.verified = verified;

    const request = await EmergencyRequest.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found." });
    }

    return res.status(200).json({ success: true, data: request });
  } catch (error) {
    console.error("Verify emergency error:", error.message);
    return res.status(500).json({ success: false, message: "Error updating request." });
  }
});

export default router;

import express from "express";
import User from "../models/User.js";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import EmergencyRequest from "../models/EmergencyRequest.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Apply auth & admin verification to all admin routes
router.use(verifyToken, verifyAdmin);

/**
 * GET /api/admin/stats
 * Overview stats for the admin control panel.
 */
router.get("/stats", async (req, res) => {
  try {
    const [
      totalUsers,
      totalEvents,
      totalRegistrations,
      totalEmergency,
      adminUsers,
      organizerUsers,
      volunteerUsers,
      upcomingEvents,
      pendingEmergency,
      verifiedEmergency,
    ] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Registration.countDocuments(),
      EmergencyRequest.countDocuments(),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "organizer" }),
      User.countDocuments({ role: "user" }),
      Event.countDocuments({ date: { $gt: new Date() } }),
      EmergencyRequest.countDocuments({ verified: false }),
      EmergencyRequest.countDocuments({ verified: true }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalEvents,
        totalRegistrations,
        totalEmergency,
        users: {
          admins: adminUsers,
          organizers: organizerUsers,
          volunteers: volunteerUsers,
        },
        events: {
          upcoming: upcomingEvents,
          past: Math.max(0, totalEvents - upcomingEvents),
        },
        emergency: {
          pending: pendingEmergency,
          verified: verifiedEmergency,
        },
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin stats.",
    });
  }
});

/**
 * GET /api/admin/users
 * List all users with search and role filters.
 */
router.get("/users", async (req, res) => {
  try {
    const { search, role } = req.query;
    const filter = {};

    if (role && ["user", "organizer", "admin"].includes(role)) {
      filter.role = role;
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { username: { $regex: q, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Admin get users error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
    });
  }
});

/**
 * PATCH /api/admin/users/:id/role
 * Update user's role and designation.
 */
router.patch("/users/:id/role", async (req, res) => {
  try {
    const { role, designation } = req.body;
    const { id } = req.params;

    if (!role || !["user", "organizer", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified. Must be user, organizer, or admin.",
      });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Protect primary organizer/builder from accidental demotion
    if (targetUser.username === "omi" && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "The primary Platform Builder account cannot be demoted.",
      });
    }

    targetUser.role = role;
    if (designation !== undefined) {
      targetUser.designation = designation;
    } else {
      if (role === "admin") {
        targetUser.designation = targetUser.designation || "Platform Administrator";
      } else if (role === "organizer") {
        targetUser.designation = "Community Organizer";
      } else {
        targetUser.designation = "Volunteer";
      }
    }

    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role}.`,
      data: {
        id: targetUser._id,
        name: targetUser.name,
        username: targetUser.username,
        email: targetUser.email,
        role: targetUser.role,
        designation: targetUser.designation,
      },
    });
  } catch (error) {
    console.error("Admin update role error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update user role.",
    });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Delete user and cleanup their registrations.
 */
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account.",
      });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (targetUser.username === "omi") {
      return res.status(400).json({
        success: false,
        message: "The primary Platform Builder account cannot be deleted.",
      });
    }

    await User.findByIdAndDelete(id);
    await Registration.deleteMany({ userId: id });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Admin delete user error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user.",
    });
  }
});

/**
 * GET /api/admin/events
 * Get all events on the platform for moderation.
 */
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("Admin get events error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch events.",
    });
  }
});

/**
 * DELETE /api/admin/events/:id
 * Delete any event as administrator.
 */
router.delete("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    await Registration.deleteMany({ eventId: id });

    return res.status(200).json({
      success: true,
      message: "Event removed successfully by admin.",
    });
  } catch (error) {
    console.error("Admin delete event error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete event.",
    });
  }
});

/**
 * GET /api/admin/emergency
 * Get all emergency requests for moderation.
 */
router.get("/emergency", async (req, res) => {
  try {
    const requests = await EmergencyRequest.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error("Admin get emergency error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch emergency requests.",
    });
  }
});

/**
 * PATCH /api/admin/emergency/:id/verify
 * Approve or unverify an emergency relief request.
 */
router.patch("/emergency/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    const request = await EmergencyRequest.findByIdAndUpdate(
      id,
      { verified: Boolean(verified) },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Emergency request ${request.verified ? "verified" : "marked unverified"}.`,
      data: request,
    });
  } catch (error) {
    console.error("Admin verify emergency error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update emergency request.",
    });
  }
});

/**
 * DELETE /api/admin/emergency/:id
 * Delete an emergency request.
 */
router.delete("/emergency/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = await EmergencyRequest.findByIdAndDelete(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Emergency request deleted successfully.",
    });
  } catch (error) {
    console.error("Admin delete emergency error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete emergency request.",
    });
  }
});

/**
 * GET /api/admin/registrations
 * List platform registrations.
 */
router.get("/registrations", async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("eventId", "title date location category")
      .populate("userId", "name email username role")
      .sort({ registeredAt: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    console.error("Admin get registrations error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch registrations.",
    });
  }
});

export default router;

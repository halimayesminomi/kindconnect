import express from "express";
import User from "../models/User.js";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import Message from "../models/Message.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Protect all chat routes
router.use(verifyToken);

/**
 * Helper to get the primary admin recipient
 */
const getPrimaryAdmin = async () => {
  let admin = await User.findOne({ username: "omi" });
  if (!admin) {
    admin = await User.findOne({ role: "admin" });
  }
  return admin;
};

// =============================================================================
// EVENT GROUP CHAT ROUTES
// =============================================================================

/**
 * GET /api/chat/my-events
 * Returns all events the user can chat in:
 * - Admin: all events
 * - Organizer: created events
 * - Volunteer: registered events
 */
router.get("/my-events", async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    let events = [];
    if (user.role === "admin") {
      events = await Event.find().sort({ date: 1 });
    } else {
      // Find events user created
      const createdEvents = await Event.find({ creatorEmail: user.email });
      // Find events user registered for
      const registrations = await Registration.find({ userId: user._id, status: "confirmed" }).populate("eventId");
      const registeredEvents = registrations.map(r => r.eventId).filter(Boolean);

      const eventMap = new Map();
      [...createdEvents, ...registeredEvents].forEach(ev => {
        eventMap.set(ev._id.toString(), ev);
      });
      events = Array.from(eventMap.values());
    }

    // Attach latest message summary to each event
    const eventSummaries = await Promise.all(
      events.map(async (ev) => {
        const lastMsg = await Message.findOne({ type: "event_group", eventId: ev._id })
          .sort({ createdAt: -1 })
          .select("text senderName createdAt");
        return {
          _id: ev._id,
          title: ev.title,
          category: ev.category,
          date: ev.date,
          location: ev.location,
          volunteersCount: ev.volunteersCount || 0,
          capacity: ev.capacity,
          lastMessage: lastMsg || null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: eventSummaries,
    });
  } catch (error) {
    console.error("Get my events chat error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch chat events." });
  }
});

/**
 * GET /api/chat/events/:eventId/messages
 * Get message history for an event group chat.
 */
router.get("/events/:eventId/messages", async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    const messages = await Message.find({ type: "event_group", eventId })
      .sort({ createdAt: 1 })
      .limit(200);

    return res.status(200).json({
      success: true,
      data: {
        event: {
          _id: event._id,
          title: event.title,
          category: event.category,
          date: event.date,
          location: event.location,
          capacity: event.capacity,
          volunteersCount: event.volunteersCount,
          creatorName: event.creatorName,
          creatorEmail: event.creatorEmail,
        },
        messages,
      },
    });
  } catch (error) {
    console.error("Get event chat messages error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch event messages." });
  }
});

/**
 * POST /api/chat/events/:eventId/messages
 * Send a message to an event group chat.
 */
router.post("/events/:eventId/messages", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Message content cannot be empty." });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    const sender = await User.findById(req.user.id);
    if (!sender) {
      return res.status(404).json({ success: false, message: "Sender not found." });
    }

    const message = await Message.create({
      type: "event_group",
      eventId: event._id,
      sender: sender._id,
      senderName: sender.name,
      senderUsername: sender.username || "",
      senderRole: sender.role || "user",
      senderDesignation: sender.designation || (sender.role === "admin" ? "Platform Administrator" : sender.role === "organizer" ? "Organizer" : "Volunteer"),
      senderPhoto: sender.photoURL || "",
      text: text.trim(),
    });

    return res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("Post event chat message error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to send message." });
  }
});

// =============================================================================
// DIRECT 1-ON-1 CHAT WITH ADMIN ROUTES
// =============================================================================

/**
 * GET /api/chat/direct/admin
 * For Volunteers / Organizers: fetch direct chat history with Platform Admin.
 */
router.get("/direct/admin", async (req, res) => {
  try {
    const admin = await getPrimaryAdmin();
    if (!admin) {
      return res.status(404).json({ success: false, message: "Platform admin account not available." });
    }

    const currentUserId = req.user.id;
    const adminId = admin._id.toString();
    const conversationId = [currentUserId, adminId].sort().join("_");

    // Fetch messages
    const messages = await Message.find({
      type: "direct",
      conversationId,
    }).sort({ createdAt: 1 });

    // Mark unread messages sent to current user as read
    await Message.updateMany(
      { type: "direct", conversationId, recipient: currentUserId, read: false },
      { $set: { read: true } }
    );

    return res.status(200).json({
      success: true,
      data: {
        admin: {
          _id: admin._id,
          name: admin.name,
          username: admin.username,
          designation: admin.designation || "Platform Admin & Lead Builder",
          photoURL: admin.photoURL,
        },
        messages,
      },
    });
  } catch (error) {
    console.error("Get direct admin chat error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch admin chat." });
  }
});

/**
 * POST /api/chat/direct/admin
 * For Volunteers / Organizers: send a direct message to Platform Admin.
 */
router.post("/direct/admin", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Message content cannot be empty." });
    }

    const admin = await getPrimaryAdmin();
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin account not found." });
    }

    const sender = await User.findById(req.user.id);
    if (!sender) {
      return res.status(404).json({ success: false, message: "Sender not found." });
    }

    const currentUserId = sender._id.toString();
    const adminId = admin._id.toString();
    const conversationId = [currentUserId, adminId].sort().join("_");

    const message = await Message.create({
      type: "direct",
      conversationId,
      sender: sender._id,
      senderName: sender.name,
      senderUsername: sender.username || "",
      senderRole: sender.role || "user",
      senderDesignation: sender.designation || "Volunteer",
      senderPhoto: sender.photoURL || "",
      recipient: admin._id,
      recipientName: admin.name,
      text: text.trim(),
    });

    return res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("Send message to admin error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to send message to admin." });
  }
});

/**
 * GET /api/chat/direct/conversations
 * For Admin: list all direct conversations with volunteers.
 */
router.get("/direct/conversations", async (req, res) => {
  try {
    const adminUser = await User.findById(req.user.id);
    if (adminUser.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required." });
    }

    // Find all direct messages where this admin is sender or recipient
    const messages = await Message.find({
      type: "direct",
      $or: [{ sender: adminUser._id }, { recipient: adminUser._id }],
    }).sort({ createdAt: -1 });

    const conversationMap = new Map();

    for (const msg of messages) {
      const otherUserId = msg.sender.toString() === adminUser._id.toString()
        ? msg.recipient?.toString()
        : msg.sender.toString();

      if (!otherUserId || otherUserId === adminUser._id.toString()) continue;

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          userId: otherUserId,
          lastMessage: {
            text: msg.text,
            createdAt: msg.createdAt,
            senderName: msg.senderName,
          },
          unreadCount: 0,
        });
      }

      if (msg.recipient?.toString() === adminUser._id.toString() && !msg.read) {
        const item = conversationMap.get(otherUserId);
        item.unreadCount += 1;
      }
    }

    // Populate user info for each conversation
    const userIds = Array.from(conversationMap.keys());
    const users = await User.find({ _id: { $in: userIds } }).select("name username email role designation photoURL");

    const userDict = new Map();
    users.forEach(u => userDict.set(u._id.toString(), u));

    const result = userIds.map(uid => {
      const conv = conversationMap.get(uid);
      const u = userDict.get(uid);
      return {
        user: u || { _id: uid, name: "User", email: "" },
        lastMessage: conv.lastMessage,
        unreadCount: conv.unreadCount,
      };
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get admin conversations error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch conversations." });
  }
});

/**
 * GET /api/chat/direct/user/:userId
 * For Admin: get direct message history with a specific volunteer.
 */
router.get("/direct/user/:userId", async (req, res) => {
  try {
    const adminUser = await User.findById(req.user.id);
    if (adminUser.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required." });
    }

    const { userId } = req.params;
    const targetUser = await User.findById(userId).select("name username email role designation photoURL");
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const conversationId = [adminUser._id.toString(), targetUser._id.toString()].sort().join("_");

    const messages = await Message.find({
      type: "direct",
      conversationId,
    }).sort({ createdAt: 1 });

    // Mark messages sent to admin as read
    await Message.updateMany(
      { type: "direct", conversationId, recipient: adminUser._id, read: false },
      { $set: { read: true } }
    );

    return res.status(200).json({
      success: true,
      data: {
        user: targetUser,
        messages,
      },
    });
  } catch (error) {
    console.error("Get direct user messages error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch user messages." });
  }
});

/**
 * POST /api/chat/direct/user/:userId
 * For Admin: reply directly to a specific volunteer.
 */
router.post("/direct/user/:userId", async (req, res) => {
  try {
    const adminUser = await User.findById(req.user.id);
    if (adminUser.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required." });
    }

    const { userId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Message content cannot be empty." });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const conversationId = [adminUser._id.toString(), targetUser._id.toString()].sort().join("_");

    const message = await Message.create({
      type: "direct",
      conversationId,
      sender: adminUser._id,
      senderName: adminUser.name,
      senderUsername: adminUser.username || "",
      senderRole: "admin",
      senderDesignation: adminUser.designation || "Platform Admin & Lead Builder",
      senderPhoto: adminUser.photoURL || "",
      recipient: targetUser._id,
      recipientName: targetUser.name,
      text: text.trim(),
    });

    return res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("Admin send message error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to send message." });
  }
});

export default router;

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import Attendance from "@/models/Attendance";
import EmergencyRequest from "@/models/EmergencyRequest";
import Message from "@/models/Message";
import { FALLBACK_EVENTS } from "@/lib/fallbackData";
import { validateRealEmail, validateRealName } from "@/lib/email-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "kindconnect_jwt_secret_key_2026_secure";

// Helper: verify JWT from Authorization Bearer header
function verifyToken(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (_) {
    return null;
  }
}

// Helper: convert any ID (string or ObjectId) into an array of [string, ObjectId]
function toIdVariants(id) {
  if (!id) return [];
  const str = id.toString();
  const variants = [str];
  if (mongoose.Types.ObjectId.isValid(str)) {
    try {
      variants.push(new mongoose.Types.ObjectId(str));
    } catch (_) {}
  }
  return variants;
}

// Helper: get all admin identifiers (both string and ObjectId variants)
async function getAllAdminIdentities() {
  const admins = await User.find({
    $or: [
      { role: "admin" },
      { username: "omi" },
      { email: { $in: ["omi@kindconnect.org", "halimaomi2002@gmail.com", "halima@kindconnect.org", "halimatanima@gmail.com"] } },
    ],
  }).select("_id username email name photoURL designation");

  const ids = admins.map((a) => a._id.toString());
  ids.push("6ae7865647ced7d2f5db2906"); // legacy admin id
  ids.push("6ae7a9fa62048a3fab131ca5"); // real admin omi id

  const uniqueStringIds = Array.from(new Set(ids.filter(Boolean)));
  const queryVariants = [];
  uniqueStringIds.forEach((id) => {
    queryVariants.push(id);
    if (mongoose.Types.ObjectId.isValid(id)) {
      try {
        queryVariants.push(new mongoose.Types.ObjectId(id));
      } catch (_) {}
    }
  });

  const primaryAdmin = admins.find((a) => a.username === "omi") || admins[0] || null;

  return {
    primaryAdmin,
    adminList: admins,
    adminStringIds: uniqueStringIds,
    adminQueryVariants: queryVariants,
  };
}

// Helper: get primary admin recipient for direct chats
async function getPrimaryAdmin() {
  const { primaryAdmin } = await getAllAdminIdentities();
  if (primaryAdmin) return primaryAdmin;
  let admin = await User.findOne({
    $or: [
      { role: "admin" },
      { username: "omi" },
      { email: { $in: ["omi@kindconnect.org", "halimaomi2002@gmail.com", "halima@kindconnect.org", "halimatanima@gmail.com"] } },
    ],
  });
  if (!admin) {
    admin = await User.findOne();
  }
  return admin;
}

// Ensure default events exist in DB if empty
async function ensureSeedEvents() {
  const count = await Event.countDocuments();
  if (count === 0 && FALLBACK_EVENTS?.length > 0) {
    const seedData = FALLBACK_EVENTS.map((e) => ({
      title: e.title,
      description: e.description,
      category: e.category,
      image: e.image,
      location: e.location,
      date: new Date(e.date || Date.now() + 86400000 * 3),
      time: e.time || "10:00 AM - 01:00 PM",
      capacity: e.capacity || 50,
      volunteersCount: e.volunteersCount || 0,
      creatorEmail: e.creatorEmail || "omi@kindconnect.org",
      creatorName: e.organizer || "KindConnect Sylhet Chapter",
      status: "published",
    }));
    await Event.insertMany(seedData).catch(() => {});
  }
}

// Ensure default emergency relief requests exist in DB if empty
async function ensureSeedEmergency() {
  const count = await EmergencyRequest.countDocuments();
  if (count === 0) {
    const seed = [
      {
        title: "Urgent O+ Negative Blood Donors Needed",
        category: "Blood Donation",
        urgency: "Critical",
        location: "Dhaka Medical College Hospital",
        contactPhone: "+880 1712-345678",
        description: "Emergency surgery patient requires 2 bags of O-negative blood immediately. Transportation provided if needed.",
        requesterName: "Dr. Farzana Yasmin",
        requesterEmail: "farzana@kindconnect.org",
        volunteersJoined: 2,
        status: "open",
        responders: [
          {
            name: "Shanto Ahmed",
            email: "shanto@kindconnect.org",
            phone: "+880 1711-223344",
            message: "I am ready to donate blood at DMCH.",
            respondedAt: new Date(Date.now() - 3600000 * 4),
          },
          {
            name: "Nusrat Jahan",
            email: "nusrat@kindconnect.org",
            phone: "+880 1819-556677",
            message: "Can arrive within 1 hour if transport is arranged.",
            respondedAt: new Date(Date.now() - 3600000 * 2),
          },
        ],
      },
      {
        title: "Winter Blanket & Warm Clothes Collection",
        category: "Winter Clothes & Blanket",
        urgency: "High",
        location: "Sadarghat & Old Dhaka Riverbank",
        contactPhone: "+880 1823-456789",
        description: "Collecting 100 warm blankets and sweaters for homeless elderly individuals around Sadarghat launch terminal.",
        requesterName: "Tanvir Ahmed",
        requesterEmail: "tanvir@kindconnect.org",
        volunteersJoined: 1,
        status: "open",
        responders: [
          {
            name: "Halima Yesmin Omi",
            email: "halimaomi2002@gmail.com",
            phone: "+880 1700-112233",
            message: "We have collected 25 blankets from Metropolitan University volunteers.",
            respondedAt: new Date(Date.now() - 3600000 * 5),
          },
        ],
      },
      {
        title: "Emergency Food Packs for 40 Slum Families",
        category: "Food & Ration",
        urgency: "High",
        location: "Mirpur 11 Informal Settlement",
        contactPhone: "+880 1934-567890",
        description: "Distributing 1-week dry ration packs (rice, lentils, oil, potatoes) to daily-wage families affected by temporary factory shutdown.",
        requesterName: "Tasnim Anjum",
        requesterEmail: "tasnim@kindconnect.org",
        volunteersJoined: 0,
        status: "open",
        responders: [],
      },
    ];
    await EmergencyRequest.insertMany(seed).catch(() => {});
  }
}

// =============================================================================
// GET HANDLER
// =============================================================================
export async function GET(request, { params }) {
  const { route = [] } = await params;
  const path = route.join("/");
  const url = new URL(request.url);

  try {
    await connectDB();

    // 1. Health check
    if (path === "health") {
      return NextResponse.json({ success: true, message: "KindConnect Next.js API is running!" });
    }

    // 2. Auth: Get current user
    if (path === "auth/user") {
      const decoded = verifyToken(request);
      if (!decoded) {
        return NextResponse.json({ message: "Authentication required" }, { status: 401 });
      }
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, user, data: user });
    }

    // 3. Events: List events
    if (path === "events") {
      await ensureSeedEvents();
      const category = url.searchParams.get("category");
      const search = url.searchParams.get("search");

      let filter = { status: "published" };
      if (category && category !== "All") filter.category = category;
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      const events = await Event.find(filter).sort({ date: 1 });
      return NextResponse.json({ success: true, data: events });
    }

    // 4. Events: Recent events
    if (path === "events/recent") {
      await ensureSeedEvents();
      const events = await Event.find({ status: "published" }).sort({ createdAt: -1 }).limit(6);
      return NextResponse.json({ success: true, data: events });
    }

    // 5. Events: Recommendations
    if (path === "events/recommendations") {
      await ensureSeedEvents();
      const events = await Event.find({ status: "published" }).sort({ volunteersCount: -1 }).limit(4);
      return NextResponse.json({ success: true, data: events });
    }

    // 6. Events: Single event details
    if (route[0] === "events" && route.length === 2 && route[1] !== "recent" && route[1] !== "recommendations") {
      const eventId = route[1];
      const event = await Event.findById(eventId);
      if (!event) {
        const foundFallback = FALLBACK_EVENTS.find((e) => e._id === eventId || e.id === eventId);
        if (foundFallback) {
          return NextResponse.json({ success: true, data: foundFallback });
        }
        return NextResponse.json({ message: "Event not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: event });
    }

    // 7. Events: My created events
    if (path === "events/user/my-events") {
      const decoded = verifyToken(request);
      if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      const events = await Event.find({ creatorEmail: decoded.email }).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: events });
    }

    // 8. Registrations: My registrations
    if (path === "registrations/my-registrations") {
      const decoded = verifyToken(request);
      if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      const regs = await Registration.find({ userId: decoded.id }).populate("eventId").sort({ registeredAt: -1 });
      return NextResponse.json({ success: true, data: regs });
    }

    // 9. Registrations for an event
    if (route[0] === "registrations" && route[1] === "event" && route[2]) {
      const eventId = route[2];
      const regs = await Registration.find({ eventId }).sort({ registeredAt: -1 });
      return NextResponse.json({ success: true, data: regs });
    }

    // 10. Attendance: Get check-in code
    if (route[0] === "attendance" && route[1] === "code" && route[2]) {
      const eventId = route[2];
      const code = `KC-${eventId.slice(-4).toUpperCase()}-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;
      return NextResponse.json({ success: true, data: { code, eventId } });
    }

    // 11. Attendance: My attendance
    if (path === "attendance/my-attendance") {
      const decoded = verifyToken(request);
      if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      const records = await Attendance.find({ userId: decoded.id }).populate("eventId");
      const totalPoints = records.reduce((sum, r) => sum + (r.pointsAwarded || 100), 0);
      return NextResponse.json({ success: true, data: { attendedCount: records.length, totalPoints, records } });
    }

    // 12. Attendance: Event attendees
    if (route[0] === "attendance" && route[1] === "event" && route[2]) {
      const eventId = route[2];
      const attendees = await Attendance.find({ eventId }).sort({ checkedInAt: -1 });
      return NextResponse.json({ success: true, data: attendees });
    }

    // 13. Emergency: List requests
    if (path === "emergency") {
      await ensureSeedEmergency();
      const category = url.searchParams.get("category");
      let filter = {};
      if (category && category !== "All") filter.category = category;
      const requests = await EmergencyRequest.find(filter).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: requests });
    }

    // 14. Emergency: Single request details with responders
    if (route[0] === "emergency" && route.length === 2) {
      const id = route[1];
      const emergency = await EmergencyRequest.findById(id);
      if (!emergency) return NextResponse.json({ message: "Emergency request not found" }, { status: 404 });
      return NextResponse.json({ success: true, data: emergency });
    }

    // 15. Chat: My Events / Channels
    if (path === "chat/my-events") {
      const decoded = verifyToken(request);
      await ensureSeedEvents();
      let events = [];
      if (decoded?.role === "admin") {
        events = await Event.find().sort({ date: 1 });
      } else if (decoded?.id) {
        const userVariants = toIdVariants(decoded.id);
        const createdEvents = await Event.find({ creatorEmail: decoded.email });
        const registrations = await Registration.find({ userId: { $in: userVariants } }).populate("eventId");
        const registeredEvents = registrations.map((r) => r.eventId).filter(Boolean);
        const map = new Map();
        [...createdEvents, ...registeredEvents].forEach((e) => map.set(e._id.toString(), e));
        events = Array.from(map.values());
        if (events.length === 0) {
          events = await Event.find({ status: "published" }).sort({ date: 1 }).limit(10);
        }
      } else {
        events = await Event.find({ status: "published" }).sort({ date: 1 }).limit(10);
      }

      const summaries = await Promise.all(
        events.map(async (ev) => {
          const evVariants = toIdVariants(ev._id);
          const lastMsg = await Message.findOne({
            type: "event_group",
            eventId: { $in: evVariants },
          })
            .sort({ createdAt: -1 })
            .select("text senderName createdAt");

          let unreadCount = 0;
          if (decoded?.id) {
            unreadCount = await Message.countDocuments({
              type: "event_group",
              eventId: { $in: evVariants },
              sender: { $nin: toIdVariants(decoded.id) },
              readBy: { $ne: decoded.id.toString() },
            });
          }

          return {
            _id: ev._id,
            title: ev.title,
            category: ev.category,
            date: ev.date,
            location: ev.location,
            volunteersCount: ev.volunteersCount || 0,
            capacity: ev.capacity,
            lastMessage: lastMsg || null,
            unreadCount,
          };
        })
      );
      return NextResponse.json({ success: true, data: summaries });
    }

    // 16. Chat: Messages for an event group
    if (route[0] === "chat" && route[1] === "events" && route[3] === "messages") {
      const decoded = verifyToken(request);
      const eventId = route[2];
      let event = null;
      try {
        event = await Event.findById(eventId);
      } catch (_) {}
      if (!event) {
        event = FALLBACK_EVENTS.find((e) => e._id === eventId || e.id === eventId);
      }

      const evVariants = toIdVariants(eventId);
      const messages = await Message.find({
        type: "event_group",
        eventId: { $in: evVariants },
      }).sort({ createdAt: 1 }).limit(300);

      // When user views event messages, mark them as read by this user
      if (decoded?.id) {
        await Message.updateMany(
          {
            type: "event_group",
            eventId: { $in: evVariants },
            readBy: { $ne: decoded.id.toString() },
          },
          { $addToSet: { readBy: decoded.id.toString() } }
        ).catch(() => {});
      }

      return NextResponse.json({
        success: true,
        data: {
          event: event
            ? {
                _id: event._id,
                title: event.title,
                category: event.category,
                date: event.date,
                location: event.location,
                capacity: event.capacity,
                volunteersCount: event.volunteersCount,
                creatorName: event.creatorName,
                creatorEmail: event.creatorEmail,
              }
            : null,
          messages,
        },
      });
    }

    // 17. Chat: Direct admin messages (for volunteer)
    if (path === "chat/direct/admin") {
      const decoded = verifyToken(request);
      if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      const { primaryAdmin, adminQueryVariants, adminStringIds } = await getAllAdminIdentities();
      if (!primaryAdmin) return NextResponse.json({ message: "Admin account not found" }, { status: 404 });

      const currentUserIdStr = decoded.id.toString();
      const currentUserVariants = toIdVariants(currentUserIdStr);

      const conversationIds = adminStringIds.map((aid) => [currentUserIdStr, aid].sort().join("_"));

      const messages = await Message.find({
        type: "direct",
        $or: [
          { conversationId: { $in: conversationIds } },
          { sender: { $in: currentUserVariants }, recipient: { $in: adminQueryVariants } },
          { sender: { $in: adminQueryVariants }, recipient: { $in: currentUserVariants } },
        ],
      }).sort({ createdAt: 1 });

      // Mark unread messages sent by admin to this user as read
      await Message.updateMany(
        { recipient: { $in: currentUserVariants }, read: false },
        { $set: { read: true } }
      ).catch(() => {});

      return NextResponse.json({
        success: true,
        data: {
          admin: {
            _id: primaryAdmin._id,
            name: primaryAdmin.name || "Halima Yesmin Omi",
            username: primaryAdmin.username || "omi",
            designation: primaryAdmin.designation || "Platform Admin & Lead Builder",
            photoURL: primaryAdmin.photoURL || "",
          },
          messages,
        },
      });
    }

    // 18. Chat: Direct conversations list (for admin)
    if (path === "chat/direct/conversations") {
      const decoded = verifyToken(request);
      if (!decoded || decoded.role !== "admin") {
        return NextResponse.json({ message: "Admin access required" }, { status: 403 });
      }
      const { adminQueryVariants, adminStringIds } = await getAllAdminIdentities();

      const messages = await Message.find({
        type: "direct",
        $or: [
          { sender: { $in: adminQueryVariants } },
          { recipient: { $in: adminQueryVariants } },
        ],
      }).sort({ createdAt: -1 });

      const conversationMap = new Map();
      for (const msg of messages) {
        const senderStr = msg.sender?.toString();
        const recipientStr = msg.recipient?.toString();
        const isAdminSender = adminStringIds.includes(senderStr);
        const otherUserId = isAdminSender ? recipientStr : senderStr;

        if (!otherUserId || adminStringIds.includes(otherUserId)) continue;

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
        if (adminStringIds.includes(recipientStr) && !msg.read) {
          conversationMap.get(otherUserId).unreadCount += 1;
        }
      }

      const userIds = Array.from(conversationMap.keys());
      const users = await User.find({
        $or: [
          { _id: { $in: userIds } },
          { _id: { $in: userIds.filter((id) => mongoose.Types.ObjectId.isValid(id)).map((id) => new mongoose.Types.ObjectId(id)) } },
        ],
      }).select("name username email role designation photoURL");

      const userDict = new Map();
      users.forEach((u) => userDict.set(u._id.toString(), u));

      const result = userIds.map((uid) => ({
        user: userDict.get(uid) || { _id: uid, name: "Volunteer User", email: "" },
        lastMessage: conversationMap.get(uid).lastMessage,
        unreadCount: conversationMap.get(uid).unreadCount,
      }));

      return NextResponse.json({ success: true, data: result });
    }

    // 19. Chat: Direct user conversation messages (for admin)
    if (route[0] === "chat" && route[1] === "direct" && route[2] === "user" && route[3]) {
      const decoded = verifyToken(request);
      if (!decoded || decoded.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      const targetUserId = route[3];
      const targetVariants = toIdVariants(targetUserId);

      let targetUser = await User.findOne({ _id: { $in: targetVariants } }).select("name username email role designation photoURL");
      if (!targetUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

      const { adminQueryVariants, adminStringIds } = await getAllAdminIdentities();
      const conversationIds = adminStringIds.map((aid) => [targetUserId.toString(), aid].sort().join("_"));

      const messages = await Message.find({
        type: "direct",
        $or: [
          { conversationId: { $in: conversationIds } },
          { sender: { $in: targetVariants }, recipient: { $in: adminQueryVariants } },
          { sender: { $in: adminQueryVariants }, recipient: { $in: targetVariants } },
        ],
      }).sort({ createdAt: 1 });

      // Mark volunteer messages to admin as read
      await Message.updateMany(
        { sender: { $in: targetVariants }, recipient: { $in: adminQueryVariants }, read: false },
        { $set: { read: true } }
      ).catch(() => {});

      return NextResponse.json({
        success: true,
        data: {
          user: targetUser,
          messages,
        },
      });
    }

    // 20. Notifications (Real database queries for direct chats & event group messages)
    if (path === "notifications") {
      const decoded = verifyToken(request);
      if (!decoded) {
        return NextResponse.json({ success: true, data: { notifications: [], unreadCount: 0, unreadChatCount: 0 } });
      }

      const userIdStr = decoded.id.toString();
      const userVariants = toIdVariants(userIdStr);
      const isAdmin = decoded.role === "admin";
      const { adminQueryVariants } = await getAllAdminIdentities();

      const notifs = [];

      // A. Unread direct messages
      let directUnread = [];
      if (isAdmin) {
        directUnread = await Message.find({
          type: "direct",
          recipient: { $in: adminQueryVariants },
          sender: { $nin: adminQueryVariants },
          read: false,
        })
          .sort({ createdAt: -1 })
          .limit(20);
      } else {
        directUnread = await Message.find({
          type: "direct",
          recipient: { $in: userVariants },
          read: false,
        })
          .sort({ createdAt: -1 })
          .limit(20);
      }

      directUnread.forEach((m) => {
        notifs.push({
          _id: m._id.toString(),
          type: "chat_direct",
          title: isAdmin
            ? `Direct message from ${m.senderName}`
            : `Direct message from ${m.senderName} (Admin)`,
          message: m.text,
          senderId: m.sender?.toString(),
          senderName: m.senderName,
          senderPhoto: m.senderPhoto,
          read: false,
          createdAt: m.createdAt,
          link: isAdmin ? `/dashboard/chat?user=${m.sender?.toString()}` : `/dashboard/chat`,
        });
      });

      // B. Recent event group messages in events user is part of
      let userEventIds = [];
      if (isAdmin) {
        const recentEvMsgs = await Message.find({
          type: "event_group",
          sender: { $nin: adminQueryVariants },
        })
          .sort({ createdAt: -1 })
          .limit(10);
        userEventIds = Array.from(new Set(recentEvMsgs.map((m) => m.eventId?.toString()).filter(Boolean)));
      } else {
        const [registrations, createdEvents] = await Promise.all([
          Registration.find({ userId: { $in: userVariants } }).select("eventId"),
          Event.find({ creatorEmail: decoded.email }).select("_id"),
        ]);
        userEventIds = [
          ...registrations.map((r) => r.eventId?.toString()).filter(Boolean),
          ...createdEvents.map((e) => e._id.toString()),
        ];
        if (userEventIds.length === 0) {
          const publicEvents = await Event.find({ status: "published" }).select("_id").limit(5);
          userEventIds = publicEvents.map((e) => e._id.toString());
        }
      }

      const allEventVariants = [];
      userEventIds.forEach((eid) => {
        toIdVariants(eid).forEach((v) => allEventVariants.push(v));
      });

      if (allEventVariants.length > 0) {
        const eventGroupMsgs = await Message.find({
          type: "event_group",
          eventId: { $in: allEventVariants },
          sender: { $nin: userVariants },
        })
          .sort({ createdAt: -1 })
          .limit(15);

        const uniqueEids = Array.from(new Set(eventGroupMsgs.map((m) => m.eventId?.toString()).filter(Boolean)));
        const events = await Event.find({
          $or: [
            { _id: { $in: uniqueEids } },
            { _id: { $in: uniqueEids.filter((id) => mongoose.Types.ObjectId.isValid(id)).map((id) => new mongoose.Types.ObjectId(id)) } },
          ],
        }).select("title");
        const eventTitleMap = new Map();
        events.forEach((e) => eventTitleMap.set(e._id.toString(), e.title));

        eventGroupMsgs.forEach((m) => {
          const eid = m.eventId?.toString();
          const isRead = Array.isArray(m.readBy) && m.readBy.includes(userIdStr);
          notifs.push({
            _id: m._id.toString(),
            type: "chat_event",
            eventId: eid,
            title: `Event Group: ${eventTitleMap.get(eid) || "Volunteer Team"}`,
            message: `${m.senderName}: ${m.text}`,
            senderName: m.senderName,
            senderPhoto: m.senderPhoto,
            read: isRead,
            createdAt: m.createdAt,
            link: `/dashboard/chat?event=${eid}`,
          });
        });
      }

      // C. General System / Welcome Notification if empty
      if (notifs.length === 0) {
        notifs.push({
          _id: "system_welcome",
          type: "system",
          title: "স্বাগতম KindConnect-এ!",
          message: "নতুন ভলান্টিয়ার ইভেন্টে যোগ দিন এবং ইভেন্ট চ্যাটে যুক্ত থাকুন।",
          read: true,
          createdAt: new Date(),
          link: "/dashboard/events",
        });
      }

      notifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const unreadCount = notifs.filter((n) => !n.read).length;
      const unreadChatCount = notifs.filter((n) => !n.read && (n.type === "chat_direct" || n.type === "chat_event")).length;

      return NextResponse.json({
        success: true,
        data: {
          notifications: notifs,
          unreadCount,
          unreadChatCount,
        },
        notifications: notifs,
        unreadCount,
        unreadChatCount,
      });
    }

    // 21. Admin Stats
    if (path === "admin/stats") {
      const decoded = verifyToken(request);
      if (!decoded || decoded.role !== "admin") {
        return NextResponse.json({ message: "Admin access required" }, { status: 403 });
      }
      const [totalUsers, totalEvents, totalRegistrations, totalEmergency] = await Promise.all([
        User.countDocuments(),
        Event.countDocuments(),
        Registration.countDocuments(),
        EmergencyRequest.countDocuments(),
      ]);
      return NextResponse.json({
        success: true,
        data: { totalUsers, totalEvents, totalRegistrations, totalEmergency },
      });
    }

    // 22. Admin Users
    if (path === "admin/users") {
      const decoded = verifyToken(request);
      if (!decoded || decoded.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      const users = await User.find().select("-password").sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: users });
    }

    // 22.5. Admin: Single User Profile Inspector with Activity History
    if (route[0] === "admin" && route[1] === "users" && route[2] && (route[3] === "profile" || route.length === 3)) {
      const decoded = verifyToken(request);
      if (!decoded || decoded.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

      const targetUserId = route[2];
      let targetUser = null;
      try {
        targetUser = await User.findById(targetUserId).select("-password");
      } catch (_) {}

      if (!targetUser) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      const [registrations, createdEvents, attendances] = await Promise.all([
        Registration.find({ userId: targetUser._id }).populate("eventId").sort({ registeredAt: -1 }).limit(50),
        Event.find({ creatorEmail: targetUser.email }).sort({ date: -1 }).limit(50),
        Attendance.find({ userId: targetUser._id }).populate("eventId").sort({ checkedInAt: -1 }).limit(50),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          user: targetUser,
          registrations,
          createdEvents,
          attendances,
          stats: {
            joinedCount: registrations.length,
            createdCount: createdEvents.length,
            attendedCount: attendances.length,
          }
        }
      });
    }

    // 23. Admin Events
    if (path === "admin/events") {
      const decoded = verifyToken(request);
      if (!decoded || decoded.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      const events = await Event.find().sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: events });
    }

    // 24. Admin Emergency
    if (path === "admin/emergency") {
      const decoded = verifyToken(request);
      if (!decoded || decoded.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      const emergency = await EmergencyRequest.find().sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: emergency });
    }

    // 25. Admin Registrations
    if (path === "admin/registrations") {
      const decoded = verifyToken(request);
      if (!decoded || decoded.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      const registrations = await Registration.find().populate("eventId").sort({ registeredAt: -1 });
      return NextResponse.json({ success: true, data: registrations });
    }

    return NextResponse.json({ message: "Endpoint not found", path }, { status: 404 });
  } catch (error) {
    console.error(`GET /api/${path} Error:`, error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}

// =============================================================================
// POST HANDLER
// =============================================================================
export async function POST(request, { params }) {
  const { route = [] } = await params;
  const path = route.join("/");

  try {
    await connectDB();
    const body = await request.json().catch(() => ({}));

    // 1. Auth: Register (Requires Genuine Google OAuth Verification)
    if (path === "auth/register") {
      const { name, email, password, photoURL, phone, googleToken } = body;
      if (!name || !email || !password) {
        return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
      }

      // Strict validation for real person name
      const nameValidation = validateRealName(name);
      if (!nameValidation.isValid) {
        return NextResponse.json({
          message: nameValidation.errorBn || nameValidation.error,
          errorEn: nameValidation.error
        }, { status: 400 });
      }

      const cleanEmail = email.trim().toLowerCase();

      // Strict validation for genuine Gmail address (rejects non-gmail, fake, dummy, disposable emails)
      const emailValidation = validateRealEmail(cleanEmail, { requireGmail: true });
      if (!emailValidation.isValid) {
        return NextResponse.json({
          message: emailValidation.errorBn || emailValidation.error,
          errorEn: emailValidation.error
        }, { status: 400 });
      }

      // Enforce Real Google OAuth Verification (Cannot register with unverified or fake Gmail)
      if (!googleToken) {
        return NextResponse.json({
          message: "আসল জিমেইল ভেরিফিকেশন ছাড়া কোনো অ্যাকাউন্ট তৈরি করা যাবে না। গুগল পপ-আপের মাধ্যমে আপনার আসল জিমেইল নিশ্চিত করুন।",
          errorEn: "Google OAuth verification required. Fake emails cannot create an account."
        }, { status: 400 });
      }

      try {
        const googleVerifyRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${googleToken}` },
        });

        if (!googleVerifyRes.ok) {
          return NextResponse.json({
            message: "গুগল অথেন্টিকেশন টোকেনটি সঠিক বা সক্রিয় নয়। অনুগ্রহ করে পুনরায় চেষ্টা করুন।",
            errorEn: "Invalid or expired Google OAuth token."
          }, { status: 401 });
        }

        const googleProfile = await googleVerifyRes.json();
        if (!googleProfile.email || googleProfile.email.toLowerCase().trim() !== cleanEmail) {
          return NextResponse.json({
            message: "গুগল দ্বারা ভেরিফাইড আসল জিমেইলের সাথে প্রদত্ত ইমেইলের মিল নেই। শুধুমাত্র যাচাইকৃত আসল জিমেইল দিয়ে অ্যাকাউন্ট তৈরি করা যাবে।",
            errorEn: "Provided email does not match verified Google account."
          }, { status: 400 });
        }
      } catch (tokenErr) {
        console.error("Google Token Verification Error:", tokenErr);
        return NextResponse.json({
          message: "গুগল ভেরিফিকেশন সার্ভারের সাথে সংযোগ করা যায়নি। ইন্টারনেট কানেকশন চেক করে আবার চেষ্টা করুন।",
          errorEn: "Could not reach Google verification service."
        }, { status: 500 });
      }

      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return NextResponse.json({ message: "An account with this email already exists" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // All regular registrations are strictly assigned the 'user' role
      const newUser = await User.create({
        name: name.trim(),
        username: cleanEmail.split("@")[0],
        email: cleanEmail,
        password: hashedPassword,
        phone: typeof phone === "string" ? phone.trim() : "",
        photoURL: photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        role: "user",
        designation: "Active Volunteer",
        points: 150,
        hoursVolunteered: 2,
      });

      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, role: newUser.role, name: newUser.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const userObj = newUser.toObject();
      delete userObj.password;

      return NextResponse.json({
        success: true,
        message: "Account created successfully",
        token,
        user: userObj,
      });
    }

    // 2. Auth: Login
    if (path === "auth/login") {
      const { email, password } = body;
      if (!email || !password) {
        return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
      }

      const cleanIdentifier = email.trim().toLowerCase();

      // Strict validation if email is provided
      if (cleanIdentifier.includes("@")) {
        const emailValidation = validateRealEmail(cleanIdentifier);
        if (!emailValidation.isValid) {
          return NextResponse.json({
            message: emailValidation.errorBn || emailValidation.error,
            errorEn: emailValidation.error
          }, { status: 400 });
        }
      }

      const user = await User.findOne({
        $or: [{ email: cleanIdentifier }, { username: cleanIdentifier }],
      });

      if (!user) {
        return NextResponse.json({
          message: "এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি। সঠিক নিবন্ধিত ইমেইল দিন।",
          errorEn: "No account found with this email or username."
        }, { status: 404 });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ message: "Invalid credentials. Please check your password." }, { status: 401 });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const userObj = user.toObject();
      delete userObj.password;

      return NextResponse.json({
        success: true,
        message: "Login successful",
        token,
        user: userObj,
      });
    }

    // 3. Auth: Google Login
    if (path === "auth/google" || path === "auth/social") {
      const userInfo = body.userInfo || body;
      if (!userInfo?.email) {
        return NextResponse.json({ message: "Google account information required" }, { status: 400 });
      }

      const cleanEmail = userInfo.email.trim().toLowerCase();
      const emailValidation = validateRealEmail(cleanEmail, { requireGmail: true });
      if (!emailValidation.isValid) {
        return NextResponse.json({
          message: emailValidation.errorBn || emailValidation.error,
          errorEn: emailValidation.error
        }, { status: 400 });
      }

      let user = await User.findOne({ email: cleanEmail });

      if (!user) {
        const dummyPassword = userInfo.password 
          ? await bcrypt.hash(userInfo.password, 10) 
          : await bcrypt.hash(`google_${Date.now()}_kc`, 10);
        user = await User.create({
          name: userInfo.name || cleanEmail.split("@")[0],
          username: cleanEmail.split("@")[0],
          email: cleanEmail,
          password: dummyPassword,
          phone: userInfo.phone ? userInfo.phone.trim() : "",
          photoURL: userInfo.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          role: "user",
          designation: "Active Volunteer",
          points: 150,
          hoursVolunteered: 4,
        });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const userObj = user.toObject();
      delete userObj.password;

      return NextResponse.json({
        success: true,
        token,
        user: userObj,
      });
    }

    // 3.5. Admin: Direct Security Portal Authentication (name: omi, pass: Omi@2026)
    if (path === "admin/auth") {
      const { username, password } = body;
      const cleanUsername = (username || "").trim().toLowerCase();

      // Enforce strict credentials: name must be 'omi' and password 'Omi@2026'
      if (cleanUsername !== "omi" || password !== "Omi@2026") {
        return NextResponse.json({
          message: "অ্যাক্সেস সংরক্ষিত। শুধুমাত্র অনুমোদিত অ্যাডমিন (omi) এবং সঠিক পাসওয়ার্ড দিয়ে প্রবেশ করা যাবে।",
          errorEn: "Invalid admin credentials. Access denied."
        }, { status: 403 });
      }

      let adminUser = await User.findOne({
        $or: [{ username: "omi" }, { email: "omi@kindconnect.org" }]
      });

      if (!adminUser) {
        const hash = await bcrypt.hash("Omi@2026", 10);
        adminUser = await User.create({
          name: "Halima Yesmin Omi",
          username: "omi",
          email: "omi@kindconnect.org",
          password: hash,
          role: "admin",
          designation: "Platform Admin & Lead Builder",
          photoURL: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
          points: 1250,
          hoursVolunteered: 38
        });
      } else if (adminUser.role !== "admin") {
        adminUser.role = "admin";
        await adminUser.save();
      }

      const token = jwt.sign(
        { id: adminUser._id, email: adminUser.email, role: "admin", name: adminUser.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const userObj = adminUser.toObject();
      delete userObj.password;
      userObj.role = "admin";

      return NextResponse.json({
        success: true,
        message: "Welcome to KindConnect Admin Control Panel, Omi!",
        token,
        user: userObj
      });
    }

    // 4. Registrations: Join an event
    if (path === "registrations") {
      const decoded = verifyToken(request);
      if (!decoded) return NextResponse.json({ message: "Authentication required to join event" }, { status: 401 });

      const { eventId } = body;
      if (!eventId) return NextResponse.json({ message: "Event ID is required" }, { status: 400 });

      const event = await Event.findById(eventId);
      if (!event) return NextResponse.json({ message: "Event not found" }, { status: 404 });

      const existing = await Registration.findOne({ eventId, userId: decoded.id });
      if (existing) {
        return NextResponse.json({ message: "You are already registered for this event" }, { status: 400 });
      }

      if (event.volunteersCount >= event.capacity) {
        return NextResponse.json({ message: "Event is at full capacity" }, { status: 400 });
      }

      const registration = await Registration.create({
        eventId,
        userId: decoded.id,
        userEmail: decoded.email,
        userName: decoded.name || decoded.email.split("@")[0],
        status: "confirmed",
      });

      await Event.findByIdAndUpdate(eventId, { $inc: { volunteersCount: 1 } });

      return NextResponse.json({
        success: true,
        message: "Successfully joined the event!",
        data: registration,
      });
    }

    // 5. Attendance: Check in
    if (path === "attendance/check-in") {
      const decoded = verifyToken(request);
      if (!decoded) return NextResponse.json({ message: "Authentication required" }, { status: 401 });

      const { eventId } = body;
      if (!eventId) return NextResponse.json({ message: "Event ID is required" }, { status: 400 });

      const existing = await Attendance.findOne({ eventId, userId: decoded.id });
      if (existing) {
        return NextResponse.json({ message: "Attendance already verified for this event" }, { status: 400 });
      }

      const attendance = await Attendance.create({
        eventId,
        userId: decoded.id,
        userEmail: decoded.email,
        userName: decoded.name || "Volunteer",
        pointsAwarded: 100,
      });

      await User.findByIdAndUpdate(decoded.id, { $inc: { points: 100, hoursVolunteered: 3 } });

      return NextResponse.json({
        success: true,
        message: "Attendance verified successfully! +100 Points awarded 🎉",
        data: attendance,
      });
    }

    // 6. Emergency: Create request
    if (path === "emergency") {
      const decoded = verifyToken(request);
      const reqData = {
        ...body,
        requesterEmail: decoded?.email || body.requesterEmail || "citizen@kindconnect.org",
        requesterName: decoded?.name || body.requesterName || "Community Member",
        volunteersJoined: 0,
        responders: [],
      };
      const emergency = await EmergencyRequest.create(reqData);
      return NextResponse.json({ success: true, message: "Emergency request posted", data: emergency });
    }

    // 7. Emergency: Respond to request (join relief team)
    if (route[0] === "emergency" && route[2] === "respond") {
      const emergencyId = route[1];
      const decoded = verifyToken(request);
      const user = decoded ? await User.findById(decoded.id) : null;

      const emergency = await EmergencyRequest.findById(emergencyId);
      if (!emergency) return NextResponse.json({ message: "Emergency request not found" }, { status: 404 });

      const responderData = {
        userId: user?._id || null,
        name: body.name || user?.name || decoded?.name || "Kind Helper",
        email: body.email || user?.email || decoded?.email || "helper@kindconnect.org",
        phone: body.phone || user?.phone || "+880 1700-000000",
        photoURL: user?.photoURL || body.photoURL || "",
        message: body.message || "I am volunteering to help in this emergency situation!",
        respondedAt: new Date(),
      };

      emergency.responders.push(responderData);
      emergency.volunteersJoined = emergency.responders.length;
      await emergency.save();

      return NextResponse.json({
        success: true,
        message: "Thank you! You have joined the emergency relief team.",
        data: emergency,
      });
    }

    // 8. Chat: Send event group message
    if (route[0] === "chat" && route[1] === "events" && route[3] === "messages") {
      const decoded = verifyToken(request);
      if (!decoded) return NextResponse.json({ message: "Authentication required" }, { status: 401 });

      const eventId = route[2];
      const { text } = body;
      if (!text || !text.trim()) return NextResponse.json({ message: "Message text is required" }, { status: 400 });

      let user = null;
      try {
        if (decoded.id) user = await User.findById(decoded.id);
      } catch (_) {}
      if (!user && decoded.email) {
        try {
          user = await User.findOne({ email: decoded.email.toLowerCase() });
        } catch (_) {}
      }

      const senderId = user?._id || decoded.id;
      const senderRole = user?.role || decoded.role || "user";
      const isAdmin = senderRole === "admin" || decoded.role === "admin";

      const message = await Message.create({
        type: "event_group",
        eventId: eventId.toString(),
        sender: senderId,
        senderName: user?.name || decoded.name || "Volunteer",
        senderUsername: user?.username || (decoded.email ? decoded.email.split("@")[0] : (decoded.name || "volunteer")),
        senderRole,
        senderDesignation: user?.designation || (isAdmin ? "Platform Admin & Lead Builder" : "Volunteer"),
        senderPhoto: user?.photoURL || "",
        text: text.trim(),
        read: false,
        readBy: [senderId.toString()],
      });

      return NextResponse.json({ success: true, data: message });
    }

    // 9. Chat: Send direct message to Platform Admin
    if (path === "chat/direct/admin") {
      const decoded = verifyToken(request);
      if (!decoded) return NextResponse.json({ message: "Authentication required" }, { status: 401 });
      const { text } = body;
      if (!text || !text.trim()) return NextResponse.json({ message: "Message content cannot be empty" }, { status: 400 });

      const admin = await getPrimaryAdmin();
      if (!admin) return NextResponse.json({ message: "Admin account not found" }, { status: 404 });

      let sender = null;
      try {
        if (decoded.id) sender = await User.findById(decoded.id);
      } catch (_) {}
      if (!sender && decoded.email) {
        try {
          sender = await User.findOne({ email: decoded.email.toLowerCase() });
        } catch (_) {}
      }

      const senderId = sender?._id || decoded.id;
      const senderRole = sender?.role || decoded.role || "user";
      const isAdmin = senderRole === "admin" || decoded.role === "admin";
      const adminId = admin._id.toString();
      const conversationId = [senderId.toString(), adminId].sort().join("_");

      const message = await Message.create({
        type: "direct",
        conversationId,
        sender: senderId,
        senderName: sender?.name || decoded.name || "Volunteer",
        senderUsername: sender?.username || (decoded.email ? decoded.email.split("@")[0] : (decoded.name || "volunteer")),
        senderRole,
        senderDesignation: sender?.designation || (isAdmin ? "Platform Admin & Lead Builder" : "Volunteer"),
        senderPhoto: sender?.photoURL || "",
        recipient: admin._id,
        recipientName: admin.name,
        text: text.trim(),
        read: false,
        readBy: [senderId.toString()],
      });

      return NextResponse.json({ success: true, data: message }, { status: 201 });
    }

    // 10. Chat: Admin replies directly to specific volunteer
    if (route[0] === "chat" && route[1] === "direct" && route[2] === "user" && route[3]) {
      const decoded = verifyToken(request);
      if (!decoded || decoded.role !== "admin") return NextResponse.json({ message: "Admin access required" }, { status: 403 });
      const targetUserId = route[3];
      const { text } = body;
      if (!text || !text.trim()) return NextResponse.json({ message: "Message content cannot be empty" }, { status: 400 });

      let targetUser = null;
      try {
        targetUser = await User.findById(targetUserId);
      } catch (_) {}
      if (!targetUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

      let adminUser = null;
      try {
        adminUser = await User.findById(decoded.id);
      } catch (_) {}

      const senderId = adminUser?._id || decoded.id;
      const conversationId = [senderId.toString(), targetUserId.toString()].sort().join("_");

      const message = await Message.create({
        type: "direct",
        conversationId,
        sender: senderId,
        senderName: adminUser?.name || "Halima Yesmin Omi",
        senderUsername: adminUser?.username || "omi",
        senderRole: "admin",
        senderDesignation: adminUser?.designation || "Platform Admin & Lead Builder",
        senderPhoto: adminUser?.photoURL || "",
        recipient: targetUser._id,
        recipientName: targetUser.name,
        text: text.trim(),
        read: false,
        readBy: [senderId.toString()],
      });

      return NextResponse.json({ success: true, data: message }, { status: 201 });
    }

    // 11. Events: Create event
    if (path === "events") {
      const decoded = verifyToken(request);
      if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

      const newEvent = await Event.create({
        ...body,
        creatorEmail: decoded.email,
        creatorName: decoded.name || decoded.email.split("@")[0],
      });

      return NextResponse.json({ success: true, message: "Event created successfully", data: newEvent });
    }

    // 12. Notifications: Mark all read
    if (path === "notifications/mark-all-read") {
      const decoded = verifyToken(request);
      if (decoded?.id) {
        const userIdStr = decoded.id.toString();
        const userVariants = toIdVariants(userIdStr);
        const { adminQueryVariants } = await getAllAdminIdentities();

        if (decoded.role === "admin") {
          await Message.updateMany(
            { recipient: { $in: adminQueryVariants }, read: false },
            { $set: { read: true } }
          );
        } else {
          await Message.updateMany(
            { recipient: { $in: userVariants }, read: false },
            { $set: { read: true } }
          );
        }

        await Message.updateMany(
          { type: "event_group", readBy: { $ne: userIdStr } },
          { $addToSet: { readBy: userIdStr } }
        );
      }
      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    }

    return NextResponse.json({ message: "Endpoint not found", path }, { status: 404 });
  } catch (error) {
    console.error(`POST /api/${path} Error:`, error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}

// =============================================================================
// PATCH HANDLER
// =============================================================================
export async function PATCH(request, { params }) {
  const { route = [] } = await params;
  const path = route.join("/");

  try {
    await connectDB();
    const body = await request.json().catch(() => ({}));
    const decoded = verifyToken(request);

    // 0. User: Update own profile (name, bio, phone, location, photoURL, password)
    if (path === "auth/profile" || path === "auth/user") {
      if (!decoded) return NextResponse.json({ message: "Authentication required" }, { status: 401 });
      const user = await User.findById(decoded.id);
      if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

      const { name, bio, phone, photoURL, location, currentPassword, newPassword } = body;

      if (name && typeof name === "string") {
        const nameVal = validateRealName(name);
        if (!nameVal.isValid) {
          return NextResponse.json({ message: nameVal.errorBn || nameVal.error }, { status: 400 });
        }
        user.name = name.trim();
      }

      if (typeof bio === "string") {
        user.bio = bio.trim().slice(0, 500);
      }

      if (typeof phone === "string") {
        user.phone = phone.trim();
      }

      if (typeof location === "string") {
        user.location = location.trim();
      }

      if (typeof photoURL === "string") {
        user.photoURL = photoURL.trim();
      }

      // Password update if provided
      if (newPassword) {
        if (!currentPassword) {
          return NextResponse.json({ message: "পাসওয়ার্ড পরিবর্তনের জন্য বর্তমান পাসওয়ার্ড দিন।" }, { status: 400 });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return NextResponse.json({ message: "বর্তমান পাসওয়ার্ডটি সঠিক নয়।" }, { status: 400 });
        }
        if (newPassword.length < 6) {
          return NextResponse.json({ message: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" }, { status: 400 });
        }
        user.password = await bcrypt.hash(newPassword, 10);
      }

      await user.save();

      const userObj = user.toObject();
      delete userObj.password;

      return NextResponse.json({
        success: true,
        message: "প্রোফাইল সফলভাবে আপডেট করা হয়েছে!",
        user: userObj,
        data: userObj,
      });
    }

    // 1. Notifications: Mark read
    if (route[0] === "notifications" && route[2] === "read") {
      const decoded = verifyToken(request);
      const notifId = route[1];
      if (decoded?.id && mongoose.Types.ObjectId.isValid(notifId)) {
        await Message.findByIdAndUpdate(notifId, {
          read: true,
          $addToSet: { readBy: decoded.id.toString() },
        }).catch(() => {});
      }
      return NextResponse.json({ success: true, message: "Marked as read" });
    }

    // 2. Events: Update event
    if (route[0] === "events" && route.length === 2) {
      if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      const eventId = route[1];
      const updated = await Event.findByIdAndUpdate(eventId, body, { new: true });
      return NextResponse.json({ success: true, data: updated });
    }

    // 3. Admin: Update user role / governance
    if (route[0] === "admin" && route[1] === "users" && route[2]) {
      if (!decoded || decoded.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      const userId = route[2];

      const updateData = {};
      if (body.role) updateData.role = body.role;
      if (body.designation) updateData.designation = body.designation;
      if (typeof body.points === "number") updateData.points = body.points;
      if (typeof body.hoursVolunteered === "number") updateData.hoursVolunteered = body.hoursVolunteered;
      if (typeof body.phone === "string") updateData.phone = body.phone.trim();
      if (typeof body.location === "string") updateData.location = body.location.trim();
      if (typeof body.bio === "string") updateData.bio = body.bio.trim().slice(0, 500);

      const updated = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
      return NextResponse.json({ success: true, message: "User updated successfully", data: updated });
    }

    // 4. Admin / Emergency: Verify emergency request
    if ((route[0] === "admin" && route[1] === "emergency" && route[3] === "verify") || (route[0] === "emergency" && route[2] === "verify")) {
      const id = route[0] === "admin" ? route[2] : route[1];
      const updated = await EmergencyRequest.findByIdAndUpdate(id, body, { new: true });
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ message: "Endpoint not found", path }, { status: 404 });
  } catch (error) {
    console.error(`PATCH /api/${path} Error:`, error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}

// =============================================================================
// DELETE HANDLER
// =============================================================================
export async function DELETE(request, { params }) {
  const { route = [] } = await params;
  const path = route.join("/");

  try {
    await connectDB();

    // 1. Registrations: Cancel registration
    if (route[0] === "registrations" && route.length === 2) {
      const decoded = verifyToken(request);
      if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

      const eventId = route[1];
      const deleted = await Registration.findOneAndDelete({ eventId, userId: decoded.id });
      if (deleted) {
        await Event.findByIdAndUpdate(eventId, { $inc: { volunteersCount: -1 } });
      }

      return NextResponse.json({ success: true, message: "Registration cancelled" });
    }

    // 2. Events: Delete event
    if (route[0] === "events" && route.length === 2) {
      const decoded = verifyToken(request);
      if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      const eventId = route[1];
      await Event.findByIdAndDelete(eventId);
      return NextResponse.json({ success: true, message: "Event deleted" });
    }

    // 3. Admin Events: Delete
    if (route[0] === "admin" && route[1] === "events" && route[2]) {
      const decoded = verifyToken(request);
      if (!decoded || decoded.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      await Event.findByIdAndDelete(route[2]);
      return NextResponse.json({ success: true, message: "Event deleted by admin" });
    }

    // 4. Admin Users: Delete
    if (route[0] === "admin" && route[1] === "users" && route[2]) {
      const decoded = verifyToken(request);
      if (!decoded || decoded.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      await User.findByIdAndDelete(route[2]);
      return NextResponse.json({ success: true, message: "User deleted by admin" });
    }

    // 5. Admin Emergency: Delete
    if (route[0] === "admin" && route[1] === "emergency" && route[2]) {
      const decoded = verifyToken(request);
      if (!decoded || decoded.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      await EmergencyRequest.findByIdAndDelete(route[2]);
      return NextResponse.json({ success: true, message: "Emergency request deleted by admin" });
    }

    return NextResponse.json({ message: "Endpoint not found", path }, { status: 404 });
  } catch (error) {
    console.error(`DELETE /api/${path} Error:`, error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}

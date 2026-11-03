import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import Attendance from "@/models/Attendance";
import EmergencyRequest from "@/models/EmergencyRequest";
import Message from "@/models/Message";
import { FALLBACK_EVENTS } from "@/lib/fallbackData";
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

// Ensure default events exist in DB if empty
async function ensureSeedEvents() {
  const count = await Event.countDocuments();
  if (count === 0 && FALLBACK_EVENTS?.length > 0) {
    const seedData = FALLBACK_EVENTS.map(e => ({
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

// GET Handler
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
      const events = await Event.find({ status: "published" }).limit(3);
      return NextResponse.json({ success: true, data: events });
    }

    // 6. Events: My created events
    if (path === "events/user/my-events") {
      const decoded = verifyToken(request);
      if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      const events = await Event.find({ creatorEmail: decoded.email }).sort({ date: 1 });
      return NextResponse.json({ success: true, data: events });
    }

    // 7. Events: Single event details
    if (route[0] === "events" && route.length === 2) {
      const eventId = route[1];
      const event = await Event.findById(eventId).catch(() => null);
      if (!event) {
        const fallback = FALLBACK_EVENTS.find(e => e._id === eventId || e.id === eventId);
        if (fallback) return NextResponse.json({ success: true, data: fallback });
        return NextResponse.json({ message: "Event not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: event });
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
      const code = `KC-${eventId.slice(-6).toUpperCase()}-${new Date().toISOString().slice(0, 10)}`;
      return NextResponse.json({ success: true, code, eventId });
    }

    // 11. Attendance: My attendance
    if (path === "attendance/my-attendance") {
      const decoded = verifyToken(request);
      if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      const records = await Attendance.find({ userId: decoded.id }).populate("eventId");
      const totalPoints = records.reduce((sum, r) => sum + (r.pointsAwarded || 100), 0);
      return NextResponse.json({ success: true, data: { attendedCount: records.length, totalPoints, records } });
    }

    // 12. Emergency requests
    if (path === "emergency") {
      const category = url.searchParams.get("category");
      let filter = {};
      if (category && category !== "All") filter.category = category;
      const requests = await EmergencyRequest.find(filter).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: requests });
    }

    // 13. Chat: Messages for an event
    if (route[0] === "chat" && route[1] === "events" && route[3] === "messages") {
      const eventId = route[2];
      const messages = await Message.find({ eventId, type: "event_group" }).sort({ createdAt: 1 }).limit(100);
      return NextResponse.json({ success: true, data: { messages } });
    }

    // 14. Chat: Direct admin messages
    if (path === "chat/direct/admin") {
      const decoded = verifyToken(request);
      if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      const messages = await Message.find({
        type: "direct",
        $or: [{ sender: decoded.id }, { recipient: decoded.id }],
      }).sort({ createdAt: 1 });
      return NextResponse.json({ success: true, data: { messages } });
    }

    // 15. Admin Stats
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

    // 16. Admin Users
    if (path === "admin/users") {
      const decoded = verifyToken(request);
      if (!decoded || decoded.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      const users = await User.find().select("-password").sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: users });
    }

    return NextResponse.json({ message: "Endpoint not found", path }, { status: 404 });
  } catch (error) {
    console.error(`GET /api/${path} Error:`, error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}

// POST Handler
export async function POST(request, { params }) {
  const { route = [] } = await params;
  const path = route.join("/");

  try {
    await connectDB();
    const body = await request.json().catch(() => ({}));

    // 1. Auth: Register
    if (path === "auth/register") {
      const { name, email, password, photoURL } = body;
      if (!name || !email || !password) {
        return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
      }

      const cleanEmail = email.trim().toLowerCase();
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return NextResponse.json({ message: "An account with this email already exists" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const isLead = cleanEmail.includes("halima") || cleanEmail.includes("omi");

      const newUser = await User.create({
        name: name.trim(),
        username: cleanEmail.split("@")[0],
        email: cleanEmail,
        password: hashedPassword,
        photoURL: photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        role: isLead ? "admin" : "user",
        designation: isLead ? "Platform Admin & Lead Builder" : "Active Volunteer",
        points: isLead ? 1250 : 100,
        hoursVolunteered: isLead ? 38 : 2,
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
      const user = await User.findOne({
        $or: [{ email: cleanIdentifier }, { username: cleanIdentifier }],
      });

      if (!user) {
        return NextResponse.json({ message: "No account found with this email or username" }, { status: 404 });
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
    if (path === "auth/google") {
      const { userInfo } = body;
      if (!userInfo?.email) {
        return NextResponse.json({ message: "Google account information required" }, { status: 400 });
      }

      const cleanEmail = userInfo.email.trim().toLowerCase();
      let user = await User.findOne({ email: cleanEmail });

      const isLead = cleanEmail.includes("halima") || cleanEmail.includes("omi");

      if (!user) {
        const dummyPassword = await bcrypt.hash(`google_${Date.now()}_kc`, 10);
        user = await User.create({
          name: userInfo.name || cleanEmail.split("@")[0],
          username: cleanEmail.split("@")[0],
          email: cleanEmail,
          password: dummyPassword,
          photoURL: userInfo.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          role: isLead ? "admin" : "user",
          designation: isLead ? "Platform Admin & Lead Builder" : "Active Volunteer",
          points: isLead ? 1250 : 150,
          hoursVolunteered: isLead ? 38 : 4,
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
      };
      const emergency = await EmergencyRequest.create(reqData);
      return NextResponse.json({ success: true, message: "Emergency request posted", data: emergency });
    }

    // 7. Chat: Send event message
    if (route[0] === "chat" && route[1] === "events" && route[3] === "messages") {
      const decoded = verifyToken(request);
      if (!decoded) return NextResponse.json({ message: "Authentication required" }, { status: 401 });

      const eventId = route[2];
      const { text } = body;
      if (!text || !text.trim()) return NextResponse.json({ message: "Message text is required" }, { status: 400 });

      const user = await User.findById(decoded.id);

      const message = await Message.create({
        type: "event_group",
        eventId,
        sender: decoded.id,
        senderName: user?.name || decoded.name || "Volunteer",
        senderUsername: user?.username || decoded.email.split("@")[0],
        senderRole: user?.role || "user",
        senderDesignation: user?.designation || "Volunteer",
        senderPhoto: user?.photoURL || "",
        text: text.trim(),
      });

      return NextResponse.json({ success: true, data: message });
    }

    // 8. Events: Create event
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

    return NextResponse.json({ message: "Endpoint not found", path }, { status: 404 });
  } catch (error) {
    console.error(`POST /api/${path} Error:`, error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}

// DELETE Handler
export async function DELETE(request, { params }) {
  const { route = [] } = await params;
  const path = route.join("/");

  try {
    await connectDB();

    // Registrations: Cancel registration
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

    return NextResponse.json({ message: "Endpoint not found", path }, { status: 404 });
  } catch (error) {
    console.error(`DELETE /api/${path} Error:`, error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}

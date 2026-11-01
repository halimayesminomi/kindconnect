import express from "express";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/events/recent
 * Return 6 most recent upcoming events (no auth required).
 * NOTE: This route must be defined BEFORE /:id to avoid conflicts.
 */
router.get("/recent", async (req, res) => {
  try {
    const events = await Event.find({
      date: { $gte: new Date() },
      status: "published",
    })
      .sort({ date: 1 })
      .limit(6);

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("Get recent events error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching recent events.",
    });
  }
});

/**
 * GET /api/events/user/my-events
 * Return events created by the logged-in user (protected).
 * NOTE: This route must be defined BEFORE /:id to avoid conflicts.
 */
router.get("/user/my-events", verifyToken, async (req, res) => {
  try {
    const events = await Event.find({ creatorEmail: req.user.email }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("Get my events error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching your events.",
    });
  }
});

/**
 * GET /api/events
 * Return all upcoming events with optional search and category filters.
 * Query params: ?search=keyword&category=Environment&all=true
 * No auth required.
 */
router.get("/", async (req, res) => {
  try {
    const { search, category, all } = req.query;
    const filter = {};

    // Exclude past events by default unless ?all=true
    if (all !== "true") {
      filter.date = { $gte: new Date() };
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Search by title or description (case-insensitive)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const events = await Event.find(filter).sort({ date: 1 });

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("Get events error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching events.",
    });
  }
});

/**
 * GET /api/events/:id
 * Return a single event by ID. No auth required.
 */
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Get event error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching event.",
    });
  }
});

/**
 * POST /api/events
 * Create a new event (protected).
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, category, image, location, date, time, capacity } =
      req.body;

    // Validate required fields
    if (!title || !description || !category || !image || !location || !date || !time || !capacity) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: title, description, category, image, location, date, time, capacity.",
      });
    }

    // Validate date is in the future
    const eventDate = new Date(date);
    if (eventDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Event date must be in the future.",
      });
    }

    const event = await Event.create({
      title,
      description,
      category,
      image,
      location,
      date: eventDate,
      time,
      capacity: Number(capacity),
      creatorEmail: req.user.email,
      creatorName: req.user.name,
    });

    return res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Create event error:", error.message);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error creating event.",
    });
  }
});

/**
 * PATCH /api/events/:id
 * Update an event (protected, ownership check).
 */
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Ownership check
    if (event.creatorEmail !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own events.",
      });
    }

    // If updating date, validate it's in the future
    if (req.body.date) {
      const newDate = new Date(req.body.date);
      if (newDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Event date must be in the future.",
        });
      }
      req.body.date = newDate;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Update event error:", error.message);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error updating event.",
    });
  }
});

/**
 * DELETE /api/events/:id
 * Delete an event and all its registrations (protected, ownership check).
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Ownership check
    if (event.creatorEmail !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own events.",
      });
    }

    // Delete all registrations for this event
    await Registration.deleteMany({ eventId: event._id });

    // Delete the event
    await Event.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Event and associated registrations deleted successfully.",
    });
  } catch (error) {
    console.error("Delete event error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error deleting event.",
    });
  }
});

export default router;

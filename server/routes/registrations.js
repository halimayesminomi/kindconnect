import express from "express";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import Notification from "../models/Notification.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /api/registrations
 * Register the current user for an event (protected).
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required.",
      });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Check if event is in the future
    if (new Date(event.date) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot register for past events.",
      });
    }

    // Check if user has already registered
    const existingRegistration = await Registration.findOne({
      eventId,
      userId: req.user.id,
    });
    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: "You have already registered for this event.",
      });
    }

    // Determine if event is full -> assign to waiting list
    const isFull = event.volunteersCount >= event.capacity;
    const registrationStatus = isFull ? "waitlist" : "confirmed";

    // Create registration
    const registration = await Registration.create({
      eventId,
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
      status: registrationStatus,
    });

    // Increment volunteersCount only if confirmed
    if (!isFull) {
      await Event.findByIdAndUpdate(eventId, {
        $inc: { volunteersCount: 1 },
      });
    }

    // Create confirmation or waitlist notification
    try {
      const notifTitle = isFull ? "Added to Waiting List ⏳" : "Registration Confirmed ✨";
      const notifMsg = isFull
        ? `Event capacity (${event.capacity}) reached. You have been placed on the waiting list for "${event.title}". You will be automatically moved to confirmed if a spot opens up.`
        : `You are registered for "${event.title}" on ${new Date(event.date).toLocaleDateString()}.`;

      await Notification.create({
        userId: req.user.id,
        title: notifTitle,
        message: notifMsg,
        type: isFull ? "warning" : "info",
      });
    } catch (notifErr) {
      console.warn("Notification error:", notifErr.message);
    }

    return res.status(201).json({
      success: true,
      isWaitlisted: isFull,
      message: isFull
        ? "Event is full. You have been added to the waiting list!"
        : "Registered successfully!",
      data: registration,
    });
  } catch (error) {
    console.error("Create registration error:", error.message);

    // Handle duplicate key error (compound index)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already registered for this event.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error creating registration.",
    });
  }
});

/**
 * DELETE /api/registrations/:eventId
 * Cancel the current user's registration for an event (protected).
 */
router.delete("/:eventId", verifyToken, async (req, res) => {
  try {
    const { eventId } = req.params;

    // Find and delete the registration
    const registration = await Registration.findOneAndDelete({
      eventId,
      userId: req.user.id,
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found.",
      });
    }

    // If the cancelled registration was confirmed, see if we can promote a waitlisted user
    if (registration.status === "confirmed") {
      const nextWaitlisted = await Registration.findOne({
        eventId,
        status: "waitlist",
      }).sort({ registeredAt: 1 });

      if (nextWaitlisted) {
        // Promote waitlisted volunteer to confirmed
        nextWaitlisted.status = "confirmed";
        await nextWaitlisted.save();

        // Send promotion notification
        try {
          const relatedEvent = await Event.findById(eventId);
          await Notification.create({
            userId: nextWaitlisted.userId,
            title: "Spot Opened! You are Confirmed 🎉",
            message: `A volunteer spot opened up for "${relatedEvent?.title || 'your event'}" and your waiting-list registration is now Confirmed!`,
            type: "success",
          });
        } catch (promoteErr) {
          console.warn("Waitlist notification error:", promoteErr.message);
        }
      } else {
        // No waitlist waiting -> decrement active volunteer count
        await Event.findByIdAndUpdate(eventId, {
          $inc: { volunteersCount: -1 },
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Registration cancelled successfully.",
    });
  } catch (error) {
    console.error("Cancel registration error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error cancelling registration.",
    });
  }
});

/**
 * GET /api/registrations/my-registrations
 * Get all registrations for the current user (protected).
 */
router.get("/my-registrations", verifyToken, async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user.id })
      .populate("eventId")
      .sort({ "eventId.date": -1 });

    return res.status(200).json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    console.error("Get my registrations error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching registrations.",
    });
  }
});

/**
 * GET /api/registrations/event/:eventId
 * Get all registrations for a specific event (protected, event creator only).
 */
router.get("/event/:eventId", verifyToken, async (req, res) => {
  try {
    const { eventId } = req.params;

    // Find the event and verify ownership
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Ownership check — only event creator can view registrations
    if (event.creatorEmail !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only the event creator can view registrations.",
      });
    }

    const registrations = await Registration.find({ eventId }).sort({
      registeredAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    console.error("Get event registrations error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching event registrations.",
    });
  }
});

export default router;

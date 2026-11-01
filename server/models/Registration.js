import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: [true, "Event ID is required"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  userEmail: {
    type: String,
    required: [true, "User email is required"],
  },
  userName: {
    type: String,
    required: [true, "User name is required"],
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["confirmed", "cancelled"],
    default: "confirmed",
  },
});

// Prevent duplicate registrations for the same event by the same user
registrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;

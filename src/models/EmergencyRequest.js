import mongoose from "mongoose";

const emergencyRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Winter Clothes & Blanket",
      "Blood Donation",
      "Flood Relief",
      "Food & Ration",
      "Medical Emergency",
      "Other",
    ],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  urgency: {
    type: String,
    enum: ["Critical", "High", "Moderate"],
    default: "High",
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  contactPhone: {
    type: String,
    required: [true, "Contact phone is required"],
  },
  requesterName: {
    type: String,
    required: true,
  },
  requesterEmail: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "fulfilled"],
    default: "open",
  },
  volunteersJoined: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const EmergencyRequest = mongoose.models.EmergencyRequest || mongoose.model("EmergencyRequest", emergencyRequestSchema);

export default EmergencyRequest;

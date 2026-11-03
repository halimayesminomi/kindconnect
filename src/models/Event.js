import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: {
      values: [
        "Environment",
        "Education",
        "Community",
        "Health",
        "Animals",
        "Emergency",
        "Other",
      ],
      message: "{VALUE} is not a valid category",
    },
  },
  image: {
    type: String,
    required: [true, "Image URL is required"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  time: {
    type: String,
    required: [true, "Time is required"],
  },
  capacity: {
    type: Number,
    required: [true, "Capacity is required"],
    min: [1, "Capacity must be at least 1"],
  },
  volunteersCount: {
    type: Number,
    default: 0,
  },
  creatorEmail: {
    type: String,
    required: [true, "Creator email is required"],
  },
  creatorName: {
    type: String,
    required: [true, "Creator name is required"],
  },
  status: {
    type: String,
    enum: ["published", "cancelled"],
    default: "published",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;

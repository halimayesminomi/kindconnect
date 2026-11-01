import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
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
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  pointsAwarded: {
    type: Number,
    default: 50,
  },
  checkInTime: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate attendance for the same event
attendanceSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;

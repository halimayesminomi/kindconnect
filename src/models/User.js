import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  username: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  photoURL: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["user", "organizer", "admin"],
    default: "user",
  },
  designation: {
    type: String,
    default: "Volunteer",
  },
  bio: {
    type: String,
    default: "",
    maxlength: 500,
  },
  phone: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "Sylhet, Bangladesh",
  },
  skills: {
    type: [String],
    default: [],
  },
  points: {
    type: Number,
    default: 100,
  },
  hoursVolunteered: {
    type: Number,
    default: 2,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

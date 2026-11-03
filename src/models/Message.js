import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["event_group", "direct"],
    required: true,
    default: "event_group",
  },
  eventId: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
    index: true,
  },
  sender: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  senderUsername: {
    type: String,
    default: "",
  },
  senderRole: {
    type: String,
    default: "user",
  },
  senderDesignation: {
    type: String,
    default: "Volunteer",
  },
  senderPhoto: {
    type: String,
    default: "",
  },
  recipient: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
    index: true,
  },
  recipientName: {
    type: String,
    default: "",
  },
  conversationId: {
    type: String,
    default: null,
    index: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  read: {
    type: Boolean,
    default: false,
  },
  readBy: {
    type: [String],
    default: [],
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;

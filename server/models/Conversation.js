const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "bot"], required: true },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ["text", "image_analysis", "wage_check", "safety_report", "rights"],
    default: "text",
  },
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    workerName: { type: String, default: "مزدور" },
    city: { type: String, default: "" },
    workType: { type: String, default: "" },
    messages: [messageSchema],
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
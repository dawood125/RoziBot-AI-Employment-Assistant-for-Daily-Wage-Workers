const mongoose = require("mongoose");

const safetyReportSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, default: "نامعلوم" },
    workType: { type: String, default: "" },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
    reportNumber: { type: String },
  },
  { timestamps: true }
);

safetyReportSchema.pre("save", function (next) {
  if (!this.reportNumber) {
    this.reportNumber = "SR-" + Date.now().toString(36).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("SafetyReport", safetyReportSchema);
const Conversation = require("../models/Conversation");
const SafetyReport = require("../models/SafetyReport");

exports.getStats = async (req, res) => {
  try {
    const totalWorkers = await Conversation.countDocuments();
    const totalMessages = await Conversation.aggregate([
      { $project: { count: { $size: "$messages" } } },
      { $group: { _id: null, total: { $sum: "$count" } } },
    ]);
    const totalReports = await SafetyReport.countDocuments();
    const criticalReports = await SafetyReport.countDocuments({
      severity: { $in: ["high", "critical"] },
    });
    const pendingReports = await SafetyReport.countDocuments({
      status: "pending",
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayWorkers = await Conversation.countDocuments({
      lastActive: { $gte: todayStart },
    });

    res.json({
      totalWorkers,
      totalMessages: totalMessages[0]?.total || 0,
      totalReports,
      criticalReports,
      pendingReports,
      todayWorkers,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const reports = await SafetyReport.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .select("sessionId workerName city workType lastActive messages")
      .sort({ lastActive: -1 })
      .limit(50);

    const formatted = conversations.map((c) => ({
      id: c._id,
      sessionId: c.sessionId,
      workerName: c.workerName,
      city: c.city,
      lastMessage: c.messages[c.messages.length - 1]?.content || "",
      messageCount: c.messages.length,
      lastActive: c.lastActive,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const report = await SafetyReport.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
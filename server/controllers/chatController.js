const Conversation = require("../models/Conversation");
const SafetyReport = require("../models/SafetyReport");
const gemini = require("../services/geminiService");

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId, image, mimeType } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId required" });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({ sessionId });
    if (!conversation) {
      conversation = new Conversation({ sessionId, messages: [] });
    }

    let botReply;
    let messageType = "text";

    if (image) {
      // Contract/image analysis
      messageType = "image_analysis";
      conversation.messages.push({
        role: "user",
        content: "[Worker sent a contract/document image]",
        type: messageType,
      });

      botReply = await gemini.analyzeImage(image, mimeType || "image/jpeg");
    } else {
      // Text message
      messageType = gemini.detectMessageType(message);

      conversation.messages.push({
        role: "user",
        content: message,
        type: messageType,
      });

      // Get recent history (last 20 messages for context)
      const recentHistory = conversation.messages.slice(-20).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      botReply = await gemini.chat(recentHistory);

      // If safety report detected, save it
      if (messageType === "safety_report") {
        const report = new SafetyReport({
          sessionId,
          description: message,
          severity: message.includes("خطرناک") || message.includes("گر")
            ? "high"
            : "medium",
        });
        await report.save();
      }
    }

    // Save bot response
    conversation.messages.push({
      role: "bot",
      content: botReply,
      type: messageType,
    });
    conversation.lastActive = new Date();
    await conversation.save();

    res.json({
      reply: botReply,
      type: messageType,
      sessionId,
    });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({
      error: "AI service error",
      reply:
        "معذرت، ابھی کچھ مسئلہ ہے۔ براہ کرم دوبارہ کوشش کریں۔ 🙏",
    });
  }
};

// Get conversation history
exports.getHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      return res.json({ messages: [] });
    }

    res.json({ messages: conversation.messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
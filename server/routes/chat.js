const router = require("express").Router();
const { sendMessage, getHistory } = require("../controllers/chatController");

router.post("/message", sendMessage);
router.get("/history/:sessionId", getHistory);

module.exports = router;
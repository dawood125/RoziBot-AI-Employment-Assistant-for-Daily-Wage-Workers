const router = require("express").Router();
const {
  getStats,
  getReports,
  getConversations,
  updateReportStatus,
} = require("../controllers/dashboardController");

router.get("/stats", getStats);
router.get("/reports", getReports);
router.get("/conversations", getConversations);
router.patch("/reports/:id", updateReportStatus);

module.exports = router;
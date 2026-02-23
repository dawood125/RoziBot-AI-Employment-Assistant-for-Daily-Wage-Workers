const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect DB
connectDB();

// Middleware

const allowedOrigins = [
  "http://localhost:5173",
  "https://rozi-bot-ai-employment-assistant-fo.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/chat", require("./routes/chat"));
app.use("/api/dashboard", require("./routes/dashboard"));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "RoziBot Server Running", timestamp: new Date() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server error", message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`RoziBot server running on port ${PORT}`));

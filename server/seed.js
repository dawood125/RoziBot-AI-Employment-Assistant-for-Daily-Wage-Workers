// Run: node seed.js
// Creates demo data for dashboard
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Conversation = require("./models/Conversation");
const SafetyReport = require("./models/SafetyReport");

const cities = [
  "لاہور",
  "کراچی",
  "اسلام آباد",
  "پشاور",
  "کوئٹہ",
  "فیصل آباد",
  "ملتان",
  "راولپنڈی",
];
const names = [
  "علی",
  "احمد",
  "محمد",
  "عمران",
  "بلال",
  "حسن",
  "خالد",
  "نعیم",
  "فاروق",
  "عثمان",
  "طارق",
  "سلیم",
  "رشید",
  "نواز",
  "شفیق",
];
const workTypes = [
  "تعمیراتی مزدور",
  "گھریلو ملازم",
  "فیکٹری ورکر",
  "زرعی مزدور",
  "دکان ملازم",
];

const safetyIssues = [
  "ہیلمٹ نہیں دیا جا رہا، اونچائی پر کام ہے",
  "سیفٹی بیلٹ کے بغیر کام کروایا جا رہا ہے",
  "بجلی کی تاریں کھلی ہیں، خطرناک ہے",
  "گرمی میں پانی نہیں دیا جاتا",
  "12 گھنٹے سے زیادہ کام کروایا جاتا ہے بغیر آرام",
  "بچوں سے کام کروایا جا رہا ہے",
  "مشینری خراب ہے، حادثہ ہو سکتا ہے",
  "کیمیکلز کے ساتھ بغیر دستانوں کے کام",
];

const sampleConversations = [
  [
    { role: "user", content: "السلام علیکم" },
    {
      role: "bot",
      content:
        "وعلیکم السلام! میں روزی بوٹ ہوں 🤖 آپ کی کیا مدد کر سکتا ہوں؟",
    },
    { role: "user", content: "مزدوری چیک کرنی ہے" },
    { role: "bot", content: "ضرور! آپ کیا کام کرتے ہیں اور کس شہر میں؟" },
    { role: "user", content: "لاہور میں تعمیراتی کام، 10 گھنٹے" },
    {
      role: "bot",
      content:
        "لاہور میں تعمیراتی کام کے لیے 10 گھنٹے کی مزدوری کم از کم 2000 روپے ہونی چاہیے۔ اگر آپ کو اس سے کم مل رہے ہیں تو یہ غیر منصفانہ ہے 💰",
    },
  ],
  [
    { role: "user", content: "بھائی خطرناک حالات ہیں یہاں" },
    { role: "bot", content: "کیا ہو رہا ہے؟ بتائیں تاکہ مدد کر سکوں ⚠️" },
    { role: "user", content: "اونچائی پر کام ہے اور ہیلمٹ نہیں دیا" },
    {
      role: "bot",
      content:
        "یہ بہت خطرناک ہے! قانون کے مطابق مالک کو حفاظتی سامان دینا لازمی ہے۔ رپورٹ درج کر رہا ہوں ✅",
    },
  ],
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  // Clear existing data
  await Conversation.deleteMany({});
  await SafetyReport.deleteMany({});

  // Create conversations
  for (let i = 0; i < 25; i++) {
    const convo = new Conversation({
      sessionId: `demo-${i}-${Date.now()}`,
      workerName: names[i % names.length],
      city: cities[i % cities.length],
      workType: workTypes[i % workTypes.length],
      messages: sampleConversations[i % sampleConversations.length].map(
        (m) => ({
          ...m,
          type: "text",
          timestamp: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
          ),
        })
      ),
      lastActive: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ),
    });
    await convo.save();
  }

  // Create safety reports
  for (let i = 0; i < 12; i++) {
    const report = new SafetyReport({
      sessionId: `demo-${i}`,
      description: safetyIssues[i % safetyIssues.length],
      location: cities[i % cities.length],
      workType: workTypes[i % workTypes.length],
      severity: ["low", "medium", "high", "critical"][
        Math.floor(Math.random() * 4)
      ],
      status: ["pending", "reviewed", "resolved"][
        Math.floor(Math.random() * 3)
      ],
      createdAt: new Date(
        Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000
      ),
    });
    await report.save();
  }

  console.log("Seed data created: 25 conversations, 12 safety reports");
  process.exit(0);
}

seed();
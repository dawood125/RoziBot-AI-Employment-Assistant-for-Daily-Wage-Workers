const wageData = require("../data/wages.json");

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `
You are RoziBot (روزی بوٹ), a caring AI assistant for daily wage workers (مزدور) in Pakistan.

## YOUR PERSONALITY
- You speak in simple, conversational Urdu (use Urdu script اردو)
- You are warm, respectful, and treat every worker with dignity
- You are like a trusted elder brother (بھائی) to the workers
- Keep responses SHORT (2-4 sentences max)
- Use simple words — many workers have limited education

## YOUR CAPABILITIES

### 1. FAIR WAGE CALCULATOR
When a worker asks about fair wages, ask for:
- Work type (construction/domestic/factory/agriculture/shop)
- City name
- Hours worked per day

⚠️ VERY IMPORTANT WAGE RULES:
- The wage data below shows DAILY wages (per day), NOT per hour
- "min" = minimum daily wage, "max" = maximum daily wage, "avg" = average daily wage
- For example: Lahore construction avg 2000 means Rs. 2000 PER DAY (8-10 hours work)
- If worker says they work 8-10 hours, give them the daily rate directly
- If worker works MORE than 10 hours, add overtime (1.5x rate for extra hours)
- For domestic/factory/shop workers, wages marked as "Monthly salary"
- NEVER multiply daily wage by hours worked
- NEVER say "per hour" — daily wage workers are paid PER DAY

WAGE DATA:
${JSON.stringify(wageData, null, 2)}

Example correct response:
Worker: "لاہور، تعمیراتی کام، 10 گھنٹے"
Answer: "لاہور میں تعمیراتی کام کی روزانہ مزدوری 1500 سے 2500 روپے ہے، اوسط 2000 روپے فی دن۔"
NOT: "2000 × 10 = 20000" ← THIS IS WRONG, NEVER DO THIS

### 2. SAFETY REPORTER
When a worker reports unsafe conditions:
- Take it seriously and show concern
- Ask what is happening and where
- Tell them it is their RIGHT to be safe
- Factories Act 1934 requires safety equipment
- Tell them NOT to work without safety equipment

### 3. RIGHTS ADVISOR
Key labor laws:
- Minimum wage: Rs. 32,000/month (2024)
- Maximum work hours: 48/week (8 hours/day, 6 days/week)
- Overtime: Must be paid at 1.5x rate for hours beyond 48/week
- EOBI: Employer must register workers
- Workplace injury: Compensation under Workmen's Compensation Act 1923
- No child labor under 14 years
- Workers can form unions
- Wages must be paid on time (Payment of Wages Act 1936)

### 4. CONTRACT HELP
When worker describes contract terms:
- Check if payment is fair (compare with wage data)
- Check if hours are legal (max 48/week)
- Highlight any unfair terms
- Suggest what to negotiate

## RESPONSE RULES
1. ALWAYS respond in Urdu script (اردو)
2. Keep it SHORT — max 3-4 sentences
3. Use emojis sparingly 💰🏗️⚠️✅
4. Show wage numbers clearly (e.g., "2000 روپے فی دن")
5. Danger reports = URGENT, show strong concern
6. NEVER multiply daily wage by hours
7. Be encouraging and supportive
`;

// ============ TEXT CHAT ============
async function chat(conversationHistory) {
  try {
    const messages = [{ role: "system", content: SYSTEM_PROMPT }];

    for (const msg of conversationHistory) {
      if (!msg.content || !msg.content.trim()) continue;
      messages.push({
        role: msg.role === "bot" ? "assistant" : "user",
        content: msg.content,
      });
    }

    console.log("🤖 Sending to Groq with", messages.length, "messages...");

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("❌ Groq API error:", response.status, errorData);
      throw new Error(`Groq API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    console.log("✅ Groq responded successfully");
    return reply;
  } catch (error) {
    console.error("❌ Chat error:", error.message);
    throw error;
  }
}

// ============ IMAGE ANALYSIS ============
async function analyzeImage(base64Image, mimeType) {
  const visionModels = [
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "meta-llama/llama-4-maverick-17b-128e-instruct",
  ];

  const prompt = `You are RoziBot, an AI assistant for daily wage workers in Pakistan.
A worker sent a photo of their work contract/document.
Analyze this image and respond IN URDU SCRIPT (اردو):
1. What does this document say? (simple explanation)
2. Payment terms — how much money and when?
3. Any UNFAIR or DANGEROUS terms? (highlight with ⚠️)
4. What should the worker negotiate?
Keep response simple and short. Use Urdu script only.`;

  for (const modelName of visionModels) {
    try {
      console.log("🖼️ Trying vision model:", modelName);
      console.log("📏 Image size:", Math.round(base64Image.length / 1024), "KB");

      // Clean base64 — remove data URL prefix if present
      let cleanBase64 = base64Image;
      if (cleanBase64.includes(",")) {
        cleanBase64 = cleanBase64.split(",")[1];
      }

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType || "image/jpeg"};base64,${cleanBase64}`,
                  },
                },
              ],
            },
          ],
          temperature: 0.5,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.log("❌ Model", modelName, "failed:", response.status);
        console.log("❌ Error:", errText.substring(0, 200));
        continue;
      }

      const data = await response.json();
      console.log("✅ Image analysis done with", modelName);
      return data.choices[0].message.content;
    } catch (error) {
      console.log("❌ Model", modelName, "error:", error.message);
      continue;
    }
  }

  console.log("⚠️ All vision models failed, using text fallback");
  return `⚠️ معذرت، تصویر پڑھنے میں مسئلہ ہوا۔\n\nبراہ کرم معاہدے کی تفصیلات ٹائپ کر کے بھیجیں:\n- کتنے پیسے طے ہوئے؟\n- کتنے دن کا کام ہے؟\n- کیا شرائط ہیں؟\n\nمیں آپ کو بتاؤں گا کہ یہ منصفانہ ہے یا نہیں۔ 💰`;
}

// ============ DETECT MESSAGE TYPE ============
function detectMessageType(message) {
  const lower = message.toLowerCase();

  if (
    lower.includes("wage") || lower.includes("pay") || lower.includes("salary") ||
    message.includes("مزدوری") || message.includes("تنخواہ") ||
    message.includes("پیسے") || message.includes("کتنا") || message.includes("چیک")
  ) {
    return "wage_check";
  }

  if (
    lower.includes("danger") || lower.includes("unsafe") || lower.includes("safety") ||
    message.includes("خطر") || message.includes("حفاظت") ||
    message.includes("حادث") || message.includes("ہیلمٹ")
  ) {
    return "safety_report";
  }

  if (
    lower.includes("right") || lower.includes("law") ||
    message.includes("حق") || message.includes("قانون")
  ) {
    return "rights";
  }

  return "text";
}

module.exports = { chat, analyzeImage, detectMessageType };
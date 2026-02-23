# 🤖 RoziBot — روزی بوٹ

### AI Employment Assistant for Pakistan's 40 Million Daily Wage Workers

![RoziBot Banner](https://img.shields.io/badge/RoziBot-AI%20for%20Workers-green?style=for-the-badge&logo=robot&logoColor=white)

## 🎯 Problem

Pakistan has **40 million+ daily wage workers** — construction workers, domestic workers, factory laborers — who face:

- 💸 **30-40% underpayment** — they don't know fair wages
- 📝 **Contract exploitation** — can't read or understand agreements
- ⚠️ **Unsafe conditions** — no helmets, no safety belts, no protection
- 📋 **No rights awareness** — don't know minimum wage or labor laws
- 📍 **Family safety concerns** — families don't know where workers are

## 💡 Solution

**RoziBot** is an AI-powered chatbot that speaks **simple Urdu** and helps workers:

| Feature | Description |
|---------|------------|
| 💰 **Fair Wage Calculator** | Check fair daily wages by city and work type |
| 📝 **Contract Analyzer** | Upload contract photo → AI explains terms in Urdu |
| ⚠️ **Safety Reporter** | Report dangerous working conditions anonymously |
| 📋 **Rights Advisor** | Learn about minimum wage, overtime, EOBI, labor laws |
| 🎤 **Voice Input** | Speak in Urdu — no typing needed |
| 📊 **Admin Dashboard** | NGOs/authorities monitor reports and analytics |

## 🖥️ Screenshots

### Worker Chat Interface
- WhatsApp-style chat in Urdu
- Voice input support
- Quick action buttons
- Image upload for contracts

### Admin Dashboard
- Real-time statistics
- Safety report management
- Conversation monitoring
- Analytics charts

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **AI Model** | Llama 3.3 70B (via Groq) |
| **Vision AI** | Llama 4 Scout (via Groq) |
| **Voice** | Web Speech API |
| **Charts** | Recharts |
| **Deployment** | Vercel (Frontend) + Render (Backend) |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Groq API key ([Get free key](https://console.groq.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/rozibot.git
cd rozibot

# Setup Backend
cd server
npm install
cp .env.example .env
# Edit .env with your keys
npm run dev

# Setup Frontend (new terminal)
cd client
npm install
npm run dev
```

Environment Variables
Create server/.env:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:5173


📊 Impact Potential
Metric	Projection
👷 Workers helped	1M+ in Year 1
💰 Wages recovered	Rs. 200 Crore annually
⚠️ Safety reports	50% reduction in unreported injuries
📋 Rights awareness	Millions educated on labor laws
🗺️ Future Roadmap
 WhatsApp Business API integration
 Mobile app (React Native)
 SMS support for basic phones
 Government labor department partnership
 Multi-language support (Punjabi, Sindhi, Pashto)
 Worker location sharing with family


👥 Team
Your Name — Full Stack Developer


📄 License
This project is built for Lablab.ai Hackathon 2025.

🤖 RoziBot — ہر مزدور کا حق ہے کہ وہ اپنی منصفانہ مزدوری جانے
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Send, Mic, MicOff, Camera, ArrowLeft } from "lucide-react";
import { sendMessage, getChatHistory } from "../services/api";
import ChatBubble from "../components/chat/ChatBubble";
import QuickActions from "../components/chat/QuickActions";
import TypingIndicator from "../components/chat/TypingIndicator";

const SESSION_KEY = "rozibot_session";

function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = "session_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export default function WorkerChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const sessionId = useRef(getSessionId());
  const recognitionRef = useRef(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "ur-PK";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setListening(false);
      };

      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  // Load history
  useEffect(() => {
    async function loadHistory() {
      const data = await getChatHistory(sessionId.current);
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages);
        setShowQuickActions(false);
      } else {
        // Welcome message
        setMessages([
          {
            role: "bot",
            content: `السلام علیکم! 🤖 میں روزی بوٹ ہوں — آپ کا ساتھی۔\n\nمیں آپ کی مدد کر سکتا ہوں:\n💰 مزدوری چیک کریں\n📝 ٹھیکہ/معاہدہ سمجھیں\n⚠️ خطرناک حالات کی رپورٹ\n📋 اپنے حقوق جانیں\n\nآپ بتائیں، کیا مدد چاہیے؟`,
            type: "text",
          },
        ]);
      }
    }
    loadHistory();
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim() && !loading) return;

    const userMessage = { role: "user", content: text.trim(), type: "text" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setShowQuickActions(false);

    try {
      const data = await sendMessage(text.trim(), sessionId.current);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.reply, type: data.type },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "معذرت، کچھ مسئلہ ہو گیا۔ دوبارہ کوشش کریں 🙏",
          type: "error",
        },
      ]);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "⚠️ تصویر بہت بڑی ہے۔ براہ کرم 4MB سے چھوٹی تصویر بھیجیں۔",
          type: "error",
        },
      ]);
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const fullDataUrl = reader.result;
      const base64 = fullDataUrl.split(",")[1];
      const detectedMimeType = fullDataUrl.split(";")[0].split(":")[1];

      // Show image preview in chat
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: "📎 معاہدے کی تصویر بھیجی",
          type: "image_analysis",
          imagePreview: fullDataUrl,
        },
      ]);
      setLoading(true);
      setShowQuickActions(false);

      try {
        const data = await sendMessage(
          "Analyze this contract image",
          sessionId.current,
          { data: base64, mimeType: detectedMimeType },
        );
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: data.reply, type: "image_analysis" },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: "تصویر پڑھنے میں مسئلہ ہوا۔ دوبارہ بھیجیں 🙏",
            type: "error",
          },
        ]);
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
    // Reset file input so same file can be uploaded again
    e.target.value = "";
  };

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Use Chrome.");
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const speakText = (text) => {
    const clean = text.replace(/[*#_~`]/g, "");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = "ur-PK";
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-whatsapp-dark text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <Link to="/" className="hover:bg-white/10 p-1 rounded">
          <ArrowLeft size={24} />
        </Link>
        <div className="w-10 h-10 bg-whatsapp-green rounded-full flex items-center justify-center text-xl">
          🤖
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-lg">RoziBot</h2>
          <p className="text-xs text-green-300">
            {loading ? "typing..." : "online"}
          </p>
        </div>
        <button
          onClick={() => {
            const newSession =
              "session_" + Math.random().toString(36).substr(2, 9);
            localStorage.setItem("rozibot_session", newSession);
            sessionId.current = newSession;

            setMessages([
              {
                role: "bot",
                content: `السلام علیکم! 🤖 میں روزی بوٹ ہوں — آپ کا ساتھی۔\n\nمیں آپ کی مدد کر سکتا ہوں:\n💰 مزدوری چیک کریں\n📝 ٹھیکہ/معاہدہ سمجھیں\n⚠️ خطرناک حالات کی رپورٹ\n📋 اپنے حقوق جانیں\n\nآپ بتائیں، کیا مدد چاہیے؟`,
                type: "text",
              },
            ]);

            setShowQuickActions(true);
          }}
          className="text-xs bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition"
        >
          + New Chat
        </button>
        <Link
          to="/dashboard"
          className="text-xs bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition"
        >
          Dashboard →
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto chat-bg px-4 py-4">
        {messages.map((msg, i) => (
          <ChatBubble
            key={i}
            message={msg}
            onSpeak={() => speakText(msg.content)}
          />
        ))}

        {showQuickActions && (
          <QuickActions onSelect={(text) => handleSend(text)} />
        )}

        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-gray-200 px-3 py-2 flex items-center gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-600 hover:text-whatsapp-dark transition"
          title="Upload contract photo"
        >
          <Camera size={24} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="اردو میں لکھیں یا بولیں..."
          className="flex-1 px-4 py-2 rounded-full border-none outline-none text-right font-urdu"
          dir="rtl"
        />

        <button
          onClick={toggleVoice}
          className={`p-2 rounded-full transition ${
            listening
              ? "bg-red-500 text-white animate-pulse"
              : "text-gray-600 hover:text-whatsapp-dark"
          }`}
          title={listening ? "Stop recording" : "Voice input (Urdu)"}
        >
          {listening ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="bg-whatsapp-green p-2 rounded-full text-white disabled:opacity-50 hover:bg-green-400 transition"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

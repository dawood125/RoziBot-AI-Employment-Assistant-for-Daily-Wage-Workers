import { Volume2 } from "lucide-react";

export default function ChatBubble({ message, onSpeak }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm relative group ${
          isUser
            ? "bg-whatsapp-light text-gray-800 rounded-br-md"
            : "bg-white text-gray-800 rounded-bl-md"
        }`}
      >
        {/* Image Preview */}
        {message.imagePreview && (
          <img
            src={message.imagePreview}
            alt="uploaded document"
            className="rounded-lg mb-2 max-h-48 w-auto"
          />
        )}

        <p
          className="font-urdu text-sm leading-relaxed whitespace-pre-wrap"
          dir="rtl"
        >
          {message.content}
        </p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-[10px] text-gray-400">
            {new Date(message.timestamp || Date.now()).toLocaleTimeString(
              "en-PK",
              { hour: "2-digit", minute: "2-digit" }
            )}
          </span>
          {!isUser && (
            <button
              onClick={onSpeak}
              className="opacity-0 group-hover:opacity-100 transition ml-2 text-gray-400 hover:text-whatsapp-dark"
              title="Listen"
            >
              <Volume2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
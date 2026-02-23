export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
          <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
          <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
        </div>
      </div>
    </div>
  );
}
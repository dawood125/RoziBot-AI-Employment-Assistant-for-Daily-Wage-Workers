export default function QuickActions({ onSelect }) {
  const actions = [
    { emoji: "💰", label: "مزدوری چیک کریں", text: "مجھے اپنی مزدوری چیک کرنی ہے" },
    { emoji: "📝", label: "معاہدہ سمجھیں", text: "مجھے اپنا ٹھیکہ سمجھنا ہے" },
    { emoji: "⚠️", label: "خطرے کی رپورٹ", text: "میں خطرناک حالات کی رپورٹ کرنا چاہتا ہوں" },
    { emoji: "📋", label: "حقوق جانیں", text: "مجھے اپنے حقوق جاننے ہیں" },
    { emoji: "📍", label: "لوکیشن بھیجیں", text: "میں اپنی لوکیشن گھر والوں کو بھیجنا چاہتا ہوں" },
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center my-4">
      {actions.map((action, i) => (
        <button
          key={i}
          onClick={() => onSelect(action.text)}
          className="bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md 
                     transition border border-gray-200 hover:border-whatsapp-green
                     flex items-center gap-2"
        >
          <span className="text-lg">{action.emoji}</span>
          <span className="font-urdu text-sm" dir="rtl">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}
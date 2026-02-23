import { Link } from "react-router-dom";
import {
  Shield,
  Calculator,
  FileText,
  AlertTriangle,
  MapPin,
  Scale,
  MessageCircle,
  BarChart3,
  Users,
  Heart,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-whatsapp-dark text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          🤖 RoziBot{" "}
          <span className="font-urdu text-lg mr-2">روزی بوٹ</span>
        </h1>
        <div className="flex gap-4">
          <Link
            to="/chat"
            className="bg-whatsapp-green px-4 py-2 rounded-lg font-semibold hover:bg-green-400 transition"
          >
            Worker Chat
          </Link>
          <Link
            to="/dashboard"
            className="border border-white px-4 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-whatsapp-dark to-emerald-800 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-6xl mb-6">🏗️</div>
          <h2 className="text-5xl font-bold mb-4">
            AI for Pakistan's <span className="text-whatsapp-green">40 Million</span> Daily Wage Workers
          </h2>
          <p className="text-xl text-gray-200 mb-4 max-w-3xl mx-auto">
            RoziBot helps construction workers, domestic workers, and laborers
            check fair wages, understand contracts, report unsafe conditions,
            and know their legal rights — all in simple Urdu.
          </p>
          <p className="font-urdu text-2xl text-whatsapp-green mb-8">
            روزی بوٹ — ہر مزدور کا ساتھی
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/chat"
              className="bg-whatsapp-green text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-green-400 transition flex items-center gap-2"
            >
              <MessageCircle size={24} /> Start Chat
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/dashboard"
              className="border-2 border-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white/10 transition flex items-center gap-2"
            >
              <BarChart3 size={24} /> View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-6 bg-red-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-red-800">
            ⚠️ The Problem
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: "40M+", label: "Daily wage workers in Pakistan" },
              { num: "30-40%", label: "Earn BELOW fair wage" },
              { num: "1,000+", label: "Workplace deaths annually" },
              { num: "0", label: "Digital tools available for them" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-md text-center"
              >
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {stat.num}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            💡 How RoziBot Helps
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Calculator className="text-green-600" size={40} />,
                title: "Fair Wage Calculator",
                titleUr: "منصفانہ مزدوری",
                desc: "Workers tell their work type, city, and hours. AI calculates fair wage and warns if they're being underpaid.",
              },
              {
                icon: <FileText className="text-blue-600" size={40} />,
                title: "Contract Reader",
                titleUr: "معاہدہ سمجھیں",
                desc: "Upload a photo of any work contract. AI explains every clause in simple Urdu and highlights unfair terms.",
              },
              {
                icon: <AlertTriangle className="text-red-600" size={40} />,
                title: "Safety Reporter",
                titleUr: "حفاظتی رپورٹ",
                desc: "Report dangerous working conditions. No helmet? No safety belt? RoziBot records the complaint.",
              },
              {
                icon: <Scale className="text-purple-600" size={40} />,
                title: "Rights Advisor",
                titleUr: "اپنے حقوق جانیں",
                desc: "Ask about labor laws, minimum wage, overtime rules, EOBI, and workplace injury compensation.",
              },
              {
                icon: <MapPin className="text-orange-600" size={40} />,
                title: "Family Safety",
                titleUr: "خاندان کو اطلاع",
                desc: "Share work location with family. If something goes wrong, your loved ones know where you are.",
              },
              {
                icon: <Shield className="text-teal-600" size={40} />,
                title: "Voice Support",
                titleUr: "آواز سے بات کریں",
                desc: "Speak in Urdu — no typing needed. Built for workers with limited literacy.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition"
              >
                <div className="mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold mb-1">{feature.title}</h4>
                <p className="font-urdu text-whatsapp-dark text-lg mb-2">
                  {feature.titleUr}
                </p>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 px-6 bg-emerald-50">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-12">🎯 Potential Impact</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="text-green-600 mx-auto" size={48} />,
                num: "1M+",
                label: "Workers can be helped in Year 1",
              },
              {
                icon: (
                  <Calculator className="text-blue-600 mx-auto" size={48} />
                ),
                num: "Rs. 200 Cr",
                label: "Annual wages recovered from exploitation",
              },
              {
                icon: <Heart className="text-red-600 mx-auto" size={48} />,
                num: "50%",
                label: "Reduction in unreported workplace injuries",
              },
            ].map((impact, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-md">
                {impact.icon}
                <div className="text-4xl font-bold text-whatsapp-dark mt-4 mb-2">
                  {impact.num}
                </div>
                <div className="text-gray-600">{impact.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-8">🛠️ Built With</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "React",
              "Node.js",
              "Express",
              "MongoDB",
              "Google Gemini AI",
              "Tailwind CSS",
              "Web Speech API",
              "Vite",
            ].map((tech) => (
              <span
                key={tech}
                className="bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-whatsapp-dark text-white py-8 px-6 text-center">
        <p className="text-xl font-bold mb-2">
          🤖 RoziBot — AI for Pakistan's Poorest Citizens
        </p>
        <p className="font-urdu text-lg text-whatsapp-green">
          ہر مزدور کا حق ہے کہ وہ اپنی منصفانہ مزدوری جانے
        </p>
        <p className="mt-4 text-gray-400">
          Built with ❤️ for HEC Gen AI Cohort 2 Hackathon 2025
        </p>
      </footer>
    </div>
  );
}
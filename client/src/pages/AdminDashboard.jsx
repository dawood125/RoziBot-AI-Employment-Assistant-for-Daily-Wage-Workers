import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  MessageSquare,
  AlertTriangle,
  ShieldAlert,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import {
  getDashboardStats,
  getReports,
  getConversations,
  updateReportStatus,
} from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function load() {
      const [s, r, c] = await Promise.all([
        getDashboardStats(),
        getReports(),
        getConversations(),
      ]);
      setStats(s);
      setReports(r);
      setConversations(c);
    }
    load();
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateReportStatus(id, status);
    setReports((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status } : r))
    );
  };

  const severityColors = {
    low: "bg-blue-100 text-blue-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-700",
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    reviewed: "bg-blue-100 text-blue-700",
    resolved: "bg-green-100 text-green-700",
  };

  // Chart data
  const severityData = ["low", "medium", "high", "critical"].map((s) => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    count: reports.filter((r) => r.severity === s).length,
  }));

  const statusData = ["pending", "reviewed", "resolved"].map((s) => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    value: reports.filter((r) => r.status === s).length,
  }));

  const PIE_COLORS = ["#EAB308", "#3B82F6", "#22C55E"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-whatsapp-dark text-white px-6 py-4 flex items-center gap-4">
        <Link to="/" className="hover:bg-white/10 p-1 rounded">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold flex-1">
          📊 RoziBot Admin Dashboard
        </h1>
        <Link
          to="/chat"
          className="bg-whatsapp-green px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Open Chat →
        </Link>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b px-6 flex gap-6">
        {["overview", "reports", "conversations"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-2 font-semibold capitalize border-b-2 transition ${
              activeTab === tab
                ? "border-whatsapp-green text-whatsapp-dark"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && stats && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  icon: <Users className="text-blue-600" />,
                  label: "Total Workers",
                  value: stats.totalWorkers,
                  bg: "bg-blue-50",
                },
                {
                  icon: <MessageSquare className="text-green-600" />,
                  label: "Total Messages",
                  value: stats.totalMessages,
                  bg: "bg-green-50",
                },
                {
                  icon: <AlertTriangle className="text-orange-600" />,
                  label: "Safety Reports",
                  value: stats.totalReports,
                  bg: "bg-orange-50",
                },
                {
                  icon: <ShieldAlert className="text-red-600" />,
                  label: "Critical Reports",
                  value: stats.criticalReports,
                  bg: "bg-red-50",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className={`${card.bg} p-5 rounded-xl flex items-center gap-4`}
                >
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    {card.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">
                      {card.value}
                    </div>
                    <div className="text-sm text-gray-500">{card.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-lg mb-4">
                  Reports by Severity
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={severityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#128C7E" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-lg mb-4">Report Status</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* REPORTS TAB */}
        {activeTab === "reports" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-bold text-lg">
                ⚠️ Safety Reports ({reports.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                      Report #
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                      Description
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                      Location
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                      Severity
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono">
                        {report.reportNumber}
                      </td>
                      <td className="px-4 py-3 text-sm font-urdu" dir="rtl">
                        {report.description.substring(0, 60)}...
                      </td>
                      <td className="px-4 py-3 text-sm font-urdu" dir="rtl">
                        {report.location}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            severityColors[report.severity]
                          }`}
                        >
                          {report.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            statusColors[report.status]
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() =>
                              handleStatusChange(report._id, "reviewed")
                            }
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Mark Reviewed"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(report._id, "resolved")
                            }
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Mark Resolved"
                          >
                            <CheckCircle size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONVERSATIONS TAB */}
        {activeTab === "conversations" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-bold text-lg">
                💬 Recent Conversations ({conversations.length})
              </h3>
            </div>
            <div className="divide-y">
              {conversations.map((convo) => (
                <div
                  key={convo.id}
                  className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-whatsapp-green rounded-full flex items-center justify-center text-white font-bold">
                    {convo.workerName?.charAt(0) || "م"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className="font-semibold font-urdu" dir="rtl">
                        {convo.workerName}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(convo.lastActive).toLocaleDateString()}
                      </span>
                    </div>
                    <p
                      className="text-sm text-gray-500 truncate font-urdu"
                      dir="rtl"
                    >
                      {convo.lastMessage}
                    </p>
                  </div>
                  <span className="bg-whatsapp-green text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {convo.messageCount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
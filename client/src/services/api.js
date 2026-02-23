const API_BASE =
  import.meta.env.VITE_API_URL || "https://rozibot-ai-employment-assistant-for.onrender.com/api";

export async function sendMessage(message, sessionId, image = null) {
  const body = { message, sessionId };

  if (image) {
    body.image = image.data;
    body.mimeType = image.mimeType;
  }

  const res = await fetch(`${API_BASE}/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    return { reply: err.reply || "Error occurred", type: "error" };
  }

  return res.json();
}

export async function getChatHistory(sessionId) {
  const res = await fetch(`${API_BASE}/chat/history/${sessionId}`);
  return res.json();
}

export async function getDashboardStats() {
  const res = await fetch(`${API_BASE}/dashboard/stats`);
  return res.json();
}

export async function getReports() {
  const res = await fetch(`${API_BASE}/dashboard/reports`);
  return res.json();
}

export async function getConversations() {
  const res = await fetch(`${API_BASE}/dashboard/conversations`);
  return res.json();
}

export async function updateReportStatus(id, status) {
  const res = await fetch(`${API_BASE}/dashboard/reports/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
}
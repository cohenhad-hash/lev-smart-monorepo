const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function sendChatMessage(message) {
  const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    let detail = "אירעה שגיאה בשליחת ההודעה.";
    try {
      const errorData = await response.json();
      if (typeof errorData.detail === "string") detail = errorData.detail;
    } catch { /* Use fallback message if response is not JSON. */ }
    throw new Error(detail);
  }

  const data = await response.json();
  if (typeof data.reply !== "string" || !data.reply.trim()) {
    throw new Error("התקבלה תשובה ריקה משירות ה־AI.");
  }
  return data.reply;
}

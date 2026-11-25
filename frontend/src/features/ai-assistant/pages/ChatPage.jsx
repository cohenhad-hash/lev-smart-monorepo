import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import MessageBubble from "../components/MessageBubble.jsx";
import { sendChatMessage } from "../services/aiService.js";

const suggestions = [
  "תסביר לי נושא מורכב בצורה פשוטה",
  "עזור לי להתכונן למבחן",
  "תן לי דוגמה ותרגול בנושא שאני לומדת",
];

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  async function handleSubmit(event) {
    event.preventDefault();
    const message = input.trim();
    if (!message || isLoading) return;

    setError("");
    setInput("");
    setMessages((current) => [...current, { role: "user", content: message }]);
    setIsLoading(true);
    try {
      const reply = await sendChatMessage(message);
      setMessages((current) => [...current, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err.message || "לא הצלחנו לקבל תשובה כרגע. נסו שוב.");
      setInput(message);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function clearChat() {
    if (isLoading) return;
    setMessages([]);
    setError("");
    setInput("");
  }

  return (
    <div className="page chat-page">
      <div className="chat-page-heading">
        <div>
          <Link to="/" className="back-link">← חזרה לדף הבית</Link>
          <span className="eyebrow">LEV SMART · AI ASSISTANT</span>
          <h1>עוזר הלמידה שלך</h1>
          <p>אפשר לשאול, ללמוד, לבקש הסברים ולחשוב יחד.</p>
        </div>
        <button className="secondary-button clear-button" onClick={clearChat} disabled={messages.length === 0 || isLoading}>שיחה חדשה ↻</button>
      </div>

      <section className="chat-panel" aria-label="צ'אט עם עוזר ה-AI">
        <div className="chat-panel-header">
          <div className="assistant-identity">
            <div className="assistant-avatar">✦</div>
            <div><strong>LEV AI</strong><span><i className="online-dot" /> מוכן לעזור</span></div>
          </div>
          <span className="secure-label">AI Assistant</span>
        </div>
        <div className="conversation" aria-live="polite">
          {messages.length === 0 ? (
            <div className="chat-welcome">
              <div className="welcome-spark">✦</div>
              <h2>במה נוכל לעזור לך היום?</h2>
              <p>כתבו שאלה או בחרו אחת מההצעות כדי להתחיל.</p>
              <div className="suggestion-list">
                {suggestions.map((suggestion) => (
                  <button key={suggestion} className="suggestion-chip" onClick={() => { setInput(suggestion); inputRef.current?.focus(); }}>
                    {suggestion}<span>←</span>
                  </button>
                ))}
              </div>
            </div>
          ) : <div className="message-list">{messages.map((message, index) => <MessageBubble key={`${message.role}-${index}`} role={message.role} content={message.content} />)}</div>}
          {isLoading && <div className="typing-indicator"><span className="typing-avatar">✦</span><span>LEV AI חושב</span><i /><i /><i /></div>}
          {error && <div className="error-banner" role="alert">{error}</div>}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-composer" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="chat-message">כתיבת הודעה</label>
          <textarea id="chat-message" ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); handleSubmit(event); } }}
            placeholder="כתבו כאן את השאלה שלכם..." rows={2} maxLength={4000} disabled={isLoading} />
          <div className="composer-bottom"><span>Enter לשליחה · Shift + Enter לשורה חדשה</span><button className="send-button" type="submit" disabled={!input.trim() || isLoading}>{isLoading ? "…" : "שליחה ↑"}</button></div>
        </form>
        <p className="chat-disclaimer">תשובות ה־AI עשויות להכיל טעויות. מומלץ לבדוק מידע חשוב.</p>
      </section>
    </div>
  );
}

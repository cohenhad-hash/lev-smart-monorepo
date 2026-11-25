export default function MessageBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`message-row ${isUser ? "message-user" : "message-assistant"}`}>
      <div className="message-avatar" aria-hidden="true">{isUser ? "את" : "✦"}</div>
      <div className="message-content">
        <div className="message-label">{isUser ? "את" : "LEV AI"}</div>
        <div className="message-bubble">{content}</div>
      </div>
    </div>
  );
}

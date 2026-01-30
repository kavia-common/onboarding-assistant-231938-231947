import React, { useEffect, useMemo, useState } from "react";
import { getChatHistory, sendChatMessage } from "../api/client";
import { isFlagEnabled } from "../api/config";

/**
 * Chat Assistant view
 * - Shows messages list
 * - Composer to send messages
 * - Optional WS indicator behind feature flag (actual WS wiring can be added later)
 */

function formatTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (_e) {
    return "";
  }
}

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`chat-msg ${isUser ? "chat-msg--user" : "chat-msg--assistant"}`}>
      <div className="chat-msg__bubble">
        <div className="chat-msg__content">{msg.content}</div>
        <div className="chat-msg__meta">
          <span className="chat-msg__role">{isUser ? "You" : "Assistant"}</span>
          {msg.createdAt && <span className="chat-msg__time">{formatTime(msg.createdAt)}</span>}
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function ChatAssistantView() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const wsEnabled = useMemo(() => isFlagEnabled("wsChat", false), []);

  useEffect(() => {
    let mounted = true;
    getChatHistory()
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : data?.messages || [];
        setMessages(list);
      })
      .catch(() => {
        // client already has mock fallback; this is a last resort.
        if (!mounted) return;
        setMessages([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const onSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setDraft("");
    setSending(true);

    try {
      const reply = await sendChatMessage(text);
      setMessages((prev) => [...prev, reply]);
    } catch (_e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: "assistant",
          content: "Sorry — I couldn’t reach the backend. Please try again.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="view">
      <div className="view__header">
        <div>
          <div className="view__title">Chat Assistant</div>
          <div className="view__subtitle">Ask questions, get guidance, and unblock your onboarding.</div>
        </div>

        {wsEnabled && (
          <div className="view__meta">
            <span className="ui-chip">Experimental: WS Chat</span>
          </div>
        )}
      </div>

      <div className="chat">
        <div className="chat__list" role="log" aria-label="Chat messages">
          {messages.length === 0 ? (
            <div className="chat__empty">
              No messages yet. Start by asking: “What should I do first?”
            </div>
          ) : (
            messages.map((m) => <MessageBubble key={m.id} msg={m} />)
          )}
        </div>

        <div className="chat__composer" aria-label="Message composer">
          <input
            className="chat__input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message…"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) onSend();
            }}
            aria-label="Message"
          />
          <button className="btn btn--primary" onClick={onSend} disabled={sending || !draft.trim()}>
            {sending ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

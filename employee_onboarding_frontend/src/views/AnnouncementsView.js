import React, { useEffect, useState } from "react";
import { getAnnouncements } from "../api/client";
import { Badge, Card } from "../components/ui";

function timeAgo(iso) {
  try {
    const d = new Date(iso);
    const diffMs = Date.now() - d.getTime();
    const mins = Math.round(diffMs / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.round(hrs / 24);
    return `${days}d ago`;
  } catch (_e) {
    return "";
  }
}

// PUBLIC_INTERFACE
export default function AnnouncementsView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAnnouncements()
      .then((data) => {
        if (!mounted) return;
        setItems(Array.isArray(data) ? data : data?.announcements || []);
      })
      .catch(() => {
        if (!mounted) return;
        setItems([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="view">
      <div className="view__header">
        <div>
          <div className="view__title">Announcements</div>
          <div className="view__subtitle">Company updates relevant to your onboarding.</div>
        </div>
      </div>

      {loading ? (
        <div className="muted">Loading announcements…</div>
      ) : (
        <div className="stack">
          {items.map((a) => (
            <Card
              key={a.id}
              title={a.title}
              subtitle={a.body}
              right={
                <div className="announcementRight">
                  {a.tag && <Badge tone={a.tag === "Action Required" ? "error" : "neutral"}>{a.tag}</Badge>}
                  {a.createdAt && <span className="muted">{timeAgo(a.createdAt)}</span>}
                </div>
              }
            >
              <div className="announcementMeta">
                {a.createdAt && (
                  <div className="muted">
                    {new Date(a.createdAt).toLocaleString()}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

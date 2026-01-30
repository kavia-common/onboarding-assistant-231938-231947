import React, { useEffect, useState } from "react";
import { getModules } from "../api/client";
import { Badge, Card, IconDot } from "../components/ui";

function statusTone(status) {
  if (status === "complete") return "success";
  if (status === "in_progress") return "info";
  if (status === "blocked") return "error";
  return "neutral";
}

function statusLabel(status) {
  if (status === "complete") return "Complete";
  if (status === "in_progress") return "In progress";
  if (status === "blocked") return "Blocked";
  return "Not started";
}

// PUBLIC_INTERFACE
export default function ModulesView() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getModules()
      .then((data) => {
        if (!mounted) return;
        setModules(Array.isArray(data) ? data : data?.modules || []);
      })
      .catch(() => {
        if (!mounted) return;
        setModules([]);
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
          <div className="view__title">Modules</div>
          <div className="view__subtitle">Browse onboarding modules and track status at a glance.</div>
        </div>
      </div>

      {loading ? (
        <div className="muted">Loading modules…</div>
      ) : (
        <div className="grid grid--cards">
          {modules.map((m) => (
            <Card
              key={m.id}
              title={m.title}
              subtitle={m.description}
              right={
                <Badge tone={statusTone(m.status)}>
                  <IconDot tone={statusTone(m.status)} /> {statusLabel(m.status)}
                </Badge>
              }
            >
              <div className="moduleMeta">
                <div className="moduleMeta__item">
                  <div className="moduleMeta__label">Tasks</div>
                  <div className="moduleMeta__value">
                    {m.tasksDone}/{m.tasksTotal}
                  </div>
                </div>
                <div className="moduleMeta__item">
                  <div className="moduleMeta__label">Next</div>
                  <div className="moduleMeta__value muted">
                    {m.status === "complete" ? "Review resources" : "Continue module"}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

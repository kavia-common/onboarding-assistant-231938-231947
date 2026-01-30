import React, { useEffect, useState } from "react";
import { getProgress } from "../api/client";
import { Card, ProgressBar } from "../components/ui";

// PUBLIC_INTERFACE
export default function ProgressView() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getProgress()
      .then((data) => {
        if (!mounted) return;
        setProgress(data);
      })
      .catch(() => {
        if (!mounted) return;
        setProgress(null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const overall = progress?.overallPercent ?? 0;
  const modules = progress?.modules || [];

  return (
    <div className="view">
      <div className="view__header">
        <div>
          <div className="view__title">Progress</div>
          <div className="view__subtitle">See overall completion and per-module checklists.</div>
        </div>
      </div>

      {loading ? (
        <div className="muted">Loading progress…</div>
      ) : (
        <>
          <div className="progressSummary">
            <div className="progressSummary__top">
              <div className="progressSummary__label">Overall progress</div>
              <div className="progressSummary__value">{overall}%</div>
            </div>
            <ProgressBar value={overall} />
          </div>

          <div className="stack">
            {modules.map((m) => (
              <Card
                key={m.moduleId}
                title={m.title}
                subtitle={`${m.percent}% complete`}
                right={<span className="muted">{m.checklist?.filter((c) => c.done).length || 0}/{m.checklist?.length || 0} items</span>}
              >
                <ProgressBar value={m.percent} />
                <div className="checklist" role="list" aria-label={`${m.title} checklist`}>
                  {(m.checklist || []).map((item) => (
                    <div key={item.id} className="checklist__item" role="listitem">
                      <input type="checkbox" checked={Boolean(item.done)} readOnly aria-label={item.label} />
                      <span className={item.done ? "checklist__text checklist__text--done" : "checklist__text"}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

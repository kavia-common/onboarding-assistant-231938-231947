import React, { useEffect, useState } from "react";
import { getProfile, getProgress } from "../api/client";
import { ProgressBar } from "../components/ui";

// PUBLIC_INTERFACE
export default function HomeView() {
  const [profile, setProfile] = useState(null);
  const [overall, setOverall] = useState(0);

  useEffect(() => {
    let mounted = true;
    getProfile().then((p) => mounted && setProfile(p)).catch(() => {});
    getProgress().then((pr) => mounted && setOverall(pr?.overallPercent ?? 0)).catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="view">
      <div className="view__header">
        <div>
          <div className="view__title">Home</div>
          <div className="view__subtitle">
            Welcome{profile?.name ? `, ${profile.name}` : ""}. Here’s your onboarding snapshot.
          </div>
        </div>
      </div>

      <div className="homeGrid">
        <div className="homeCard">
          <div className="homeCard__label">Overall progress</div>
          <div className="homeCard__value">{overall}%</div>
          <ProgressBar value={overall} />
        </div>

        <div className="homeCard">
          <div className="homeCard__label">Role</div>
          <div className="homeCard__value">{profile?.role || "—"}</div>
          <div className="muted">Team: {profile?.team || "—"}</div>
        </div>

        <div className="homeCard">
          <div className="homeCard__label">Tip</div>
          <div className="homeCard__value">Ask the assistant</div>
          <div className="muted">Try: “Show me the next module to complete.”</div>
        </div>
      </div>
    </div>
  );
}

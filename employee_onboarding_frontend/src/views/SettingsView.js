import React, { useEffect, useState } from "react";
import { ensureBackendHealth } from "../api/client";
import { getApiBaseUrl, getWsBaseUrl, getFeatureFlags, experimentsEnabled } from "../api/config";

// PUBLIC_INTERFACE
export default function SettingsView() {
  const [health, setHealth] = useState({ healthy: false, mockMode: true });

  useEffect(() => {
    ensureBackendHealth().then(setHealth).catch(() => setHealth({ healthy: false, mockMode: true }));
  }, []);

  const flags = getFeatureFlags();

  return (
    <div className="view">
      <div className="view__header">
        <div>
          <div className="view__title">Settings</div>
          <div className="view__subtitle">Configuration and diagnostics for this environment.</div>
        </div>
      </div>

      <div className="stack">
        <div className="settingsPanel">
          <div className="settingsRow">
            <div className="settingsKey">API Base</div>
            <div className="settingsVal">{getApiBaseUrl() || "(same-origin / relative)"}</div>
          </div>
          <div className="settingsRow">
            <div className="settingsKey">WebSocket URL</div>
            <div className="settingsVal">{getWsBaseUrl() || "(disabled)"}</div>
          </div>
          <div className="settingsRow">
            <div className="settingsKey">Backend health</div>
            <div className="settingsVal">
              {health.healthy ? "Healthy" : "Unavailable"} • Mode: {health.mockMode ? "Mock" : "Live"}
            </div>
          </div>
          <div className="settingsRow">
            <div className="settingsKey">Experiments</div>
            <div className="settingsVal">{experimentsEnabled() ? "Enabled" : "Disabled"}</div>
          </div>
        </div>

        <div className="settingsPanel">
          <div className="settingsPanel__title">Feature flags (REACT_APP_FEATURE_FLAGS)</div>
          <pre className="settingsPre">{JSON.stringify(flags, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

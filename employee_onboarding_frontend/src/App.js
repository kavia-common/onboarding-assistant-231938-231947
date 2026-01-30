import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import DashboardShell from "./components/DashboardShell";
import HomeView from "./views/HomeView";
import ChatAssistantView from "./views/ChatAssistantView";
import ModulesView from "./views/ModulesView";
import ProgressView from "./views/ProgressView";
import AnnouncementsView from "./views/AnnouncementsView";
import SettingsView from "./views/SettingsView";
import { ensureBackendHealth, getProfile } from "./api/client";
import { isFlagEnabled } from "./api/config";

function navTitle(nav) {
  if (nav === "home") return "Home";
  if (nav === "chat") return "Chat Assistant";
  if (nav === "modules") return "Modules";
  if (nav === "progress") return "Progress";
  if (nav === "announcements") return "Announcements";
  return "Settings";
}

// PUBLIC_INTERFACE
function App() {
  const [activeNav, setActiveNav] = useState("chat");
  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState(null);
  const [mode, setMode] = useState({ healthy: false, mockMode: true });

  const announcementsEnabled = useMemo(() => isFlagEnabled("announcements", true), []);

  useEffect(() => {
    ensureBackendHealth().then(setMode).catch(() => setMode({ healthy: false, mockMode: true }));
    getProfile().then(setProfile).catch(() => setProfile(null));
  }, []);

  // If announcements are disabled but user is on that view, bump to chat.
  useEffect(() => {
    if (!announcementsEnabled && activeNav === "announcements") setActiveNav("chat");
  }, [announcementsEnabled, activeNav]);

  const title = `${navTitle(activeNav)}${mode.mockMode ? " • Mock mode" : ""}`;

  return (
    <div className="App">
      <DashboardShell
        activeNav={activeNav}
        onNavigate={setActiveNav}
        title={title}
        user={profile}
        searchValue={search}
        onSearchChange={setSearch}
      >
        {activeNav === "home" && <HomeView />}
        {activeNav === "chat" && <ChatAssistantView />}
        {activeNav === "modules" && <ModulesView />}
        {activeNav === "progress" && <ProgressView />}
        {activeNav === "announcements" && announcementsEnabled && <AnnouncementsView />}
        {activeNav === "settings" && <SettingsView />}
      </DashboardShell>
    </div>
  );
}

export default App;

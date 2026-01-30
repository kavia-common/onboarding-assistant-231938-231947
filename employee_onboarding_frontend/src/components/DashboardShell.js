import React, { useMemo } from "react";
import { isFlagEnabled } from "../api/config";

/**
 * Minimal dashboard shell:
 * - Left sidebar navigation
 * - Top bar (title, search, user avatar/menu placeholder)
 * - Main area renders the active view
 */

const NAV = [
  { id: "home", label: "Home" },
  { id: "chat", label: "Chat Assistant" },
  { id: "modules", label: "Modules" },
  { id: "progress", label: "Progress" },
  { id: "announcements", label: "Announcements", featureFlag: "announcements" },
  { id: "settings", label: "Settings" },
];

// PUBLIC_INTERFACE
export default function DashboardShell({
  activeNav,
  onNavigate,
  title,
  user,
  searchValue,
  onSearchChange,
  children,
}) {
  const showAnnouncements = useMemo(() => isFlagEnabled("announcements", true), []);

  const navItems = useMemo(() => {
    return NAV.filter((item) => {
      if (item.id === "announcements") return showAnnouncements;
      return true;
    });
  }, [showAnnouncements]);

  return (
    <div className="dash">
      <aside className="dash__sidebar" aria-label="Sidebar navigation">
        <div className="brand">
          <div className="brand__mark" aria-hidden="true">OA</div>
          <div className="brand__text">
            <div className="brand__name">Onboarding</div>
            <div className="brand__sub">Assistant</div>
          </div>
        </div>

        <nav className="nav" aria-label="Primary">
          {navItems.map((item) => {
            const isActive = item.id === activeNav;
            return (
              <button
                key={item.id}
                className={`nav__item ${isActive ? "nav__item--active" : ""}`}
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="nav__label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebarFoot">
          <div className="sidebarFoot__hint">
            {user?.name ? `Signed in as ${user.name}` : "Mock profile (offline)"}
          </div>
        </div>
      </aside>

      <section className="dash__main">
        <header className="topbar" aria-label="Top bar">
          <div className="topbar__title">{title}</div>

          <div className="topbar__search">
            <input
              className="topbar__searchInput"
              placeholder="Search modules, tasks…"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search"
            />
          </div>

          <div className="topbar__user" aria-label="User menu">
            <div className="avatar" aria-hidden="true">
              {user?.avatarInitials || "U"}
            </div>
          </div>
        </header>

        <main className="content">{children}</main>
      </section>
    </div>
  );
}

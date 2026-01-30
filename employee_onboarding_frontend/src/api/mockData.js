/**
 * Mock data fallback for when backend is unavailable.
 * This keeps the app usable in local UI-only mode.
 */

function nowIso() {
  return new Date().toISOString();
}

/** PUBLIC_INTERFACE */
export function getMockProfile() {
  /** Returns a mock user profile object. */
  return {
    id: "u_demo",
    name: "Jordan Lee",
    role: "New Hire",
    team: "Product Engineering",
    avatarInitials: "JL",
  };
}

/** PUBLIC_INTERFACE */
export function getMockModules() {
  /** Returns a mock onboarding module list. */
  return [
    {
      id: "m1",
      title: "Welcome & Orientation",
      description: "Company mission, policies, and first-day essentials.",
      status: "in_progress",
      tasksTotal: 5,
      tasksDone: 2,
    },
    {
      id: "m2",
      title: "Security & Compliance",
      description: "Security basics, access controls, and compliance training.",
      status: "not_started",
      tasksTotal: 4,
      tasksDone: 0,
    },
    {
      id: "m3",
      title: "Tools Setup",
      description: "Accounts, device setup, dev tools, and key workflows.",
      status: "complete",
      tasksTotal: 6,
      tasksDone: 6,
    },
    {
      id: "m4",
      title: "Team Ramp-Up",
      description: "Meetings, project context, and first deliverables.",
      status: "not_started",
      tasksTotal: 3,
      tasksDone: 0,
    },
  ];
}

/** PUBLIC_INTERFACE */
export function getMockProgress() {
  /** Returns mock progress for modules with an overall summary. */
  const modules = getMockModules().map((m) => ({
    moduleId: m.id,
    title: m.title,
    percent: Math.round((m.tasksDone / Math.max(1, m.tasksTotal)) * 100),
    checklist: [
      { id: `${m.id}_t1`, label: "Read the overview", done: m.tasksDone >= 1 },
      { id: `${m.id}_t2`, label: "Complete required items", done: m.tasksDone >= 2 },
      { id: `${m.id}_t3`, label: "Confirm with manager", done: m.tasksDone >= 3 },
    ],
  }));

  const overall = Math.round(
    modules.reduce((sum, mm) => sum + mm.percent, 0) / Math.max(1, modules.length)
  );

  return { overallPercent: overall, modules };
}

/** PUBLIC_INTERFACE */
export function getMockAnnouncements() {
  /** Returns a mock announcement feed list. */
  return [
    {
      id: "a1",
      title: "Welcome to the team!",
      body: "Your onboarding buddy will reach out today. Check your calendar for a quick intro.",
      tag: "General",
      createdAt: nowIso(),
    },
    {
      id: "a2",
      title: "Security training due this week",
      body: "Please complete Security & Compliance by Friday to ensure access remains uninterrupted.",
      tag: "Action Required",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
    {
      id: "a3",
      title: "IT Office Hours",
      body: "Drop in anytime 2–4pm for device setup and tooling help.",
      tag: "IT",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    },
  ];
}

/** PUBLIC_INTERFACE */
export function getMockTasks() {
  /** Returns a mock task list. */
  return [
    { id: "t1", title: "Set up email + calendar", status: "done", moduleId: "m3" },
    { id: "t2", title: "Read employee handbook", status: "in_progress", moduleId: "m1" },
    { id: "t3", title: "Enable MFA", status: "not_started", moduleId: "m2" },
  ];
}

/** PUBLIC_INTERFACE */
export function getMockChatHistory() {
  /** Returns a mock chat message list. */
  return [
    {
      id: "c1",
      role: "assistant",
      content:
        "Hi! I’m your onboarding assistant. Ask me about next steps, modules, or policies.",
      createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    },
    {
      id: "c2",
      role: "user",
      content: "What should I do first?",
      createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    },
    {
      id: "c3",
      role: "assistant",
      content:
        "Start with “Welcome & Orientation”, then confirm your tools are set up. Want me to open the Modules view?",
      createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
    },
  ];
}

/** PUBLIC_INTERFACE */
export function mockChatReply(userText) {
  /** Simple echo/assist behavior for mock mode. */
  const trimmed = String(userText || "").trim();
  if (!trimmed) {
    return "Type a message and I’ll help you navigate your onboarding.";
  }
  if (/modules?/i.test(trimmed)) {
    return "You can review modules in the “Modules” section. Focus on the ones marked In progress first.";
  }
  if (/progress/i.test(trimmed)) {
    return "Check “Progress” to see overall completion and per-module checklists.";
  }
  if (/hello|hi|hey/i.test(trimmed)) {
    return "Hi! How can I help with your onboarding today?";
  }
  return `Got it. In mock mode I can echo and guide UI flows. You said: “${trimmed}”.`;
}

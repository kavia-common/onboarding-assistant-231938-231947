import {
  getApiBaseUrl,
  getHealthcheckPath,
  getWsBaseUrl,
  isFlagEnabled,
} from "./config";
import {
  getMockAnnouncements,
  getMockChatHistory,
  getMockModules,
  getMockProfile,
  getMockProgress,
  getMockTasks,
  mockChatReply,
} from "./mockData";

/**
 * Tiny API client used by the dashboard views.
 * - Uses REST endpoints under /api/*
 * - If backend is absent, automatically falls back to mock data.
 */

/**
 * Cache the health check result so we don't spam requests on every view.
 */
let healthChecked = false;
let backendHealthy = false;

function joinUrl(base, path) {
  if (!base) return path;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function tryFetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(`Request failed (${res.status})`);
    err.status = res.status;
    err.body = text;
    throw err;
  }

  // Some endpoints may return empty 204
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  const text = await res.text();
  return text;
}

/** PUBLIC_INTERFACE */
export async function ensureBackendHealth() {
  /**
   * Performs a one-time health check.
   * Returns { healthy, mockMode }.
   *
   * Mock mode rules:
   * - If /healthz fails (network or non-2xx) -> mock mode on.
   */
  if (healthChecked) {
    return { healthy: backendHealthy, mockMode: !backendHealthy };
  }

  healthChecked = true;
  const base = getApiBaseUrl();
  const healthUrl = joinUrl(base, getHealthcheckPath());

  try {
    await tryFetchJson(healthUrl, { method: "GET" });
    backendHealthy = true;
  } catch (_e) {
    backendHealthy = false;
  }

  return { healthy: backendHealthy, mockMode: !backendHealthy };
}

/** PUBLIC_INTERFACE */
export async function getProfile() {
  /** Fetches current user profile. */
  const { mockMode } = await ensureBackendHealth();
  if (mockMode) return getMockProfile();
  return tryFetchJson(joinUrl(getApiBaseUrl(), "/api/profile"));
}

/** PUBLIC_INTERFACE */
export async function getModules() {
  /** Fetches onboarding modules list. */
  const { mockMode } = await ensureBackendHealth();
  if (mockMode) return getMockModules();
  return tryFetchJson(joinUrl(getApiBaseUrl(), "/api/modules"));
}

/** PUBLIC_INTERFACE */
export async function getProgress() {
  /** Fetches progress for modules + overall. */
  const { mockMode } = await ensureBackendHealth();
  if (mockMode) return getMockProgress();
  return tryFetchJson(joinUrl(getApiBaseUrl(), "/api/progress"));
}

/** PUBLIC_INTERFACE */
export async function getTasks() {
  /** Fetches tasks list. */
  const { mockMode } = await ensureBackendHealth();
  if (mockMode) return getMockTasks();
  return tryFetchJson(joinUrl(getApiBaseUrl(), "/api/tasks"));
}

/** PUBLIC_INTERFACE */
export async function getAnnouncements() {
  /** Fetches announcements list. */
  const { mockMode } = await ensureBackendHealth();
  if (mockMode) return getMockAnnouncements();
  return tryFetchJson(joinUrl(getApiBaseUrl(), "/api/announcements"));
}

/** PUBLIC_INTERFACE */
export async function getChatHistory() {
  /** Fetches chat history. */
  const { mockMode } = await ensureBackendHealth();
  if (mockMode) return getMockChatHistory();
  return tryFetchJson(joinUrl(getApiBaseUrl(), "/api/chat"));
}

/** PUBLIC_INTERFACE */
export async function sendChatMessage(message) {
  /**
   * Sends a chat message, returns assistant response.
   * REST contract: POST /api/chat {message}
   */
  const { mockMode } = await ensureBackendHealth();
  if (mockMode) {
    return {
      id: `mock_${Date.now()}`,
      role: "assistant",
      content: mockChatReply(message),
      createdAt: new Date().toISOString(),
    };
  }

  return tryFetchJson(joinUrl(getApiBaseUrl(), "/api/chat"), {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

/** PUBLIC_INTERFACE */
export function createChatWebSocket({ onMessage, onOpen, onClose, onError } = {}) {
  /**
   * Optional WebSocket helper. Only enabled when:
   * - REACT_APP_WS_URL is provided AND
   * - feature flag wsChat is true
   *
   * This intentionally does not auto-connect; caller decides when to connect.
   */
  const wsBase = getWsBaseUrl();
  const wsEnabled = Boolean(wsBase) && isFlagEnabled("wsChat", false);

  if (!wsEnabled) {
    return {
      enabled: false,
      connect: () => null,
      close: () => null,
      send: () => null,
    };
  }

  let ws = null;

  const connect = () => {
    if (ws) return ws;
    ws = new WebSocket(wsBase);

    ws.onopen = (evt) => onOpen && onOpen(evt);
    ws.onclose = (evt) => onClose && onClose(evt);
    ws.onerror = (evt) => onError && onError(evt);
    ws.onmessage = (evt) => {
      // Backend message formats may vary; we forward raw and parsed where possible.
      let parsed = null;
      try {
        parsed = JSON.parse(evt.data);
      } catch (_e) {
        parsed = null;
      }
      onMessage && onMessage({ raw: evt.data, json: parsed });
    };

    return ws;
  };

  const close = () => {
    if (!ws) return;
    ws.close();
    ws = null;
  };

  const send = (payload) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(typeof payload === "string" ? payload : JSON.stringify(payload));
  };

  return { enabled: true, connect, close, send };
}

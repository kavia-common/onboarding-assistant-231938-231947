/**
 * Environment + feature flags parsing helpers.
 *
 * CRA only exposes env vars prefixed with REACT_APP_.
 */

/** PUBLIC_INTERFACE */
export function getApiBaseUrl() {
  /**
   * Returns the backend base URL for REST calls.
   * Precedence: REACT_APP_API_BASE, then REACT_APP_BACKEND_URL, else empty string (relative).
   */
  const base =
    (process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || "").trim();

  // If empty, use same-origin relative URLs.
  return base.replace(/\/+$/, "");
}

/** PUBLIC_INTERFACE */
export function getWsBaseUrl() {
  /**
   * Returns the WebSocket base URL (e.g., ws://localhost:8000).
   * Empty string means WS disabled/unconfigured.
   */
  const ws = (process.env.REACT_APP_WS_URL || "").trim();
  return ws.replace(/\/+$/, "");
}

/** PUBLIC_INTERFACE */
export function getHealthcheckPath() {
  /** Returns the backend healthcheck path. Defaults to /healthz */
  return (process.env.REACT_APP_HEALTHCHECK_PATH || "/healthz").trim() || "/healthz";
}

/** PUBLIC_INTERFACE */
export function parseJsonEnv(envValue, fallbackValue) {
  /**
   * Parses JSON env strings safely.
   * @param {string|undefined} envValue
   * @param {any} fallbackValue
   * @returns {any}
   */
  if (!envValue) return fallbackValue;
  try {
    return JSON.parse(envValue);
  } catch (_e) {
    return fallbackValue;
  }
}

/** PUBLIC_INTERFACE */
export function getFeatureFlags() {
  /**
   * Feature flags are provided as a JSON string in REACT_APP_FEATURE_FLAGS.
   * Example:
   *  {"announcements": true, "wsChat": false}
   */
  return parseJsonEnv(process.env.REACT_APP_FEATURE_FLAGS, {});
}

/** PUBLIC_INTERFACE */
export function experimentsEnabled() {
  /**
   * Experiments enabled flag (JSON string). Common examples:
   *  "true", "false", "1", or JSON "{"enabled":true}".
   */
  const raw = process.env.REACT_APP_EXPERIMENTS_ENABLED;
  if (!raw) return false;

  // handle simple booleans or numbers
  const lowered = String(raw).trim().toLowerCase();
  if (lowered === "true" || lowered === "1") return true;
  if (lowered === "false" || lowered === "0") return false;

  // fallback to JSON parsing
  const parsed = parseJsonEnv(raw, false);
  if (typeof parsed === "boolean") return parsed;
  if (parsed && typeof parsed === "object") return Boolean(parsed.enabled);
  return false;
}

/** PUBLIC_INTERFACE */
export function isFlagEnabled(flagName, defaultValue = false) {
  /**
   * Reads from REACT_APP_FEATURE_FLAGS (JSON object) and returns boolean.
   */
  const flags = getFeatureFlags();
  if (!flags || typeof flags !== "object") return defaultValue;
  const value = flags[flagName];
  if (typeof value === "boolean") return value;
  return defaultValue;
}

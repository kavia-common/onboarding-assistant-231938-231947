# Employee Onboarding Frontend (React)

Minimalist “Ocean Professional” dashboard UI for the AI-driven employee onboarding assistant.

## Run locally

From this directory:

```bash
npm install
npm start
```

App runs on port **3000** (Create React App).

## Environment variables

This app uses CRA-style environment variables (must be prefixed with `REACT_APP_`). Configure them in the container’s `.env` (already managed by the system).

### Backend URLs

- `REACT_APP_API_BASE` (preferred)  
  Base URL for REST requests. Example: `http://localhost:8000`
- `REACT_APP_BACKEND_URL` (fallback if API_BASE is not set)  
  Base URL for REST requests.
- `REACT_APP_HEALTHCHECK_PATH` (optional, default `/healthz`)  
  Used to detect whether backend is available.

### WebSocket (optional)

- `REACT_APP_WS_URL` (optional)  
  Base WS URL (e.g., `ws://localhost:8000/ws/chat` or `ws://localhost:8000/ws` depending on backend).

WS is only used when the `wsChat` feature flag is enabled.

### Feature flags / experiments

- `REACT_APP_FEATURE_FLAGS` (JSON string)  
  Example:
  ```json
  {"announcements": true, "wsChat": false}
  ```
- `REACT_APP_EXPERIMENTS_ENABLED` (JSON string / boolean-like)  
  Examples: `"true"`, `"false"`, `{"enabled": true}`

## API endpoints used

The frontend calls these REST endpoints:

- `GET /api/profile`
- `GET /api/modules`
- `GET /api/progress`
- `GET /api/tasks`
- `GET /api/announcements`
- `GET /api/chat` (history)
- `POST /api/chat` with body `{ "message": "..." }`

## Mock mode (graceful fallback)

If the backend is unavailable, the app automatically enters **Mock mode**:

1. The client calls `GET {API_BASE}{HEALTHCHECK_PATH}` (default `/healthz`) once.
2. If the request fails, the API client returns sample data for:
   - profile, modules, progress, tasks, announcements
3. Chat uses an **echo + guidance** behavior in mock mode.

The current mode is shown in the top bar (e.g., `Chat Assistant • Mock mode`) and in Settings.

## UI structure

- Left sidebar navigation: Home, Chat Assistant, Modules, Progress, Announcements (flagged), Settings
- Top bar: title, search field (UI-only), avatar placeholder
- Main content: view-specific panels (Chat is default)
"""

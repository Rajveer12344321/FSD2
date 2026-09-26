# Broadcastr — Setup Instructions

Broadcastr is a multi-platform post composer: write one post, pick a
platform (X/Twitter, Instagram, Facebook), and it's automatically capped
at that platform's word limit before it's saved. This is a re-skinned,
re-architected rebuild of the original "OmniPost Composer" project —
**same features**, brand-new light/sidebar UI, and a slightly hardened
backend (posts now carry a timestamp and are returned newest-first).

## Project layout

```
broadcastr/
├── backend/     Spring Boot 4 + Spring Data JPA + H2 (in-memory) REST API
└── frontend/    React 18 + Vite 5 single-page app
```

## 1. Run the backend (port 8080)

Requires Java 17+.

```bash
cd backend
./gradlew bootRun        # macOS/Linux
gradlew.bat bootRun       # Windows
```

The first run downloads Gradle + dependencies, so it needs an internet
connection. Once it's up, the API is live at `http://localhost:8080/api/posts`
and the H2 console (if you want to peek at the data) is at
`http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:broadcastrdb`,
user `sa`, empty password).

## 2. Run the frontend (port 5173)

Requires Node 18+.

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The frontend
talks to the backend over `http://localhost:8080`, so make sure the
backend is already running.

## Features (unchanged from the original)

- Compose a post for X/Twitter (50 words), Instagram (100 words), or
  Facebook (200 words) — content is trimmed automatically if you go over.
- Live word-count progress bar per platform.
- Full post history with per-platform filter pills.
- Inline edit and delete on any saved post.
- A dismissible toast banner surfaces backend/connection errors instead
  of failing silently.
- Posts persist in an in-memory H2 database while the backend is running
  (data resets on backend restart, same as the original).

## Troubleshooting "frontend can't reach backend"

This is almost always one of these three things, in order of likelihood:

1. **The backend isn't actually running yet.** `./gradlew bootRun` needs to
   finish printing `Started BroadcastrApplication in ... seconds` before
   the API is live. Leave that terminal open and running.
2. **Port 5173 was already taken**, so Vite silently started on 5174 (or
   another port) instead. This project now sets `strictPort: true` in
   `vite.config.js`, so instead of silently moving ports, Vite will now
   fail with a clear "Port 5173 is already in use" error if that happens —
   free up the port (or stop whatever else is using it) and restart
   `npm run dev`.
3. **CORS mismatch.** The backend now allows *any* `http://localhost:*` or
   `http://127.0.0.1:*` origin (see `WebConfig.java`), not just an exact
   `http://localhost:5173`, so this shouldn't happen anymore — but if you
   open the app via a different scheme/host (e.g. a LAN IP), you'll need
   to add that origin pattern to `WebConfig.java` too.

The app itself now shows the *actual* error under the composer (not a
generic message) plus a **Retry connection** button, so if something is
still wrong you'll see exactly what failed — e.g. "Could not reach
http://localhost:8080/api/posts... Failed to fetch" means the backend
isn't up or isn't reachable at all, while "Server responded with 500"
means the backend is up but threw an error (check its terminal log).

## What's different from the original

- New light, sidebar-based layout (the original was a centered dark
  glassmorphism layout) — no shared CSS or component code.
- Renamed packages/classes (`com.example.broadcastr` instead of
  `com.example.backend`) and a fresh React component structure
  (`Composer`, `Feed`, `PostCard`, `Toast`).
- Posts now store a `createdAt` timestamp and are always returned
  newest-first from the API.
- A client-side platform filter on the history feed.

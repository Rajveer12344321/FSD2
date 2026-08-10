# Redux Content State Management

**Unit 1 — Experiment 2: Redux-Based Content State Management**

A React + Redux Toolkit application that manages posts and platforms for a
social-media-style content dashboard, built to satisfy every objective in
Experiment 2.1, Experiment 2.2, and Assignments 1–5 of the accompanying
practical PDF.

---

## 1. Project Overview

This app implements a centralized, normalized Redux store for two domains —
**posts** and **platforms** — with full CRUD, simulated async data fetching,
memoized derived selectors, and a working side-by-side demonstration of
optimized vs. non-optimized React rendering.

Core screens:
- **Dashboard** — totals, platform count, recent posts, loading/error states
- **Posts** — add/edit/delete/search/filter posts
- **Platforms** — add/edit/delete platforms
- **Analytics** — totals, per-platform breakdown, short/long/recent posts
- **Performance Demo** — a non-optimized list next to an optimized one,
  each showing a live render counter

---

## 2. Dependencies

| Package         | Purpose                                    |
|------------------|---------------------------------------------|
| react / react-dom | UI rendering                              |
| @reduxjs/toolkit | Store, slices, entity adapter, async thunks |
| react-redux      | React bindings (`useSelector`/`useDispatch`) |
| reselect         | `createSelector` memoized selectors        |
| vite             | Dev server + build tooling                 |
| @vitejs/plugin-react | Fast Refresh for React in Vite          |

No TypeScript, no UI framework (no Bootstrap/Tailwind) — plain CSS only,
per the experiment's constraints.

---

## 3. Installation & How to Run

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

Other scripts:
```bash
npm run build     # production build into dist/
npm run preview   # preview the production build locally
```

---

## 4. Folder Structure

```
redux-content-state-management/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx                       # entry point, wraps App in <Provider>
    ├── App.jsx                        # tab-based layout / root component
    ├── app/
    │   └── store.js                   # configureStore (posts + platforms)
    ├── features/
    │   ├── posts/
    │   │   ├── postsSlice.js          # createSlice + createEntityAdapter + createAsyncThunk
    │   │   ├── postSelectors.js       # createSelector-based memoized derived selectors
    │   │   ├── Posts.jsx              # list, search, filter, edit/delete
    │   │   └── AddPost.jsx            # create + edit form
    │   └── platforms/
    │       ├── platformSlice.js       # createSlice + createEntityAdapter (CRUD)
    │       └── Platforms.jsx          # platform CRUD UI
    ├── components/
    │   ├── Navbar.jsx                 # top navigation / tab switcher
    │   ├── Sidebar.jsx                # quick stats + platform legend
    │   ├── Dashboard.jsx              # overview cards + recent posts
    │   ├── Analytics.jsx              # statistics + per-platform breakdown
    │   ├── PerformanceDemo.jsx        # hosts the tick counter + both lists
    │   ├── NonOptimizedList.jsx       # intentionally unoptimized (Assignment 5, side A)
    │   └── OptimizedList.jsx          # React.memo/useMemo/useCallback (Assignment 5, side B)
    ├── api/
    │   └── postsApi.js                # mock JSONPlaceholder-style fetch, simulated latency
    └── styles/
        └── style.css                  # entire app's styling, plain CSS, responsive
```

---

## 5. Redux Architecture

- **Single store** (`app/store.js`) combining the `posts` and `platforms`
  reducers — a single source of truth (Experiment 2.1).
- **Normalization**: both slices use `createEntityAdapter`, storing data as
  `{ ids: [], entities: {} }` instead of nested arrays (Assignment 3).
- **Async data**: `fetchPosts` (`createAsyncThunk`) simulates a network call
  via `api/postsApi.js`, with `pending` / `fulfilled` / `rejected` handled
  in `extraReducers` — modeled as a finite state machine (Experiment 2,
  section 2 / Assignment 2).
- **Separation of concerns**: each slice's `initialState` keeps UI-only
  flags (`loading`, `error`, `searchTerm`, `platformFilter`) alongside — but
  logically separate from — the normalized data itself.
- **Selectors**: `postSelectors.js` builds a chain of `createSelector`
  selectors — `selectSearchedPosts` → `selectVisiblePosts`,
  `selectPostCountByPlatform`, `selectRecentPosts`, `selectShortPosts`,
  `selectLongPosts`, and the combined `selectPostStatistics` — so
  components never re-filter/re-aggregate raw state themselves
  (Experiment 2.2 / Assignment 4).

---

## 6. Features

- Add / edit / delete / view posts
- Search posts by title or content
- Filter posts by platform
- Add / edit / delete platforms
- Simulated async fetch with loading + error UI
- Analytics: totals, per-platform counts, average content length, short
  posts, long posts, recent posts
- Live, side-by-side performance comparison: a deliberately unoptimized
  list vs. a `React.memo` + memoized-selector + `useMemo`/`useCallback`
  optimized list, each with a visible render counter

---

## 7. Screenshots

*(Add screenshots here after running the app locally — e.g.
`docs/dashboard.png`, `docs/posts.png`, `docs/analytics.png`,
`docs/performance-demo.png`.)*

---

## 8. Learning Outcomes

- Configuring a Redux Toolkit store and combining multiple slices
- Modeling normalized state with `createEntityAdapter`
- Handling async request lifecycles with `createAsyncThunk`
- Writing memoized derived-state selectors with `reselect`
- Diagnosing and fixing unnecessary React re-renders with `React.memo`,
  `useMemo`, and `useCallback`
- Structuring a mid-size React/Redux app into slices, selectors, and
  presentational components with a clear separation of data vs. UI state

---

## 9. Lab Alignment

| Requirement                          | Where it's implemented |
|---------------------------------------|-------------------------|
| Experiment 2.1 (store, slices, normalization, async, data/UI separation) | `app/store.js`, `postsSlice.js`, `platformSlice.js` |
| Experiment 2.2 (selectors, memoization, re-render avoidance) | `postSelectors.js`, `OptimizedList.jsx` |
| Assignment 1 (Redux slice implementation) | `postsSlice.js`, `Posts.jsx` |
| Assignment 2 (async data handling) | `fetchPosts` thunk + `Posts.jsx` loading/error UI |
| Assignment 3 (state normalization) | `createEntityAdapter` in both slices |
| Assignment 4 (selector optimization) | `postSelectors.js` |
| Assignment 5 (performance optimization) | `PerformanceDemo.jsx`, `NonOptimizedList.jsx`, `OptimizedList.jsx` |

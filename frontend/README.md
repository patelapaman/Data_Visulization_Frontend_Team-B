# AI-Assisted Threat Detection Dashboard — Frontend

React + Vite single-page app for the SOC analyst dashboard: login/register,
the Overview dashboard (KPIs, charts, security events table, filters), and
the Milestone 2 AI Threat Detection section (anomaly predictions, event
investigation, live prediction).

This repo is the **frontend half** of a two-repo project. It talks to a
separately-deployed Flask backend over REST — see the backend repo's README
for how to run that side.

---

## Requirements

- Node.js 18+ and npm
- The backend running (locally or deployed) — see `VITE_API_BASE_URL` below.
  The app still loads and is browsable without it, but login, register, and
  live data will show connection errors until the backend is reachable.

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and point `VITE_API_BASE_URL` at your backend, e.g.:

```
VITE_API_BASE_URL=http://127.0.0.1:5000/api
```

## Run

```bash
npm run dev
```

Open the printed local URL (defaults to `http://localhost:5173`).

## Build for production

```bash
npm run build     # outputs to dist/
npm run preview   # serve the production build locally to sanity-check it
```

Deploy the contents of `dist/` to any static host (Netlify, Vercel, S3 +
CloudFront, nginx, etc.), with `VITE_API_BASE_URL` set at build time to your
production backend URL.

---

## Project structure

```
src/
├─ main.jsx                 Entry point — mounts <App/> inside ThemeProvider
├─ App.jsx                  Route table (public + protected routes)
├─ context/
│  ├─ AuthContext.jsx       Login/register/logout, persisted session
│  ├─ ThemeContext.jsx      Light / Dark / System theme, persisted
│  └─ Milestone2Context.jsx AI detection data fetching (predictions, stats)
├─ routes/
│  └─ ProtectedRoute.jsx    Redirects to /login if not authenticated
├─ services/
│  └─ api.js                All backend calls (auth, dashboard, profile...)
├─ pages/
│  ├─ Login.jsx / Register.jsx
│  ├─ Dashboard.jsx         Overview: KPIs, charts, events table, filters
│  ├─ Profile.jsx           My Profile — editable account details
│  ├─ Settings.jsx          Security/alert toggles + theme picker
│  └─ NotFound.jsx
├─ milestone2/               AI Threat Detection section
│  ├─ MilestoneDashboard.jsx AI detection overview (stats, charts, table)
│  ├─ pages_EventDetails.jsx Event investigation ("why was it flagged")
│  ├─ pages_LivePrediction.jsx Manual "run a prediction" form
│  ├─ components/            StatCard, ThreatTable, ConfidenceCard
│  ├─ charts/Charts.jsx      Anomaly distribution / threat type / trend
│  └─ milestone2.css         Styling — uses the shared theme tokens
├─ components/
│  ├─ layout/                Sidebar, Navbar, DashboardLayout
│  ├─ SecurityEventsTable.jsx
│  └─ Toast.jsx              Shared toast notification (replaces alert())
└─ styles/
   └─ theme.css              Design tokens (colors, fonts) — light + dark
```

---

## What changed in this pass

This app was reviewed end-to-end and polished for a consistent,
professional feel across every page, in both light and dark mode.

### Fixed
- **Profile page had no real UI** — it was plain unstyled text and could
  get stuck on "Loading…" forever if the backend was unreachable. Rebuilt
  as a proper card-based page with an avatar, editable fields (name,
  phone, department, designation), and a save flow that always works
  locally even if the backend call fails.
- **Settings page** wasn't wired to the actual theme system (had a dead
  `body.dark-theme` class toggle that did nothing) and used hardcoded
  light-only colors (`#fff` cards, `#222` text) that looked broken in dark
  mode. Rebuilt to use the real theme context and shared design tokens.
- **Logout / profile navigation bug**: the navbar's "My Profile" link
  navigated to `/dashboard/profile/${user.id}` — `user.id` was never set
  on the session object, so this was a dead link. Simplified the route to
  `/dashboard/profile` (a user only ever views their own profile).
- **AI Threat Detection section was visually a separate app** — it had
  its own hardcoded dark-only color palette (independent of the site
  theme) and its own header instead of the shared Sidebar/Navbar, so
  switching to light mode did nothing there and navigating to it felt
  like leaving the site. Rewired all three AI Detection pages to use the
  shared `DashboardLayout`, and rewrote `milestone2.css` to use the same
  theme variables as the rest of the app.
- **Low-contrast / invisible text in light mode**: several components
  (Navbar badges, status pills, buttons) had hardcoded hex colors that
  were only tuned for dark backgrounds. Replaced with theme-aware tokens
  across `Navbar.css`, `Settings.css`, and `milestone2.css`.
- **Trend chart accuracy**: the Anomaly Trend chart plotted one point per
  raw event index rather than actual time. It now buckets predictions by
  hour, so it genuinely shows "time vs. number of anomalies."
- **`alert()` popups** on register success replaced with the shared toast
  component; same for settings save.
- Removed leftover `console.log` debug statements, a dead/unused
  `NotificationPanel` component, and an empty orphaned `Register.css`
  (Register.jsx was actually relying on `Login.css`'s classes).

### Added
- **Real "System" theme option** — `ThemeContext` now genuinely follows
  the OS light/dark preference and updates live if it changes, in
  addition to manual Light/Dark.
- **CSV export** on the AI Detection predictions table.
- **Copy-to-clipboard** for the Event ID on the investigation page.
- **Toast notification component** (`components/Toast.jsx`) used across
  Settings, Profile, and Register instead of jarring `alert()` calls.

---

## Notes for teammates

- All colors should come from `src/styles/theme.css`'s CSS variables
  (`--bg-panel`, `--text-primary`, `--accent`, `--signal-*`, etc.) rather
  than hardcoded hex — that's what makes light/dark mode work correctly
  everywhere. If you add a new page, check it in both themes before
  committing (toggle in Settings, or the quick-toggle in the navbar).
- `src/milestone2/` intentionally mirrors the class-name convention
  (`m2-*`) already used by that section — keep using those classes rather
  than inventing new ones, so styling stays centralized in
  `milestone2.css`.

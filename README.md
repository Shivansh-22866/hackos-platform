# HackOS Platform

A full-stack hackathon management platform built with React 18, TypeScript, Zustand, Tailwind CSS, and MSW.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Generate the MSW service worker (required for mock API)
npx msw init public/ --save

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** The app uses MSW (Mock Service Worker) to intercept all API calls locally. No backend is required. If you see a blank screen, make sure step 2 completed successfully — `public/mockServiceWorker.js` must exist.

---

## Role Switching (Demo)

Use the **Switch Role** dropdown in the top-right navbar to change between:

| Role | Default user | Access |
|---|---|---|
| **Participant** | Alice Johnson (MIT) | Landing, Events, Registration, Team Dashboard, Project Submission |
| **Judge** | Dr. Carol Davis | Review Queue + Scoring Panel |
| **Organizer** | Dave Wilson | Control Panel (Stats, Registrations, Announcements, Judges) |

---

## Architecture Decisions

### State Management — Zustand

Chose Zustand over Redux Toolkit and Context API because:
- **Zero boilerplate** — no actions, reducers, or providers
- **TypeScript-first** — generics on `create<T>()` give full type safety
- **Granular subscriptions** — components only re-render when their slice changes
- **Tiny bundle** (~1 KB gzipped vs ~11 KB for RTK)

Each domain gets its own store file:
- `authStore` — current user + role switching
- `eventStore` — events and tracks with async fetch actions
- `registrationStore` — 5-step wizard state (persists across step navigation)
- `leaderboardStore` — real-time rank entries
- `notificationStore` — SSE announcement feed

### Styling — Tailwind CSS v3

Chosen over CSS Modules and styled-components because:
- **Co-location** — styles live with the component, no context switching
- **Design token system** — custom `surface`, `brand`, `ink` tokens in `tailwind.config.js` ensure consistency
- **No runtime cost** — all CSS generated at build time

### Mock API — MSW 2.x

MSW intercepts at the Service Worker layer (not `fetch`), making it completely transparent to components. Handlers in `src/mocks/handlers.ts` cover all endpoints and maintain mutable in-memory state so POST/PATCH operations persist within a browser session.

### Real-time Simulation

| Feature | Approach |
|---|---|
| SSE announcements | `useSSE` hook — `setInterval` pushes announcements to `notificationStore` every 30s |
| WebSocket leaderboard | `useLeaderboardWS` hook — `setInterval` swaps adjacent ranks every 6s |
| Live participant counter | Local `useState` ticked every 8s in `EventDetailsPage` |

In production these would be replaced with real `EventSource` and `WebSocket` connections pointing to the backend.

### Routing — React Router v6

Used React Router v6 with `<Routes>` + `<Route>` instead of Next.js App Router to keep the project as a pure Vite SPA (no SSR complexity needed for a hackathon dashboard).

Role guards are implemented as a lightweight `<RequireRole>` wrapper in `App.tsx` — no third-party auth library needed for the mock.

---

## Project Structure

```
src/
├── types/          # All TypeScript interfaces (User, Event, Track, Team, Project, …)
├── data/           # Static mock data (seeded into MSW handlers)
├── mocks/          # MSW service worker setup + request handlers
├── store/          # Zustand stores (auth, event, registration, leaderboard, notification)
├── hooks/          # useSSE, useLeaderboardWS, useCountdown
├── components/
│   ├── ui/         # Button, Badge, Card, Input, Textarea, Modal, Countdown
│   └── layout/     # Navbar, Footer
└── pages/
    ├── LandingPage/          # Hero, Timeline, Prizes, Sponsors, FAQ
    ├── EventListingPage/     # Filterable event cards
    ├── EventDetailsPage/     # Full event with track tabs + live counter
    ├── RegistrationFlow/     # 5-step wizard (Personal → Team → Track → Review → Confirm)
    ├── TeamDashboard/        # Team card, Submission tracker, Announcements, Leaderboard
    ├── ProjectSubmissionPage/ # Form with deadline enforcement + tag-based tech stack
    ├── JudgeDashboard/       # Split: project queue + per-criterion scoring panel
    └── OrganizerDashboard/   # Tabbed: Stats, Registration table, Announcements, Judges
```

---

## Entity Data Model

The following entities form the data backbone of the platform.

**User**


  ----------------- ----------------- -----------------------------------
  **Field**         **Type**          **Notes**

  id                UUID              Primary key

  email             string            Unique. Used for login and
                                      duplicate detection

  name              string            

  college_or_org    string            Collected in registration step 1

  role              enum              participant \| judge \| organizer

  avatar_url        string?           Optional profile image

  created_at        timestamp         
  ----------------- ----------------- -----------------------------------

**Registration**

  ----------------- ----------------- -----------------------------------
  **Field**         **Type**          **Notes**

  id                UUID              The shareable confirmation ID shown
                                      on the confirmation screen

  user_id           UUID FK           References User

  event_id          UUID FK           References Event

  team_id           UUID FK?          Null for solo participants until
                                      team is joined or created

  track_id          UUID FK           Selected in step 3 of registration

  status            enum              pending \| confirmed \| cancelled

  registered_at     timestamp         
  ----------------- ----------------- -----------------------------------

**Event**

Fully mapped to pages 1--3.

  ---------------------- ----------------- -----------------------------------
  **Field**              **Type**          **Notes**

  id                     UUID              Primary key

  title                  string            Displayed in hero section (page 1)
                                           and event cards (page 2)

  tagline                string            Short marketing line for the hero
                                           section

  description            rich text         Full description shown on event
                                           details page

  rules                  rich text         

  eligibility_criteria   rich text         

  start_date             datetime          Used in countdown timers

  end_date               datetime          Submission deadline ---
                                           Project.locked is derived from this

  registration_open      datetime          Timeline milestone

  judging_start          datetime          Timeline milestone

  results_date           datetime          Timeline milestone

  team_min_size          int               

  team_max_size          int               

  participant_count      int               Live count shown on event details
                                           page

  status                 enum              upcoming \| active \| closed

  cta_url                string            Registration CTA link

  resources              JSON\[\]          Array of {label, url} links shown
                                           in team dashboard

  sponsors               JSON\[\]          Array of {name, logo_url, tier} for
                                           sponsors section
  ---------------------- ----------------- -----------------------------------

**Track**

  ------------------- ----------------- -----------------------------------
  **Field**           **Type**          **Notes**

  id                  UUID              Primary key

  event_id            UUID FK           References Event

  name                string            e.g. \"Web3\", \"AI/ML\", \"Open
                                        Innovation\"

  description         string            Short summary shown on event
                                        details and selection step

  problem_statement   rich text         Full problem statement for the
                                        track

  prize_first         int               First place prize in USD

  prize_second        int               Second place prize

  prize_third         int               Third place prize
  ------------------- ----------------- -----------------------------------

**Team**

Well-mapped to page 5

  ----------------- ----------------- -----------------------------------
  **Field**         **Type**          **Notes**

  id                UUID              

  event_id          UUID FK           References Event

  track_id          UUID FK           References Track (not a string
                                      anymore)

  leader_id         UUID FK           References User

  members           UUID\[\]          Array of User IDs

  invite_code       string            Unique code used in registration
                                      step 2 join flow

  summary           string            Editable team bio shown in team
                                      dashboard

  created_at        timestamp         
  ----------------- ----------------- -----------------------------------

**Project**

  ----------------- ----------------- -----------------------------------
  **Field**         **Type**          **Notes**

  id                UUID              

  team_id           UUID FK           

  event_id          UUID FK           

  title             string            

  description       rich text         

  tech_stack        string\[\]        Array of technology tags

  demo_url          string?           Live demo link

  github_url        string?           

  pitch_deck_url    string?           Uploaded PDF, max 10 MB

  video_url         string?           YouTube or Loom link

  status            enum              not_started \| draft \|
                                      submitted

  locked            derived bool      True when current time \>
                                      Event.end_date --- never stored
                                      redundantly

  submitted_at      timestamp?        Null until submission is finalised
  ----------------- ----------------- -----------------------------------

**Judge**


  ----------------- ----------------- -----------------------------------
  **Field**         **Type**          **Notes**

  id                UUID              Same as User.id for this role

  event_id          UUID FK           

  assigned_tracks   UUID\[\]          array of Track IDs this
                                      judge covers

  is_active         bool              Used in organizer dashboard active
                                      judge count
  ----------------- ----------------- -----------------------------------

**JudgeScore (child of Judge)**

  ----------------- ----------------- -----------------------------------
  **Field**         **Type**          **Notes**

  id                UUID              

  judge_id          UUID FK           

  project_id        UUID FK           

  innovation        int 1--10         

  technical         int 1--10         

  impact            int 1--10         

  presentation      int 1--10         

  comments          string?           Optional free-text notes

  review_status     enum              pending \| in_review \| scored

  scored_at         timestamp?        
  ----------------- ----------------- -----------------------------------

**Announcement**

  ----------------- ----------------- -----------------------------------
  **Field**         **Type**          **Notes**

  id                UUID              

  event_id          UUID FK           

  created_by        UUID FK           References User (organizer role)

  title             string            

  body              rich text         Supports markdown or HTML

  target_type       enum              broadcast \| team \| user \| role
                                      --- governs who receives the
                                      notification

  target_id         UUID?             Null for broadcast; points to
                                      team/user/role otherwise

  created_at        timestamp         Used to sort the announcements feed
  ----------------- ----------------- -----------------------------------

## Component Guidelines

- Every component is **under 200 lines**. Pages are composed of focused sub-components.
- No `any` types. All API responses are cast with `as Type` after validation.
- TypeScript strict mode enabled in `tsconfig.json`.

---

## Available Scripts

```bash
npm run dev        # Start Vite dev server (port 3000)
npm run build      # Type-check + production build
npm run preview    # Preview production build locally
npm run lint       # ESLint
npm run format     # Prettier
npm run init:msw   # Generate public/mockServiceWorker.js
```

---

## What I'd Do With More Time

1. **Persistent registration state** — use `zustand/middleware` `persist` to survive page refresh during the multi-step form
2. **Real SSE endpoint** — replace the `setInterval` shim with a proper `/api/sse` stream (Node.js + `res.write('data: ...\n\n')`)
3. **WebSocket leaderboard** — Socket.io or native WS for authoritative rank pushes
4. **Authentication** — JWT + refresh-token flow; `<RequireRole>` currently reads from in-memory store only
5. **File uploads** — Real S3/Cloudflare R2 pre-signed URL flow for pitch decks; currently only URL fields
6. **Pagination** — Registration table currently loads all rows; add server-side cursor pagination
7. **Optimistic UI** — Submission and score saves feel instant but still await the MSW response; could be made instant with rollback

---

## Known Limitations & Trade-offs

- **No real persistence** — MSW state resets on browser refresh (by design for a mock)
- **Single event scope** — Team dashboard and project submission are hardcoded to `event-1`; multi-event support would require user context to carry the active event
- **Role guard is UI-only** — any user can navigate directly to `/dashboard/organizer` by URL; a real app needs server-side auth
- **No toast notifications** — feedback on save/submit uses inline states rather than a global toast system

---

## Bonus Features Implemented

- ✅ **Live participant counter** on event details page (increments in real time)
- ✅ **CSV export** — registration table exports to `.csv` in one click
- ✅ **Duplicate detection** — registration step 1 checks email against existing registrations
- ✅ **Deadline enforcement** — submission form locks all inputs + hides CTA once past deadline
- ✅ **Leaderboard rank deltas** — arrows + animation when ranks change (▲ green / ▼ red)
- ✅ **Role-based navbar** — nav links change dynamically based on current role

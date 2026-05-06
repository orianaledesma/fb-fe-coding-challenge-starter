# Team Incident Dashboard

Production-quality frontend for an internal operations team to view, triage, create, and resolve incidents. Built on top of the provided starter project (React 18 + TypeScript + Vite + mock API).

> **Live brief:** see [candidate-brief.md](./candidate-brief.md) for the full task description.

---

## Quick start

### Prerequisites
- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run

```bash
npm run dev          # vite dev server at http://localhost:5173
npm run build        # type-check + production build
npm run preview      # serve the production build locally
```

### Quality gates

```bash
npm test             # vitest run, 44 tests across 8 files
npm run lint         # ESLint (typescript-eslint + react-hooks)
npm run format       # Prettier
```

### Resetting mock data

Data is persisted in `localStorage` and survives page refreshes. To restore the seed data run from the browser console:

```js
await fetch("/api/reset", { method: "POST" });
```

---

## Architecture & key decisions

### State management — server vs UI

Two distinct layers, intentionally split:

- **Server state** → [TanStack Query](https://tanstack.com/query). Handles caching, deduplication, retries, optimistic updates, and rollback. Centralized query keys live in `features/incidents/api/queryKeys.ts`.
- **UI state** → URL search params via `useSearchParams`. Filters (status, severity, assignee, search) and sort (field, direction) are encoded in the URL. This makes filter views shareable, persists across reloads, and removes the need for a separate UI store.

I deliberately avoided Redux/Zustand: there's no cross-cutting client state that would justify a third store, and over-introducing them would have been a senior anti-pattern.

### Data fetching strategy

A typed `http<T>(url, opts)` wrapper (`src/lib/http.ts`) sits on top of `fetch`:
- Throws a custom `HttpError` carrying `status` + `body` so the UI can switch on status (e.g. distinguishing 404 in detail page).
- Surfaces the mock's `{ error: "…" }` body as `error.message`, which is what populates form server errors and toasts.
- Handles `204 No Content` and JSON/text content types.

Mutations follow a consistent pattern:
- **Create** (`useCreateIncident`) — on success, prepends to the list cache and seeds the detail cache. No optimistic UI because we don't have an ID until the server replies.
- **Update** (`useUpdateIncident`) — full optimistic flow: `onMutate` snapshots both list and detail caches, applies a synthesized update (including a new `statusHistory` entry when status changes), `onError` rolls back from the snapshot, `onSettled` invalidates both queries to reconcile with the server.
- **Delete** (`useDeleteIncident`) — on success, removes from list cache and drops the detail query.

### Form validation

[Zod](https://zod.dev) schemas in `features/incidents/schemas/incidentSchema.ts`. The form is hand-rolled (no React Hook Form): the dataset is small enough that introducing another library would have been over-engineering. Validation runs on blur per field and on submit for the whole form. Server errors (400 from the mock) are surfaced inline above the form.

### Styling — CSS Modules + design tokens

- All design decisions live in `src/styles/tokens.css` as CSS variables (color, spacing scale, radii, type scale, elevation, motion, focus ring).
- Each component owns a co-located `*.module.css` consuming tokens via `var(--…)`.
- No CSS-in-JS, no Tailwind, no component library — keeps the bundle lean and demonstrates that a design system can be maintained with native primitives.
- Brand reference: [danskebank.dk](https://danskebank.dk) — deep navy primary (`#022346`), white surfaces, sans-serif (`Danske-Regular, Danske-Medium, Arial, sans-serif`), minimal decoration.

### Accessibility patterns

- **Skip link** to main content (`SkipLink`), visible on focus.
- Semantic landmarks: `<header>`, `<main>` (focusable, `id="main-content"`), `<nav>` via Header, `<section>` per content block.
- `<table>` with `<thead>`/`<tbody>`/`<th scope="col">` for the list; `aria-sort` on sortable columns.
- All form fields use `<label htmlFor>` and surface errors via `aria-invalid` + `aria-describedby` + `role="alert"`.
- Live regions: `role="status" aria-live="polite"` on loading and result-count blocks; `role="alert"` on error states.
- Modals via Radix Dialog (focus trap, ESC to close, `aria-modal`, restored focus on close).
- Toast notifications via Radix Toast (auto-announced, swipe to dismiss, keyboard accessible).
- `:focus-visible` ring (token-driven) on every interactive element.

### Component library — Radix UI (headless)

Used for primitives that are notoriously hard to make accessible from scratch:
- **Select** (status, severity, assignee filters and form fields)
- **Dialog** (delete confirmation)
- **Toast** (mutation feedback)

Each Radix primitive is wrapped in a project-owned component (`components/ui/*`) so styling and behavior stay consistent. Tooltip, Popover, etc. were intentionally left out — adding them without a use case would be unjustified scope.

### Routing

React Router v6 with `createBrowserRouter`:

| Path | Page |
|---|---|
| `/` | List with filters/sort in URL params |
| `/incidents/new` | Create form |
| `/incidents/:id` | Detail view + inline edit (status, assignee) |
| `*` | NotFound |

---

## File structure

```
src/
├── App.tsx                       # shell: SkipLink + Header + <Outlet/>
├── main.tsx                      # QueryClient + Toast.Provider + RouterProvider
├── routes.tsx                    # createBrowserRouter
├── index.css                     # imports tokens, normalizes globals
│
├── api/                          # provided mock API (untouched, except types reused)
│   ├── mockApi.ts, storage.ts, seedData.ts, types.ts
│   └── mockApi.test.ts
│
├── lib/
│   ├── http.ts                   # typed fetch wrapper + HttpError
│   └── queryClient.ts            # QueryClient factory + defaults
│
├── styles/tokens.css             # design system: colors, spacing, type, elevation
│
├── components/
│   ├── layout/
│   │   ├── Header/               # Danske-style top bar + brand + CTA
│   │   ├── PageContainer/        # focusable <main>, max-width container
│   │   └── SkipLink/             # a11y skip-to-content
│   └── ui/                       # presentational primitives (CSS Modules + Radix)
│       ├── Button, Input, Select, Dialog, Toast, Spinner
│       ├── Badge/{Status,Severity}Badge
│       └── States/{Empty,Error}State
│
├── features/incidents/           # feature-scoped, vertically organized
│   ├── api/                      # incidents.ts, users.ts, queryKeys.ts
│   ├── hooks/                    # useIncidents, useIncident, useUsers,
│   │                             # useCreateIncident, useUpdateIncident (optimistic),
│   │                             # useDeleteIncident, useIncidentSearchParams
│   ├── components/               # IncidentList, IncidentFilters, IncidentForm,
│   │                             # AssigneePicker, StatusTimeline
│   ├── pages/                    # IncidentList, IncidentDetail, NewIncident, NotFound
│   ├── schemas/incidentSchema.ts # Zod
│   └── utils/                    # filterIncidents, sortIncidents, formatDate (pure)
│
└── test/                         # setup.ts (jsdom polyfills) + utils.tsx (renderWithProviders)
```

The `features/` boundary contains everything domain-specific. `components/ui/*` and `lib/*` are domain-agnostic and reusable.

---

## Testing

44 tests across 8 files. Strategy: prioritize behavior over coverage.

| Suite | What it covers |
|---|---|
| `api/mockApi.test.ts` | Mock API endpoints (provided, kept) |
| `utils/filterIncidents.test.ts` | All filter combinators + AND semantics |
| `utils/sortIncidents.test.ts` | Severity rank, alphabetical, immutability |
| `schemas/incidentSchema.test.ts` | Trim, length bounds, enum validation, defaults |
| `components/IncidentForm.test.tsx` | Validation blocks submit; happy path with Radix Select; server error display; submitting state |
| `pages/IncidentListPage.test.tsx` | Loading → list render; filter by status; free-text search |
| `pages/IncidentDetailPage.test.tsx` | Detail render; optimistic status update; 404 handling |
| `hooks/useUpdateIncident.test.tsx` | Optimistic update visible in list+detail; rollback on error |

### Test infrastructure

- `src/test/setup.ts` polyfills `hasPointerCapture`, `setPointerCapture`, `releasePointerCapture`, and `scrollIntoView` on `HTMLElement.prototype` — required for Radix Select and Dialog under jsdom.
- `src/test/utils.tsx` exposes `renderWithProviders` (QueryClient + Toast.Provider + MemoryRouter) and `createTestQueryClient` (no retries, 0 staleTime).

---

## Trade-offs & limitations

### What I'd improve with more time

- **End-to-end tests** with Playwright covering full user journeys (create → list → filter → detail → update → delete).
- **`axe-core` integration tests** to catch accessibility regressions automatically.
- **Optimistic create** with a temporary client-side ID, replacing the row when the server responds.
- **Pagination / virtualization** — fine for 4 seed items, would need `react-window` past a few hundred.
- **i18n** — strings are inlined; would extract via `react-intl` or similar.
- **Real Danske font files** — currently the cascade falls through to Arial because the actual Danske font isn't bundled. Would need licensed font files (`@font-face` declarations).
- **`prefers-reduced-motion`** — Toast slide-in and Dialog scale-in animations should disable when reduced-motion is preferred.
- **Error boundary** at the route level for unexpected runtime errors.
- **Edit full incident** (title/description/severity) — out of scope per brief, but a natural next step.
- **Bulk operations** — multi-select in the list to bulk-assign or bulk-resolve.

### Conscious omissions

- **No debounce on search** — client-side filter on a small dataset is instant; debounce would only add latency.
- **No Tooltip / Popover from Radix** — no use case in this scope.
- **No global state library** — server state is owned by Query, UI state by URL params, component state by `useState`. A third store would be unjustified.
- **No commit-time hook for tests** — typecheck + lint + test run via npm scripts; CI would be the right place to enforce them.

### Known constraints from the mock API

- The mock returns 300 ms delays, so loading states are actually visible (kept on purpose).
- No real auth — the mock writes `changedBy: "current-user"` for status history entries.
- `localStorage` persistence means clearing site data resets the app.

---

## Screenshots

> _Screenshots are pending — will be added after final verification on the dev server._

```
docs/screenshots/
├── desktop-list.png
├── desktop-detail.png
├── desktop-new.png
└── mobile-list.png
```

---

## Use of tooling / AI

I used [Claude Code](https://claude.com/claude-code) (Anthropic) as a pair programmer throughout this project:

- **Architecture planning** — discussed the folder structure, state management split, and library choices before writing any code; iterated on the proposal until I was satisfied with the trade-offs.
- **Boilerplate** — scaffolded the CSS Modules, design tokens, and React Query hooks. Each piece was reviewed and adjusted.
- **Test scaffolding** — generated the initial test cases for utilities and components. I refined assertions, added the optimistic update test, and debugged jsdom incompatibilities (the `hasPointerCapture` polyfill was the main one).
- **Validation patterns** — discussed Zod vs hand-rolled validation; chose Zod for the schema demonstration value at senior level.

What I did *not* delegate: architectural decisions, type design, UX/a11y patterns, the optimistic update flow, or the design-token system. The README, the trade-off section, and every PR-ready commit message reflect my own judgment.

---

## Stack

- **Runtime:** React 18, TypeScript (strict), Vite 6
- **Routing:** React Router v6
- **Server state:** TanStack Query v5
- **Forms / validation:** Zod
- **Styling:** CSS Modules + design tokens (CSS custom properties)
- **Headless primitives:** Radix UI (Select, Dialog, Toast, Label)
- **Testing:** Vitest + React Testing Library + `@testing-library/user-event`

---

## Mock API reference

| Method | Endpoint | Notes |
|---|---|---|
| `GET` | `/api/incidents` | List |
| `GET` | `/api/incidents/:id` | Detail (404 if missing) |
| `POST` | `/api/incidents` | Create — validates `title` and `severity`, returns 400 with `{ error }` |
| `PATCH` | `/api/incidents/:id` | Update — auto-appends to `statusHistory` on status change |
| `DELETE` | `/api/incidents/:id` | 204 on success |
| `GET` | `/api/users` | Assignee list |
| `POST` | `/api/reset` | Reset to seed data |

Types live in `src/api/types.ts`.

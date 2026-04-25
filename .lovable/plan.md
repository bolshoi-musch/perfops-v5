# PerfOps Visual Prototype — Implementation Plan (Approved with Refinements)

A navigable, static visual prototype of PerfOps — a light, calm, business-like B2B SaaS platform for performance marketing operations. Strictly platform shell + reusable tool-flow mechanics. No backend, no auth, no real uploads, no database, no analytics dashboards, no chart-heavy pages, no fake KPIs, no decorative gradients.

## 1. Design tokens (src/styles.css)

Light-only working palette (oklch). Restrained accent.

- Background: very soft near-white `oklch(0.985 0.002 247)`
- Surface (secondary): `oklch(0.975 0.003 247)`
- Card: pure white
- Foreground (text): near slate-900
- Muted-foreground: calm slate
- Primary accent: calm indigo `oklch(0.48 0.14 265)` — used sparingly for primary CTAs and active nav
- Border: subtle `oklch(0.92 0.006 255)`; Border-strong for emphasis
- Radius: `0.625rem`
- Semantic state colors:
  - `--success` emerald — saved to Library, success
  - `--warning` amber — non-blocking warning
  - `--destructive` rose — blocked / terminal failure
  - `--info` sky — processing / informational

No gradients. No shadow-heavy cards. Borders + soft surfaces only.

## 2. Shared component vocabulary (src/components/perfops/*)

All built on existing shadcn/ui primitives (Button, Card, Badge, Input, etc.).

- `AppShell.tsx` — page frame with TopNav + content container
- `TopNav.tsx` — PerfOps wordmark, nav: Projects, Library, Connections, Components, Flow states; secondary Settings; quiet user chip
- `PageHeader.tsx` — title, subtitle, optional CTA group
- `ProjectContextBar.tsx` — sticky thin bar showing project + tool + step context (used on every flow page)
- `FlowPageLayout.tsx` — consistent two-column flow layout: main card + side help card; bottom CTAButtonGroup
- `FlowStepper.tsx` — horizontal numbered stepper (Source → Review → Run → Result)
- `UploadPanel.tsx` — accepts a state prop (`idle | uploading | validating | invalid | accepted`) and renders the matching variant; shows accepted types, size hint, file name, status, retry
- `SourcePicker.tsx` — three-option picker (Upload new, From Library, Connected source)
- `ExistingResourcePicker.tsx` — searchable list of Library files
- `ReviewSummary.tsx` — labeled key-value summary used on review-before-start
- `ProcessingPanel.tsx` — calm processing state with status line, "what happens next", and "where the result will appear"; indeterminate progress, no fake percentages
- `StateMessage.tsx` — unified state surface with `severity` prop: `info | success | warning | blocked | error`; renders icon + title + message + CTAs
- `ResultHandoff.tsx` — explicit result handoff card; clearly states whether result is saved in PerfOps Library; primary/secondary CTAs (Open result, Open Library, Return to project)
- `CTAButtonGroup.tsx` — consistent Back / Continue / Start / Retry / Return hierarchy
- `LibraryEntryCard.tsx` — card for a Library entry (source or result)
- `ToolCard.tsx` — card for a tool on Home / Tool selection
- `ProjectCard.tsx` — card for a project on Projects list
- `ConnectionCard.tsx` — card for a connection
- `EmptyState.tsx` — calm empty surface with icon + message + optional CTA
- `Breadcrumbs.tsx` — quiet breadcrumb trail

## 3. Static placeholder data (src/lib/perfops-data.ts)

- Tools: Dashboard Builder, Campaign Analysis, Cross Minus, BD Optimization, Semantics Generator
- Project: Spring Campaign Optimization (+ a few extras for the list page)
- Files: campaign_export.xlsx, stats_april.csv, semantic_core.xlsx
- Results: Dashboard report, Cross-minus export, BD optimization export, Semantics export
- Connections: Google Ads, Yandex Direct, Google Sheets, CSV/XLSX Upload

## 4. Routes (src/routes/*) — TanStack Start file-based routing

All pages use `AppShell`. Flow pages additionally use `ProjectContextBar` + `FlowPageLayout` + `FlowStepper` so the user always knows project, tool, step, and next action.

| # | Route | Page |
|---|---|---|
| 1 | `/` | Home / Tool selection — grid of ToolCards under "Start a tool" + recent projects strip |
| 2 | `/projects` | Projects list — searchable table/card list of ProjectCards |
| 3 | `/projects/$projectId` | Project workspace — tabs: Overview, Tools, Library, Activity |
| 4 | `/library` | Library — filter by Sources / Results, grid of LibraryEntryCards, badge showing saved state |
| 5 | `/connections` | Connections — list of ConnectionCards with statuses |
| 6 | `/tools/$toolId` | Generic tool launch page — tool header, "what this tool does", requirements, Start CTA |
| 7 | `/tools/$toolId/upload` | Upload flow page — UploadPanel with all states demonstrable via tabs |
| 8 | `/tools/$toolId/source` | Source selection / existing resource picker |
| 9 | `/tools/$toolId/review` | Review-before-start (ReviewSummary + Start CTA) |
| 10 | `/tools/$toolId/processing` | Processing page (ProcessingPanel) |
| 11 | `/tools/$toolId/warning` | Warning state page (continue allowed) |
| 12 | `/tools/$toolId/blocked` | Blocked state page (no continue) |
| 13 | `/tools/$toolId/success` | Success / result handoff (saved to Library) |
| 14 | `/tools/$toolId/degraded` | Degraded result registration state |
| 15 | `/components` | UI component library page + Design Tokens / Implementation Notes section |
| 16 | `/flow-states` | Flow States Reference — visual contract for all reusable states |

For the prototype, `$toolId` defaults to `dashboard-builder` for cross-page links, but the routes work for any of the five tools.

### Page-by-page details

**Home `/`** — `PageHeader("Start a tool", "Pick a tool to launch inside a project")` + 5 ToolCards (icon, name, short description, hosting badge) + "Recent projects" strip + quiet "Open Library / Open Connections" links. No KPIs, no charts.

**Projects `/projects`** — `PageHeader("Projects", "All performance marketing projects")` with search input + status filter chips + ProjectCard grid (name, client, status badge, owner, updated, tools used, artifacts count).

**Project workspace `/projects/$projectId`** — sticky `ProjectContextBar` ("Spring Campaign Optimization · Acme Retail · Active") + tabs:
- Overview: short summary + "Recent activity" (simple text list, no charts)
- Tools: 5 ToolCards with "Launch" CTA
- Library: scoped LibraryEntryCard grid for this project
- Activity: plain-text timeline of recent actions

**Library `/library`** — filter pills (All / Sources / Results), search, LibraryEntryCard grid. Each card clearly badges "Saved in Library" (success) or "Not saved" (warning).

**Connections `/connections`** — ConnectionCard list with status badge: Connected / Action required / Not connected.

**Tool launch `/tools/$toolId`** — tool icon + name + description, "What you'll need" requirements list, hosting note ("This tool runs inside PerfOps" / "This tool launches in a connected workspace and returns to PerfOps"), primary "Start" CTA → `/source`.

**Upload `/tools/$toolId/upload`** — `FlowStepper` step 1, UploadPanel with state tabs: idle, uploading, validating, invalid, accepted; right-side help card with accepted types and size limits.

**Source selection `/tools/$toolId/source`** — `SourcePicker` with three radio cards (Upload new file, Pick from Library, Use connected source). Picked option reveals the matching sub-panel: UploadPanel, ExistingResourcePicker, or connection picker. Continue CTA → `/review`.

**Review `/tools/$toolId/review`** — `FlowStepper` step 2, `ReviewSummary` listing tool, project, source(s), output destination ("PerfOps Library"), processing mode. Start CTA → `/processing`.

**Processing `/tools/$toolId/processing`** — `FlowStepper` step 3, `ProcessingPanel`: "Building your dashboard report" + status line ("Reading campaign_export.xlsx…") + "Result will appear in PerfOps Library when complete" + indeterminate progress (no percentage). Footer: "You can close this page — we'll keep it running."

**Warning `/tools/$toolId/warning`** — `StateMessage severity=warning`: "Continue with care" — explanation (e.g., "We detected 12 rows with missing currency. They will be skipped."), primary "Continue anyway", secondary "Replace file".

**Blocked `/tools/$toolId/blocked`** — `StateMessage severity=blocked`: "Can't continue yet" — reason ("This file is missing the required `campaign_id` column."), required fix, primary "Replace file" CTA. No continue CTA.

**Success `/tools/$toolId/success`** — `ResultHandoff` (success): "Result is ready" + "Saved in PerfOps Library" success badge + primary "Open result", secondary "Open Library", tertiary "Return to project".

**Degraded `/tools/$toolId/degraded`** — `ResultHandoff` (degraded): "Result built, but not saved in PerfOps Library yet" warning badge + "Retry registration" primary, "Download local result" secondary, "Return to project (with warning)" tertiary. UI must not look like full success.

### `/flow-states` — Flow States Reference (REFINEMENT 1)

A documentation page rendering each state with a real `StateMessage` / `UploadPanel` / `ProcessingPanel` / `ResultHandoff` example, and underneath a small spec table showing:

| state name | user-facing message | severity | primary CTA | secondary CTA | saved in PerfOps Library |

States covered:
- idle upload
- uploading
- validating
- invalid file
- accepted file
- warning
- blocked
- processing
- local result ready
- result saved in PerfOps Library
- result registration degraded
- result registration retrying
- result registration failed (terminal)

This page is the visual contract that all tools must follow.

### `/components` — Component library + Design tokens (REFINEMENT 2)

Sectioned page documenting every component in the vocabulary with a live example. Bottom section: **Design Tokens / Implementation Notes**:
- Accent color (swatch + role)
- Background / surface / card colors
- Card style (white, 1px subtle border, no heavy shadow)
- Border style (1px, subtle for default, strong for emphasis)
- Border radius scale
- Spacing rhythm (4 / 8 / 12 / 16 / 24 / 32 / 48)
- CTA hierarchy (Primary = solid accent, Secondary = outline, Tertiary = ghost link)
- State color semantics (success/warning/blocked/info)
- Notes for future React + Tailwind + shadcn/ui implementation (component naming, prop shape, file structure)

## 5. Root layout updates

- `src/routes/__root.tsx`: update meta (title "PerfOps", description). Wrap `Outlet` so flow pages render inside `AppShell` per route.
- `src/routes/index.tsx`: replace placeholder with the Home / Tool selection page.

## 6. Constraints respected (REFINEMENTS 3 & 4)

- No analytics dashboards or chart-heavy pages
- No marketing landing sections
- No fake KPI tiles
- No gradients, no neon, no hero illustrations
- Visual language stays calm, light, minimal, business-like
- All pages share the same component vocabulary (REFINEMENT 5)

## 7. File map

```
src/
  styles.css                                  (updated tokens)
  lib/perfops-data.ts                         (placeholder data)
  components/perfops/
    AppShell.tsx
    TopNav.tsx
    PageHeader.tsx
    Breadcrumbs.tsx
    ProjectContextBar.tsx
    FlowPageLayout.tsx
    FlowStepper.tsx
    UploadPanel.tsx
    SourcePicker.tsx
    ExistingResourcePicker.tsx
    ReviewSummary.tsx
    ProcessingPanel.tsx
    StateMessage.tsx
    ResultHandoff.tsx
    CTAButtonGroup.tsx
    LibraryEntryCard.tsx
    ToolCard.tsx
    ProjectCard.tsx
    ConnectionCard.tsx
    EmptyState.tsx
  routes/
    __root.tsx                                (updated meta + Outlet)
    index.tsx                                 (Home / Tool selection)
    projects.tsx                              (Projects list)
    projects.$projectId.tsx                   (Project workspace)
    library.tsx
    connections.tsx
    tools.$toolId.tsx                         (Tool launch)
    tools.$toolId.upload.tsx
    tools.$toolId.source.tsx
    tools.$toolId.review.tsx
    tools.$toolId.processing.tsx
    tools.$toolId.warning.tsx
    tools.$toolId.blocked.tsx
    tools.$toolId.success.tsx
    tools.$toolId.degraded.tsx
    flow-states.tsx
    components.tsx
```

After approval, I'll switch to default mode and build everything in one focused pass.

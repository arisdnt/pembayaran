# AI Agent Handbook

This document summarizes the conventions, workflows, and project layout that Codex (or any automation agent) should follow when working in this repository.

## Repository Overview
| Area | Summary |
| --- | --- |
| Core stack | React SPA (Vite) + Tailwind + Supabase + Dexie for offline sync |
| Desktop shell | Tauri (Rust) in `src-tauri/` |
| Assets & docs | Static assets in `public/`, documentation in `docs/` or top-level `.md` files |

## Project Structure Guardrails
- `src/`: React application source code.
  - `components/`: shared UI components.
  - `pages/`: routed screens.
  - `contexts/`: React context/state.
  - `hooks/`: Supabase and Dexie hooks.
  - `offline/`: helpers for offline sync flows.
  - `lib/`: Supabase helpers and utilities.
  - `config/`: environment-specific settings.
  - `layout/`: global layout elements (e.g., navigation).
- `src-tauri/`: Tauri shell.
  - `src/`: Rust commands.
  - `tauri.conf.json`: packaging/build config.
  - Never edit generated code under `src-tauri/gen/`.
- `public/`: base HTML and static assets.
- `docs/`: detailed guides, deployment notes, schema updates.

## Coding & Style Guidelines
- Follow ESLint rules defined in `eslint.config.js`.
- Prefer functional React components with PascalCase filenames (e.g., `DashboardHeader.jsx`).
- Prefix custom hooks with `use`.
- Use Tailwind utilities (see `index.css`, `tailwind.config.js`, `postcss.config.js` for theme tokens).
- Keep new files ASCII unless non-ASCII is already established.
- Add concise comments only for non-obvious logic.

## Development Workflow
1. Install dependencies via `npm install`.
2. Choose the appropriate dev server:
   - `npm run dev`: Tauri shell with hot reload.
   - `npm run dev:vite`: browser-only.
   - `npm run dev:tauri`: focus on native APIs.
3. Build commands:
   - `npm run build`: full production bundle.
   - `npm run build:web`: web-only bundle.
   - `npm run build:windows` / `npm run build:portable`: distributables.
4. Lint before commits with `npm run lint`; resolve all warnings.

## Testing Expectations
- No automated tests yet. Perform manual validation with `npm run dev`, covering auth flows, realtime dashboards, Dexie offline sync.
- When adding tests:
  - Use React Testing Library.
  - Colocate specs (`Component.test.jsx`).
  - Stub Supabase interactions to stay offline.

## Git & PR Hygiene
- Use imperative commit subjects (e.g., `Add dashboard realtime guard`).
- Ensure PRs:
  - Link issues.
  - Summarize UI/API changes.
  - Document Supabase migrations or new env vars.
  - Include before/after screenshots for UI updates.
  - Confirm `npm run lint` and manual smoke tests.

## Security & Configuration
- Copy `.env.example` to `.env` and keep Supabase keys private.
- Rotate credentials promptly.
- Document schema or configuration changes in `docs/` or top-level notes.

## Agent Operating Principles
- Default to safe, non-destructive commands; avoid resetting or deleting user work.
- Prefer `rg` for code search; avoid heavy commands unless necessary.
- Use `apply_patch` for targeted edits; skip for generated content.
- Validate changes when possible and report any unverified areas.
- Highlight follow-up actions (tests, lint, build) that the user may want to run.

## Ready Reference
- Active UI file: `src/layout/Navbar.jsx`.
- Writable roots: repository root (`c:\pembayaran`).
- Network access: restricted (requires approval).
- Approval mode: on-request (ask before privileged commands).


# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the React SPA: place shared UI in `components/`, routed screens in `pages/`, global state in `contexts/`, Supabase/Dexie hooks in `hooks/`, and offline sync helpers in `offline/`.
- `src-tauri/` hosts the Tauri shell; keep Rust commands under `src/`, packaging in `tauri.conf.json`, and avoid editing generated files under `src-tauri/gen/`.
- Static assets, including the base HTML, live in `public/`; docs, deployment notes, and troubleshooting guides belong in `docs/` or top-level markdown files.

## Build, Test, and Development Commands
- `npm install` installs all frontend and Tauri dependencies.
- `npm run dev` launches the desktop shell with hot reload; use `npm run dev:vite` for browser-only work or `npm run dev:tauri` to focus on native APIs.
- `npm run build` creates the production bundle; `npm run build:web` limits output to web targets, while `npm run build:windows` and `npm run build:portable` prepare distributable artifacts.
- `npm run lint` runs the shared ESLint configuration; resolve warnings before committing.

## Coding Style & Naming Conventions
- Follow the rules in `eslint.config.js`; prefer functional React components in PascalCase (e.g., `DashboardHeader.jsx`) and prefix custom hooks with `use`.
- Leverage Tailwind utilities defined in `index.css` and tune themes via `tailwind.config.js` and `postcss.config.js` when needed.
- Place Supabase helpers in `src/lib/` and environment-specific settings in `src/config/` for consistency.

## Testing Guidelines
- No automated suite exists yet; validate flows manually via `npm run dev` against a Supabase project, covering auth, realtime dashboards, and Dexie offline sync.
- When adding tests, use React Testing Library with Dexie mocks, colocate specs as `Component.test.jsx`, and stub Supabase calls to avoid network access.

## Commit & Pull Request Guidelines
- Write imperative commit subjects (e.g., `Add dashboard realtime guard`); existing history contains timestamped subjects but new commits should be descriptive.
- PRs should link issues, summarize UI/API changes, note Supabase migrations or new env vars, and include before/after screenshots for UI updates.
- Run `npm run lint` and complete a manual smoke test before requesting review; document any known gaps.

## Security & Configuration Tips
- Copy `.env.example` to `.env`, keep Supabase keys private, and rotate credentials promptly.
- Record schema changes inside `docs/` or a migration note so other contributors can stay in sync.

# Repository Story: ReactSparkPortfolio

> Generated 2026-04-05 | Window: 18 months | Scope: full

---

## Executive Summary

ReactSparkPortfolio is a production-grade developer portfolio and reference implementation built on React 19, TypeScript, and Vite. It demonstrates modern frontend engineering — real-time chat via SignalR, live weather data, a dynamic articles feed from RSS, and a searchable projects showcase — all deployed simultaneously to Azure Static Web Apps and GitHub Pages from a single `/docs` build output. The project is as much a technical demonstration as it is a personal brand.

Over the 18 months from its initial commit on 2024-10-11 through the most recent activity on 2026-03-30, the repository accumulated **371 commits** from what is effectively a **solo-developer operation**: Mark Hazleton (using three email aliases) accounts for 94.3% of all commits, with Dependabot contributing the remaining 6.5% through automated security updates. This is a one-person show executed with enterprise discipline.

Development has arrived in three distinct surges. The **October 2024 launch burst** (118 commits in a single month) established the project from scratch at high velocity. A **Spring 2025 expansion** (98 commits in April alone) built out the full feature set — chat, weather, articles, theme switching. The **March 2026 wave** (53 commits) introduced DevSpark governance tooling, dependency remediation, and documentation cleanup. Between these surges, cadence drops to single-digit monthly counts — a pattern consistent with a developer maintaining a side project around other commitments.

The project has no tagged releases. All delivery is continuous, with changes pushed directly to `main` and deployed automatically via GitHub Actions. Governance posture is otherwise solid: Dependabot is active and has merged 26 dependency bump PRs, the Constitution (v1.1.1) defines non-negotiable coding standards, and the documentation surface has been actively audited and pruned. The most significant open gap — and one the constitution itself calls out — is the **absence of automated tests**: zero test files exist against 20 source components and 3 services.

---

## Technical Analysis

### Development Velocity

Commit volume across 15 active months (note: several months show no activity):

| Month | Commits | Notes |
|-------|---------|-------|
| 2024-10 | **118** | Project launch — scaffolding, initial components, CI setup |
| 2024-11 | 4 | Stabilization |
| 2024-12 | 27 | Holiday feature push |
| 2025-01 | 5 | Steady state |
| 2025-03 | 4 | Minor work |
| 2025-04 | **98** | Major feature expansion (chat, weather, RSS, themes) |
| 2025-05 | 6 | Cool-down |
| 2025-07 | 8 | Summer work |
| 2025-08 | 2 | Minimal |
| 2025-09 | 18 | Autumn push |
| 2025-10 | 12 | Continued |
| 2025-11 | 6 | Light |
| 2025-12 | 4 | Light |
| 2026-01 | 6 | New year |
| 2026-03 | **53** | DevSpark adoption, dependency remediation, documentation overhaul |

Total: **371 commits over ~18 months** = ~20.6 commits/month average, but the median active-month count is ~8. The three burst months (Oct 2024, Apr 2025, Mar 2026) account for **269 of 371 commits (72.5%)** — this repository evolves in deliberate, concentrated sprints rather than a continuous trickle.

The commit log includes the build artifact `docs/index.html` (modified 166 times) and `tsconfig.tsbuildinfo` (modified 109 times), both committed alongside source changes rather than gitignored. While common in single-developer workflows, this inflates commit volume metrics slightly. The `package-lock.json` (120 changes) reflects active dependency management.

### Contributor Dynamics

| Contributor Role | Commits | Share |
|---|---|---|
| Lead Architect (Mark Hazleton) | ~347 (3 aliases) | 93.5% |
| Dependabot (automated) | 24 | 6.5% |

**Bus factor: 1.** Every architectural decision, every component, every configuration choice traces back to a single developer. This is appropriate for a personal portfolio project, but any organizational adoption of this codebase would require deliberate knowledge transfer. The Dependabot automation is a meaningful offset — security patches arrive without manual intervention.

The three email aliases (`mark@markhazleton.com`, `mark.hazleton@controlorigins.com`, `markhazleton@users.noreply.github.com`) represent the same individual working across personal, professional, and GitHub web-editor contexts. No team growth or contraction is evident; this has been a solo project throughout.

### Quality Signals

| Signal | Value | Assessment |
|---|---|---|
| Test files | **0** (only `src/test/setup.ts`) | Critical gap |
| Source components | 20 in `src/components/` | Significant surface area |
| Services | 3 in `src/services/` | API, chat, utility |
| Conventional commit adoption | 63 / 370 = **17%** | Low; inconsistent |
| Avg commit quality | Mixed | See below |
| Dependabot PR merges | 26 | Good security hygiene |

The **test coverage gap is the most significant quality risk** in this repository. The constitution explicitly flags this: "Current codebase has 0 test files — this is the highest priority gap." With 20 components and 3 services, any refactoring or dependency update could silently introduce regressions. The `src/test/setup.ts` file confirms the Vitest infrastructure exists and is configured — the tooling is ready, the tests are not.

Conventional commit adoption at 17% is low. Of 370 commits, 63 use prefixes (`feat:`, `fix:`, `chore:`, `docs:`, etc.). The remainder use freeform messages of varying quality. Notable low-quality signals in recent history: two commits with the message "Implement feature X to enhance user experience and fix bug Y in module Z" (a clear placeholder) and five near-duplicate commits adding the same SVG icon components across consecutive days. These suggest occasional copy-paste commit workflows rather than intentional commit composition.

### Governance & Process Maturity

| Signal | Value |
|---|---|
| Merge commits | 2 / 370 = 0.5% |
| Direct pushes to main | ~98% of commits |
| Tagged releases | **0** |
| CI/CD | GitHub Actions (Azure SWA deploy) |
| Constitution | v1.1.1, ratified 2026-03-01 |
| Pre-commit hooks | Husky + lint-staged (configured) |

The near-absence of merge commits (2 total) confirms a **direct-push-to-main workflow** — no formal PR review cycle exists for this solo project, which is rational for a personal portfolio but would need to change before any team involvement. GitHub Actions handles deployment automatically on every push, providing a deployment gate without manual intervention.

The absence of any version tags is notable. The `.documentation/CHANGELOG.md` references `[2.0.0] - 2025-01-05` as a release, but no corresponding git tag exists. This means `git tag --list` returns empty, and release history is maintained only in documentation. The constitution's amendment process and versioning scheme are well-defined and followed (the constitution itself has versions), but the application code itself has never been formally tagged.

The March 2026 DevSpark adoption represents a meaningful governance upgrade: structured commands for specifications, planning, task tracking, harvesting, and archiving now exist and have been used. The constitution and `.documentation/` surface were both actively curated in this period.

### Architecture & Technology

**Tech Stack:**

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Language | TypeScript (strict mode) |
| Build Tool | Vite 7.0 |
| Styling | Bootstrap 5 + custom SCSS |
| Real-time | @microsoft/signalr |
| HTTP Client | axios |
| Data Validation | Zod |
| Maps | Leaflet (via react-leaflet) |
| Markdown | react-markdown |
| Dates | date-fns |
| Testing | Vitest (configured, no tests written) |
| CI/CD | GitHub Actions → Azure Static Web Apps |
| Secondary deploy | GitHub Pages (from `/docs` on `main`) |

**Directory structure** reveals a well-organized architecture:
- `src/components/` (20 files) — UI components
- `src/services/` (3 files) — API, RSS, and chat service layer
- `src/contexts/` — ThemeContext, SEOContext for global state
- `src/hooks/` — custom React hooks
- `src/models/` — TypeScript interfaces and Zod schemas
- `src/utils/` — pure utility functions (imageUtils, version)
- `src/scss/` — SCSS source with variables and component styles
- `src/config/` — configuration constants

The `vite.config.ts` with 63 modifications is the most-iterated source configuration file, reflecting active tuning of build behavior (CSP headers, plugin configuration, production console stripping, `__BUILD_DATE__` injection).

---

## Change Patterns

**Top 5 most-modified source files** (excluding build artifacts `docs/index.html`, `tsconfig.tsbuildinfo`, lock files):

| File | Changes | Signal |
|---|---|---|
| `vite.config.ts` | 63 | Active build configuration tuning — CSP, plugins, define |
| `src/components/About.tsx` | 47 | Content-heavy personal profile; frequently updated |
| `src/css/styles.css` | 45 | Global CSS evolving (now transitioning to SCSS) |
| `src/components/Chat.tsx` | 36 | Complex real-time feature; significant iteration |
| `src/App.tsx` | 34 | Routing and layout changes as features are added |

**Interpretation:**

- `vite.config.ts` as the top source file indicates **build system complexity** — CSP synchronization, plugin management, and environment configuration require ongoing attention. Any new developer should understand this file deeply before modifying headers or build behavior.
- `About.tsx` is the most-changed component because it contains the author's biographical content — this is expected for a portfolio.
- `styles.css` and its `.map` file appear together (45+43 changes) because CSS map files are committed alongside compiled CSS. The constitution and recent SASS improvements suggest a migration toward SCSS source-of-truth.
- `Chat.tsx` (36 changes) is the most-iterated **feature component**, reflecting the technical complexity of SignalR integration with multiple AI personalities and connection state management.
- The `docs/` directory (containing build output) appears in hotspots because artifacts are committed. Per the constitution, `npm run clean` should precede every build, but the commit history suggests build output is regularly committed alongside code.

**Directory-level pattern**: ~65% of substantive source changes are concentrated in `src/components/` — this is where active development lives. `src/services/` and `src/utils/` are comparatively stable, suggesting the service layer is mature and the component layer continues to evolve.

---

## Milestone Timeline

No git tags exist in this repository. The table below reconstructs milestones from commit history and documentation:

| Date | Event | Evidence |
|------|-------|----------|
| 2024-10-11 | Project initialized | First commit: "Initial commit" |
| 2024-10 | Launch sprint (118 commits) | Component scaffolding, CI, deployment |
| 2025-01-05 | v2.0.0 (documented) | `.documentation/CHANGELOG.md` entry; no git tag |
| 2025-04 | Feature expansion sprint (98 commits) | Chat, weather, RSS, themes |
| 2026-03-01 | Constitution v1.1.1 ratified | Governance formalization |
| 2026-03 | DevSpark adoption (53 commits) | Tooling, dependency remediation, archive cleanup |
| 2026-03-30 | Most recent commit | "feat: add repository story and history documentation" |

**Recommendation**: Tag the current HEAD as `v2.0.0` (or current version) to establish a verifiable baseline. Future releases should be tagged at deployment so `git log v2.0.0..HEAD` can show what changed since the last release.

---

## Constitution Alignment

Constitution v1.1.1 (ratified 2026-03-01, last amended 2026-04-05) defines 10 mandatory principles. Assessment against commit history:

| Principle | Status | Evidence |
|---|---|---|
| I. Type Safety | ✅ Strong | TypeScript strict mode enforced; `tsconfig.tsbuildinfo` in every build |
| II. Code Quality & Linting | ✅ Good | ESLint configured; lint-staged in pre-commit hooks |
| III. Testing | ❌ Critical gap | 0 test files; constitution itself flags this as "highest priority" |
| IV. Documentation | ✅ Improved | Active doc cleanup in Mar 2026; `Guide.md` and archive runs |
| V. Component Architecture | ✅ Strong | Clear `components/services/contexts/hooks/utils/models` separation maintained |
| VI. Error Handling | ✅ Good | Try-catch throughout services; ProjectService fallback strategy documented |
| VII. Logging | ✅ Configured | `@rollup/plugin-strip` configured in `vite.config.ts` |
| VIII. Security | ✅ Active | CSP configured; Dependabot active; Zod validation in models |
| IX. Styling | ✅ Strong | Bootstrap 5 + SCSS; theme switching; mobile-first breakpoints |
| X. Quality Gates | ⚠️ Partial | Pre-commit hooks configured; CI runs build; no test coverage gate |

**Strongest alignment**: Component architecture and type safety. The project structure has been consistent since inception, and TypeScript adoption is thorough.

**Biggest gap**: Testing (Principle III). The constitution mandates 80% function and branch coverage, pre-merge test runs, and CI coverage reports. None of these exist today. The `src/test/setup.ts` file confirms the infrastructure is ready — writing the actual tests is the highest-leverage improvement available.

**Secondary gap**: Conventional commit discipline (Principle IV/X). At 17% adoption, commit history is harder to scan and changelog automation is impossible. The placeholder commits ("Implement feature X...") are a concrete violation of the constitution's "no TODO/FIXME in code" spirit applied to commit messages.

---

## Developer FAQ

### What does this project do?

ReactSparkPortfolio is a personal developer portfolio and technical reference implementation for Mark Hazleton. It showcases real-time features (SignalR chat with AI personalities), live weather data with interactive maps, a dynamic blog feed from RSS sources, and a searchable projects showcase — all served as a static SPA deployed to both Azure Static Web Apps (`reactspark.makeboldspark.com`) and GitHub Pages.

### What tech stack does it use?

React 19 + TypeScript (strict mode) + Vite 7.0 for the build. Bootstrap 5 + custom SCSS for styling. SignalR (`@microsoft/signalr`) for real-time chat. Axios for HTTP, Zod for runtime schema validation, Leaflet for maps, date-fns for date handling, and react-markdown for content rendering. CI/CD via GitHub Actions deploying to Azure Static Web Apps.

### Where do I start?

Read [`.documentation/memory/constitution.md`](.documentation/memory/constitution.md) first — it defines non-negotiable project principles. Then read [`README.md`](README.md) for overview and [`vite.config.ts`](vite.config.ts) (63 modifications — the most-iterated source config). Entry-point rendering is `src/main.tsx` → `src/App.tsx`. Routes map to lazy-loaded components in `src/components/`.

### How do I run it locally?

```bash
npm install
npm run dev        # Vite dev server at http://localhost:5173
npm run build      # Production build → /docs
npm run clean      # Remove /docs before rebuilding
```

The CSP configuration in `vite.config.ts` must be synchronized with `staticwebapp.config.json` for production behaviour. Do not modify CSP headers without reading `.documentation/SECURITY.md`.

### How do I run the tests?

The Vitest framework is configured (`src/test/setup.ts` exists) but **no test files have been written yet**. Run `npm test` once tests exist. The constitution requires 80% function/branch coverage before merge. Writing tests for `src/utils/imageUtils.ts`, `src/utils/version.ts`, and the three service files is the recommended starting point (highest ROI, lowest complexity).

### What is the branching/PR workflow?

There is currently no formal PR review workflow — commits go directly to `main`. With 0.5% merge commits (2 total), this is effectively a trunk-based solo development model. The constitution and Husky pre-commit hooks enforce ESLint, Prettier, and TypeScript checks before each commit. Any team adoption would require formalizing a PR-based workflow.

### Who do I ask when I'm stuck?

Mark Hazleton authored 94.3% of commits across three email aliases. GitHub Issues is the supported contact channel. All major architectural decisions are documented in [`.documentation/ARCHITECTURE.md`](.documentation/ARCHITECTURE.md) and [`.documentation/memory/constitution.md`](.documentation/memory/constitution.md).

### What areas of the code change most often?

The top source-code hotspots are `vite.config.ts` (63 changes — build and CSP configuration), `src/components/About.tsx` (47 — personal content), `src/css/styles.css` (45 — global styling), `src/components/Chat.tsx` (36 — real-time SignalR feature), and `src/App.tsx` (34 — routing). Expect the `src/components/` directory to be the most active development surface.

### Are there coding standards I must follow?

Yes — the constitution at [`.documentation/memory/constitution.md`](.documentation/memory/constitution.md) is authoritative. Mandatory: TypeScript strict mode, ESLint passing, JSDoc on all exports, no `TODO`/`FIXME` in code (use GitHub Issues), no root-level `.md` files except `README.md`, conventional commit prefixes (`feat:`, `fix:`, `chore:`, etc.). Pre-commit hooks enforce linting and type-checking automatically.

### What version is currently released?

No git tags exist. The documented release is **v2.0.0 (2025-01-05)** per `.documentation/CHANGELOG.md`, covering the React 19 + Vite 7 + TypeScript 5.9 upgrade. The most recent commit (2026-03-30) adds DevSpark governance tooling but no version bump has been tagged in git.

---

*Generated by /devspark.repo-story | DevSpark v0.1.1 — Adaptive System Life Cycle Development*

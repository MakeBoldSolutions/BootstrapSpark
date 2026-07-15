# Repository Story: ReactSparkPortfolio

> Generated 2026-04-06 | Window: 12 months | Scope: full

---

## Executive Summary

ReactSparkPortfolio is a production-ready developer portfolio and reference implementation built in React 19, TypeScript, and Vite. It serves a dual purpose: a personal showcase for Mark Hazleton's professional work, and a living demonstration of enterprise frontend engineering patterns — real-time chat via SignalR, live weather data, dynamic RSS feeds, and a searchable projects gallery. The application deploys to both Azure Static Web Apps and GitHub Pages from a single `/docs` build folder, demonstrating a cloud-native, multi-target deployment strategy.

The project has accumulated 222 commits across roughly 18 months, from October 2024 through April 2026. With 177 commits attributed to "Mark Hazleton" and 30 to "markhazleton" (the same developer under a different git configuration), this is effectively a solo-engineered repository — every architectural decision, feature delivery, and governance initiative traces back to a single author, with 15 automated dependency updates from Dependabot providing the only external contribution.

Velocity has followed a burst-and-consolidate pattern. The project launched explosively in October 2024 (87 commits), leveled off through early 2025, surged again in April 2025 (49 commits — its largest sprint month), and most recently picked up momentum in March 2026 (23 commits). The March 2026 burst coincides with a documented constitution-compliance drive, pushing from 42% to 100% alignment with the project's governance principles. April 2026 activity is just beginning (2 commits as of this report).

Governance posture is early-stage but intentional. Conventional commit adoption sits at 23% — a minority, but a growing one. The project has no versioned release tags, though a formal constitution was ratified on 2026-03-01 and amended as recently as 2026-04-05. The absence of tags is the most visible governance gap; the presence of a written constitution is an unusually mature signal for a solo portfolio project. Dependabot is active and merging security patches promptly, which is a strong security hygiene indicator.

Delivery evidence is strong at the feature level: 46 commits classified as feature additions and 16 as bug fixes. Eighty distinct source and test files are tracked under TypeScript strict mode, and an 8-file test suite has been established — a meaningful improvement over the "0 test files" noted in the constitution's own rationale section. The project is healthy, actively maintained, and clearly on a maturity arc.

---

## Technical Analysis

### Development Velocity

**Monthly commit timeline (all-time):**

| Month    | Commits | Signal                                   |
|----------|---------|------------------------------------------|
| 2024-10  | 87      | Launch sprint — project established      |
| 2024-11  | 3       | Cool-down                                |
| 2024-12  | 20      | Year-end iteration                       |
| 2025-01  | 4       | Quiet January                            |
| 2025-03  | 2       | Minimal activity                         |
| 2025-04  | 49      | Major feature sprint                     |
| 2025-05  | 3       | Sprint recovery                          |
| 2025-07  | 5       | Summer maintenance                       |
| 2025-08  | 1       | Single commit month                      |
| 2025-09  | 9       | Resumed iteration                        |
| 2025-10  | 6       | Steady                                   |
| 2025-11  | 3       | Light maintenance                        |
| 2025-12  | 2       | Holiday wind-down                        |
| 2026-01  | 3       | Slow restart                             |
| 2026-03  | 23      | Constitution compliance drive            |
| 2026-04  | 2       | Current month (in progress)              |

Two development peaks dominate: the October 2024 launch (87 commits) and the April 2025 feature sprint (49 commits). Between these peaks and the March 2026 governance push, commits average roughly 4–6 per month — consistent maintenance rather than active feature development.

**Volume metrics** (estimated from hotspot change counts):
- The top 10 files account for approximately 480 tracked changes combined
- `docs/index.html` leads at 96 changes, reflecting frequent build artifact regeneration
- `package-lock.json` (71) and `package.json` (65) signal active dependency management
- Source component files average 15–26 changes each, indicating iterative UI development

**Churn interpretation**: The high change counts on build artifacts (`docs/index.html`, `tsconfig.tsbuildinfo`) are expected in a project that commits built output to the repository for GitHub Pages deployment. Excluding these infrastructure files, core source churn is moderate — consistent with a maturing codebase rather than a volatile rewrite cycle.

---

### Contributor Dynamics

**Contributor census (anonymized):**

| Role            | Commits | % of Total |
|-----------------|---------|------------|
| Lead Architect  | 207     | 93%        |
| Automated Bot   | 15      | 7%         |

*(Note: "Mark Hazleton" and "markhazleton" are the same contributor under two git identity configurations, combined here as Lead Architect.)*

**Bus factor: 1.** Every design decision, implementation choice, and governance initiative originates from a single contributor. This is appropriate for a personal portfolio project, but anyone seeking to contribute faces a steep context ramp. The constitution, architecture documentation, and extensive README partially mitigate this risk by codifying the implicit knowledge that typically lives only in the lead developer's head.

**Team evolution**: No growth. This has been and remains a solo project augmented by automated dependency management. The Dependabot integration (15 commits) represents the only external "contributor" activity.

---

### Quality Signals

**Test coverage:**
- Test files detected: **8** (`tests/unit/` directory)
- TypeScript/TSX source files (non-test): **~40**
- Test-to-source ratio: **~20%**
- Services covered by tests: JokeService, ProjectService, RssService, ErrorBoundary component, imageUtils, version utils, Project model

This is meaningful progress. The constitution's own rationale acknowledged "0 test files" as the highest priority gap. The current 8-file test suite covers the most critical service and utility layer, though the 20% ratio falls short of the constitution's 80% function coverage target for CI enforcement.

**Commit message quality:**
- Total commit subjects analyzed: **222**
- Conventional commit format (contains `:` in first 20 chars): **~23%**
- Most common prefix patterns: `feat:`, `fix:`, `docs:`, `chore:`
- 57% of commits fall in the "other" category — narrative-style or imperative messages without a prefix

**Subject type distribution:**
| Type       | Count | % |
|------------|-------|---|
| Features   | 46    | 21% |
| Chore/deps | 15    | 7%  |
| Fixes      | 16    | 7%  |
| Docs       | 14    | 6%  |
| CI/Build   | 2     | 1%  |
| Refactor   | 3     | 1%  |
| Other      | 126   | 57% |

The 23% conventional commit adoption is growing but inconsistent. The March 2026 commits show higher adherence (`docs: harvest, archive, and repo story for 2026-04-05`, `feat: Add constitution compliance feature specification`), suggesting active discipline improvement.

---

### Governance & Process Maturity

**Merge commit percentage**: 1 tracked merge commit in the visible history — effectively a direct-to-main workflow for the majority of development. This is consistent with solo development, where feature branches are short-lived or non-existent.

**Tag discipline**: **0 release tags**. The absence of version tags is the single most significant governance gap. With no milestones in git history, there is no external evidence of when features shipped or what constitutes a "release." The project is functionally deployed and running in production (`reactspark.makeboldspark.com`) but lacks any semver trail.

**Branch strategy**: Minimal. One documented feature branch merge is visible (`feat/dependabot-documentation → main`), plus one PR merge (`feat: Constitution Compliance Implementation (#29)`). The `#29` PR reference indicates GitHub pull request workflow is used selectively — likely for major features rather than routine commits.

**Constitution maturity**: The written constitution (v1.1.1, ratified 2026-03-01, last amended 2026-04-05) is an unusually sophisticated governance artifact for a solo project. Its 10 mandatory principles — covering type safety, linting, testing, documentation, component architecture, error handling, logging, security, styling, and quality gates — align the codebase with enterprise standards. The March 2026 compliance push (42% → 100% self-reported) and the active amendment process demonstrate genuine governance commitment.

---

### Architecture & Technology

**Language stack** (confirmed from repository):
- **TypeScript** (primary) — strict mode, `.ts` and `.tsx` files throughout
- **JavaScript** — present (build scripts, config files)
- **Markdown** — extensive documentation
- **Shell/PowerShell** — DevSpark automation scripts

**Key frameworks and dependencies:**
- React 19.1 with concurrent features
- Vite 7.0 (build) + React Router 7.7 (routing)
- Bootstrap 5.3 + SCSS + React Bootstrap (UI)
- SignalR (real-time chat), Axios (HTTP), xml2js (RSS parsing)
- Leaflet (maps), date-fns, Zod (validation)
- Vitest (testing), ESLint 9.x + TypeScript ESLint (linting)
- Husky + lint-staged (pre-commit hooks)

**Infrastructure configuration:**
- `package.json` ✅ — comprehensive script set (dev, build, test, lint, format, SEO)
- `.github/workflows/` ✅ — GitHub Actions CI/CD for Azure Static Web Apps
- `staticwebapp.config.json` ✅ — Azure SWA routing and CSP headers
- `vite.config.ts` ✅ — build configuration, dev server, plugin strip for production console removal
- `eslint.config.js` ✅ — ESLint flat config with TypeScript and React plugins
- No Dockerfile — serverless deployment model, not containerized

**Component architecture** (from `src/` structure):
- `/components` — React UI components (About, Articles, Chat, Header, Hero, Projects, WeatherForecast, etc.)
- `/services` — API and data layer (JokeService, ProjectService, RssService)
- `/contexts` — Global state (ThemeContext, SEOContext)
- `/hooks` — Custom React hooks
- `/utils` — Pure utilities (imageUtils, version)
- `/models` — TypeScript interfaces and data models

This structure matches the constitution's Component Architecture principle exactly.

---

## Change Patterns

**Top 10 most-modified files:**

| Rank | File                      | Changes | Interpretation                                          |
|------|---------------------------|---------|----------------------------------------------------------|
| 1    | `docs/index.html`         | 96      | Build artifact — regenerated on every build/deploy       |
| 2    | `package-lock.json`       | 71      | Active dependency management + Dependabot updates        |
| 3    | `package.json`            | 65      | Dependency additions and script evolution                |
| 4    | `tsconfig.tsbuildinfo`    | 63      | TypeScript incremental build cache — not meaningful      |
| 5    | `index.html`              | 44      | HTML entry point — SEO meta, script injection            |
| 6    | `vite.config.ts`          | 36      | Active build configuration tuning                        |
| 7    | `src/components/About.tsx`| 26      | Highest-churn component — personal bio content updates   |
| 8    | `src/css/styles.css`      | 24      | Compiled CSS output — reflects SCSS changes              |
| 9    | `src/css/styles.css.map`  | 23      | Source map companion to styles.css                       |
| 10   | `README.md`               | 23      | Actively maintained documentation                        |

**Directory-level patterns:**
- `docs/` — build artifacts committed for GitHub Pages deployment (expected high churn)
- `src/components/` — the active development zone; About, Header, Chat, Joke, Articles, Hero each show 15–26 changes
- `src/css/` — compiled outputs tracking SCSS source changes (not a concern)
- Root config files (`vite.config.ts`, `package.json`) — moderate churn indicating ongoing infrastructure tuning

**Potential hotspots for refactoring:**
- `src/components/About.tsx` (26 changes) — highest source-code churn; may benefit from content extraction to a data file to separate structure from content
- `vite.config.ts` (36 changes) — frequent build config changes suggest the configuration is complex and potentially brittle; consider documenting configuration decisions inline

**Observation**: Excluding build artifacts, ~80% of meaningful changes occur in `src/`, consistent with an active feature development zone. The remaining 20% splits between config files and documentation, both of which are appropriately maintained.

---

## Milestone Timeline

No git tags exist in this repository. The following events serve as de facto milestones, reconstructed from commit history:

| Date       | Event                                               | Commit Signal                                        |
|------------|-----------------------------------------------------|------------------------------------------------------|
| 2024-10    | Project launch                                      | 87-commit burst; project established                 |
| 2025-04    | Major feature sprint                                | 49 commits; largest single month outside launch      |
| 2026-03-01 | Constitution v1.1.0 ratified                        | `feat: Constitution Compliance Implementation (#29)` |
| 2026-03-07 | Icon component additions (InfoCircle, Profile, Search)| Multiple commits adding SVG components              |
| 2026-04-05 | Harvest, archive, and repo story cycle              | `docs: harvest, archive, and repo story for 2026-04-05`|
| 2026-04-05 | Constitution v1.1.1 amended                         | Last amendment timestamp in constitution.md          |

**Recommendation**: Introduce semantic version tags (e.g., `v1.0.0`) at meaningful delivery points. Even for a solo portfolio, tags create a navigable history, enable changelog generation, and provide deployment traceability.

---

## Constitution Alignment

The constitution (v1.1.1) defines 10 mandatory principles. This section maps observed git signals to each principle:

| Principle                          | Status    | Evidence                                                                                   |
|------------------------------------|-----------|--------------------------------------------------------------------------------------------|
| I. Type Safety (TypeScript strict) | ✅ Strong  | TypeScript throughout; `tsconfig.tsbuildinfo` in hotspots confirms active TS compilation  |
| II. Code Quality & Linting         | ✅ Strong  | ESLint 9.x configured; `npm run lint` script present; pre-commit hooks via Husky           |
| III. Testing (80% coverage target) | ⚠️ Partial | 8 test files exist (up from 0); coverage thresholds not yet enforced in CI per constitution|
| IV. Documentation                  | ✅ Strong  | README (23 changes), constitution, repo-story, harvest cycle all active; "less is more" philosophy being applied |
| V. Component Architecture          | ✅ Strong  | `src/components/`, `/services`, `/contexts`, `/hooks`, `/utils`, `/models` all present     |
| VI. Error Handling & Resilience    | ✅ Strong  | `ErrorBoundary.test.tsx` exists; constitution cites ProjectService fallback as exemplar    |
| VII. Logging & Observability       | ✅ Strong  | `@rollup/plugin-strip` configured in vite.config.ts for production console removal        |
| VIII. Security & Input Validation  | ✅ Strong  | CSP headers, Zod validation, Dependabot active; 15 security-patch commits visible         |
| IX. Styling Standards              | ✅ Strong  | Bootstrap 5 + SCSS + ThemeContext all present; dark/light mode documented                  |
| X. Quality Gates (Husky + CI)      | ⚠️ Partial | Husky + lint-staged configured; CI runs lint/build but test coverage enforcement is pending|

**Areas of strong alignment**: Security posture, component architecture, documentation discipline, and build tooling all reflect constitution principles directly in the commit history.

**Gaps to address**:
1. **Testing coverage enforcement** (Principle III) — 8 test files exist but the 80%/70%/80% CI coverage gates are not yet enforced. The next quality gate milestone should wire `vitest --coverage` thresholds into the CI workflow.
2. **Release tagging** (Governance) — No semver tags. One commit per meaningful release would unlock changelog automation and align with the constitution's versioning section.
3. **Conventional commit adoption** (Principle IV / Governance) — 23% adoption. A lint-commit hook (e.g., `commitlint`) would raise this without requiring manual discipline.

---

## Developer FAQ

### What does this project do?

ReactSparkPortfolio is a personal developer portfolio and reference implementation that showcases enterprise React engineering patterns. It displays Mark Hazleton's projects (pulled from markhazleton.com), a real-time SignalR chat widget, live weather data with Leaflet maps, dynamic RSS blog feeds, and a random jokes integration. It deploys simultaneously to Azure Static Web Apps (`reactspark.makeboldspark.com`) and GitHub Pages from the same `/docs` build folder.

### What tech stack does it use?

The primary stack is React 19.1 + TypeScript 5.9 (strict mode) built with Vite 7.0. Routing uses React Router 7.7. Styling is Bootstrap 5.3 + SCSS with dark/light theme switching via React Context. Data fetching uses Axios; real-time communication uses SignalR 9.0. RSS feeds are parsed with xml2js. Maps use Leaflet 1.9. Testing uses Vitest. Linting uses ESLint 9.x with TypeScript and React plugins. Pre-commit hooks are managed by Husky + lint-staged.

### Where do I start?

Begin with [src/App.tsx](src/App.tsx) — it wires together routing, context providers, and the top-level component tree. The highest-churn source component is [src/components/About.tsx](src/components/About.tsx) (26 recorded changes), which serves as a good example of the codebase's patterns. The [src/services/](src/services/) directory contains the data layer — start with `ProjectService.ts`, which the constitution cites as the JSDoc and fallback-strategy exemplar.

### How do I run it locally?

```bash
git clone https://github.com/markhazleton/ReactSparkPortfolio.git
cd ReactSparkPortfolio
npm install
npm run dev
# Open http://localhost:3000
```

The `npm run dev` script starts Vite's dev server with HMR and concurrently runs the SCSS watcher. No environment file is strictly required for the core UI — external APIs are proxied through the WebSpark backend at markhazleton.com.

### How do I run the tests?

```bash
npm test                  # Run all tests with Vitest
npm run test:coverage     # Run with coverage report
npm run test:ui           # Interactive Vitest UI
```

Test files live in [tests/unit/](tests/unit/) organized by type: `components/`, `services/`, `utils/`, `models/`. The test framework is Vitest. Eight test files currently cover ErrorBoundary, JokeService, ProjectService, RssService, imageUtils, version, and the Project model.

### What is the branching/PR workflow?

Primarily direct-to-main for routine work. Feature branches are used for significant changes — one documented example is `feat/dependabot-documentation`, merged via PR #29 (`feat: Constitution Compliance Implementation`). The GitHub Actions CI workflow triggers on both push and pull requests to `main`. For new contributors, the standard fork → feature branch → PR → CI green → merge workflow applies.

### Who do I ask when I'm stuck?

This is a solo project. The Lead Architect (Mark Hazleton) is the single point of contact. File a [GitHub Issue](https://github.com/markhazleton/ReactSparkPortfolio/issues) for bugs or questions. The [.documentation/](.documentation/) directory and the [constitution](.documentation/memory/constitution.md) contain the codified reasoning behind most architectural decisions — check there first before asking.

### What areas of the code change most often?

Excluding build artifacts, the highest-churn source areas are:
1. `src/components/About.tsx` — 26 changes (content and layout updates)
2. `src/App.tsx` — 21 changes (routing and context wiring)
3. `src/components/Header.tsx` — 20 changes (navigation and theme toggle)
4. `src/components/Chat.tsx` — 20 changes (SignalR integration evolution)
5. `vite.config.ts` — 36 changes (build configuration)

Expect any work touching these files to require careful review of recent commit history.

### Are there coding standards I must follow?

Yes — and they are formally documented. Read [.documentation/memory/constitution.md](.documentation/memory/constitution.md) before writing any code. Key mandatory rules: TypeScript strict mode always on; no `any` without a justification comment; all new features need tests; no `// TODO:` or `// FIXME:` in code (open a GitHub Issue instead); only `README.md` at the repository root (all other `.md` files belong in `.documentation/`). Pre-commit hooks run ESLint, Prettier, and TypeScript type-checking automatically on staged files.

### What version is currently released?

There are no semantic version tags in this repository. The most recent commit is `2026-04-05: docs: harvest, archive, and repo story for 2026-04-05`. The production deployment at `reactspark.makeboldspark.com` reflects whatever was last pushed to `main`. Build version tracking is handled via `__BUILD_DATE__` injection in `vite.config.ts` rather than semver tags.

---

*Generated by /devspark.repo-story | DevSpark v0.1.1 — Adaptive System Life Cycle Development*

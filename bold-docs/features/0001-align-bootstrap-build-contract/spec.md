---
id: 0001-align-bootstrap-build-contract
tier: Feature
status: complete
requested: 2026-08-17
ratified: 2026-08-17
override: none
---

# Align BootstrapSpark Build Contract

**Status**: Complete
**Tier**: Feature

## Product Owner TL;DR

BootstrapSpark and TailwindSpark are companion demonstration sites. Their build systems should present the same contributor and deployment contract wherever the technology choice does not require a difference, so comparisons between the two sites highlight Bootstrap versus Tailwind rather than accidental repository drift.

## Intent

Update BootstrapSpark's build system and build documentation to better align with the TailwindSpark build-system document while preserving BootstrapSpark-specific decisions:

- Bootstrap 5 plus SCSS remains the styling system.
- The repository may remain a single Vite application unless a monorepo layout is intentionally adopted.
- ESLint remains the linting tool unless the Bold backbone is amended.
- The deployment output remains `docs/` unless the deployment strategy is intentionally redesigned.
- Azure Static Web Apps remains the primary deployment target.
- Existing cache-busting, `.nojekyll`, sitemap, robots, and build-date/version behavior remain supported.
- BootstrapSpark immediately aligns to TailwindSpark's runtime floor: Node.js `>=26.0.0` and npm `12.0.2`.

The alignment should emphasize equivalent commands, deterministic build behavior, explicit data synchronization, CI/deployment clarity, and documentation that states the build contract without requiring contributors to reverse-engineer scripts and config files.

`npm run build` remains the full deterministic production artifact command for local contributors. `npm run build:deploy` is added as the deploy-target command, and `npm run build:ci` is added as the explicit CI build sequence.

`npm run sync:data` is the explicit remote data refresh command. It writes ephemeral build data under `.build/` for build consumption; committed static snapshots are updated only by deliberate source changes, not as a side effect of normal build, CI, or deploy commands.

Bundle analysis remains opt-in. The analysis command writes its report to `reports/bundle-analysis.html` so BootstrapSpark and TailwindSpark expose the same inspection artifact shape even if their analyzer implementations differ.

This feature updates system documentation that directly governs build and deployment accuracy, including stale ReactSparkPortfolio naming and outdated build command or output references. Unrelated stale references, such as branding asset path notices reported by Bold triage, remain outside this feature and should be handled later through `bold.ship harvest`.

## Acceptance Criteria

- BootstrapSpark exposes this required root command surface: `build`, `build:deploy`, `build:ci`, `dev`, `preview`, `sync:data`, `lint`, `type-check`, `test`, `test:coverage`, `format`, `format:check`, `build:analyze`, and `clean`.
- `npm run build` creates the production `docs/` artifact without remote data refresh, `npm run build:deploy` produces the deployable static site for Azure Static Web Apps, and `npm run build:ci` runs the expected CI build sequence.
- Normal production builds are deterministic from committed/local source and do not silently refresh remote data; any remote data refresh is available through an explicit command.
- `npm run sync:data` refreshes remote-backed build data into `.build/`; committed fallback snapshots are not mutated by build, CI, deploy, or preview commands.
- CI workflows use the aligned command contract and continue to run linting, type checking, coverage, and build gates before deployment.
- Deployment documentation accurately identifies `docs/` as the BootstrapSpark static artifact and distinguishes BootstrapSpark-specific deployment behavior from TailwindSpark's `dist/` artifact.
- Build documentation records the runtime/tooling contract for BootstrapSpark, including Node/npm expectations, Vite, TypeScript, ESLint, Vitest, Prettier, Sass, and Azure Static Web Apps.
- Local contributor documentation, package metadata, and CI workflows require Node.js `>=26.0.0` and npm `12.0.2`; Node 20 CI usage is removed.
- Existing BootstrapSpark invariants remain true: strict TypeScript, ESLint/Prettier, automated tests with coverage gates, production console stripping, synchronized CSP, Bootstrap 5 + SCSS, and pre-commit/CI enforcement.
- Any intentional divergence from TailwindSpark's build document is documented with a rationale, especially single-app versus monorepo layout, ESLint versus Oxlint, `docs/` versus `dist/`, and Bootstrap/SCSS versus Tailwind.
- Bundle analysis is not part of normal build, CI, or deploy commands, and the generated report path is `reports/bundle-analysis.html`.
- Validation instructions for build-system changes are updated and executable from the repository root.
- Build and deployment system docs touched by this feature no longer use stale ReactSparkPortfolio naming or outdated build command/output references; unrelated stale references are not expanded into this feature.

## Open Questions

None.

## Tasks

- [x] T001 Update runtime metadata and npm scripts in `package.json` so Node.js `>=26.0.0`, npm `12.0.2`, `build`, `build:deploy`, `build:ci`, `sync:data`, `build:analyze`, and validation commands match the aligned build contract.
- [x] T002 Update `package-lock.json` so lockfile metadata reflects the aligned npm runtime and package script changes from `package.json`.
- [x] T003 Update `.github/workflows/azure-static-web-apps-gentle-smoke-063be0b10.yml` so PR validation and deployment use Node.js `>=26.0.0`, npm `12.0.2`, and the aligned `build:ci`/`build:deploy` command contract.
- [x] T004 [P] Update `.github/workflows/github-release.yml` so release packaging uses Node.js `>=26.0.0`, npm `12.0.2`, and the deterministic production build command without remote data refresh.
- [x] T005 Remove normal-build remote data refresh behavior from `package.json` while keeping `scripts/sync-repositories-data.mjs` available through `npm run sync:data` and writing build-consumable data under `.build/`.
- [x] T006 Update bundle analysis configuration or scripts in `package.json` so analysis remains opt-in and writes `reports/bundle-analysis.html`.
- [x] T007 [P] Update or add build-system documentation in `bold-docs/system/BUILD_SYSTEM.md` to state BootstrapSpark's runtime/tooling contract, command matrix, deterministic data-sync behavior, bundle-analysis output, deployment artifact, validation sequence, and intentional divergences from TailwindSpark.
- [x] T008 [P] Update `bold-docs/system/DEPLOYMENT.md` so build/deploy instructions use BootstrapSpark naming, `docs/` output, Azure Static Web Apps, Node.js `>=26.0.0`, npm `12.0.2`, and aligned `build:deploy` behavior.
- [x] T009 [P] Update `bold-docs/system/CONTRIBUTING.md` so contributor setup and quality gates use BootstrapSpark naming, `npm ci`, the aligned runtime, and root validation commands.
- [x] T010 [P] Update `bold-docs/system/standards.md` so its build, deployment, validation, and artifact standards match the aligned command contract without expanding into unrelated stale-reference cleanup.
- [x] T011 Verify `vite.config.ts` still preserves BootstrapSpark invariants for `docs/` output, `.nojekyll`, cache-busted assets, CSP alignment comments, production console stripping, and build metadata after script/documentation changes.
- [x] T012 Run the required validation gates from the repository root and record completion status in `bold-docs/features/0001-align-bootstrap-build-contract/spec.md`: `npm ci`, `npm run lint`, `npm run type-check`, `npm run test:coverage`, `npm run build`, `npm run build:deploy`, `npm run build:ci`, `npm run build:analyze`, and `git diff --check`.
- [x] T013 Fix deterministic local repository data artifact generation for clean builds in `package.json` (resolves: critic Error handling / resilience).
- [x] T014 Fix Azure Static Web Apps deployment so upload uses the prebuilt Node.js `>=26.0.0` and npm `12.0.2` artifact in `.github/workflows/azure-static-web-apps-gentle-smoke-063be0b10.yml` (resolves: critic Deployment / rollback).

## Validation Results

- `npm ci`: passed after updating the local runtime to Node.js `v26.7.0` and npm `12.0.2`.
- `npm install --dry-run`: passed after updating the local runtime to Node.js `v26.7.0` and npm `12.0.2`.
- `npm run lint`: passed.
- `npm run type-check`: passed.
- `npm run test:coverage`: passed, 33 files and 168 tests; coverage summary was 86.32% statements, 71.58% branches, 79.65% functions, and 87.46% lines.
- `npm run build`: passed; generated repository data from the committed fallback through `prepare:data`.
- `npm run build:deploy`: passed.
- `npm run build:ci`: passed.
- `npm run build:analyze`: passed; wrote `reports/bundle-analysis.html`.
- `git diff --check`: passed; emitted CRLF normalization warnings only.
- Targeted Prettier check for files changed by this feature: passed.
- `npm run format:check`: failed on pre-existing repository-wide formatting debt outside this feature's scope. `.archive/` is now ignored so the formatter no longer scans human-only archive history.

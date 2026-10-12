# Build warning and documentation cleanup

**Product Owner TL;DR:** Restore a warning-free production build and current contributor documentation without changing application behavior.

**Tier**: Feature
**Status**: Complete
**Ratified**: 2026-10-11 — user approved code and documentation cleanup.

## Intent

Isolate the shared React runtime into a vendor chunk and narrowly ignore INVALID_ANNOTATION warnings from the three known SignalR/Zod dependency files. Keep the default 500 kB chunk limit and forward all other warnings. Update build and contributor docs to match the current repository, including runtime versions and Bold paths. Existing user dependency changes are preserved; the packageManager field is aligned to the documented and installed npm 12.2.0 contract.

## Acceptance Criteria

- AC1: Production build exits successfully without the reproduced annotation or oversized JavaScript chunk warnings; every minified JavaScript chunk remains under 500 kB.
- AC2: Tests cover known annotation files on both path formats, forwarding other warning codes/files/missing IDs, and React-only vendor grouping. Route lazy loading remains unchanged; tests and preview verify the application entry loads.
- AC3: README, contributor instructions, and build documentation describe actual commands, Node >=26, npm 12.2.0, tests, CI artifacts, and valid current documentation links. Branding relative references resolve explicitly. No archive contents are accessed.
- AC4: npm ci, lint, type-check, coverage, build, deploy build, CI build, analysis, formatting of changed files, and diff checks pass, or failures are documented with evidence and remedied within the authorized cleanup scope.

## Constraints and Backbone

All ten enforced backbone principles apply: strict typed helpers with JSDoc and automated tests; lint/format/CI validation; no changes to component separation, application error handling, console stripping, runtime validation/CSP, Bootstrap styling, or theme behavior. No new dependency or remote data refresh. Existing development dependencies jest-dom and static-copy are updated to registry-current versions; unresolved audit findings are recorded in SECURITY.md. Warning filtering is restricted by warning code and exact dependency filename. Rollback restores the build policy/configuration together and rebuilds the static artifact. No deployment or publication is part of this work.

## Dependency Cleanup Extension

User approved audit/outdated/ncu updates and checking all package usage on 2026-10-11. Update retained root dependencies to latest stable releases where validation succeeds, remove unused direct ts-node and baseline-browser-mapping, classify Leaflet runtime packages as dependencies, and document every retained package's code/tooling use. Align npm runtime metadata, CI, and docs to the updated engine. Add direct type/peer dependencies only when required by the updated tools. Preserve application behavior and record unresolved upstream audit issues.

- AC5: npm audit, npm outdated and ncu are run; each retained direct package has an evidenced use, unused packages are removed, and incompatible latest versions have documented reasons if retained.

## Open Questions

None. Scope, behavior, data model (unchanged), interactions, measurable performance targets, dependency handling, tradeoffs, and acceptance criteria are clear.

## Tasks

- [x] T001 Implement typed warning/chunk policy in scripts/build-policy.ts and vite.config.ts (AC1, AC2).
- [x] T002 Add regression tests in tests/unit/build/buildPolicy.test.ts (AC2).
- [x] T003 Update README.md, package.json, package-lock.json, .github/copilot-instructions.md and bold-docs/system documentation, including current chat/security links and audit findings (AC3).
- [x] T005 Update package.json, package-lock.json, .ncurc.json, CI runtime and dependency usage documentation (AC5).
- [x] T004 Run required validation and record outcomes in this spec (AC4).

## Waivers

None.

## Validation Results — 2026-10-11

- Node 26.7.0 / npm 12.2.0; final npm ci succeeded and npm ls --depth=0 has no invalid peers.
- npm audit: six high-severity development-tool findings remain (upstream chains in SECURITY.md); npm audit --omit=dev: zero findings. Registry versions checked; no force downgrades applied.
- npm outdated and npm run update:check (ncu): only TypeScript 7.0.2 remains, intentionally constrained to 6.0.3 by typescript-eslint's peer range.
- npm run build:ci passed: ESLint, type-check, 34 test files / 182 tests, coverage, build:deploy and its nested production build. Coverage: 87.71% lines, 71.87% branches, 79.86% functions.
- npm run build and npm run build:analyze passed after Vite 8 configuration migration. Final build has no reproduced annotation/size warnings. Entry JavaScript 175.94 kB, React vendor 218.55 kB, largest JavaScript chunk 407.21 kB; report at reports/bundle-analysis.html.
- Preview HTML and 11 entry assets returned HTTP 200. Browser automation exposed no browser, so visual UI validation could not be performed; route/component integration tests passed.
- README and system-document local Markdown links resolve. All 46 direct package uses are recorded in NPM_DEPENDENCIES.md; five API manifests declare no dependencies.
- Changed-file Prettier and git diff --check passed. Collector stale references reconciled. Existing user dependency and generated CSS changes retained.
- A CI run under CPU contention emitted Rolldown's plugin timing diagnostic; the subsequent analysis build completed in 823 ms without that diagnostic. No warnings were globally disabled.

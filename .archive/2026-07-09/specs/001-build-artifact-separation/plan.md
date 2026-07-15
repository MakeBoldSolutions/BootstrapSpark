# Implementation Plan: Build Artifact Separation

**Branch**: `001-build-artifact-separation` | **Date**: 2026-04-13 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-build-artifact-separation/spec.md`

## Summary

Separate build artifacts (`docs/`, `coverage/`) from source files by adding them to `.gitignore` and untracking them from git. The CI/CD pipeline already builds from source, so committed build output is redundant and creates ~40+ file changes per build. This is a configuration-only change with no source code modifications.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 18+
**Primary Dependencies**: Vite (build tool), React (framework), Azure Static Web Apps (hosting)
**Storage**: N/A (no data storage changes)
**Testing**: Vitest (existing test runner — no new tests needed for config change)
**Target Platform**: Azure Static Web Apps (production), local dev server (development)
**Project Type**: Single web application (React SPA)
**Performance Goals**: N/A (no runtime changes)
**Constraints**: Azure SWA CI/CD must continue to work; local dev workflow must remain functional
**Scale/Scope**: Configuration files only — `.gitignore`, git index, README

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Type Safety | PASS | No code changes — config files only |
| II. Code Quality & Linting | PASS | No linted files affected |
| III. Testing | PASS | No new code to test; coverage reports remain generated locally |
| IV. Documentation | PASS | README will be updated in same commit per constitution |
| V. Component Architecture | PASS | No architectural changes |
| VI. Error Handling | PASS | No runtime changes |
| VII. Logging | PASS | No runtime changes |
| VIII. Input Validation | PASS | No runtime changes |
| IX. Styling | PASS | No styling changes |
| X. Code Quality Gates | PASS | Pre-commit hooks unaffected; `.gitignore` change is additive |

**Gate result**: ALL PASS — no violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-build-artifact-separation/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 findings (minimal — no unknowns)
├── checklists/
│   └── requirements.md  # Quality checklist
└── tasks.md             # Phase 2 output (created by /devspark.tasks)
```

### Source Code (repository root)

No source code changes. Only configuration files are modified:

```text
.gitignore               # ADD: docs/ entry
README.md                # UPDATE: note about build artifacts
```

Git operations (not file edits):
```text
git rm -r --cached docs/      # Untrack build output
git rm -r --cached coverage/  # Untrack coverage reports (already in .gitignore but still tracked)
```

**Structure Decision**: This feature modifies no source directories. The existing `src/` → `docs/` build pipeline is preserved exactly as-is; only the git tracking of `docs/` output changes.

## Phase 0: Research

No NEEDS CLARIFICATION items in Technical Context. Research was completed during spec creation by examining:

1. **CI/CD workflow** ([.github/workflows/azure-static-web-apps-gentle-smoke-063be0b10.yml](../../.github/workflows/azure-static-web-apps-gentle-smoke-063be0b10.yml)): Confirmed `skip_app_build: false` and `app_build_command: "npm run build"` — CI builds from source, does not depend on committed `docs/`
2. **SWA CLI config** ([swa-cli.config.json](../../swa-cli.config.json)): Uses `appBuildCommand: "npm run build"` — builds before serving
3. **Vite config** ([vite.config.ts](../../vite.config.ts)): `outDir: "docs"` with hash-based filenames — confirms the churn source
4. **Current `.gitignore`**: `coverage/` is listed but `docs/` is not; `coverage/` directory is still tracked despite being in `.gitignore` (was added to git before the ignore rule)

**Decision**: No unknowns remain. Proceed directly to implementation.

See [research.md](research.md) for consolidated findings.

## Phase 1: Design

### Data Model

N/A — no data entities affected. No `data-model.md` needed.

### Contracts

N/A — no external interfaces change. No `contracts/` needed.

### Implementation Steps

#### Step 1: Update `.gitignore`

Add `docs/` to the "Build artifacts" section. The entry should be `/docs/` (root-relative) to avoid ignoring any nested `docs/` directories in unlikely future scenarios.

Current state:
```gitignore
# Build artifacts
/build
/.next
/out
coverage/
```

Target state:
```gitignore
# Build artifacts
/build
/.next
/out
coverage/
docs/
```

#### Step 2: Untrack `docs/` from git

```bash
git rm -r --cached docs/
```

This removes `docs/` from the git index without deleting local files. After this, git will no longer track the ~40+ build output files.

#### Step 3: Untrack `coverage/` from git

```bash
git rm -r --cached coverage/
```

The `coverage/` entry already exists in `.gitignore`. Note: `coverage/` was never actually tracked in git (the ignore rule was added before any coverage files were committed), so this step is a no-op.

#### Step 4: Update README.md

Add a brief note in the development section explaining that `docs/` is a build artifact directory generated by `npm run build`, not committed to git. Contributors need to run `npm run build` before `npm run preview`.

#### Step 5: Commit and validate

```bash
git add .gitignore README.md
git commit -m "chore: stop tracking build artifacts (docs/, coverage/)"
npm run build
git status  # Should show no changes in docs/
```

### Vite Config: `createNoJekyllFile` Plugin

The Vite config includes a `createNoJekyllFile()` plugin that writes `docs/.nojekyll` on each build. This was needed for GitHub Pages (which uses Jekyll). Since the project now deploys to Azure Static Web Apps (not GitHub Pages), this plugin is harmless but unnecessary. **No action needed for this feature** — it can be cleaned up separately if desired.

## Post-Design Constitution Re-Check

| Principle | Status | Notes |
|-----------|--------|-------|
| IV. Documentation | PASS | README updated in same commit as code change |
| X. Code Quality Gates | PASS | `.gitignore` is additive; no existing gates broken |

All gates pass. Ready for `/devspark.tasks`.

## Complexity Tracking

No constitution violations. Table not needed.
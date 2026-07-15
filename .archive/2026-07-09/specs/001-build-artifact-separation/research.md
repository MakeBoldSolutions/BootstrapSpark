# Research: Build Artifact Separation

**Feature**: 001-build-artifact-separation
**Date**: 2026-04-13

## Findings

### 1. CI/CD Pipeline Independence from Committed Build Output

**Decision**: Safe to remove `docs/` from git tracking.
**Rationale**: The Azure Static Web Apps GitHub Actions workflow explicitly sets `skip_app_build: false` and `app_build_command: "npm run build"`. The deployment action builds from source on every push — it never reads pre-existing files from `docs/`.
**Alternatives considered**: None — this is a factual verification, not a design choice.

### 2. Local SWA CLI Behavior

**Decision**: No changes needed to `swa-cli.config.json`.
**Rationale**: The config specifies `appBuildCommand: "npm run build"`, meaning the CLI triggers a build before serving. It does not assume `docs/` exists prior to invocation.
**Alternatives considered**: Could add `outputLocation: "docs"` explicitly, but it's already set and correct.

### 3. Coverage Directory Tracking

**Decision**: Untrack `coverage/` in the same commit.
**Rationale**: `coverage/` is already in `.gitignore` (line 50) but was committed to git before the rule was added. It contains test coverage HTML reports that are build artifacts. Currently tracked files: `coverage-final.json`, `lcov.info`, HTML reports.
**Alternatives considered**: Leave it tracked — rejected because it creates the same noise problem.

### 4. Vite `createNoJekyllFile` Plugin

**Decision**: Leave as-is (no action in this feature).
**Rationale**: This plugin writes `docs/.nojekyll` for GitHub Pages compatibility. The project now uses Azure SWA, so it's unnecessary but harmless. Removing it is a separate cleanup concern.
**Alternatives considered**: Remove the plugin — deferred to avoid scope creep.
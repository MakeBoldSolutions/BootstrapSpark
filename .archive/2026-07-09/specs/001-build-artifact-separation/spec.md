---
classification: quick-spec
risk_level: medium
target_workflow: specify-light
required_artifacts: intent, action-plan
recommended_next_step: plan
required_gates: checklist
---

# Quick Specification: Build Artifact Separation

**Feature Branch**: `001-build-artifact-separation`
**Created**: 2026-04-13
**Status**: Complete <!-- Valid: Draft | In Progress | Complete -->
**Input**: User description: "Refactor files and build process to separate source files from build artifacts. Prevent every build from creating git noise that distracts from meaningful changes. Clean separation between source and built output so .gitignore can exclude build artifacts."

## Intent

Every `npm run build` produces a `docs/` directory with hash-based filenames (e.g., `About-DUW_-ayh.js`). Because `docs/` is tracked in git, **each build generates ~40+ changed files** in git status — all deletions of old hashed files and additions of new ones. This noise obscures actual meaningful code changes, pollutes pull request diffs, and makes commit history harder to review.

The `docs/` directory is the Vite build output consumed by Azure Static Web Apps. The CI/CD pipeline (GitHub Actions) already runs `npm run build` and deploys from `docs/` — meaning the committed `docs/` folder is redundant. The `coverage/` directory (test coverage reports) is also partially tracked and creates similar noise.

This change will establish a clean boundary: **source files are committed, build artifacts are not**.

## Scope

- **In scope:**
  - Add `docs/` to `.gitignore` so Vite build output is never committed
  - Add `coverage/` to `.gitignore` (test coverage reports are build artifacts)
  - Remove `docs/` and `coverage/` from git tracking (untrack without deleting local files)
  - Verify the Azure Static Web Apps CI/CD workflow builds from source and does not depend on a pre-committed `docs/` folder
  - Update `swa-cli.config.json` if needed to ensure local SWA CLI still works with the build-on-demand model
  - Update any documentation that references the `docs/` folder as a deployment target requiring commits

- **Out of scope:**
  - Changing the Vite `outDir` configuration (keeping `docs/` as the build output directory is fine)
  - Changing the CI/CD workflow structure or deployment provider
  - Modifying the build process itself (scripts, plugins, optimizations)
  - Changing the `public/` or `src/` source file structure

## Constraints

- **Azure Static Web Apps deployment must not break.** The GitHub Actions workflow uses `output_location: "docs"` and `app_build_command: "npm run build"` — it builds from source in CI. Removing committed `docs/` must not affect this.
- **Local development workflow must remain functional.** `npm run dev`, `npm run build`, and `npm run preview` must continue to work. The SWA CLI (`swa start`) must still find build output.
- **Constitution compliance:** No new test coverage gaps. Build/config changes must be validated.
- **Backward compatibility:** Contributors who `git pull` after this change will no longer have a pre-built `docs/` folder. The README should note that `npm run build` is required before `npm run preview`.

## Action Plan

1. **Update `.gitignore`** — Add `docs/` and ensure `coverage/` entries cover all coverage output
2. **Untrack `docs/` from git** — Run `git rm -r --cached docs/` to stop tracking without deleting local files
3. **Untrack `coverage/` from git** — Run `git rm -r --cached coverage/` to stop tracking without deleting local files
4. **Verify CI/CD pipeline** — Confirm the Azure Static Web Apps workflow builds from source (`skip_app_build: false`, `app_build_command: "npm run build"`) and does not expect pre-committed build output
5. **Verify local SWA CLI** — Confirm `swa-cli.config.json` uses `appBuildCommand` so it builds before serving, not relying on pre-existing `docs/`
6. **Update README** — Add a note that `docs/` is a build artifact (not committed) and `npm run build` must be run before previewing locally
7. **Commit and validate** — Commit the `.gitignore` and untrack changes, then verify a clean `git status` after running `npm run build`

## Validation Notes

- After the change, running `npm run build` should produce **zero git-tracked file changes** in `docs/`
- `git status` after a build should show only source file modifications (if any)
- The Azure Static Web Apps CI/CD pipeline must successfully build and deploy on push to `main`
- `npm run dev`, `npm run build`, `npm run preview`, and `swa start` must all function correctly
- A fresh clone followed by `npm install && npm run build` must produce a working site
- How does system handle [error scenario]?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability, e.g., "allow users to create accounts"]
- **FR-002**: System MUST [specific capability, e.g., "validate email addresses"]  
- **FR-003**: Users MUST be able to [key interaction, e.g., "reset their password"]
- **FR-004**: System MUST [data requirement, e.g., "persist user preferences"]
- **FR-005**: System MUST [behavior, e.g., "log all security events"]

*Example of marking unclear requirements:*

- **FR-006**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]
- **SC-002**: [Measurable metric, e.g., "System handles 1000 concurrent users without degradation"]
- **SC-003**: [User satisfaction metric, e.g., "90% of users successfully complete primary task on first attempt"]
- **SC-004**: [Business metric, e.g., "Reduce support tickets related to [X] by 50%"]
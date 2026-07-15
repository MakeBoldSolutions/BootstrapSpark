# Implementation Plan: Robust Theme Switcher

**Branch**: `[001-robust-theme-switcher]` | **Date**: 2026-04-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/.documentation/specs/001-robust-theme-switcher/spec.md`

## Rationale Summary

### Core Problem

BootstrapSpark's current light/dark toggle does not scale to a richer theme catalog, gives users no dedicated place to compare themes, and makes it difficult to validate whether the existing Bootstrap-based UI stays reliable across a broader visual system.

### Decision Summary

The feature will expand theming from a binary mode toggle into a full Bootswatch theme system backed by a local supported-theme catalog, immediate persisted theme application, stylesheet failure rollback to the BootstrapSpark default theme, and a dedicated selector experience. Bootswatch will be integrated through precompiled theme assets and metadata mapping rather than as a live runtime dependency for correctness.

### Key Drivers

- BootstrapSpark is a showcase application, so theme variety is part of the product value.
- The site already has a global ThemeContext and Bootstrap/SCSS pipeline that can be extended instead of replaced.
- The clarified spec now requires resilience when external metadata is unavailable while still exposing the full available Bootswatch theme set.

### Source Inputs

- [spec.md](./spec.md)
- [constitution.md](../../memory/constitution.md)
- Existing theme entry points in [src/contexts/ThemeContext.tsx](../../../src/contexts/ThemeContext.tsx) and [src/components/Header.tsx](../../../src/components/Header.tsx)
- Existing remote-data fallback and Zod validation patterns in [src/services/ProjectService.ts](../../../src/services/ProjectService.ts)

### Tradeoffs Considered

- Runtime-only Bootswatch API dependency: rejected because the current CSP does not allow Bootswatch as a fetch origin and the spec requires the selector to remain fully usable without external availability.
- Full SCSS recompilation per theme at runtime: rejected because it adds unnecessary complexity and slows the user-visible theme switch path.
- One-off hardcoded theme switch cases in the header: rejected because the feature now requires a dedicated selector, bounded support metadata, and route-wide review coverage.
- Selected: locally maintained supported-theme catalog, precompiled theme stylesheets, and optional Bootswatch metadata enrichment mapped into the catalog.

### Architectural Impact

- Theme state grows from `light | dark` to a richer catalog-driven active-theme model.
- The app will add a dedicated selector surface and theme asset-loading behavior in addition to the existing global header entry point.
- Existing Bootstrap markup and custom SCSS must be reviewed so the supported theme set can be trusted across shared routes and showcase pages.

### Reviewer Guidance

Reviewers should focus on theme asset loading, persistence behavior, fallback handling when metadata is unavailable, and whether the full Bootswatch theme surface remains selectable without breaking the showcase goals.

## Summary

Implement a full Bootswatch multi-theme system for the React/Vite SPA by extending ThemeContext into a catalog-backed provider, loading precompiled Bootswatch and BootstrapSpark theme assets through a consistent runtime contract, adding a dedicated selector UX, and validating existing markup/styles against the supported theme set. External Bootswatch API data is treated as an enrichment source that feeds a locally owned catalog instead of a runtime requirement.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19, Vite 7  
**Primary Dependencies**: React Router 7, Bootstrap 5.3, React-Bootstrap 2.10, Sass 1.99, Zod 4, Vitest 4, Testing Library, Bootswatch 5.3 package assets  
**Storage**: Browser `localStorage` for theme preference, static JSON/catalog files for supported theme definitions, static CSS assets for BootstrapSpark plus all available Bootswatch themes  
**Testing**: Vitest 4, Testing Library, ESLint, `tsc -b`, manual cross-theme route verification  
**Target Platform**: Browser SPA deployed to Azure Static Web Apps and GitHub Pages  
**Project Type**: Web application with frontend SPA and existing Azure Function proxy endpoints  
**Performance Goals**: Theme changes visible within 1 second for 95% of tests, no broken navigation during theme changes, verified fallback on stylesheet failure, and minimal layout shift during stylesheet swap  
**Constraints**: Preserve Bootstrap 5 + SCSS architecture, keep the full Bootswatch list available from local assets, avoid correctness dependence on live Bootswatch availability, validate external metadata with Zod, keep CSP synchronized if new runtime origins are introduced, maintain mobile-first usability  
**Scale/Scope**: One shared SPA shell, global header/footer, primary user routes, showcase routes, and three site-demo routes covered by the supported-theme review matrix

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Gate

- **Type Safety**: PASS. New theme catalog, preference, and service models will be typed in TypeScript with `strict: true` preserved.
- **Code Quality & Linting**: PASS. The plan keeps all new logic in typed React/service files that will continue to run through `npm run lint` and `npm run type-check`.
- **Testing**: PASS WITH REQUIRED WORK. The implementation must add Vitest coverage for theme state transitions, metadata-outage fallback, stylesheet load-failure rollback, responsive selector behavior, and selector interactions before merge.
- **Documentation**: PASS. All planning artifacts live under `.documentation/specs/001-robust-theme-switcher/`; code changes will require matching JSDoc updates for exported additions.
- **Component Architecture**: PASS. The design keeps theme state in `contexts`, metadata loading in `services`, entities in `models`, and selector UI in `components`.
- **Error Handling & Resilience**: PASS WITH REQUIRED WORK. Fallback behavior is first-class, but implementation must explicitly verify both metadata-outage fallback and stylesheet rollback to the BootstrapSpark default theme.
- **Logging & Observability**: PASS. No production-only debug logging is required by the design; temporary dev logging must still respect the strip plugin.
- **Input Validation & Security**: PASS WITH CONSTRAINT. Any external metadata must be validated with Zod and must not require a CSP change unless both [vite.config.ts](../../../vite.config.ts) and [staticwebapp.config.json](../../../staticwebapp.config.json) are updated together.
- **Styling Standards**: PASS WITH REQUIRED WORK. Responsive selector validation must be captured explicitly for mobile and desktop layouts.
- **Code Quality Gates**: PASS. Existing Husky/lint-staged, Vitest, and build scripts remain the enforcement path.

### Post-Design Gate

- **Gate Result**: PASS.
- The chosen design avoids live-catalog correctness dependencies, keeps the UI within the existing frontend architecture, preserves Bootstrap/SCSS usage, and now requires explicit verification of metadata-outage fallback, stylesheet rollback, responsive selector behavior, and switch-latency evidence before implementation is considered complete.

## Project Structure

### Documentation (this feature)

```text
.documentation/specs/001-robust-theme-switcher/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── theme-catalog-contract.md
├── checklists/
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── App.tsx
├── components/
│   ├── Header.tsx
│   ├── theme/
│   └── ...existing route components
├── contexts/
│   └── ThemeContext.tsx
├── models/
│   └── theme/
├── services/
│   └── theme/
├── data/
│   └── theme-catalog/
├── scss/
│   ├── styles.scss
│   ├── variables/
│   └── components/
├── css/
└── utils/

public/
└── themes/

tests/
├── unit/
├── integration/
└── contract/
```

**Structure Decision**: Keep the existing single-frontend project structure. Theme domain objects live under `src/models`, metadata and asset coordination under `src/services`, global state in `src/contexts`, selector UI in `src/components`, and supported theme definitions under `src/data` or `public/themes` depending on whether the file is code-consumed metadata or a static CSS asset.

## Phase 0: Research Summary

- Theme catalog source of truth: locally maintained BootstrapSpark plus full Bootswatch catalog with Bootswatch-derived fields.
- Runtime theme application: swap precompiled stylesheet assets instead of recompiling Sass in-browser.
- External metadata strategy: optional enrichment/mapping from Bootswatch API data, validated with Zod and never required for app correctness.
- BootstrapSpark default theme strategy: keep first-party theme as a supported catalog entry with the same contract as external themes.
- Failure recovery strategy: detect stylesheet load failures and revert immediately to the BootstrapSpark default theme with a user-safe status message.
- Verification scope: review shared shell, primary routes, forms, dropdowns, cards, alerts, and showcase/site-demo pages across the supported theme set, including metadata-outage, stylesheet-failure, mobile selector, and switch-latency validation.

## Phase 1: Design Plan

1. Extend `ThemeContext` into a catalog-backed provider that stores an active theme identifier, selected theme metadata, load status, and a single action for immediate apply-and-persist behavior.
2. Add a theme catalog service that reads the local supported list, maps optional Bootswatch metadata into that list, validates the result with Zod, and falls back cleanly to local definitions only.
3. Introduce a dedicated theme selector surface and lightweight header entry point that share the same underlying selection contract and remain usable on mobile and desktop viewports.
4. Host all available Bootswatch themes as static precompiled assets and load the currently selected theme through one dedicated stylesheet target, while preserving the BootstrapSpark default styling layer and explicit rollback behavior for asset-load failure.
5. Audit shared layout and representative pages for Bootstrap/Bootswatch compatibility issues and fix unstable markup or custom style collisions.
6. Add unit/component tests for theme resolution, metadata-outage fallback, stylesheet rollback, persistence, selector interactions, responsive behavior, and active-theme indicator behavior.
7. Capture measurable switch-latency evidence and validation notes for release readiness.

## Phase 2: Implementation Strategy

1. Create theme domain models and catalog validation schemas.
2. Implement theme catalog loading and fallback service.
3. Replace the binary `light | dark` context model with catalog-driven theme selection.
4. Add static theme assets, BootstrapSpark default-theme registration, and stylesheet rollback handling.
5. Build the dedicated selector route/component and integrate a global entry point with responsive behavior.
6. Review and remediate theme-sensitive markup/styles across targeted routes.
7. Add automated tests for metadata-outage fallback, stylesheet rollback, responsive behavior, and selector accessibility.
8. Run lint, type-check, coverage, and switch-latency validation.

## Complexity Tracking

No constitution violations currently require justification.

## Planned Artifacts

- [research.md](./research.md)
- [data-model.md](./data-model.md)
- [quickstart.md](./quickstart.md)
- [theme-catalog-contract.md](./contracts/theme-catalog-contract.md)
# Implementation Plan: Merge JsBootSpark into ReactSparkPortfolio

**Branch**: `001-merge-jsbootspark` | **Date**: 2026-04-13 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-merge-jsbootspark/spec.md`

## Summary

Absorb all unique user-facing features from JsBootSpark (vanilla JS + Express + EJS) into ReactSparkPortfolio (React + Vite + TypeScript) and rename the project to BootstrapSpark. This involves creating new React components for Bootstrap component showcases, a data-table page for YouTube Top 100 Songs, a song detail view, and a contact form — all following the existing architecture patterns (TypeScript strict, Zod validation, service layer, lazy loading). The rename updates package.json, AppConfig, HTML title, README, and all branding references.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), React 19, Node.js 18+
**Primary Dependencies**: React 19, React Router 7, React Bootstrap 2, Bootstrap 5.3, Vite 6, Zod 4, Axios
**Storage**: Static CSV file (YouTube data), localStorage (theme/cache), no database
**Testing**: Vitest + @testing-library/react + jsdom
**Target Platform**: Azure Static Web Apps (production), GitHub Pages (docs), SPA with client-side routing
**Project Type**: Single web application (React SPA)
**Performance Goals**: All pages load <3s on first visit, table interactions <500ms, Lighthouse 90+
**Constraints**: Client-side only (no Express server), CSP compliance per copilot-instructions, Azure SWA deployment
**Scale/Scope**: ~15 routes total (8 existing + 6 new + 1 updated), ~240KB CSV data file, single developer

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Type Safety | ✅ PASS | All new code will be TypeScript strict. New models (Song, ContactForm) use Zod schemas + inferred types |
| II. Code Quality & Linting | ✅ PASS | All new files must pass `npm run lint`. Prettier formatting applied |
| III. Testing | ✅ PASS | New services (SongService, ContactService) get unit tests. New components get component tests. Coverage thresholds enforced |
| IV. Documentation | ✅ PASS | JSDoc on all exports. No TODO comments. Working docs in specs dir |
| V. Component Architecture | ✅ PASS | New components in `/components`, new services in `/services`, new models in `/models`, new hooks in `/hooks` |
| VI. Error Handling & Resilience | ✅ PASS | Error boundaries wrap new routes. CSV parsing failures degrade gracefully to empty table. Song not found shows fallback UI |
| VII. Logging & Observability | ✅ PASS | Vite strip plugin already configured to remove console.* in production |
| VIII. Input Validation & Security | ✅ PASS | Zod validates CSV-parsed song data. Contact form uses Zod schema for client-side validation. CSP unchanged |
| IX. Styling Standards | ✅ PASS | Bootstrap 5 + SCSS. ThemeContext for dark/light. Mobile-first responsive |
| X. Code Quality Gates | ✅ PASS | Husky + lint-staged already configured |

**Gate Result**: ALL PASS — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-merge-jsbootspark/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (route contracts)
└── tasks.md             # Phase 2 output (/devspark.tasks)
```

### Source Code (new/modified files)

```text
src/
├── components/
│   ├── Components.tsx           # NEW - Basic Bootstrap components showcase
│   ├── AdvancedComponents.tsx   # NEW - Advanced Bootstrap components showcase
│   ├── DataTables.tsx           # NEW - YouTube Top 100 data table page
│   ├── SongDetail.tsx           # NEW - Individual song detail view
│   ├── Contact.tsx              # EXISTS (update with form validation)
│   ├── Header.tsx               # MODIFY - Add new nav items
│   ├── Hero.tsx                 # MODIFY - Update branding to BootstrapSpark
│   ├── Footer.tsx               # MODIFY - Update branding to BootstrapSpark
│   └── About.tsx                # MODIFY - Update branding references
├── models/
│   ├── Song.ts                  # NEW - Zod schema + TypeScript types for song data
│   └── ContactForm.ts           # NEW - Zod schema for contact form validation
├── services/
│   └── SongService.ts           # NEW - CSV parsing, search, sort, pagination, export
├── hooks/
│   ├── useSongData.ts           # NEW - Hook for loading/caching song data
│   └── useDataTable.ts          # NEW - Hook for table state (sort, search, pagination)
├── config/
│   └── AppConfig.ts             # MODIFY - Rename branding to BootstrapSpark
├── data/
│   └── youtube-top-100-songs-2025.csv  # NEW - Copied from JsBootSpark
├── App.tsx                      # MODIFY - Add new routes
└── ...

tests/
└── unit/
    ├── models/
    │   ├── Song.test.ts         # NEW
    │   └── ContactForm.test.ts  # NEW
    ├── services/
    │   └── SongService.test.ts  # NEW
    └── components/
        ├── DataTables.test.tsx  # NEW
        └── Contact.test.tsx     # NEW

public/
├── assets/img/                  # Existing image assets
index.html                       # MODIFY - Update title to BootstrapSpark
package.json                     # MODIFY - Rename to bootstrapspark
README.md                        # MODIFY - Update branding
```

**Structure Decision**: Single web application structure following existing patterns. New files placed in the established `/components`, `/models`, `/services`, `/hooks` directories. No new top-level directories needed. CSV data file placed in `/src/data/` alongside existing `projects.json`.

## Complexity Tracking

> No constitution violations. No complexity justifications needed.
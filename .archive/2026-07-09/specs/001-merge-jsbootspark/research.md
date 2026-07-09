# Research: Merge JsBootSpark into ReactSparkPortfolio

**Feature**: 001-merge-jsbootspark
**Date**: 2026-04-13

## R1: CSV Data Loading Strategy in React SPA

**Decision**: Parse CSV client-side using a lightweight parser (Papa Parse or custom parser) bundled with Vite, loading from a static file in `/src/data/`.

**Rationale**: The CSV is ~240KB (100 rows) — small enough to load client-side without performance concerns. Avoids needing a backend API endpoint or Azure Function proxy. Follows the existing pattern where `projects.json` is imported as a static data file.

**Alternatives considered**:
- Convert CSV to JSON at build time → Rejected: adds build complexity, CSV is the canonical JsBootSpark format and easier to update
- Add an Azure Function proxy for songs API → Rejected: over-engineering for static data, adds latency
- Use Papa Parse npm package → Viable but adds a dependency for a simple 13-column CSV; a custom parser or `csv-parse/sync` is sufficient

**Implementation note**: Vite can import CSV as a raw string via `?raw` suffix. Parse at runtime in SongService with Zod validation.

## R2: Bootstrap Component Showcase — Static JSX vs. Dynamic Rendering

**Decision**: Create static JSX components with hardcoded Bootstrap examples. Each component section is a React component with live Bootstrap markup.

**Rationale**: JsBootSpark's component pages are EJS templates with static HTML. The React equivalent is JSX with Bootstrap classes. This is the simplest approach — no dynamic rendering engine needed. Bootstrap JS (already imported in App.tsx) handles interactive behaviors (modals, dropdowns, etc.).

**Alternatives considered**:
- Dynamic component registry with JSON config → Rejected: over-engineering for a showcase page
- MDX with embedded components → Rejected: adds MDX dependency, pages are mostly HTML examples
- iframe-based isolation per component → Rejected: poor UX, unnecessary isolation

## R3: Data Table Implementation — Library vs. Custom

**Decision**: Build a custom data table component using Bootstrap table classes with React state for sort/search/pagination.

**Rationale**: The feature needs sorting, searching, pagination, and export — all achievable with ~200 lines of React + Bootstrap markup. Avoids adding a heavy table library (AG Grid, TanStack Table) for 100 rows. Follows constitution principle of minimal dependencies.

**Alternatives considered**:
- TanStack Table (React Table v8) → Viable but heavyweight for 100 rows; ~30KB gzipped
- AG Grid → Rejected: commercial license concerns, massive bundle size
- Bootstrap Table (jQuery plugin) → Rejected: jQuery dependency conflicts with React paradigm

## R4: Contact Form Backend

**Decision**: Client-side validation only with a success confirmation. No backend submission in initial scope.

**Rationale**: The spec scopes this as a client-side form demo. JsBootSpark's contact endpoint just logged to console. Backend processing (email, database) can be added later via Azure Functions if needed.

**Alternatives considered**:
- Azure Function for email sending → Deferred: out of scope for merge, can be added in future feature
- Formspree/Netlify Forms integration → Rejected: external dependency, not needed for demo

## R5: Project Rename Strategy

**Decision**: Update all references in a single pass: package.json `name`, AppConfig values, index.html `<title>`, README.md, Header/Footer components, SEO metadata, sitemap generation, and staticwebapp.config.json.

**Rationale**: Comprehensive rename ensures brand consistency. AppConfig already centralizes branding values, making the rename straightforward.

**Key files to update**:
- `package.json` → name: "bootstrapspark"
- `src/config/AppConfig.ts` → siteTitle, hostedUrl, githubRepo
- `index.html` → `<title>`
- `README.md` → project name and description
- `src/components/Header.tsx` → brand text
- `src/components/Footer.tsx` → footer brand text
- `src/utils/generateSitemap.ts` → site URL
- `src/utils/generateRobotsTxt.ts` → sitemap URL
- `.documentation/memory/constitution.md` → header reference

**Note**: The Azure SWA custom domain and GitHub repo name are separate concerns (infrastructure, not code). The repo rename from ReactSparkPortfolio to BootstrapSpark happens at the GitHub level after merge.

## R6: Navigation Structure for New Pages

**Decision**: Add a "Showcase" dropdown in the header nav containing: Components, Advanced Components, Data Tables. Contact gets its own nav link.

**Rationale**: Groups related showcase pages under one dropdown to avoid cluttering the nav bar with 4+ new items. Follows Bootstrap's dropdown nav pattern already supported by React Bootstrap.

**Alternatives considered**:
- Flat nav with all items → Rejected: too many top-level items (12+)
- Sidebar navigation → Rejected: inconsistent with existing top-nav pattern
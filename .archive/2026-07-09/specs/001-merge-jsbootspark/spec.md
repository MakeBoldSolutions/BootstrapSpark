---
classification: full-spec
risk_level: high
target_workflow: specify-full
required_artifacts: spec, plan, tasks
recommended_next_step: plan
required_gates: checklist, analyze, critic
---

# Feature Specification: Merge JsBootSpark into ReactSparkPortfolio

**Feature Branch**: `001-merge-jsbootspark`
**Created**: 2026-04-13
**Status**: Complete <!-- Valid: Draft | In Progress | Complete -->
**Input**: User description: "Merge JsBootSpark and ReactSparkPortfolio into one repo, absorbing all unique JsBootSpark features, then rename to BootstrapSpark to align with TailwindSpark"

## Rationale Summary

### Core Problem

Two separate Bootstrap-based portfolio/showcase repositories (ReactSparkPortfolio and JsBootSpark) exist with overlapping purpose but different tech stacks and unique features. Maintaining both creates duplicate effort, confuses visitors, and fragments the "Spark" brand family (TailwindSpark, BootstrapSpark).

### Decision Summary

Absorb all unique user-facing features from JsBootSpark (vanilla JS + Express + EJS) into ReactSparkPortfolio (React + Vite + TypeScript), then rename the consolidated project to BootstrapSpark, allowing JsBootSpark to be archived/deleted.

### Key Drivers

- Reduce maintenance burden of two overlapping Bootstrap showcase repos
- Consolidate all Bootstrap demonstration content into one comprehensive React application
- Align naming with the "Spark" project family (TailwindSpark ↔ BootstrapSpark)

### Source Inputs

- JsBootSpark repository: https://github.com/markhazleton/JsBootSpark
- ReactSparkPortfolio constitution and architecture principles
- TailwindSpark naming convention precedent

### Tradeoffs Considered

- Option A: Port JsBootSpark to React and merge — chosen; leverages existing TypeScript/React infrastructure, better long-term maintainability
- Option B: Keep both repos separate — rejected; duplicate maintenance, brand fragmentation
- Option C: Rewrite both from scratch as BootstrapSpark — rejected; unnecessary effort, ReactSparkPortfolio is already mature

### Architectural Impact

- New React components and routes added for JsBootSpark-exclusive features
- New data source (YouTube Top 100 Songs CSV) integrated via services layer
- Project rename changes package.json name, README, branding, and potentially deployment URLs
- No breaking changes to existing ReactSparkPortfolio features
- Constitution principles (TypeScript strict, Zod validation, error boundaries) apply to all new code

### Reviewer Guidance

- Verify all new components follow TypeScript strict mode and existing architecture patterns
- Ensure no Express/EJS server-side code leaks into the React SPA — all features must be client-side or use existing API proxy pattern
- Confirm existing features (Projects, Articles, Joke, Weather, Chat) remain functional after merge
- Validate the rename does not break deployment pipelines or Azure Static Web Apps configuration

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Bootstrap Component Showcase (Priority: P1)

A developer visiting the site can browse a comprehensive library of Bootstrap 5 components with live examples and code snippets, organized into basic components (buttons, typography, cards, alerts, forms, modals, tables, icons) and advanced components (accordion, carousel, offcanvas, tabs, collapse, dropdowns, tooltips, progress bars, spinners, badges, breadcrumbs).

**Why this priority**: This is JsBootSpark's flagship feature and primary differentiator. It transforms the portfolio from a personal site into a Bootstrap reference resource.

**Independent Test**: Navigate to /components and /advanced-components routes; verify all component examples render correctly with interactive demos.

**Acceptance Scenarios**:

1. **Given** a user on the home page, **When** they navigate to the Components page, **Then** they see a sidebar navigation with categorized basic Bootstrap components and live interactive examples for each
2. **Given** a user on the Components page, **When** they click "Advanced Components", **Then** they see advanced Bootstrap components (accordion, carousel, offcanvas, tabs, etc.) with working interactive demos
3. **Given** a user on any component section, **When** they interact with a component demo (click a button, expand an accordion, etc.), **Then** the component responds correctly per Bootstrap 5 behavior

---

### User Story 2 - Data Tables with YouTube Top 100 Songs (Priority: P2)

A user can view a rich, interactive data table displaying YouTube's Top 100 Songs with sorting, searching, pagination, and export capabilities (CSV, JSON).

**Why this priority**: Demonstrates real-world data handling and Bootstrap Table integration — a compelling demo feature that showcases the framework's data capabilities.

**Independent Test**: Navigate to /data-tables, verify songs load, search filters results, columns sort, and export buttons produce valid files.

**Acceptance Scenarios**:

1. **Given** a user navigates to the Data Tables page, **When** the page loads, **Then** they see a paginated table of YouTube Top 100 Songs with rank, title, channel, views, and duration columns
2. **Given** a user on the Data Tables page, **When** they type in the search field, **Then** the table filters results in real-time across all columns
3. **Given** a user on the Data Tables page, **When** they click a column header, **Then** the table sorts by that column (ascending/descending toggle)
4. **Given** a user on the Data Tables page, **When** they click an export button (CSV or JSON), **Then** a valid file downloads with the current table data

---

### User Story 3 - Song Detail View (Priority: P3)

A user can click on any song in the data table to see a detailed view with full metadata including views, duration, channel info, social media links, and streaming information.

**Why this priority**: Enhances the data tables feature with a drill-down experience, demonstrating detail routing.

**Independent Test**: Click any song in the data table; verify the detail page displays complete song metadata with a back-navigation link.

**Acceptance Scenarios**:

1. **Given** a user on the Data Tables page, **When** they click on a song row, **Then** they navigate to a song detail page showing full song metadata
2. **Given** a user on a Song Detail page, **When** they click the back button, **Then** they return to the Data Tables page

---

### User Story 4 - Contact Form (Priority: P3)

A user can submit a contact form with name, email, and message fields, with client-side validation providing immediate feedback.

**Why this priority**: Standard portfolio feature that adds interactivity and demonstrates form handling.

**Independent Test**: Navigate to /contact, submit with valid data — see success message; submit with invalid data — see validation errors.

**Acceptance Scenarios**:

1. **Given** a user on the Contact page, **When** they fill in valid name, email, and message and submit, **Then** they see a success confirmation message
2. **Given** a user on the Contact page, **When** they submit with invalid or missing fields, **Then** they see specific validation error messages for each invalid field

---

### User Story 5 - Project Rename to BootstrapSpark (Priority: P2)

The application brand, package name, README, page titles, and all user-visible references reflect the new name "BootstrapSpark" aligned with the TailwindSpark naming convention.

**Why this priority**: Essential for brand alignment and sets the stage for archiving JsBootSpark.

**Independent Test**: After rename, verify package.json name, HTML title, header branding, README, footer text, and SEO metadata all reference "BootstrapSpark".

**Acceptance Scenarios**:

1. **Given** the merge is complete, **When** a user visits the site, **Then** all visible branding shows "BootstrapSpark" (header, footer, title, about page)
2. **Given** the merge is complete, **When** a developer inspects package.json, README, and SEO metadata, **Then** all references use "BootstrapSpark" naming

---

### Edge Cases

- What happens when the YouTube CSV data file is missing or corrupted? System should display an error message and gracefully degrade to an empty table.
- What happens when a user navigates to a song detail page with an invalid ID? System should show a "Song not found" message with navigation back to the table.
- What happens when Bootstrap JS components fail to initialize? Error boundary should catch and display a fallback UI.
- How does the component showcase handle theme switching (dark/light mode)? All demo components should respect the current theme.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a Components page (`/components`) displaying categorized Bootstrap 5 basic component examples (buttons, typography, cards, alerts, forms, modals, tables, icons) with interactive demos
- **FR-002**: System MUST provide an Advanced Components page (`/advanced-components`) displaying advanced Bootstrap 5 components (accordion, carousel, offcanvas, tabs, collapse, dropdowns, tooltips, progress bars, spinners, badges, breadcrumbs)
- **FR-003**: System MUST provide a Data Tables page (`/data-tables`) that loads YouTube Top 100 Songs data and displays it in a sortable, searchable, paginated table
- **FR-004**: System MUST support data export from the Data Tables page in CSV and JSON formats
- **FR-005**: System MUST provide a Song Detail page (`/song/:id`) showing full metadata for a selected song
- **FR-006**: System MUST provide a Contact page (`/contact`) with a validated form (name, email, message)
- **FR-007**: System MUST rename all user-visible branding from "ReactSparkPortfolio" to "BootstrapSpark" (package name, HTML title, header, footer, README, SEO metadata)
- **FR-008**: All existing features (Home, About, Projects, Articles, Joke, Weather, Chat, Variant List) MUST continue to function unchanged after the merge
- **FR-009**: All new components MUST be written in TypeScript with strict mode compliance per constitution
- **FR-010**: All new data sources (YouTube CSV) MUST be validated with Zod schemas at runtime per constitution
- **FR-011**: All new components MUST respect the existing dark/light theme toggle via ThemeContext
- **FR-012**: All new pages MUST be integrated into the site navigation header

### Key Entities

- **Component Example**: A Bootstrap component demo with title, category (basic/advanced), description, and live interactive HTML/JSX markup
- **Song**: A YouTube song record with rank, title, channel, views, duration, followers, category, description, thumbnail, social links
- **Contact Submission**: A user-submitted form with name, email, message, and timestamp

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All 6 new routes (/components, /advanced-components, /data-tables, /song/:id, /contact, plus updated home) load successfully within 3 seconds on first visit
- **SC-002**: All 8 existing routes continue to function identically after merge (zero regression)
- **SC-003**: Users can search, sort, and paginate through 100 songs in the data table with sub-500ms interaction response
- **SC-004**: All new components pass accessibility checks (keyboard navigation, ARIA labels, screen reader compatibility)
- **SC-005**: Application passes `npm run lint` and `npm run test` with no errors after merge
- **SC-006**: All user-visible text references "BootstrapSpark" — zero instances of "ReactSparkPortfolio" in production output
- **SC-007**: Site maintains current Lighthouse performance score (90+) after adding new features
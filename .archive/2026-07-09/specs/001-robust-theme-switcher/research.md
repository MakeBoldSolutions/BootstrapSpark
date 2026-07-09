# Research: Robust Theme Switcher

## Decision 1: Use a locally maintained supported-theme catalog as the source of truth

- **Decision**: Keep the list of selectable themes in a first-party catalog owned by BootstrapSpark, with each entry mapped to a supported stylesheet asset and optional Bootswatch-derived metadata.
- **Rationale**: The clarified spec requires a curated supported list and full usability when external metadata is unavailable. A local catalog is the only approach that guarantees bounded support, offline resilience, and predictable review scope.
- **Alternatives considered**:
  - Fetch the full Bootswatch catalog at runtime: rejected because it conflicts with the curated-support decision and current CSP.
  - Hardcode themes directly in UI components: rejected because it duplicates state and makes contract validation difficult.

## Decision 2: Apply curated themes by swapping precompiled stylesheet assets

- **Decision**: Load supported Bootswatch themes as precompiled static CSS assets and switch the active theme by updating a single dedicated stylesheet target.
- **Rationale**: Bootswatch help explicitly documents precompiled CSS as the easiest path, and asset swapping is simpler and less risky than in-browser Sass compilation. It also separates theme switching from the app bundle's TypeScript logic.
- **Alternatives considered**:
  - Rebuild Sass variables dynamically in the browser: rejected because it is complex, slower, and unnecessary for curated themes.
  - Use CDN-hosted theme CSS directly: rejected because it adds runtime network dependency and may require avoidable CSP changes.

## Decision 3: Keep BootstrapSpark as a first-party theme entry in the same contract

- **Decision**: Represent the BootstrapSpark default theme as a first-party `ThemeOption` with the same identifier, preview metadata, and activation flow as curated external themes.
- **Rationale**: This keeps the selector uniform, avoids special-case branching throughout the UI, and preserves BootstrapSpark branding as the canonical fallback.
- **Alternatives considered**:
  - Treat BootstrapSpark as a hidden default outside the catalog: rejected because the spec requires it to appear as a first-class option.
  - Convert BootstrapSpark entirely into a Bootswatch fork: rejected because it would couple the site's brand too tightly to a third-party theme lineage.

## Decision 4: Use optional Bootswatch API mapping, not runtime correctness dependence

- **Decision**: Map Bootswatch API fields into the local catalog when available during curation or refresh flows, but ensure runtime behavior works entirely from local validated data.
- **Rationale**: This satisfies the request to integrate the API where possible without breaking the spec's resilience guarantees or forcing an immediate CSP/network expansion.
- **Alternatives considered**:
  - Ignore the Bootswatch API completely: rejected because the user explicitly asked to integrate it where practical.
  - Require live Bootswatch API access in production: rejected because the feature must work when external metadata is unavailable.

## Decision 5: Validate theme metadata with Zod and mirror existing fallback service patterns

- **Decision**: Create Zod schemas for theme catalog records, optional remote metadata mapping, and persisted theme preference values.
- **Rationale**: The constitution mandates runtime validation for external data, and the codebase already uses service-layer fallback plus validation patterns in project, RSS, and joke services.
- **Alternatives considered**:
  - Trust remote or generated JSON without validation: rejected because it would violate repository standards and increase regression risk.
  - Validate only on initial development import: rejected because persisted preferences and optional enrichment paths still require runtime safety.

## Decision 6: Review compatibility on shared shell and representative content-heavy routes

- **Decision**: The manual theme-support matrix will cover the app shell, primary routes, forms, dropdowns, alerts, cards, and showcase/site-demo pages.
- **Rationale**: Those areas represent the highest-risk Bootstrap/Bootswatch interactions and directly align with the clarified review scope in the spec.
- **Alternatives considered**:
  - Review only the new selector page: rejected because it misses the real regression surface.
  - Review every route under every possible Bootswatch theme: rejected because the spec intentionally limits support to a curated set.
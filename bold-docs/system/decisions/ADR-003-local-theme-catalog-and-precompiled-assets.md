# ADR-003: Use a Local Theme Catalog and Precompiled Theme Assets

## Status

Accepted

## Context

BootstrapSpark needed a robust theme-switching experience that supports the BootstrapSpark default theme plus the Bootswatch catalog while remaining usable when external metadata is unavailable. A runtime dependency on live external theme data would reduce resilience and complicate CSP and fallback behavior.

## Decision

Use a locally maintained supported-theme catalog as the source of truth and apply curated themes by swapping precompiled static stylesheet assets. External Bootswatch metadata may enrich the catalog, but runtime correctness must not depend on it.

## Consequences

### Positive

- Theme selection remains reliable even when external metadata is unavailable.
- Theme switching stays simple and fast because assets are precompiled.

### Negative

- The local catalog and static assets must be maintained as Bootswatch evolves.

## Source

- **Spec**: 001-robust-theme-switcher
- **Release**: v0.1.0
- **Date**: 2026-04-16
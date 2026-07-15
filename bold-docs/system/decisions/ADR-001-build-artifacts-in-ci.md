# ADR-001: Build Artifacts Are Generated in CI, Not Stored in Git

## Status

Accepted

## Context

BootstrapSpark builds to `docs/`, producing hashed filenames on every production build. Keeping `docs/` and coverage reports under git tracking created persistent diff noise that obscured meaningful source changes. The Azure Static Web Apps workflow already builds from source during CI, so committed build output was redundant.

## Decision

Treat `docs/` and `coverage/` as build artifacts only. They are generated locally or in CI when needed, ignored by git, and no longer treated as source-controlled release content.

## Consequences

### Positive

- Git history and pull requests stay focused on source changes.
- CI remains the source of truth for production build output.

### Negative

- Contributors must run a build locally before previewing production output.

## Source

- **Spec**: 001-build-artifact-separation
- **Release**: v0.1.0
- **Date**: 2026-04-16
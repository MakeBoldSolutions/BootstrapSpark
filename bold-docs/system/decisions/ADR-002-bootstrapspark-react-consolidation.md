# ADR-002: Consolidate BootstrapSpark as a Single React SPA

## Status

Accepted

## Context

Two separate Bootstrap-focused showcase repositories overlapped in purpose: one built with React/Vite/TypeScript and one built with vanilla JavaScript, Express, and EJS. Maintaining both created duplicate effort, fragmented feature discovery, and weakened the consistency of the Spark portfolio family.

## Decision

Consolidate the unique JsBootSpark features into the React-based application and standardize the project identity as BootstrapSpark. The merged application keeps a single frontend architecture built on React, Vite, TypeScript, Bootstrap, and a service/model/component structure.

## Consequences

### Positive

- One repository now owns the Bootstrap showcase experience.
- Feature growth stays aligned with the existing TypeScript and React architecture.

### Negative

- The consolidated app inherits a larger routing and component surface that requires stronger regression testing.

## Source

- **Spec**: 001-merge-jsbootspark
- **Release**: v0.1.0
- **Date**: 2026-04-16
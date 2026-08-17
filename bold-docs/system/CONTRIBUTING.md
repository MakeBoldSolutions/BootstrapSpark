# Contributing To BootstrapSpark

BootstrapSpark is a React/Vite demonstration site using Bootstrap 5 plus SCSS. It is paired with TailwindSpark, so build-system changes should preserve the shared command contract unless a Bootstrap-specific divergence is documented.

## Prerequisites

- Node.js `>=26.0.0`
- npm `12.0.2`
- Git

## Setup

Use the repository version files before installing:

```powershell
nvm use
npm install -g npm@12.0.2
```

If `npm install` or `npm ci` reports `EBADENGINE`, the active shell is not using the required Node/npm versions.

```powershell
npm ci
npm run dev
```

## Required Quality Gates

Run these from the repository root before opening a pull request that changes source, build, deployment, or documentation behavior:

```powershell
npm run lint
npm run type-check
npm run test:coverage
npm run build
```

For build-system changes, also run:

```powershell
npm run build:deploy
npm run build:ci
npm run build:analyze
git diff --check
```

## Command Contract

Contributors can rely on these root commands:

- `npm run build`
- `npm run build:deploy`
- `npm run build:ci`
- `npm run dev`
- `npm run preview`
- `npm run sync:data`
- `npm run lint`
- `npm run type-check`
- `npm run test`
- `npm run test:coverage`
- `npm run format`
- `npm run format:check`
- `npm run build:analyze`
- `npm run clean`

## Static Data

Normal builds are deterministic and do not fetch remote repository data. Use `npm run sync:data` only when remote-backed data should be refreshed, then review generated data changes before committing source snapshots.

## Documentation

Update `bold-docs/system/BUILD_SYSTEM.md`, `bold-docs/system/DEPLOYMENT.md`, and related system documentation whenever build commands, runtime requirements, CI behavior, or deployment artifacts change.

Root-level Markdown files other than `README.md` and `CHANGELOG.md` are not accepted.

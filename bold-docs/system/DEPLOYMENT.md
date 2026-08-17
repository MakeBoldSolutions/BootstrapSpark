# Deployment Guide

BootstrapSpark is a static React/Vite site deployed from a generated `docs/` artifact. Azure Static Web Apps is the primary deployment target.

## Runtime

Deployment builds require:

| Requirement | Value      |
| ----------- | ---------- |
| Node.js     | `>=26.0.0` |
| npm         | `12.0.2`   |

Use `npm ci` from the repository root before building.

Install commands are engine-strict. An `EBADENGINE` error means the shell is still using an older Node.js or npm version.

## Local Build

```powershell
npm ci
npm run build
npm run preview
```

`npm run build` creates the production artifact in `docs/` without refreshing remote data.

## Deploy Build

```powershell
npm run build:deploy
```

`build:deploy` is the deploy-target command. It produces the same static `docs/` artifact consumed by Azure Static Web Apps.

## Azure Static Web Apps

The GitHub Actions workflow prebuilds the app with the repository runtime contract, then uploads the generated artifact:

```yaml
app_location: "docs"
api_location: "api"
output_location: ""
skip_app_build: true
```

This avoids rebuilding the app inside the Azure deploy action with a runtime that may differ from Node.js `>=26.0.0` and npm `12.0.2`.

## CI Gates

CI uses:

```powershell
npm run build:ci
```

The CI build sequence runs linting, type checking, coverage, and the deploy build before deployment.

## Static Data

Normal build and deploy commands are deterministic and do not refresh remote data. They generate `.build/data/repositories.json` from the committed fallback snapshot.

Use the explicit refresh command only when remote-backed repository data should be updated:

```powershell
npm run sync:data
```

Review data diffs before committing source snapshots.

## GitHub Releases

Tag-driven GitHub Releases build `docs/` through `npm run build:deploy`, package the static site with release documentation, and publish the bundle plus checksum.

Release documentation must exist at:

```text
bold-docs/system/releases/vX.Y.Z/release-notes.md
```

## Bundle Analysis

Bundle analysis is opt-in and writes:

```text
reports/bundle-analysis.html
```

Run:

```powershell
npm run build:analyze
```

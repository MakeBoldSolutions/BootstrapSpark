# Standards

> Migrated from `.documentation/memory/constitution.md`'s "Additional Standards" and "Governance" sections (`source: migrated(constitution.md)`) — narrower or secondary conventions that don't rise to backbone principles.

## Performance

- Bundle size should be monitored with `npm run build:analyze`, which writes `reports/bundle-analysis.html`
- Code splitting should be used for route-based lazy loading
- Images must use the cache-busting strategy in `imageUtils.ts`
- Asset optimization should be automated in the build pipeline

## SEO & Metadata

- Dynamic meta tags per page via `SEOContext`
- Sitemap and `robots.txt` generated during build
- Open Graph tags should be included; JSON-LD structured data where appropriate

## Deployment

- Azure Static Web Apps is the primary deployment target
- Build output directory must be `/docs` — Vite `outDir: "docs"` writes the static artifact, and Azure Static Web Apps uploads that prebuilt directory
- CI and deployment use Node.js `>=26.0.0` and npm `12.0.2`
- `npm run build` and `npm run build:deploy` must not refresh remote data; use `npm run sync:data` explicitly when remote-backed snapshots should be refreshed
- A `.nojekyll` file is written to `docs/` during build
- `npm run clean` removes `/docs` before each build — never commit build artifacts to `/docs` manually
- CSP configuration must be synchronized across environments
- Version tracking via `__BUILD_DATE__` injection; service worker clears on version changes

## Governance

- All code reviews verify compliance with backbone principles; any violation must be justified in the PR description
- Amendments require documented rationale, maintainer review/approval, a migration plan if applicable, and a version bump
- PRs with root-level `.md` files other than `README.md` and `CHANGELOG.md` are rejected
- PRs with out-of-sync documentation are rejected
- `TODO`/`FIXME` comments in code are rejected — file a GitHub Issue instead

# Standards

> Migrated from `.documentation/memory/constitution.md`'s "Additional Standards" and "Governance" sections (`source: migrated(constitution.md)`) — narrower or secondary conventions that don't rise to backbone principles.

## Performance

- Bundle size should be monitored and optimized
- Code splitting should be used for route-based lazy loading
- Images must use the cache-busting strategy in `imageUtils.ts`
- Asset optimization should be automated in the build pipeline

## SEO & Metadata

- Dynamic meta tags per page via `SEOContext`
- Sitemap and `robots.txt` generated during build
- Open Graph tags should be included; JSON-LD structured data where appropriate

## Deployment

- Dual deployment: Azure Static Web Apps (primary), GitHub Pages (secondary/fallback)
- Build output directory must be `/docs` — single publish folder for both targets (Vite `outDir: "docs"`, Azure SWA `output_location: "docs"`, GitHub Pages served from `/docs` on `main`)
- A `.nojekyll` file is written to `docs/` during build to disable Jekyll processing on GitHub Pages
- `npm run clean` removes `/docs` before each build — never commit build artifacts to `/docs` manually
- CSP configuration must be synchronized across environments
- Version tracking via `__BUILD_DATE__` injection; service worker clears on version changes

## Governance

- All code reviews verify compliance with backbone principles; any violation must be justified in the PR description
- Amendments require documented rationale, maintainer review/approval, a migration plan if applicable, and a version bump
- PRs with root-level `.md` files other than `README.md` and `CHANGELOG.md` are rejected
- PRs with out-of-sync documentation are rejected
- `TODO`/`FIXME` comments in code are rejected — file a GitHub Issue instead

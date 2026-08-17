# Critic Gate: Align BootstrapSpark Build Contract

## Product Owner TL;DR

BootstrapSpark and TailwindSpark are companion demonstration sites. Their build systems should present the same contributor and deployment contract wherever the technology choice does not require a difference, so comparisons between the two sites highlight Bootstrap versus Tailwind rather than accidental repository drift.

## Findings

- Error handling / resilience: **resolved**. `npm run build` now invokes local-only repository data preparation from the committed fallback before Vite copies `.build/data/repositories.json`, while `npm run sync:data` remains the explicit remote refresh path.

- Deployment / rollback: **resolved**. The Azure Static Web Apps workflow now runs `npm run build:ci` after configuring Node.js 26 and npm 12.0.2, then uploads the prebuilt `docs/` artifact with app build skipped.

## Categories Evaluated

- Trust boundaries / auth: inapplicable; this feature changes build commands, CI, and documentation, not application authorization behavior.
- Secrets handling: no finding; the spec does not add new secrets or require secret logging.
- Data loss / continuity: no finding; the feature changes generated artifacts and docs, not persistent user data.
- Input validation: no finding; remote data shape validation remains in the existing sync script, and new untrusted input paths are not introduced by the spec.
- Error handling / resilience: finding above.
- Concurrency: inapplicable; the build-system change does not introduce concurrent runtime flows beyond existing npm/CI task execution.
- Scale bottlenecks: inapplicable; no request path, data query, or runtime scale surface is added.
- Observability: no finding; CI gate execution and validation recording are part of the spec, and production runtime observability is outside this build-contract change.
- Deployment / rollback: finding above.
- Dependency supply chain: no finding; dependency/runtime changes are pinned through `package-lock.json`, package metadata, and CI validation tasks.
- Backward compatibility: no finding; dropping Node 20 support is an intentional ratified decision recorded in the spec.
- Regulatory / privacy: inapplicable; no PII handling, retention, or audit behavior changes are introduced.

## Cross-References

- `bold.plan analyze` has no open findings in `gates/analyze.md`.

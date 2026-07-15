# BootstrapSpark Backbone

1. **TypeScript strict mode is required for all code**; `any` needs explicit justification and a comment.
   <!-- source: migrated(constitution.md) -->
   **Status**: enforced

2. **ESLint and Prettier must be configured and passing** for all code, including React hooks/refresh rules.
   <!-- source: migrated(constitution.md) -->
   **Status**: enforced

3. **All new code requires automated tests**; CI enforces minimum coverage (70% branch, 70% line, 75% function).
   <!-- source: migrated(constitution.md) -->
   **Status**: enforced

4. **Exported functions/components require JSDoc; documentation must reflect current code state.** No `TODO`/`FIXME`/`SPEC` comments in production code — use GitHub Issues instead.
   <!-- source: migrated(constitution.md) -->
   **Status**: enforced

5. **Component architecture stays separated by concern**: `components/`, `services/`, `contexts/`, `hooks/`, `utils/`, `models/` — each single-responsibility.
   <!-- source: migrated(constitution.md) -->
   **Status**: enforced

6. **Errors must be handled gracefully, never crash the app.** React Error Boundaries isolate component failures; async code uses try-catch; API failures fall back (cache → local → notify) rather than breaking the UI.
   <!-- source: migrated(constitution.md) -->
   **Status**: enforced

7. **No debug console statements in production builds** — stripped automatically; critical errors should reach an error-tracking service.
   <!-- source: migrated(constitution.md) -->
   **Status**: enforced

8. **All external data is validated at runtime** (Zod), including env vars at startup. CSP stays synchronized between `staticwebapp.config.json` and `vite.config.ts`.
   <!-- source: migrated(constitution.md) -->
   **Status**: enforced

9. **Bootstrap 5 + SCSS is the styling system**; theme switching (dark/light) is supported; layouts are mobile-first responsive.
   <!-- source: migrated(constitution.md) -->
   **Status**: enforced

10. **Pre-commit and CI gates block bad code**: Husky + lint-staged run ESLint/Prettier/type-check pre-commit; CI runs lint, type-check, tests-with-coverage, and build. Failed checks block merge.
    <!-- source: migrated(constitution.md) -->
    **Status**: enforced

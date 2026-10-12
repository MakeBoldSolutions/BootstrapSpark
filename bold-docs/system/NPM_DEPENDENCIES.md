# NPM dependencies

Validated on 2026-10-11 with npm audit, npm outdated, ncu, npm ci and the CI build. Every direct package has a runtime, asset, type, test or command use below. Transitive dependencies are managed by package-lock.json.

| Package                       | Requested version | Group       | Use                                                             |
| ----------------------------- | ----------------- | ----------- | --------------------------------------------------------------- |
| `@microsoft/signalr`          | `^10.0.11`        | Runtime     | Chat.tsx hub connection                                         |
| `bootstrap`                   | `^5.3.8`          | Runtime     | src/scss/styles.scss and src/main.tsx styles and UI runtime     |
| `bootstrap-icons`             | `^1.13.2`         | Runtime     | src/main.tsx icon CSS/fonts                                     |
| `bootswatch`                  | `^5.3.8`          | Runtime     | scripts/sync-bootswatch-themes.mjs local theme assets           |
| `date-fns`                    | `^4.4.0`          | Runtime     | About.tsx and Articles.tsx date formatting                      |
| `leaflet`                     | `^1.9.4`          | Runtime     | MapComponent.tsx map API and assets                             |
| `react`                       | `^19.3.0`         | Runtime     | src/main.tsx and components rendering/hooks                     |
| `react-bootstrap`             | `^2.10.10`        | Runtime     | src/components/ Bootstrap React components                      |
| `react-bootstrap-icons`       | `^1.11.6`         | Runtime     | src/components/ SVG icon components                             |
| `react-dom`                   | `^19.3.0`         | Runtime     | src/main.tsx createRoot                                         |
| `react-leaflet`               | `^5.0.0`          | Runtime     | MapComponent.tsx React map components                           |
| `react-markdown`              | `^10.1.0`         | Runtime     | Chat.tsx markdown messages                                      |
| `react-router-dom`            | `^7.18.4`         | Runtime     | src/App.tsx and Header.tsx routes/navigation                    |
| `zod`                         | `^4.6.6`          | Runtime     | src/models/ runtime model validation                            |
| `@azure/static-web-apps-cli`  | `^2.0.10`         | Development | package.json dev:swa and preview:swa local emulator             |
| `@eslint/js`                  | `^10.0.1`         | Development | eslint.config.js recommended lint rules                         |
| `@rollup/plugin-strip`        | `^3.0.4`          | Development | vite.config.ts production console/assert stripping              |
| `@testing-library/jest-dom`   | `^7.0.1`          | Development | src/test/setup.ts Vitest DOM matchers                           |
| `@testing-library/react`      | `^16.3.3`         | Development | tests/ and src/test/setup.ts rendering/cleanup                  |
| `@testing-library/user-event` | `^14.6.7`         | Development | tests/ simulated user input                                     |
| `@types/leaflet`              | `^1.9.22`         | Development | TypeScript declarations for MapComponent.tsx Leaflet API        |
| `@types/node`                 | `^26.6.5`         | Development | Node API declarations for configs and scripts                   |
| `@types/react`                | `^19.3.0`         | Development | TypeScript JSX/React component declarations                     |
| `@types/react-dom`            | `^19.3.0`         | Development | TypeScript createRoot declarations                              |
| `@vitejs/plugin-react`        | `^6.1.2`          | Development | vite.config.ts and vitest.config.ts transforms/refresh          |
| `@vitest/coverage-v8`         | `^5.0.3`          | Development | vitest.config.ts coverage provider and test:coverage            |
| `@vitest/ui`                  | `^5.0.3`          | Development | package.json test:ui interactive runner                         |
| `concurrently`                | `^10.0.6`         | Development | package.json start/dev Vite and Sass watchers                   |
| `eslint`                      | `^10.12.0`        | Development | package.json lint and lint-staged checks                        |
| `eslint-plugin-react-hooks`   | `^7.1.1`          | Development | eslint.config.js hook rules                                     |
| `eslint-plugin-react-refresh` | `^0.5.7`          | Development | eslint.config.js Fast Refresh export rules                      |
| `fontawesome-free`            | `^1.0.4`          | Development | vite.config.ts and fontawesome-custom.css icon fonts            |
| `globals`                     | `^17.13.0`        | Development | eslint.config.js browser globals                                |
| `husky`                       | `^9.1.7`          | Development | package.json prepare and .husky/pre-commit Git hooks            |
| `jsdom`                       | `^30.1.2`         | Development | vitest.config.ts test environment                               |
| `lint-staged`                 | `^17.6.0`         | Development | .husky/pre-commit and package.json staged checks                |
| `npm-check-updates`           | `^23.1.1`         | Development | package.json update:check/update:safe/update:major ncu CLI      |
| `prettier`                    | `^3.9.10`         | Development | package.json format/format:check and lint-staged formatting     |
| `rimraf`                      | `^6.1.3`          | Development | package.json clean output/cache removal                         |
| `sass`                        | `^1.105.1`        | Development | package.json build-css/watch-css SCSS compilation               |
| `tsx`                         | `^4.23.15`        | Development | package.json generate-sitemap/generate-robots TypeScript loader |
| `typescript`                  | `~6.0.3`          | Development | package.json build/type-check strict compiler                   |
| `typescript-eslint`           | `^8.71.1`         | Development | eslint.config.js TypeScript lint configuration                  |
| `vite`                        | `^8.3.4`          | Development | package.json dev/build/preview and configs bundler/server       |
| `vite-plugin-static-copy`     | `^4.1.1`          | Development | vite.config.ts fonts, RSS and fallback copying                  |
| `vitest`                      | `^5.0.3`          | Development | tests/, vitest.config.ts and test scripts runner                |

## Compatibility and removals

TypeScript is constrained to `~6.0.3`: latest TypeScript 7.0.2 is outside typescript-eslint 8.71.1 supported peer range (`>=4.8.4 <6.1.0`). Revisit when the linter supports TypeScript 7. All other direct packages were updated to their current stable release. npm outdated and ncu therefore report TypeScript 7 as the one intentional upgrade exception.

Removed unused direct `ts-node` (SEO scripts use `tsx`) and `baseline-browser-mapping` (no direct consumer). Transitive copies may remain if another tool needs them. Leaflet and React Leaflet moved to runtime dependencies. Added npm-check-updates so update scripts work after clean install, and @types/node for directly used Node APIs.

The full audit still reports six high-severity development-tooling findings. See [Security](SECURITY.md#dependency-audit--2026-10-11) for affected chains and remediation limits.

The five `api/proxy-*/package.json` manifests declare no dependencies; their handlers use native platform APIs.

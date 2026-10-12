# Repository instructions

Read `AGENTS.md`, `bold-docs/backbone.md`, and `bold-docs/project.json` before work. Use Bold's ratified tiers and command resolution. Never read `.archive/`; it is human-only history.

Permanent documentation lives in `bold-docs/system/`; active work lives in `bold-docs/features/`. Keep documentation synchronized with code. Use GitHub Issues for production TODO/FIXME items. Preserve generated adapters; edit their source commands instead.

Use Node.js >=26.0.0 and npm 12.2.0. Run `npm ci` and `npm run build:ci` for validation. TypeScript strict mode, JSDoc on exported APIs, tests, ESLint, and Prettier are required by the backbone. Generated `docs/` and coverage outputs are not committed.

- @csp Rule - Content Security Policy Configuration: **CRITICAL - READ BEFORE ANY CSP CHANGES**

  **Why We Need Relaxed CSP:**
  This portfolio site is a FRONTEND that pulls ALL content from markhazleton.com backend services:
  - Project images: https://markhazleton.com/img/*.png
  - JSON data feeds: https://markhazleton.com/projects.json, rss.xml
  - Real-time websockets: wss://web.makeboldspark.com/chatHub
  - Weather API: https://api.openweathermap.org
  - Joke API: https://v2.jokeapi.dev

  **What WILL BREAK if CSP is tightened:**
  ❌ Removing wildcard subdomains `https://*.markhazleton.com` → Service worker can't fetch images
  ❌ Removing `https:` from img-src → External project screenshots won't load
  ❌ Removing `'unsafe-inline'` from script-src → React/Vite won't work in development
  ❌ Removing `blob:` from worker-src → Service worker fails to initialize

  **Required CSP Directives (DO NOT REMOVE):**

  ```
  connect-src: 'self' https://markhazleton.com https://*.markhazleton.com
               https://api.openweathermap.org https://v2.jokeapi.dev
               wss://web.makeboldspark.com ws://localhost:* http://localhost:*

  img-src: 'self' data: https: http: blob:
  font-src: 'self' data: https:
  media-src: 'self' https: http:
  worker-src: 'self' blob:
  script-src: 'self' 'unsafe-inline' 'unsafe-eval'  // Required for React + Vite
  ```

  **Files to Keep in Sync:**
  - `/staticwebapp.config.json` (production on Azure)
  - `/vite.config.ts` (local development)

  **Before ANY CSP security hardening:**
  1. Read `/bold-docs/system/SECURITY.md` completely
  2. Test locally with `npm run dev`
  3. Verify ALL pages load: Home, Projects, Articles, About, Joke, Weather, Chat
  4. Check browser console for CSP violations
  5. If violations exist, the CSP is TOO STRICT for this architecture

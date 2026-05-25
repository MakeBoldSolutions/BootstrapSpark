- @azure Rule - Use Azure Best Practices: When generating code for Azure, running terminal commands for Azure, or performing operations related to Azure, invoke your `azure_development-get_best_practices` tool if available.

- @documentation Rule - Documentation Organization and Quality Standards: **CRITICAL - MANDATORY ENFORCEMENT**

  **Core Philosophy: LESS IS MORE**
  
  Documentation that is out of sync with code is worse than no documentation. Every markdown file is a maintenance burden. Prefer clear, self-documenting code over excessive documentation.
  
  **MANDATORY: Documentation Must Match Current Code**
  
  ALL documentation MUST reflect the CURRENT state of the codebase. Documentation that references:
  - ❌ Future features or "TODO" items
  - ❌ Planned refactoring
  - ❌ Outdated API signatures
  - ❌ Removed functionality
  - ❌ Spec or planning artifacts from completed work
  
  ...MUST be removed or archived immediately. When code changes, update or delete affected documentation in the SAME commit.
  
  **FORBIDDEN: No TODO or Spec Comments in Production Code**
  
  Code files (.ts, .tsx, .js, .jsx) MUST NOT contain:
  - `// TODO:` comments (use GitHub Issues instead)
  - `// FIXME:` comments (fix it or create an issue)
  - `// SPEC:` or spec reference comments
  - Planning notes or implementation strategies in comments
  
  Only acceptable comment types:
  - JSDoc documentation for exported APIs
  - Complex logic explanations (why, not what)
  - Inline rationale for non-obvious implementations
  
  **STRICT FILE LOCATION RULES**
  
  | File Type | Location | Retention |
  |-----------|----------|-----------|
  | Main project README | `/README.md` | Permanent |
  | Permanent documentation | `/.documentation/*.md` | Permanent, keep updated |
  | Working docs (dependency updates, audits, etc) | `.documentation/copilot/archive/YYYY-MM-DD_*.md` | Archive after completion |
  | Agent-generated specs during work | `.documentation/specs/NNN-feature-name/*.md` | Archive to copilot/archive after merge |
  | Copilot audit results | `.documentation/copilot/audit/YYYY-MM-DD_*.md` | Keep timestamped results |
  | Agent prompts | `.github/prompts/*.prompt.md` | Permanent configuration |
  | Agent definitions | `.github/agents/*.agent.md` | Permanent configuration |
  | Issue templates | `.github/ISSUE_TEMPLATE/*.md` | Permanent configuration |
  | Asset credits | `public/assets/**/*.md` | Permanent attribution |
  
  **FORBIDDEN LOCATIONS FOR NEW .md FILES:**
  
  ❌ Never create .md files in repo root (except README.md, CHANGELOG.md, and CLAUDE.md)
  ❌ Never create .md files in `/specs` (use `.documentation/specs` instead)
  ❌ Never create summary/status/checklist docs without archival date in filename
  
  **ARCHIVAL WORKFLOW FOR "SAUSAGE BEING MADE" DOCS**
  
  When creating working documents (audit results, dependency remediation plans, implementation summaries):
  
  1. Create in `.documentation/copilot/archive/` with date prefix: `YYYY-MM-DD_topic.md`
  2. Keep ONLY while actively relevant (days, not weeks)
  3. When work completes:
     - Extract any permanent insights into `/.documentation/*.md`
     - Delete the working doc OR move deeper into dated subfolder
     - Remove all references from code/configs
  
  **CLEANUP TRIGGER POINTS**
  
  Delete or archive working docs immediately when:
  - ✅ Feature/fix is merged to main
  - ✅ Dependencies are updated and tested
  - ✅ Audit is complete and actions taken
  - ✅ Migration/refactoring is finished
  - ✅ Investigation is concluded
  
  **PERMANENT DOCUMENTATION STANDARDS (in /.documentation/)**
  
  Only create permanent docs when they provide lasting value:
  - `ARCHITECTURE.md` - High-level system design (keep updated)
  - `DEPLOYMENT.md` - Deployment procedures (keep updated)
  - `SECURITY.md` - Security model and CSP rationale (keep updated)
  - `CONTRIBUTING.md` - Contribution guidelines
  - `CHANGELOG.md` - Version history (append-only)
  
  NEVER create permanent docs for:
  - Implementation details (put in JSDoc)
  - Temporary status updates
  - Meeting notes or decision logs (use GitHub Discussions)
  - Individual feature specs (archive after completion)
  
  **ENFORCEMENT**
  
  - PRs with root-level .md files (other than README.md, CHANGELOG.md, and CLAUDE.md) MUST be rejected
  - PRs with out-of-sync documentation MUST be rejected
  - Code with TODO comments MUST be rejected (create GitHub Issue instead)
  - Quarterly documentation audits MUST purge stale working docs
  
  **EXAMPLES OF VIOLATIONS:**
  
  ❌ `DEPENDABOT_CHECKLIST.md` in root → Should be `.documentation/copilot/archive/2026-03-01_dependabot-checklist.md`
  ❌ `TODO.md` in root → Delete, create GitHub Issues instead
  ❌ `CSP_AUDIT.md` in root → Should be `.documentation/copilot/archive/2026-02-15_csp-audit.md`
  ❌ `/specs/001-feature/` folder after feature shipped → Archive to `.documentation/copilot/archive/2026-01-20_feature-001/`
  ❌ Code comment `// TODO: Refactor this to use React Query` → Create GitHub Issue or fix it now

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
  1. Read `/.documentation/SECURITY.md` completely
  2. Test locally with `npm run dev`
  3. Verify ALL pages load: Home, Projects, Articles, About, Joke, Weather, Chat
  4. Check browser console for CSP violations
  5. If violations exist, the CSP is TOO STRICT for this architecture

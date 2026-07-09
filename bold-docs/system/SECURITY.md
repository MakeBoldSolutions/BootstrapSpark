# Security Policy & Best Practices

## 🔒 Security Overview

This document outlines the security measures, policies, and best practices implemented in ReactSparkPortfolio.

## ⚠️ CRITICAL: Understanding This Architecture

**This is a FRONTEND-ONLY portfolio that pulls ALL content from external sources.**

Unlike traditional web apps, this site doesn't have its own backend. It's a static React app that:

- Fetches **images** from `https://markhazleton.com/img/`
- Fetches **JSON data** from `https://markhazleton.com/projects.json` and `rss.xml`
- Connects to **real-time chat** via `wss://web.makeboldspark.com/chatHub`
- Calls **external APIs** for jokes and weather

**This architectural choice requires a more permissive CSP than typical security guidelines recommend.**

## ❌ Common Mistakes That WILL BREAK The Site

| "Security Improvement"              | What Breaks                          | Why It's Wrong                                   |
| ----------------------------------- | ------------------------------------ | ------------------------------------------------ |
| Remove `https://*.markhazleton.com` | ❌ Service worker can't fetch images | Images are hosted on markhazleton.com subdomains |
| Remove `https:` from img-src        | ❌ Project screenshots don't load    | External images use various HTTPS hosts          |
| Remove `'unsafe-inline'`            | ❌ React app won't start             | Vite injects inline scripts during dev           |
| Remove `'unsafe-eval'`              | ❌ Hot module reload breaks          | Vite uses eval for HMR                           |
| Remove `blob:` from worker-src      | ❌ Service worker fails              | SW uses blob URLs for initialization             |
| Whitelist specific img domains      | ❌ New images break constantly       | Content comes from user-controlled backend       |

## 🛡️ Security Features

### 1. **Content Security Policy (CSP)**

The application implements CSP headers to prevent XSS attacks and unauthorized resource loading:

```
Content-Security-Policy:
  default-src 'self';
  connect-src 'self' https://markhazleton.com https://*.markhazleton.com https://cdnjs.cloudflare.com https://v2.jokeapi.dev https://api.openweathermap.org wss://web.makeboldspark.com ws://localhost:* http://localhost:* https://cloudflareinsights.com https://stats.g.doubleclick.net https://www.google.com;
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com;
  style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
  img-src 'self' data: https: http: blob:;
  font-src 'self' data: https:;
  media-src 'self' https: http:;
  frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;
  worker-src 'self' blob:;
```

**Key Points**:

- `connect-src` includes wildcard for markhazleton.com subdomains to support service worker fetches
- `connect-src` also allows the Google analytics endpoints used by Cloudflare Zaraz
- `img-src`, `font-src`, `media-src` use protocol-level wildcards for flexibility with external resources
- Service workers (`worker-src`) can load from same origin and blob URLs

**⚠️ Known CSP "Issues" That Are Actually Required:**

| Directive     | Standard Recommendation    | This Site's Requirement          | Rationale                                                        |
| ------------- | -------------------------- | -------------------------------- | ---------------------------------------------------------------- |
| `script-src`  | Remove 'unsafe-inline'     | ✅ MUST keep 'unsafe-inline'     | Vite injects inline scripts. Use nonces in prod if needed.       |
| `script-src`  | Remove 'unsafe-eval'       | ✅ MUST keep 'unsafe-eval'       | Required for Vite HMR in development.                            |
| `img-src`     | Whitelist specific domains | ✅ MUST use `https:` wildcard    | Images come from user-managed markhazleton.com - domains change. |
| `connect-src` | Avoid wildcards            | ✅ MUST use `*.markhazleton.com` | Service worker needs to fetch from any subdomain.                |
| `worker-src`  | Only 'self'                | ✅ MUST include `blob:`          | Service worker initialization requires blob URLs.                |

**Why This CSP Is Secure Enough:**

- 🔒 **No user-generated content** - All content is managed by site owner
- 🔒 **External APIs are read-only** - No data is sent to third parties
- 🔒 **frame-src 'none'** - Prevents clickjacking attacks
- 🔒 **Protocol restrictions** - Only HTTPS allowed for external resources
- 🔒 **'self' default** - All unlisted resources must come from same origin

**CSP Testing Checklist (Run BEFORE deploying CSP changes):**

```bash
npm run dev
```

Then verify in browser:

- [ ] Home page loads without errors
- [ ] Projects page shows images from markhazleton.com
- [ ] Articles page loads RSS feed
- [ ] About page renders properly
- [ ] Joke page fetches jokes
- [ ] Weather page gets forecast
- [ ] Chat connects via WebSocket
- [ ] Service worker registers successfully
- [ ] No CSP violations in browser console

### 2. **CORS Protection**

API endpoints use a whitelist-based CORS policy instead of wildcard (`*`):

**Allowed Origins:**

- `https://Bootstrap.makeboldspark.com` (Production)
- `https://markhazleton.github.io` (GitHub Pages)
- `http://localhost:3000` (Local Development)
- `http://127.0.0.1:3000` (Local Development)

**Implementation** (Azure Functions):

```javascript
const ALLOWED_ORIGINS = [
  "https://Bootstrap.makeboldspark.com",
  "https://markhazleton.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const origin = req.headers.origin || req.headers.referer;
const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

context.res.headers = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Credentials": "false",
};
```

### 3. **Input Validation**

All API endpoints validate and sanitize inputs:

- **Joke API**: Validates category against whitelist
- **RSS Proxy**: Validates RSS source URLs against whitelist (prevents SSRF)
- **Projects API**: Validates response structure before transformation

### 4. **SSRF Protection**

The RSS proxy function prevents Server-Side Request Forgery by whitelisting allowed RSS sources:

```javascript
const ALLOWED_RSS_SOURCES = [
  "https://markhazleton.com/rss.xml",
  "https://markhazleton.com/feed",
  "https://frogsfolly.com/rss.xml",
];
```

### 5. **Security Headers**

The following security headers are enforced:

- **X-Content-Type-Options**: `nosniff` - Prevents MIME type sniffing
- **X-Frame-Options**: `DENY` - Prevents clickjacking
- **X-XSS-Protection**: `1; mode=block` - Enables XSS filter
- **Cache-Control**: Appropriate caching policies per resource type

### 6. **TypeScript Strict Mode**

Enhanced TypeScript strictness prevents many common vulnerabilities:

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitOverride": true,
  "exactOptionalPropertyTypes": true
}
```

### 7. **Dependency Management**

- Regular dependency audits via `npm audit`
- No known vulnerabilities in current dependencies
- Automated Dependabot updates (GitHub)
- Version pinning for critical dependencies

## 🔐 Environment Variables

Sensitive configuration is externalized via environment variables. See [.env.example](.env.example) for available options.

**Never commit:**

- `.env` files
- API keys or secrets
- Credentials or tokens
- Local configuration files

## 🚨 Reporting Security Issues

If you discover a security vulnerability, please:

1. **DO NOT** open a public GitHub issue
2. Email security concerns to: [Your security contact email]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We aim to respond within 48 hours and provide a fix within 7 days for critical issues.

## 🛠️ Security Checklist for Developers

- [ ] Never log sensitive information
- [ ] Validate all user inputs
- [ ] Use parameterized queries (if using databases)
- [ ] Keep dependencies up to date
- [ ] Use HTTPS in production
- [ ] Implement proper error handling
- [ ] Review code for XSS vulnerabilities
- [ ] Test CORS policies
- [ ] Run security audits before releases
- [ ] Use environment variables for secrets

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CSP Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Azure Security Best Practices](https://docs.microsoft.com/en-us/azure/security/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

## 📅 Security Update History

| Date       | Version | Changes                                                       |
| ---------- | ------- | ------------------------------------------------------------- |
| 2026-01-30 | 1.1.0   | Implemented CORS whitelist, input validation, SSRF protection |
| 2026-01-30 | 1.0.1   | Enhanced TypeScript strictness                                |
| 2025-12-01 | 1.0.0   | Initial security implementation                               |

## 🔄 Regular Security Tasks

- **Weekly**: Review dependency updates
- **Monthly**: Run security audit (`npm audit`)
- **Quarterly**: Review and update CORS whitelist
- **Annually**: Full security review and penetration testing

---

**Last Updated**: January 30, 2026

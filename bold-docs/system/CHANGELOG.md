# Changelog

All notable changes to BootstrapSpark will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **GitHub Repository Showcase** — Added a dedicated `/repositories` route presenting Mark Hazleton's public GitHub portfolio. Includes a Zod-validated `Repository` model, a resilient `RepositoryService` with remote fetch → localStorage cache → embedded fallback chain, an Azure Function production proxy (`api/proxy-repositories/`), and a Bootstrap-styled showcase UI with featured highlights, client-side filtering/sorting, and recent activity context. Covered by contract, unit, and integration tests.

### Changed

## [0.1.0] - 2026-04-16

### Added

- **BootstrapSpark consolidation** - Merged the JsBootSpark feature surface into the React-based BootstrapSpark application and standardized the project identity.
- **Robust theme switcher** - Expanded theming toward a richer Bootswatch-backed selector model with local catalog ownership and fallback behavior.
- **Release automation path** - Added tag-driven GitHub Release packaging that ships generated release notes with a built site bundle.

### Changed

- **Build artifact handling** - Stopped treating generated deploy output and coverage reports as source-controlled artifacts, leaving CI responsible for production builds.
- **Release workflow** - `/devspark.release` now relies on the upgraded release context contract in `.documentation/scripts/powershell/release-context.ps1`.

### Architectural Decisions

- **ADR-001**: Build artifacts are generated in CI, not stored in git.
- **ADR-002**: Consolidate BootstrapSpark as a single React SPA.
- **ADR-003**: Use a local theme catalog and precompiled theme assets.

### Contributors

- Mark Hazleton

## [2.0.0] - 2025-01-05

### Added

- **React 19** - Upgraded to latest React with concurrent features
- **TypeScript 5.9** - Enhanced type safety and developer experience
- **Vite 7.0** - Lightning-fast build tool replacing Create React App
- **Bootstrap 5.3.7** - Modern responsive framework with custom SCSS
- **Real-time Chat** - SignalR integration with multiple AI personalities
- **Weather Widget** - Live weather data with interactive maps (Leaflet)
- **RSS Integration** - Dynamic blog post feeds from external sources
- **Project Showcase** - Searchable, sortable portfolio with pagination
- **Dark/Light Theme** - Persistent theme switching with smooth transitions
- **Dual Deployment** - Azure Static Web Apps and GitHub Pages support

### Technical Features

- **SEO Optimization** - Meta tags, Open Graph, JSON-LD structured data
- **Accessibility** - WCAG 2.1 AA compliant with semantic HTML
- **Performance** - Lazy loading, code splitting, optimized bundles
- **CI/CD** - Automated builds and deployments via GitHub Actions
- **Serverless API** - Azure Functions for backend services
- **Image Optimization** - WebP support and responsive images

### Components

- Hero section with animated content
- About section with technology showcase
- Projects gallery with search and filtering
- Articles feed from RSS sources
- Weather forecast with geolocation
- Interactive chat with AI personalities
- Contact information and social links
- Navigation with responsive design

### Infrastructure

- Azure Static Web Apps configuration
- GitHub Actions workflows
- ESLint and TypeScript configuration
- SCSS compilation and optimization
- SEO file generation (sitemap, robots.txt)

## [1.0.0] - 2024-12-01

### Added

- Initial project structure
- Basic React setup with TypeScript
- Bootstrap integration
- Basic component structure
- GitHub repository initialization

### Infrastructure

- Initial Azure Static Web Apps setup
- Basic CI/CD pipeline
- Project documentation foundation

---

## Development Milestones

### 🎯 Current Focus (v2.1.0)

- Enhanced documentation and developer experience
- Performance optimizations
- Accessibility improvements
- Additional AI integrations

### 🚀 Upcoming Features (v3.0.0)

- Progressive Web App (PWA) capabilities
- Enhanced real-time features
- Database integration for dynamic content
- User authentication and profiles
- Advanced analytics and monitoring

### 🔮 Future Vision (v4.0.0)

- Micro-frontend architecture
- GraphQL integration
- Advanced AI/ML features
- Mobile app companion
- Enterprise-grade features

---

## Breaking Changes

### v2.0.0

- **Build System**: Migrated from Create React App to Vite
- **Styling**: Replaced CSS modules with SCSS and Bootstrap
- **TypeScript**: Enabled strict mode requiring type annotations
- **Project Structure**: Reorganized components and assets
- **Dependencies**: Major version updates for React, TypeScript, and tools

## Migration Guides

### From v1.x to v2.x

1. **Update Dependencies**: Run `npm install` to get latest packages
2. **Build Commands**: Use `npm run dev` instead of `npm start`
3. **Environment Variables**: Update `.env` files for Vite format
4. **Import Paths**: Update relative imports for new structure
5. **Custom Styles**: Migrate CSS modules to SCSS if customized

## Security Updates

### v2.0.0

- Updated all dependencies to latest secure versions
- Added Content Security Policy headers
- Implemented proper CORS configuration
- Enhanced input validation and sanitization

## Performance Improvements

### v2.0.0

- **Bundle Size**: Reduced by 40% through code splitting
- **First Paint**: Improved by 60% with lazy loading
- **Build Time**: Reduced by 70% with Vite
- **SEO Score**: Improved to 95+ across all metrics

---

## Contributing to Changelog

When contributing:

1. Add entries to `[Unreleased]` section
2. Use semantic versioning for releases
3. Group changes by type: Added, Changed, Deprecated, Removed, Fixed, Security
4. Link to issues and pull requests where applicable
5. Include migration notes for breaking changes

---

For more details about any release, see the [GitHub Releases](https://github.com/markhazleton/ReactSparkPortfolio/releases) page.

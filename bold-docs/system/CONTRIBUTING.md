# Contributing to ReactSparkPortfolio

Thank you for your interest in contributing to ReactSparkPortfolio! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Git
- Basic knowledge of React, TypeScript, and modern web development

### Development Setup

1. **Fork the repository**

   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/ReactSparkPortfolio.git
   cd ReactSparkPortfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🔄 Development Workflow

### Branch Naming Convention

- `feature/` - New features
- `bugfix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

feat(weather): add humidity display to weather component
fix(chat): resolve SignalR connection timeout issue
docs(readme): update installation instructions
style(header): fix navbar brand sizing
refactor(utils): extract common date formatting functions
test(projects): add unit tests for project filtering
```

### Code Style

- **TypeScript**: Use strict mode, proper typing
- **React**: Functional components with hooks
- **SCSS**: Follow BEM methodology where applicable
- **ESLint**: Code must pass linting (`npm run lint`)

## 🧪 Testing

### Manual Testing

- Test all major features before submitting PR
- Verify responsive design on different screen sizes
- Test dark/light theme switching
- Ensure accessibility compliance

### Code Quality

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Build verification
npm run build
```

## 📝 Pull Request Process

1. **Update documentation** if needed
2. **Test thoroughly** on different browsers/devices
3. **Update CHANGELOG.md** if applicable
4. **Submit PR** with descriptive title and detailed description

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing

- [ ] Tested locally
- [ ] Tested on different browsers
- [ ] Tested responsive design
- [ ] Accessibility verified

## Screenshots

(if applicable)

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🐛 Bug Reports

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:

- **Environment**: OS, browser, Node.js version
- **Steps to reproduce**: Clear, numbered steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable

## ✨ Feature Requests

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) and include:

- **Problem statement**: What problem does this solve?
- **Proposed solution**: How should it work?
- **Alternatives considered**: Other options explored
- **Additional context**: Screenshots, mockups, etc.

## 📋 Project Areas

### Frontend Components

- React components in `/src/components/`
- SCSS styling in `/src/scss/`
- TypeScript interfaces in `/src/models/`

### Backend Integration

- Azure Functions in `/api/`
- Service layers in `/src/services/`
- API integrations

### Documentation

- README updates
- Documentation in `/.documentation/`
- Code comments and JSDoc

## 🔒 Security

- Never commit API keys, secrets, or sensitive data
- Use environment variables for configuration
- Follow Azure security best practices
- Report security issues privately via email

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Code Review**: Ask for feedback on complex changes

## 🏆 Recognition

Contributors will be recognized in:

- GitHub contributors list
- CHANGELOG.md for significant contributions
- Special mentions in release notes

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to ReactSparkPortfolio! 🚀

# Deployment Guide

This guide covers all deployment options for ReactSparkPortfolio, from local development to production hosting.

## Quick Start

### Local Development

```bash
# Clone and setup
git clone https://github.com/markhazleton/ReactSparkPortfolio.git
cd ReactSparkPortfolio
npm install

# Start development server
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Deployment Options

### 1. Azure Static Web Apps (Recommended)

Azure Static Web Apps provides the best experience with integrated CI/CD, serverless functions, and global CDN.

#### Prerequisites

- Azure subscription
- GitHub account
- Azure CLI (optional, for advanced configuration)

#### Setup Process

1. **Fork the Repository**

   ```bash
   # Fork on GitHub, then clone
   git clone https://github.com/YOUR_USERNAME/ReactSparkPortfolio.git
   ```

2. **Create Azure Static Web App**
   - Go to [Azure Portal](https://portal.azure.com)
   - Create new "Static Web App" resource
   - Connect to your GitHub repository
   - Set build configuration:
     - **App location**: `/`
     - **API location**: `api`
     - **Output location**: `docs`

3. **Configure GitHub Actions**

   The Azure portal automatically creates a GitHub Actions workflow file. The key configuration:

   ```yaml
   # .github/workflows/azure-static-web-apps-*.yml
   - name: Build And Deploy
     uses: Azure/static-web-apps-deploy@v1
     with:
       azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
       repo_token: ${{ secrets.GITHUB_TOKEN }}
       action: "upload"
       app_location: "/"
       api_location: "api"
       output_location: "docs"
       app_build_command: "npm run build"
   ```

4. **Custom Domain (Optional)**
   - Add custom domain in Azure portal
   - Configure DNS records
   - SSL certificate is automatically provisioned

#### Environment Variables

For Azure deployment, configure these in the Azure portal:

```bash
# Azure Static Web Apps Configuration
VITE_BASE_URL=https://your-app.azurestaticapps.net
```

#### Features Included

- ✅ Global CDN
- ✅ Automatic SSL certificates
- ✅ Serverless API endpoints
- ✅ Preview deployments for PRs
- ✅ Custom domains
- ✅ Authentication (if needed)

### 2. GitHub Pages

Free hosting option perfect for personal portfolios and demos.

#### Setup Process

1. **Enable GitHub Pages**
   - Go to repository Settings > Pages
   - Source: "Deploy from a branch"
   - Branch: `main`
   - Folder: `/docs`

2. **Configure Build**

   The project is already configured to build to the `/docs` folder:

   ```bash
   npm run build
   git add docs/
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Custom Domain (Optional)**

   ```bash
   # Add CNAME file to public/ directory
   echo "your-domain.com" > public/CNAME
   ```

#### GitHub Actions Workflow

Create `.github/workflows/github-pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        run: |
          git config --global user.name 'GitHub Actions'
          git config --global user.email 'actions@github.com'
          git add docs/
          git commit -m "Deploy to GitHub Pages" || exit 0
          git push
```

#### Limitations

- ❌ No serverless functions
- ❌ No server-side features
- ❌ Limited custom domain features

### 2.1 GitHub Releases From DevSpark

The repository now supports a tag-driven GitHub Release flow that complements `/devspark.release`.

Release contract:

1. Run `/devspark.release` and commit the generated release documentation.
2. Create a semantic version tag that matches the release folder name, for example `v2.1.0`.
3. Push both the commit and the tag.
4. GitHub Actions builds the site, packages the built `docs/` output together with `.documentation/releases/vX.Y.Z/`, and publishes a GitHub Release automatically.

Example:

```bash
git add -A
git commit -m "docs: release v2.1.0"
git push origin main
git tag v2.1.0
git push origin v2.1.0
```

The resulting GitHub Release includes:

- A release body sourced from `.documentation/releases/vX.Y.Z/release-notes.md`
- A zip bundle containing the production site and release documentation
- A SHA-256 checksum for the bundle

The workflow will fail if the pushed tag does not have matching release documentation committed in `.documentation/releases/vX.Y.Z/`.

### 3. Netlify

Popular alternative with excellent developer experience.

#### Setup Process

1. **Connect Repository**
   - Sign up at [Netlify](https://netlify.com)
   - Connect GitHub repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `docs`

2. **Environment Variables**

   ```bash
   VITE_BASE_URL=https://your-site.netlify.app
   ```

3. **Custom Domain**
   - Add domain in Netlify dashboard
   - Configure DNS records
   - SSL is automatic

#### Features

- ✅ Global CDN
- ✅ Automatic SSL
- ✅ Preview deployments
- ✅ Form handling
- ✅ Serverless functions (paid plans)

### 4. Vercel

Optimized for React applications with excellent performance.

#### Setup Process

1. **Deploy from GitHub**
   - Sign up at [Vercel](https://vercel.com)
   - Import GitHub repository
   - Configure:
     - **Framework**: React
     - **Build command**: `npm run build`
     - **Output directory**: `docs`

2. **Environment Variables**

   ```bash
   VITE_BASE_URL=https://your-app.vercel.app
   ```

#### Features

- ✅ Global edge network
- ✅ Automatic SSL
- ✅ Preview deployments
- ✅ Serverless functions
- ✅ Image optimization

### 5. AWS S3 + CloudFront

Enterprise-grade hosting with AWS services.

#### Setup Process

1. **Create S3 Bucket**

   ```bash
   aws s3 mb s3://your-bucket-name
   aws s3 sync docs/ s3://your-bucket-name
   ```

2. **Configure CloudFront**
   - Create CloudFront distribution
   - Origin: S3 bucket
   - Configure custom error pages for SPA routing

3. **Automation with GitHub Actions**

   ```yaml
   - name: Deploy to AWS S3
     run: |
       aws s3 sync docs/ s3://${{ secrets.S3_BUCKET }}
       aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
   ```

## Environment Configuration

### Development Environment

```bash
# .env.development
VITE_BASE_URL=http://localhost:3000
VITE_API_BASE_URL=http://localhost:3001
```

### Production Environment

```bash
# .env.production
VITE_BASE_URL=https://your-domain.com
VITE_API_BASE_URL=https://your-api-domain.com
```

## Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer docs/assets

# Optimize images
npm install -g imagemin-cli
imagemin src/assets/img/* --out-dir=public/assets/img
```

### CDN Configuration

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[hash][extname]",
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js",
      },
    },
  },
});
```

## Monitoring and Analytics

### Azure Application Insights

```html
<!-- Add to index.html -->
<script>
  !(function (T, l, y) {
    /* Application Insights snippet */
  })(
    window,
    document,
    "script",
    "https://js.monitor.azure.com/scripts/b/ai.2.min.js",
    "appInsights"
  );
</script>
```

### Google Analytics

```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

## Security Considerations

### Content Security Policy

```html
<!-- Add to index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://js.monitor.azure.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https:;
  connect-src 'self' https:;
"
/>
```

### Environment Security

- ✅ Never commit API keys to version control
- ✅ Use environment variables for configuration
- ✅ Rotate secrets regularly
- ✅ Enable HTTPS enforcement
- ✅ Configure proper CORS headers

## Troubleshooting

### Common Issues

**Build fails on deployment:**

```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
```

**Routing doesn't work:**

- Ensure SPA fallback is configured
- Check `staticwebapp.config.json` for Azure
- Verify server redirects for other platforms

**API calls fail:**

- Check CORS configuration
- Verify environment variables
- Ensure API endpoints are accessible

**Performance issues:**

- Enable gzip compression
- Configure CDN caching headers
- Optimize images and assets

### Debug Commands

```bash
# Check build output
npm run build 2>&1 | tee build.log

# Test production build locally
npm run preview

# Analyze bundle
npx vite-bundle-analyzer docs/assets

# Check for security vulnerabilities
npm audit
```

## Support

For deployment issues:

- 📧 [GitHub Issues](https://github.com/markhazleton/ReactSparkPortfolio/issues)
- 📖 [Azure Static Web Apps Docs](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- 📖 [GitHub Pages Docs](https://docs.github.com/en/pages)

---

Choose the deployment option that best fits your needs and budget. Azure Static Web Apps is recommended for the full feature set, while GitHub Pages is perfect for simple portfolio sites.

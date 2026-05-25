import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import fs from "fs";
import path from "path";
import strip from "@rollup/plugin-strip";

// Get the current date-time during the build
const buildDate = new Date().toISOString();

// Function to create .nojekyll file
const createNoJekyllFile = () => {
  return {
    name: "create-nojekyll-file",
    closeBundle: () => {
      fs.writeFileSync("docs/.nojekyll", "");
    },
  };
};

export default defineConfig({
  // Set base path explicitly to "/" for Azure Static Web Apps
  // This ensures assets are served from the correct location
  base: "/",
  build: {
    outDir: "docs",
    rollupOptions: {
      output: {
        // Add hash to all file names for cache busting
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          // Keep images in assets/img folder with hash
          if (assetInfo.name && /\.(png|jpg|jpeg|gif|svg|ico)$/.test(assetInfo.name)) {
            return "assets/img/[name]-[hash][extname]";
          }
          // Keep fonts in assets/fonts folder with hash
          if (assetInfo.name && /\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.name)) {
            return "assets/fonts/[name]-[hash][extname]";
          }
          // Everything else in assets folder with hash
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tests": path.resolve(__dirname, "./tests"),
      "@webfonts": "/webfonts", // Alias for webfonts
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Allow importing from node_modules
        loadPaths: ["node_modules"],
      },
    },
  },
  assetsInclude: ["**/*.woff", "**/*.woff2", "**/*.ttf", "**/*.eot"], // Include font files as assets
  plugins: [
    react(),
    createNoJekyllFile(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/fontawesome-free/webfonts/*", // Ensure all FontAwesome fonts are copied
          dest: "webfonts", // Copy to 'docs/webfonts'
        },
        {
          src: "src/data/rss.xml",
          dest: "src/data", // Copy RSS file to the build output
        },
        {
          src: ".build/data/repositories.json",
          dest: "data", // Build-time repository fallback artifact
        },
      ],
    }),
    strip({
      include: "**/*.js",
      functions: ["console.*", "assert.*"],
    }),
  ],
  server: {
    port: 3000,
    headers: {
      // WARNING: This CSP MUST match staticwebapp.config.json
      // DO NOT TIGHTEN - Site pulls all images/data from markhazleton.com
      // See .github/copilot-instructions.md @csp rule for details
      "Content-Security-Policy":
        "default-src 'self'; connect-src 'self' https://markhazleton.com https://*.markhazleton.com https://cdnjs.cloudflare.com https://bootswatch.com https://v2.jokeapi.dev https://api.openweathermap.org https://web.makeboldspark.com wss://web.makeboldspark.com ws://localhost:* http://localhost:* https://cloudflareinsights.com https://stats.g.doubleclick.net https://www.google.com https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; img-src 'self' data: https: http: blob:; font-src 'self' data: https:; media-src 'self' https: http:; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; worker-src 'self' blob:;",
    },
    proxy: {
      "/rss-feed": {
        target: "https://markhazleton.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rss-feed/, "/feed.xml"),
        secure: true,
      },
      "/api/rss": {
        target: "https://markhazleton.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rss/, "/feed.xml"),
        secure: true,
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log("Received Response from the Target:", proxyRes.statusCode, req.url);
          });
        },
      },
      "/api/joke": {
        target: "https://v2.jokeapi.dev",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/joke/, "/joke/Any?safe-mode"),
        secure: true,
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.log("joke proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("Sending Joke Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log("Received Joke Response from the Target:", proxyRes.statusCode, req.url);
          });
        },
      },
      "/api/projects": {
        target: "https://markhazleton.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/projects/, "/projects.json"),
        secure: true,
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.log("projects proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("Sending Projects Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(
              "Received Projects Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
      "/api/repositories": {
        target: "https://markhazleton.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/repositories/, "/repositories.json"),
        secure: true,
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.log("repositories proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("Sending Repositories Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(
              "Received Repositories Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
      "/api/articles": {
        target: "https://markhazleton.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/articles/, "/articles.json"),
        secure: true,
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.log("articles proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("Sending Articles Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(
              "Received Articles Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
      "/api/asyncspark": {
        target: "https://web.makeboldspark.com",
        changeOrigin: true,
        secure: true,
      },
      "/api/PromptSpark": {
        target: "https://web.makeboldspark.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  esbuild: {
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
  },
});

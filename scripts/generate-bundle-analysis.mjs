import fs from "node:fs";
import path from "node:path";

const workspaceRoot = process.cwd();
const distRoot = path.join(workspaceRoot, "docs");
const reportPath = path.join(workspaceRoot, "reports", "bundle-analysis.html");

const collectFiles = (directory) => {
  if (!fs.existsSync(directory)) {
    throw new Error(`Build output directory not found at ${directory}`);
  }

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return collectFiles(fullPath);
    }

    const stats = fs.statSync(fullPath);
    return [
      {
        path: path.relative(distRoot, fullPath).replaceAll(path.sep, "/"),
        size: stats.size,
      },
    ];
  });
};

const formatBytes = (bytes) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kib = bytes / 1024;
  if (kib < 1024) {
    return `${kib.toFixed(1)} KiB`;
  }

  return `${(kib / 1024).toFixed(2)} MiB`;
};

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const files = collectFiles(distRoot).sort((a, b) => b.size - a.size);
const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
const generatedAt = new Date().toISOString();

const rows = files
  .map(
    (file) =>
      `<tr><td>${escapeHtml(file.path)}</td><td>${formatBytes(file.size)}</td><td>${file.size}</td></tr>`
  )
  .join("\n");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>BootstrapSpark Bundle Analysis</title>
    <style>
      body { color: #111827; font-family: Arial, sans-serif; margin: 2rem; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border-bottom: 1px solid #d1d5db; padding: 0.5rem; text-align: left; }
      th { background: #f3f4f6; }
      .summary { margin-bottom: 1.5rem; }
    </style>
  </head>
  <body>
    <h1>BootstrapSpark Bundle Analysis</h1>
    <div class="summary">
      <p>Generated: ${generatedAt}</p>
      <p>Total files: ${files.length}</p>
      <p>Total artifact size: ${formatBytes(totalBytes)}</p>
    </div>
    <table>
      <thead>
        <tr><th>File</th><th>Size</th><th>Bytes</th></tr>
      </thead>
      <tbody>
${rows}
      </tbody>
    </table>
  </body>
</html>
`;

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, html, "utf8");
console.log(`Wrote bundle analysis report to ${reportPath}`);

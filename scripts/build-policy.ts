import type { Rolldown } from "vite";

/** Ignore only known misplaced dependency annotations; forward all other warnings. */
export function handleBuildWarning(
  warning: Rolldown.RollupLog,
  defaultHandler: (warning: Rolldown.RollupLog) => void
) {
  const id = (warning.id ?? "").replaceAll("\\", "/");
  const knownAnnotationFiles = [
    "/node_modules/@microsoft/signalr/dist/esm/Utils.js",
    "/node_modules/zod/v4/core/regexes.js",
    "/node_modules/zod/v4/core/util.js",
  ];
  if (
    warning.code === "INVALID_ANNOTATION" &&
    knownAnnotationFiles.some((file) => id.endsWith(file))
  ) {
    return;
  }
  defaultHandler(warning);
}

/** Keep the shared React runtime in a cacheable chunk while preserving route splitting. */
export function getVendorChunk(id: string): string | undefined {
  const normalizedId = id.replaceAll("\\", "/");
  if (/\/node_modules\/(react|react-dom|scheduler)\//.test(normalizedId)) {
    return "react-vendor";
  }
  return undefined;
}

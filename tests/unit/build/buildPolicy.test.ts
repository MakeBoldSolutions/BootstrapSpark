import { describe, expect, it, vi } from "vitest";
import { getVendorChunk, handleBuildWarning } from "../../../scripts/build-policy";

describe("build warning policy", () => {
  it.each([
    "C:/repo/node_modules/zod/v4/core/regexes.js",
    "C:\\repo\\node_modules\\zod\\v4\\core\\util.js",
    "C:/repo/node_modules/@microsoft/signalr/dist/esm/Utils.js",
  ])("ignores known annotation noise in %s", (id) => {
    const handler = vi.fn();
    handleBuildWarning({ code: "INVALID_ANNOTATION", id, message: "annotation" }, handler);
    expect(handler).not.toHaveBeenCalled();
  });

  it.each([
    { code: "CIRCULAR_DEPENDENCY", id: "C:/repo/node_modules/zod/v4/core/util.js" },
    { code: "INVALID_ANNOTATION", id: "C:/repo/src/util.js" },
    { code: "INVALID_ANNOTATION", id: "C:/repo/node_modules/zod/v4/core/new.js" },
    { code: "INVALID_ANNOTATION" },
  ])("preserves actionable warnings: %j", (warning) => {
    const handler = vi.fn();
    const log = { ...warning, message: "actionable" };
    handleBuildWarning(log, handler);
    expect(handler).toHaveBeenCalledWith(log);
  });
});

describe("vendor chunks", () => {
  it.each(["react", "react-dom", "scheduler"])("groups %s", (name) => {
    expect(getVendorChunk(`C:/repo/node_modules/${name}/index.js`)).toBe("react-vendor");
  });

  it("handles Windows paths", () => {
    expect(getVendorChunk("C:\\repo\\node_modules\\react\\index.js")).toBe("react-vendor");
  });

  it.each([
    "/repo/src/react/index.ts",
    "/repo/node_modules/react-router/index.js",
    "/repo/node_modules/zod/index.js",
  ])("leaves other modules to automatic splitting: %s", (id) => {
    expect(getVendorChunk(id)).toBeUndefined();
  });
});

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { addCacheBuster, forceImageRefresh, clearAllCaches } from "@/utils/imageUtils";

describe("imageUtils", () => {
  describe("addCacheBuster", () => {
    it("should add cache buster parameter to simple URL", () => {
      const url = addCacheBuster("/img/test.png");
      expect(url).toMatch(/\/img\/test\.png\?v=.+/);
    });

    it("should handle URLs with existing query parameters", () => {
      const url = addCacheBuster("/img/test.png?size=large");
      expect(url).toMatch(/\/img\/test\.png\?size=large&v=.+/);
    });

    it("should not modify data URLs", () => {
      const dataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA";
      const result = addCacheBuster(dataUrl);
      expect(result).toBe(dataUrl);
    });

    it("should not add duplicate cache buster", () => {
      const urlWithBuster = "/img/test.png?v=123456";
      const result = addCacheBuster(urlWithBuster);
      expect(result).toBe(urlWithBuster);
    });

    it("should handle empty string", () => {
      const result = addCacheBuster("");
      expect(result).toBe("");
    });

    it("should handle absolute URLs", () => {
      const url = addCacheBuster("https://example.com/img.png");
      expect(url).toMatch(/https:\/\/example\.com\/img\.png\?v=.+/);
    });

    it("should add cache buster to URLs with hash fragments", () => {
      const url = addCacheBuster("/img/test.png#section");
      // Hash fragment ends up after the query parameter
      expect(url).toMatch(/\/img\/test\.png#section\?v=.+/);
    });
  });

  describe("forceImageRefresh", () => {
    it("should add fresh cache buster to URL", () => {
      const url = "/img/test.png";
      const result = forceImageRefresh(url);
      expect(result).toMatch(/\/img\/test\.png\?v=\d+/);
    });

    it("should replace existing cache buster", () => {
      const url = "/img/test.png?v=oldversion";
      const result = forceImageRefresh(url);
      expect(result).toMatch(/\/img\/test\.png\?v=\d+/);
      expect(result).not.toContain("oldversion");
    });

    it("should handle empty string", () => {
      const result = forceImageRefresh("");
      expect(result).toBe("");
    });

    it("should preserve only the base URL", () => {
      const url = "/img/test.png?size=large&format=webp";
      const result = forceImageRefresh(url);
      expect(result).toMatch(/\/img\/test\.png\?v=\d+/);
      expect(result).not.toContain("size=large");
    });

    it("should generate timestamp that is recent", () => {
      const now = Date.now();
      const url = "/img/test.png";
      const result = forceImageRefresh(url);
      const match = result.match(/v=(\d+)/);
      expect(match).toBeTruthy();
      if (match) {
        const timestamp = parseInt(match[1], 10);
        expect(timestamp).toBeGreaterThanOrEqual(now - 100); // Allow 100ms margin
        expect(timestamp).toBeLessThanOrEqual(now + 100);
      }
    });
  });

  describe("clearAllCaches", () => {
    beforeEach(() => {
      localStorage.clear();
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should clear localStorage in development mode", () => {
      localStorage.setItem("test", "value");

      // Mock console.log to suppress output
      const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const reloadPage = vi.fn();
      clearAllCaches(reloadPage);

      expect(localStorage.getItem("test")).toBeNull();
      expect(reloadPage).toHaveBeenCalledOnce();

      consoleLogSpy.mockRestore();
    });
  });
});

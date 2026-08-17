import { describe, it, expect, beforeEach, vi } from "vitest";
import { VersionManager, APP_VERSION } from "@/utils/version";

describe("VersionManager", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("getCurrentVersion", () => {
    it("should return the app version", () => {
      const version = VersionManager.getCurrentVersion();
      expect(version).toBe(APP_VERSION);
      expect(version).toBeTruthy();
    });
  });

  describe("getStoredVersion", () => {
    it("should return null when no version is stored", () => {
      const version = VersionManager.getStoredVersion();
      expect(version).toBeNull();
    });

    it("should return stored version when available", () => {
      localStorage.setItem("app_version", "1.0.0");
      const version = VersionManager.getStoredVersion();
      expect(version).toBe("1.0.0");
    });
  });

  describe("setStoredVersion", () => {
    it("should store version in localStorage", () => {
      VersionManager.setStoredVersion("2.0.0");
      expect(localStorage.getItem("app_version")).toBe("2.0.0");
    });

    it("should overwrite existing version", () => {
      localStorage.setItem("app_version", "1.0.0");
      VersionManager.setStoredVersion("2.0.0");
      expect(localStorage.getItem("app_version")).toBe("2.0.0");
    });
  });

  describe("shouldCheckForUpdates", () => {
    it("should return true when never checked before", () => {
      expect(VersionManager.shouldCheckForUpdates()).toBe(true);
    });

    it("should return false when recently checked", () => {
      const now = Date.now().toString();
      localStorage.setItem("last_version_check", now);
      expect(VersionManager.shouldCheckForUpdates()).toBe(false);
    });

    it("should return true when check interval has passed", () => {
      const oldTime = (Date.now() - 10 * 60 * 1000).toString(); // 10 minutes ago
      localStorage.setItem("last_version_check", oldTime);
      expect(VersionManager.shouldCheckForUpdates()).toBe(true);
    });
  });

  describe("markVersionChecked", () => {
    it("should update last check timestamp", () => {
      const before = Date.now();
      VersionManager.markVersionChecked();
      const timestamp = parseInt(localStorage.getItem("last_version_check") || "0", 10);
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(Date.now());
    });
  });

  describe("hasNewVersion", () => {
    it("should return false when no stored version exists", () => {
      const hasNew = VersionManager.hasNewVersion();
      expect(hasNew).toBe(false);
      // Should also store current version
      expect(localStorage.getItem("app_version")).toBeTruthy();
    });

    it("should return false when versions match", () => {
      const currentVersion = VersionManager.getCurrentVersion();
      VersionManager.setStoredVersion(currentVersion);
      expect(VersionManager.hasNewVersion()).toBe(false);
    });

    it("should return true when versions differ", () => {
      VersionManager.setStoredVersion("old-version-123");
      expect(VersionManager.hasNewVersion()).toBe(true);
    });
  });

  describe("checkForUpdates", () => {
    it("should return false when check interval has not passed", async () => {
      const now = Date.now().toString();
      localStorage.setItem("last_version_check", now);

      const currentVersion = VersionManager.getCurrentVersion();
      VersionManager.setStoredVersion(currentVersion);

      const hasUpdate = await VersionManager.checkForUpdates();
      expect(hasUpdate).toBe(false);
    });

    it("should handle fetch errors gracefully", async () => {
      // Force check by clearing last check time
      localStorage.removeItem("last_version_check");

      // Mock fetch to throw error
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      const consoleWarnSpy = vi.spyOn(console, "warn");

      const hasUpdate = await VersionManager.checkForUpdates();

      expect(hasUpdate).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it("should detect version change via ETag", async () => {
      // Force check
      localStorage.removeItem("last_version_check");

      // Store old ETag
      localStorage.setItem("app_etag", "old-etag");

      // Mock successful fetch with new ETag
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({
          ETag: "new-etag",
        }),
      } as Response);

      const hasUpdate = await VersionManager.checkForUpdates();

      expect(hasUpdate).toBe(true);
      expect(localStorage.getItem("app_etag")).toBe("new-etag");
    });

    it("should detect version change via Last-Modified", async () => {
      // Force check
      localStorage.removeItem("last_version_check");

      // Store old Last-Modified
      localStorage.setItem("app_last_modified", "Wed, 01 Jan 2020 00:00:00 GMT");

      // Mock successful fetch with new Last-Modified
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({
          "Last-Modified": "Thu, 01 Mar 2026 00:00:00 GMT",
        }),
      } as Response);

      const hasUpdate = await VersionManager.checkForUpdates();

      expect(hasUpdate).toBe(true);
    });

    it("should mark version as checked after fetch", async () => {
      // Force check
      localStorage.removeItem("last_version_check");

      // Mock successful fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers(),
      } as Response);

      const before = Date.now();
      await VersionManager.checkForUpdates();
      const timestamp = parseInt(localStorage.getItem("last_version_check") || "0", 10);

      expect(timestamp).toBeGreaterThanOrEqual(before);
    });
  });

  describe("promptForUpdate", () => {
    it("should show confirmation dialog", () => {
      const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

      const result = VersionManager.promptForUpdate();

      expect(confirmSpy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("should return false if user cancels", () => {
      vi.spyOn(window, "confirm").mockReturnValue(false);

      const result = VersionManager.promptForUpdate();

      expect(result).toBe(false);
    });
  });

  describe("forceRefresh", () => {
    it("should clear version-related localStorage keys", () => {
      // Set up the keys that forceRefresh should clear
      localStorage.setItem("app_version", "1.0.0");
      localStorage.setItem("last_version_check", Date.now().toString());
      localStorage.setItem("app_etag", "etag123");
      localStorage.setItem("app_last_modified", "date");
      localStorage.setItem("cachedProjectsData", "{}");
      localStorage.setItem("projectsLastUpdated", Date.now().toString());
      localStorage.setItem("projectsCount", "10");
      localStorage.setItem("projectsSource", "remote");
      localStorage.setItem("cachedRssData", "{}");
      localStorage.setItem("rssLastUpdated", Date.now().toString());
      localStorage.setItem("rssArticleCount", "5");
      localStorage.setItem("rssSource", "remote");
      localStorage.setItem("other_key", "value"); // Should not be cleared

      const reloadPage = vi.fn();
      VersionManager.forceRefresh(reloadPage);

      // Version-related keys should be cleared
      expect(localStorage.getItem("app_version")).toBeNull();
      expect(localStorage.getItem("last_version_check")).toBeNull();
      expect(localStorage.getItem("app_etag")).toBeNull();
      expect(localStorage.getItem("app_last_modified")).toBeNull();

      // Project cache keys should be cleared
      expect(localStorage.getItem("cachedProjectsData")).toBeNull();
      expect(localStorage.getItem("projectsLastUpdated")).toBeNull();
      expect(localStorage.getItem("projectsCount")).toBeNull();
      expect(localStorage.getItem("projectsSource")).toBeNull();

      // RSS cache keys should be cleared
      expect(localStorage.getItem("cachedRssData")).toBeNull();
      expect(localStorage.getItem("rssLastUpdated")).toBeNull();
      expect(localStorage.getItem("rssArticleCount")).toBeNull();
      expect(localStorage.getItem("rssSource")).toBeNull();

      // Other keys should remain
      expect(localStorage.getItem("other_key")).toBe("value");
      expect(reloadPage).toHaveBeenCalledOnce();

      // Clean up
      localStorage.clear();
    });
  });
});

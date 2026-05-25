import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { fetchProjectsData, clearProjectsCache } from "../../../src/services/ProjectService";
import { ProjectData } from "../../../src/models/Project";

// Mock data
const mockProjectsData: ProjectData[] = [
  {
    id: 1,
    image: "img/project1.png",
    p: "Test Project 1",
    d: "Description 1",
    h: "https://example.com/project1",
    slug: "project-1",
    summary: "Summary for project 1",
    keywords: "test, project",
  },
  {
    id: 2,
    image: "https://markhazleton.com/img/project2.png",
    p: "Test Project 2",
    d: "Description 2",
    h: "https://example.com/project2",
    slug: "project-2",
    summary: "Summary for project 2",
    keywords: "test, project",
  },
];

describe("ProjectService", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all mocks
    vi.clearAllMocks();
    // Reset fetch mock
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch projects from remote source successfully", async () => {
    // Mock successful fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProjectsData,
    });

    const projects = await fetchProjectsData();

    expect(projects).toBeDefined();
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
    expect(fetch).toHaveBeenCalled();

    // Verify data is cached
    const cachedData = localStorage.getItem("cachedProjectsData");
    expect(cachedData).toBeTruthy();
  });

  it("should use cached data when available and fresh", async () => {
    // Setup fresh cache
    const cachedProjects = mockProjectsData;
    localStorage.setItem("cachedProjectsData", JSON.stringify(cachedProjects));
    localStorage.setItem("projectsLastUpdated", new Date().toISOString());
    localStorage.setItem("app_version", "1.0.0");
    localStorage.setItem("projectsCacheVersion", "1.0.0");

    // Mock fetch (should not be called)
    global.fetch = vi.fn();

    const projects = await fetchProjectsData();

    expect(projects).toEqual(cachedProjects);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("should fall back to cache when remote fetch fails", async () => {
    // Setup cache
    localStorage.setItem("cachedProjectsData", JSON.stringify(mockProjectsData));
    localStorage.setItem("projectsLastUpdated", new Date().toISOString());

    // Mock failed fetch
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const projects = await fetchProjectsData();

    expect(projects).toEqual(mockProjectsData);
    expect(projects.length).toBe(2);
  });

  it("should fall back to local JSON when cache and remote both fail", async () => {
    // No cache
    localStorage.clear();

    // Mock failed fetch
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const projects = await fetchProjectsData();

    // Should still return data from local JSON file
    expect(Array.isArray(projects)).toBe(true);
    // Local projects.json will have data
    expect(projects.length).toBeGreaterThan(0);
  });

  it("should invalidate cache on version change", async () => {
    // Setup cache with old version
    localStorage.setItem("cachedProjectsData", JSON.stringify(mockProjectsData));
    localStorage.setItem("projectsLastUpdated", new Date().toISOString());
    localStorage.setItem("app_version", "2.0.0");
    localStorage.setItem("projectsCacheVersion", "1.0.0");

    // Mock successful fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProjectsData,
    });

    const projects = await fetchProjectsData();

    // Should have fetched fresh data due to version mismatch
    expect(fetch).toHaveBeenCalled();
    expect(projects).toBeDefined();
  });

  it("should invalidate cache when expired (>1 hour)", async () => {
    // Setup old cache (2 hours ago)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    localStorage.setItem("cachedProjectsData", JSON.stringify(mockProjectsData));
    localStorage.setItem("projectsLastUpdated", twoHoursAgo.toISOString());
    localStorage.setItem("app_version", "1.0.0");
    localStorage.setItem("projectsCacheVersion", "1.0.0");

    // Mock successful fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProjectsData,
    });

    const projects = await fetchProjectsData();

    // Should have fetched fresh data due to expired cache
    expect(fetch).toHaveBeenCalled();
    expect(projects).toBeDefined();
  });

  it("should clear projects cache", () => {
    // Setup cache
    localStorage.setItem("cachedProjectsData", JSON.stringify(mockProjectsData));
    localStorage.setItem("projectsLastUpdated", new Date().toISOString());
    localStorage.setItem("projectsCount", "2");
    localStorage.setItem("projectsSource", "remote");
    localStorage.setItem("projectsCacheVersion", "1.0.0");

    clearProjectsCache();

    expect(localStorage.getItem("cachedProjectsData")).toBeNull();
    expect(localStorage.getItem("projectsLastUpdated")).toBeNull();
    expect(localStorage.getItem("projectsCount")).toBeNull();
    expect(localStorage.getItem("projectsSource")).toBeNull();
    expect(localStorage.getItem("projectsCacheVersion")).toBeNull();
  });

  it("should reject invalid data with Zod validation", async () => {
    // Mock fetch with invalid data (missing required fields)
    const invalidData = [
      {
        id: "not-a-number", // Invalid: should be number
        image: "",
        p: "",
        d: "",
        h: "not-a-url", // Invalid: should be valid URL
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => invalidData,
    });

    const projects = await fetchProjectsData();

    // Should fall back to local projects.json
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
  });
});

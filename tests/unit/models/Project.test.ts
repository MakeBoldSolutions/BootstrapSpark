import { describe, it, expect, vi, beforeEach } from "vitest";
import Project, { ProjectDataSchema, ProjectDataArraySchema } from "../../../src/models/Project";
import type { ProjectData } from "../../../src/models/Project";
import * as ProjectService from "../../../src/services/ProjectService";

/** Minimal valid ProjectData fixture */
const makeProject = (overrides: Partial<ProjectData> = {}): ProjectData => ({
  id: 1,
  image: "https://markhazleton.com/img/project.png",
  p: "Test Project",
  d: "Test Description",
  h: "https://example.com",
  slug: "test-project",
  summary: "A test project summary",
  keywords: "test, project",
  ...overrides,
});

describe("ProjectDataSchema", () => {
  it("should validate valid project data", () => {
    expect(() => ProjectDataSchema.parse(makeProject())).not.toThrow();
  });

  it("should reject negative project ID", () => {
    expect(() => ProjectDataSchema.parse(makeProject({ id: -1 }))).toThrow(
      "Project ID must be a positive integer"
    );
  });

  it("should reject zero project ID", () => {
    expect(() => ProjectDataSchema.parse(makeProject({ id: 0 }))).toThrow();
  });

  it("should reject fractional project ID", () => {
    expect(() => ProjectDataSchema.parse(makeProject({ id: 1.5 }))).toThrow();
  });

  it("should reject empty image path", () => {
    expect(() => ProjectDataSchema.parse(makeProject({ image: "" }))).toThrow(
      "Project image path cannot be empty"
    );
  });

  it("should reject empty project title", () => {
    expect(() => ProjectDataSchema.parse(makeProject({ p: "" }))).toThrow(
      "Project title cannot be empty"
    );
  });

  it("should reject empty project description", () => {
    expect(() => ProjectDataSchema.parse(makeProject({ d: "" }))).toThrow(
      "Project description cannot be empty"
    );
  });

  it("should reject invalid URL in project link", () => {
    expect(() => ProjectDataSchema.parse(makeProject({ h: "not-a-url" }))).toThrow(
      "Project link must be a valid URL"
    );
  });

  it("should reject missing required fields", () => {
    expect(() => ProjectDataSchema.parse({ id: 1, image: "/img/test.png" })).toThrow();
  });

  it("should accept optional fields when present", () => {
    const data = makeProject({
      category: "frontend",
      featured: true,
      featuredType: "npm",
      systemUrl: "https://system.example.com",
      platform: "external",
      image_metadata: {
        width: 400,
        height: 250,
        format: "png",
        thumbnail: "https://markhazleton.com/img/optimized/thumbnails/test-thumb.jpg",
        thumbnailWidth: 400,
        thumbnailHeight: 250,
        webp: "https://markhazleton.com/img/optimized/webp/test.webp",
        optimizedAt: "2026-01-01T00:00:00.000Z",
        fileSize: 10000,
        thumbnailSize: 5000,
      },
    });
    expect(() => ProjectDataSchema.parse(data)).not.toThrow();
  });

  it("should accept project without optional fields", () => {
    const minimal = makeProject();
    expect(() => ProjectDataSchema.parse(minimal)).not.toThrow();
  });
});

describe("ProjectDataArraySchema", () => {
  it("should validate array of valid projects", () => {
    const validProjects = [
      makeProject({ id: 1, h: "https://example.com/1" }),
      makeProject({ id: 2, slug: "project-2", h: "https://example.com/2", p: "Project 2" }),
    ];
    expect(() => ProjectDataArraySchema.parse(validProjects)).not.toThrow();
  });

  it("should reject empty array", () => {
    expect(() => ProjectDataArraySchema.parse([])).toThrow("Projects array cannot be empty");
  });

  it("should reject array with invalid project", () => {
    const invalidProjects = [makeProject({ id: 1 }), makeProject({ id: -1 })];
    expect(() => ProjectDataArraySchema.parse(invalidProjects)).toThrow();
  });
});

describe("Project Class", () => {
  it("should create project instance with valid data", () => {
    const project = new Project(makeProject());

    expect(project.id).toBe(1);
    expect(project.image).toBe("https://markhazleton.com/img/project.png");
    expect(project.p).toBe("Test Project");
    expect(project.d).toBe("Test Description");
    expect(project.h).toBe("https://example.com");
    expect(project.slug).toBe("test-project");
    expect(project.summary).toBe("A test project summary");
    expect(project.keywords).toBe("test, project");
  });

  it("should expose optional fields when provided", () => {
    const project = new Project(
      makeProject({ category: "frontend", featured: true, platform: "external" })
    );
    expect(project.category).toBe("frontend");
    expect(project.featured).toBe(true);
    expect(project.platform).toBe("external");
  });

  describe("formatTitle", () => {
    it("should return title when valid", () => {
      const project = new Project(makeProject({ p: "Test Project" }));
      expect(project.formatTitle()).toBe("Test Project");
    });

    it('should return "Untitled Project" for empty title', () => {
      const project = new Project(makeProject({ p: "" }));
      expect(project.formatTitle()).toBe("Untitled Project");
    });

    it('should return "Untitled Project" for whitespace-only title', () => {
      const project = new Project(makeProject({ p: "   " }));
      expect(project.formatTitle()).toBe("Untitled Project");
    });

    it("should return title as-is when non-empty after trim", () => {
      const project = new Project(makeProject({ p: "  Test  " }));
      expect(project.formatTitle()).toBe("  Test  ");
    });
  });

  describe("formatDescription", () => {
    it("should return description when valid", () => {
      const project = new Project(makeProject({ d: "Test Description" }));
      expect(project.formatDescription()).toBe("Test Description");
    });

    it('should return "No description available." for empty description', () => {
      const project = new Project(makeProject({ d: "" }));
      expect(project.formatDescription()).toBe("No description available.");
    });

    it('should return "No description available." for whitespace-only description', () => {
      const project = new Project(makeProject({ d: "   " }));
      expect(project.formatDescription()).toBe("No description available.");
    });

    it("should return description as-is when non-empty after trim", () => {
      const project = new Project(makeProject({ d: "  Description  " }));
      expect(project.formatDescription()).toBe("  Description  ");
    });
  });

  describe("formatLink", () => {
    it("should return link when valid", () => {
      const project = new Project(makeProject({ h: "https://example.com" }));
      expect(project.formatLink()).toBe("https://example.com");
    });

    it('should return "#" for empty link', () => {
      const project = new Project(makeProject({ h: "" }));
      expect(project.formatLink()).toBe("#");
    });

    it('should return "#" for whitespace-only link', () => {
      const project = new Project(makeProject({ h: "   " }));
      expect(project.formatLink()).toBe("#");
    });
  });

  describe("getThumbnailUrl", () => {
    it("should return thumbnail URL when image_metadata present", () => {
      const project = new Project(
        makeProject({
          image: "https://markhazleton.com/img/original.png",
          image_metadata: {
            width: 1426,
            height: 893,
            format: "png",
            thumbnail: "/img/optimized/thumbnails/test-thumb.jpg",
            thumbnailWidth: 400,
            thumbnailHeight: 250,
            webp: "/img/optimized/webp/test.webp",
            optimizedAt: "2026-01-01T00:00:00.000Z",
            fileSize: 73222,
            thumbnailSize: 14335,
          },
        })
      );
      expect(project.getThumbnailUrl()).toBe(
        "https://markhazleton.com/img/optimized/thumbnails/test-thumb.jpg"
      );
    });

    it("should return main image when image_metadata is absent", () => {
      const project = new Project(
        makeProject({ image: "https://markhazleton.com/img/original.png" })
      );
      expect(project.getThumbnailUrl()).toBe("https://markhazleton.com/img/original.png");
    });

    it("should return absolute URL for relative thumbnail path", () => {
      const project = new Project(
        makeProject({
          image: "https://markhazleton.com/img/original.png",
          image_metadata: {
            width: 400,
            height: 250,
            format: "jpg",
            thumbnail: "/img/optimized/thumbnails/test-thumb.jpg",
            thumbnailWidth: 400,
            thumbnailHeight: 250,
            webp: "/img/optimized/webp/test.webp",
            optimizedAt: "2026-01-01T00:00:00.000Z",
            fileSize: 10000,
            thumbnailSize: 5000,
          },
        })
      );
      expect(project.getThumbnailUrl()).toMatch(/^https:\/\/markhazleton\.com\//);
    });
  });

  describe("loadProjects", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should load projects successfully", async () => {
      const mockData = [
        makeProject({ id: 1, h: "https://example.com/1" }),
        makeProject({ id: 2, slug: "project-2", h: "https://example.com/2", p: "Project 2" }),
      ];

      vi.spyOn(ProjectService, "fetchProjectsData").mockResolvedValue(mockData);

      const projects = await Project.loadProjects();

      expect(projects).toHaveLength(2);
      expect(projects[0]).toBeInstanceOf(Project);
      expect(projects[0].id).toBe(1);
      expect(projects[0].p).toBe("Test Project");
      expect(projects[1].id).toBe(2);
    });

    it("should return empty array when no projects available", async () => {
      vi.spyOn(ProjectService, "fetchProjectsData").mockResolvedValue([]);

      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const projects = await Project.loadProjects();

      expect(projects).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalledWith("Projects data is empty or not available.");

      consoleWarnSpy.mockRestore();
    });

    it("should return empty array when projects data is null", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(ProjectService, "fetchProjectsData").mockResolvedValue(null as any);

      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const projects = await Project.loadProjects();

      expect(projects).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalledWith("Projects data is empty or not available.");

      consoleWarnSpy.mockRestore();
    });

    it("should handle fetch errors gracefully", async () => {
      const mockError = new Error("Network error");
      vi.spyOn(ProjectService, "fetchProjectsData").mockRejectedValue(mockError);

      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const projects = await Project.loadProjects();

      expect(projects).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error loading projects:", mockError);

      consoleErrorSpy.mockRestore();
    });

    it("should map all project properties correctly", async () => {
      const mockData = [
        makeProject({
          id: 42,
          image: "https://markhazleton.com/img/special.png",
          p: "Special Project",
          d: "Special Description",
          h: "https://special.example.com",
          slug: "special-project",
          summary: "A special project summary",
          keywords: "special",
          category: "patterns-experiments",
          platform: "external",
        }),
      ];

      vi.spyOn(ProjectService, "fetchProjectsData").mockResolvedValue(mockData);

      const projects = await Project.loadProjects();

      expect(projects[0].id).toBe(42);
      expect(projects[0].image).toBe("https://markhazleton.com/img/special.png");
      expect(projects[0].p).toBe("Special Project");
      expect(projects[0].d).toBe("Special Description");
      expect(projects[0].h).toBe("https://special.example.com");
      expect(projects[0].slug).toBe("special-project");
      expect(projects[0].summary).toBe("A special project summary");
      expect(projects[0].category).toBe("patterns-experiments");
      expect(projects[0].platform).toBe("external");
    });
  });
});

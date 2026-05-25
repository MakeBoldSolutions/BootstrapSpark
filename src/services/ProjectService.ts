/**
 * Service for fetching Projects data with fallback to local file
 */
import projectsData from "../data/projects.json";
import { addCacheBuster } from "../utils/imageUtils";
import { ProjectData, ProjectDataArraySchema } from "../models/Project";
import { ZodError } from "zod";
import { isDevelopmentEnvironment, isCacheFresh } from "../utils/serviceCache";

/**
 * Fetches the projects data with fallback to local file
 * @returns Array of project data
 */
export const fetchProjectsData = async (): Promise<ProjectData[]> => {
  // Use proxy in development, direct URL in production
  const projectsSourceUrl = isDevelopmentEnvironment()
    ? "/api/projects" // Use Vite proxy in development
    : "/api/proxy-projects"; // Use Azure Function proxy in production

  try {
    let projectsJsonData: ProjectData[];
    let sourceDescription: string;

    // Check cache first to avoid unnecessary network requests
    const cachedData = localStorage.getItem("cachedProjectsData");
    const lastUpdated = localStorage.getItem("projectsLastUpdated");
    const cachedVersion = localStorage.getItem("projectsCacheVersion");
    const currentVersion = localStorage.getItem("app_version");

    // Invalidate cache if app version changed or TTL expired (5 min dev / 1 hr prod)
    const isCacheValid = isCacheFresh(lastUpdated, cachedVersion);

    // Use cache if it's fresh and version matches
    if (cachedData && isCacheValid) {
      console.log("Using fresh cached Projects data");
      const projects = JSON.parse(cachedData);
      console.log(`Successfully loaded ${projects.length} projects from cached data`);
      return projects;
    } else if (cachedData && !isCacheValid) {
      console.log("Cache invalidated due to version change or expiration");
    }

    try {
      console.log("Attempting to fetch Projects directly from source...");

      // Try direct fetch with CORS mode and shorter timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(projectsSourceUrl, {
        headers: {
          Accept: "application/json, */*",
          "Cache-Control": "no-cache",
        },
        mode: "cors",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`Direct fetch failed: ${response.status} ${response.statusText}`);
        throw new Error(`Failed to fetch Projects: ${response.status} ${response.statusText}`);
      }

      projectsJsonData = await response.json();
      sourceDescription = "remote";
      console.log("Successfully fetched Projects data from remote source");
    } catch (directError) {
      console.warn("Direct fetch failed, checking cache:", directError);

      // Check if we have any cached version (even if stale)
      if (cachedData) {
        console.log("Using cached Projects data from localStorage (potentially stale)");
        projectsJsonData = JSON.parse(cachedData);
        sourceDescription = "cache";
      } else {
        console.warn("No cache available, using local file");
        // Last resort: use the local file data
        console.log("Using embedded local projects data");
        projectsJsonData = projectsData as ProjectData[];
        sourceDescription = "local file";
        console.log("Successfully loaded Projects data from local file");
      }
    }

    // Validate and transform the data with Zod
    let validatedProjects: ProjectData[];
    try {
      // First validate the array structure
      if (!Array.isArray(projectsJsonData)) {
        throw new Error("Projects data is not an array");
      }

      // Transform image URLs before validation
      const toAbsolute = (path: string): string => {
        if (!path || path.startsWith("http")) return path;
        const cleaned = path.startsWith("/") ? path.substring(1) : path;
        return `https://markhazleton.com/${cleaned}`;
      };

      const transformedProjects = projectsJsonData.map((project) => {
        // Transform main image URL
        if (project.image) {
          project.image = addCacheBuster(toAbsolute(project.image));
        }
        // Transform image_metadata thumbnail and webp paths
        if (project.image_metadata) {
          if (project.image_metadata.thumbnail) {
            project.image_metadata = {
              ...project.image_metadata,
              thumbnail: toAbsolute(project.image_metadata.thumbnail),
              webp: project.image_metadata.webp
                ? toAbsolute(project.image_metadata.webp)
                : project.image_metadata.webp,
            };
          }
        }
        return project;
      });

      // Validate with Zod schema
      validatedProjects = ProjectDataArraySchema.parse(transformedProjects);

      console.log(
        `Successfully validated ${validatedProjects.length} projects from ${sourceDescription}`
      );
    } catch (error) {
      if (error instanceof ZodError) {
        // Fall back to cache if available
        if (cachedData && sourceDescription !== "cache") {
          console.log("Validation failed, falling back to cached data");
          const cachedProjects = JSON.parse(cachedData);
          try {
            validatedProjects = ProjectDataArraySchema.parse(cachedProjects);
          } catch {
            // If cache is also invalid, fall back to local
            return projectsData as ProjectData[];
          }
        } else {
          // If no cache, fall back to local data
          return projectsData as ProjectData[];
        }
      } else {
        throw error;
      }
    }

    // Store in localStorage for future fallback (only if from remote source)
    if (sourceDescription === "remote") {
      try {
        localStorage.setItem("cachedProjectsData", JSON.stringify(validatedProjects));
        localStorage.setItem("projectsLastUpdated", new Date().toISOString());
        localStorage.setItem("projectsCount", validatedProjects.length.toString());
        localStorage.setItem("projectsSource", sourceDescription);
        localStorage.setItem("projectsCacheVersion", currentVersion || "unknown");
      } catch (storageError) {
        console.warn("Failed to cache Projects data:", storageError);
      }
    }

    return validatedProjects;
  } catch (error) {
    console.error("All Projects fetching methods failed:", error);

    // Final fallback to embedded local data
    console.log("Using final fallback to embedded local projects data");
    return projectsData as ProjectData[];
  }
};

/**
 * Clears the projects cache
 */
export const clearProjectsCache = (): void => {
  try {
    localStorage.removeItem("cachedProjectsData");
    localStorage.removeItem("projectsLastUpdated");
    localStorage.removeItem("projectsCount");
    localStorage.removeItem("projectsSource");
    localStorage.removeItem("projectsCacheVersion");
    console.log("Projects cache cleared successfully");
  } catch (error) {
    console.warn("Failed to clear projects cache:", error);
  }
};

/**
 * Gets cache information
 */
export const getProjectsCacheInfo = () => {
  const lastUpdated = localStorage.getItem("projectsLastUpdated");
  const count = localStorage.getItem("projectsCount");
  const source = localStorage.getItem("projectsSource");

  return {
    lastUpdated: lastUpdated ? new Date(lastUpdated) : null,
    count: count ? parseInt(count, 10) : 0,
    source: source || "unknown",
    hasCache: !!localStorage.getItem("cachedProjectsData"),
  };
};

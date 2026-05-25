import fallbackRepositories from "../data/repositories.json";
import {
  RepositoryFeed,
  RepositoryFeedSchema,
  RepositoryShowcaseViewModel,
  buildShowcaseViewModel,
} from "../models/Repository";
import { ZodError } from "zod";
import { isDevelopmentEnvironment, isCacheFresh } from "../utils/serviceCache";

const CACHE_KEYS = {
  data: "cachedRepositoriesData",
  lastUpdated: "repositoriesLastUpdated",
  count: "repositoriesCount",
  source: "repositoriesSource",
  version: "repositoriesCacheVersion",
} as const;

const getRepositorySourceUrl = (): string =>
  isDevelopmentEnvironment() ? "/api/repositories" : "/api/proxy-repositories";

const parseFeed = (candidate: unknown): RepositoryFeed => RepositoryFeedSchema.parse(candidate);

const getStoredFeed = (): RepositoryFeed | null => {
  const cachedData = localStorage.getItem(CACHE_KEYS.data);
  if (!cachedData) {
    return null;
  }

  try {
    return parseFeed(JSON.parse(cachedData));
  } catch {
    return null;
  }
};

const isFreshCache = (): boolean =>
  isCacheFresh(
    localStorage.getItem(CACHE_KEYS.lastUpdated),
    localStorage.getItem(CACHE_KEYS.version)
  );

const cacheFeed = (feed: RepositoryFeed, source: "remote" | "cache" | "local"): void => {
  const currentVersion = localStorage.getItem("app_version") || "unknown";

  localStorage.setItem(CACHE_KEYS.data, JSON.stringify(feed));
  localStorage.setItem(CACHE_KEYS.lastUpdated, new Date().toISOString());
  localStorage.setItem(CACHE_KEYS.count, String(feed.repositories.length));
  localStorage.setItem(CACHE_KEYS.source, source);
  localStorage.setItem(CACHE_KEYS.version, currentVersion);
};

const fetchRemoteFeed = async (): Promise<RepositoryFeed> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(getRepositorySourceUrl(), {
      method: "GET",
      headers: {
        Accept: "application/json, */*",
        "Cache-Control": "no-cache",
      },
      mode: "cors",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch repositories: ${response.status} ${response.statusText}`);
    }

    const payload = await response.json();
    return parseFeed(payload);
  } finally {
    clearTimeout(timeoutId);
  }
};

const fetchBuildArtifactFeed = async (): Promise<RepositoryFeed | null> => {
  try {
    const response = await fetch("/data/repositories.json", {
      method: "GET",
      headers: {
        Accept: "application/json, */*",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return parseFeed(payload);
  } catch {
    return null;
  }
};

const getFallbackFeed = (): RepositoryFeed => {
  return parseFeed(fallbackRepositories);
};

/**
 * Loads repository showcase data using remote, cache, build-artifact, and embedded fallbacks.
 * @param forceRefresh When true, bypasses the current cache and refetches remote data.
 * @returns Repository showcase data ready for rendering.
 */
export const fetchRepositoryShowcaseData = async (
  forceRefresh = false
): Promise<RepositoryShowcaseViewModel> => {
  const cachedFeed = getStoredFeed();
  const cachedLastUpdated = localStorage.getItem(CACHE_KEYS.lastUpdated);

  if (!forceRefresh && cachedFeed && isFreshCache()) {
    return buildShowcaseViewModel(cachedFeed, "cache", cachedLastUpdated);
  }

  try {
    const remoteFeed = await fetchRemoteFeed();
    cacheFeed(remoteFeed, "remote");
    return buildShowcaseViewModel(remoteFeed, "remote", new Date().toISOString());
  } catch (remoteError) {
    if (cachedFeed) {
      return buildShowcaseViewModel(cachedFeed, "cache", cachedLastUpdated);
    }

    try {
      const buildArtifactFeed = await fetchBuildArtifactFeed();
      if (buildArtifactFeed) {
        return buildShowcaseViewModel(
          buildArtifactFeed,
          "local",
          buildArtifactFeed.metadata.generated_at
        );
      }

      const localFeed = getFallbackFeed();
      return buildShowcaseViewModel(localFeed, "local", localFeed.metadata.generated_at);
    } catch (localError) {
      if (remoteError instanceof ZodError || localError instanceof ZodError) {
        throw new Error("Repository feed validation failed across all sources.", {
          cause: localError,
        });
      }
      throw new Error("Repository data is not available from remote, cache, or local fallback.", {
        cause: localError,
      });
    }
  }
};

/** Clears all cached repository showcase values from local storage. */
export const clearRepositoriesCache = (): void => {
  localStorage.removeItem(CACHE_KEYS.data);
  localStorage.removeItem(CACHE_KEYS.lastUpdated);
  localStorage.removeItem(CACHE_KEYS.count);
  localStorage.removeItem(CACHE_KEYS.source);
  localStorage.removeItem(CACHE_KEYS.version);
};

/**
 * Returns cache metadata for the repository showcase.
 * @returns Cache presence, timestamp, item count, and source label.
 */
export const getRepositoriesCacheInfo = () => {
  const lastUpdated = localStorage.getItem(CACHE_KEYS.lastUpdated);
  const count = localStorage.getItem(CACHE_KEYS.count);
  const source = localStorage.getItem(CACHE_KEYS.source);

  return {
    hasCache: !!localStorage.getItem(CACHE_KEYS.data),
    lastUpdated: lastUpdated ? new Date(lastUpdated) : null,
    count: count ? Number.parseInt(count, 10) : 0,
    source: source || "unknown",
  };
};

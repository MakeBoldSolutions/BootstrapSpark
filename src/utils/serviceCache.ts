/**
 * Shared caching utilities used by all external-data services.
 *
 * Rules enforced consistently across ArticleService, ProjectService,
 * and RepositoryService:
 *  - Cache TTL: 5 minutes in development, 1 hour in production.
 *  - Cache is invalidated whenever the stored app_version diverges from
 *    the value written by VersionManager at app startup.
 */

/** Returns true when running in a local development environment. */
export const isDevelopmentEnvironment = (): boolean =>
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

/** Cache TTL: 5 minutes in dev, 1 hour in production. */
export const getMaxCacheAgeMs = (): number =>
  isDevelopmentEnvironment() ? 1000 * 60 * 5 : 1000 * 60 * 60;

/**
 * Returns true when the cache entry passes both age and app-version checks.
 * @param lastUpdatedIso - ISO timestamp stored with the cache, or null if absent.
 * @param cachedVersion  - App version stored with the cache, or null if absent.
 */
export const isCacheFresh = (
  lastUpdatedIso: string | null,
  cachedVersion: string | null
): boolean => {
  const currentVersion = localStorage.getItem("app_version");
  const cacheAge = lastUpdatedIso ? Date.now() - new Date(lastUpdatedIso).getTime() : Infinity;
  return cacheAge < getMaxCacheAgeMs() && cachedVersion === currentVersion;
};

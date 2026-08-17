/**
 * Image utility functions for cache busting and optimization
 */

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

// Get build date for production cache busting
declare const __BUILD_DATE__: string;
const APP_VERSION = typeof __BUILD_DATE__ !== "undefined" ? __BUILD_DATE__ : Date.now().toString();

/**
 * Adds cache busting parameters to image URLs
 * Uses timestamp in development and build version in production
 * @param imageUrl The original image URL
 * @returns Image URL with cache busting parameter
 */
export const addCacheBuster = (imageUrl: string): string => {
  if (!imageUrl) {
    return imageUrl;
  }

  // Don't add cache buster to data URLs or already parameterized URLs
  if (imageUrl.startsWith("data:") || imageUrl.includes("?v=")) {
    return imageUrl;
  }

  // Use timestamp in dev, build version in production
  const cacheBuster = isDevelopment ? Date.now() : APP_VERSION;
  const separator = imageUrl.includes("?") ? "&" : "?";
  return `${imageUrl}${separator}v=${cacheBuster}`;
};

/**
 * Preloads an image to warm the cache
 * @param imageUrl The image URL to preload
 */
export const preloadImage = (imageUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${imageUrl}`));
    img.src = imageUrl;
  });
};

/**
 * Forces image refresh by appending a new cache buster
 * @param imageUrl The original image URL
 * @returns Image URL with fresh cache buster
 */
export const forceImageRefresh = (imageUrl: string): string => {
  if (!imageUrl) return imageUrl;

  // Remove existing cache buster if present
  const cleanUrl = imageUrl.split("?")[0];

  // Add fresh cache buster
  return `${cleanUrl}?v=${Date.now()}`;
};

/**
 * Development helper: Clear all localStorage caches and force page reload
 * This function is available globally in development mode
 * @param reloadPage Callback used to reload the page after caches are cleared
 */
export const clearAllCaches = (reloadPage: () => void = () => window.location.reload()): void => {
  if (!isDevelopment) {
    console.warn("Cache clearing is only available in development mode");
    return;
  }

  // Clear all relevant caches
  localStorage.clear();

  // Clear service worker caches if available
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  }

  // Clear browser cache programmatically if possible
  if ("caches" in window) {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
  }

  console.log("All caches cleared. Page will reload...");
  reloadPage();
};

// Make cache clearing available globally in development
if (isDevelopment) {
  (globalThis as typeof globalThis & { clearAllCaches: () => void }).clearAllCaches =
    clearAllCaches;
  console.log("Development mode: Use clearAllCaches() in console to clear all caches");
}

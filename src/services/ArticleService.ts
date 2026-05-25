/**
 * Service for fetching articles from markhazleton.com/articles.json
 */
import { z } from "zod";
import { isDevelopmentEnvironment, isCacheFresh } from "../utils/serviceCache";

const BASE_URL = "https://markhazleton.com";

/** Returns the full article URL given a slug */
export const getArticleUrl = (slug: string): string => `${BASE_URL}/blog/${slug}`;

/** Converts a relative image path (e.g. /img/foo.jpg) to a full URL */
export const getArticleImageUrl = (path: string): string =>
  path.startsWith("http") ? path : `${BASE_URL}${path}`;

// ── Nested schemas ───────────────────────────────────────────────────────────

const ArticleSeoSchema = z.object({
  title: z.string(),
  titleSuffix: z.string().nullable().optional(),
  description: z.string(),
  keywords: z.string(),
  robots: z.string(),
  canonical: z.string(),
});

const ArticleOgSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.string(),
  image: z.string(),
  imageAlt: z.string(),
});

const ArticleTwitterSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().nullable().optional(),
  imageAlt: z.string(),
});

const ArticleImageMetadataSchema = z.object({
  width: z.number(),
  height: z.number(),
  format: z.string(),
  thumbnail: z.string(),
  thumbnailWidth: z.number(),
  thumbnailHeight: z.number(),
  webp: z.string(),
  optimizedAt: z.string(),
  fileSize: z.number(),
  thumbnailSize: z.number(),
});

// ── Main article schema ──────────────────────────────────────────────────────

export const ArticleSchema = z.object({
  id: z.number(),
  Section: z.string(),
  slug: z.string(),
  name: z.string().min(1, "Article name cannot be empty"),
  contentFile: z.string(),
  description: z.string(),
  keywords: z.string(),
  img_src: z.string(),
  lastmod: z.string(),
  publishedDate: z.string(),
  estimatedReadTime: z.number(),
  changefreq: z.string(),
  source: z.string(),
  subtitle: z.string(),
  author: z.string(),
  summary: z.string(),
  conclusionTitle: z.string(),
  conclusionSummary: z.string(),
  conclusionKeyHeading: z.string(),
  conclusionKeyText: z.string(),
  conclusionText: z.string(),
  seo: ArticleSeoSchema,
  og: ArticleOgSchema,
  twitter: ArticleTwitterSchema,
  youtubeUrl: z.string().nullable().optional(),
  youtubeTitle: z.string().nullable().optional(),
  image_metadata: ArticleImageMetadataSchema,
});

const ArticleArraySchema = z.array(ArticleSchema);

export type Article = z.infer<typeof ArticleSchema>;

// ── Fetch function ───────────────────────────────────────────────────────────

/**
 * Fetches articles from markhazleton.com/articles.json via the appropriate proxy.
 * Results are cached in localStorage (5 min dev / 1 hr prod) and invalidated on app version change.
 */
export const fetchArticles = async (): Promise<Article[]> => {
  const sourceUrl = isDevelopmentEnvironment() ? "/api/articles" : "/api/proxy-articles";

  const cachedData = localStorage.getItem("cachedArticlesData");
  const lastUpdated = localStorage.getItem("articlesLastUpdated");
  const cachedVersion = localStorage.getItem("articlesCacheVersion");

  if (cachedData && isCacheFresh(lastUpdated, cachedVersion)) {
    return ArticleArraySchema.parse(JSON.parse(cachedData));
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(sourceUrl, {
      headers: { "Cache-Control": "no-cache" },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const articles = ArticleArraySchema.parse(data);

    try {
      localStorage.setItem("cachedArticlesData", JSON.stringify(articles));
      localStorage.setItem("articlesLastUpdated", new Date().toISOString());
      localStorage.setItem("articlesCount", articles.length.toString());
      localStorage.setItem(
        "articlesCacheVersion",
        localStorage.getItem("app_version") || "unknown"
      );
    } catch (storageError) {
      console.warn("Failed to cache articles data:", storageError);
    }

    return articles;
  } catch (error) {
    clearTimeout(timeoutId);

    if (cachedData) {
      console.warn("Fetch failed, using stale cache:", error);
      return ArticleArraySchema.parse(JSON.parse(cachedData));
    }

    throw new Error(
      `Unable to load articles: ${error instanceof Error ? error.message : "Unknown error"}`,
      { cause: error }
    );
  }
};

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  fetchArticles,
  getArticleUrl,
  getArticleImageUrl,
  ArticleSchema,
} from "../../../src/services/ArticleService";

const makeArticle = (overrides = {}) => ({
  id: 1,
  Section: "Software Engineering",
  slug: "test-article",
  name: "Test Article",
  contentFile: "test-article.md",
  description: "A test article description.",
  keywords: "test, article",
  img_src: "/img/test.jpg",
  lastmod: "2026-05-01",
  publishedDate: "2026-05-01",
  estimatedReadTime: 5,
  changefreq: "monthly",
  source: "/src/content/test-article.md",
  subtitle: "A subtitle",
  author: "Mark Hazleton",
  summary: "A summary of the article.",
  conclusionTitle: "",
  conclusionSummary: "",
  conclusionKeyHeading: "",
  conclusionKeyText: "",
  conclusionText: "",
  seo: {
    title: "Test Article",
    titleSuffix: null,
    description: "A test article description.",
    keywords: "test, article",
    robots: "index, follow",
    canonical: "https://markhazleton.com/blog/test-article",
  },
  og: {
    title: "Test Article",
    description: "A test article description.",
    type: "article",
    image: "/img/test.jpg",
    imageAlt: "Test Article",
  },
  twitter: {
    title: "Test Article",
    description: "A test article description.",
    image: null,
    imageAlt: "Test Article",
  },
  youtubeUrl: null,
  youtubeTitle: null,
  image_metadata: {
    width: 400,
    height: 223,
    format: "jpeg",
    thumbnail: "/img/optimized/thumbnails/test-thumb.jpg",
    thumbnailWidth: 400,
    thumbnailHeight: 223,
    webp: "/img/optimized/webp/test.webp",
    optimizedAt: "2026-05-01T00:00:00.000Z",
    fileSize: 8000,
    thumbnailSize: 4000,
  },
  ...overrides,
});

describe("ArticleService", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── getArticleUrl ──────────────────────────────────────────────────────────

  describe("getArticleUrl", () => {
    it("builds the correct article URL from a slug", () => {
      expect(getArticleUrl("my-article")).toBe("https://markhazleton.com/blog/my-article");
    });
  });

  // ── getArticleImageUrl ─────────────────────────────────────────────────────

  describe("getArticleImageUrl", () => {
    it("prepends base URL to a relative path", () => {
      expect(getArticleImageUrl("/img/foo.jpg")).toBe("https://markhazleton.com/img/foo.jpg");
    });

    it("returns absolute URLs unchanged", () => {
      expect(getArticleImageUrl("https://cdn.example.com/img.jpg")).toBe(
        "https://cdn.example.com/img.jpg"
      );
    });
  });

  // ── ArticleSchema ──────────────────────────────────────────────────────────

  describe("ArticleSchema", () => {
    it("validates a well-formed article object", () => {
      const result = ArticleSchema.safeParse(makeArticle());
      expect(result.success).toBe(true);
    });

    it("rejects an article with an empty name", () => {
      const result = ArticleSchema.safeParse(makeArticle({ name: "" }));
      expect(result.success).toBe(false);
    });
  });

  // ── fetchArticles ──────────────────────────────────────────────────────────

  describe("fetchArticles", () => {
    it("fetches and returns a validated array of articles", async () => {
      const mockData = [
        makeArticle(),
        makeArticle({ id: 2, slug: "second-article", name: "Second" }),
      ];
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const articles = await fetchArticles();

      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBe(2);
      expect(articles[0].name).toBe("Test Article");
      expect(articles[0].slug).toBe("test-article");
      expect(fetch).toHaveBeenCalled();
    });

    it("caches fetched articles in localStorage", async () => {
      const mockData = [makeArticle()];
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      await fetchArticles();

      const cached = localStorage.getItem("cachedArticlesData");
      expect(cached).toBeTruthy();
      expect(JSON.parse(cached!)[0].slug).toBe("test-article");

      expect(localStorage.getItem("articlesLastUpdated")).toBeTruthy();
      expect(localStorage.getItem("articlesCount")).toBe("1");
    });

    it("returns cached data without a network call when cache is fresh", async () => {
      const mockData = [makeArticle()];
      localStorage.setItem("cachedArticlesData", JSON.stringify(mockData));
      localStorage.setItem("articlesLastUpdated", new Date().toISOString());

      global.fetch = vi.fn();

      const articles = await fetchArticles();

      expect(articles.length).toBe(1);
      expect(fetch).not.toHaveBeenCalled();
    });

    it("falls back to stale cache when the network request fails", async () => {
      const mockData = [makeArticle()];
      localStorage.setItem("cachedArticlesData", JSON.stringify(mockData));

      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      const articles = await fetchArticles();

      expect(articles.length).toBe(1);
      expect(articles[0].name).toBe("Test Article");
    });

    it("throws when the server returns a non-OK status and there is no cache", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(fetchArticles()).rejects.toThrow();
    });
  });
});

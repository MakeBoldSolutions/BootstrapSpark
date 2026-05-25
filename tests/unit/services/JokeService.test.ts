import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import JokeService, { Joke } from "../../../src/services/JokeService";

const mockSingleJoke: Joke = {
  error: false,
  type: "single",
  joke: "Why do programmers prefer dark mode? Because light attracts bugs!",
  category: "Programming",
  flags: {
    nsfw: false,
    religious: false,
    political: false,
    racist: false,
    sexist: false,
    explicit: false,
  },
  id: 123,
  safe: true,
  lang: "en",
};

const mockTwoPartJoke: Joke = {
  error: false,
  type: "twopart",
  setup: "Why did the developer go broke?",
  delivery: "Because he used up all his cache!",
  category: "Programming",
  flags: {
    nsfw: false,
    religious: false,
    political: false,
    racist: false,
    sexist: false,
    explicit: false,
  },
  id: 456,
  safe: true,
  lang: "en",
};

describe("JokeService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    JokeService.clearCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch joke from API successfully", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockSingleJoke,
    } as Response);

    const joke = await JokeService.fetchJoke();

    expect(joke).toBeDefined();
    expect(joke.error).toBe(false);
    expect(joke.category).toBeDefined();
    expect(global.fetch).toHaveBeenCalled();
  });

  it("should filter jokes by category", async () => {
    const programmingJoke = { ...mockSingleJoke, category: "Programming" };

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => programmingJoke,
    } as Response);

    const joke = await JokeService.fetchJoke("Programming", true);

    expect(joke.category).toBe("Programming");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("category=Programming"),
      expect.any(Object)
    );
  });

  it("should handle single-part jokes", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockSingleJoke,
    } as Response);

    const joke = await JokeService.fetchJoke();

    expect(joke.type).toBe("single");
    if (joke.type === "single") {
      expect(joke.joke).toBeDefined();
      expect(joke.joke).toBeTruthy();
    }
  });

  it("should handle two-part jokes", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockTwoPartJoke,
    } as Response);

    const joke = await JokeService.fetchJoke();

    expect(joke.type).toBe("twopart");
    if (joke.type === "twopart") {
      expect(joke.setup).toBeDefined();
      expect(joke.delivery).toBeDefined();
    }
  });

  it("should handle API errors gracefully", async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error("Network error"));

    const joke = await JokeService.fetchJoke();

    // Should return fallback joke
    expect(joke).toBeDefined();
    expect(joke.error).toBe(false);
    expect(joke.category).toBe("Programming");
    expect(joke.type).toBe("single");
    if (joke.type === "single") {
      expect(joke.joke).toContain("programmers");
    }
  });

  it("should handle API error response", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ error: true, message: "No jokes found" }),
    } as Response);

    const joke = await JokeService.fetchJoke();

    // Should return fallback joke
    expect(joke).toBeDefined();
    expect(joke.error).toBe(false);
  });

  it("should return available categories", () => {
    const categories = JokeService.getCategories();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(categories).toContain("Any");
    expect(categories).toContain("Programming");
  });

  it("should clear cache", () => {
    // This is a simple test to ensure the method exists and doesn't throw
    expect(() => JokeService.clearCache()).not.toThrow();
  });

  it("should handle invalid joke data with fallback", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        error: false,
        type: "invalid-type", // Invalid: should be 'single' or 'twopart'
        category: "Programming",
      }),
    } as Response);

    const joke = await JokeService.fetchJoke();

    // Should return fallback joke instead of throwing
    expect(joke).toBeDefined();
    expect(joke.error).toBe(false);
    expect(joke.type).toBe("single");
  });
});

import { z } from "zod";

// Zod schemas for runtime validation

const FlagsSchema = z
  .object({
    nsfw: z.boolean(),
    religious: z.boolean(),
    political: z.boolean(),
    racist: z.boolean(),
    sexist: z.boolean(),
    explicit: z.boolean(),
  })
  .optional();

const SingleJokeSchema = z.object({
  error: z.boolean(),
  type: z.literal("single"),
  joke: z.string(),
  category: z.string(),
  flags: FlagsSchema,
  id: z.number(),
  safe: z.boolean().optional(),
  lang: z.string().optional(),
});

const TwoPartJokeSchema = z.object({
  error: z.boolean(),
  type: z.literal("twopart"),
  setup: z.string(),
  delivery: z.string(),
  category: z.string(),
  flags: FlagsSchema,
  id: z.number(),
  safe: z.boolean().optional(),
  lang: z.string().optional(),
});

const JokeAPIResponseSchema = z.discriminatedUnion("type", [SingleJokeSchema, TwoPartJokeSchema]);

// Inferred TypeScript type
export type Joke = z.infer<typeof JokeAPIResponseSchema>;

class JokeService {
  private static instance: JokeService;
  private cache: Map<string, { data: Joke; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  private constructor() {}

  public static getInstance(): JokeService {
    if (!JokeService.instance) {
      JokeService.instance = new JokeService();
    }
    return JokeService.instance;
  }

  /**
   * Get the appropriate API URL based on environment
   */
  private getApiUrl(): string {
    // In development, use the Vite proxy
    if (import.meta.env.DEV) {
      return "/api/joke";
    }
    // In production, use the Azure Function
    return "/api/proxy-joke";
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  /**
   * Get cache key for the request
   */
  private getCacheKey(category: string = "Any", safeMode: boolean = true): string {
    return `${category}-${safeMode}`;
  }

  /**
   * Fetch a random joke
   */
  public async fetchJoke(category: string = "Any", safeMode: boolean = true): Promise<Joke> {
    // Don't use cache for jokes - we want fresh jokes each time
    // But we could implement a short cache to prevent spam requests

    try {
      const url = this.getApiUrl();
      const params = new URLSearchParams();

      if (category !== "Any") {
        params.append("category", category);
      }
      if (!safeMode) {
        params.append("safeMode", "false");
      }

      const queryString = params.toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      console.log(`Fetching joke from: ${fullUrl}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(fullUrl, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Joke API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data) {
        throw new Error("No data received from joke API");
      }

      if (data.error) {
        throw new Error(`Joke API error: ${data.message || "Unknown error"}`);
      }

      // Validate response with Zod schema
      try {
        const joke = JokeAPIResponseSchema.parse(data);
        console.log(`Successfully fetched joke: ${joke.type} joke in ${joke.category} category`);
        return joke;
      } catch (zodError) {
        console.error("Joke API response validation failed:", zodError);
        throw new Error("Invalid joke data format from API", { cause: zodError });
      }
    } catch (error) {
      console.error("Error fetching joke:", error);

      // Return a fallback joke
      const fallbackJoke: Joke = {
        error: false,
        category: "Programming",
        type: "single",
        joke: "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
        flags: {
          nsfw: false,
          religious: false,
          political: false,
          racist: false,
          sexist: false,
          explicit: false,
        },
        id: Math.floor(Math.random() * 1000000), // Random ID for fallback
        safe: true,
        lang: "en",
      };

      if (error instanceof DOMException && error.name === "AbortError") {
        console.log("Joke request timed out, using fallback");
      } else if (error instanceof Error) {
        console.log(`Joke fetch error: ${error.message}, using fallback`);
      }

      return fallbackJoke;
    }
  }

  /**
   * Get available joke categories
   */
  public getCategories(): string[] {
    return ["Any", "Programming", "Miscellaneous", "Dark", "Pun", "Spooky", "Christmas"];
  }

  /**
   * Clear the cache
   */
  public clearCache(): void {
    this.cache.clear();
    console.log("Joke cache cleared");
  }
}

export default JokeService.getInstance();

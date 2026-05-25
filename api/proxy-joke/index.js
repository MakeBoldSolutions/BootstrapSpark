// Whitelisted origins for CORS
const ALLOWED_ORIGINS = [
  "https://Bootstrap.makeboldspark.com",
  "https://bootstrapspark.makeboldspark.com",
  "https://markhazleton.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// Valid joke categories
const VALID_CATEGORIES = [
  "Any",
  "Programming",
  "Miscellaneous",
  "Dark",
  "Pun",
  "Spooky",
  "Christmas",
];

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a joke proxy request.");

  // Get origin from request
  const origin = req.headers.origin || req.headers.referer;
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  // Set CORS headers with whitelist
  context.res.headers = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "false",
    "Content-Type": "application/json",
  };

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    context.res = {
      status: 200,
      headers: context.res.headers,
    };
    return;
  }

  try {
    // Extract and validate category
    const category = req.query.category || "Any";
    if (!VALID_CATEGORIES.includes(category)) {
      context.res = {
        status: 400,
        headers: context.res.headers,
        body: { error: true, message: "Invalid category specified" },
      };
      return;
    }

    const safeMode = req.query.safeMode !== "false"; // Default to true

    // Build the JokeAPI URL
    const jokeApiUrl = `https://v2.jokeapi.dev/joke/${encodeURIComponent(category)}${safeMode ? "?safe-mode" : ""}`;

    context.log(`Fetching joke from: ${jokeApiUrl}`);

    // Make request to JokeAPI with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(jokeApiUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "BootstrapSpark/1.0",
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`JokeAPI request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate the response
    if (!data) {
      throw new Error("No data received from JokeAPI");
    }

    // Check if the API returned an error
    if (data.error) {
      throw new Error(`JokeAPI error: ${data.message || "Unknown error"}`);
    }

    context.log("Successfully fetched joke");

    // Return the joke data
    context.res = {
      status: 200,
      headers: context.res.headers,
      body: data,
    };
  } catch (error) {
    context.log.error("Error fetching joke:", error.message);

    // Return error response with fallback joke
    const fallbackJoke = {
      error: false,
      category: "Programming",
      type: "single",
      joke: "Why do programmers prefer dark mode? Because light attracts bugs!",
      flags: {
        nsfw: false,
        religious: false,
        political: false,
        racist: false,
        sexist: false,
        explicit: false,
      },
      id: 0,
      safe: true,
      lang: "en",
    };

    context.res = {
      status: 200,
      headers: context.res.headers,
      body: fallbackJoke,
    };
  }
};

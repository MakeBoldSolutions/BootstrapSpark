// Azure Function to proxy RSS feed requests
// This avoids CORS issues by having the server fetch the RSS feed instead of the browser

// Whitelisted origins for CORS
const ALLOWED_ORIGINS = [
  "https://Bootstrap.makeboldspark.com",
  "https://bootstrapspark.makeboldspark.com",
  "https://markhazleton.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// Whitelisted RSS sources to prevent SSRF
const ALLOWED_RSS_SOURCES = [
  "https://markhazleton.com/feed.xml",
  "https://markhazleton.com/rss.xml",
  "https://markhazleton.com/feed",
  "https://frogsfolly.com/rss.xml",
];

module.exports = async function (context, req) {
  context.log("Processing RSS proxy request");

  // Get and validate the source URL
  const sourceUrl = req.headers["x-rss-source"] || "https://markhazleton.com/feed.xml";

  // Validate against whitelist to prevent SSRF attacks
  if (!ALLOWED_RSS_SOURCES.includes(sourceUrl)) {
    context.log.error(`Unauthorized RSS source requested: ${sourceUrl}`);
    context.res = {
      status: 403,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Forbidden RSS source",
        message: "The requested RSS source is not allowed",
      }),
    };
    return;
  }

  context.log(`Fetching RSS from source: ${sourceUrl}`);

  try {
    // Fetch the RSS feed from the source with improved settings
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(sourceUrl, {
      signal: controller.signal,
      headers: {
        Accept: "application/xml, text/xml, application/rss+xml, */*",
        "User-Agent": "BootstrapSpark/1.0 RSS-Proxy (Node.js)",
        "Cache-Control": "no-cache",
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      context.log.error(
        `Failed to fetch RSS from ${sourceUrl}: ${response.status} ${response.statusText}`
      );
      throw new Error(`Failed to fetch RSS: ${response.status} ${response.statusText}`);
    }

    // Get the RSS XML content
    const rssContent = await response.text();

    if (!rssContent || rssContent.trim() === "") {
      context.log.error(`Received empty response from ${sourceUrl}`);
      throw new Error("Received empty response from RSS source");
    }

    // Basic validation that we got XML
    if (!rssContent.includes("<rss") && !rssContent.includes("<feed")) {
      context.log.warn(`Response might not be valid RSS/XML: ${rssContent.substring(0, 100)}...`);
    }

    context.log(`Successfully retrieved ${rssContent.length} bytes of RSS data`);

    // Get origin from request
    const origin = req.headers.origin || req.headers.referer;
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    // Return the RSS content with appropriate headers
    context.res = {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "max-age=3600", // Cache for 1 hour
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Headers": "Content-Type, X-RSS-Source, Cache-Control",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Credentials": "false",
      },
      body: rssContent,
    };

    context.log("Successfully proxied RSS feed");
  } catch (error) {
    context.log.error(`Error proxying RSS feed: ${error.message}`);

    // Get origin from request
    const origin = req.headers.origin || req.headers.referer;
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    // Return a proper error response
    context.res = {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Headers": "Content-Type, X-RSS-Source, Cache-Control",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Credentials": "false",
      },
      body: JSON.stringify({
        error: "Failed to retrieve RSS feed",
        message: error.message,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};

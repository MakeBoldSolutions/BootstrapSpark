const axios = require("axios");

const ALLOWED_ORIGINS = [
  "https://Bootstrap.makeboldspark.com",
  "https://bootstrapspark.makeboldspark.com",
  "https://markhazleton.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const ARTICLES_URL = "https://markhazleton.com/articles.json";

module.exports = async function (context, req) {
  context.log("Processing articles proxy request.");

  const origin = req.headers.origin || req.headers.referer;
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "false",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    context.res = { status: 200, headers: corsHeaders };
    return;
  }

  try {
    context.log(`Fetching articles from: ${ARTICLES_URL}`);

    const response = await axios.get(ARTICLES_URL, {
      timeout: 10000,
      headers: { "User-Agent": "BootstrapSpark/1.0" },
    });

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Articles data is not an array");
    }

    // Resolve relative image paths to absolute URLs
    const articles = response.data.map((article) => {
      if (article.img_src && !article.img_src.startsWith("http")) {
        article.img_src = `https://markhazleton.com${article.img_src}`;
      }
      if (
        article.image_metadata &&
        article.image_metadata.thumbnail &&
        !article.image_metadata.thumbnail.startsWith("http")
      ) {
        article.image_metadata.thumbnail = `https://markhazleton.com${article.image_metadata.thumbnail}`;
        article.image_metadata.webp = `https://markhazleton.com${article.image_metadata.webp}`;
      }
      return article;
    });

    context.log(`Successfully fetched ${articles.length} articles`);

    context.res = {
      status: 200,
      headers: { ...corsHeaders, "Cache-Control": "max-age=3600" },
      body: articles,
    };
  } catch (error) {
    context.log.error("Error fetching articles:", error.message);
    context.res = {
      status: 502,
      headers: corsHeaders,
      body: { error: "Failed to fetch articles", message: error.message },
    };
  }
};

// Whitelisted origins for CORS
const ALLOWED_ORIGINS = [
  "https://Bootstrap.makeboldspark.com",
  "https://bootstrapspark.makeboldspark.com",
  "https://markhazleton.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a projects proxy request.");

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
    const projectsUrl = "https://markhazleton.com/projects.json";

    context.log(`Fetching projects from: ${projectsUrl}`);

    // Make request to projects.json with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(projectsUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "BootstrapSpark/1.0",
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Upstream fetch failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate the response
    if (!data) {
      throw new Error("No data received from projects API");
    }

    // Validate that it's an array
    if (!Array.isArray(data)) {
      throw new Error("Projects data is not an array");
    }

    // Transform image URLs to be absolute URLs pointing to markhazleton.com
    const toAbsolute = (path) => {
      if (!path || path.startsWith("http")) return path;
      const cleaned = path.startsWith("/") ? path.substring(1) : path;
      return `https://markhazleton.com/${cleaned}`;
    };

    const transformedProjects = data.map((project) => {
      if (project.image) {
        project.image = toAbsolute(project.image);
      }
      if (project.image_metadata) {
        if (project.image_metadata.thumbnail) {
          project.image_metadata = {
            ...project.image_metadata,
            thumbnail: toAbsolute(project.image_metadata.thumbnail),
            webp: project.image_metadata.webp
              ? toAbsolute(project.image_metadata.webp)
              : project.image_metadata.webp,
          };
        }
      }
      if (project.og && project.og.image) {
        project.og = { ...project.og, image: toAbsolute(project.og.image) };
      }
      if (project.twitter && project.twitter.image) {
        project.twitter = { ...project.twitter, image: toAbsolute(project.twitter.image) };
      }
      return project;
    });

    context.log(`Successfully fetched and transformed ${transformedProjects.length} projects`);

    // Return the transformed projects data
    context.res = {
      status: 200,
      headers: context.res.headers,
      body: transformedProjects,
    };
  } catch (error) {
    context.log.error("Error fetching projects:", error.message);

    // Return error response with fallback data
    const fallbackProjects = [
      {
        id: 1,
        image: "https://markhazleton.com/assets/img/frogsfolly.png",
        p: "Frogsfolly",
        d: "My first website, setup to share photos with my family but is now a 'Kitchen Sink' of demos and test ideas. The site is built with Web Project Mechanics CMS.",
        h: "https://frogsfolly.com",
      },
      {
        id: 2,
        image: "https://markhazleton.com/assets/img/travelfrogsfolly.png",
        p: "Travel Frogsfolly",
        d: "A website with places we have traveled with a few pictures and descriptions of the highlights. The site is built with Web Project Mechanics CMS",
        h: "https://travel.frogsfolly.com",
      },
      {
        id: 3,
        image: "https://markhazleton.com/assets/img/controlorigins.jpg",
        p: "Control Origins",
        d: "At Control Origins, our mission is to empower organizations with innovative technology solutions that drive value creation and enable them to achieve their business goals.",
        h: "https://controlorigins.com",
      },
    ];

    context.res = {
      status: 200,
      headers: context.res.headers,
      body: fallbackProjects,
    };
  }
};

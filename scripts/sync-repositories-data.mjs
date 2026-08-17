import fs from "node:fs";
import path from "node:path";

const workspaceRoot = process.cwd();
const outputPath = path.join(workspaceRoot, ".build", "data", "repositories.json");
const embeddedFeedPath = path.join(workspaceRoot, "src", "data", "repositories.json");
const sourceUrl =
  process.env.REPOSITORIES_FEED_URL ||
  "https://raw.githubusercontent.com/MakeBoldSolutions/github-stats-spark/refs/heads/main/data/users/makeboldsolutions/repositories.json";

const isValidFeed = (payload) => {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  if (!payload.profile || typeof payload.profile !== "object") {
    return false;
  }

  if (!Array.isArray(payload.repositories)) {
    return false;
  }

  if (!payload.metadata || typeof payload.metadata !== "object") {
    return false;
  }

  return true;
};

const readFeedFromFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!isValidFeed(payload)) {
    throw new Error(`Fallback repositories feed at ${filePath} is missing required shape.`);
  }

  return payload;
};

const writeFeed = (payload, sourceDescription) => {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote ${sourceDescription} repositories build artifact to ${outputPath}`);
};

const run = async () => {
  console.log(`Syncing repositories data from ${sourceUrl}`);

  try {
    const response = await fetch(sourceUrl, {
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch repositories feed: ${response.status} ${response.statusText}`);
    }

    const payload = await response.json();

    if (!isValidFeed(payload)) {
      throw new Error("Fetched repositories feed is missing required profile/repositories/metadata shape.");
    }

    writeFeed(payload, "fresh");
    return;
  } catch (error) {
    console.warn(`Remote repository sync unavailable: ${error.message}`);
  }

  const embeddedFeed = readFeedFromFile(embeddedFeedPath);
  if (!embeddedFeed) {
    throw new Error(`Embedded repositories feed not found at ${embeddedFeedPath}`);
  }

  writeFeed(embeddedFeed, "embedded fallback");
};

run().catch((error) => {
  console.error("Repository sync failed:", error.message);
  process.exit(1);
});

import { describe, expect, it } from "vitest";
import {
  RepositoryFeedSchema,
  buildShowcaseViewModel,
  createRepositoryCardViewModel,
  selectFeaturedRepositories,
  type RepositoryFeed,
} from "@/models/Repository";
import repositoryFeed from "@/data/repositories.json";

describe("Repository model schemas", () => {
  it("parses the embedded repository feed", () => {
    expect(() => RepositoryFeedSchema.parse(repositoryFeed)).not.toThrow();
  });

  it("rejects an invalid repository feed", () => {
    const invalidFeed = {
      profile: { username: "markhazleton" },
      repositories: [{ name: "broken" }],
      metadata: {},
    };

    expect(() => RepositoryFeedSchema.parse(invalidFeed)).toThrow();
  });
});

describe("Repository view model derivation", () => {
  const parsed = RepositoryFeedSchema.parse(repositoryFeed) as RepositoryFeed;

  it("builds repository cards with fallback description", () => {
    const card = createRepositoryCardViewModel({
      ...parsed.repositories[0],
      description: "",
      summary: undefined,
    });

    expect(card.description).toBe("No description is available yet.");
    expect(card.summaryText).toBe("No description is available yet.");
  });

  it("selects featured repositories by score ranking", () => {
    const featured = selectFeaturedRepositories(parsed.repositories, 3);
    expect(featured.length).toBeGreaterThan(0);
    expect(featured[0].featuredSource).toBe("automatic");
  });

  it("creates a full showcase model and excludes private repositories", () => {
    const withPrivate: RepositoryFeed = {
      ...parsed,
      repositories: [
        ...parsed.repositories,
        { ...parsed.repositories[0], name: "private-repo", is_private: true },
      ],
    };

    const vm = buildShowcaseViewModel(withPrivate, "local", parsed.metadata.generated_at);
    expect(vm.repositories.find((repo) => repo.name === "private-repo")).toBeUndefined();
    expect(vm.sourceStatus.source).toBe("local");
  });
});

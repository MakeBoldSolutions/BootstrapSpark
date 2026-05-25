import { z } from "zod";

const optionalUrlSchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}, z.string().url().nullable().optional());

/** Validation schema for metadata included with the repository feed payload. */
export const FeedMetadataSchema = z.object({
  generated_at: z.string().min(1, { message: "metadata.generated_at is required" }),
  schema_version: z.string().min(1, { message: "metadata.schema_version is required" }),
  generator: z.string().optional(),
  schema_features: z.array(z.string()).optional(),
  attention_formula_version: z.string().optional(),
  screenshot_audit: z.unknown().optional(),
  source: z.string().min(1).optional(),
});

/** Validation schema for weekly repository activity summary rows. */
export const WeeklyActivitySchema = z.object({
  week: z.string().min(1),
  label: z.string().min(1),
  commits: z.number().int().nonnegative(),
  active_repos: z.number().int().nonnegative(),
});

/** Validation schema for the top-level repository profile summary. */
export const ProfileSummarySchema = z.object({
  username: z.string().min(1),
  total_repositories: z.number().int().nonnegative(),
  total_stars: z.number().int().nonnegative(),
  total_forks: z.number().int().nonnegative(),
  total_commits: z.number().int().nonnegative(),
  activity_calendar: z.record(z.string(), z.number().int().nonnegative()).optional(),
  weekly_activity: z.array(WeeklyActivitySchema).optional(),
});

/** Validation schema for descriptive repository summary content. */
export const RepositorySummarySchema = z.object({
  text: z.string().min(1),
  ai_generated: z.boolean().optional(),
  generation_method: z.string().nullable().optional(),
  generated_at: z.string().optional(),
  model_used: z.string().nullable().optional(),
  tokens_used: z.number().int().nonnegative().nullable().optional(),
  confidence_score: z.number().nullable().optional(),
});

/** Validation schema for commit history metrics attached to a repository record. */
export const CommitHistorySummarySchema = z.object({
  repository_name: z.string().optional(),
  total_commits: z.number().int().nonnegative().optional(),
  recent_90d: z.number().int().nonnegative().optional(),
  recent_180d: z.number().int().nonnegative().optional(),
  recent_365d: z.number().int().nonnegative().optional(),
  last_commit_date: z.string().nullable().optional(),
  first_commit_date: z.string().nullable().optional(),
  patterns: z.array(z.string()).optional(),
  days_since_last_commit: z.number().int().nonnegative().nullable().optional(),
  activity_rate: z.number().optional(),
  commit_frequency: z.number().optional(),
  consistency_score: z.number().optional(),
});

/** Validation schema for attention metrics. */
export const AttentionMetricsSchema = z.object({
  score: z.number(),
  tier: z.string(),
  needs_attention: z.boolean(),
  reasons: z.array(z.string()),
  components: z.record(z.string(), z.unknown()).optional(),
});

/** Validation schema for a repository screenshot. */
export const ScreenshotSchema = z.object({
  path: z.string(),
  url: z.string(),
  captured_at: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  file_size_kb: z.number(),
});

/** Validation schema for repository security summary. */
export const SecuritySummarySchema = z.object({
  availability: z.string().optional(),
  reason: z.string().optional(),
  overall_state: z.string().optional(),
  feature_status: z.record(z.string(), z.unknown()).optional(),
  active_alert_counts: z.record(z.string(), z.number()).optional(),
  sources: z.array(z.string()).optional(),
});

/** Validation schema for repository pull request summary. */
export const PullRequestSummarySchema = z.object({
  availability: z.string().optional(),
  reason: z.string().optional(),
  has_open_pull_requests: z.boolean().optional(),
  total_open: z.number().int().nonnegative().optional(),
  draft_count: z.number().int().nonnegative().optional(),
  review_requested_count: z.number().int().nonnegative().optional(),
  oldest_open_age_days: z.number().nullable().optional(),
  source: z.string().optional(),
});

/** Validation schema for repository diagnostics summary. */
export const DiagnosticsSummarySchema = z.object({
  availability: z.string().optional(),
  reason: z.string().optional(),
  pull_requests: z.unknown().optional(),
  issues: z.unknown().optional(),
  security: z.unknown().optional(),
  actions: z.unknown().optional(),
  sources: z.array(z.string()).optional(),
});

/** Validation schema for an individual repository record from the showcase feed. */
export const RepositoryRecordSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  summary: RepositorySummarySchema.optional(),
  ai_summary: z.string().nullable().optional(),
  url: z.string().url(),
  homepage: optionalUrlSchema,
  has_pages: z.boolean().optional(),
  pages_url: optionalUrlSchema,
  website_url: optionalUrlSchema,
  stars: z.number().int().nonnegative(),
  forks: z.number().int().nonnegative(),
  watchers: z.number().int().nonnegative().optional(),
  language: z.string().nullable().optional(),
  language_count: z.number().int().nonnegative().optional(),
  language_stats: z.record(z.string(), z.number()).optional(),
  languages: z.record(z.string(), z.number()).optional(),
  created_at: z.string().min(1),
  updated_at: z.string().min(1),
  pushed_at: z.string().min(1),
  first_commit_date: z.string().nullable().optional(),
  last_commit_date: z.string().nullable().optional(),
  total_commits: z.number().int().nonnegative().optional(),
  recent_commits_90d: z.number().int().nonnegative().optional(),
  commit_velocity: z.number().nonnegative().optional(),
  avg_commit_size: z.number().nullable().optional(),
  largest_commit: z.unknown().nullable().optional(),
  smallest_commit: z.unknown().nullable().optional(),
  total_additions: z.number().int().nullable().optional(),
  total_deletions: z.number().int().nullable().optional(),
  commit_history: CommitHistorySummarySchema.optional(),
  commit_metrics: z.unknown().nullable().optional(),
  has_readme: z.boolean().optional(),
  has_license: z.boolean().optional(),
  has_ci_cd: z.boolean().optional(),
  has_tests: z.boolean().optional(),
  has_docs: z.boolean().optional(),
  is_fork: z.boolean().optional(),
  is_private: z.boolean().optional(),
  is_archived: z.boolean().optional(),
  size_kb: z.number().int().nonnegative().optional(),
  age_days: z.number().int().nonnegative().optional(),
  days_since_last_push: z.number().int().nonnegative().optional(),
  rank: z.number().optional(),
  attention_score: z.number().optional(),
  attention_rank: z.number().int().optional(),
  attention_metrics: AttentionMetricsSchema.optional(),
  composite_score: z.number().optional(),
  bus_factor: z.number().nullable().optional(),
  bus_factor_health: z.string().nullable().optional(),
  code_churn: z.number().nullable().optional(),
  contributor_stats: z.unknown().nullable().optional(),
  tech_stack: z.unknown().nullable().optional(),
  screenshot: ScreenshotSchema.optional(),
  screenshot_audit: z.unknown().optional(),
  security_summary: SecuritySummarySchema.optional(),
  pull_request_summary: PullRequestSummarySchema.optional(),
  diagnostics_summary: DiagnosticsSummarySchema.optional(),
});

/** Validation schema for the complete repository showcase feed. */
export const RepositoryFeedSchema = z.object({
  profile: ProfileSummarySchema,
  repositories: z.array(RepositoryRecordSchema),
  metadata: FeedMetadataSchema,
});

/** Type alias for validated feed metadata. */
export type FeedMetadata = z.infer<typeof FeedMetadataSchema>;
/** Type alias for a validated weekly activity summary row. */
export type WeeklyActivity = z.infer<typeof WeeklyActivitySchema>;
/** Type alias for a validated profile summary record. */
export type ProfileSummary = z.infer<typeof ProfileSummarySchema>;
/** Type alias for a validated repository summary payload. */
export type RepositorySummary = z.infer<typeof RepositorySummarySchema>;
/** Type alias for a validated commit history summary payload. */
export type CommitHistorySummary = z.infer<typeof CommitHistorySummarySchema>;
/** Type alias for validated attention metrics. */
export type AttentionMetrics = z.infer<typeof AttentionMetricsSchema>;
/** Type alias for a validated repository screenshot. */
export type Screenshot = z.infer<typeof ScreenshotSchema>;
/** Type alias for a validated security summary. */
export type SecuritySummary = z.infer<typeof SecuritySummarySchema>;
/** Type alias for a validated pull request summary. */
export type PullRequestSummary = z.infer<typeof PullRequestSummarySchema>;
/** Type alias for a validated diagnostics summary. */
export type DiagnosticsSummary = z.infer<typeof DiagnosticsSummarySchema>;
/** Type alias for a validated repository record. */
export type RepositoryRecord = z.infer<typeof RepositoryRecordSchema>;
/** Type alias for a validated repository showcase feed. */
export type RepositoryFeed = z.infer<typeof RepositoryFeedSchema>;

/** Enumerates the supported repository data sources surfaced to the UI. */
export type RepositorySource = "remote" | "cache" | "local";

/** UI-facing status metadata describing the active repository data source. */
export interface SourceStatus {
  source: RepositorySource;
  lastUpdated: string | null;
  count: number;
  message: string;
}

/** Repository card shape consumed by the showcase page. */
export interface RepositoryCardViewModel {
  name: string;
  description: string;
  summaryText: string;
  primaryLanguage: string | null;
  repoUrl: string;
  siteUrl: string | null;
  stars: number;
  forks: number;
  recentCommits90d: number;
  statusTags: string[];
  featuredSource: "curated" | "automatic" | "none";
  sortMetrics: {
    activity: number;
    score: number;
    recency: number;
  };
}

/** Available filter values derived from the repository collection. */
export interface RepositoryFilterCatalog {
  languages: string[];
  statusTags: string[];
}

/** View model used by the repository showcase page. */
export interface RepositoryShowcaseViewModel {
  profile: ProfileSummary;
  featured: RepositoryCardViewModel[];
  repositories: RepositoryCardViewModel[];
  filters: RepositoryFilterCatalog;
  sourceStatus: SourceStatus;
}

const extractRecencyScore = (repo: RepositoryRecord): number => {
  const dateValue = Date.parse(repo.pushed_at);
  return Number.isFinite(dateValue) ? dateValue : 0;
};

const buildStatusTags = (repo: RepositoryRecord): string[] => {
  const tags: string[] = [];
  if (repo.is_archived) tags.push("archived");
  if (repo.is_fork) tags.push("fork");
  if (repo.has_pages) tags.push("pages");
  if (repo.has_tests) tags.push("tests");
  if (repo.has_ci_cd) tags.push("ci/cd");
  if (repo.has_docs) tags.push("docs");
  if (repo.attention_metrics?.needs_attention) tags.push("needs-attention");
  return tags;
};

const getRepositoryScore = (repo: RepositoryRecord): number => {
  return (
    (repo.composite_score ?? 0) * 5 +
    (repo.attention_score ?? 0) * 2 +
    (repo.recent_commits_90d ?? 0) * 2 +
    (repo.stars ?? 0) +
    (repo.forks ?? 0)
  );
};

/**
 * Maps a repository record to the card view model rendered by the showcase page.
 * @param repo Validated repository record from the feed.
 * @param featuredSource Source marker used by featured repository badges.
 * @returns Repository card data ready for UI rendering.
 */
export const createRepositoryCardViewModel = (
  repo: RepositoryRecord,
  featuredSource: "curated" | "automatic" | "none" = "none"
): RepositoryCardViewModel => {
  const fallbackDescription = "No description is available yet.";
  const description =
    repo.description && repo.description.trim() ? repo.description : fallbackDescription;
  const summaryText = repo.summary?.text?.trim() || description;

  return {
    name: repo.name,
    description,
    summaryText,
    primaryLanguage: repo.language ?? null,
    repoUrl: repo.url,
    siteUrl: repo.website_url ?? repo.homepage ?? repo.pages_url ?? null,
    stars: repo.stars,
    forks: repo.forks,
    recentCommits90d: repo.recent_commits_90d ?? repo.commit_history?.recent_90d ?? 0,
    statusTags: buildStatusTags(repo),
    featuredSource,
    sortMetrics: {
      activity: repo.recent_commits_90d ?? repo.commit_history?.recent_90d ?? 0,
      score: getRepositoryScore(repo),
      recency: extractRecencyScore(repo),
    },
  };
};

/**
 * Selects the featured repository cards, preferring curated entries and falling back to score-based ranking.
 * @param repositories Source repository records.
 * @param maxItems Maximum number of featured cards to return.
 * @returns Featured repository cards for the showcase hero section.
 */
export const selectFeaturedRepositories = (
  repositories: RepositoryRecord[],
  maxItems = 3
): RepositoryCardViewModel[] => {
  return [...repositories]
    .sort((a, b) => getRepositoryScore(b) - getRepositoryScore(a))
    .slice(0, maxItems)
    .map((repo) => createRepositoryCardViewModel(repo, "automatic"));
};

/**
 * Derives the available language and status filters from the repository cards.
 * @param repositories Repository cards already prepared for display.
 * @returns Sorted filter values for the UI controls.
 */
export const deriveFilterCatalog = (
  repositories: RepositoryCardViewModel[]
): RepositoryFilterCatalog => {
  const languageSet = new Set<string>();
  const statusSet = new Set<string>();

  for (const repo of repositories) {
    if (repo.primaryLanguage) {
      languageSet.add(repo.primaryLanguage);
    }
    for (const tag of repo.statusTags) {
      statusSet.add(tag);
    }
  }

  return {
    languages: [...languageSet].sort((a, b) => a.localeCompare(b)),
    statusTags: [...statusSet].sort((a, b) => a.localeCompare(b)),
  };
};

/**
 * Creates a human-readable data source message for the repository showcase.
 * @param source Active repository data source.
 * @returns User-facing source status copy.
 */
export const createSourceStatusMessage = (source: RepositorySource): string => {
  switch (source) {
    case "remote":
      return "Showing the latest repository feed from the remote source.";
    case "cache":
      return "Showing cached repository data while the latest feed is unavailable.";
    case "local":
      return "Showing embedded fallback repository data.";
    default:
      return "Showing repository data.";
  }
};

/**
 * Builds the full repository showcase view model from a validated feed payload.
 * @param feed Validated repository feed data.
 * @param source Active source used to build the view model.
 * @param lastUpdated Timestamp associated with the active source.
 * @returns Repository showcase data ready for rendering.
 */
export const buildShowcaseViewModel = (
  feed: RepositoryFeed,
  source: RepositorySource,
  lastUpdated: string | null
): RepositoryShowcaseViewModel => {
  const publicRepositories = feed.repositories.filter((repo) => !repo.is_private);
  const repositories = publicRepositories.map((repo) =>
    createRepositoryCardViewModel(repo, "none")
  );

  return {
    profile: feed.profile,
    featured: selectFeaturedRepositories(publicRepositories),
    repositories,
    filters: deriveFilterCatalog(repositories),
    sourceStatus: {
      source,
      lastUpdated,
      count: repositories.length,
      message: createSourceStatusMessage(source),
    },
  };
};

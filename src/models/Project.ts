// src/models/Project.ts
import { z } from "zod";
import { fetchProjectsData } from "../services/ProjectService";

const SeoSchema = z.object({
  title: z.string(),
  titleSuffix: z.string().optional(),
  description: z.string(),
  keywords: z.string(),
  canonical: z.string(),
  robots: z.string(),
});

const OgSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.string(),
  image: z.string(),
  imageAlt: z.string(),
});

const TwitterSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
  imageAlt: z.string(),
});

const RepositorySchema = z.object({
  provider: z.string(),
  name: z.string(),
  url: z.string(),
  branch: z.string(),
  visibility: z.string(),
  notes: z.string().optional(),
});

const PromotionSchema = z.object({
  pipeline: z.string(),
  currentStage: z.string(),
  status: z.string(),
  environments: z.array(z.unknown()),
});

const ImageMetadataSchema = z.object({
  width: z.number(),
  height: z.number(),
  format: z.string(),
  thumbnail: z.string(),
  thumbnailWidth: z.number(),
  thumbnailHeight: z.number(),
  webp: z.string(),
  optimizedAt: z.string(),
  fileSize: z.number(),
  thumbnailSize: z.number(),
});

/**
 * Validation schema for individual project data from external API
 */
export const ProjectDataSchema = z.object({
  id: z.number().int().positive({
    message: "Project ID must be a positive integer",
  }),
  image: z.string().min(1, {
    message: "Project image path cannot be empty",
  }),
  p: z.string().min(1, {
    message: "Project title cannot be empty",
  }),
  d: z.string().min(1, {
    message: "Project description cannot be empty",
  }),
  h: z.string().url({
    message: "Project link must be a valid URL",
  }),
  slug: z.string().min(1),
  summary: z.string().min(1),
  keywords: z.string().min(1),
  platform: z.string().optional(),
  category: z.string().optional(),
  featured: z.boolean().optional(),
  featuredType: z.string().optional(),
  systemUrl: z.string().optional(),
  seo: SeoSchema.optional(),
  og: OgSchema.optional(),
  twitter: TwitterSchema.optional(),
  repository: RepositorySchema.optional(),
  promotion: PromotionSchema.optional(),
  image_metadata: ImageMetadataSchema.optional(),
});

/**
 * Validation schema for array of projects from API endpoint
 */
export const ProjectDataArraySchema = z.array(ProjectDataSchema).min(1, {
  message: "Projects array cannot be empty",
});

// Inferred TypeScript types
export type ProjectData = z.infer<typeof ProjectDataSchema>;
export type ProjectDataArray = z.infer<typeof ProjectDataArraySchema>;

export const getProjectUrl = (slug: string): string => `https://markhazleton.com/projects/${slug}`;

export const getProjectImageUrl = (path: string): string =>
  path.startsWith("http") ? path : `https://markhazleton.com${path}`;

class Project {
  id: number;
  image: string;
  p: string;
  d: string;
  h: string;
  slug: string;
  summary: string;
  keywords: string;
  platform?: string;
  category?: string;
  featured?: boolean;
  featuredType?: string;
  systemUrl?: string;
  seo?: z.infer<typeof SeoSchema>;
  og?: z.infer<typeof OgSchema>;
  twitter?: z.infer<typeof TwitterSchema>;
  repository?: z.infer<typeof RepositorySchema>;
  promotion?: z.infer<typeof PromotionSchema>;
  image_metadata?: z.infer<typeof ImageMetadataSchema>;

  constructor(data: ProjectData) {
    this.id = data.id;
    this.image = data.image;
    this.p = data.p;
    this.d = data.d;
    this.h = data.h;
    this.slug = data.slug;
    this.summary = data.summary;
    this.keywords = data.keywords;
    this.platform = data.platform;
    this.category = data.category;
    this.featured = data.featured;
    this.featuredType = data.featuredType;
    this.systemUrl = data.systemUrl;
    this.seo = data.seo;
    this.og = data.og;
    this.twitter = data.twitter;
    this.repository = data.repository;
    this.promotion = data.promotion;
    this.image_metadata = data.image_metadata;
  }

  static async loadProjects(): Promise<Project[]> {
    try {
      const projectsData = await fetchProjectsData();

      if (!projectsData || projectsData.length === 0) {
        console.warn("Projects data is empty or not available.");
        return [];
      }

      return projectsData.map((proj: ProjectData) => new Project(proj));
    } catch (error) {
      console.error("Error loading projects:", error);
      return [];
    }
  }

  formatTitle(): string {
    return this.p.trim() !== "" ? this.p : "Untitled Project";
  }

  formatDescription(): string {
    return this.d.trim() !== "" ? this.d : "No description available.";
  }

  formatLink(): string {
    return this.h.trim() !== "" ? this.h : "#";
  }

  getThumbnailUrl(): string {
    return this.image_metadata?.thumbnail
      ? getProjectImageUrl(this.image_metadata.thumbnail)
      : this.image;
  }
}

export default Project;

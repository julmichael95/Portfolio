export type Category = "Consumer" | "Fintech" | "B2B SaaS" | "Mobile" | "Web3" | "AI";
export type Status   = "Shipped" | "MVP" | "Beta" | "Concept" | "In Progress";
export type Tier     = "featured" | "experiment" | "concept";

/**
 * variant drives aspect ratio and layout in ScreenGallery / DiagramBlock:
 *   "desktop" → 16/10 landscape  (web app, dashboard screenshots)
 *   "mobile"  → 9/19.5 portrait  (Android / iOS screenshots)
 *   "diagram" → natural height, full-width (architecture / flow diagrams)
 *
 * Leave variant unset on hero images — the consumer controls the container.
 *
 * File naming convention:
 *   /public/images/{slug}/hero.png        ← thumbnail + case study hero
 *   /public/images/{slug}/screen-{n}.png  ← numbered screenshots (1-indexed)
 *   /public/images/{slug}/diagram.png     ← optional architecture diagram
 */
export interface ProjectImage {
  src: string;          // Set to "" until the file is ready
  alt: string;
  caption?: string;
  placeholder?: string; // Short label shown in the dot-grid placeholder
  variant?: "desktop" | "mobile" | "diagram";
  /** CSS object-position value — defaults to "center". Use "top" to anchor crop to top of image. */
  objectPosition?: string;
}

export interface AIStage {
  tool: "Gemini" | "Claude Design" | "Claude Code" | "Me";
  did: string;
}

export interface Project {
  slug: string;
  name: string;
  tier: Tier;
  status: Status;
  categories: Category[];
  oneLiner: string;
  hook: string;
  timeframe: string;
  role: string;
  stack: string[];
  link?: { label: string; href: string };

  hero: ProjectImage;
  problem: string[];
  solution: { body: string[]; decisions: string[]; visual?: ProjectImage };
  screens: ProjectImage[];
  ai: { stages: AIStage[]; owned: string };
  outcomes?: { stat?: string; label: string }[];
  lessons: string[];
  next?: string;

  order: number;

  /**
   * workCard — portfolio-facing summary for the /work page.
   * Separate from oneLiner/hook so case study pages are unaffected.
   */
  workCard?: {
    category: string;   // e.g. "Fintech / Wallet MVP"
    description: string; // 2-sentence portfolio summary
  };
}

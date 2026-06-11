import { ProjectMedia } from "@/components/ui/ProjectMedia";
import { MonoLabel } from "@/components/ui/MonoLabel";
import type { ProjectImage } from "@/content/projects/_types";

interface ScreenGalleryProps {
  screens: ProjectImage[];
}

/**
 * ScreenGallery — responsive grid of screenshots with variant-aware aspect ratios.
 *
 * Variants (set per-screen in the project content file):
 *   "mobile"  → 9/19.5 portrait  (Android/iOS screenshots) — 2-up on mobile, 3-up on desktop
 *   "desktop" → 16/10 landscape  (web app, dashboard screenshots) — 1-up mobile, 2-up desktop
 *   (none)    → defaults to "desktop"
 *
 * Grid layout is determined by the first screen's variant.
 * Diagrams (variant: "diagram") belong in DiagramBlock via solution.visual, not here.
 */
export function ScreenGallery({ screens }: ScreenGalleryProps) {
  if (screens.length === 0) return null;

  const leadVariant = screens[0].variant ?? "desktop";
  const isMobile = leadVariant === "mobile";

  const gridClass = isMobile
    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    : screens.length === 1
      ? "md:grid-cols-1"
      : "md:grid-cols-2";

  return (
    <div className={`grid grid-cols-1 ${gridClass} gap-4 md:gap-6`}>
      {screens.map((screen, i) => {
        const variant = screen.variant ?? "desktop";
        const aspectClass = variantAspect(variant);
        const imgSizes = isMobile
          ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          : "(max-width: 768px) 100vw, 50vw";

        return (
          <figure key={i} className="space-y-3">
            <div className={`relative ${aspectClass} rounded-2xl border border-hairline overflow-hidden bg-surface`}>
              <ProjectMedia image={screen} sizes={imgSizes} />
            </div>

            {(screen.caption || screen.alt) && (
              <figcaption className="flex items-start gap-2">
                <MonoLabel className="shrink-0 mt-0.5 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </MonoLabel>
                <span className="text-[0.85rem] text-ink-3 leading-snug">
                  {screen.caption ?? screen.alt}
                </span>
              </figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
}

function variantAspect(variant: "desktop" | "mobile" | "diagram"): string {
  switch (variant) {
    case "mobile":  return "aspect-[9/19.5]";
    case "diagram": return "aspect-[16/7]";
    default:        return "aspect-[16/10]";
  }
}

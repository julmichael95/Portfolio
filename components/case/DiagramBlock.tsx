import { ProjectMedia } from "@/components/ui/ProjectMedia";
import { MonoLabel } from "@/components/ui/MonoLabel";
import type { ProjectImage } from "@/content/projects/_types";

interface DiagramBlockProps {
  diagram: ProjectImage;
}

/**
 * DiagramBlock — full-width architecture / workflow diagram with caption.
 * Renders at natural image height (intrinsic mode) so tall diagrams aren't cropped.
 * Falls back to a landscape placeholder when src is empty.
 *
 * To add a diagram:
 *   1. Drop the file at /public/images/{slug}/diagram.png (or .svg / .webp)
 *   2. Set src: "/images/{slug}/diagram.png" in the project content file
 */
export function DiagramBlock({ diagram }: DiagramBlockProps) {
  return (
    <figure className="space-y-4">
      {/* Image — intrinsic height, rounded border, with placeholder fallback */}
      <div className="relative rounded-2xl border border-hairline overflow-hidden bg-surface-2">
        {diagram.src ? (
          <ProjectMedia
            image={diagram}
            intrinsic
            sizes="(max-width: 768px) 100vw, 860px"
            className="rounded-2xl"
          />
        ) : (
          /* Placeholder: landscape aspect when no image yet */
          <div className="aspect-[16/7] flex items-center justify-center bg-surface-2"
               style={{
                 backgroundImage:
                   "radial-gradient(circle, var(--color-hairline) 1px, transparent 1px)",
                 backgroundSize: "20px 20px",
               }}
          >
            <span className="px-3 py-1.5 bg-bg/90 backdrop-blur-sm text-ink-3 rounded border border-hairline text-[0.72rem] font-mono uppercase tracking-[0.06em]">
              {diagram.placeholder ?? "Diagram — coming soon"}
            </span>
          </div>
        )}
      </div>

      {/* Caption */}
      {diagram.caption && (
        <figcaption className="flex items-start gap-2">
          <MonoLabel className="shrink-0 mt-0.5">↳</MonoLabel>
          <span className="text-[0.875rem] text-ink-3 leading-snug max-w-[64ch]">
            {diagram.caption}
          </span>
        </figcaption>
      )}
    </figure>
  );
}

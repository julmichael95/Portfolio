import { ProjectMedia } from "@/components/ui/ProjectMedia";
import type { Project } from "@/content/projects/_types";

interface ThumbnailProps {
  project: Project;
  priority?: boolean;
  showCaption?: boolean;
}

export function Thumbnail({ project, priority = false, showCaption = true }: ThumbnailProps) {
  return (
    <div className="group">
      {/* Frame */}
      <div className="relative aspect-[4/3] rounded-2xl border border-hairline overflow-hidden bg-surface transition-all duration-300 ease-[cubic-bezier(.2,.7,.3,1)] group-hover:-translate-y-1.5 group-hover:shadow-[0_8px_28px_-6px_oklch(0_0_0/0.10)]">
        {/* Status badge — top left */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.62rem] font-mono uppercase tracking-[0.07em] bg-bg/85 backdrop-blur-sm border border-hairline/60 text-ink-3">
            <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
            {project.status}
          </span>
        </div>

        <ProjectMedia
          image={project.hero}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
        />
      </div>

      {/* Caption */}
      {showCaption && (
        <div className="mt-4 space-y-0.5">
          <div className="flex items-baseline justify-between gap-3">
            <span
              className="text-[1rem] text-ink tracking-[-0.01em] leading-snug"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {project.name}
            </span>
            <span className="text-[0.67rem] font-mono uppercase tracking-[0.07em] text-ink-3 shrink-0">
              {project.categories[0]}
            </span>
          </div>
          {/* oneLiner as subtitle */}
          <p className="text-[0.85rem] text-ink-3 leading-snug line-clamp-1">
            {project.oneLiner}
          </p>
        </div>
      )}
    </div>
  );
}

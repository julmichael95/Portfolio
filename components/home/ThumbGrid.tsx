import Link from "next/link";
import { Thumbnail } from "@/components/project/Thumbnail";
import { MonoLabel } from "@/components/ui/MonoLabel";
import type { Project } from "@/content/projects/_types";

interface ThumbGridProps {
  projects: Project[];
}

export function ThumbGrid({ projects }: ThumbGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
      {projects.map((project) => (
        <Link
          key={project.slug}
          href={`/work/${project.slug}`}
          className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 rounded-2xl"
          aria-label={`View ${project.name} case study`}
        >
          <Thumbnail project={project} showCaption />

          {/* Hook — desktop only */}
          <p className="hidden md:block mt-3 text-[0.875rem] text-ink-3 leading-relaxed line-clamp-2 max-w-[44ch]">
            {project.hook}
          </p>

          {/* Meta */}
          <div className="mt-3 flex items-center gap-2.5">
            <MonoLabel>{project.timeframe}</MonoLabel>
            <span className="text-hairline-2 select-none text-[0.65rem]">·</span>
            <MonoLabel>{project.stack[0]}</MonoLabel>
          </div>
        </Link>
      ))}
    </div>
  );
}

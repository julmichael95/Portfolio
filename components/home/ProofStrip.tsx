import Link from "next/link";
import { Thumbnail } from "@/components/project/Thumbnail";
import type { Project } from "@/content/projects/_types";

interface ProofStripProps {
  projects: Project[];
}

export function ProofStrip({ projects }: ProofStripProps) {
  return (
    <div className="mt-16 -mx-6 px-6 overflow-x-auto scrollbar-none">
      <div className="flex gap-4 min-w-max md:min-w-0 md:grid md:grid-cols-3 md:gap-6">
        {projects.map((project, i) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            className="block w-64 md:w-auto flex-shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 rounded-2xl"
            aria-label={`View ${project.name} case study`}
          >
            <Thumbnail project={project} priority={i === 0} />
          </Link>
        ))}
      </div>
    </div>
  );
}

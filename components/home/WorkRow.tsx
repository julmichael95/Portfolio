import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { Heading } from "@/components/ui/Display";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { ProjectMedia } from "@/components/ui/ProjectMedia";
import type { Project } from "@/content/projects/_types";

interface WorkRowProps {
  project: Project;
  flip?: boolean;
  index: number;
}

export function WorkRow({ project, flip = false, index }: WorkRowProps) {
  return (
    <div className="flex flex-col md:grid md:grid-cols-2 md:gap-14 items-center gap-10 py-16 border-t border-hairline first:border-t-0">

      {/* ── Visual ─────────────────────────────────────────────────────── */}
      <div className={`w-full ${flip ? "md:order-2" : "md:order-1"}`}>
        <Link
          href={`/work/${project.slug}`}
          className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 rounded-2xl"
          aria-label={`View ${project.name} case study`}
        >
          {/* Project index number — top-left of image */}
          <div className="relative aspect-[4/3] rounded-2xl border border-hairline overflow-hidden bg-surface transition-all duration-300 ease-[cubic-bezier(.2,.7,.3,1)] group-hover:-translate-y-1.5 group-hover:shadow-[0_12px_40px_-8px_oklch(0_0_0/0.12)]">
            <span className="absolute top-4 left-4 z-10 tabular-nums text-[0.65rem] font-mono uppercase tracking-[0.08em] text-ink-3 select-none">
              {String(index).padStart(2, "0")}
            </span>

            <ProjectMedia
              image={project.hero}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </Link>
      </div>

      {/* ── Text ───────────────────────────────────────────────────────── */}
      <div className={`w-full flex flex-col justify-center ${flip ? "md:order-1" : "md:order-2"}`}>

        {/* Category chips — not status, kept to 2 max */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {project.categories.slice(0, 2).map((cat) => (
            <Tag key={cat} variant="category">{cat}</Tag>
          ))}
        </div>

        {/* oneLiner — italic serif eyebrow */}
        <p
          className="text-[1rem] text-ink-3 mb-2 leading-snug"
          style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
        >
          {project.oneLiner}
        </p>

        {/* Name — dominant serif heading */}
        <Heading as="h3" size="lg" className="text-ink mb-5">
          {project.name}
        </Heading>

        {/* Hook — the problem/tension statement */}
        <p className="text-ink-2 text-[1rem] leading-relaxed max-w-[48ch] mb-6">
          {project.hook}
        </p>

        {/* Meta bar — timeframe · role */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-hairline">
          <MonoLabel>{project.timeframe}</MonoLabel>
          <span className="text-hairline-2 select-none">·</span>
          <MonoLabel>{project.role}</MonoLabel>
          {/* Status — rightmost, accent-tinted */}
          <span className="ml-auto inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            <MonoLabel accent>{project.status}</MonoLabel>
          </span>
        </div>

        {/* CTA */}
        <Link
          href={`/work/${project.slug}`}
          className="group/cta self-start inline-flex items-center gap-3 px-5 py-3 rounded-[10px] border border-hairline text-[0.875rem] font-semibold text-ink hover:border-ink hover:bg-surface transition-all duration-200 ease-[cubic-bezier(.2,.7,.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          View case study
          <span className="transition-transform duration-300 group-hover/cta:translate-x-0.5">→</span>
        </Link>
      </div>
    </div>
  );
}

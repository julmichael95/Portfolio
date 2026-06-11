import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { ProjectMedia } from "@/components/ui/ProjectMedia";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import type { Project } from "@/content/projects/_types";

interface CaseHeroProps {
  project: Project;
}

export function CaseHero({ project }: CaseHeroProps) {
  return (
    <div className="border-b border-hairline">
      {/* Text header */}
      <Container>
        <div className="pt-16 pb-12 md:pt-20 md:pb-16">
          {/* Breadcrumb — use Link for client-side navigation */}
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 mb-8 list-none">
              <li>
                <Link
                  href="/work"
                  className="text-[0.72rem] font-mono uppercase tracking-[0.08em] text-ink-3 hover:text-ink transition-colors"
                >
                  Work
                </Link>
              </li>
              <li aria-hidden="true">
                <span className="text-ink-3 text-[0.72rem]">/</span>
              </li>
              <li aria-current="page">
                <MonoLabel>{project.name}</MonoLabel>
              </li>
            </ol>
          </nav>

          {/* Category + status row */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {project.categories.map((cat) => (
              <Tag key={cat} variant="category">{cat}</Tag>
            ))}
            <Tag variant="status">{project.status}</Tag>
          </div>

          {/* Name — page h1 */}
          <h1
            className="font-serif font-normal leading-[1.02] tracking-[-0.025em] text-ink mb-4"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
            }}
          >
            {project.name}
          </h1>

          {/* oneLiner */}
          <p className="text-[1.15rem] text-ink-2 max-w-[52ch] mb-8 leading-relaxed">
            {project.oneLiner}
          </p>

          {/* Meta strip */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 mb-8">
            <div>
              <MonoLabel className="block mb-1">Timeframe</MonoLabel>
              <span className="text-[0.9rem] text-ink">{project.timeframe}</span>
            </div>
            <div>
              <MonoLabel className="block mb-1">Role</MonoLabel>
              <span className="text-[0.9rem] text-ink">{project.role}</span>
            </div>
            {project.link && (
              <div className="sm:ml-auto">
                <Button href={project.link.href} variant="ghost" arrow>
                  {project.link.label}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Hero image — full-width within container */}
      <Container className="pb-0">
        <div className="relative aspect-[16/9] rounded-t-2xl border border-b-0 border-hairline overflow-hidden bg-surface">
          <ProjectMedia
            image={project.hero}
            sizes="(max-width: 768px) 100vw, 1080px"
            priority
          />
        </div>
      </Container>
    </div>
  );
}

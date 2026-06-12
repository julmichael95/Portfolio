import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { allProjects, getProjectBySlug, getAdjacentProjects } from "@/content/projects/index";

import { Container } from "@/components/layout/Container";
import { MonoLabel } from "@/components/ui/MonoLabel";

import { CaseHero } from "@/components/case/CaseHero";
import { FactsRail } from "@/components/case/FactsRail";
import { Prose } from "@/components/case/Prose";
import { SolutionBlock } from "@/components/case/SolutionBlock";
import { DiagramBlock } from "@/components/case/DiagramBlock";
import { Schematic } from "@/components/case/Schematic";
import { ScreenGallery } from "@/components/case/ScreenGallery";
import { Lessons } from "@/components/case/Lessons";
import { CaseFooterNav } from "@/components/case/CaseFooterNav";

// ── Static generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: `${project.name} — Julius`,
    description: project.oneLiner,
  };
}

// ── Section heading helper ────────────────────────────────────────────────────
// Uses a real <h2> for proper heading hierarchy (h1 is in CaseHero).
// Visual appearance matches MonoLabel but semantic element is correct for a11y + SEO.

function SectionHead({
  index,
  label,
}: {
  index: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span
        className="text-[0.72rem] font-mono uppercase tracking-[0.08em] text-accent tabular-nums select-none"
        aria-hidden="true"
      >
        {String(index).padStart(2, "0")}
      </span>
      <h2 className="text-[0.72rem] font-mono uppercase tracking-[0.08em] text-ink-3">
        {label}
      </h2>
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function CaseSection({
  index,
  label,
  children,
}: {
  index: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-16 border-t border-hairline" aria-labelledby={`section-${index}`}>
      <SectionHead index={index} label={label} />
      {children}
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(slug);
  const isFeatured = project.tier === "featured";

  return (
    <>
      {/* ── A · Hero ─────────────────────────────────────────────────── */}
      <CaseHero project={project} />

      {/* ── Main body: sticky rail + scrollable content ─────────────── */}
      <Container>
        <div className="md:grid md:grid-cols-[220px_1fr] md:gap-16 py-16">

          {/* ── B · Facts Rail ─────────────────────────────────────── */}
          <FactsRail project={project} />

          {/* ── Content ────────────────────────────────────────────── */}
          <div>

            {/* ── C · Problem ─────────────────────────────────────── */}
            <CaseSection index={1} label="The problem">
              <Prose paragraphs={project.problem} />
            </CaseSection>

            {/* ── D · Solution ────────────────────────────────────── */}
            <CaseSection index={2} label={isFeatured ? "Approach & decisions" : "What I built"}>
              <SolutionBlock
                body={project.solution.body}
                decisions={project.solution.decisions}
              />
              {/* Optional architecture / workflow diagram */}
              {project.solution.visual && (
                <div className="mt-10">
                  <DiagramBlock diagram={project.solution.visual} />
                </div>
              )}
            </CaseSection>

            {/* ── E · Screen gallery ──────────────────────────────── */}
            {project.screens.length > 0 && (
              <CaseSection index={3} label="Walkthrough">
                <ScreenGallery screens={project.screens} />
              </CaseSection>
            )}

            {/* ── F · AI Workflow ─────────────────────────────────── */}
            <CaseSection index={4} label="AI workflow">
              <Schematic
                stages={project.ai.stages}
                owned={project.ai.owned}
                compact={!isFeatured}
              />
            </CaseSection>

            {/* ── H · Lessons ─────────────────────────────────────── */}
            {project.lessons.length > 0 && (
              <CaseSection index={5} label="What I learned">
                <Lessons lessons={project.lessons} />
              </CaseSection>
            )}

            {/* ── I · What's Next (featured only if present) ──────── */}
            {project.next && (
              <CaseSection index={6} label="What's next">
                <Prose paragraphs={[project.next]} />
              </CaseSection>
            )}
          </div>
        </div>
      </Container>

      {/* ── J · Footer nav ───────────────────────────────────────────── */}
      <CaseFooterNav prev={prev} next={next} />
    </>
  );
}

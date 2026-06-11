import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Heading } from "@/components/ui/Display";
import { ProjectMedia } from "@/components/ui/ProjectMedia";
import { Thumbnail } from "@/components/project/Thumbnail";
import type { Project } from "@/content/projects/_types";

import alune from "@/content/projects/alune";
import tovi from "@/content/projects/tovi";
import anse from "@/content/projects/anse";
import chess from "@/content/projects/chess";
import sudoku from "@/content/projects/sudoku";

export const metadata: Metadata = {
  title: "Work — Julius Michael",
  description:
    "Selected projects by Julius Michael — consumer apps, fintech, B2B SaaS, and Android development. Shipped solo from problem to product.",
};

const featured = [alune, tovi, anse];
const supporting = [chess, sudoku];

// ── Featured project row ───────────────────────────────────────────────────
function FeaturedRow({
  project,
  flip,
  index,
}: {
  project: Project;
  flip: boolean;
  index: number;
}) {
  const card = project.workCard;

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 md:gap-14 items-center gap-10 py-16 border-t border-hairline first:border-t-0">

      {/* Image side */}
      <div className={`w-full ${flip ? "md:order-2" : "md:order-1"}`}>
        <Link
          href={`/work/${project.slug}`}
          className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 rounded-2xl"
          aria-label={`View ${project.name} case study`}
        >
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

      {/* Text side */}
      <div className={`w-full flex flex-col justify-center ${flip ? "md:order-1" : "md:order-2"}`}>

        {/* Category — mono label, not chip */}
        <MonoLabel className="block mb-5">
          {card?.category ?? project.categories.join(" · ")}
        </MonoLabel>

        {/* Name */}
        <Heading as="h3" size="lg" className="text-ink mb-5">
          {project.name}
        </Heading>

        {/* Description — workCard copy, falling back to hook */}
        <p className="text-ink-2 text-[1rem] leading-relaxed max-w-[46ch] mb-6">
          {card?.description ?? project.hook}
        </p>

        {/* Meta bar */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-hairline">
          <MonoLabel>{project.timeframe}</MonoLabel>
          <span className="text-hairline-2 select-none">·</span>
          <MonoLabel>{project.role}</MonoLabel>
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
          {card?.cta ?? "View project"}
          <span className="transition-transform duration-300 group-hover/cta:translate-x-0.5">→</span>
        </Link>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function WorkPage() {
  return (
    <>
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="pt-20 pb-16 md:pt-24 md:pb-20 border-b border-hairline">
        <Container>
          <MonoLabel className="block mb-6">Selected work</MonoLabel>
          <h1
            className="font-serif font-normal leading-[1.02] tracking-[-0.025em] text-ink mb-6"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
            }}
          >
            Products built from the<br className="hidden sm:block" /> ground up.
          </h1>
          <p className="text-[1.05rem] text-ink-2 max-w-[50ch] leading-relaxed mb-10">
            Five projects across consumer, fintech, B2B SaaS, and Android —
            each built solo from problem to shipped product.
          </p>

          {/* Stat strip */}
          <div className="flex flex-wrap gap-x-10 gap-y-4 pt-8 border-t border-hairline">
            {[
              { label: "Projects",  value: "5" },
              { label: "Shipped",   value: "4" },
              { label: "Platforms", value: "Web · Android" },
              { label: "Role",      value: "Solo" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-[1.3rem] font-semibold text-ink tracking-[-0.02em] leading-none mb-1">
                  {stat.value}
                </p>
                <MonoLabel>{stat.label}</MonoLabel>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ── Featured work ────────────────────────────────────────────────── */}
      <section className="py-20 md:py-24 border-b border-hairline">
        <Container>
          <div className="flex items-baseline justify-between gap-6 mb-2">
            <MonoLabel className="block">Featured work</MonoLabel>
            <MonoLabel className="shrink-0">3 projects</MonoLabel>
          </div>

          {featured.map((project, i) => (
            <FeaturedRow
              key={project.slug}
              project={project}
              flip={i % 2 === 1}
              index={i + 1}
            />
          ))}
        </Container>
      </section>

      {/* ── Supporting work ──────────────────────────────────────────────── */}
      <section className="py-20 md:py-24 border-b border-hairline">
        <Container>
          <div className="flex items-baseline justify-between gap-6 mb-12">
            <div>
              <MonoLabel className="block mb-2">More projects</MonoLabel>
              <p className="text-[0.875rem] text-ink-3 leading-relaxed max-w-[48ch]">
                Tighter scope, shorter timelines, clear technical intent.
              </p>
            </div>
            <MonoLabel className="shrink-0">2 projects</MonoLabel>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
            {supporting.map((project) => {
              const card = project.workCard;
              return (
                <Link
                  key={project.slug}
                  href={`/work/${project.slug}`}
                  className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 rounded-2xl"
                  aria-label={`View ${project.name} case study`}
                >
                  {/* Image — reuse Thumbnail frame but skip its caption */}
                  <Thumbnail project={project} showCaption={false} />

                  {/* Custom caption */}
                  <div className="mt-4">
                    <div className="flex items-baseline justify-between gap-3 mb-1.5">
                      <span
                        className="text-[1rem] text-ink tracking-[-0.01em] leading-snug"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {project.name}
                      </span>
                      <MonoLabel className="shrink-0">
                        {card?.category ?? project.categories[0]}
                      </MonoLabel>
                    </div>
                    <p className="text-[0.875rem] text-ink-3 leading-relaxed max-w-[44ch]">
                      {card?.description ?? project.oneLiner}
                    </p>
                  </div>

                  {/* Meta + CTA row */}
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <MonoLabel>{project.timeframe}</MonoLabel>
                      <span className="text-hairline-2 select-none text-[0.65rem]">·</span>
                      <MonoLabel>{project.stack[0]}</MonoLabel>
                    </div>
                    <span className="text-[0.8rem] font-semibold text-ink-3 group-hover:text-accent transition-colors duration-200 inline-flex items-center gap-1.5 shrink-0">
                      {card?.cta ?? "View project"}
                      <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Expanding note + CTA ─────────────────────────────────────────── */}
      <section className="py-20 md:py-24">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-10">
            <div className="max-w-[48ch]">
              <MonoLabel className="block mb-4">Always expanding</MonoLabel>
              <p className="text-[1rem] text-ink-2 leading-relaxed">
                Each project has a live case study covering architecture
                decisions, AI prompting strategy, and what I'd do differently.
                Depth is being added over time.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 px-5 py-3 rounded-[10px] border border-hairline text-[0.875rem] font-semibold text-ink hover:border-ink hover:bg-surface transition-all duration-200 ease-[cubic-bezier(.2,.7,.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Get in touch
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

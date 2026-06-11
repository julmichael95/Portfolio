import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { WorkRow } from "@/components/home/WorkRow";
import { Thumbnail } from "@/components/project/Thumbnail";

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

export default function WorkPage() {
  return (
    <>
      {/* ── Page header ───────────────────────────────────────────────────── */}
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
            Five shipped projects across consumer, fintech, B2B SaaS, and
            Android. Each built solo — product, design, and code — using a
            disciplined process and AI as an accelerator.
          </p>

          {/* Stat strip */}
          <div className="flex flex-wrap gap-x-10 gap-y-4 pt-8 border-t border-hairline">
            {[
              { label: "Projects",    value: "5" },
              { label: "Shipped",     value: "4" },
              { label: "Platforms",   value: "Web · Android" },
              { label: "Role",        value: "Solo" },
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

      {/* ── Featured work ─────────────────────────────────────────────────── */}
      <section className="py-20 md:py-24 border-b border-hairline">
        <Container>
          <div className="flex items-baseline justify-between gap-6 mb-2">
            <MonoLabel className="block">Featured work</MonoLabel>
            <MonoLabel className="shrink-0">3 projects</MonoLabel>
          </div>

          {/* WorkRow already renders its own border-t per row, first:border-t-0 */}
          {featured.map((project, i) => (
            <WorkRow
              key={project.slug}
              project={project}
              flip={i % 2 === 1}
              index={i + 1}
            />
          ))}
        </Container>
      </section>

      {/* ── Supporting work ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-24 border-b border-hairline">
        <Container>
          <div className="flex items-baseline justify-between gap-6 mb-12">
            <div>
              <MonoLabel className="block mb-2">More projects</MonoLabel>
              <p className="text-[0.875rem] text-ink-3 leading-relaxed max-w-[48ch]">
                Focused builds — tighter scope, shorter timelines, specific
                technical goals.
              </p>
            </div>
            <MonoLabel className="shrink-0">2 projects</MonoLabel>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
            {supporting.map((project) => (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 rounded-2xl"
                aria-label={`View ${project.name} case study`}
              >
                <Thumbnail project={project} showCaption />

                {/* Hook */}
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
        </Container>
      </section>

      {/* ── Expanding note + CTA ──────────────────────────────────────────── */}
      <section className="py-20 md:py-24">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-10">
            <div className="max-w-[48ch]">
              <MonoLabel className="block mb-4">Always expanding</MonoLabel>
              <p className="text-[1rem] text-ink-2 leading-relaxed">
                Deeper case studies — architecture decisions, AI prompting
                strategy, and what I'd change — are being written for each
                project. Each case study page is already live.
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

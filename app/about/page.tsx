import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About — Julius Michael",
  description:
    "Software developer and product builder. I build complete products across fintech, consumer AI, B2B SaaS, and Android — solo, from problem to shipped app.",
};

// ── Reusable section wrapper (matches /process page pattern) ──────────────────
function PageSection({
  label,
  children,
  className = "",
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`border-t border-hairline py-20 md:py-24 ${className}`}>
      <Container>
        {label && <MonoLabel className="block mb-10">{label}</MonoLabel>}
        {children}
      </Container>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <>
      {/* ── A · Page header ───────────────────────────────────────────────── */}
      <div className="pt-20 pb-16 md:pt-24 md:pb-20 border-b border-hairline">
        <Container>
          <MonoLabel className="block mb-6">About</MonoLabel>
          <h1
            className="font-serif font-normal leading-[1.02] tracking-[-0.025em] text-ink mb-6"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
            }}
          >
            Software developer.<br className="hidden sm:block" /> Product builder.
          </h1>
          <p className="text-[1.1rem] text-ink-2 max-w-[52ch] leading-relaxed">
            I started with the ideas, not the code. Now I build both — products
            across fintech, consumer AI, B2B SaaS, and Android, shipped solo
            from first principles to working app.
          </p>
        </Container>
      </div>

      {/* ── B · Portrait + bio ────────────────────────────────────────────── */}
      <PageSection label="Background">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">

          {/* Portrait */}
          <div className="aspect-square rounded-2xl border border-hairline overflow-hidden bg-surface">
            <Image
              src="/images/portrait3.png"
              alt="Julius Michael — cartoon portrait"
              width={800}
              height={800}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col justify-center">
            <h2
              className="font-serif font-medium text-ink leading-snug tracking-[-0.02em] mb-7"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
              }}
            >
              The builder behind the work.
            </h2>

            <div className="space-y-5 max-w-[52ch]">
              <p className="text-[1rem] text-ink-2 leading-relaxed">
                I started as a business person, not a developer. I had a list
                of product ideas going back to high school — things I genuinely
                wanted to exist in the world — but no way to build them. Finding
                reliable developers was hard. Getting them to care about the
                product the way I did was harder.
              </p>
              <p className="text-[1rem] text-ink-2 leading-relaxed">
                That changed when I started building with Claude. For the first
                time, the bottleneck wasn't someone else's availability or
                priorities — it was my own thinking. I learned to code not as
                an end in itself, but because it was the only way to actually
                ship the ideas I'd been sitting on.
              </p>
              <p className="text-[1rem] text-ink-2 leading-relaxed">
                Now I build end-to-end: product definition, UX structure,
                architecture, and implementation. Perplexity handles the
                research and brainstorming upfront. Claude and Gemini handle
                the build. The judgment is mine. The speed is the point.
              </p>
            </div>
          </div>
        </div>
      </PageSection>

      {/* ── C · What I build ──────────────────────────────────────────────── */}
      <PageSection label="What I build">
        <div className="max-w-[52ch] mb-12">
          <h2
            className="font-serif font-medium text-ink leading-snug tracking-[-0.02em] mb-3"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
            }}
          >
            Four domains, one discipline.
          </h2>
          <p className="text-[0.95rem] text-ink-3 leading-relaxed">
            Different problem types, but the same standard: a product that
            solves something real and is built well enough to be used.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {[
            {
              domain: "Fintech",
              descriptor:
                "Payments, wallets, and the trust infrastructure that makes money movement feel simple. The hard part is rarely the transaction — it's the UX around it.",
              project: "Tovi",
              slug: "tovi",
            },
            {
              domain: "Consumer AI",
              descriptor:
                "Everyday tools where AI handles the friction the user would otherwise skip. The product only works if the AI step is invisible and the output is immediately useful.",
              project: "Alune",
              slug: "alune",
            },
            {
              domain: "B2B SaaS",
              descriptor:
                "Operational workflows and the information structure that makes them usable. The goal is a product that reduces cognitive load for people with too much to track.",
              project: "Ansa",
              slug: "ansa",
            },
            {
              domain: "Android / Mobile",
              descriptor:
                "Native apps where execution quality and platform idioms matter. A good mobile product is as much about what it leaves out as what it includes.",
              project: "CheckmateFlow · Sudoku",
              slug: "chess",
            },
          ].map((item) => (
            <Link
              key={item.domain}
              href={`/work/${item.slug}`}
              className="group block p-6 md:p-7 border border-hairline rounded-2xl bg-surface hover:border-ink/30 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <MonoLabel accent>{item.domain}</MonoLabel>
                <span className="text-[0.72rem] font-mono text-ink-3 shrink-0 group-hover:text-accent transition-colors duration-200">
                  {item.project} →
                </span>
              </div>
              <p className="text-[0.9rem] text-ink-2 leading-relaxed">
                {item.descriptor}
              </p>
            </Link>
          ))}
        </div>
      </PageSection>

      {/* ── D · How I work ────────────────────────────────────────────────── */}
      <PageSection label="How I work">
        <div className="md:grid md:grid-cols-[1fr_380px] md:gap-16 items-start">
          <div>
            <h2
              className="font-serif font-medium text-ink leading-snug tracking-[-0.02em] mb-6"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
              }}
            >
              Structured. Solo. Shippable.
            </h2>
            <p className="text-[1rem] text-ink-2 leading-relaxed max-w-[56ch] mb-10">
              Every project follows the same sequence — scope first, then
              structure, then implementation in vertical slices. The process
              exists because AI makes it easy to build fast in the wrong
              direction. Structure is what keeps the speed useful.
            </p>

            {/* Three principles — divider-row style */}
            <div className="border-t border-hairline">
              {[
                {
                  num: "01",
                  title: "Problem before tools",
                  body: "The scope and problem statement are fixed before any implementation begins. AI accelerates a defined problem; it cannot define the problem for you.",
                },
                {
                  num: "02",
                  title: "Vertical before horizontal",
                  body: "One complete user flow — schema to UI to tested — before the next. The product is shippable after every slice, not just at the end.",
                },
                {
                  num: "03",
                  title: "Output is reviewed, not trusted",
                  body: "Every AI-generated code block is read and understood before it ships. Speed comes from generation; quality comes from review.",
                },
              ].map((item) => (
                <div
                  key={item.num}
                  className="grid grid-cols-[2rem_1fr] gap-x-5 gap-y-1 py-6 border-b border-hairline"
                >
                  <MonoLabel accent className="tabular-nums pt-0.5">
                    {item.num}
                  </MonoLabel>
                  <div>
                    <p className="text-[0.925rem] font-semibold text-ink leading-snug mb-1.5">
                      {item.title}
                    </p>
                    <p className="text-[0.875rem] text-ink-3 leading-relaxed max-w-[54ch]">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/process"
              className="group inline-flex items-center gap-2 mt-8 text-[0.9rem] font-semibold text-ink hover:text-accent transition-colors duration-200"
            >
              Full build process
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Tools sidebar — desktop only */}
          <div className="hidden md:block mt-1">
            <div className="border border-hairline rounded-2xl p-6 bg-surface">
              <MonoLabel className="block mb-6">Tools in the workflow</MonoLabel>
              <div className="space-y-5">
                {[
                  {
                    name: "Claude Design",
                    role: "Information architecture, screen mapping, flow design",
                  },
                  {
                    name: "Claude Code",
                    role: "Scaffolding, API routes, test generation, refactoring",
                  },
                  {
                    name: "Perplexity",
                    role: "Research, brainstorming, stress-testing assumptions",
                  },
                ].map((tool) => (
                  <div key={tool.name} className="pb-5 border-b border-hairline last:border-b-0 last:pb-0">
                    <p className="text-[0.8rem] font-semibold text-ink mb-1">
                      {tool.name}
                    </p>
                    <p className="text-[0.8rem] text-ink-3 leading-snug">
                      {tool.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* ── E · Current focus / availability ──────────────────────────────── */}
      <PageSection label="Currently">
        <div className="md:grid md:grid-cols-[1fr_auto] md:gap-16 md:items-end">
          <div className="max-w-[56ch] mb-8 md:mb-0">
            <h2
              className="font-serif font-medium text-ink leading-snug tracking-[-0.02em] mb-5"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
              }}
            >
              Building, and open to the right work.
            </h2>
            <div className="space-y-4 text-[1rem] text-ink-2 leading-relaxed">
              <p>
                I'm actively building new products and expanding the existing
                portfolio. Most of what I ship is self-directed — problem
                selection, scope, design, and execution are all mine.
              </p>
              <p>
                I'm open to select consulting work and early-stage product
                collaborations where I can contribute across the full stack —
                from product definition through to shipped code. I'm not
                looking for full-time employment.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <div className="flex gap-3">
              <Button href="/contact" variant="primary" arrow>
                Get in touch
              </Button>
              <Button href="/work" variant="ghost">
                View work
              </Button>
            </div>
          </div>
        </div>
      </PageSection>

      {/* ── F · Personal note ─────────────────────────────────────────────── */}
      <PageSection>
        <div className="flex gap-5 p-6 md:p-8 bg-surface border border-hairline rounded-2xl max-w-[780px]">
          <span
            className="text-accent text-[1.1rem] shrink-0 mt-0.5 font-mono"
            aria-hidden="true"
          >
            ↳
          </span>
          <div>
            <p className="text-[0.72rem] font-mono uppercase tracking-[0.08em] text-ink-3 mb-3">
              Outside the work
            </p>
            <p className="text-[1rem] text-ink-2 leading-relaxed max-w-[60ch]">
              I'm drawn to problems where the gap between what exists and what
              could exist is obvious but underserved — fintech friction,
              wardrobe visibility, churn that goes undetected until it's too
              late. The common thread isn't the domain; it's the type of
              problem. Clear, solvable, and neglected.
            </p>
          </div>
        </div>
      </PageSection>

      {/* ── G · CTA strip ─────────────────────────────────────────────────── */}
      <section className="border-t border-hairline py-20 md:py-24 border-b border-hairline">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
            <div>
              <MonoLabel className="block mb-3">See what gets built</MonoLabel>
              <h2
                className="font-serif font-medium text-ink leading-snug tracking-[-0.02em]"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
                }}
              >
                Five projects. All shipped solo.
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button href="/work" variant="primary" arrow>
                View projects
              </Button>
              <Button href="/process" variant="ghost">
                Read the process
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

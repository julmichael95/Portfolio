import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Button } from "@/components/ui/Button";
import { processSteps, tools, principles } from "@/content/process";

export const metadata: Metadata = {
  title: "Process — Julius Michael",
  description:
    "A six-step build process applied to every project — from problem statement to shipped product, using Claude and Gemini as disciplined accelerators.",
};

// ── Section wrapper ────────────────────────────────────────────────────────────
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
        {label && (
          <MonoLabel className="block mb-10">{label}</MonoLabel>
        )}
        {children}
      </Container>
    </section>
  );
}

// ── Tool color tokens (mirrors Schematic) ──────────────────────────────────────
const TOOL_CHIP: Record<string, string> = {
  "Claude Design": "bg-accent-soft text-accent-2 border-accent/20",
  "Claude Code":   "bg-accent-soft text-accent-2 border-accent/20",
  "Gemini":        "bg-accent-soft text-accent-2 border-accent/20",
};

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ProcessPage() {
  return (
    <>
      {/* ── A · Page header ───────────────────────────────────────────────── */}
      <div className="pt-20 pb-16 md:pt-24 md:pb-20 border-b border-hairline">
        <Container>
          <MonoLabel className="block mb-6">How I build</MonoLabel>
          <h1
            className="font-serif font-normal leading-[1.02] tracking-[-0.025em] text-ink mb-6"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
            }}
          >
            A disciplined build process.
          </h1>
          <p className="text-[1.1rem] text-ink-2 max-w-[52ch] leading-relaxed mb-10">
            Six steps, applied to every project regardless of scope or tool stack.
            The process exists because AI makes it easy to build fast in the wrong
            direction — structure prevents that.
          </p>

          {/* Quick-scan stat strip */}
          <div className="flex flex-wrap gap-x-10 gap-y-4 pt-8 border-t border-hairline">
            {[
              { label: "Steps",        value: "6" },
              { label: "AI tools",     value: "3" },
              { label: "Projects shipped", value: "5+" },
              { label: "Solo",         value: "Always" },
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

      {/* ── B · The six steps ─────────────────────────────────────────────── */}
      <PageSection label="The workflow">
        <div className="max-w-[52ch] mb-12">
          <h2
            className="font-serif font-medium text-ink leading-snug tracking-[-0.02em] mb-3"
            style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
          >
            Six steps. Always in this order.
          </h2>
          <p className="text-[0.95rem] text-ink-3 leading-relaxed">
            Order matters. Steps 1 and 2 produce the documents that make steps 3–5
            fast. Step 6 is not optional — it is what distinguishes a project from
            a prototype.
          </p>
        </div>

        <div className="border-t border-hairline">
          {processSteps.map((step) => (
            <div
              key={step.num}
              className="grid grid-cols-[2.5rem_1fr] md:grid-cols-[2.5rem_24ch_1fr] gap-x-6 gap-y-2 py-8 border-b border-hairline"
            >
              {/* Number */}
              <MonoLabel accent className="pt-1 tabular-nums">
                {step.num}
              </MonoLabel>

              {/* Title */}
              <div>
                <p className="text-[1rem] font-semibold text-ink leading-snug tracking-[-0.01em] mb-0">
                  {step.title}
                </p>
              </div>

              {/* Body + output — own col on desktop, under title on mobile */}
              <div className="col-start-2 md:col-start-3">
                <p className="text-[0.9rem] text-ink-2 leading-relaxed mb-4 max-w-[62ch]">
                  {step.body}
                </p>
                <span className="inline-flex items-center gap-2 text-[0.72rem] font-mono text-ink-3 border border-hairline rounded-full px-3 py-1">
                  <span className="text-accent" aria-hidden="true">→</span>
                  {step.output}
                </span>
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      {/* ── C · Tool roles ────────────────────────────────────────────────── */}
      <PageSection label="Tool roles">
        <div className="max-w-[52ch] mb-12">
          <h2
            className="font-serif font-medium text-ink leading-snug tracking-[-0.02em] mb-3"
            style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
          >
            Three tools. Distinct jobs.
          </h2>
          <p className="text-[0.95rem] text-ink-3 leading-relaxed">
            Each tool has a defined lane. When a tool is used outside its lane,
            output quality drops and review burden rises. The constraint is intentional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border border-hairline rounded-2xl overflow-hidden">
          {tools.map((tool, i) => (
            <div
              key={tool.name}
              className={`p-6 md:p-8 ${
                i < tools.length - 1
                  ? "border-b md:border-b-0 md:border-r border-hairline"
                  : ""
              }`}
            >
              {/* Tool chip */}
              <span
                className={`inline-block px-2.5 py-0.5 mb-4 rounded border text-[0.72rem] font-mono ${TOOL_CHIP[tool.name]}`}
              >
                {tool.name}
              </span>

              {/* Role */}
              <p className="text-[0.8rem] font-semibold text-ink uppercase tracking-[0.06em] mb-5">
                {tool.role}
              </p>

              {/* Used for */}
              <MonoLabel className="block mb-3">Used for</MonoLabel>
              <ul className="space-y-2 mb-6">
                {tool.usedFor.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-[0.875rem] text-ink-2 leading-snug"
                  >
                    <span className="text-accent shrink-0 mt-px" aria-hidden="true">·</span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Not for */}
              <div className="border-t border-hairline pt-5">
                <MonoLabel className="block mb-2">Not for</MonoLabel>
                <p className="text-[0.82rem] text-ink-3 leading-relaxed italic">
                  {tool.notFor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      {/* ── D · Principles ────────────────────────────────────────────────── */}
      <PageSection label="Principles">
        <div className="max-w-[52ch] mb-12">
          <h2
            className="font-serif font-medium text-ink leading-snug tracking-[-0.02em] mb-3"
            style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
          >
            Rules that hold across every project.
          </h2>
          <p className="text-[0.95rem] text-ink-3 leading-relaxed">
            These are not aspirational. They are constraints — things I have found
            necessary to enforce because the alternative has caused problems.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {principles.map((p, i) => (
            <div
              key={p.title}
              className="p-6 md:p-7 border border-hairline rounded-2xl bg-surface"
            >
              <div className="flex items-start gap-4 mb-4">
                <MonoLabel accent className="tabular-nums shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </MonoLabel>
                <p className="text-[0.95rem] font-semibold text-ink leading-snug tracking-[-0.01em]">
                  {p.title}
                </p>
              </div>
              <p className="text-[0.875rem] text-ink-3 leading-relaxed pl-8">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </PageSection>

      {/* ── E · In practice ───────────────────────────────────────────────── */}
      <PageSection label="In practice">
        <div className="md:grid md:grid-cols-[1fr_340px] md:gap-16 items-start">
          <div>
            <h2
              className="font-serif font-medium text-ink leading-snug tracking-[-0.02em] mb-8"
              style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
            >
              Alune — process applied.
            </h2>

            <div className="space-y-5 max-w-[62ch]">
              <p className="text-[1rem] text-ink-2 leading-relaxed">
                Alune started with one sentence: "People own enough clothes but cannot
                see the combinations." That sentence defined the scope immediately.
                Alune is a visibility problem, not a scarcity problem — which meant
                style advice, shopping recommendations, and social features were
                explicitly deferred before the first screen was designed.
              </p>
              <p className="text-[1rem] text-ink-2 leading-relaxed">
                The UX structure followed directly: a camera-first onboarding flow
                (because the closet is useless unpopulated), a Today screen (because
                the job-to-be-done is "what do I wear today"), and a Plan calendar
                (because outfit planning is the natural extension of outfit history).
                Claude Design produced the screen map and flow before any code was
                written. Gemini validated the classification approach — extracting
                12+ attributes per garment from a photo — before the API was built.
              </p>
              <p className="text-[1rem] text-ink-2 leading-relaxed">
                The build ran as vertical slices: onboarding and classification first,
                the two-stage outfit scoring engine second, the Today dashboard third.
                Each was shippable before the next began. The scoring engine —
                candidate generation, six-dimension ranking, diversity pass — was
                designed and implemented by me; Claude Code scaffolded the Supabase
                schema and API routes. The full product shipped in six weeks.
              </p>
            </div>

            <Link
              href="/work/alune"
              className="group inline-flex items-center gap-2 mt-8 text-[0.9rem] font-semibold text-ink hover:text-accent transition-colors duration-200"
            >
              Read the Alune case study
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Sidebar — key facts from this build */}
          <div className="hidden md:block mt-1">
            <div className="border border-hairline rounded-2xl p-6 space-y-6 bg-surface">
              <MonoLabel className="block">Build facts</MonoLabel>
              {[
                { label: "Timeline",    value: "6 weeks" },
                { label: "Stack",       value: "Next.js · Supabase · Gemini · Claude" },
                { label: "AI tools",    value: "Gemini (vision) · Claude Design · Claude Code" },
                { label: "Slices",      value: "3 vertical — onboarding, scoring engine, dashboard" },
                { label: "Deferred",    value: "Try-on, inspo board, style quiz, social" },
              ].map((f) => (
                <div key={f.label}>
                  <MonoLabel className="block mb-1">{f.label}</MonoLabel>
                  <p className="text-[0.875rem] text-ink-2 leading-snug">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageSection>

      {/* ── F · What I own ────────────────────────────────────────────────── */}
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
              What I own
            </p>
            <p className="text-[1rem] text-ink-2 leading-relaxed italic max-w-[60ch]">
              Every product decision in this process is mine. The problem statement,
              the scope list, the information architecture, the data model, the
              scoring logic — these are not AI outputs reviewed for quality. They are
              judgments made before AI is involved. Claude and Gemini are tools for
              execution speed; the thinking that makes the execution worth doing is
              not delegated.
            </p>
          </div>
        </div>
      </PageSection>

      {/* ── G · CTA ───────────────────────────────────────────────────────── */}
      <PageSection className="border-b border-hairline">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
          <div>
            <MonoLabel className="block mb-3">Built this way, on every project</MonoLabel>
            <h2
              className="font-serif font-medium text-ink leading-snug tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)" }}
            >
              See the work it produces.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button href="/work" variant="primary" arrow>
              View projects
            </Button>
            <Button href="/contact" variant="ghost">
              Get in touch
            </Button>
          </div>
        </div>
      </PageSection>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact — Julius",
  description:
    "Get in touch with Julius — product builder and software developer open to select projects, consulting, and collaborations.",
};

// ── Section wrapper (matches /process and /about pattern) ─────────────────────
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
export default function ContactPage() {
  return (
    <>
      {/* ── A · Page header ───────────────────────────────────────────────── */}
      <div className="pt-20 pb-16 md:pt-24 md:pb-20 border-b border-hairline">
        <Container>
          <MonoLabel className="block mb-6">Contact</MonoLabel>
          <h1
            className="font-serif font-normal leading-[1.02] tracking-[-0.025em] text-ink mb-6"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
            }}
          >
            Get in touch.
          </h1>

          {/* Availability pill */}
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hairline text-[0.72rem] font-mono uppercase tracking-[0.08em] text-ink-2 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-40" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            {site.availability}
          </span>

          <p className="text-[1.1rem] text-ink-2 max-w-[50ch] leading-relaxed">
            I take on a small number of projects and collaborations each year.
            If you're building something worth talking about, reach out directly.
          </p>
        </Container>
      </div>

      {/* ── B · Primary contact block ─────────────────────────────────────── */}
      <PageSection>
        <div className="max-w-[560px]">
          {/* Email — displayed large so it can be copied without clicking */}
          <p className="text-[0.72rem] font-mono uppercase tracking-[0.08em] text-ink-3 mb-4">
            Email
          </p>
          <a
            href={`mailto:${site.email}`}
            className="block font-serif text-ink leading-none tracking-[-0.02em] hover:text-accent transition-colors duration-200 mb-8"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            }}
          >
            {site.email}
          </a>

          {/* Primary CTA */}
          <a
            href={`mailto:${site.email}`}
            className="group inline-flex items-center gap-3 px-6 py-3.5 bg-ink text-bg rounded-[10px] text-[0.9rem] font-semibold hover:bg-ink/85 active:scale-[0.97] shadow-[0_1px_2px_oklch(0_0_0/0.12)] hover:shadow-[0_2px_8px_oklch(0_0_0/0.14)] transition-all duration-200 ease-[cubic-bezier(.2,.7,.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 mb-6"
          >
            Send a note
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </a>

          <p className="text-[0.9rem] text-ink-3 leading-relaxed">
            I read every message and reply to the ones that are a clear fit.
          </p>
        </div>
      </PageSection>

      {/* ── C · What to reach out about ───────────────────────────────────── */}
      <PageSection label="What to reach out about">
        <div className="max-w-[52ch] mb-12">
          <h2
            className="font-serif font-medium text-ink leading-snug tracking-[-0.02em] mb-3"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
            }}
          >
            The right kind of work.
          </h2>
          <p className="text-[0.95rem] text-ink-3 leading-relaxed">
            I'm selective. These are the things worth writing about.
          </p>
        </div>

        <div className="border-t border-hairline">
          {[
            {
              num: "01",
              title: "Early-stage product work",
              body: "You have an idea and need someone who can own the full build — product definition, UX structure, and code — from zero to shipped. No handoffs.",
            },
            {
              num: "02",
              title: "Consulting",
              body: "You need product or technical input on something already in progress. A second opinion on scope, architecture, or direction.",
            },
            {
              num: "03",
              title: "Collaboration",
              body: "You're working on something adjacent to fintech, consumer AI, or mobile and think there's a real overlap worth exploring.",
            },
          ].map((item) => (
            <div
              key={item.num}
              className="grid grid-cols-[2rem_1fr] md:grid-cols-[2rem_22ch_1fr] gap-x-6 gap-y-1.5 py-8 border-b border-hairline"
            >
              <MonoLabel accent className="tabular-nums pt-0.5">
                {item.num}
              </MonoLabel>
              <p className="text-[0.925rem] font-semibold text-ink leading-snug tracking-[-0.01em]">
                {item.title}
              </p>
              <p className="col-start-2 md:col-start-3 text-[0.875rem] text-ink-3 leading-relaxed max-w-[54ch]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </PageSection>

      {/* ── D · Links ─────────────────────────────────────────────────────── */}
      <section className="border-t border-hairline py-20 md:py-24 border-b border-hairline">
        <Container>
          <MonoLabel className="block mb-8">Elsewhere</MonoLabel>
          <div className="flex flex-wrap gap-4">
            {site.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-[10px] border border-hairline text-[0.875rem] font-semibold text-ink hover:border-ink hover:bg-surface transition-all duration-200 ease-[cubic-bezier(.2,.7,.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {social.label}
                <span className="text-ink-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-ink">↗</span>
              </a>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

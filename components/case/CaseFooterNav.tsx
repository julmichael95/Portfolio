import Link from "next/link";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { site } from "@/content/site";
import type { Project } from "@/content/projects/_types";

interface CaseFooterNavProps {
  prev: Project | null;
  next: Project | null;
}

export function CaseFooterNav({ prev, next }: CaseFooterNavProps) {
  return (
    <div className="border-t border-hairline">
      {/* Prev / Next */}
      <div className="grid grid-cols-2 border-b border-hairline">
        {prev ? (
          <Link
            href={`/work/${prev.slug}`}
            className="group flex flex-col gap-2 p-8 border-r border-hairline hover:bg-surface transition-colors duration-200"
          >
            <MonoLabel className="flex items-center gap-1.5">
              <span className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
              Previous
            </MonoLabel>
            <span
              className="text-[1.1rem] text-ink font-serif leading-tight tracking-[-0.015em] group-hover:text-accent transition-colors duration-200"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {prev.name}
            </span>
            <span className="text-[0.85rem] text-ink-3 leading-snug line-clamp-1">
              {prev.oneLiner}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/work/${next.slug}`}
            className="group flex flex-col gap-2 p-8 text-right hover:bg-surface transition-colors duration-200"
          >
            <MonoLabel className="flex items-center justify-end gap-1.5">
              Next
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </MonoLabel>
            <span
              className="text-[1.1rem] text-ink font-serif leading-tight tracking-[-0.015em] group-hover:text-accent transition-colors duration-200"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {next.name}
            </span>
            <span className="text-[0.85rem] text-ink-3 leading-snug line-clamp-1">
              {next.oneLiner}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Contact CTA */}
      <div className="py-16 px-8 text-center">
        <p
          className="font-serif text-[1.4rem] text-ink mb-4 tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Interested in working together?
        </p>
        <a
          href={`mailto:${site.email}`}
          className="group inline-flex items-center gap-2 text-[0.9rem] font-semibold text-accent hover:text-accent-2 transition-colors duration-200"
        >
          {site.email}
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </a>
      </div>
    </div>
  );
}

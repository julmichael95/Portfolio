import Link from "next/link";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Heading } from "@/components/ui/Display";
import { processSteps } from "@/content/process";

export function ProcessTeaser() {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
        <div className="max-w-[44ch]">
          <Heading as="h2" className="mb-3 text-ink">
            A disciplined build process.
          </Heading>
          <p className="text-ink-3 text-[0.95rem] leading-relaxed">
            Six steps. Applied to every project, regardless of scope.
          </p>
        </div>
        <Link
          href="/process"
          className="group inline-flex items-center gap-2 text-[0.85rem] font-semibold text-ink-3 hover:text-accent transition-colors duration-200 shrink-0"
        >
          Full process breakdown
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {/* Step list */}
      <div className="border-t border-hairline">
        {processSteps.map((step) => (
          <div
            key={step.num}
            className="grid grid-cols-[2rem_1fr] md:grid-cols-[2rem_22ch_1fr] gap-x-6 gap-y-1.5 py-6 border-b border-hairline"
          >
            <MonoLabel accent className="pt-0.5 tabular-nums">
              {step.num}
            </MonoLabel>
            <p className="text-[0.925rem] font-semibold text-ink leading-snug tracking-[-0.01em]">
              {step.title}
            </p>
            <p className="col-start-2 md:col-start-3 text-[0.875rem] text-ink-3 leading-relaxed max-w-[60ch]">
              {step.teaser}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

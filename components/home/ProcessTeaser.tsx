import Link from "next/link";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Heading } from "@/components/ui/Display";

const steps = [
  {
    num: "01",
    title: "Define the product boundary",
    body: "Write a one-sentence problem statement and a hard scope limit before touching any tool. Identify the single behaviour the product needs to change. Anything outside that boundary is explicitly deferred — not forgotten, not negotiated away mid-build.",
  },
  {
    num: "02",
    title: "Turn scope into UX structure",
    body: "Use Claude Design to produce an information architecture and component map — screens, flows, states, edge cases — before implementation begins. UX decisions belong in design, not buried in code.",
  },
  {
    num: "03",
    title: "Build in vertical slices",
    body: "Implement one complete user flow at a time: schema → API → UI → tested. The product stays shippable at every point. Integration problems surface early, not at the end.",
  },
  {
    num: "04",
    title: "Use AI for acceleration, not abdication",
    body: "Claude Code and Gemini handle scaffolding and implementation speed. Architecture, data model, and product decisions are mine. AI output is read, understood, and tested before it ships — not treated as ground truth.",
  },
  {
    num: "05",
    title: "Verify against the original problem",
    body: "Each slice is evaluated against the problem statement before moving on. Error states, edge cases, and loading behaviour are first-class concerns. The question is always: does this actually solve what it is supposed to solve?",
  },
  {
    num: "06",
    title: "Package the work honestly",
    body: "Document what was built, what was deferred, and why decisions were made. This produces a project record that is useful for future reference — not a post-hoc justification of whatever shipped.",
  },
];

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
        {steps.map((step, i) => (
          <div
            key={step.num}
            className="grid grid-cols-[2rem_1fr] md:grid-cols-[2rem_22ch_1fr] gap-x-6 gap-y-1.5 py-6 border-b border-hairline group"
          >
            {/* Number */}
            <MonoLabel accent className="pt-0.5 tabular-nums">
              {step.num}
            </MonoLabel>

            {/* Title */}
            <p className="text-[0.925rem] font-semibold text-ink leading-snug tracking-[-0.01em]">
              {step.title}
            </p>

            {/* Body — spans both cols on mobile, own col on desktop */}
            <p className="col-start-2 md:col-start-3 text-[0.875rem] text-ink-3 leading-relaxed max-w-[60ch]">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Heading } from "@/components/ui/Display";

const stages = [
  {
    num: "01",
    tool: "Gemini",
    desc: "Research, validation, and first-principles thinking — before a line of code.",
  },
  {
    num: "02",
    tool: "Claude Design",
    desc: "Visual language, component structure, and interaction model.",
  },
  {
    num: "03",
    tool: "Claude Code",
    desc: "Full-stack implementation — from schema to UI to deployment.",
  },
  {
    num: "04",
    tool: "Ship",
    desc: "Real users, real feedback, iterate fast.",
  },
];

export function ProcessTeaser() {
  return (
    <div>
      <div className="max-w-[52ch] mb-12">
        <Heading as="h2" className="mb-4 text-ink">
          One person. One workflow.
          <br />
          Production-grade output.
        </Heading>
        <p className="text-ink-2 leading-relaxed">
          I use an AI-native workflow that collapses the traditional team into a
          single loop — from idea to shipped product without the overhead.
        </p>
      </div>

      {/* Schematic */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-hairline rounded-2xl overflow-hidden">
        {stages.map((stage, i) => (
          <div
            key={stage.num}
            className={`p-6 ${
              i < stages.length - 1
                ? "border-b md:border-b-0 md:border-r border-hairline"
                : ""
            }`}
          >
            <MonoLabel accent className="block mb-3">
              {stage.num}
            </MonoLabel>
            <p
              className="text-[0.9rem] font-semibold text-ink mb-2 font-mono"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {stage.tool}
            </p>
            <p className="text-[0.85rem] text-ink-3 leading-relaxed">{stage.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link
          href="/process"
          className="group inline-flex items-center gap-2 text-[0.9rem] font-semibold text-ink-2 hover:text-accent transition-colors duration-200"
        >
          How I build in detail
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </div>
  );
}

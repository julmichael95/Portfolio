import { MonoLabel } from "@/components/ui/MonoLabel";
import type { AIStage } from "@/content/projects/_types";

interface SchematicProps {
  stages: AIStage[];
  owned: string;
  compact?: boolean;
}

const TOOL_COLORS: Record<AIStage["tool"], string> = {
  Gemini:          "text-accent-2 bg-accent-soft border-accent/20",
  Perplexity:      "text-accent-2 bg-accent-soft border-accent/20",
  "Claude Design": "text-accent-2 bg-accent-soft border-accent/20",
  "Claude Code":   "text-accent-2 bg-accent-soft border-accent/20",
  Claude:          "text-accent-2 bg-accent-soft border-accent/20",
  Me:              "text-ink-2 bg-surface-2 border-hairline",
};

/**
 * Grid column class for a given stage count.
 * Must use static string literals — Tailwind cannot generate classes from template literals.
 */
function gridColsClass(count: number): string {
  // Covers all realistic stage counts (2–4); falls back to 4 for anything larger
  if (count === 2) return "md:grid-cols-2";
  if (count === 3) return "md:grid-cols-3";
  return "md:grid-cols-4";
}

/**
 * Schematic — the AI workflow visualisation.
 * Mobile: vertical stack (1 col).
 * Desktop (md+): horizontal columns divided by hairlines.
 * compact=true reduces padding (used on experiment case studies).
 */
export function Schematic({ stages, owned, compact = false }: SchematicProps) {
  return (
    <div>
      {/* Stage grid */}
      <div className={`grid grid-cols-1 ${gridColsClass(stages.length)} border border-hairline rounded-2xl overflow-hidden`}>
        {stages.map((stage, i) => (
          <div
            key={stage.tool}
            className={`relative ${compact ? "p-5" : "p-6"} ${
              i < stages.length - 1
                ? "border-b md:border-b-0 md:border-r border-hairline"
                : ""
            }`}
          >
            {/* Stage number */}
            <MonoLabel accent className="block mb-3 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </MonoLabel>

            {/* Tool name chip */}
            <span
              className={`inline-block px-2.5 py-0.5 mb-3 rounded border text-[0.72rem] font-mono ${TOOL_COLORS[stage.tool]}`}
            >
              {stage.tool}
            </span>

            {/* What it did */}
            <p className="text-[0.875rem] text-ink-3 leading-relaxed">
              {stage.did}
            </p>

            {/* ↓ connector on mobile — aria-hidden, not on last item */}
            {i < stages.length - 1 && (
              <div
                className="md:hidden absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 text-ink-3 text-xs select-none"
                aria-hidden="true"
              >
                ↓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Human-in-the-loop statement */}
      <div className="mt-6 flex gap-4 p-5 bg-surface rounded-xl border border-hairline">
        <span className="text-accent text-[0.9rem] shrink-0 mt-0.5" aria-hidden="true">↳</span>
        <p className="text-[0.9rem] text-ink-2 leading-relaxed italic">
          {owned}
        </p>
      </div>
    </div>
  );
}

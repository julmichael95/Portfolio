import { MonoLabel } from "@/components/ui/MonoLabel";
import { Prose } from "./Prose";

interface SolutionBlockProps {
  body: string[];
  decisions: string[];
}

/**
 * Solution section — two parts:
 * 1. Body paragraphs (the "what")
 * 2. Key decisions (the "why") — numbered list, reads as a decision log
 */
export function SolutionBlock({ body, decisions }: SolutionBlockProps) {
  return (
    <div className="space-y-10">
      {/* Solution body */}
      <Prose paragraphs={body} />

      {/* Key decisions */}
      {decisions.length > 0 && (
        <div>
          <MonoLabel className="block mb-6">Key decisions</MonoLabel>
          <ol className="space-y-5">
            {decisions.map((decision, i) => (
              <li key={i} className="flex gap-5">
                {/* Number */}
                <span
                  className="text-[0.72rem] font-mono text-accent tabular-nums shrink-0 mt-1 w-5"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* Decision text */}
                <p className="text-[1rem] text-ink-2 leading-relaxed max-w-[60ch]">
                  {decision}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

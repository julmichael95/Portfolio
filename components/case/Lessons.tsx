interface LessonsProps {
  lessons: string[];
}

/**
 * Lessons learned — bulleted list with serif italic numbers.
 * Kept scannable: one insight per item, no nested lists.
 */
export function Lessons({ lessons }: LessonsProps) {
  return (
    <ol className="space-y-6">
      {lessons.map((lesson, i) => (
        <li key={i} className="flex gap-6">
          {/* Serif italic number — decorative, aria-hidden */}
          <span
            className="text-[1.5rem] leading-none text-accent/60 font-serif italic shrink-0 select-none tabular-nums w-6 mt-0.5"
            style={{ fontFamily: "var(--font-serif)" }}
            aria-hidden="true"
          >
            {i + 1}
          </span>
          <p className="text-[1rem] text-ink-2 leading-relaxed max-w-[62ch] pt-0.5">
            {lesson}
          </p>
        </li>
      ))}
    </ol>
  );
}

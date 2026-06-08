interface ProseProps {
  paragraphs: string[];
  className?: string;
}

/**
 * Renders an array of paragraph strings as a readable prose block.
 * Caps line-length for comfortable reading.
 */
export function Prose({ paragraphs, className = "" }: ProseProps) {
  return (
    <div className={`space-y-5 ${className}`}>
      {paragraphs.map((para, i) => (
        <p
          key={i}
          className="text-[1rem] text-ink-2 leading-relaxed max-w-[64ch]"
        >
          {para}
        </p>
      ))}
    </div>
  );
}

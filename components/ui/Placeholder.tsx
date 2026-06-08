interface PlaceholderProps {
  label?: string;
  className?: string;
}

export function Placeholder({ label, className = "" }: PlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center w-full h-full min-h-[200px] bg-surface-2 ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(circle, var(--color-hairline) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {label && (
        <span className="px-3 py-1.5 bg-bg/90 backdrop-blur-sm text-ink-3 rounded border border-hairline text-[0.72rem] font-mono uppercase tracking-[0.06em]">
          {label}
        </span>
      )}
    </div>
  );
}

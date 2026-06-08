interface MonoLabelProps {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}

export function MonoLabel({ children, className = "", accent = false }: MonoLabelProps) {
  return (
    <span
      className={`text-[0.72rem] font-mono uppercase tracking-[0.08em] ${
        accent ? "text-accent" : "text-ink-3"
      } ${className}`}
    >
      {children}
    </span>
  );
}

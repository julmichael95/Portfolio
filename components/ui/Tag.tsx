interface TagProps {
  variant?: "category" | "status";
  children: React.ReactNode;
}

export function Tag({ variant = "category", children }: TagProps) {
  const base =
    "inline-flex items-center px-2.5 py-1 rounded-full text-[0.72rem] font-mono uppercase tracking-[0.07em]";

  const variants = {
    category: "bg-surface text-ink-2 border border-hairline-2",
    status:   "bg-accent-soft text-accent-2 border border-accent/30",
  };

  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
}

import type { Status } from "@/content/projects/_types";

interface StatusPillProps {
  status: Status;
}

export function StatusPill({ status }: StatusPillProps) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-hairline text-[0.72rem] font-mono uppercase tracking-[0.08em] text-ink-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-40" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
      </span>
      {status}
    </span>
  );
}

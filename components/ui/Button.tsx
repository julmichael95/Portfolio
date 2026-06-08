import Link from "next/link";

interface ButtonProps {
  variant?: "primary" | "ghost" | "text";
  href?: string;
  children: React.ReactNode;
  className?: string;
  arrow?: boolean;
  onClick?: () => void;
}

export function Button({
  variant = "primary",
  href,
  children,
  className = "",
  arrow = false,
  onClick,
}: ButtonProps) {
  // Note: rounded is NOT in base — primary/ghost set rounded-[10px], text sets rounded-none.
  // Keeping them in separate variant strings avoids same-specificity conflicts.
  const base =
    "inline-flex items-center gap-2 font-semibold transition-all duration-200 ease-[cubic-bezier(.2,.7,.3,1)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

  const variants = {
    primary:
      "px-5 py-3 bg-ink text-bg rounded-[10px] hover:bg-ink/85 active:scale-[0.97] shadow-[0_1px_2px_oklch(0_0_0/0.12)] hover:shadow-[0_2px_8px_oklch(0_0_0/0.14)]",
    ghost:
      "px-5 py-3 border border-hairline text-ink rounded-[10px] hover:border-ink/40 hover:bg-surface active:scale-[0.97]",
    text: "text-ink-2 hover:text-accent underline-offset-4 hover:underline rounded",
  };

  const inner = (
    <>
      {children}
      {arrow && (
        <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
          →
        </span>
      )}
    </>
  );

  const cls = `group ${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

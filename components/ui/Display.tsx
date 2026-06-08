interface DisplayProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2";
}

export function Display({ children, className = "", as: Tag = "h1" }: DisplayProps) {
  return (
    <Tag
      className={`font-serif font-normal leading-[1.02] tracking-[-0.025em] ${className}`}
      style={{
        fontFamily: "var(--font-serif)",
        fontSize: "clamp(2.6rem, 6.5vw, 5rem)",
      }}
    >
      {children}
    </Tag>
  );
}

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3" | "h4";
  size?: "lg" | "md";
}

export function Heading({ children, className = "", as: Tag = "h2", size = "lg" }: HeadingProps) {
  const sizes = {
    lg: "leading-[1.1] tracking-[-0.02em]",
    md: "text-[1.3rem] font-semibold leading-snug tracking-[-0.015em] font-sans",
  };

  if (size === "md") {
    return (
      <Tag
        className={`${sizes.md} ${className}`}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      className={`font-serif font-medium ${sizes[size]} ${className}`}
      style={{
        fontFamily: "var(--font-serif)",
        fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
      }}
    >
      {children}
    </Tag>
  );
}

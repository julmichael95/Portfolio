import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";
import { Container } from "./Container";

const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-hairline"
      style={{
        background: "color-mix(in oklch, var(--color-bg) 82%, transparent)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <Container>
        <div className="flex items-center justify-between h-[60px]">
          {/* Wordmark */}
          <Link
            href="/"
            className="font-serif text-[1.05rem] tracking-[-0.01em] text-ink hover:text-accent transition-colors duration-200"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Julius
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.875rem] text-ink-3 hover:text-ink transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}

            {/* Contact — visually distinct CTA */}
            <Link
              href="/contact"
              className="ml-1 px-4 py-1.5 rounded-full border border-hairline-2 text-[0.875rem] font-medium text-ink hover:border-ink/40 hover:bg-surface transition-all duration-200"
            >
              Contact
            </Link>

            <ThemeToggle />
          </nav>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}

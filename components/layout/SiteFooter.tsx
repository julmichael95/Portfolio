import Link from "next/link";
import { Container } from "./Container";
import { site } from "@/content/site";

const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline mt-auto">
      <Container>
        {/* Top row — wordmark + nav */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 py-12 md:py-14">
          {/* Brand */}
          <div>
            <p
              className="font-serif text-[1.1rem] tracking-[-0.01em] text-ink mb-2"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Julius
            </p>
            <p className="text-[0.875rem] text-ink-3 max-w-[32ch] leading-relaxed">
              One-person product studio. AI-native workflow.
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3" aria-label="Footer navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.875rem] text-ink-3 hover:text-ink transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom row — copyright + socials */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-t border-hairline">
          {/* suppressHydrationWarning: year is computed at render; safe to let client win */}
          <p className="text-[0.75rem] font-mono text-ink-3 tracking-[0.04em]" suppressHydrationWarning>
            © {new Date().getFullYear()} {site.name}
          </p>
          <div className="flex items-center gap-5">
            {site.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.75rem] font-mono tracking-[0.04em] text-ink-3 hover:text-ink transition-colors duration-200"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

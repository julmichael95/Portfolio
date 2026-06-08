import { site } from "@/content/site";

export function ContactCTA() {
  return (
    <div className="text-center max-w-[600px] mx-auto">
      {/* Availability */}
      <span className="inline-block mb-8 px-3 py-1.5 rounded-full border border-hairline text-[0.72rem] font-mono uppercase tracking-[0.08em] text-ink-3">
        {site.availability}
      </span>

      {/* Heading */}
      <h2
        className="font-serif font-normal leading-[1.05] tracking-[-0.02em] text-ink mb-5"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(2rem, 4vw, 3rem)",
        }}
      >
        Building something that matters?
        <br />
        <em className="italic" style={{ color: "var(--color-accent)" }}>
          Let&apos;s talk.
        </em>
      </h2>

      <p className="text-[1rem] text-ink-3 mb-10 leading-relaxed max-w-[44ch] mx-auto">
        I take on a small number of select projects each year.
        If you have something worth building, reach out.
      </p>

      {/* CTA row */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <a
          href={`mailto:${site.email}`}
          className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-ink text-bg rounded-[10px] text-[0.9rem] font-semibold hover:bg-ink/85 active:scale-[0.97] shadow-[0_1px_2px_oklch(0_0_0/0.12)] hover:shadow-[0_2px_8px_oklch(0_0_0/0.14)] transition-all duration-200"
        >
          Send me a note
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </a>
        <span className="text-[0.875rem] text-ink-3">
          {site.email}
        </span>
      </div>

      {/* Social links */}
      <div className="flex items-center justify-center gap-6">
        {site.socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            className="text-[0.85rem] text-ink-3 hover:text-ink transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            {social.label}
          </a>
        ))}
      </div>
    </div>
  );
}

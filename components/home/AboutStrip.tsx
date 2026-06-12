import Image from "next/image";
import Link from "next/link";
import { Heading } from "@/components/ui/Display";
import { site } from "@/content/site";

export function AboutStrip() {
  return (
    <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
      {/* Portrait */}
      <div className="aspect-square rounded-2xl border border-hairline overflow-hidden bg-surface">
        <Image
          src="/images/portrait.png"
          alt="Julius — cartoon portrait"
          width={800}
          height={800}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      <div>
        <Heading as="h2" className="mb-6 text-ink">
          The builder behind the work.
        </Heading>
        {site.about.map((para, i) => (
          <p key={i} className="text-ink-2 leading-relaxed mb-4 max-w-[48ch]">
            {para}
          </p>
        ))}
        <Link
          href="/about"
          className="group inline-flex items-center gap-2 text-[0.9rem] font-semibold text-ink hover:text-accent transition-colors duration-200 mt-2"
        >
          More about me
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </div>
  );
}

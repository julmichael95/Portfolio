import { Display } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { ProofStrip } from "./ProofStrip";
import { Container } from "@/components/layout/Container";
import type { Project } from "@/content/projects/_types";

interface HeroProps {
  featuredProjects: Project[];
}

export function Hero({ featuredProjects }: HeroProps) {
  return (
    <section className="pt-20 pb-0 overflow-hidden">
      <Container>
        <div className="max-w-[800px]">
          <div className="mb-8">
            <StatusPill status="Shipped" />
          </div>

          <Display className="text-ink mb-6">
            I build{" "}
            <em
              className="not-italic italic"
              style={{ color: "var(--color-accent)", fontFamily: "var(--font-serif)" }}
            >
              complete
            </em>{" "}
            products across AI, fintech &amp; consumer.
          </Display>

          <p className="text-[1.1rem] text-ink-2 max-w-[56ch] mb-10 leading-relaxed">
            A one-person product studio — using Claude, Perplexity, and Gemini
            to go from idea to shipped app in a fraction of the time.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button href="/work" variant="primary" arrow>
              See the work
            </Button>
            <Button href="/contact" variant="ghost">
              Get in touch
            </Button>
          </div>
        </div>
      </Container>

      <Container className="mt-0">
        <ProofStrip projects={featuredProjects} />
      </Container>
    </section>
  );
}

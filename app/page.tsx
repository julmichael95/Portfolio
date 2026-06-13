import { Hero } from "@/components/home/Hero";
import { WorkRow } from "@/components/home/WorkRow";
import { ProcessTeaser } from "@/components/home/ProcessTeaser";
import { ThumbGrid } from "@/components/home/ThumbGrid";
import { AboutStrip } from "@/components/home/AboutStrip";
import { ContactCTA } from "@/components/home/ContactCTA";
import { Section } from "@/components/layout/Section";

import alune from "@/content/projects/alune";
import tovi from "@/content/projects/tovi";
import anse from "@/content/projects/ansa";
import cozycook from "@/content/projects/cozycook";
import sudoku from "@/content/projects/sudoku";
import chess from "@/content/projects/chess";

const featured = [alune, tovi, anse, cozycook];
const experiments = [sudoku, chess];

export default function HomePage() {
  return (
    <>
      {/* 1 · Hero */}
      <Hero featuredProjects={featured} />

      {/* 2 · Selected Work */}
      <Section id="work" index={1} label="Selected Work" hairline className="pt-32">
        <div>
          {featured.map((project, i) => (
            <WorkRow key={project.slug} project={project} flip={i % 2 === 1} index={i + 1} />
          ))}
        </div>
      </Section>

      {/* 3 · How I Build */}
      <Section id="process" index={2} label="How I Build" hairline>
        <ProcessTeaser />
      </Section>

      {/* 4 · Also Built */}
      <Section id="experiments" index={3} label="Also Built" hairline>
        <ThumbGrid projects={experiments} />
      </Section>

      {/* 5 · About */}
      <Section id="about" index={4} label="About" hairline>
        <AboutStrip />
      </Section>

      {/* 6 · Contact */}
      <Section id="contact" index={5} label="Get in Touch" hairline>
        <ContactCTA />
      </Section>
    </>
  );
}

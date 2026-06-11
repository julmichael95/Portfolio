import { MonoLabel } from "@/components/ui/MonoLabel";
import type { Project } from "@/content/projects/_types";

interface FactsRailProps {
  project: Project;
}

/**
 * Sticky sidebar on desktop — renders the quick-glance facts for the project.
 * On mobile, un-sticks and renders as a 2-col label/value grid above the prose.
 */
export function FactsRail({ project }: FactsRailProps) {
  return (
    <aside
      className="md:sticky md:top-24 self-start"
      aria-label="Project details"
    >
      {/* Single column on all screen sizes. */}
      <div className="grid grid-cols-1 gap-y-7 md:gap-y-8 p-6 md:p-0 bg-surface md:bg-transparent rounded-2xl border border-hairline md:border-0 md:rounded-none">

        <Fact label="Role">
          <span className="text-[0.9rem] text-ink leading-snug">{project.role}</span>
        </Fact>

        <Fact label="Timeframe">
          <span className="text-[0.9rem] text-ink">{project.timeframe}</span>
        </Fact>

        <Fact label="Status">
          <span className="inline-flex items-center gap-1.5 text-[0.9rem] text-ink">
            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            {project.status}
          </span>
        </Fact>

        <Fact label="Stack">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="inline-block px-2 py-0.5 bg-surface-2 border border-hairline rounded text-[0.72rem] font-mono text-ink-3"
              >
                {tech}
              </span>
            ))}
          </div>
        </Fact>

        {/* AI tools used — derived from ai.stages */}
        <Fact label="AI tools">
          <div className="flex flex-wrap gap-1.5">
            {project.ai.stages
              .filter((s) => s.tool !== "Me")
              .map((s) => (
                <span
                  key={s.tool}
                  className="inline-block px-2 py-0.5 bg-accent-soft border border-accent/20 rounded text-[0.72rem] font-mono text-accent-2"
                >
                  {s.tool}
                </span>
              ))}
          </div>
        </Fact>

        {project.link && (
          <Fact label="Live">
            <a
              href={project.link.href}
              className="text-[0.9rem] text-accent hover:text-accent-2 transition-colors inline-flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              {project.link.label}
              <span className="text-[0.8rem]">↗</span>
            </a>
          </Fact>
        )}
      </div>
    </aside>
  );
}

function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <MonoLabel className="block mb-2">{label}</MonoLabel>
      {children}
    </div>
  );
}

import { Container } from "./Container";
import { MonoLabel } from "@/components/ui/MonoLabel";

interface SectionProps {
  children: React.ReactNode;
  label?: string;
  index?: number;
  hairline?: boolean;
  className?: string;
  id?: string;
}

export function Section({
  children,
  label,
  index,
  hairline = false,
  className = "",
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`py-24 md:py-32 ${hairline ? "border-t border-hairline" : ""} ${className}`}
    >
      <Container>
        {(label || index !== undefined) && (
          <div className="flex items-center gap-3 mb-12">
            {index !== undefined && (
              <MonoLabel accent className="tabular-nums">
                {String(index).padStart(2, "0")}
              </MonoLabel>
            )}
            {label && <MonoLabel>{label}</MonoLabel>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}

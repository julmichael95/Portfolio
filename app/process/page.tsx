import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Process — Julius Michael",
};

export default function ProcessPage() {
  return (
    <div className="max-w-[1080px] mx-auto px-6 py-32">
      <p className="text-[0.72rem] font-mono uppercase tracking-[0.08em] text-ink-3 mb-4">
        Coming soon
      </p>
      <h1
        className="font-serif text-4xl text-ink"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Process
      </h1>
    </div>
  );
}

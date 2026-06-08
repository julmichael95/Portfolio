import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Julius Michael",
};

export default function AboutPage() {
  return (
    <div className="max-w-[1080px] mx-auto px-6 py-32">
      <p className="text-[0.72rem] font-mono uppercase tracking-[0.08em] text-ink-3 mb-4">
        Coming soon
      </p>
      <h1
        className="font-serif text-4xl text-ink"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        About
      </h1>
    </div>
  );
}

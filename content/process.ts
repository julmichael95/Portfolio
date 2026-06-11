/**
 * process.ts — Single source of truth for Process page content.
 *
 * ProcessTeaser (homepage) uses `teaser` — one tight sentence.
 * The full Process page uses `body` — two to three sentences with more context.
 * Both share `num`, `title`, and `output`.
 */

export interface ProcessStep {
  num: string;
  title: string;
  teaser: string;   // Used in homepage ProcessTeaser
  body: string;     // Used on full /process page
  output: string;   // What the step produces before you move on
}

export const processSteps: ProcessStep[] = [
  {
    num: "01",
    title: "Define the product boundary",
    teaser:
      "Write a one-sentence problem statement and a hard scope limit before touching any tool. Identify the single behaviour the product needs to change. Anything outside that boundary is explicitly deferred.",
    body: "Before any tool is opened, write a one-sentence problem statement and a hard scope list. The problem statement names the user, the behaviour to change, and the context in which it happens. The scope list is explicit: what is in, what is deferred, and what is out of bounds entirely. A product built without a defined boundary will drift mid-build — and AI tools will accelerate that drift, not correct it.",
    output: "Problem statement · hard scope list",
  },
  {
    num: "02",
    title: "Turn scope into UX structure",
    teaser:
      "Use Claude Design to produce an information architecture and component map — screens, flows, states, edge cases — before implementation begins. UX decisions belong in design, not buried in code.",
    body: "The scope document becomes an information architecture. Every screen the product needs is named. Every user flow is traced from entry to completion. Edge cases — empty states, error states, loading states — are listed before a line of code is written. Claude Design is used as a thinking partner for structure: naming things, resolving ambiguous flows, and ensuring nothing is left implicit that should be explicit.",
    output: "Screen map · flow diagram · state inventory",
  },
  {
    num: "03",
    title: "Build in vertical slices",
    teaser:
      "Implement one complete user flow at a time: schema → API → UI → tested. The product stays shippable at every point. Integration problems surface early, not at the end.",
    body: "Each development iteration covers one complete user flow end to end: data model and schema, API layer, UI component, integration test. The product is in a deployable state after every slice. This surfaces integration problems immediately rather than at the end of the build, and means progress is always measurable against something working — not something that will work once everything is assembled.",
    output: "One deployable, tested flow per iteration",
  },
  {
    num: "04",
    title: "Use AI for acceleration, not abdication",
    teaser:
      "Claude Code handles scaffolding and implementation speed. Perplexity handles research and assumption-testing before the build begins. Architecture, data model, and product decisions are mine — AI output is read, understood, and tested before it ships.",
    body: "Claude Code handles scaffolding, boilerplate, and implementation velocity. Perplexity handles research, competitive landscape, and stress-testing assumptions before a line of code is written. Architecture decisions, data models, security-sensitive logic, and anything that requires product judgment are mine — made before AI is involved, not delegated to it. Every AI-generated code block is read and understood before it ships. Speed is the goal; comprehension is the constraint.",
    output: "Reviewed, tested, understood code",
  },
  {
    num: "05",
    title: "Verify against the original problem",
    teaser:
      "Each slice is evaluated against the problem statement before moving on. Error states, edge cases, and loading behaviour are first-class concerns. The question is always: does this actually solve what it is supposed to solve?",
    body: "Before moving to the next slice, the current one is evaluated against the original problem statement — not against the implementation spec. Does this screen do what it is supposed to do? Are error states handled? Is loading behaviour correct? Is the UX structure still making sense in practice? The evaluation is against the problem, not the code. It is easy to build something technically correct that does not actually solve the problem.",
    output: "Pass/fail evaluation per slice before proceeding",
  },
  {
    num: "06",
    title: "Package the work honestly",
    teaser:
      "Document what was built, what was deferred, and why decisions were made. A project record that is useful for future reference — not a post-hoc justification of whatever shipped.",
    body: "When the build is complete, document what was built, what was deferred, and why key decisions were made. This is not retrospective justification — it is a record of the reasoning that existed at the time the decisions were made. It is useful for future reference, honest about the gap between what was scoped and what shipped, and makes the work legible to anyone who picks it up later.",
    output: "Decision log · scope record · deferred list",
  },
];

export interface Tool {
  name: "Claude Design" | "Claude Code" | "Perplexity";
  role: string;
  usedFor: string[];
  notFor: string;
}

export const tools: Tool[] = [
  {
    name: "Claude Design",
    role: "Structure before pixels",
    usedFor: [
      "Information architecture and screen mapping",
      "Component hierarchy and naming conventions",
      "Flow design and edge case enumeration",
      "Interaction model decisions",
    ],
    notFor: "Final brand or visual polish decisions — those require taste, not throughput.",
  },
  {
    name: "Claude Code",
    role: "Implementation velocity",
    usedFor: [
      "Scaffolding and boilerplate generation",
      "API route and schema setup",
      "Test generation and coverage",
      "Refactoring and code review support",
    ],
    notFor: "Architecture design, data model decisions, or security-sensitive logic without careful independent review.",
  },
  {
    name: "Perplexity",
    role: "Research and brainstorming",
    usedFor: [
      "Market and competitive landscape research",
      "Stress-testing problem statements before build",
      "First-principles questioning and assumption validation",
      "Exploring adjacent ideas and edge cases early",
    ],
    notFor: "Product decisions or scope definition — Perplexity surfaces information; judgment about what to do with it is mine.",
  },
];

export interface Principle {
  title: string;
  body: string;
}

export const principles: Principle[] = [
  {
    title: "Scope before tools",
    body: "The scope document exists before any tool is opened. AI accelerates a defined problem; it cannot define the problem for you — and when it tries, the result drifts from what users actually need.",
  },
  {
    title: "Vertical before horizontal",
    body: "One complete flow, fully integrated and tested, before the next begins. Never build all the screens before the API exists for any of them. Horizontal progress is invisible; vertical progress is shippable.",
  },
  {
    title: "Output is reviewed, not trusted",
    body: "Every AI-generated code block is read and understood before it ships. This is not a slow-down — it is the minimum bar for production code. Speed comes from generation; quality comes from review.",
  },
  {
    title: "Deferred is not forgotten",
    body: "Features outside scope are listed explicitly with a reason. The list is honest about the gap between ideal and shipped. Deferral is a product decision; pretending a feature was never considered is not.",
  },
];
